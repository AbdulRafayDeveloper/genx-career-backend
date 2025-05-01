import express from "express";
import { dashboardStats, getUsersMonthly } from "../../controllers/dashboard/adminDashboardController.js";
import { authenticateLoginToken } from "../../middleware/userAuthorization.js";

const router = express.Router();

router.get("/dashboard", authenticateLoginToken, dashboardStats);
router.get("/dashboard/users-monthly", authenticateLoginToken, getUsersMonthly);

export default router;
