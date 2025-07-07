import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { fileURLToPath } from "url";
import { firebaseStorage } from "../../config/firebaseConfig.js";
import mongoose from "mongoose";
import XLSX from "xlsx";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  getMetadata,
} from "firebase/storage";
import {
  successResponse,
  badRequestResponse,
  serverErrorResponse,
} from "../../helpers/responsesHelper/apiResponsesHelpers.js";
import {
  projectsToHtml,
  certificatesToHtml,
  languagesToHtml,
  educationToHtml,
  experienceToHtml,
  interestsToHtml,
} from "../../helpers/cvCreationHelper/sectionHelpers.js";
import {
  contactToHtml,
  contactToHtml2,
} from "../../helpers/cvCreationHelper/contactHelper.js";
import { renderTemplate } from "../../helpers/cvCreationHelper/renderHelper.js";
import cvSchemaValidation from "../../helpers/validationsHelper/cvCreationValidation.js";
import cvCreatorsModel from "../../models/cvCreatorsModel.js";
import cvTemplatesModel from "../../models/cvTemplatesModel.js";
import usersModel from "../../models/usersModel.js";
import { convertHtmlToPdfBuffer } from "../../helpers/cvCreationHelper/pdfshiftHelper.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const generateCV = async (req, res) => {
  try {
    const {
      name,
      summary,
      education,
      experience,
      skills = [],
      projects,
      languages,
      interests,
      certificates,
      contact,
      imageUrl,
      templateName,
      color,
    } = req.body;

    const { error } = cvSchemaValidation.validate(req.body);
    if (error) {
      console.log("Validation Error:", error.details[0].message);
      return badRequestResponse(res, error.details[0].message);
    }

    const templatePath = path.join(
      __dirname,
      "../../templates",
      `${templateName}.html`
    );

    if (!fs.existsSync(templatePath)) {
      return badRequestResponse(
        res,
        "Template not found. Please provide a valid template name.",
        null
      );
    }

    const template = fs.readFileSync(templatePath, "utf-8");

    const data = {
      name,
      summary,
      education: educationToHtml(education),
      experience: experienceToHtml(experience),
      skills: skills.map((skill) => `<span>${skill}</span>`).join(" "),
      projects: projectsToHtml(projects),
      languages: languagesToHtml(languages),
      interests: interestsToHtml(interests),
      certificates: certificatesToHtml(certificates),
      contact:
        templateName === "template2"
          ? contactToHtml2(contact)
          : contactToHtml(contact),
      imageUrl,
      color,
    };

    const renderedHtml = renderTemplate(template, data);

    // ✅ Convert HTML to PDF using PDFShift
    const pdfBuffer = await convertHtmlToPdfBuffer(renderedHtml);

    const uniqueId = uuidv4();
    const sanitizedName = name.replace(/\s+/g, "_").toLowerCase();
    const fileName = `${sanitizedName}_${uniqueId}_cv.pdf`;

    const firebasePath = `cv-collection/${fileName}`;
    const fileRef = ref(firebaseStorage, firebasePath);

    // Upload to Firebase
    await uploadBytes(fileRef, pdfBuffer, {
      contentType: "application/pdf",
    });

    // Get public URL
    const downloadURL = await getDownloadURL(fileRef);

    // Fetch user
    const user = await usersModel.findById(req.user._id);
    if (!user) {
      return badRequestResponse(res, "User not found", null);
    }

    const templateRecord = await cvTemplatesModel.findOne({
      name: templateName,
    });
    if (!templateRecord) {
      return badRequestResponse(res, "Template not found in database", null);
    }

    const existingRecord = await cvCreatorsModel.findOne({ userId: user._id });

    if (existingRecord) {
      existingRecord.result.push({
        cvTemplate: downloadURL,
        templateId: templateRecord._id,
      });
      await existingRecord.save();
    } else {
      await cvCreatorsModel.create({
        userId: user._id,
        userName: user.name,
        userEmail: user.email,
        result: [
          {
            cvTemplate: downloadURL,
            templateId: templateRecord._id,
          },
        ],
      });
    }

    successResponse(res, "CV generated successfully", {
      downloadUrl: downloadURL,
      fileName: sanitizedName + "_" + uniqueId + "_cv.pdf",
    });
  } catch (error) {
    console.log("Error generating CV:", error);
    serverErrorResponse(res, "Failed to generate CV. Please try again later.");
  }
};

