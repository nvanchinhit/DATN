const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const {
  createDoctorAccount,
  doctorLogin,
  getDoctorById,
  updateDoctor,
} = require("../controllers/doctorController");

// 📁 Cấu hình thư mục lưu ảnh bác sĩ
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "..", "public", "uploads")); // thư mục upload
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // tên file ảnh
  },
});

const upload = multer({ storage });

// ✅ Route tạo tài khoản bác sĩ
router.post("/register", createDoctorAccount);

// ✅ Route bác sĩ đăng nhập
router.post("/login", doctorLogin);

// ✅ Lấy thông tin bác sĩ theo ID
router.get("/:id", getDoctorById);

// ✅ Cập nhật thông tin bác sĩ (có thể kèm ảnh mới)
router.put("/:id", upload.single("img"), updateDoctor);

module.exports = router;
