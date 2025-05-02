// import multer from "multer";
// import { v4 as uuidv4 } from "uuid";
// import path from "path";
// import mongoose from "mongoose";
// import Users from "../../models/usersModel.js";
// import {
//     badRequestResponse,
//     notFoundResponse,
//     serverErrorResponse,
// } from "../../helpers/responsesHelper/apiResponsesHelpers.js";
// import { firebaseStorage } from "../../config/firebaseConfig.js";
// import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

// // Multer memory storage (store file in memory instead of disk)
// const storage = multer.memoryStorage();

// const fileFilter = function (req, file, cb) {
//     const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
//     if (allowedTypes.includes(file.mimetype)) {
//         cb(null, true);
//     } else {
//         cb(
//             new Error("Only JPG, PNG, JPEG, and WEBP image files are allowed"),
//             false
//         );
//     }
// };

// const upload = multer({ storage, fileFilter }).single("profileImage");

// const handleProfilePicUpload = (req, res, next) => {
//     upload(req, res, async function (err) {
//         try {
//             const { id } = req.params;

//             // Handle multer errors
//             if (err instanceof multer.MulterError) {
//                 return badRequestResponse(res, "Multer Error occurred", err.message);
//             } else if (err) {
//                 return badRequestResponse(res, "File Upload Error", err.message);
//             }

//             console.log("profilePicUpload id: ", id);

//             if (!id) {
//                 return badRequestResponse(res, "User ID is required in params.", null);
//             }

//             if (!mongoose.Types.ObjectId.isValid(id)) {
//                 return badRequestResponse(res, "Invalid User ID format", null);
//             }

//             // If no file uploaded, just continue
//             if (!req.file) {
//                 return next();
//             }

//             console.log("req.file: ", req.file);

//             const user = await Users.findById(id);

//             console.log("user: ", user);

//             if (!user) {
//                 return notFoundResponse(res, "User not found in the database", null);
//             }

//             // Generate unique filename with extension
//             const ext = path.extname(req.file.originalname);
//             const uniqueName = uuidv4() + ext;

//             console.log("uniqueName: ", uniqueName);

//             // Define storage path in Firebase
//             const firebasePath = `profile-images/${uniqueName}`;

//             console.log("firebasePath: ", firebasePath);

//             console.log("firebaseStorage 1:", firebaseStorage); // Should show correct bucket name
//             // Create reference and upload to Firebase Storage
//             const storageRef = ref(firebaseStorage, firebasePath);
//             console.log("storageRef 1: ", storageRef);
//             console.log("Storage bucket:", firebaseStorage.bucket); // Should show correct bucket name
//             console.log("req.file.buffer: ", req.file.buffer);
//             await uploadBytes(storageRef, req.file.buffer);

//             console.log("storageRef 2: ", storageRef);

//             // Get the download URL
//             const downloadURL = await getDownloadURL(storageRef);

//             // Save the Firebase URL to user document
//             user.profileImage = downloadURL;
//             await user.save();

//             console.log("user: ", user);

//             next();
//         } catch (error) {
//             console.error("Error in handleProfilePicUpload:", error);
//             return serverErrorResponse(
//                 res,
//                 "Internal server error. Please try again later."
//             );
//         }
//     });
// };

// export { handleProfilePicUpload };


import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import mongoose from "mongoose";
import Users from "../../models/usersModel.js";
import {
    badRequestResponse,
    notFoundResponse,
    serverErrorResponse,
} from "../../helpers/responsesHelper/apiResponsesHelpers.js";
import { firebaseStorage } from "../../config/firebaseConfig.js";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Configure Multer to store file in memory
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Only image files (jpeg, png, webp) are allowed"), false);
    }
};

const upload = multer({ storage, fileFilter }).single("profileImage");

const handleProfilePicUpload = (req, res, next) => {
    upload(req, res, async (err) => {
        if (err instanceof multer.MulterError || err) {
            return badRequestResponse(res, "Upload error", err.message);
        }

        const { id } = req.params;
        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return badRequestResponse(res, "Invalid or missing user ID", null);
        }

        if (!req.file) return next(); // No file uploaded

        try {
            const user = await Users.findById(id);
            if (!user) return notFoundResponse(res, "User not found", null);

            const ext = path.extname(req.file.originalname);
            const uniqueName = uuidv4() + ext;
            const firebasePath = `profile-images/${uniqueName}`;

            const storageRef = ref(firebaseStorage, firebasePath);
            await uploadBytes(storageRef, req.file.buffer);

            const downloadURL = await getDownloadURL(storageRef);

            user.profileImage = downloadURL;
            await user.save();

            next();
        } catch (error) {
            console.error("Firebase upload error:", error);
            return serverErrorResponse(res, "Something went wrong", error);
        }
    });
};

export { handleProfilePicUpload };