const getOneCvCreator = async (req, res) => {
  try {
    const id = req.params.id;

    if (!id) {
      return notFoundResponse(res, "Id not provided", null);
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return badRequestResponse(res, "Invalid ID format", null);
    }

    const record = await cvCreatorsModel.findById(id);

    if (!record) {
      return notFoundResponse(res, "Record not found in the database", null);
    }

    return successResponse(
      res,
      "CV Creator record fetched successfully",
      record
    );
  } catch (error) {
    console.log("Error Message in Catch BLock:", error.message);
    return serverErrorResponse(
      res,
      "Internal server error. Please try again later."
    );
  }
};

const getAllCvCreators = async (req, res) => {
  try {
    const { pageNumber = 1, pageSize = 5, search = "" } = req.query;

    const filters = search
      ? { userEmail: { $regex: search, $options: "i" } }
      : {};

    const skip = (pageNumber - 1) * pageSize;
    const limit = parseInt(pageSize);

    const getAllRecords = await cvCreatorsModel
      .find(filters)
      .skip(skip)
      .limit(limit);
    const totalRecordsCount = await cvCreatorsModel.countDocuments(filters);

    return successResponse(res, "CV creators fetched successfully.", {
      cvCreators: getAllRecords,
      totalRecordsCount,
      pageNumber: parseInt(pageNumber),
      pageSize: limit,
    });
  } catch (error) {
    console.log("Error Message in Catch BLock:", error.message);
    return serverErrorResponse(
      res,
      "Internal server error. Please try again later."
    );
  }
};

const deleteCvCreator = async (req, res) => {
  try {
    const id = req.params.id;

    if (!id) {
      return notFoundResponse(res, "Id not provided", null);
    }

    console.log("id", id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return badRequestResponse(res, "Invalid ID format", null);
    }

    const record = await cvCreatorsModel.findById(id);

    console.log("record", record);

    if (!record) {
      return notFoundResponse(res, "cv creator record not found", null);
    }

    const deleteRecord = await cvCreatorsModel.findByIdAndDelete(id);

    console.log("deleteRecord", deleteRecord);

    if (!deleteRecord) {
      return serverErrorResponse(
        res,
        "Unable to delete record. Please try again later"
      );
    }

    console.log("deleteRecord", deleteRecord);

    return successResponse(res, "Record deleted successfully", deleteRecord);
  } catch (error) {
    console.log("Error Message in Catch BLock:", error.message);
    return serverErrorResponse(
      res,
      "Internal Server Error. Please try again later"
    );
  }
};

const exportCvCreatorsToExcel = async (req, res) => {
  try {
    const records = await cvCreatorsModel.find({});

    console.log("records", records);

    if (!records.length) {
      return successResponse(res, "No records found to export.", []);
    }

    const recordsData = records.map((user) => ({
      UserName: user.userName || "N/A",
      UserEmail: user.userEmail || "N/A",
    }));

    console.log("recordsData", recordsData);

    const worksheet = XLSX.utils.json_to_sheet(recordsData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Cv Creators");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "binary",
    });
    const buffer = Buffer.from(excelBuffer, "binary");
    console.log("buffer", buffer);
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=CvCreators_List.xlsx"
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    console.log("res", res);

    res.send(buffer);
  } catch (error) {
    console.log("Error exporting records to Excel:", error.message);
    return serverErrorResponse(
      res,
      "Failed to export records to Excel. Please try again later."
    );
  }
};

export {
  generateCV,
  getOneCvCreator,
  getAllCvCreators,
  deleteCvCreator,
  exportCvCreatorsToExcel,
};
