import express from "express";
import { getOneUserController, getAllUsersController, deleteUserController, exportUsersToExcel, userProfileUpdate, userPasswordUpdate } from "../../controllers/users/usersController.js";
import { authenticateLoginToken, userAuthenticateLoginToken } from "../../middleware/userAuthorization.js";
import { userProfilePicUpdateMiddleware } from "../../middleware/userProfilePicUpdateMiddleware.js";

const router = express.Router();

router.get("/users", authenticateLoginToken, getAllUsersController);
// router.get("/user/:id", authenticateLoginToken, getOneUserController);
router.get("/user/:id", getOneUserController);
router.get("/usersList/export", authenticateLoginToken, exportUsersToExcel);
// router.put("/userProfileUpdate/:id", userProfilePicUpdateMiddleware, authenticateLoginToken, userProfileUpdate);
router.put("/userProfileUpdate/:id", userProfilePicUpdateMiddleware, userProfileUpdate);
// router.put("/userPasswordUpdate/:id", authenticateLoginToken, userPasswordUpdate);
router.put("/userPasswordUpdate/:id", userPasswordUpdate);
router.delete("/user/:id", authenticateLoginToken, deleteUserController);

export default router;
