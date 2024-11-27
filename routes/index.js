import express from 'express';
import userAuthRoutes from './user/auth.js';
import userRoutes from './user/usersRoutes.js';
import contactUsRoutes from './user/contactUsRoutes.js';
import jobsRoutes from './jobs/jobs.js';

const router = express.Router();

// Just for Testing
router.get("/", (req, res) => {
    res.send('Main project backend is working now')
})

// Attach all routes here
router.use('/api', jobsRoutes);
router.use('/api/user', userAuthRoutes);
router.use('/api/user', userRoutes);
router.use('/api/user', contactUsRoutes);

export default router;
