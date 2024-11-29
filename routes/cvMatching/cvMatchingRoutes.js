import express from "express";
import { userCvMatching, getOneCvMatcher, getAllCvMatchers, deleteCvMatcher, CvMatchersCSV } from "../../controllers/cvMatching/cvMatchingController.js";
import multer from "multer";
import { authenticateLoginToken } from "../../middleware/userAuthorization.js";

const router = express.Router();

// Configure multer storage and file filter
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
        cb(null, true);
    } else {
        cb(new Error("Only PDF files are allowed!"), false);
    }
};

export const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 10 }, // 10 MB limit
    fileFilter: fileFilter,
});

router.post("/cv-matching", upload.single("file"), userCvMatching);
router.get("/cv-matching", authenticateLoginToken, getAllCvMatchers);
router.get("/cv-matching/:id", getOneCvMatcher);
router.delete("/cv-matching/:id", authenticateLoginToken, deleteCvMatcher);
router.get("/cv-matching-csv", authenticateLoginToken, CvMatchersCSV);

export default router;
