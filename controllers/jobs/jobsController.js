import { successResponse, badRequestResponse, notFoundResponse, serverErrorResponse } from "../../helpers/responsesHelper/apiResponsesHelpers.js";
import jobsTitleforFetching from '../../constants/jobsData.js';
import { getDateFilter } from "../../helpers/jobsHelper/jobsHelpers.js";
import jobsModel from "../../models/jobListingsModel.js";
import cvMatchersModel from "../../models/cvMatchersModel.js";
import JobsApiSettingModel from '../../models/JobsApiSettingModel.js';
import fetch from "node-fetch";
import mongoose from "mongoose";
const THEIR_STACK_API_URL = process.env.THEIR_STACK_API_URL;
const THEIR_STACK_TOKEN = process.env.THEIR_STACK_TOKEN;
const JOB_SETTINGS_RECORD_ID = process.env.JOB_SETTINGS_RECORD_ID;
import XLSX from "xlsx";

const scrapJobs = async (req, res) => {
  try {
    const pageNumberRecord = await JobsApiSettingModel.findById({ _id: JOB_SETTINGS_RECORD_ID });

    let page = pageNumberRecord.pageNumber;
    page += 1;


    if (page === 5) {
      page = 0;
    }

    await JobsApiSettingModel.findByIdAndUpdate(
      { _id: JOB_SETTINGS_RECORD_ID },
      { $set: { pageNumber: page } }
    );

    const limit = process.env.JOBS_FETCH_LIMIT;
    const posted_at_max_age_days = 15;
    const include_total_results = false;
    const job_title_or = jobsTitleforFetching;

    const body = { page, limit, posted_at_max_age_days, include_total_results, job_title_or };

    const response = await fetch(THEIR_STACK_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${THEIR_STACK_TOKEN}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.json();
      return badRequestResponse(res, "Failed to fetch jobs", error);
    }

    const data = await response.json();
    const jobData = data.data;

    // Prepare an array of jobs to insert in batch to minimize database hits
    const jobsToSave = [];
    let savedJobsCount = 0;

    for (let job of jobData) {
      const cleanDescription = job.description?.replace(/\*/g, "").replace(/\\n/g, " ").replace(/  +/g, " ").replace(/\\/g, "");

      // Check if job exists in DB (index the thierStackJobId to optimize this lookup)
      const existingJob = await jobsModel.findOne({ thierStackJobId: job.id });
      if (existingJob) continue;

      jobsToSave.push({
        thierStackJobId: job.id || null,
        title: job.job_title || "No title provided",
        applyUrl: job.url || "",
        companyName: job.company || "Unknown Company",
        finalUrl: job.final_url || "",
        sourceUrl: job.source_url || "",
        location: job.location || "Location not specified",
        stateCode: job.state_code || "Unknown",
        remote: job.remote !== undefined ? job.remote : false,
        hybrid: job.hybrid !== undefined ? job.hybrid : false,
        country: job.country || job.country_code || "Country not specified",
        seniority: job.seniority || "Not specified",
        salary: job.salary_string || job.min_annual_salary || "Not disclosed",
        minAnnualSalary: job.min_annual_salary || null,
        maxAnnualSalary: job.max_annual_salary || null,
        salaryCurrency: job.salary_currency || "USD",
        description: cleanDescription || "No description provided",
        industry: job.company_object?.industry || "Industry not specified",
        employment_statuses: job.employment_statuses || [],
        companyLogoLink: job.company_object?.logo || null,
        companyUrl: job.company_object?.url || null,
        numberOfJobs: job.company_object?.num_jobs || 0,
        foundedYear: job.company_object?.founded_year || null,
        jobPostDate: new Date(job.date_posted) || new Date(),
      });
    }

    // Bulk insert jobs to DB in one operation to reduce the number of database hits
    const savedJobs = await jobsModel.insertMany(jobsToSave, { ordered: false }).catch(e => console.log(e));
    savedJobsCount = savedJobs.length;

    const daysThreshold = process.env.JOBS_DELETE_THRESHOLD_DAYS;
    const thresholdDate = new Date();
    thresholdDate.setDate(thresholdDate.getDate() - daysThreshold);

    // Delete jobs older than thresholdDate
    const deleteResult = await jobsModel.deleteMany({
      jobPostDate: { $lt: thresholdDate }
    });

    // Return response summary with total count, saved jobs, and skipped jobs
    return successResponse(res, `${savedJobsCount} jobs saved successfully and ${jobData.length - savedJobsCount} jobs skipped as they already exist in the database. Old jobs deleted successfully`, {
      totalJobsFetched: jobData.length,
      JobsSavedInDB: savedJobsCount,
      JobsAlreadyExistInDB: jobData.length - savedJobsCount,
      deletedJobsCount: deleteResult.deletedCount,
      thresholdDate,
    });

  } catch (error) {
    console.log("Error Message in Catch BLock:", error.message);
    return serverErrorResponse(res, "Internal server error. Please try again later");
  }
};

