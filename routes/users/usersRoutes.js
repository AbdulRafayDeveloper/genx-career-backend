import express from "express";
import { getOneUserController, getAllUsersController, deleteUserController, exportUsersToExcel, userProfileUpdate, userPasswordUpdate } from "../../controllers/users/usersController.js";
import { authenticateLoginToken, userAuthenticateLoginToken } from "../../middleware/userAuthorization.js";
import { userProfilePicUpdateMiddleware } from "../../middleware/userProfilePicUpdateMiddleware.js";

const router = express.Router();

router.get("/users", authenticateLoginToken, getAllUsersController);
router.get("/user/:id", getOneUserController);
router.get("/users-list/export", authenticateLoginToken, exportUsersToExcel);
router.put("/user-profile-update/:id", userProfilePicUpdateMiddleware, userProfileUpdate);
router.put("/user-password-update/:id", userPasswordUpdate);
router.delete("/user/:id", authenticateLoginToken, deleteUserController);

export default router;
