import express from "express";
import { addCvTemplate, getAllCvTemplates, getOneCvTemplate, updateCvTemplate, deleteCvTemplate } from "../../controllers/cvTemplates/cvTemplatesController.js";
import { authenticateLoginToken } from "../../middleware/userAuthorization.js";
import { cvTemplateUploadMiddleware } from "../../middleware/cvTemplateUploadMiddleware.js";
import { cvTemplateUpdateMiddleware } from "../../middleware/cvTemplateUpdateMiddleware.js";

const router = express.Router();

router.post("/cv-templates", authenticateLoginToken, cvTemplateUploadMiddleware, addCvTemplate);
router.get("/cv-templates/:id", getOneCvTemplate);
router.get("/cv-templates", getAllCvTemplates);
router.put("/cv-templates/:id", authenticateLoginToken, cvTemplateUpdateMiddleware, updateCvTemplate);
router.delete("/cv-templates/:id", authenticateLoginToken, deleteCvTemplate);

export default router;
