// import fs from "fs";
// import path from "path";
// import puppeteer from "puppeteer";
// import { v4 as uuidv4 } from "uuid";
// import mongoose from "mongoose";
// import XLSX from "xlsx";

// import { firebaseStorage } from "../../config/firebaseConfig.js";
// import {
//   ref,
//   uploadBytes,
//   getDownloadURL,
//   getMetadata,
// } from "firebase/storage";
// import {
//   successResponse,
//   badRequestResponse,
//   notFoundResponse,
//   serverErrorResponse,
// } from "../../helpers/responsesHelper/apiResponsesHelpers.js";

// import {
//   projectsToHtml,
//   certificatesToHtml,
//   languagesToHtml,
//   educationToHtml,
//   experienceToHtml,
//   interestsToHtml,
// } from "../../helpers/cvCreationHelper/sectionHelpers.js";
// import usersModel from "../../models/usersModel.js";

// import {
//   contactToHtml,
//   contactToHtml2,
// } from "../../helpers/cvCreationHelper/contactHelper.js";

// import { renderTemplate } from "../../helpers/cvCreationHelper/renderHelper.js";
// import { fileURLToPath } from "url";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// import cvSchemaValidation from "../../helpers/validationsHelper/cvCreationValidation.js";
// import cvCreatorsModel from "../../models/cvCreatorsModel.js";

// import cvTemplatesModel from "../../models/cvTemplatesModel.js";

// const generateCV = async (req, res) => {
//   try {
//     const {
//       name,
//       summary,
//       education,
//       experience,
//       skills = [],
//       projects,
//       languages,
//       interests,
//       certificates,
//       contact,
//       imageUrl,
//       templateName,
//       color,
//     } = req.body;

//     const { error } = cvSchemaValidation.validate(req.body);
//     if (error) {
//       console.log("Validation Error:", error.details[0].message);
//       return badRequestResponse(res, error.details[0].message);
//     }

//     const templatePath = path.join(
//       __dirname,
//       "../../templates",
//       `${templateName}.html`
//     );

//     console.log(templatePath);
//     if (!fs.existsSync(templatePath)) {
//       return badRequestResponse(
//         res,
//         "Template not found. Please provide a valid template name.",
//         null
//       );
//     }

//     const template = fs.readFileSync(templatePath, "utf-8");

//     const data = {
//       name,
//       summary,
//       education: educationToHtml(education),
//       experience: experienceToHtml(experience),
//       skills: skills.map((skill) => `<span>${skill}</span>`).join(" "),
//       projects: projectsToHtml(projects),
//       languages: languagesToHtml(languages),
//       interests: interestsToHtml(interests),
//       certificates: certificatesToHtml(certificates),
//       contact:
//         templateName === "template2"
//           ? contactToHtml2(contact)
//           : contactToHtml(contact),
//       imageUrl,
//       color,
//     };

//     console.log("Experience data:", experience);


//     const renderedHtml = renderTemplate(template, data);

//     const browser = await puppeteer.launch({ headless: "new" });
//     const page = await browser.newPage();
//     await page.setContent(renderedHtml, { waitUntil: "networkidle0" });

//     const pdfBuffer = await page.pdf({
//       format: "A4",
//       printBackground: true,
//       margin: { top: "0px", right: "0px", bottom: "0px", left: "0px" },
//       quality: 75,
//     });

//     await browser.close();

//     const uniqueId = uuidv4();
//     const sanitizedName = name.replace(/\s+/g, "_").toLowerCase();
//     console.log("sanitizedName: ", sanitizedName);
//     const fileName = `${sanitizedName}_${uniqueId}_cv.pdf`;

//     const firebasePath = `cv-collection/${fileName}`;
//     const fileRef = ref(firebaseStorage, firebasePath);

//     console.log("→ Uploading CV to Firebase at:", firebasePath);

//     // Upload to Firebase
//     await uploadBytes(fileRef, pdfBuffer, {
//       contentType: "application/pdf",
//     });

//     // Optional: check if file exists by getting metadata
//     try {
//       const metadata = await getMetadata(fileRef);
//       console.log("File uploaded successfully. Metadata:", metadata);
//     } catch (metaErr) {
//       console.error("Upload failed. Metadata not found.");
//       return serverErrorResponse(
//         res,
//         "Failed to retrieve file metadata. Please try again later."
//       );
//     }

//     // Get public URL
//     const downloadURL = await getDownloadURL(fileRef);

//     // Fetch user info (assuming you have usersModel imported)
//     const user = await usersModel.findById(req.user._id);
//     if (!user) {
//       return badRequestResponse(res, "User not found", null);
//     }

//     console.log(user);

//     // Get templateId from cvTemplatesModel
//     console.log("Template name: ", templateName);
//     const templateRecord = await cvTemplatesModel.findOne({
//       name: templateName,
//     });
//     if (!templateRecord) {
//       return badRequestResponse(res, "Template not found in database", null);
//     }

