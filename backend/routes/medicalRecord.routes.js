// File: routes/medicalRecords.js
const express = require('express');
const router = express.Router();
const db = require('../config/db.config');

// 1. Bổ sung middleware xác thực người dùng
const authMiddleware = require('../middleware/auth.middleware');
const { isDoctor } = require('../middleware/auth.middleware');

// =================================================================================
// LẤY DANH SÁCH BỆNH NHÂN CHO BÁC SĨ (GET) - Dành cho trang của bác sĩ
// =================================================================================
router.get('/doctor/:doctorId', (req, res) => {
  const { doctorId } = req.params;
  const sql = `
    SELECT 
      a.id AS appointment_id, a.name AS patient_name, a.reason,
      a.customer_id, a.doctor_id, mr.id AS medical_record_id,
      mr.diagnosis, mr.treatment, mr.notes, mr.created_at,
      c.name AS customer_name, c.email AS patient_email
    FROM appointments a
    LEFT JOIN medical_records mr ON a.id = mr.appointment_id
    JOIN customers c ON a.customer_id = c.id
    WHERE a.doctor_id = ? AND a.status = 'Đã xác nhận'
    ORDER BY a.id DESC;
  `;
  db.query(sql, [doctorId], (err, results) => {
    if (err) {
      console.error("❌ Lỗi truy vấn SQL danh sách bệnh nhân:", err);
      return res.status(500).json({ error: 'Lỗi máy chủ khi lấy dữ liệu bệnh nhân.' });
    }
    res.status(200).json(results);
  });
});

// =================================================================================
// LẤY TẤT CẢ HỒ SƠ BỆNH ÁN CỦA BÁC SĨ (GET) - Dành cho trang quản lý hồ sơ
// =================================================================================
router.get('/doctor/:doctorId/all-records', (req, res) => {
  const { doctorId } = req.params;
  const sql = `
    SELECT 
      mr.id AS record_id,
      mr.diagnosis,
      mr.treatment,
      mr.notes,
      mr.created_at,
      mr.temperature,
      mr.blood_pressure,
      mr.heart_rate,
      mr.weight,
      mr.height,
      mr.symptoms,
      mr.allergies,
      mr.medications,
      mr.recommendations,
      mr.status AS medical_record_status,
      mr.follow_up_date AS follow_up_date,
      a.id AS appointment_id,
      a.name AS patient_name,
      a.age,
      a.gender,
      a.email AS patient_email,
      a.phone AS patient_phone,
      a.reason,
      a.status AS appointment_status,
      a.is_examined,
      a.address,
      c.name AS customer_name,
      c.email AS customer_email,
      dts.slot_date,
      dts.start_time,
      dts.end_time
    FROM medical_records mr
    JOIN appointments a ON mr.appointment_id = a.id
    JOIN customers c ON a.customer_id = c.id
    LEFT JOIN doctor_time_slot dts ON a.time_slot_id = dts.id
    WHERE mr.doctor_id = ?
    ORDER BY mr.created_at DESC;
  `;
  
  db.query(sql, [doctorId], (err, results) => {
    if (err) {
      console.error("❌ Lỗi truy vấn SQL hồ sơ bệnh án:", err);
      return res.status(500).json({ error: 'Lỗi máy chủ khi lấy dữ liệu hồ sơ bệnh án.' });
    }
    
    // Parse JSON cho các trường dữ liệu, luôn trả về mảng an toàn
    const safeParseArray = (val) => {
      if (!val) return [];
      try {
        const parsed = JSON.parse(val);
        if (Array.isArray(parsed)) return parsed;
        return [parsed];
      } catch {
        return [val];
      }
    };
    const processedResults = results.map(record => {
      record.symptoms = safeParseArray(record.symptoms);
      record.allergies = safeParseArray(record.allergies);
      record.medications = safeParseArray(record.medications);
      return record;
    });
    
    res.status(200).json(processedResults);
  });
});

