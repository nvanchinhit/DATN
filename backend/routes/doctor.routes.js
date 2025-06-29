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
  approveDoctor,
  getTopDoctors,
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

router.get("/", getAllDoctors);

router.post("/register", createDoctorAccount);

router.post("/login", doctorLogin);

router.patch("/:id/approve", approveDoctor);
router.get("/top", getTopDoctors)
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

module.exports = router;