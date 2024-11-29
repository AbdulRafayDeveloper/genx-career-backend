import express from "express";
import {
  deleteUserController,
  getAllUsersController,
  getOneUserController,
} from "../../controllers/user/usersController.js";
import { authenticateLoginToken } from "../../middleware/userAuthorization.js";

const router = express.Router();

router.get("/users", authenticateLoginToken, getAllUsersController);
router.get("/users/:id", authenticateLoginToken, getOneUserController);
router.delete("/users/:id", authenticateLoginToken, deleteUserController)

export default router;
