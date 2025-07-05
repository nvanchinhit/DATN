// routes/doctors.js

const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const multer = require("multer");

// <<< THÊM VÀO: Middleware để bảo vệ route của admin >>>
const authMiddleware = require('../middleware/auth.middleware');

const {
  createDoctorAccount,
  doctorLogin,
  getDoctorById,
  updateDoctor,
  updateDoctorProfile,
  getAllDoctors,
  approveDoctor,
  getTopDoctors,
  getAllDoctorsForAdmin // <<< ĐẢM BẢO ĐÃ THÊM HÀM MỚI VÀO ĐÂY
} = require("../controllers/doctorController");

// ================== CẤU HÌNH MULTER ==================
const UPLOADS_DIR = path.join(__dirname, "..", "public", "uploads");
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_DIR),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

const updateProfileUploadMiddleware = upload.fields([
  { name: 'degree_images', maxCount: 1 },
  { name: 'certificate_images', maxCount: 10 } // <-- Cập nhật ở đây
]);

// ================== ROUTES ==================
router.get("/", getAllDoctors);
router.post("/register", createDoctorAccount);
router.post("/login", doctorLogin);
router.patch("/:id/approve", approveDoctor);
router.get("/top", getTopDoctors);

// <<< ROUTE MỚI DÀNH CHO ADMIN >>>
// Lấy TẤT CẢ bác sĩ cho trang quản lý
// URL sẽ là: GET http://localhost:5000/api/doctors/all-for-admin
router.get(
    '/all-for-admin',
    authMiddleware,
    authMiddleware.isAdmin,
    getAllDoctorsForAdmin
);

// Lưu ý: Đặt route có tham số :id ở dưới cùng để tránh xung đột
router.get("/:id", getDoctorById);

router.put(
  "/:id",
  upload.fields([
    { name: "img", maxCount: 1 },
    { name: "certificate_image", maxCount: 1 },
    { name: "degree_image", maxCount: 1 },
  ]),
  updateDoctor
);

router.put(
  "/:id/profile",
  updateProfileUploadMiddleware,
  updateDoctorProfile
);


module.exports = router;