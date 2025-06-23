require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// ────────────────── MIDDLEWARE CƠ BẢN ──────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ────────────────── PHỤC VỤ ẢNH /uploads ──────────────────
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// ────────────────── KHAI BÁO ROUTER ──────────────────
/* Node sẽ tìm backend/routes/index.js tự động */
const router = require('./routes');
app.use('/api', router);

// (Tuỳ chọn) nếu bạn còn dùng ảnh tĩnh khác:
app.use('/images', express.static(path.join(__dirname, 'public/images')));

// ────────────────── KHỞI ĐỘNG SERVER ──────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Backend chạy tại http://localhost:${PORT}`);
});
