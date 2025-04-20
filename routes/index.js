import express from "express";
import userAuthRoutes from "./users/authRoutes.js";
import userRoutes from "./users/usersRoutes.js";
import contactUsRoutes from "./users/contactRoutes.js";
import jobsRoutes from "./jobs/jobsRoutes.js";
import cvMatchingRoutes from "./cvMatching/cvMatchingRoutes.js";
import adminDashboardRoutes from "./dashboard/adminDashboardRoutes.js";
import cvCreationRoutes from "./cvCreation/cvCreationRoutes.js";
import cvTemplatesRoutes from "./cvTemplates/cvTemplatesRoutes.js";
import websiteSeoRoutes from "./websitSeo/websiteSeoRoutes.js";

const router = express.Router();

// Just for Testing
router.get("/", (req, res) => {
  res.send("Main project backend is working now");
});

// Attach all routes here
router.use("/api", userAuthRoutes);
router.use("/api", userRoutes);
router.use("/api", contactUsRoutes);
router.use("/api", jobsRoutes);
router.use("/api", cvMatchingRoutes);
router.use("/api", adminDashboardRoutes);
router.use("/api", cvCreationRoutes);
router.use("/api", cvTemplatesRoutes);
router.use("/api", websiteSeoRoutes);

export default router;
