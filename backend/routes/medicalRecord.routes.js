// File: routes/medicalRecords.js
const express = require('express');
const router = express.Router();
const db = require('../config/db.config');

// LẤY DANH SÁCH BỆNH NHÂN CHO BÁC SĨ (GET)
// =================================================================================
router.get('/doctor/:doctorId', (req, res) => {
  const { doctorId } = req.params;

  // SỬA LỖI:
  // 1. Thêm a.customer_id vào SELECT để đảm bảo có đủ dữ liệu cho việc tạo hồ sơ.
  // 2. Chỉ định rõ `a.id` trong `ORDER BY` để tránh lỗi cột không rõ ràng.
  const sql = `
    SELECT 
      a.id AS appointment_id,
      a.name AS patient_name,
      a.reason,
      a.customer_id,
      a.doctor_id,
      mr.id AS medical_record_id,
      mr.diagnosis,
      mr.treatment,
      mr.notes,
      mr.created_at,
      c.name AS customer_name, -- lấy tên tài khoản đặt lịch
      c.email AS patient_email
    FROM appointments a
    LEFT JOIN medical_records mr ON a.id = mr.appointment_id
    JOIN customers c ON a.customer_id = c.id
    WHERE a.doctor_id = ? AND a.status = 'Đã xác nhận'
    ORDER BY a.id DESC;
  `;

  db.query(sql, [doctorId], (err, results) => {
    if (err) {
      // Log lỗi chi tiết ra console của server để debug
      console.error("❌ Lỗi truy vấn SQL danh sách bệnh nhân:", err);
      // Trả về một thông báo lỗi chung cho client
      return res.status(500).json({ error: 'Lỗi máy chủ khi lấy dữ liệu bệnh nhân. Vui lòng kiểm tra log server.' });
    }
    res.status(200).json(results);
  });
});

// =================================================================================
// TẠO HỒ SƠ BỆNH ÁN MỚI (POST) - Giữ nguyên, không có lỗi
// =================================================================================
router.post('/', (req, res) => {
  const {
    appointment_id,
    doctor_id,
    customer_id,
    diagnosis,
    treatment,
    notes
  } = req.body;

  if (!appointment_id || !doctor_id || !customer_id || !diagnosis || !treatment) {
    return res.status(400).json({ error: 'Vui lòng cung cấp đủ thông tin bắt buộc: appointment_id, doctor_id, customer_id, diagnosis, treatment.' });
  }

  const checkSql = "SELECT id FROM medical_records WHERE appointment_id = ?";
  db.query(checkSql, [appointment_id], (err, existing) => {
    if (err) {
      console.error("❌ Lỗi kiểm tra hồ sơ:", err);
      return res.status(500).json({ error: 'Lỗi máy chủ khi kiểm tra hồ sơ.' });
    }
    if (existing.length > 0) {
      return res.status(409).json({ error: 'Hồ sơ bệnh án cho lịch hẹn này đã tồn tại.' });
    }

    const insertSql = `
      INSERT INTO medical_records 
      (appointment_id, doctor_id, customer_id, diagnosis, treatment, notes, created_at)
      VALUES (?, ?, ?, ?, ?, ?, NOW())
    `;
    
    db.query(
      insertSql,
      [appointment_id, doctor_id, customer_id, diagnosis, treatment, notes],
      (err, result) => {
        if (err) {
          console.error("❌ Lỗi khi tạo hồ sơ bệnh án:", err);
          return res.status(500).json({ error: 'Không thể tạo hồ sơ bệnh án.' });
        }
        res.status(201).json({ 
            message: '✅ Đã tạo hồ sơ bệnh án thành công!', 
            recordId: result.insertId 
        });
      }
    );
  });
});


// Import controller đúng chuẩn
const medicalRecordController = require('../controllers/medicalRecordController');

// Route lấy lịch sử hồ sơ bệnh án theo customerId
router.get('/history/:customerId', medicalRecordController.getRecordsByCustomer);

module.exports = router;