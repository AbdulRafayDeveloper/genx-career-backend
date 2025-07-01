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
        console.log("handleProfilePicUpload called");

        if (err instanceof multer.MulterError || err) {
            return badRequestResponse(res, "Upload error", err.message);
        }

        const { id } = req.params;
        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return badRequestResponse(res, "Invalid or missing user ID", null);
        }

        console.log("profilePicUpload id: ", id);
        console.log("req.file: ", req.file);

        if (!req.file) return next(); // No file uploaded

        try {
            const user = await Users.findById(id);
            if (!user) return notFoundResponse(res, "User not found", null);

            console.log("user: ", user);

            const ext = path.extname(req.file.originalname);
            const uniqueName = uuidv4() + ext;
            const firebasePath = `profile-images/${uniqueName}`;

            console.log("firebasePath: ", firebasePath);
            console.log("firebaseStorage:", firebaseStorage); // Check if firebaseStorage is initialized correctly

            const storageRef = ref(firebaseStorage, firebasePath);
            console.log("storageRef 1: ", storageRef);
            await uploadBytes(storageRef, req.file.buffer);

            console.log("storageRef 2: ", storageRef);
            // Get the download URL

            const downloadURL = await getDownloadURL(storageRef);

            console.log("downloadURL: ", downloadURL);

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
