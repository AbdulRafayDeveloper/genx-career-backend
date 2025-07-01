import mongoose from "mongoose";
import CvTemplate from "../../models/cvTemplatesModel.js";
import {
  badRequestResponse,
  notFoundResponse,
  successResponse,
  serverErrorResponse,
} from "../../helpers/responsesHelper/apiResponsesHelpers.js";
import { renameFileWithUuid, retryDeleteFile } from "../../helpers/cvTemplatesHelper/cvTemplateHelper.js";
import { firebaseStorage } from "../../config/firebaseConfig.js";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";

const addCvTemplate = async (req, res) => {
  try {
    console.log("req.body 1: ", req.body);
    const { name } = req.body;
    const image = req.file;

    console.log("image: ", image);
    if (!name || !image) {
      return badRequestResponse(res, "Name and image are required");
    }

    const existingTemplate = await CvTemplate.findOne({ name });

    console.log("existingTemplate: ", existingTemplate);
    if (existingTemplate) {
      // Delete uploaded file from Firebase since we won't use it
      if (req.firebaseFilePath) await retryDeleteFile(req.firebaseFilePath);
      console.log("req.firebaseFilePath: ", req.firebaseFilePath);
      return badRequestResponse(res, "Template with same name already exists");
    }

    const ext = image.originalname.split(".").pop();
    const firebasePath = req.firebaseFilePath || `cvTemplates/${name}.${ext}`;

    console.log("firebasePath: ", firebasePath);
    const fileRef = ref(firebaseStorage, firebasePath);
    const imageUrl = await getDownloadURL(fileRef);

    console.log("imageUrl: ", imageUrl);

    // Save to database
    const newTemplate = new CvTemplate({ name, imageUrl });
    const savedTemplate = await newTemplate.save();

    console.log("savedTemplate: ", savedTemplate);

    if (!savedTemplate) {
      if (req.firebaseFilePath) await retryDeleteFile(req.firebaseFilePath);
      return serverErrorResponse(res, "Failed to save template in the database");
    }

    // Delete uploaded file from Firebase since we won't use it
    console.log("req.firebaseFilePath: ", req.firebaseFilePath);
    return successResponse(res, "Template added successfully", savedTemplate);
  } catch (error) {
    console.error("Error in addCvTemplate:", error.message);

    if (req?.firebaseFilePath) {
      await retryDeleteFile(req.firebaseFilePath);
    }

    return serverErrorResponse(res, "Internal Server Error");
  }
};

const getAllCvTemplates = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";

    const query = {
      name: { $regex: search, $options: "i" },
    };

    const totalRecords = await CvTemplate.countDocuments(query);
    const totalPages = Math.ceil(totalRecords / limit);
    const skip = (page - 1) * limit;
    const records = await CvTemplate.find(query).skip(skip).limit(limit);

    return successResponse(res, "Templates fetched successfully", {
      records,
      pagination: { totalRecords, totalPages, currentPage: page, pageSize: limit },
    });
  } catch (error) {
    console.log("Error in getAllCvTemplates:", error.message);
    return serverErrorResponse(res, "Internal Server Error");
  }
};

const getOneCvTemplate = async (req, res) => {
  try {
    const id = req.params.id;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return badRequestResponse(res, "Invalid ID", null);
    }

    const record = await CvTemplate.findById(id);

    if (!record) {
      return notFoundResponse(res, "Template not found", null);
    }

    return successResponse(res, "Template fetched successfully", record);
  } catch (error) {
    console.log("Error in getOneCvTemplate:", error.message);
    return serverErrorResponse(res, "Internal Server Error");
  }
};

const saveUpdatedCvTemplate = async (req, res) => {
  const id = req.params.id;
  const { name } = req.body;
  const image = req.file;

  const allowedTemplates = ["template1", "template2", "template3"];
  if (!allowedTemplates.includes(name)) {
    return badRequestResponse(res, "Invalid template name. Only 'template1', 'template2', or 'template3' are allowed.", null);
  }

  console.log("req.file: ", req.file);
  console.log("req.body: ", req.body);
  console.log("req.params: ", req.params);

  try {
    // Step 1: Validate name
    if (!name) {
      return badRequestResponse(res, "Name is required", null);
    }

    console.log("name: ", name);

    // Step 2: Validate ID
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return badRequestResponse(res, "Invalid ID", null);
    }

    // Step 3: Find DB record
    const existingRecord = await CvTemplate.findById(id);

    console.log("existingRecord: ", existingRecord);
    if (!existingRecord) {
      return notFoundResponse(res, "Template not found", null);
    }

    // Step 4: If no new image, just update name
    if (!image) {
      existingRecord.name = name;

      // Save to database
      console.log("existingRecord: ", existingRecord);
      await existingRecord.save();
      return successResponse(res, "Template name updated", existingRecord);
    }

    console.log("image: ", image);

    // Step 5: Delete existing file from Firebase
    let oldPath;
    try {
      const url = new URL(existingRecord.imageUrl);
      // path looks like /v0/b/{bucket}/o/{pathEncoded}
      const parts = url.pathname.split("/o/");
      console.log("parts: ", parts);
      oldPath = parts[1].split(/[\?]/)[0];
      oldPath = decodeURIComponent(oldPath);
      console.log("oldPath: ", oldPath);
      await retryDeleteFile(oldPath);
    } catch (e) {
      console.warn("Could not delete old Firebase file:", e.message);
    }

    const ext = image.originalname.includes(".")
      ? "." + image.originalname.split(".").pop()
      : "";

    console.log("ext: ", ext);
    const { newFileName, firebasePath } = renameFileWithUuid(name, image.originalname);


    console.log("newFileName: ", newFileName);
    console.log("firebasePath: ", firebasePath);

    // Step 7: Upload new image buffer to Firebase Storage
    const fileRef = ref(firebaseStorage, firebasePath);
    await uploadBytes(fileRef, image.buffer, { contentType: image.mimetype });

    // Step 8: Get public download URL
    const downloadURL = await getDownloadURL(fileRef);

    console.log("downloadURL: ", downloadURL);

    // Step 9: Update DB record
    existingRecord.name = name;
    existingRecord.imageUrl = downloadURL;
    await existingRecord.save();

    console.log("existingRecord: ", existingRecord);

    return successResponse(res, "Template updated successfully", existingRecord);
  } catch (error) {
    console.error("Error in updateCvTemplate:", error);
    return serverErrorResponse(res, "Internal Server Error", error.message);
  }
};

const deleteCvTemplate = async (req, res) => {
  try {
    const id = req.params.id;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return badRequestResponse(res, "Invalid ID", null);
    }

    const template = await CvTemplate.findById(id);

    if (!template) {
      return notFoundResponse(res, "Template not found", null);
    }

    // Firebase path, assuming template.imageUrl is like `/cvTemplates/filename.png`
    const firebasePath = template.imageUrl.startsWith("/")
      ? template.imageUrl.substring(1)
      : template.imageUrl;

    // Attempt to delete from Firebase Storage
    await retryDeleteFile(firebasePath); // has retry logic inside

    // Delete from DB
    const deletedRecord = await CvTemplate.findByIdAndDelete(id);

    if (!deletedRecord) {
      return serverErrorResponse(res, "Failed to delete record from database");
    }

    return successResponse(res, "Template deleted successfully", deletedRecord);
  } catch (error) {
    console.log("Error in deleteCvTemplate:", error.message);
    return serverErrorResponse(res, "Internal Server Error");
  }
};

export {
  addCvTemplate,
  getAllCvTemplates,
  getOneCvTemplate,
  saveUpdatedCvTemplate,
  deleteCvTemplate,
};