import express from "express";
import { authenticateLoginToken } from "../../middleware/userAuthorization.js";
import {
    addWebsiteSeo, getAllWebsiteSeo, getOneWebsiteSeo, updateWebsiteSeo, deleteWebsiteSeo, getWebsiteSeoByPageName
} from '../../controllers/websiteSeo/websiteSeoController.js';

const router = express.Router();

router.post('/seo', authenticateLoginToken, addWebsiteSeo);
router.get('/seo', getAllWebsiteSeo);
router.get('/getWebsiteSeoByPageName', getWebsiteSeoByPageName);
router.get('/getOneSeoPage/:id', getOneWebsiteSeo);
router.put('/seo/:id', authenticateLoginToken, updateWebsiteSeo);
router.delete('/seo/:id', authenticateLoginToken, deleteWebsiteSeo);

export default router;