// =================================================================================
// LƯU HỒ SƠ BỆNH ÁN TỪ TRANG SCHEDULE (POST) - API mới
// Thêm phân quyền: chỉ bác sĩ phụ trách mới được sửa
router.post('/save-from-schedule', authMiddleware, isDoctor, (req, res) => {
  console.log("🔍 [DEBUG] Request body:", req.body);
  console.log("🔍 [DEBUG] User from middleware:", req.user);
  
  const { 
    appointment_id, 
    doctor_id, 
    customer_id, 
    diagnosis, 
    doctor_note, 
    follow_up_date,
    treatment = null,
    notes = null,
    // Các trường dữ liệu mới
    temperature = null,
    blood_pressure = null,
    heart_rate = null,
    weight = null,
    height = null,
    symptoms = null,
    allergies = null,
    medications = null
  } = req.body;

  if (!appointment_id || !doctor_id || !customer_id || !diagnosis) {
    console.log("❌ [DEBUG] Missing required fields:", { appointment_id, doctor_id, customer_id, diagnosis });
    return res.status(400).json({ error: 'Vui lòng cung cấp đủ thông tin bắt buộc.' });
  }

  // Kiểm tra quyền: chỉ bác sĩ phụ trách mới được sửa
  if (req.user.role_id !== 3 || req.user.id !== doctor_id) {
    return res.status(403).json({ error: 'Chỉ bác sĩ phụ trách mới được phép sửa hồ sơ bệnh án này.' });
  }

  // Kiểm tra xem hồ sơ đã tồn tại chưa
  const checkSql = `SELECT id FROM medical_records WHERE appointment_id = ?`;
  db.query(checkSql, [appointment_id], (checkErr, checkResults) => {
    if (checkErr) {
      console.error("❌ Lỗi kiểm tra hồ sơ tồn tại:", checkErr);
      return res.status(500).json({ error: 'Lỗi máy chủ khi kiểm tra hồ sơ.' });
    }

    if (checkResults.length > 0) {
      // Cập nhật hồ sơ đã tồn tại
      const updateSql = `
        UPDATE medical_records 
        SET diagnosis = ?, treatment = ?, notes = ?, 
            temperature = ?, blood_pressure = ?, heart_rate = ?, 
            weight = ?, height = ?, symptoms = ?, allergies = ?, medications = ?,
            follow_up_date = ?,
            updated_at = NOW()
        WHERE appointment_id = ?
      `;
      
      db.query(updateSql, [
        diagnosis, treatment, notes, 
        temperature, blood_pressure, heart_rate, 
        weight, height, 
        symptoms ? JSON.stringify(symptoms) : null, 
        allergies ? JSON.stringify(allergies) : null, 
        medications ? JSON.stringify(medications) : null,
        follow_up_date, // thêm dòng này
        appointment_id
      ], (updateErr, updateResult) => {
        if (updateErr) {
          console.error("❌ Lỗi cập nhật hồ sơ bệnh án:", updateErr);
          return res.status(500).json({ error: 'Không thể cập nhật hồ sơ bệnh án.' });
        }
        
        console.log("✅ [DEBUG] Cập nhật medical_records thành công:", updateResult);
        
        // Cập nhật trạng thái appointment và thông tin bổ sung
        const updateAppointmentSql = `
          UPDATE appointments 
          SET is_examined = 1
          WHERE id = ?
        `;
        db.query(updateAppointmentSql, [appointment_id], (appointmentErr, appointmentResult) => {
          if (appointmentErr) {
            console.error("❌ Lỗi cập nhật appointment:", appointmentErr);
          } else {
            console.log("✅ [DEBUG] Cập nhật appointment thành công:", appointmentResult);
          }
          
          res.status(200).json({ 
            message: '✅ Cập nhật hồ sơ bệnh án thành công!', 
            recordId: checkResults[0].id 
          });
        });
      });
    } else {
      // Tạo hồ sơ mới
      const insertSql = `
        INSERT INTO medical_records (
          appointment_id, doctor_id, customer_id, diagnosis, treatment, 
          notes, temperature, blood_pressure, heart_rate, weight, height,
          symptoms, allergies, medications, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
      `;
      
      db.query(insertSql, [
        appointment_id, doctor_id, customer_id, diagnosis, treatment,
        notes, temperature, blood_pressure, heart_rate, weight, height,
        symptoms ? JSON.stringify(symptoms) : null, 
        allergies ? JSON.stringify(allergies) : null, 
        medications ? JSON.stringify(medications) : null
      ], (insertErr, insertResult) => {
        if (insertErr) {
          console.error("❌ Lỗi tạo hồ sơ bệnh án:", insertErr);
          return res.status(500).json({ error: 'Không thể tạo hồ sơ bệnh án.' });
        }
        
        console.log("✅ [DEBUG] Tạo medical_records thành công:", insertResult);
        
        // Cập nhật trạng thái appointment và thông tin bổ sung
        const updateAppointmentSql = `
          UPDATE appointments 
          SET is_examined = 1
          WHERE id = ?
        `;
        db.query(updateAppointmentSql, [appointment_id], (appointmentErr, appointmentResult) => {
          if (appointmentErr) {
            console.error("❌ Lỗi cập nhật appointment:", appointmentErr);
          } else {
            console.log("✅ [DEBUG] Cập nhật appointment thành công:", appointmentResult);
          }
          
          res.status(201).json({ 
            message: '✅ Tạo hồ sơ bệnh án thành công!', 
            recordId: insertResult.insertId 
          });
        });
      });
    }
  });
});

