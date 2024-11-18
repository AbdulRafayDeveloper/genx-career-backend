import express from 'express';
import userAuthRoutes from './user/auth.js';
import userRoutes from './user/usersRoutes.js';
import contactUsRoutes from './user/contactUsRoutes.js';

const router = express.Router();

// Just for Testing
router.get("/", (req, res) => {
    res.send('main project backend is working now')
})

// Attach all routes here
router.use('/api/user', userAuthRoutes);
router.use('/api/user', userRoutes);
router.use('/api/user', contactUsRoutes);

export default router;
