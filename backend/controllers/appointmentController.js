// controllers/appointmentController.js
const db = require('../config/db.config');

exports.createAppointment = (req, res) => {
  const {
    name,
    age,
    gender,
    email,
    phone,
    doctor_id,
    reason,
    payment_status,
    status,
    time_slot_id // Nếu chưa dùng có thể để null
  } = req.body;

  const sql = `
    INSERT INTO appointments 
      (name, age, gender, email, phone, doctor_id, reason, payment_status, status, time_slot_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    name, age, gender, email, phone,
    doctor_id, reason, payment_status, status, time_slot_id
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Lỗi thêm lịch hẹn:', err);
      return res.status(500).json({ error: 'Không thể tạo lịch hẹn.' });
    }
    res.status(201).json({ message: 'Đặt lịch thành công!', id: result.insertId });
  });
};
