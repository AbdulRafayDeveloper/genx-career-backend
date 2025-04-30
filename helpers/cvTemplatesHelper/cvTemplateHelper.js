import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { badRequestResponse, serverErrorResponse } from "../apiResponsesHelpers.js";
import { ref, deleteObject } from "firebase/storage";
import { firebaseStorage } from "../../config/firebaseConfig.js";

export const retryDeleteFile = async (firebasePath, attempts = 3) => {
    let tries = 0;

    while (tries < attempts) {
        try {
            const fileRef = ref(firebaseStorage, firebasePath);
            await deleteObject(fileRef);
            console.log("Deleted from Firebase:", firebasePath);
            return true;
        } catch (err) {
            tries++;
            console.warn(`Attempt ${tries} failed to delete ${firebasePath}:`, err.message);

            if (tries >= attempts) {
                console.error(`Failed to delete Firebase file after ${attempts} attempts:`, err.message);
                return false;
            }
        }
    }
};

export const retryCopyFile = (source, destination, attempts = 3) => {
    let tries = 0;
    while (tries < attempts) {
        try {
            fs.copyFileSync(source, destination);
            if (fs.existsSync(destination)) {
                return true;
            }
        } catch (err) {
            tries++;
            if (tries >= attempts) {
                console.log(`Failed to copy file after ${attempts} attempts:`, err.message);
                return false;
            }
        }
    }
};

export const renameFileWithUuid = (name, originalName) => {
    const ext = path.extname(originalName);
    const safeName = name.replace(/[^a-z0-9_\-]/gi, "_").toLowerCase(); // sanitize
    const newFileName = `${safeName}${ext}`;
    const firebasePath = `cvTemplates/${newFileName}`;
    return { newFileName, firebasePath };
};

export const retryRenameFile = (source, destination, attempts = 3) => {
    for (let i = 0; i < attempts; i++) {
        try {
            fs.renameSync(source, destination);
            return true;
        } catch (err) {
            if (i === attempts - 1) {
                console.log(`Failed to rename ${source} to ${destination}:`, err.message);
                return false;
            }
        }
    }
};
