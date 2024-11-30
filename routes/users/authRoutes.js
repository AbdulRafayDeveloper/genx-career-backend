import express from "express";
import { registerUser, loginUser } from "../../controllers/users/authController.js";
import userRegisterValidation from "../../middleware/userRegisterValidation.js";
import userLoginValidation from "../../middleware/userLoginValidation.js";

const router = express.Router();

router.post("/register", userRegisterValidation, registerUser);
router.post("/login", userLoginValidation, loginUser);

export default router;