// =================================================================================
// TẠO HỒ SƠ BỆNH ÁN MỚI (POST) - Dành cho bác sĩ
// =================================================================================
router.post('/', (req, res) => {
  const { appointment_id, doctor_id, customer_id, diagnosis, treatment, notes } = req.body;
  if (!appointment_id || !doctor_id || !customer_id || !diagnosis || !treatment) {
    return res.status(400).json({ error: 'Vui lòng cung cấp đủ thông tin bắt buộc.' });
  }
  const insertSql = `
    INSERT INTO medical_records (appointment_id, doctor_id, customer_id, diagnosis, treatment, notes, created_at)
    VALUES (?, ?, ?, ?, ?, ?, NOW())
  `;
  db.query(insertSql, [appointment_id, doctor_id, customer_id, diagnosis, treatment, notes], (err, result) => {
      if (err) {
        console.error("❌ Lỗi khi tạo hồ sơ bệnh án:", err);
        return res.status(500).json({ error: 'Không thể tạo hồ sơ bệnh án.' });
      }
      res.status(201).json({ message: '✅ Đã tạo hồ sơ bệnh án thành công!', recordId: result.insertId });
    }
  );
});

// =================================================================================
// ROUTE LẤY HỒ SƠ BỆNH ÁN CỦA NGƯỜI DÙNG ĐĂNG NHẬP - ĐÃ SỬA LỖI
// =================================================================================
router.get('/my-records', authMiddleware, (req, res) => {
    // Middleware đã xác thực và gắn user.id vào request
    const customerId = req.user.id;

    // SỬA LỖI: Sử dụng LEFT JOIN với bảng medical_records để lấy thông tin bệnh án
    const sql = `
        SELECT 
            a.id AS appointment_id,
            a.reason,
            mr.diagnosis,
            mr.treatment,
            mr.notes AS doctor_note,
            mr.follow_up_date,
            mr.created_at AS record_created_at,
            mr.updated_at AS record_updated_at,
            d.name AS doctor_name,
            d.img AS doctor_avatar,
            s.name AS specialization_name,
            ts.slot_date,
            ts.start_time,
            ts.end_time,
            mr.temperature,
            mr.blood_pressure,
            mr.heart_rate,
            mr.weight,
            mr.height,
            mr.symptoms,
            mr.allergies,
            mr.medications
        FROM appointments a
        JOIN doctors d ON a.doctor_id = d.id
        JOIN specializations s ON d.specialization_id = s.id
        LEFT JOIN doctor_time_slot ts ON a.time_slot_id = ts.id
        LEFT JOIN medical_records mr ON a.id = mr.appointment_id
        WHERE 
            a.customer_id = ? 
            AND (a.status = 'Đã khám xong' OR mr.diagnosis IS NOT NULL)
            AND mr.diagnosis IS NOT NULL
        ORDER BY ts.slot_date DESC, mr.created_at DESC;
    `;

    console.log("🔍 Đang tìm hồ sơ bệnh án cho customer ID:", customerId);
    console.log("📝 SQL Query:", sql);
    
    db.query(sql, [customerId], (err, results) => {
        if (err) {
            console.error("❌ Lỗi khi lấy hồ sơ bệnh án của người dùng:", err);
            return res.status(500).json({ error: 'Lỗi máy chủ khi truy vấn dữ liệu.' });
        }
        
        // Parse JSON cho các trường dữ liệu
        const processedResults = results.map(record => {
            try {
                if (record.symptoms) {
                    record.symptoms = JSON.parse(record.symptoms);
                }
                if (record.allergies) {
                    record.allergies = JSON.parse(record.allergies);
                }
                if (record.medications) {
                    record.medications = JSON.parse(record.medications);
                }
            } catch (e) {
                // Nếu parse JSON thất bại, gán mảng rỗng
                record.symptoms = [];
                record.allergies = [];
                record.medications = [];
            }
            return record;
        });
        
        console.log("✅ Kết quả tìm được:", processedResults.length, "hồ sơ");
        res.status(200).json(processedResults);
    });
});

// Import và sử dụng controller cho route history
const medicalRecordController = require('../controllers/medicalRecordController');
router.get('/history/:customerId', medicalRecordController.getRecordsByCustomer);

module.exports = router;