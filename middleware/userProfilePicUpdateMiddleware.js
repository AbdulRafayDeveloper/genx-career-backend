// import multer from "multer";
// import { v4 as uuidv4 } from "uuid";
// import path from "path";
// import fs from "fs";
// import mongoose from "mongoose";
// import Users from "../models/usersModel.js";
// import {
//     badRequestResponse,
//     notFoundResponse,
//     serverErrorResponse
// } from "../helpers/apiResponsesHelpers.js";

// // Ensure the directory exists
// const uploadDir = "public/profileImages";
// if (!fs.existsSync(uploadDir)) {
//     fs.mkdirSync(uploadDir, { recursive: true });
// }

// // Multer configuration
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, uploadDir);
//     },
//     filename: function (req, file, cb) {
//         const ext = path.extname(file.originalname);
//         const uniqueName = uuidv4() + ext;
//         cb(null, uniqueName);
//     },
// });

// const fileFilter = function (req, file, cb) {
//     const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
//     if (allowedTypes.includes(file.mimetype)) {
//         cb(null, true);
//     } else {
//         cb(new Error("Only JPG, PNG, JPEG, and WEBP image files are allowed"), false);
//     }
// };

// const upload = multer({ storage, fileFilter }).single("profileImage");

// const userProfilePicUpdateMiddleware = (req, res, next) => {
//     upload(req, res, async function (err) {
//         try {
//             const { id } = req.params;

//             // Handle multer errors
//             if (err instanceof multer.MulterError) {
//                 return badRequestResponse(res, "Multer Error occurred", err.message);
//             } else if (err) {
//                 return badRequestResponse(res, "File Upload Error", err.message);
//             }

//             // Validate id
//             if (!id) {
//                 return badRequestResponse(res, "User ID is required in params.", null);
//             }

//             if (!mongoose.Types.ObjectId.isValid(id)) {
//                 return badRequestResponse(res, "Invalid User ID format", null);
//             }

//             // Validate file presence
//             if (!req.file) {
//                 return badRequestResponse(res, "No profile image file uploaded", null);
//             }

//             // Find user
//             const user = await Users.findById(id);
//             if (!user) {
//                 return notFoundResponse(res, "User not found in the database", null);
//             }

//             // Update user with new image filename
//             user.profileImage = req.file.filename;
//             await user.save();
//             next();
//         } catch (error) {
//             console.log("Error in userProfilePicUpdateMiddleware:", error.message);
//             return serverErrorResponse(res, "Internal server error. Please try again later.");
//         }
//     });
// };

// export { userProfilePicUpdateMiddleware };

import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import fs from "fs";
import mongoose from "mongoose";
import Users from "../models/usersModel.js";
import {
    badRequestResponse,
    notFoundResponse,
    serverErrorResponse
} from "../helpers/apiResponsesHelpers.js";

// Ensure the directory exists
const uploadDir = "public/profileImages";
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        const uniqueName = uuidv4() + ext;
        cb(null, uniqueName);
    },
});

const fileFilter = function (req, file, cb) {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Only JPG, PNG, JPEG, and WEBP image files are allowed"), false);
    }
};

const upload = multer({ storage, fileFilter }).single("profileImage");

const userProfilePicUpdateMiddleware = (req, res, next) => {
    upload(req, res, async function (err) {
        try {
            const { id } = req.params;

            // Handle multer errors
            if (err instanceof multer.MulterError) {
                return badRequestResponse(res, "Multer Error occurred", err.message);
            } else if (err) {
                return badRequestResponse(res, "File Upload Error", err.message);
            }

            // Validate id
            if (!id) {
                return badRequestResponse(res, "User ID is required in params.", null);
            }

            if (!mongoose.Types.ObjectId.isValid(id)) {
                return badRequestResponse(res, "Invalid User ID format", null);
            }

            // If no file uploaded, just pass control to next middleware
            if (!req.file) {
                return next(); // Do not update profile image, continue the flow
            }

            // Find user
            const user = await Users.findById(id);
            if (!user) {
                return notFoundResponse(res, "User not found in the database", null);
            }

            // Update user with new image filename
            user.profileImage = req.file.filename;
            await user.save();

            next();
        } catch (error) {
            console.log("Error in userProfilePicUpdateMiddleware:", error.message);
            return serverErrorResponse(res, "Internal server error. Please try again later.");
        }
    });
};

export { userProfilePicUpdateMiddleware };
