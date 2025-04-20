import { successResponse, badRequestResponse, notFoundResponse, serverErrorResponse } from "../../helpers/apiResponsesHelpers.js";
import { analyzeCVAndJobDescription, extractTextFromPDF, summarizeText } from "../../helpers/cvMatchingHelpers.js";
import usersModel from "../../models/usersModel.js";
import jobsModel from "../../models/jobListingsModel.js";
import cvMatchersModel from "../../models/cvMatchersModel.js";
import mongoose from "mongoose";
import XLSX from "xlsx";

const userCvMatching = async (req, res) => {
    try {
        const { userId, jobId } = req.body;

        console.log("userId: ", userId);
        console.log("jobId: ", jobId);

        if (!userId) {
            return badRequestResponse(res, "Please Login First to Match your CV", null);
        }

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return badRequestResponse(res, "Invalid userId format", null);
        }

        if (!jobId) {
            return badRequestResponse(res, "Please Login First to Match your CV", null);
        }

        if (!mongoose.Types.ObjectId.isValid(jobId)) {
            return badRequestResponse(res, "Invalid jobId format", null);
        }

        const user = await usersModel.findById(userId);

        console.log("user: ", user);

        if (!user) {
            return badRequestResponse(res, "This user account not exist in Database", null);
        }

        const job = await jobsModel.findById(jobId);

        console.log("job: ", job);

        if (!job) {
            return badRequestResponse(res, "Job not found with the provided ID!");
        }

        if (!req.file) {
            return badRequestResponse(res, "No file uploaded. Kindly upload a file!");
        }

        console.log("req.file: ", req.file)

        let cvContent = await extractTextFromPDF(req.file.buffer);

        console.log("cvContent: ", cvContent.trim());

        if (!cvContent.trim()) {
            console.log("cvContent 3: ", cvContent.trim());
            return badRequestResponse(res, "The uploaded CV has no readable content.", null);
        }

        console.log("cvContent: cvContent", cvContent);
        let cvWordCount = cvContent.split(/\s+/).length;

        if (cvWordCount > 850) {
            cvContent = await summarizeText(cvContent, 850);
            cvWordCount = cvContent.split(/\s+/).length;
        }

        let jobDescription = job.description;
        let jobWordCount = jobDescription.split(/\s+/).length;

        if (jobWordCount > 500) {
            jobDescription = await summarizeText(jobDescription, 500);
            jobWordCount = jobDescription.split(/\s+/).length;
        }

        console.log("cvContent: cvContent", cvContent);

        let result = await analyzeCVAndJobDescription(cvContent, jobDescription);
        result = result?.replace(/\*/g, "").replace(/\\n/g, " ").replace(/  +/g, " ").replace(/\\/g, "");

        // Check if user already exists in cvMatchers
        let cvMatcher = await cvMatchersModel.findOne({ userId: user._id });

        if (!cvMatcher) {
            // If no existing record, create a new one
            cvMatcher = new cvMatchersModel({
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
        console.log("Error Message in Catch BLock:", error.message);
        return serverErrorResponse(res, "Internal server error. Please try again later.");
    }
};

const getOneCvMatcher = async (req, res) => {
    try {
        const id = req.params.id;

        if (!id) {
            return notFoundResponse(res, "Id not provided", null);
        }

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return badRequestResponse(res, "Invalid ID format", null);
        }

        const cvMatcherRecord = await cvMatchersModel.findById(id);

        if (!cvMatcherRecord) {
            return notFoundResponse(res, "Record not found in the database", null);
        }

        return successResponse(res, "CV Matcher Record fetched successfully", cvMatcherRecord);
    } catch (error) {
        console.log("Error Message in Catch BLock:", error.message);
        return serverErrorResponse(res, "Internal server error. Please try again later.");
    }
};

const getAllCvMatchers = async (req, res) => {
    try {
        const { pageNumber = 1, pageSize = 5, search = '' } = req.query;

        const filters = search ? { userEmail: { $regex: search, $options: 'i' } } : {};

        const skip = (pageNumber - 1) * pageSize;
        const limit = parseInt(pageSize);

        const getAllMatchers = await cvMatchersModel.find(filters).skip(skip).limit(limit);
        const totalMatchersCount = await cvMatchersModel.countDocuments(filters);

        return successResponse(res, 'CV matchers fetched successfully.', { matchers: getAllMatchers, totalMatchersCount, pageNumber: parseInt(pageNumber), pageSize: limit, });
    } catch (error) {
        console.log("Error Message in Catch BLock:", error.message);
        return serverErrorResponse(res, 'Internal server error. Please try again later.');
    }
};

const deleteCvMatcher = async (req, res) => {
    try {
        const id = req.params.id;

        if (!id) {
            return notFoundResponse(res, "Id not provided", null);
        }

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return badRequestResponse(res, "Invalid ID format", null);
        }

        const cvMatcherRecord = await cvMatchersModel.findById(id);

        if (!cvMatcherRecord) {
            return notFoundResponse(res, "cv matcher record not found", null);
        }

        const cvMatcherDelete = await cvMatchersModel.findByIdAndDelete(id);

        if (!cvMatcherDelete) {
            return serverErrorResponse(res, "Unable to delete record. Please try again later");
        }

        return successResponse(res, "Record deleted successfully", cvMatcherDelete);
    } catch (error) {
        console.log("Error Message in Catch BLock:", error.message);
        return serverErrorResponse(res, "Internal Server Error. Please try again later");
    }
};

const exportCvMatchersToExcel = async (req, res) => {
    try {
        const users = await cvMatchersModel.find({});

        console.log("users", users);

        if (!users.length) {
            return successResponse(res, "No users found to export.", []);
        }

        const usersData = users.map((user) => ({
            UserName: user.userName || "N/A",
            UserEmail: user.userEmail || "N/A",
        }));

        console.log("usersData", usersData);

        const worksheet = XLSX.utils.json_to_sheet(usersData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Cv Matchers");
        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "binary" });
        const buffer = Buffer.from(excelBuffer, "binary");
        res.setHeader("Content-Disposition", "attachment; filename=CvMatchers_List.xlsx");
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");

        res.send(buffer);
    } catch (error) {
        console.log("Error exporting users to Excel:", error.message);
        return serverErrorResponse(res, "Failed to export users to Excel. Please try again later.");
    }
};

export { userCvMatching, getOneCvMatcher, getAllCvMatchers, deleteCvMatcher, exportCvMatchersToExcel };
