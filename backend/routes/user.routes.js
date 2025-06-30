// backend/routes/user.routes.js

const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');


const authMiddleware = require('../middleware/auth.middleware');

const multer = require('multer');
const path = require('path');
const fs = require('fs');

// --- Cấu hình Multer để lưu trữ tệp tải lên (Giữ nguyên) ---
const UPLOAD_DIR = path.join(__dirname, '..', 'public', 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage: storage });



// Ví dụ: router.get('/', [authMiddleware, isAdmin], userController.getAllUsers);
router.get('/', userController.getAllUsers);


// --- Lấy thông tin profile của người dùng đang đăng nhập ---
// Middleware sẽ được áp dụng cho route này để xác thực người dùng
router.get('/profile', authMiddleware, userController.getProfile);

// --- Cập nhật thông tin profile (bao gồm cả avatar) ---
// Middleware xác thực, sau đó middleware `upload` xử lý file ảnh
router.put('/profile', [authMiddleware, upload.single('avatar')], userController.updateProfile);

// --- Thay đổi mật khẩu ---
// Middleware xác thực để biết đang thay đổi mật khẩu cho ai
router.post('/change-password', authMiddleware, userController.changePassword);




module.exports = router;