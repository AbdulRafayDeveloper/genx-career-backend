import express from "express";
// import { registerUser, loginUser, changePassword, forgetPassword, verifyOtp, resetPassword, resendOtp, verifyUserEmail } from "../../controllers/users/authController.js";
import { registerUser, loginUser, forgetPassword, verifyOtp, resetPassword, resendOtp, verifyUserEmail } from "../../controllers/users/authController.js";
import validateUserRegistration from "../../middleware/auth/validateUserRegistration.js";
import validateUserLogin from "../../middleware/auth/validateUserLogin.js";
import validateForgetPassword from "../../middleware/auth/validateForgetPassword.js";
import validateResetPassword from "../../middleware/auth/validateResetPassword.js";
import { verifyAdminToken, verifyOtpToken, verifyEmailToken } from "../../middleware/auth/authorizeUser.js";

const router = express.Router();

// new user creation with email verification
router.post("/register", validateUserRegistration, registerUser);
router.post("/verify-email", verifyUserEmail);
router.post("/login", validateUserLogin, loginUser);
// forget password
router.post("/forget-password", validateForgetPassword, forgetPassword);
router.post("/verify-otp", verifyOtpToken, verifyOtp);
router.post("/reset-password", validateResetPassword, verifyEmailToken, resetPassword);
router.post("/resend-otp", resendOtp);
// change password
// router.post("/changepassword", verifyAdminToken , changePassword);

export default router;
