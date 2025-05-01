import express from "express";
import { dashboardStats, getUsersMonthly } from "../../controllers/dashboard/adminDashboardController.js";
import { verifyAdminToken } from "../../middleware/auth/authorizeUser.js";

const router = express.Router();

router.get("/dashboard", verifyAdminToken, dashboardStats);
router.get("/dashboard/users-monthly", verifyAdminToken, getUsersMonthly);

export default router;
