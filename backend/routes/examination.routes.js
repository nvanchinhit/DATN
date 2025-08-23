const express = require('express');
const router = express.Router();
const db = require('../config/db.config');
const authMiddleware = require('../middleware/auth.middleware');
const { isDoctor } = require('../middleware/auth.middleware');

/**
 * ==========================================================
 * ROUTE 1: LƯU HỒ SƠ Y TẾ (Nháp hoặc hoàn thành)
 * METHOD: POST /api/medical/save
 * ==========================================================
 */
router.post('/save', [authMiddleware, isDoctor], (req, res) => {
  console.log('=== MEDICAL SAVE REQUEST ===');
  console.log('Request body:', req.body);
  console.log('User ID:', req.user.id);

  const {
    appointmentId,
    patientId,
    vitalSigns,
    symptoms,
    allergies,
    medications,
    notes,
    diagnosis,
    recommendations,
    followUpDate,
    status = 'draft'
  } = req.body;

  const doctorId = req.user.id;

  if (!appointmentId || !patientId || !diagnosis) {
    return res.status(400).json({
      message: "Thiếu thông tin bắt buộc: appointmentId, patientId, diagnosis"
    });
  }

  const checkSql = `
    SELECT id FROM medical_records 
    WHERE appointment_id = ? AND doctor_id = ?
  `;

  db.query(checkSql, [appointmentId, doctorId], (err, results) => {
    if (err) {
      console.error("Error checking existing medical record:", err);
      return res.status(500).json({ message: "Lỗi máy chủ khi kiểm tra dữ liệu." });
    }

    if (results.length > 0) {
      // Cập nhật hồ sơ y tế
             const updateSql = `
         UPDATE medical_records SET
           temperature = ?,
           blood_pressure = ?,
           heart_rate = ?,
           weight = ?,
           height = ?,
           symptoms = ?,
           notes = ?,
           allergies = ?,
           medications = ?,
           diagnosis = ?,
           recommendations = ?,
           follow_up_date = ?,
           status = ?,
           updated_at = CURRENT_TIMESTAMP
         WHERE appointment_id = ? AND doctor_id = ?
       `;

             const updateValues = [
         vitalSigns?.temperature || null,
         vitalSigns?.bloodPressure || null,
         vitalSigns?.heartRate || null,
         vitalSigns?.weight || null,
         vitalSigns?.height || null,
         JSON.stringify(symptoms || []),
         notes || null,
         JSON.stringify(allergies || []),
         JSON.stringify(medications || []),
         diagnosis,
         recommendations || null,
         followUpDate || null,
         status,
         appointmentId,
         doctorId
       ];

      db.query(updateSql, updateValues, (updateErr, updateResult) => {
        if (updateErr) {
          console.error("Error updating medical record:", updateErr);
          return res.status(500).json({
            message: "Lỗi máy chủ khi cập nhật hồ sơ y tế.",
            error: updateErr.message
          });
        }

        res.json({
          message: "Cập nhật hồ sơ y tế thành công!",
          recordId: results[0].id,
          action: 'updated'
        });
      });
    } else {
      // Tạo mới hồ sơ y tế
             const insertSql = `
         INSERT INTO medical_records (
           appointment_id, doctor_id, patient_id,
           temperature, blood_pressure, heart_rate, weight, height,
           symptoms, notes, allergies, medications,
           diagnosis, recommendations, follow_up_date, status, created_at
         ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
       `;

             const insertValues = [
         appointmentId,
         doctorId,
         patientId,
         vitalSigns?.temperature || null,
         vitalSigns?.bloodPressure || null,
         vitalSigns?.heartRate || null,
         vitalSigns?.weight || null,
         vitalSigns?.height || null,
         JSON.stringify(symptoms || []),
         notes || null,
         JSON.stringify(allergies || []),
         JSON.stringify(medications || []),
         diagnosis,
         recommendations || null,
         followUpDate || null,
         status
       ];

      db.query(insertSql, insertValues, (insertErr, insertResult) => {
        if (insertErr) {
          console.error("Error creating medical record:", insertErr);
          return res.status(500).json({
            message: "Lỗi máy chủ khi tạo hồ sơ y tế.",
            error: insertErr.message
          });
        }

        res.json({
          message: "Lưu hồ sơ y tế thành công!",
          recordId: insertResult.insertId,
          action: 'created'
        });
      });
    }
  });
});

/**
 * ==========================================================
 * ROUTE 2: LẤY HỒ SƠ Y TẾ THEO APPOINTMENT
 * METHOD: GET /api/medical/:appointmentId
 * ==========================================================
 */
