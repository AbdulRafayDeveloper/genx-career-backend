import fetch from "node-fetch";
import jobs from '../../models/JobsModel.js'; // Import the Job model
import { successResponse, badRequestResponse, serverErrorResponse } from "../../helpers/apiResponses.js";
import pdfParse from "pdf-parse";

const extractTextFromPDF = async (buffer) => {
  try {
    const data = await pdfParse(buffer);
    return data.text; // Extracted text
  } catch (err) {
    throw new Error("Error extracting PDF text: " + err.message);
  }
};
const userCvMatching = async (req, res) => {
    try {
        if (!req.file) {
            return badRequestResponse(res, "No file Uploaded. Kindly upload a file!");
        }

        

        // read cv using pdf parse and store text in content variable

        const wordsArray = content.split(/\s+/);
        const isMoreThan1000 = wordsArray.length > 1000;
        const limitedWords = wordsArray.slice(0, 1500).join(" ");
        const formattedWords = limitedWords
            .replace(/\n/g, "")
            .replace(/[#*\\]/g, "");


    } catch (error) {
        console.error("Error in cv-matching:", error.message);
        return serverErrorResponse(res, "Internal server error. Please try again later");
    }
};

// export { scrapJobs, getOneJob, getAllJobs, deleteJob };
export { userCvMatching };
