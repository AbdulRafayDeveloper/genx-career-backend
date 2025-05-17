import multer from "multer";
import path from "path";
import { badRequestResponse, serverErrorResponse } from "../../helpers/responsesHelper/apiResponsesHelpers.js";
import { firebaseStorage } from "../../config/firebaseConfig.js";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import CvTemplate from "../../models/cvTemplatesModel.js";

const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/jpg", "image/webp"];

    allowed.includes(file.mimetype)
        ? cb(null, true)
        : cb(new Error("Only JPG/PNG/JPEG/WEBP allowed"), false);
};

const upload = multer({ storage, fileFilter }).single("template");

export const uploadCvTemplate = (req, res, next) => {
    upload(req, res, async err => {
        console.log("err: ", err);
        if (err) return badRequestResponse(res, "Upload error", err.message);

        if (!req.file) return badRequestResponse(res, "No template file uploaded", null);

        if (!req.body.name) return badRequestResponse(res, "Template name is required", null);

        console.log("req.body: ", req.body);
        console.log("req.file: ", req.file);

        const allowedTemplates = ["template1", "template2", "template3"];
        if (!allowedTemplates.includes(req.body.name)) {
            return badRequestResponse(res, "Invalid template name. Only 'template1', 'template2', or 'template3' are allowed.", null);
        }

        const existingTemplate = await CvTemplate.findOne({ name: req.body.name });

        console.log("existingTemplate: ", existingTemplate);

        if (existingTemplate) {
            console.log("existingTemplate: ", existingTemplate);
            return badRequestResponse(res, "Template with same name already exists");
        }

        try {
            console.log("req.file 2: ", req.file);
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