router.get('/:appointmentId', [authMiddleware, isDoctor], (req, res) => {
  const { appointmentId } = req.params;
  const doctorId = req.user.id;

  const sql = `
    SELECT 
      mr.*,
      a.customer_id,
      a.name as patient_name,
      a.age,
      a.gender,
      a.email,
      a.phone,
      a.address,
      a.reason,
      d.name as doctor_name,
      d.room_number,
      ts.slot_date,
      ts.start_time,
      ts.end_time
    FROM medical_records mr
    LEFT JOIN appointments a ON mr.appointment_id = a.id
    LEFT JOIN doctors d ON mr.doctor_id = d.id
    LEFT JOIN doctor_time_slot ts ON a.time_slot_id = ts.id
    WHERE mr.appointment_id = ? AND mr.doctor_id = ?
  `;

  db.query(sql, [appointmentId, doctorId], (err, results) => {
    if (err) {
      console.error("Error fetching medical record:", err);
      return res.status(500).json({ message: "Lỗi máy chủ khi lấy hồ sơ y tế." });
    }

    if (results.length === 0) {
      return res.json({
        message: "Chưa có hồ sơ y tế cho cuộc hẹn này.",
        hasRecord: false
      });
    }

    const record = results[0];

    try {
      record.symptoms = JSON.parse(record.symptoms || '[]');
      record.allergies = JSON.parse(record.allergies || '[]');
      record.medications = JSON.parse(record.medications || '[]');
    } catch (e) {
      record.symptoms = [];
      record.allergies = [];
      record.medications = [];
    }

    res.json({
      message: "Lấy hồ sơ y tế thành công!",
      hasRecord: true,
      record: record
    });
  });
});

/**
 * ==========================================================
 * ROUTE 3: LẤY HỒ SƠ Y TẾ THEO APPOINTMENT ID
 * METHOD: GET /api/examination/:appointmentId
 * ==========================================================
 */
router.get('/:appointmentId', [authMiddleware, isDoctor], (req, res) => {
  const { appointmentId } = req.params;
  const doctorId = req.user.id;

  const sql = `
    SELECT 
      mr.*,
      a.name as patient_name,
      a.age,
      a.gender,
      ts.slot_date,
      ts.start_time,
      ts.end_time
    FROM medical_records mr
    LEFT JOIN appointments a ON mr.appointment_id = a.id
    LEFT JOIN doctor_time_slot ts ON a.time_slot_id = ts.id
    WHERE mr.appointment_id = ? AND mr.doctor_id = ?
    ORDER BY mr.created_at DESC
    LIMIT 1
  `;

  db.query(sql, [appointmentId, doctorId], (err, results) => {
    if (err) {
      console.error("Error fetching medical record:", err);
      return res.status(500).json({ message: "Lỗi máy chủ khi lấy hồ sơ y tế." });
    }

    if (results.length === 0) {
      return res.json({
        message: "Không có hồ sơ y tế cho cuộc hẹn này.",
        hasRecord: false
      });
    }

    const record = results[0];

    try {
      record.symptoms = JSON.parse(record.symptoms || '[]');
      record.allergies = JSON.parse(record.allergies || '[]');
      record.medications = JSON.parse(record.medications || '[]');
    } catch (e) {
      record.symptoms = [];
      record.allergies = [];
      record.medications = [];
    }

    res.json({
      message: "Lấy hồ sơ y tế thành công!",
      hasRecord: true,
      record: record
    });
  });
});

/**
 * ==========================================================
 * ROUTE 4: LẤY LỊCH SỬ HỒ SƠ Y TẾ CỦA BỆNH NHÂN
 * METHOD: GET /api/examination/patient/:patientId
 * ==========================================================
 */
router.get('/patient/:patientId', [authMiddleware, isDoctor], (req, res) => {
  const { patientId } = req.params;
  const doctorId = req.user.id;

  const sql = `
    SELECT 
      mr.*,
      a.name as patient_name,
      a.age,
      a.gender,
      ts.slot_date,
      ts.start_time,
      ts.end_time
    FROM medical_records mr
    LEFT JOIN appointments a ON mr.appointment_id = a.id
    LEFT JOIN doctor_time_slot ts ON a.time_slot_id = ts.id
    WHERE mr.patient_id = ? AND mr.doctor_id = ?
    ORDER BY mr.created_at DESC
  `;

  db.query(sql, [patientId, doctorId], (err, results) => {
    if (err) {
      console.error("Error fetching patient medical history:", err);
      return res.status(500).json({ message: "Lỗi máy chủ khi lấy lịch sử hồ sơ y tế." });
    }

    const parsedResults = results.map(record => {
      try {
        record.symptoms = JSON.parse(record.symptoms || '[]');
        record.allergies = JSON.parse(record.allergies || '[]');
        record.medications = JSON.parse(record.medications || '[]');
      } catch (e) {
        record.symptoms = [];
        record.allergies = [];
        record.medications = [];
      }
      return record;
    });

    res.json({
      message: "Lấy lịch sử hồ sơ y tế thành công!",
      records: parsedResults
    });
  });
});

/**
 * ==========================================================
 * ROUTE 5: XÓA HỒ SƠ Y TẾ
 * METHOD: DELETE /api/examination/:recordId
 * ==========================================================
 */
router.delete('/:recordId', [authMiddleware, isDoctor], (req, res) => {
  const { recordId } = req.params;
  const doctorId = req.user.id;

  const sql = `
    DELETE FROM medical_records 
    WHERE id = ? AND doctor_id = ?
  `;

  db.query(sql, [recordId, doctorId], (err, result) => {
    if (err) {
      console.error("Error deleting medical record:", err);
      return res.status(500).json({ message: "Lỗi máy chủ khi xóa hồ sơ y tế." });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Không tìm thấy hồ sơ y tế hoặc bạn không có quyền xóa." });
    }

    res.json({ message: "Xóa hồ sơ y tế thành công!" });
  });
});

module.exports = router;
