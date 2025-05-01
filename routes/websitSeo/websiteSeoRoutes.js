import express from "express";
import { verifyAdminToken } from "../../middleware/auth/authorizeUser.js";
import { addWebsiteSeo, updateWebsiteSeo, deleteWebsiteSeo, getWebsiteSeoByPageName } from '../../controllers/websiteSeo/websiteSeoController.js';
// import { addWebsiteSeo, getAllWebsiteSeo, getOneWebsiteSeo, updateWebsiteSeo, deleteWebsiteSeo, getWebsiteSeoByPageName } from '../../controllers/websiteSeo/websiteSeoController.js';

const router = express.Router();

router.post('/seo', verifyAdminToken, addWebsiteSeo);
// router.get('/seo', verifyAdminToken, getAllWebsiteSeo);
router.get('/seo-page', getWebsiteSeoByPageName);
// router.get('/getOneSeoPage/:id', getOneWebsiteSeo);
router.put('/seo/:id', verifyAdminToken, updateWebsiteSeo);
router.delete('/seo/:id', verifyAdminToken, deleteWebsiteSeo);

export default router;
