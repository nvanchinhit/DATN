const express = require('express');
const router = express.Router();
const db = require('../config/db.config');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// ================== CẤU HÌNH UPLOAD ẢNH ==================
const UPLOAD_DIR = path.join(__dirname, '../public/uploads');

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_DIR);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// ================== XÁC THỰC ==================
const authRoutes = require('./authRoutes');
router.use('/auth', authRoutes);

// ================== API SẢN PHẨM ==================
router.get('/products', (req, res) => {
  db.query('SELECT * FROM products', (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
});

router.get('/products-by-brand', (req, res) => {
  const { brand_id } = req.query;
  const sql = brand_id
    ? 'SELECT * FROM products WHERE brand_id = ?'
    : 'SELECT * FROM products';
  const values = brand_id ? [brand_id] : [];
  db.query(sql, values, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
});

// ================== API BÁC SĨ & LỊCH KHÁM ==================
router.get('/doctors-by-specialization/:specializationId', (req, res) => {
  const { specializationId } = req.params;
  if (!specializationId) return res.status(400).json({ error: 'Thiếu ID chuyên khoa.' });

  const sql = `
    SELECT 
      id, name, img, introduction, specialization_id,
      consultation_fee, certificate_image AS certificate, degree_image AS degree
    FROM doctors 
    WHERE specialization_id = ? AND account_status = 'active'
  `;
  db.query(sql, [specializationId], (err, results) => {
    if (err) {
      console.error("Lỗi truy vấn bác sĩ:", err);
      return res.status(500).json({ error: 'Lỗi server.' });
    }
    res.json(results);
  });
});

router.get('/doctors/:doctorId/time-slots', (req, res) => {
  const { doctorId } = req.params;
  if (!doctorId) return res.status(400).json({ error: 'Thiếu ID bác sĩ.' });

  const sql = `
    SELECT slot_date, start_time, end_time
    FROM doctor_time_slot 
    WHERE doctor_id = ? AND slot_date >= CURDATE()
    ORDER BY slot_date, start_time
  `;
  db.query(sql, [doctorId], (err, results) => {
    if (err) {
      console.error("Lỗi truy vấn slot:", err);
      return res.status(500).json({ error: 'Lỗi server.' });
    }

    const groupedSlots = results.reduce((acc, slot) => {
      const date = new Date(slot.slot_date).toISOString().split('T')[0];
      const start = slot.start_time.substring(0, 5);
      const end = slot.end_time.substring(0, 5);
      if (!acc[date]) acc[date] = [];
      acc[date].push({ start, end });
      return acc;
    }, {});
    res.json(groupedSlots);
  });
});

// ================== API CHUYÊN KHOA (CRUD) ==================

// Lấy tất cả chuyên khoa
router.get('/specializations', (req, res) => {
  const sql = "SELECT id, name, image FROM specializations";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Lỗi lấy chuyên khoa:", err);
      return res.status(500).json({ error: "Lỗi server." });
    }
    res.json(results);
  });
});

// Lấy 1 chuyên khoa theo ID
router.get('/specializations/:id', (req, res) => {
  const { id } = req.params;
  const sql = "SELECT id, name, image FROM specializations WHERE id = ?";
  db.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ error: 'Lỗi server.' });
    if (results.length === 0) return res.status(404).json({ error: 'Không tìm thấy.' });
    res.json(results[0]);
  });
});

// Thêm chuyên khoa
router.post('/specializations', upload.single('image'), (req, res) => {
  const { name } = req.body;
  if (!req.file) return res.status(400).json({ error: 'Vui lòng tải ảnh.' });
  if (!name) return res.status(400).json({ error: 'Thiếu tên chuyên khoa.' });

  const imageUrl = `/uploads/${req.file.filename}`;
  const sql = 'INSERT INTO specializations (name, image) VALUES (?, ?)';
  db.query(sql, [name, imageUrl], (err, result) => {
    if (err) return res.status(500).json({ error: 'Lỗi khi thêm chuyên khoa.' });
    res.status(201).json({
      message: 'Thêm thành công!',
      newSpecialization: { id: result.insertId, name, image: imageUrl }
    });
  });
});

// Cập nhật chuyên khoa
router.put('/specializations/:id', upload.single('image'), (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'Tên là bắt buộc.' });

  if (req.file) {
    const imageUrl = `/uploads/${req.file.filename}`;
    const sql = 'UPDATE specializations SET name = ?, image = ? WHERE id = ?';
    db.query(sql, [name, imageUrl, id], (err, result) => {
      if (err) return res.status(500).json({ error: 'Lỗi cập nhật.' });
      if (result.affectedRows === 0) return res.status(404).json({ error: 'Không tìm thấy chuyên khoa.' });
      res.json({ message: 'Cập nhật thành công!' });
    });
  } else {
    const sql = 'UPDATE specializations SET name = ? WHERE id = ?';
    db.query(sql, [name, id], (err, result) => {
      if (err) return res.status(500).json({ error: 'Lỗi cập nhật.' });
      if (result.affectedRows === 0) return res.status(404).json({ error: 'Không tìm thấy chuyên khoa.' });
      res.json({ message: 'Cập nhật tên thành công!' });
    });
  }
});

// Xóa chuyên khoa
router.delete('/specializations/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM specializations WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Lỗi xóa.' });
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Không tìm thấy chuyên khoa.' });
    res.json({ message: 'Xóa thành công!' });
  });
});

module.exports = router;
