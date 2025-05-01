import express from "express";
import { userCvMatching, getOneCvMatcher, getAllCvMatchers, deleteCvMatcher, exportCvMatchersToExcel } from "../../controllers/cvMatching/cvMatchingController.js";
import { upload } from "../../helpers/fileHelper/pdfStoragehelpers.js";
import { authenticateLoginToken, userAuthenticateLoginToken } from "../../middleware/userAuthorization.js";

const router = express.Router();

router.post("/cv-matching", userAuthenticateLoginToken, upload.single("file"), userCvMatching);
router.get("/cv-matchers", authenticateLoginToken, getAllCvMatchers);
router.get("/cv-matching/:id", getOneCvMatcher);
router.delete("/cv-matching/:id", authenticateLoginToken, deleteCvMatcher);
router.get("/cv-matching-list/export", authenticateLoginToken, exportCvMatchersToExcel);

export default router;
