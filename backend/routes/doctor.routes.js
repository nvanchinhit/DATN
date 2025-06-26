const express = require("express");
const router = express.Router();
const { createDoctorAccount, doctorLogin } = require("../controllers/doctorController");

router.post("/register", createDoctorAccount); // Admin tạo tài khoản bác sĩ
router.post("/login", doctorLogin); // Bác sĩ đăng nhập

module.exports = router;
