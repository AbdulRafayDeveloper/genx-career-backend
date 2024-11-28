import jobs from "../../models/JobsModel.js";
import { successResponse, badRequestResponse, serverErrorResponse } from "../../helpers/apiResponses.js";
import { analyzeCVAndJobDescription } from "../../helpers/grokIntegration.js";
import pdfParse from "pdf-parse";
import { SummarizerManager } from "node-summarizer";
import Users from "../../models/userModel.js";
import CvMatchers from "../../models/cvMatchersModel.js";

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
        // console.log("before text: ", text);
        // console.log("maxLength", maxLength);

        while (text.split(/\s+/).length > maxLength) {
            const summarizer = new SummarizerManager(text, 5); // Summarize into 5 sentences
            const summary = await summarizer.getSummaryByFrequency();
            text = summary.summary;
        }
        // console.log("after text", text);
        return text;
    } catch (err) {
        throw new Error("Error summarizing text: " + err.message);
    }
};

const userCvMatching = async (req, res) => {
    try {
        const { userId, jobId } = req.body;

        if (!userId) {
            return badRequestResponse(res, "Please Login First to Match your CV", null);
        }

        const user = await Users.findById(userId);

        if (!user) {
            return badRequestResponse(res, "User not found", null);
        }

        if (!req.file) {
            return badRequestResponse(res, "No file uploaded. Kindly upload a file!");
        }

        let cvContent = await extractTextFromPDF(req.file.buffer);
        let cvWordCount = cvContent.split(/\s+/).length;

        if (cvWordCount > 850) {
            cvContent = await summarizeText(content, 850);
            cvWordCount = content.split(/\s+/).length;
        }

        const job = await jobs.findById(jobId);

        if (!job) {
            return badRequestResponse(res, "Job not found with the provided ID!");
        }

        let jobDescription = job.description;
        let jobWordCount = jobDescription.split(/\s+/).length;

        if (jobWordCount > 500) {
            jobDescription = await summarizeText(jobDescription, 500);
            jobWordCount = jobDescription.split(/\s+/).length;
        }

        const result = await analyzeCVAndJobDescription(cvContent, jobDescription);

        // Check if user already exists in cvMatchers
        let cvMatcher = await CvMatchers.findOne({ userId: user._id });

        if (!cvMatcher) {
            // If no existing record, create a new one
            cvMatcher = new CvMatchers({
                userId: user._id,
                userName: user.name,
                userEmail: user.email,
                result: [
                    {
                        cvContext: cvContent,
                        jobId: job._id,
                        matchingOutput: result,
                    },
                ],
            });

            await cvMatcher.save();
        } else {
            // If record exists, push new matching result
            cvMatcher.result.push({
                cvContext: cvContent,
                jobId: job._id,
                matchingOutput: result,
            });

            await cvMatcher.save();
        }

        const responseData = {
            CvTextLength: cvWordCount,
            CvText: cvContent,
            jobDescriptionLength: jobWordCount,
            jobDescription: jobDescription,
            CvMatchingResult: result,
        };

        return successResponse(res, responseData, "CV matching process completed and results saved successfully.");
    } catch (error) {
        console.error("Error in cv-matching:", error.message);
        return serverErrorResponse(res, "Internal server error. Please try again later.");
    }
};

const getOneCvMatcher = async (req, res) => {
    try {
        const id = req.params.id;

        if (!id) {
            return notFoundResponse(res, "Id not provided", null);
        }

        const cvMatcherRecord = await CvMatchers.findById(id);

        if (cvMatcherRecord) {
            return successResponse(res, "Cv Matcher Record fetched successfully", cvMatcherRecord);
        } else {
            return notFoundResponse(res, "Record not found", null);
        }
    } catch (error) {
        return serverErrorResponse(
            res,
            "Internal server error. Please try again later"
        );
    }
};

const getAllCvMatchers = async (req, res) => {
    try {
        const { pageNumber = 1, pageSize = 15, search = '' } = req.query;

        const filters = search ? { userName: { $regex: search, $options: 'i' } } : {};

        const skip = (pageNumber - 1) * pageSize;
        const limit = parseInt(pageSize);
        
        const getAllMatchers = await CvMatchers.find(filters).skip(skip).limit(limit);
        const totalMatchersCount = await CvMatchers.countDocuments(filters);

        return successResponse(res, 'CV matchers fetched successfully.', { matchers: getAllMatchers, totalMatchersCount, pageNumber: parseInt(pageNumber), pageSize: limit, });
    } catch (error) {
        console.error('Error in getAllCvMatchers:', error.message);
        return serverErrorResponse(res, 'Internal server error. Please try again later.');
    }
};

const deleteCvMatcher = async (req, res) => {
    try {
        const id = req.params.id;

        if (!id) {
            return notFoundResponse(res, "Id not provided", null);
        }

        const cvMatcherRecord = await CvMatchers.findById(id);

        if (!cvMatcherRecord) {
            return notFoundResponse(res, "cv matcher record not found", null);
        }

        // Delete the cv matcher
        const cvMatcherDelete = await CvMatchers.findByIdAndDelete(id);

        if (cvMatcherDelete) {
            return successResponse(res, "Cv Matcher deleted successfully", cvMatcherDelete);
        } else {
            return serverErrorResponse(
                res,
                "Unable to delete record. Please try again later"
            );
        }
    } catch (error) {
        return serverErrorResponse(
            res,
            "Internal Server Error. Please try again later"
        );
    }
};

export { userCvMatching, getOneCvMatcher, getAllCvMatchers, deleteCvMatcher };
