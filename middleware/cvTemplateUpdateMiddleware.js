import multer from "multer";
import fs from "fs";
import path from "path";
import {
    badRequestResponse,
    serverErrorResponse,
} from "../helpers/apiResponsesHelpers.js";

// Ensure temp directory exists
const tempDir = "temp/cvTemplates";
if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
}

// Multer setup (store in temp folder, keep original name)
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, tempDir);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname); // ✅ Use original filename as-is
    },
});

const fileFilter = function (req, file, cb) {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Only JPG, PNG, JPEG, and WEBP files are allowed"), false);
    }
};

const upload = multer({ storage, fileFilter }).single("template");

const cvTemplateUpdateMiddleware = (req, res, next) => {
    let attempts = 0;
    const maxAttempts = 3;

    const tryUpload = () => {
        upload(req, res, function (err) {
            attempts++;

            if (err) {
                if (attempts < maxAttempts) return tryUpload();
                return badRequestResponse(res, "File upload failed after 3 attempts", err.message);
            }

            if (!req.file) return badRequestResponse(res, "No template file uploaded");

            // ✅ File is now in temp folder with original name
            return next();
        });
    };

    tryUpload();
};

export { cvTemplateUpdateMiddleware };
