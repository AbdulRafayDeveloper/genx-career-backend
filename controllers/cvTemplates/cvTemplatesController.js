import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import CvTemplate from "../../models/cvTemplates.js";
import {
  badRequestResponse,
  notFoundResponse,
  successResponse,
  serverErrorResponse,
} from "../../helpers/apiResponsesHelpers.js";
import { renameFileWithUuid, retryDeleteFile } from "../../helpers/cvTemplatesHelper/cvTemplateHelper.js";

const addCvTemplate = async (req, res) => {
  try {
    const { name } = req.body;
    const image = req.file;

    if (!name || !image) {
      retryDeleteFile(image.path);
      return badRequestResponse(res, "Name and image are required");
    }

    const existingTemplate = await CvTemplate.findOne({ name });
    if (existingTemplate) {
      retryDeleteFile(image.path);
      return badRequestResponse(res, "Template with same name already exists");
    }

    const tempFilePath = image.path;
    const publicDir = "public/cvTemplates";

    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    // Use the helper to rename and move the file
    const { success, newFileName, newFilePath, error } = renameFileWithUuid(tempFilePath, publicDir);

    if (!success) {
      retryDeleteFile(tempFilePath);
      return serverErrorResponse(res, `Failed to rename and move file: ${error}`);
    }

    // Construct the image URL
    const imageUrl = `/cvTemplates/${newFileName}`;

    // Save the template in the database
    const newTemplate = new CvTemplate({ name, imageUrl });
    const savedTemplate = await newTemplate.save();

    retryDeleteFile(tempFilePath); // Always clean up temp file after DB action

    if (!savedTemplate) {
      return serverErrorResponse(res, "Failed to save template in the database");
    }

    return successResponse(res, "Template added successfully", savedTemplate);
  } catch (error) {
    console.log("Error in addCvTemplate:", error.message);
    retryDeleteFile(req?.file?.path);
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

    if (!records.length) {
      return notFoundResponse(res, "No templates found", null);
    }

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

const updateCvTemplate = async (req, res) => {
  const id = req.params.id;
  const { name } = req.body;
  const image = req.file;

  const tempDir = "temp/cvTemplates";
  const publicDir = "public/cvTemplates";

  let tempFilePath = null;

  try {
    // Step 1: Validate name
    if (!name) {
      return badRequestResponse(res, "Name is required", null);
    }

    // Step 2: Validate ID
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return badRequestResponse(res, "Invalid ID", null);
    }

    // Step 3: Find DB record
    const existingRecord = await CvTemplate.findById(id);
    if (!existingRecord) {
      return notFoundResponse(res, "Template not found", null);
    }

    // Step 4: Check if temp file exists
    const originalFileName = image?.originalname;
    tempFilePath = path.join(tempDir, originalFileName);

    if (!fs.existsSync(tempFilePath)) {
      return notFoundResponse(res, "File not found in temp folder", null);
    }

    // Step 5: Delete existing file in publicDir based on DB record
    if (existingRecord.imageUrl) {
      const existingPublicPath = path.join("public", existingRecord.imageUrl);
      if (fs.existsSync(existingPublicPath)) {
        retryDeleteFile(existingPublicPath);
      }
    }

    // Step 6: Use the helper to rename and move the file with a unique name
    const { success, newFileName, newFilePath, error } = renameFileWithUuid(tempFilePath, publicDir);

    if (!success) {
      return serverErrorResponse(res, `Failed to rename and move file: ${error}`);
    }

    // Step 7: Update DB with new path
    existingRecord.imageUrl = `/cvTemplates/${newFileName}`;
    await existingRecord.save();

    return successResponse(res, "Template updated successfully", existingRecord);
  } catch (error) {
    console.log("Error in updateCvTemplate:", error.message);
    retryDeleteFile(req?.file?.path);
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

    const filePath = path.join("public", template.imageUrl);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

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
  updateCvTemplate,
  deleteCvTemplate,
};