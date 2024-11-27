import express from "express";
import { userCvMatching } from "../../controllers/cvMatching/cvMatchingController.js";
import multer from "multer";

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
  limits: { fileSize: 1024 * 1024 * 7 }, // 7 MB limit
  fileFilter: fileFilter,
});

router.post("/cv-matching", upload.single("file"), userCvMatching);

export default router;
