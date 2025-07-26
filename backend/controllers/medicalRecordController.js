// routes/medical-records.js


const db = require('../config/db.config');
// controllers/medicalRecordController.js
const getRecordsByCustomer = (req, res) => {
  const { customerId } = req.params;
  const sql = `
    SELECT 
      a.id AS appointment_id,
      a.name AS patient_name,
      a.age,
      a.gender,
      a.email AS patient_email,
      a.phone,
      a.reason,
      a.doctor_id,
      a.status,
      a.address,
      a.doctor_confirmation,
      a.doctor_note,
      a.diagnosis,
      a.follow_up_date,
      a.is_examined,
      a.time_slot_id,
      dts.start_time,
      dts.end_time,
      c.name AS customer_name -- tên tài khoản đặt lịch
    FROM appointments a
    JOIN customers c ON a.customer_id = c.id
    LEFT JOIN doctor_time_slot dts ON a.time_slot_id = dts.id
    WHERE a.customer_id = ?
    ORDER BY a.id DESC
  `;
  db.query(sql, [customerId], (err, results) => {
    if (err) {
      console.error('Lỗi khi lấy hồ sơ theo customer:', err);
      return res.status(500).json({ error: 'Lỗi khi lấy hồ sơ bệnh án theo bệnh nhân.' });
    }
    res.json(results);
  });
};

module.exports = {
  getRecordsByCustomer
};

