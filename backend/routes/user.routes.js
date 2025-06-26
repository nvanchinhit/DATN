// backend/routes/user.routes.js

const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middleware/auth.middleware');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Cấu hình Multer để lưu trữ tệp tải lên
const UPLOAD_DIR = path.join(__dirname, '..', 'public', 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage: storage });

// Tất cả các route trong tệp này đều được bảo vệ
router.use(authMiddleware.verifyToken);

// --- Định tuyến cho hồ sơ người dùng ---

// GET /api/users/profile
router.get('/profile', userController.getProfile);

// PUT /api/users/profile - Dùng upload.single('avatar') để xử lý file có tên 'avatar'
router.put('/profile', upload.single('avatar'), userController.updateProfile);

// [MỚI] POST /api/users/change-password - Route để đổi mật khẩu
router.post('/change-password', userController.changePassword);

module.exports = router;