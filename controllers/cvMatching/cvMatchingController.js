import jobs from "../../models/JobsModel.js"; // Import the Job model
import { successResponse, badRequestResponse, serverErrorResponse } from "../../helpers/apiResponses.js";
import pdfParse from "pdf-parse";
import { SummarizerManager } from "node-summarizer"; // Import node-summarizer

// Function to extract text from a PDF file
const extractTextFromPDF = async (buffer) => {
  try {
    const data = await pdfParse(buffer);
    return data.text; // Extracted text
  } catch (err) {
    throw new Error("Error extracting PDF text: " + err.message);
  }
};

// Summarization function
const summarizeText = async (text, maxLength = 1000) => {
  try {
    while (text.split(/\s+/).length > maxLength) {
      const summarizer = new SummarizerManager(text, 5); // Summarize into 5 sentences
      const summary = await summarizer.getSummaryByFrequency();
      text = summary.summary;
    }
    return text;
  } catch (err) {
    throw new Error("Error summarizing text: " + err.message);
  }
};

const userCvMatching = async (req, res) => {
  try {
    // Check if a file is uploaded
    if (!req.file) {
      return badRequestResponse(res, "No file uploaded. Kindly upload a file!");
    }

    // Extract text from the uploaded CV (PDF)
    const content = await extractTextFromPDF(req.file.buffer);

    // Summarize if text is more than 1000 words
    const wordCount = content.split(/\s+/).length;
    let summarizedContent = content;
    if (wordCount > 1000) {
      summarizedContent = await summarizeText(content, 1000);
    }

    // Extract job description using the job ID (assume it's sent in `req.body.jobId`)
    const { jobId } = req.body;
    const job = await jobs.findById(jobId);
    if (!job) {
      return badRequestResponse(res, "Job not found with the provided ID!");
    }
    const jobDescription = job.description; // Assuming the Job model has a `description` field

    // Prepare the response
    const responseData = {
      extractedCvText: summarizedContent,
      jobDescription: jobDescription,
    };

    // Send a success response with the data
    return successResponse(res, responseData, "CV matching process completed successfully.");
  } catch (error) {
    console.error("Error in cv-matching:", error.message);
    return serverErrorResponse(res, "Internal server error. Please try again later.");
  }
};

export { userCvMatching };
