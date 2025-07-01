import express from "express";
import { verifyAdminToken } from "../../middleware/auth/authorizeUser.js";
import { addWebsiteSeo, updateWebsiteSeo, deleteWebsiteSeo, getWebsiteSeoByPageName } from '../../controllers/websiteSeo/websiteSeoController.js';

const router = express.Router();

router.post('/seo', verifyAdminToken, addWebsiteSeo);
router.get('/seo-page', getWebsiteSeoByPageName);
router.put('/seo/:id', verifyAdminToken, updateWebsiteSeo);
router.delete('/seo/:id', verifyAdminToken, deleteWebsiteSeo);

export default router;