//     console.log(templateRecord);

//     // Now store in cvCreatorsModel
//     const cvData = {
//       userId: user._id,
//       userName: user.name,
//       userEmail: user.email,
//       result: [
//         {
//           cvTemplate: downloadURL,
//           templateId: templateRecord._id,
//         },
//       ],
//     };

//     const existingRecord = await cvCreatorsModel.findOne({ userId: user._id });
//     console.log(existingRecord);

//     if (existingRecord) {
//       // Append new CV to existing record
//       existingRecord.result.push({
//         cvTemplate: downloadURL,
//         templateId: templateRecord._id,
//       });
//       await existingRecord.save();
//     } else {
//       // Create new record
//       await cvCreatorsModel.create(cvData);
//     }

//     console.log("CV Creator Data saved successfully.");

//     successResponse(res, "CV generated successfully", {
//       downloadUrl: downloadURL,
//       fileName: fileName,
//     });
//   } catch (error) {
//     console.log("Error generating CV:", error);
//     serverErrorResponse(res, "Failed to generate CV. Please try again later.");
//   }
// };

import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import mongoose from "mongoose";
import XLSX from "xlsx";
import { fileURLToPath } from "url";

import { firebaseStorage } from "../../config/firebaseConfig.js";
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
import usersModel from "../../models/usersModel.js";
import {
  contactToHtml,
  contactToHtml2,
} from "../../helpers/cvCreationHelper/contactHelper.js";
import { renderTemplate } from "../../helpers/cvCreationHelper/renderHelper.js";
import cvSchemaValidation from "../../helpers/validationsHelper/cvCreationValidation.js";
import cvCreatorsModel from "../../models/cvCreatorsModel.js";
import cvTemplatesModel from "../../models/cvTemplatesModel.js";

import chromium from "chrome-aws-lambda";
import puppeteerCore from "puppeteer-core";
import puppeteerLocal from "puppeteer"; // for local

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

    // ✅ Validate
    const { error } = cvSchemaValidation.validate(req.body);
    if (error) {
      console.log("Validation Error:", error.details[0].message);
      return badRequestResponse(res, error.details[0].message);
    }

    // ✅ Template path
    const templatePath = path.join(__dirname, "../../templates", `${templateName}.html`);
    if (!fs.existsSync(templatePath)) {
      return badRequestResponse(res, "Template not found. Please provide a valid template name.");
    }
    const template = fs.readFileSync(templatePath, "utf-8");

    // ✅ Prepare HTML data
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
      contact: templateName === "template2" ? contactToHtml2(contact) : contactToHtml(contact),
      imageUrl,
      color,
    };

    const renderedHtml = renderTemplate(template, data);

    // ✅ Detect local or vercel
    const isLocal = !process.env.VERCEL;
    let browser;

    if (isLocal) {
      console.log("Running locally: using puppeteer");
      browser = await puppeteerLocal.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });
    } else {
      console.log("Running on Vercel: using chrome-aws-lambda");
      browser = await puppeteerCore.launch({
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath,
        headless: chromium.headless,
      });
    }

    const page = await browser.newPage();
    await page.setContent(renderedHtml, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "0px", right: "0px", bottom: "0px", left: "0px" },
    });

    await browser.close();

    // ✅ Upload to Firebase
    const uniqueId = uuidv4();
    const sanitizedName = name.replace(/\s+/g, "_").toLowerCase();
    const fileName = `${sanitizedName}_${uniqueId}_cv.pdf`;
    const firebasePath = `cv-collection/${fileName}`;
    const fileRef = ref(firebaseStorage, firebasePath);

    await uploadBytes(fileRef, pdfBuffer, { contentType: "application/pdf" });
    const metadata = await getMetadata(fileRef);

    if (!metadata) {
      return serverErrorResponse(res, "Failed to upload metadata");
    }

    const downloadURL = await getDownloadURL(fileRef);

    // ✅ Save CV
    const user = await usersModel.findById(req.user._id);
    if (!user) {
      return badRequestResponse(res, "User not found");
    }

    const templateRecord = await cvTemplatesModel.findOne({ name: templateName });
    if (!templateRecord) {
      return badRequestResponse(res, "Template not found in database");
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
      fileName: fileName,
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

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return badRequestResponse(res, "Invalid ID format", null);
    }

    const record = await cvCreatorsModel.findById(id);

    if (!record) {
      return notFoundResponse(res, "cv creator record not found", null);
    }

    const deleteRecord = await cvCreatorsModel.findByIdAndDelete(id);

    if (!deleteRecord) {
      return serverErrorResponse(
        res,
        "Unable to delete record. Please try again later"
      );
    }

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
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=CvCreators_List.xlsx"
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

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
