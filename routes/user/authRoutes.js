import express from "express";
import { registerUser, loginUser } from "../../controllers/user/authController.js";
import validateUser from "../../middleware/userValidation.js";

const router = express.Router();

router.post("/register", validateUser, registerUser);
router.post("/login", loginUser);

export default router;
