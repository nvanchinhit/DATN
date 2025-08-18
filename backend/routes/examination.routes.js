const express = require('express');
const router = express.Router();
const db = require('../config/db.config');
const authMiddleware = require('../middleware/auth.middleware');
const { isDoctor } = require('../middleware/auth.middleware');

/**
 * ==========================================================
 * ROUTE 1: LƯU DỮ LIỆU KHÁM BỆNH (Nháp hoặc hoàn thành)
 * METHOD: POST /api/examination/save
 * ==========================================================
 */
router.post('/save', [authMiddleware, isDoctor], (req, res) => {
  console.log('=== EXAMINATION SAVE REQUEST ===');
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

  // Kiểm tra dữ liệu bắt buộc
  if (!appointmentId || !patientId || !diagnosis) {
    return res.status(400).json({ 
      message: "Thiếu thông tin bắt buộc: appointmentId, patientId, diagnosis" 
    });
  }

  // Kiểm tra xem đã có bản ghi khám bệnh chưa
  const checkSql = `
    SELECT id FROM examination_records 
    WHERE appointment_id = ? AND doctor_id = ?
  `;

  console.log('Checking existing record with:', { appointmentId, doctorId });
  db.query(checkSql, [appointmentId, doctorId], (err, results) => {
    if (err) {
      console.error("Error checking existing record:", err);
      return res.status(500).json({ message: "Lỗi máy chủ khi kiểm tra dữ liệu." });
    }
    console.log('Check result:', results);

    if (results.length > 0) {
      // Cập nhật bản ghi hiện có
      const updateSql = `
        UPDATE examination_records SET
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
      
      console.log('Updating with values:', updateValues);

             db.query(updateSql, updateValues, (updateErr, updateResult) => {
         if (updateErr) {
           console.error("Error updating examination record:", updateErr);
           console.error("SQL:", updateSql);
           console.error("Values:", updateValues);
           return res.status(500).json({ 
             message: "Lỗi máy chủ khi cập nhật dữ liệu khám bệnh.",
             error: updateErr.message 
           });
         }

        res.json({ 
          message: "Cập nhật dữ liệu khám bệnh thành công!",
          recordId: results[0].id,
          action: 'updated'
        });
      });
    } else {
      // Tạo bản ghi mới
      const insertSql = `
        INSERT INTO examination_records (
          appointment_id, doctor_id, patient_id,
          temperature, blood_pressure, heart_rate, weight, height,
          symptoms, notes, allergies, medications,
          diagnosis, recommendations, follow_up_date, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
      
      console.log('Inserting with values:', insertValues);

             db.query(insertSql, insertValues, (insertErr, insertResult) => {
         if (insertErr) {
           console.error("Error creating examination record:", insertErr);
           console.error("SQL:", insertSql);
           console.error("Values:", insertValues);
           return res.status(500).json({ 
             message: "Lỗi máy chủ khi tạo dữ liệu khám bệnh.",
             error: insertErr.message 
           });
         }

        res.json({ 
          message: "Lưu dữ liệu khám bệnh thành công!",
          recordId: insertResult.insertId,
          action: 'created'
        });
      });
    }
  });
});

/**
 * ==========================================================
 * ROUTE 2: LẤY DỮ LIỆU KHÁM BỆNH THEO APPOINTMENT
 * METHOD: GET /api/examination/:appointmentId
 * ==========================================================
 */
router.get('/:appointmentId', [authMiddleware, isDoctor], (req, res) => {
  const { appointmentId } = req.params;
  const doctorId = req.user.id;

  const sql = `
    SELECT 
      er.*,
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
    FROM examination_records er
    LEFT JOIN appointments a ON er.appointment_id = a.id
    LEFT JOIN doctors d ON er.doctor_id = d.id
    LEFT JOIN doctor_time_slot ts ON a.time_slot_id = ts.id
    WHERE er.appointment_id = ? AND er.doctor_id = ?
  `;

  db.query(sql, [appointmentId, doctorId], (err, results) => {
    if (err) {
      console.error("Error fetching examination record:", err);
      return res.status(500).json({ message: "Lỗi máy chủ khi lấy dữ liệu khám bệnh." });
    }

    if (results.length === 0) {
      return res.json({ 
        message: "Chưa có dữ liệu khám bệnh cho cuộc hẹn này.",
        hasRecord: false 
      });
    }

    const record = results[0];
    
    // Parse JSON fields
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
      message: "Lấy dữ liệu khám bệnh thành công!",
      hasRecord: true,
      record: record
    });
  });
});

/**
 * ==========================================================
 * ROUTE 3: LẤY LỊCH SỬ KHÁM BỆNH CỦA BỆNH NHÂN
 * METHOD: GET /api/examination/patient/:patientId
 * ==========================================================
 */
router.get('/patient/:patientId', [authMiddleware, isDoctor], (req, res) => {
  const { patientId } = req.params;
  const doctorId = req.user.id;

  const sql = `
    SELECT 
      er.*,
      a.name as patient_name,
      a.age,
      a.gender,
      ts.slot_date,
      ts.start_time,
      ts.end_time
    FROM examination_records er
    LEFT JOIN appointments a ON er.appointment_id = a.id
    LEFT JOIN doctor_time_slot ts ON a.time_slot_id = ts.id
    WHERE er.patient_id = ? AND er.doctor_id = ?
    ORDER BY er.created_at DESC
  `;

  db.query(sql, [patientId, doctorId], (err, results) => {
    if (err) {
      console.error("Error fetching patient history:", err);
      return res.status(500).json({ message: "Lỗi máy chủ khi lấy lịch sử khám bệnh." });
    }

    // Parse JSON fields for each record
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
      message: "Lấy lịch sử khám bệnh thành công!",
      records: parsedResults
    });
  });
});

/**
 * ==========================================================
 * ROUTE 4: XÓA DỮ LIỆU KHÁM BỆNH
 * METHOD: DELETE /api/examination/:recordId
 * ==========================================================
 */
router.delete('/:recordId', [authMiddleware, isDoctor], (req, res) => {
  const { recordId } = req.params;
  const doctorId = req.user.id;

  const sql = `
    DELETE FROM examination_records 
    WHERE id = ? AND doctor_id = ?
  `;

  db.query(sql, [recordId, doctorId], (err, result) => {
    if (err) {
      console.error("Error deleting examination record:", err);
      return res.status(500).json({ message: "Lỗi máy chủ khi xóa dữ liệu khám bệnh." });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Không tìm thấy bản ghi khám bệnh hoặc bạn không có quyền xóa." });
    }

    res.json({ message: "Xóa dữ liệu khám bệnh thành công!" });
  });
});

module.exports = router;
