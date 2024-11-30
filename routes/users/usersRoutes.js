import express from "express";
import { getOneUserController, getAllUsersController, deleteUserController } from "../../controllers/users/usersController.js";
import { authenticateLoginToken } from "../../middleware/userAuthorization.js";

const router = express.Router();

router.get("/users", authenticateLoginToken, getAllUsersController);
router.get("/users/:id", getOneUserController);
router.delete("/users/:id", authenticateLoginToken, deleteUserController)

export default router;
