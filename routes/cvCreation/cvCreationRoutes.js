import express from "express";
import { generateCV, getAllCvCreators, getOneCvCreator, deleteCvCreator, exportCvCreatorsToExcel } from "../../controllers/cvCreation/cvCreationController.js";
import { authenticateLoginToken } from "../../middleware/userAuthorization.js";

const router = express.Router();

router.post("/generate", generateCV);
router.get("/cv-creation/:id", getOneCvCreator);
router.get("/cv-creation", authenticateLoginToken, getAllCvCreators);
router.delete("/cv-creation/:id", authenticateLoginToken, deleteCvCreator);
router.get("/cv-creation-list/export", authenticateLoginToken, exportCvCreatorsToExcel);

export default router;
