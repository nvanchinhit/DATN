const multer = require('multer');
const path = require('path');

// Cấu hình nơi lưu trữ và tên file
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Luôn lưu file vào thư mục public/uploads
    cb(null, 'public/uploads/');
  },
  filename: (req, file, cb) => {
    // Tạo tên file duy nhất để tránh trùng lặp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

// Hàm kiểm tra để chỉ cho phép upload file ảnh
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new Error('Chỉ chấp nhận file ảnh!'), false);
  }
};

// Khởi tạo multer với các cấu hình trên
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 1024 * 1024 * 10 } // Giới hạn file 10MB
});

// === MIDDLEWARE QUAN TRỌNG NHẤT ===
// Middleware này được thiết kế để xử lý form "Hoàn thiện hồ sơ"
// Tên các trường ở đây PHẢI KHỚP với key trong FormData của frontend
const uploadDoctorProfile = upload.fields([
  { name: 'img', maxCount: 1 },               // Ảnh đại diện
  { name: 'degree_image', maxCount: 1 },      // Ảnh bằng cấp
  { name: 'certificate_files', maxCount: 10 } // NHIỀU file chứng chỉ
]);

// Export middleware này ra để file route có thể sử dụng
module.exports = { uploadDoctorProfile };