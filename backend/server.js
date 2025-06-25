// backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(cors()); // Cho phép request từ frontend
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Phục vụ các tệp tĩnh (ảnh đã upload) từ thư mục public/uploads
// Khi frontend gọi /uploads/ten-anh.png, nó sẽ lấy từ backend/public/uploads/ten-anh.png
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Router chính
const mainRouter = require('./routes/index');
app.use('/api', mainRouter); // Tất cả các API sẽ có tiền tố /api

// Khởi động server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Backend server đang chạy tại http://localhost:${PORT}`);
});