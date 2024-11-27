import fetch from "node-fetch";
import jobs from '../../models/JobsModel.js'; // Import the Job model
import { successResponse, badRequestResponse, serverErrorResponse } from "../../helpers/apiResponses.js";

const scrapJobs = async (req, res) => {
  try {
    // Destructure fields from the request body
    const { page, limit, posted_at_max_age_days } = req.body;

    console.log("Page:", page);
    console.log("Limit:", limit);
    console.log("Posted at max age days:", posted_at_max_age_days);

    // Check for missing fields
    if (page === undefined || limit === undefined || posted_at_max_age_days === undefined) {
      console.log("Please provide all fields");
      return badRequestResponse(res, "Please provide all fields", null);
    }

    // Prepare API endpoint and request options
    const apiUrl = "https://api.theirstack.com/v1/jobs/search";
    const THEIR_STACK_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ6YW1hbmFyb29iYUBnbWFpbC5jb20iLCJwZXJtaXNzaW9ucyI6InVzZXIifQ.0koG5OvS2M8Fe_qjSubkEFmshu-hMac3UFBMKHs9HtI"; // Replace with your actual token

    const body = {
      page,
      limit,
      posted_at_max_age_days,
    };

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${THEIR_STACK_TOKEN}`,
      },
      body: JSON.stringify(body),
    };

    // Make the API call
    const response = await fetch(apiUrl, options);

    // Check if the response is not OK
    if (!response.ok) {
      const error = await response.json();
      return badRequestResponse(res, "Failed to fetch jobs", error);
    }

    // Parse the response data
    const data = await response.json();

    // Log the response data to the console
    console.log("API Response:", data);

    // Loop over each job and save it to the database
    const jobData = data.data; // Assuming the job data is in `data.data` as per the API response structure

    for (let job of jobData) {
      const newJob = new jobs({
        title: job.job_title,
        applyUrl: job.url,
        companyName: job.company,
        finalUrl: job.final_url,
        sourceUrl: job.source_url,
        location: job.location,
        stateCode: job.state_code,
        remote: job.remote,
        hybrid: job.hybrid,
        country: job.country || job.country_code, // Use the country code or country
        seniority: job.seniority,
        salary: job.salary_string || job.min_annual_salary, // Fallback to minimum salary if available
        salaryCurrency: job.salary_currency,
        description: job.description,
        industry: job.company_object ? job.company_object.industry : null,
        companyLogoLink: job.company_object ? job.company_object.logo : null,
        companyUrl: job.company_object ? job.company_object.url : null,
        numberOfJobs: job.company_object ? job.company_object.num_jobs : null,
        foundedYear: job.company_object ? job.company_object.founded_year : null,
        jobPostDate: new Date(job.date_posted), // Ensure the job post date is a valid Date object
      });

      // Save the job entry to the database
      try {
        await newJob.save();
        console.log(`Job saved: ${job.job_title}`);
      } catch (error) {
        console.error(`Error saving job ${job.job_title}:`, error.message);
      }
    }

    // Send the success response
    return successResponse(res, "Jobs fetched and saved successfully", data);
  } catch (error) {
    console.error("Error in scrapJobs:", error.message);
    return serverErrorResponse(res, "Internal server error. Please try again later");
  }
};

// const getOneJob = async (req, res) => {
//   try {
//     const id = req.params.id;

//     if (id) {
//       return notFoundResponse(res, "Job Id not provided", null);
//     }

//     const job = await jobs.findById(id);

//     if (job) {
//       return successResponse(res, "job fetched successfully", job);
//     } else {
//       return notFoundResponse(res, "job not found", null);
//     }
//   } catch (error) {
//     return serverErrorResponse(
//       res,
//       "Internal server error. Please try again later"
//     );
//   }
// };

// const getAllJobs = async (req, res) => {
//   try {
//     const page = parseInt(req.query.page) || 1;
//     const pageSize = parseInt(req.query.limit) || 10;
//     const searchQuery = req.query.search || "";

//     let query = {};
//     if (searchQuery) {
//       query.$or = [
//         { name: { $regex: searchQuery, $options: "i" } },
//         { email: { $regex: searchQuery, $options: "i" } },
//       ];
//     }
//     const totalRecords = await countContacts(query);
//     if (!totalRecords) {
//       return notFoundResponse(res, "No contacts found.", null);
//     }
//     const totalPages = Math.ceil(totalRecords / pageSize);
//     const skip = (page - 1) * pageSize;
//     const contacts = await listContacts(query, skip, pageSize);
//     if (!contacts || contacts.length === 0) {
//       return notFoundResponse(
//         res,
//         "No contacts found for the given page.",
//         null
//       );
//     }
//     return successResponse(res, "Contacts fetched successfully.", {
//       records: contacts,
//       pagination: {
//         totalRecords,
//         totalPages,
//         currentPage: page,
//         pageSize,
//       },
//     });
//   } catch (error) {
//     return serverErrorResponse(
//       res,
//       "Internal Server Error. Please try again later!"
//     );
//   }
// };

// const deleteJob = async (req, res) => {
//   try {
//     const id = req.params.id; // Extract the job ID from the request parameters

//     // Check if the job exists
//     const job = await jobs.findById(id);
//     if (!job) {
//       return notFoundResponse(res, "No Job found", null); // Job not found
//     }

//     // Delete the job
//     const jobDelete = await jobs.findByIdAndDelete(id);
//     if (jobDelete) {
//       return successResponse(res, "Job deleted successfully", jobDelete); // Success response
//     } else {
//       return serverErrorResponse(
//         res,
//         "Unable to delete job. Please try again later"
//       ); // Server error response
//     }
//   } catch (error) {
//     return serverErrorResponse(
//       res,
//       "Internal Server Error. Please try again later"
//     );
//   }
// };

// export { scrapJobs, getOneJob, getAllJobs, deleteJob };
export { scrapJobs };
