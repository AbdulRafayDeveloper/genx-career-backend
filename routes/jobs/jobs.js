import express from "express";
import { scrapJobs, getOneJob } from "../../controllers/jobs/jobs.js";
// import validateUser from "../../middleware/userValidation.js";

const router = express.Router();

router.get("/scrapJobs", scrapJobs);
// router.get("/jobs", getAllJobs);
router.get("/job/:id", getOneJob);
// router.delete("/jobs/:id", deleteJob);

export default router;
