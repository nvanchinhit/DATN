const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const multer = require("multer");

const {
  createDoctorAccount,
  doctorLogin,
  getDoctorById,
  updateDoctor,
  getAllDoctors,
  approveDoctor, // <-- Đã thêm hàm mới
} = require("../controllers/doctorController");

// ================== CẤU HÌNH MULTER ==================
const UPLOADS_DIR = path.join(__dirname, "..", "public", "uploads");

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_DIR),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

// ================== ROUTES ==================

// ✅ API: Lấy tất cả bác sĩ (KHÔNG lọc trạng thái)
router.get("/", getAllDoctors);

// ✅ API: Tạo tài khoản bác sĩ (Admin)
router.post("/register", createDoctorAccount);

// ✅ API: Đăng nhập
router.post("/login", doctorLogin);

// ✅ THÊM MỚI: API để duyệt bác sĩ
// Đặt route này trước "/:id" để Express không nhầm "approve" là một ID
router.patch("/:id/approve", approveDoctor);

// ✅ API: Lấy thông tin bác sĩ theo ID
router.get("/:id", getDoctorById);

// ✅ API: Cập nhật hồ sơ bác sĩ (ảnh, thông tin)
router.put(
  "/:id",
  upload.fields([
    { name: "img", maxCount: 1 },
    { name: "certificate_image", maxCount: 1 },
    { name: "degree_image", maxCount: 1 },
  ]),
  updateDoctor
);

module.exports = router;