import express from 'express';
import userAuthRoutes from './users/authRoutes.js';
import userRoutes from './users/usersRoutes.js';
import contactUsRoutes from './users/contactRoutes.js';
import jobsRoutes from './jobs/jobsRoutes.js';
import cvMatchingRoutes from './cvMatching/cvMatchingRoutes.js';
import adminDashboardRoutes from './dashboard/adminDashboardRoutes.js';

const router = express.Router();

// Just for Testing
router.get("/", (req, res) => {
    res.send('Main project backend is working now')
})

// Attach all routes here
router.use('/api', userAuthRoutes);
router.use('/api', userRoutes);
router.use('/api', contactUsRoutes);
router.use('/api', jobsRoutes);
router.use('/api', cvMatchingRoutes);
router.use('/api', adminDashboardRoutes);

export default router;
