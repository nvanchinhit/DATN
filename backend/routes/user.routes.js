// backend/routes/user.routes.js

const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middleware/auth.middleware'); // <--- BƯỚC 1: IMPORT MIDDLEWARE

const multer = require('multer');
const path = require('path');
const fs = require('fs');

// --- Cấu hình Multer (giữ nguyên) ---
const UPLOAD_DIR = path.join(__dirname, '..', 'public', 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage: storage });


// <--- BƯỚC 2: THÊM authMiddleware VÀO GIỮA ROUTE VÀ CONTROLLER
router.get('/profile', authMiddleware, userController.getProfile);
router.put('/profile', authMiddleware, upload.single('avatar'), userController.updateProfile);
// Thay đổi từ POST sang PUT
router.put('/change-password', authMiddleware, userController.changePassword);

module.exports = router;