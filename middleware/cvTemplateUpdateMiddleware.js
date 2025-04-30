import multer from "multer";
import { badRequestResponse } from "../helpers/apiResponsesHelpers.js";

const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/jpg", "image/webp"];

    allowed.includes(file.mimetype)
        ? cb(null, true)
        : cb(new Error("Only JPG/PNG/JPEG/WEBP allowed"), false);
};

const upload = multer({ storage, fileFilter }).single("template");

export const cvTemplateUpdateMiddleware = (req, res, next) => {
    upload(req, res, (err) => {
        if (err) {
            return badRequestResponse(res, "File upload error", err.message);
        }

        next();
    });
};
