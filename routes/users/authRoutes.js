import express from "express";
import { registerUser, loginUser, changePassword, forgetPassword, verifyOtp, resetPassword, verifyUserEmail } from "../../controllers/users/authController.js";
import userRegisterValidation from "../../middleware/userRegisterValidation.js";
import userLoginValidation from "../../middleware/userLoginValidation.js";
import { authenticateLoginToken, authenticateOtpToken, authenticateEmailToken } from "../../middleware/userAuthorization.js";

const router = express.Router();

router.post("/register", userRegisterValidation, registerUser);
router.post("/verify-email", verifyUserEmail);
router.post("/login", userLoginValidation, loginUser);
router.post("/forgetpassword", forgetPassword);
router.post("/verifyotp", authenticateOtpToken, verifyOtp);
router.post("/resetpassword", authenticateEmailToken, resetPassword);
router.post("/changepassword", authenticateLoginToken, changePassword);


export default router;
