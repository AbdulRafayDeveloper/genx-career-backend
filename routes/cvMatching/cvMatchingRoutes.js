import express from "express";
import { userCvMatching, getOneCvMatcher, getAllCvMatchers, deleteCvMatcher, exportCvMatchersToExcel } from "../../controllers/cvMatching/cvMatchingController.js";
import { upload } from "../../helpers/pdfStoragehelpers.js";
import { authenticateLoginToken } from "../../middleware/userAuthorization.js";

const router = express.Router();

router.post("/cv-matching", upload.single("file"), userCvMatching);
router.get("/cv-matchers", authenticateLoginToken, getAllCvMatchers);
router.get("/cv-matching/:id", getOneCvMatcher);
router.delete("/cv-matching/:id", authenticateLoginToken, deleteCvMatcher);
router.get("/cv-matching-list/export", authenticateLoginToken, exportCvMatchersToExcel);

export default router;
