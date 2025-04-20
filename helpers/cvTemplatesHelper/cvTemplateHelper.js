import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { badRequestResponse, serverErrorResponse } from "../apiResponsesHelpers.js";

export const retryDeleteFile = (filePath, attempts = 3) => {
    let tries = 0;
    while (tries < attempts) {
        try {
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
            return true;
        } catch (err) {
            tries++;
            if (tries >= attempts) {
                console.log(`Failed to delete file after ${attempts} attempts:`, err.message);
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

export const renameFileWithUuid = (sourceFilePath, destinationDir) => {
    try {
        const ext = path.extname(sourceFilePath);  // Get the file extension
        const uniqueFileName = uuidv4() + ext;    // Generate a unique file name
        const destinationPath = path.join(destinationDir, uniqueFileName);

        // Rename the file by moving it to the destination folder with a new name
        const renameSuccess = retryRenameFile(sourceFilePath, destinationPath);
        if (!renameSuccess) {
            throw new Error("Failed to rename file");
        }

        return { success: true, newFileName: uniqueFileName, newFilePath: destinationPath };
    } catch (error) {
        console.log("Error in renameFileWithUuid:", error.message);
        return { success: false, error: error.message };
    }
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
