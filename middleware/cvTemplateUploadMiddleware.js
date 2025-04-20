// import multer from "multer";
// import fs from "fs";
// import path from "path";
// import {
//     badRequestResponse,
// } from "../helpers/apiResponsesHelpers.js";

// // Create directory if not exists
// const cvTemplatesDir = "public/cvTemplates";
// if (!fs.existsSync(cvTemplatesDir)) {
//     fs.mkdirSync(cvTemplatesDir, { recursive: true });
// }

// // Multer config
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, cvTemplatesDir);
//     },
//     filename: function (req, file, cb) {
//         if (!req.body.name) {
//             return cb(new Error("Template name (req.body.name) is required"), null);
//         }
//         const ext = path.extname(file.originalname);
//         const filename = `${req.body.name}${ext}`;
//         cb(null, filename);
//     },
// });

// const fileFilter = function (req, file, cb) {
//     const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
//     if (allowedTypes.includes(file.mimetype)) {
//         cb(null, true);
//     } else {
//         cb(new Error("Only JPG, PNG, JPEG, and WEBP files are allowed"), false);
//     }
// };

// const upload = multer({ storage, fileFilter }).single("template");

// // Middleware function
// const cvTemplateUploadMiddleware = (req, res, next) => {
//     let attempts = 0;
//     const maxAttempts = 3;

//     const tryUpload = () => {
//         upload(req, res, function (err) {
//             attempts++;

//             if (err) {
//                 if (attempts < maxAttempts) {
//                     return tryUpload(); // Retry
//                 } else {
//                     return badRequestResponse(res, "File upload failed after 3 attempts", err.message);
//                 }
//             }

//             if (!req.file) {
//                 return badRequestResponse(res, "No template file uploaded", null);
//             }

//             if (!req.body.name) {
//                 return badRequestResponse(res, "Template name (req.body.name) is required", null);
//             }

//             return next(); // Success
//         });
//     };

//     tryUpload();
// };

// export { cvTemplateUploadMiddleware };

import multer from "multer";
import fs from "fs";
import path from "path";
import {
    badRequestResponse,
} from "../helpers/apiResponsesHelpers.js";

// ✅ New directory
const cvTemplatesDir = "temp/cvTemplates";

// Create directory if not exists
if (!fs.existsSync(cvTemplatesDir)) {
    fs.mkdirSync(cvTemplatesDir, { recursive: true });
}

// Multer config
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, cvTemplatesDir);
    },
    filename: function (req, file, cb) {
        if (!req.body.name) {
            return cb(new Error("Template name (req.body.name) is required"), null);
        }
        const ext = path.extname(file.originalname);
        const filename = `${req.body.name}${ext}`;
        cb(null, filename);
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

// Middleware function
const cvTemplateUploadMiddleware = (req, res, next) => {
    let attempts = 0;
    const maxAttempts = 3;

    const tryUpload = () => {
        upload(req, res, function (err) {
            attempts++;

            if (err) {
                if (attempts < maxAttempts) {
                    return tryUpload(); // Retry
                } else {
                    return badRequestResponse(res, "File upload failed after 3 attempts", err.message);
                }
            }

            if (!req.file) {
                return badRequestResponse(res, "No template file uploaded", null);
            }

            if (!req.body.name) {
                return badRequestResponse(res, "Template name (req.body.name) is required", null);
            }

            return next(); // Success
        });
    };

    tryUpload();
};

export { cvTemplateUploadMiddleware };
