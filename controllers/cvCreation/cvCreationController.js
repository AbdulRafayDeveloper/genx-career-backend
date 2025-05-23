import fs from "fs";
import path from "path";
import puppeteer from "puppeteer";
import { v4 as uuidv4 } from "uuid";
import mongoose from "mongoose";
import XLSX from "xlsx";
import cvCreatorsModel from "../../models/cvCreatorsModel.js";

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
import { fileURLToPath } from "url";

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

    const templatePath = path.join(
      __dirname,
      "../../templates",
      `${templateName}.html`
    );

    console.log(templatePath);
    if (!fs.existsSync(templatePath)) {
      return res.status(400).json({ error: "Invalid template name provided." });
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

    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    await page.setContent(renderedHtml, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "0px", right: "0px", bottom: "0px", left: "0px" },
      quality: 75,
    });

    await browser.close();

    const uniqueId = uuidv4();
    const sanitizedName = name.replace(/\s+/g, "_").toLowerCase();
    console.log("sanitizedName: ", sanitizedName);
    const fileName = `${sanitizedName}_${uniqueId}_cv.pdf`;
    const filePath = path.join(__dirname, "../../public", fileName);
    fs.writeFileSync(filePath, pdfBuffer);
    console.log("PDF saved to:", filePath);

    res.json({
      message: "CV generated successfully",
      downloadUrl: `/public/${fileName}`,
    });
  } catch (error) {
    console.log("Error generating CV:", error);
    res.status(500).json({ error: "Failed to generate CV." });
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
