import express from "express";
import { generateCV, getAllCvCreators, deleteCvCreator, exportCvCreatorsToExcel } from "../../controllers/cvCreation/cvCreationController.js";
// import { generateCV, getAllCvCreators, getOneCvCreator, deleteCvCreator, exportCvCreatorsToExcel } from "../../controllers/cvCreation/cvCreationController.js";
import { verifyAdminToken, verifyUserToken } from "../../middleware/auth/authorizeUser.js";

const router = express.Router();

router.post("/generate", verifyUserToken, generateCV);
router.get("/cv-creation", verifyAdminToken, getAllCvCreators);
router.delete("/cv-creation/:id", verifyAdminToken, deleteCvCreator);
router.get("/cv-creation-list/export", verifyAdminToken, exportCvCreatorsToExcel);

export default router;
