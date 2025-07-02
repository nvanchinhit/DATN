const express = require("express");
const router = express.Router();
const { register, login, verifyEmail, forgotPassword, resetPassword, resendVerification, sendPrescription } = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);
router.get("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/resend-verification", resendVerification); // ← THÊM MỚI
router.post('/medical-records/send-prescription', sendPrescription);

module.exports = router;
