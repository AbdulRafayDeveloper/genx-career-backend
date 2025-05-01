import express from "express";
import { getOneUserController, getAllUsersController, deleteUserController, exportUsersToExcel, userProfileUpdate, userPasswordUpdate } from "../../controllers/users/usersController.js";
import { verifyAdminToken, restrictAdminUser } from "../../middleware/auth/authorizeUser.js";
import { handleProfilePicUpload } from "../../middleware/users/handleProfilePicUpload.js";

const router = express.Router();

router.get("/users", verifyAdminToken, getAllUsersController);
router.get("/user/:id", getOneUserController);
router.get("/users-list/export", verifyAdminToken, exportUsersToExcel);
router.put("/user-profile-update/:id", restrictAdminUser, handleProfilePicUpload, userProfileUpdate);
router.put("/user-password-update/:id", restrictAdminUser, userPasswordUpdate);
router.delete("/user/:id", verifyAdminToken, deleteUserController);

export default router;
