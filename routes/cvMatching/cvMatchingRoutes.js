import express from "express";
import { userCvMatching, getOneCvMatcher, getAllCvMatchers, deleteCvMatcher, CvMatchersCSV } from "../../controllers/cvMatching/cvMatchingController.js";
import { upload } from "../../helpers/pdfStoragehelpers.js";
import { authenticateLoginToken } from "../../middleware/userAuthorization.js";
import userCvMatchingValidation from "../../middleware/userCvMatchingValidation.js";

const router = express.Router();

router.post("/cv-matching", userCvMatchingValidation, upload.single("file"), userCvMatching);
router.get("/cv-matching", authenticateLoginToken, getAllCvMatchers);
router.get("/cv-matching/:id", getOneCvMatcher);
router.delete("/cv-matching/:id", authenticateLoginToken, deleteCvMatcher);
router.get("/cv-matching-csv", authenticateLoginToken, CvMatchersCSV);

export default router;
