import express from "express";
// import { userCvMatching, getOneCvMatcher, getAllCvMatchers, deleteCvMatcher, exportCvMatchersToExcel } from "../../controllers/cvMatching/cvMatchingController.js";
import { userCvMatching, getAllCvMatchers, deleteCvMatcher, exportCvMatchersToExcel } from "../../controllers/cvMatching/cvMatchingController.js";
import { upload } from "../../helpers/fileHelper/pdfStoragehelpers.js";
import { verifyAdminToken, verifyUserToken } from "../../middleware/auth/authorizeUser.js";

const router = express.Router();

router.post("/cv-matching", verifyUserToken, upload.single("file"), userCvMatching);
router.get("/cv-matchers", verifyAdminToken, getAllCvMatchers);
// router.get("/cv-matching/:id", getOneCvMatcher);
router.delete("/cv-matching/:id", verifyAdminToken, deleteCvMatcher);
router.get("/cv-matching-list/export", verifyAdminToken, exportCvMatchersToExcel);

export default router;
