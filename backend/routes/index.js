// File: routes/api.js

const express = require('express');
const router = express.Router();
const db = require('../config/db.config');

const authRoutes = require('./authRoutes');
router.use('/auth', authRoutes);

// API: Lấy toàn bộ sản phẩm
router.get('/products', (req, res) => {
  db.query('SELECT * FROM products', (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
});

// API: Lấy sản phẩm theo brand_id (nếu có)
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

 
router.get('/specializations', (req, res) => {
  const sql = "SELECT id, name, image FROM specializations";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Lỗi khi truy vấn tất cả chuyên khoa:", err);
      return res.status(500).json({ error: "Lỗi server, không thể lấy dữ liệu." });
    }
    res.json(results);
  });
});

/**
 * API: LẤY THÔNG TIN CỦA MỘT CHUYÊN KHOA DỰA VÀO ID
 */
router.get('/specializations/:id', (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: 'Thiếu ID chuyên khoa.' });
  }

  const sql = "SELECT id, name, image FROM specializations WHERE id = ?";
  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error("Lỗi khi truy vấn thông tin chuyên khoa:", err);
      return res.status(500).json({ error: 'Lỗi server.' });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'Không tìm thấy chuyên khoa.' });
    }
    res.json(results[0]);
  });
});


/**
 * ✅ API ĐÃ SỬA LỖI: LẤY DANH SÁCH BÁC SĨ THEO ID CHUYÊN KHOA
 */
router.get('/doctors-by-specialization/:specializationId', (req, res) => {
  const { specializationId } = req.params;

  if (!specializationId) {
    return res.status(400).json({ error: 'Thiếu ID chuyên khoa.' });
  }

  // Thêm 'consultation_fee' vào câu lệnh SELECT
  const sql = `
    SELECT 
      id, 
      name, 
      img, 
      introduction, 
      specialization_id,
      consultation_fee,
      certificate_image AS certificate,
      degree_image AS degree
    FROM doctors 
    WHERE specialization_id = ? AND account_status = 'active'
  `;

  db.query(sql, [specializationId], (err, results) => {
    if (err) {
      console.error("Lỗi khi truy vấn danh sách bác sĩ:", err);
      return res.status(500).json({ error: 'Lỗi server, không thể lấy dữ liệu bác sĩ.' });
    }
    res.json(results);
  });
});

/**
 * API: LẤY LỊCH LÀM VIỆC CỦA MỘT BÁC SĨ
 */
router.get('/doctors/:doctorId/time-slots', (req, res) => {
  const { doctorId } = req.params;

  if (!doctorId) {
    return res.status(400).json({ error: 'Thiếu ID của bác sĩ.' });
  }

  const sql = `
    SELECT 
      slot_date, 
      start_time,
      end_time
    FROM doctor_time_slot 
    WHERE doctor_id = ? AND slot_date >= CURDATE()
    ORDER BY slot_date, start_time;
  `;

  db.query(sql, [doctorId], (err, results) => {
    if (err) {
      console.error("Lỗi khi truy vấn lịch làm việc của bác sĩ:", err);
      return res.status(500).json({ error: 'Lỗi server.' });
    }

    const groupedSlots = results.reduce((acc, slot) => {
      const date = new Date(slot.slot_date).toISOString().split('T')[0];
      const startTime = slot.start_time.substring(0, 5);
      const endTime = slot.end_time.substring(0, 5);

      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push({ start: startTime, end: endTime });
      return acc;
    }, {});

    res.json(groupedSlots);
  });
});
module.exports = router;