// File: routes/appointments.js
const express = require('express');
const router = express.Router();
const db = require('../config/db.config');

router.post('/', (req, res) => {
  const {
    doctor_id,
    name,
    age,
    gender,
    email,
    phone,
    reason,
    address,
    time_slot_id,
    customer_id // Nhận ID
  } = req.body;

  // ==========================================================
  // CHẶN Ở ĐÂY: Thêm bước kiểm tra customer_id
  // ==========================================================
  if (!customer_id) {
    return res.status(401).json({ error: 'Yêu cầu không hợp lệ. Vui lòng đăng nhập để đặt lịch.' });
  }

  if (!doctor_id || !Number.isInteger(time_slot_id) || !name || !age || !phone || !email) {
    return res.status(400).json({ error: 'Thiếu hoặc sai kiểu dữ liệu bắt buộc.' });
  }

  // 3. Kiểm tra trùng lịch (giữ nguyên)
  const checkSql = `SELECT id FROM appointments WHERE time_slot_id = ?`;
  db.query(checkSql, [time_slot_id], (err, booked) => {
    if (err) {
      return res.status(500).json({ error: 'Lỗi máy chủ.' });
    }
    if (booked.length > 0) {
      return res.status(409).json({ error: 'Khung giờ này đã có người đặt.' });
    }

    // 4. Thêm lịch hẹn mới (giữ nguyên)
    const insertSql = `
      INSERT INTO appointments (doctor_id, time_slot_id, customer_id, name, age, gender, email, phone, reason, address, status, doctor_confirmation)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Chưa xác nhận', 'Chưa xác nhận')
    `;
    db.query(insertSql, [doctor_id, time_slot_id, customer_id, name, age, gender, email, phone, reason, address], (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Không thể tạo lịch hẹn.' });
      }
      res.status(201).json({
        message: '✅ Đặt lịch thành công!',
        appointmentId: result.insertId,
      });
    });
  });
});

module.exports = router;