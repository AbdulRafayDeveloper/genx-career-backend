import multer from "multer";
import path from "path";
import { badRequestResponse, serverErrorResponse } from "../helpers/apiResponsesHelpers.js";
import { firebaseStorage } from "../config/firebaseConfig.js";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import CvTemplate from "../models/cvTemplates.js";

const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/jpg", "image/webp"];

    allowed.includes(file.mimetype)
        ? cb(null, true)
        : cb(new Error("Only JPG/PNG/JPEG/WEBP allowed"), false);
};

const upload = multer({ storage, fileFilter }).single("template");

export const cvTemplateUploadMiddleware = (req, res, next) => {
    upload(req, res, async err => {
        if (err) return badRequestResponse(res, "Upload error", err.message);

        if (!req.file) return badRequestResponse(res, "No template file uploaded", null);

        if (!req.body.name) return badRequestResponse(res, "Template name is required", null);

        const existingTemplate = await CvTemplate.findOne({ name: req.body.name });

        console.log("existingTemplate: ", existingTemplate);

        if (existingTemplate) {
            console.log("existingTemplate: ", existingTemplate);
            return badRequestResponse(res, "Template with same name already exists");
        }

        try {
            const ext = path.extname(req.file.originalname);
            const fileName = `${req.body.name}${ext}`;
            const firebasePath = `cvTemplates/${fileName}`;

            console.log("→ Uploading to Firebase:", firebasePath);

            // upload to Firebase
            const fileRef = ref(firebaseStorage, firebasePath);
            console.log("req.file.buffer: ", req.file.buffer);
            await uploadBytes(fileRef, req.file.buffer, { contentType: req.file.mimetype });

            // get its public URL
            console.log("fileRef: ", fileRef);
            const downloadURL = await getDownloadURL(fileRef);

            console.log("downloadURL: ", downloadURL);

            // attach for your controller
            req.firebaseFilePath = firebasePath;
            req.firebaseDownloadURL = downloadURL;

            console.log("→ Uploaded to Firebase:", firebasePath);
            console.log("→ Download URL:", downloadURL);

            return next();
        } catch (uploadErr) {
            return serverErrorResponse(res, "Firebase upload failed", uploadErr.message);
        }
    });
};
