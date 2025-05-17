import express from "express";
import { getOneUserController, getAllUsersController, deleteUserController, exportUsersToExcel, userProfileUpdate, userPasswordUpdate } from "../../controllers/users/usersController.js";
import { verifyAdminToken, restrictAdminUser } from "../../middleware/auth/authorizeUser.js";
import { handleProfilePicUpload } from "../../middleware/users/handleProfilePicUpload.js";
import validateProfileUpdate from "../../middleware/auth/validateProfileUpdate.js";
import validatePasswordUpdate from "../../middleware/auth/validatePasswordUpdate.js";

const router = express.Router();

router.get("/users", verifyAdminToken, getAllUsersController);
router.get("/user/:id", getOneUserController);
router.get("/users-list/export", verifyAdminToken, exportUsersToExcel);
router.put("/user-profile-update/:id", restrictAdminUser, handleProfilePicUpload, validateProfileUpdate, userProfileUpdate);
router.put("/user-password-update/:id", restrictAdminUser, validatePasswordUpdate, userPasswordUpdate);
router.delete("/user/:id", verifyAdminToken, deleteUserController);

export default router;
