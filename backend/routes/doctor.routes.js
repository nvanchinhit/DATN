// routes/doctors.js

const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const multer = require("multer");

const {
  createDoctorAccount,
  doctorLogin,
  getDoctorById,
  updateDoctor, // Dành cho complete-profile
  updateDoctorProfile, // Dành cho update-profile
  getAllDoctors,
  approveDoctor,
  getTopDoctors,
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

// Middleware cho "update profile" - chỉ cần 2 trường ảnh
const updateProfileUploadMiddleware = upload.fields([
  { name: 'degree_images', maxCount: 1 },
  { name: 'certificate_images', maxCount: 1 }
]);

// ================== ROUTES ==================
router.get("/", getAllDoctors);
router.post("/register", createDoctorAccount);
router.post("/login", doctorLogin);
router.patch("/:id/approve", approveDoctor);
router.get("/top", getTopDoctors);
router.get("/:id", getDoctorById);

// --- ROUTE cho COMPLETE-PROFILE ---
// Dùng để hoàn thiện hồ sơ lần đầu
router.put(
  "/:id",
  upload.fields([
    { name: "img", maxCount: 1 },
    { name: "certificate_image", maxCount: 1 },
    { name: "degree_image", maxCount: 1 },
  ]),
  updateDoctor
);

// --- ROUTE MỚI cho UPDATE-PROFILE ---
// Dùng để chỉnh sửa hồ sơ đã có
router.put(
  "/:id/profile",
  updateProfileUploadMiddleware,
  updateDoctorProfile
);

module.exports = router;