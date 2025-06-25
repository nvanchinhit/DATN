const express = require("express");
const router = express.Router();
const { register, login, verifyEmail, forgotPassword, resetPassword, resendVerification } = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);
router.get("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/resend-verification", resendVerification); // ← THÊM MỚI

module.exports = router;
