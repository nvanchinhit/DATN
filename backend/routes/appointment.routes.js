// File: routes/appointments.js

const express = require('express');
const router = express.Router();
const db = require('../config/db.config'); // Đảm bảo file này export kết nối MySQL

// Middleware kiểm tra JSON body (nếu chưa có ở app chính, nhớ thêm)
// app.use(express.json());

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
    time_slot_id
  } = req.body;

  // Kiểm tra dữ liệu bắt buộc
  if (
    !doctor_id ||
    !Number.isInteger(time_slot_id) ||
    !name ||
    age === undefined ||
    !phone ||
    !email
  ) {
    return res.status(400).json({ error: 'Thiếu hoặc sai kiểu dữ liệu bắt buộc.' });
  }

  // Kiểm tra khung giờ đã được đặt chưa
  const checkSql = `SELECT id FROM appointments WHERE time_slot_id = ?`;
  db.query(checkSql, [time_slot_id], (err, booked) => {
    if (err) {
      console.error('❌ Lỗi kiểm tra trùng lịch:', err);
      return res.status(500).json({ error: 'Lỗi kiểm tra lịch trùng.' });
    }

    if (booked.length > 0) {
      return res.status(409).json({ error: 'Khung giờ này đã có người đặt.' });
    }

    // Lưu lịch hẹn với address
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

        return res.status(201).json({
          message: '✅ Đặt lịch thành công!',
          appointmentId: result.insertId
        });
      }
    );
  });
});


module.exports = router;
