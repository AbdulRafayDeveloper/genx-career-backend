import express from "express";
import { scrapJobs, getOneJob, deleteJob, getAllJobs, exportJobsToExcel } from "../../controllers/jobs/jobsController.js";
// import { scrapJobs, deleteOldJobs, getOneJob, deleteJob, getAllJobs, exportJobsToExcel } from "../../controllers/jobs/jobsController.js";
import { verifyAdminToken } from "../../middleware/auth/authorizeUser.js";

const router = express.Router();

router.get("/scrap-all-new-jobs", scrapJobs);
// router.get("/delete-old-jobs", deleteOldJobs);
router.get("/jobs", getAllJobs);
router.get("/job/:id", getOneJob);
router.get("/jobs/export", verifyAdminToken, exportJobsToExcel);
router.delete("/job/:id", verifyAdminToken, deleteJob);

export default router;
