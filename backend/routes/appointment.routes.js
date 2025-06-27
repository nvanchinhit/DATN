// File: routes/appointments.js
const express = require('express');
const router = express.Router();
const db = require('../config/db.config');

// =========================
// ĐẶT LỊCH KHÁM MỚI (POST)
// =========================
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
    payment_status = 'Chưa thanh toán',
    status = 'Chưa xác nhận',
    time_slot_id,
  } = req.body;

  if (
    !doctor_id ||
    !Number.isInteger(time_slot_id) ||
    !name ||
    typeof age === 'undefined' ||
    !phone ||
    !email
  ) {
    return res.status(400).json({ error: 'Thiếu hoặc sai kiểu dữ liệu bắt buộc.' });
  }

  const checkSql = `SELECT id FROM appointments WHERE time_slot_id = ?`;
  db.query(checkSql, [time_slot_id], (err, booked) => {
    if (err) {
      console.error('❌ Lỗi kiểm tra trùng lịch:', err);
      return res.status(500).json({ error: 'Lỗi kiểm tra lịch trùng.' });
    }

    if (booked.length > 0) {
      return res.status(409).json({ error: 'Khung giờ này đã có người đặt.' });
    }

    const insertSql = `
      INSERT INTO appointments
      (doctor_id, time_slot_id, name, age, gender, email, phone, reason, payment_status, doctor_confirmation, status, address)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'Chưa xác nhận', ?, ?)
    `;

    db.query(
      insertSql,
      [doctor_id, time_slot_id, name, age, gender, email, phone, reason, payment_status, status, address],
      (err, result) => {
        if (err) {
          console.error('❌ Lỗi khi lưu lịch hẹn:', err);
          return res.status(500).json({ error: 'Không thể lưu lịch hẹn.' });
        }

        res.status(201).json({
          message: '✅ Đặt lịch thành công!',
          appointmentId: result.insertId,
        });
      }
    );
  });
});


// ==============================
// LẤY CHI TIẾT LỊCH THEO SLOT_ID
// ==============================
router.get('/slot/:slotId', (req, res) => {
  const slotId = req.params.slotId;
  const sql = `
    SELECT 
      a.id, a.reason, a.payment_status, a.doctor_confirmation, a.status, a.address,
      a.name AS patient_name, a.email, a.phone
    FROM appointments a
    WHERE a.time_slot_id = ?
    LIMIT 1
  `;
  db.query(sql, [slotId], (err, results) => {
    if (err) return res.status(500).json({ error: 'Lỗi server khi truy vấn' });
    if (results.length === 0) return res.status(404).json({ error: 'Không có lịch hẹn nào cho slot này' });
    res.json(results[0]);
  });
});


// ==============================
// BÁC SĨ XÁC NHẬN LỊCH KHÁM
// ==============================
router.put('/:id/confirm', (req, res) => {
  const id = req.params.id;
  db.query(
    "UPDATE appointments SET doctor_confirmation = 'Đã xác nhận' WHERE id = ?",
    [id],
    (err, result) => {
      if (err) return res.status(500).json({ error: 'Lỗi khi xác nhận' });
      if (result.affectedRows === 0) return res.status(404).json({ error: 'Không tìm thấy lịch hẹn' });
      res.json({ message: '✅ Đã xác nhận lịch hẹn!' });
    }
  );
});

module.exports = router;
