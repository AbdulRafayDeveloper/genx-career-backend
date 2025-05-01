import express from "express";
import { scrapJobs, deleteOldJobs, getOneJob, deleteJob, getAllJobs, exportJobsToExcel } from "../../controllers/jobs/jobsController.js";
import { authenticateLoginToken } from "../../middleware/userAuthorization.js";

const router = express.Router();

router.get("/scrap-jobs", scrapJobs);
router.get("/delete-old-jobs", deleteOldJobs);
router.get("/jobs", getAllJobs);
router.get("/job/:id", getOneJob);
router.get("/jobs/export", exportJobsToExcel);
router.delete("/job/:id", authenticateLoginToken, deleteJob);

export default router;
