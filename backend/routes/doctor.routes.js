// File: backend/routes/doctors.js (PHIÊN BẢN ĐƠN GIẢN HÓA)

const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const multer = require("multer");

const authMiddleware = require('../middleware/auth.middleware');
const doctorController = require("../controllers/doctorController");

// ================== CẤU HÌNH MULTER TRỰC TIẾP ==================
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


// ================== ROUTES ==================
router.get("/", doctorController.getAllDoctors);
router.post("/register", doctorController.createDoctorAccount);
router.post("/login", doctorController.doctorLogin);
router.patch("/:id/approve", doctorController.approveDoctor);
router.get("/top", doctorController.getTopDoctors);
router.get('/all-for-admin', doctorController.getAllDoctorsForAdmin);


// ✅ === ROUTE UPDATE DUY NHẤT === ✅
// Dùng cho form "Hoàn thiện hồ sơ"
router.put(
  "/:id",
  // Cấu hình multer để nhận đúng các trường từ frontend
  upload.fields([
    { name: "img", maxCount: 1 },
    { name: 'degree_image', maxCount: 1 },
    { name: 'certificate_files', maxCount: 10 } // <<< NHẬN NHIỀU FILE
  ]),
  doctorController.updateDoctor // Dùng controller đã sửa
);
router.put(
  "/:id/profile", // <<< ĐƯỜNG DẪN MỚI
  upload.fields([
    { name: "img", maxCount: 1 },
    { name: 'degree_image', maxCount: 1 },
    { name: 'certificate_files', maxCount: 10 }
  ]),
  doctorController.updateDoctorProfile // <<< GỌI ĐÚNG HÀM CONTROLLER ĐÃ SỬA LỖI
);

// Route lấy chi tiết bác sĩ (bao gồm giá tiền)
router.get("/:id", doctorController.getDoctorById);


module.exports = router;