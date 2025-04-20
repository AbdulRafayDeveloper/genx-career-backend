import express from "express";
import { addCvTemplate, getAllCvTemplates, getOneCvTemplate, updateCvTemplate, deleteCvTemplate } from "../../controllers/cvTemplates/cvTemplatesController.js";
import { authenticateLoginToken } from "../../middleware/userAuthorization.js";
import { cvTemplateUploadMiddleware } from "../../middleware/cvTemplateUploadMiddleware.js";
import { cvTemplateUpdateMiddleware } from "../../middleware/cvTemplateUpdateMiddleware.js";

const router = express.Router();

router.post("/cvTemplate", authenticateLoginToken, cvTemplateUploadMiddleware, addCvTemplate);
router.get("/cvTemplate/:id", getOneCvTemplate);
router.get("/cvTemplates", getAllCvTemplates);
router.put("/cvTemplate/:id", authenticateLoginToken, cvTemplateUpdateMiddleware, updateCvTemplate);
router.delete("/cvTemplate/:id", authenticateLoginToken, deleteCvTemplate);

export default router;
