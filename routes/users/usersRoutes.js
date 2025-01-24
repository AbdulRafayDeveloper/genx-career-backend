import express from "express";
import { getOneUserController, getAllUsersController, deleteUserController, exportUsersToExcel } from "../../controllers/users/usersController.js";
import { authenticateLoginToken } from "../../middleware/userAuthorization.js";

const router = express.Router();

router.get("/users", authenticateLoginToken, getAllUsersController);
router.get("/users/:id", getOneUserController);
router.get("/usersList/export", authenticateLoginToken, exportUsersToExcel);
router.delete("/user/:id", authenticateLoginToken, deleteUserController)

export default router;
