import fetch from "node-fetch";
import jobs from '../../models/JobsModel.js';
console.log(jobs)
import JobsApiSettingModel from '../../models/JobsApiSettingModel.js';
import jobsTitleforFetching from '../../constants/jobsData.js';
import { successResponse, badRequestResponse, serverErrorResponse } from "../../helpers/apiResponses.js";
const THEIR_STACK_API_URL = process.env.THEIR_STACK_API_URL;
const THEIR_STACK_TOKEN = process.env.THEIR_STACK_TOKEN;
const JOB_SETTINGS_RECORD_ID = process.env.JOB_SETTINGS_RECORD_ID;

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

    const limit = 1;
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
      const existingJob = await jobs.findOne({ thierStackJobId: job.id });
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
    const savedJobs = await jobs.insertMany(jobsToSave, { ordered: false }).catch(e => console.error(e));

    savedJobsCount = savedJobs.length;

    // Return response summary with total count, saved jobs, and skipped jobs
    return successResponse(res, `${savedJobsCount} jobs fetched and saved successfully.`, {
      totalJobsFetched: jobData.length,
      JobsSavedInDB: savedJobsCount,
      JobsAlreadyExistInDB: jobData.length - savedJobsCount,
    });

  } catch (error) {
    console.error("Error in scrapJobs:", error.message);
    return serverErrorResponse(res, "Internal server error. Please try again later");
  }
};

const getOneJob = async (req, res) => {
  try {
    const id = req.params.id;

    if (!id) {
      return notFoundResponse(res, "Job Id not provided", null);
    }

    const job = await jobs.findById(id);

    if (job) {
      return successResponse(res, "job fetched successfully", job);
    } else {
      return notFoundResponse(res, "job not found", null);
    }
  } catch (error) {
    return serverErrorResponse(
      res,
      "Internal server error. Please try again later"
    );
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

    // Remote filter (exact match)
    if (remote === 'true') {
      filters.remote = true;
    }

    // Date posted filter (custom logic for last X days, weeks, months, etc.)
    if (datePosted !== 'anytime') {
      const dateFilter = getDateFilter(datePosted);
      if (dateFilter) {
        filters.jobPostDate = { $gte: dateFilter };
      }
    }

    // Salary range filter
    if (minSalary || maxSalary) {
      filters.minAnnualSalary = {};
      if (minSalary) filters.minAnnualSalary.$gte = parseInt(minSalary);
      if (maxSalary) filters.minAnnualSalary.$lte = parseInt(maxSalary);
    }

    // Pagination logic
    const skip = (pageNumber - 1) * pageSize;
    const limit = parseInt(pageSize);

    // Fetch jobs with the provided filters and pagination
    const getAllJobs = await jobs.find(filters).skip(skip).limit(limit);
    const totalJobsCount = await jobs.countDocuments(filters);

    return successResponse(res, 'Jobs fetched successfully.', {
      getAllJobs,
      totalJobsCount,
      pageNumber: parseInt(pageNumber),
      pageSize: limit,
    });

  } catch (error) {
    console.error('Error in getAllJobs:', error.message);
    return serverErrorResponse(res, 'Internal server error. Please try again later');
  }
};

function getDateFilter(datePosted) {
  const currentDate = new Date();
  let filterDate;

  switch (datePosted) {
    case 'last_day':
      filterDate = new Date(currentDate.setDate(currentDate.getDate() - 1)); 
      break;
    case 'last_3_days':
      filterDate = new Date(currentDate.setDate(currentDate.getDate() - 3));
      break;
    case 'last_week':
      filterDate = new Date(currentDate.setDate(currentDate.getDate() - 7));
      break;
    case 'last_2_weeks':
      filterDate = new Date(currentDate.setDate(currentDate.getDate() - 14));
      break;
    case 'last_month':
      filterDate = new Date(currentDate.setMonth(currentDate.getMonth() - 1));
      break;
    default:
      filterDate = new Date(0); // Anytime (no filter)
      break;
  }

  return filterDate;
}

const deleteJob = async (req, res) => {
  try {
    const id = req.params.id;

    if (!id) {
      return notFoundResponse(res, "Job Id not provided", null);
    }

    const job = await jobs.findById(id);

    if (!job) {
      return notFoundResponse(res, "No Job found", null);
    }

    // Delete the job
    const jobDelete = await jobs.findByIdAndDelete(id);

    if (jobDelete) {
      return successResponse(res, "Job deleted successfully", jobDelete);
    } else {
      return serverErrorResponse(
        res,
        "Unable to delete job. Please try again later"
      );
    }
  } catch (error) {
    return serverErrorResponse(
      res,
      "Internal Server Error. Please try again later"
    );
  }
};

export { scrapJobs, getOneJob, deleteJob, getAllJobs };