const deleteOldJobs = async (req, res) => {
  try {
    const daysThreshold = process.env.JOBS_DELETE_THRESHOLD_DAYS;
    const thresholdDate = new Date();
    thresholdDate.setDate(thresholdDate.getDate() - daysThreshold);

    // Delete jobs older than thresholdDate
    const deleteResult = await jobsModel.deleteMany({
      jobPostDate: { $lt: thresholdDate }
    });

    return successResponse(res, `${deleteResult.deletedCount} old jobs deleted successfully`, {
      deletedJobsCount: deleteResult.deletedCount,
      thresholdDate,
    });
  } catch (error) {
    console.log("Error in deleteOldJobs:", error.message);
    return serverErrorResponse(res, "Failed to delete old jobs. Please try again later.");
  }
};

const getOneJob = async (req, res) => {
  try {
    const id = req.params.id;

    if (!id) {
      return notFoundResponse(res, "Id not provided", null);
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return badRequestResponse(res, "Invalid ID format", null);
    }

    const job = await jobsModel.findById(id);

    if (!job) {
      return notFoundResponse(res, "Record not found in the database", null);
    }

    return successResponse(res, "Record fetched successfully", job);
  } catch (error) {
    console.log("Error Message in Catch BLock:", error.message);
    return serverErrorResponse(res, "Internal server error. Please try again later.");
  }
};

const getAllJobs = async (req, res) => {
  try {
    const { pageNumber = 1, pageSize = 15, search = '', location = '', remote = '', datePosted = 'anytime', minSalary, maxSalary } = req.query;
    const filters = {};

    // Search filter
    if (search) {
      filters.title = { $regex: search, $options: 'i' };
    }

    // Location filter (exact match)
    if (location) {
      filters.location = location;
    }

    console.log("remote: ", remote);

    // Remote filter (exact match)
    if (remote === 'true') {
      filters.remote = true;
    }

    console.log("datePosted: ", datePosted);

    // Date posted filter (custom logic for last X days, weeks, months, etc.)
    if (datePosted !== 'anytime') {
      const dateFilter = getDateFilter(datePosted);
      console.log("dateFilter: ", dateFilter);
      if (dateFilter) {
        filters.jobPostDate = { $gte: dateFilter };
      }
    }

    if (minSalary || maxSalary) {
      // Parse values in base 10
      const min = parseInt(minSalary, 10);
      const max = parseInt(maxSalary, 10);
      const salaryFilter = {};

      // Only add the filter if the parsed number is valid (i.e. not NaN)
      if (!isNaN(min)) {
        salaryFilter.$gte = min;
      }
      if (!isNaN(max)) {
        salaryFilter.$lte = max;
      }
      // Only add the salary filter if at least one of the values is valid.
      if (Object.keys(salaryFilter).length > 0) {
        filters.minAnnualSalary = salaryFilter;
      }
    }

    // Pagination logic
    const skip = (pageNumber - 1) * pageSize;
    const limit = parseInt(pageSize);

    // Fetch jobs with the provided filters and pagination
    const getAllJobs = await jobsModel.find(filters).skip(skip).limit(limit);
    const totalJobsCount = await jobsModel.countDocuments(filters);

    console.log("getAllJobs: ", getAllJobs);

    return successResponse(res, 'Jobs fetched successfully.', {
      getAllJobs,
      totalJobsCount,
      pageNumber: parseInt(pageNumber),
      pageSize: limit,
    });

  } catch (error) {
    console.log("Error Message in Catch BLock:", error.message);
    return serverErrorResponse(res, 'Internal server error. Please try again later');
  }
};

