import express from "express";
import { scrapJobs, getOneJob, deleteJob, getAllJobs, exportJobsToExcel } from "../../controllers/jobs/jobsController.js";
import { authenticateLoginToken } from "../../middleware/userAuthorization.js";

const router = express.Router();

router.get("/scrapJobs", scrapJobs);
router.get("/jobs", getAllJobs);
router.get("/job/:id", getOneJob);
router.get("/jobs/export", exportJobsToExcel);
router.delete("/job/:id", authenticateLoginToken, deleteJob);

export default router;
