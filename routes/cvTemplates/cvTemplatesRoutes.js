import express from "express";
import { addCvTemplate, getAllCvTemplates, getOneCvTemplate, saveUpdatedCvTemplate, deleteCvTemplate } from "../../controllers/cvTemplates/cvTemplatesController.js";
import { verifyAdminToken } from "../../middleware/auth/authorizeUser.js";
import { uploadCvTemplate } from "../../middleware/cvTemplate/uploadCvTemplate.js";
import { updateCvTemplate } from "../../middleware/cvTemplate/updateCvTemplate.js";

const router = express.Router();

router.post("/cv-templates", verifyAdminToken, uploadCvTemplate, addCvTemplate);
router.get("/cv-templates/:id", getOneCvTemplate);
router.get("/cv-templates", getAllCvTemplates);
router.put("/cv-templates/:id", verifyAdminToken, updateCvTemplate, saveUpdatedCvTemplate);
router.delete("/cv-templates/:id", verifyAdminToken, deleteCvTemplate);

export default router;