const deleteJob = async (req, res) => {
  try {
    const id = req.params.id;

    if (!id) {
      return notFoundResponse(res, "Job Id not provided", null);
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return badRequestResponse(res, "Invalid ID format", null);
    }

    const job = await jobsModel.findById(id);

    if (!job) {
      return notFoundResponse(res, "No Job found", null);
    }

    const jobDelete = await jobsModel.findByIdAndDelete(id);

    if (!jobDelete) {
      return serverErrorResponse(res, "Unable to delete Job. Please try again later");
    }

    const jobId = id;
    let deletedObjects = [];

    const cvMatchers = await cvMatchersModel.find({
      "result.jobId": jobId,
    });

    if (!cvMatchers.length) {
      console.log("No matching users found.");
    }

    for (const user of cvMatchers) {
      const matchingResultIndex = user.result.findIndex(
        (item) => item.jobId.toString() === jobId
      );

      if (matchingResultIndex !== -1) {
        if (user.result.length === 1) {
          await cvMatchersModel.findByIdAndDelete(user._id);
          console.log(`Deleted user: ${user.userName}`);
        } else {
          const [deletedResult] = user.result.splice(matchingResultIndex, 1);
          await user.save();
          deletedObjects.push(deletedResult);
        }
      }
    }

    return successResponse(res, "Job deleted successfully", jobDelete);
  } catch (error) {
    console.log("Error Message in Catch BLock:", error.message);
    return serverErrorResponse(res, "Internal Server Error. Please try again later");
  }
};

const exportJobsToExcel = async (req, res) => {
  try {
    const jobs = await jobsModel.find({});

    if (!jobs.length) {
      return successResponse(res, "No jobs found to export.", []);
    }

    const jobsData = jobs.map((job) => ({
      JobTitle: job.title || "N/A",
      Location: job.location || "N/A",
      Country: job.country || "N/A",
      Salary: job.salary || "Not Disclosed",
      MinAnnualSalary: job.minAnnualSalary || "N/A",
      MaxAnnualSalary: job.maxAnnualSalary || "N/A",
      SalaryCurrency: job.salaryCurrency || "N/A",
      Industry: job.industry || "N/A",
      Description: job.description || "N/A",
      PostedDate: job.jobPostDate ? job.jobPostDate.toISOString().split("T")[0] : "N/A",
      ApplyUrl: job.applyUrl || "N/A",
      CompanyName: job.companyName || "N/A",
      SourceUrl: job.sourceUrl || "N/A",
      StateCode: job.stateCode || "N/A",
      Remote: job.remote ? "Yes" : "No",
      Hybrid: job.hybrid ? "Yes" : "No",
      Seniority: job.seniority || "N/A",
      CompanyLogoLink: job.companyLogoLink || "N/A",
      CompanyUrl: job.companyUrl || "N/A",
      NumberOfJobs: job.numberOfJobs || "N/A",
      FoundedYear: job.foundedYear || "N/A",
    }));

    const worksheet = XLSX.utils.json_to_sheet(jobsData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Jobs");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "binary" });
    const buffer = Buffer.from(excelBuffer, "binary");
    res.setHeader("Content-Disposition", "attachment; filename=Jobs_Export.xlsx");
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");

    res.send(buffer);
  } catch (error) {
    console.log("Error exporting jobs to Excel:", error.message);
    return serverErrorResponse(res, "Failed to export jobs to Excel. Please try again later.");
  }
};

export { scrapJobs, deleteOldJobs, getOneJob, deleteJob, getAllJobs, exportJobsToExcel };
