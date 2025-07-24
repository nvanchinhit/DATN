 // backend/routes/appointment.routes.js

const express = require('express');
const router = express.Router();
const db = require('../config/db.config');
const authMiddleware = require('../middleware/auth.middleware');
const { isDoctor } = require('../middleware/auth.middleware');
const { sendConfirmationEmail, sendRejectionEmail } = require('../utils/sendEmail');

/**
 * ==========================================================
 * ROUTE 1: ĐẶT LỊCH KHÁM MỚI (Dành cho người dùng đã đăng nhập)
 * METHOD: POST /api/appointments/
 * ==========================================================
 */
router.post('/', authMiddleware, (req, res) => {
  const customer_id = req.user.id;
  const { doctor_id, time_slot_id, name, age, gender, email, phone, reason, address } = req.body;

  if (!doctor_id || !time_slot_id || !name || !age || !phone || !email) {
    return res.status(400).json({ message: 'Vui lòng điền đầy đủ các thông tin bắt buộc.' });
  }

  const checkSql = `SELECT id FROM appointments WHERE time_slot_id = ? AND status != 'Đã hủy'`;
  db.query(checkSql, [time_slot_id], (err, existing) => {
    if (err) {
      console.error("Lỗi khi kiểm tra lịch hẹn:", err);
      return res.status(500).json({ message: 'Lỗi máy chủ khi kiểm tra lịch hẹn.' });
    }
    if (existing.length > 0) {
      return res.status(409).json({ message: 'Rất tiếc, khung giờ này đã có người khác đặt.' });
    }

    const insertSql = `
      INSERT INTO appointments (customer_id, doctor_id, time_slot_id, name, age, gender, email, phone, reason, address, status, doctor_confirmation)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Chưa xác nhận', 'Chưa xác nhận')`;
    const values = [customer_id, doctor_id, time_slot_id, name, age, gender, email, phone, reason, address];

    db.query(insertSql, values, (err, result) => {
      if (err) {
        console.error("Lỗi khi tạo lịch hẹn:", err);
        return res.status(500).json({ message: 'Không thể tạo lịch hẹn.' });
      }
      res.status(201).json({ message: 'Đặt lịch thành công!', appointmentId: result.insertId });
    });
  });
});
// ==========================================================
router.put('/:id/confirm', [authMiddleware, isDoctor], (req, res) => {
  const appointmentId = req.params.id;

  // Cập nhật trạng thái thành 'Đã xác nhận'
  db.query("UPDATE appointments SET status = 'Đã xác nhận' WHERE id = ?", [appointmentId], (err, result) => {
    if (err) return res.status(500).json({ message: 'Lỗi server khi xác nhận.' });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Không tìm thấy lịch hẹn.' });

    // Lấy thông tin để gửi mail cho bệnh nhân
    const infoSql = `
      SELECT a.name, a.email, a.reason, a.payment_status,
             d.name AS doctor_name, 
             DATE_FORMAT(ts.slot_date, '%d-%m-%Y') as slot_date, 
             TIME_FORMAT(ts.start_time, '%H:%i') as start_time, 
             TIME_FORMAT(ts.end_time, '%H:%i') as end_time
      FROM appointments a
      JOIN doctors d ON a.doctor_id = d.id
      JOIN doctor_time_slot ts ON a.time_slot_id = ts.id
      WHERE a.id = ?`;
      
    db.query(infoSql, [appointmentId], (e, rows) => {
        if (e || rows.length === 0) {
            console.error("Không thể lấy thông tin để gửi mail xác nhận:", e);
            return res.json({ message: 'Xác nhận thành công nhưng không thể gửi email!' });
        }
        
        const appt = rows[0];
        sendConfirmationEmail({
            name: appt.name, email: appt.email, doctor: appt.doctor_name, date: appt.slot_date,
            start: appt.start_time, end: appt.end_time, reason: appt.reason, payment: appt.payment_status
        });
        res.json({ message: 'Xác nhận thành công và đã gửi email thông báo.' });
    });
  });
});
/**
 * ==========================================================
 * ROUTE 2: LẤY TẤT CẢ LỊCH HẸN CỦA NGƯỜI DÙNG ĐANG ĐĂNG NHẬP
 * METHOD: GET /api/appointments/my-appointments
 * ==========================================================
 */
// ✅ Lấy hồ sơ bệnh án theo bác sĩ
router.get('/doctor/:doctorId', async (req, res) => {
  const { doctorId } = req.params;

  try {
    const [rows] = await db.execute(
      `SELECT 
        a.id AS appointment_id,
        a.reason,
        a.created_at,
        a.customer_id,
        a.doctor_id,
        c.name AS patient_name,
        c.email AS patient_email,
        mr.id AS medical_record_id,
        mr.diagnosis,
        mr.treatment,
        mr.notes
      FROM appointments a
      JOIN customers c ON a.customer_id = c.id
      LEFT JOIN medical_records mr ON mr.appointment_id = a.id
      WHERE a.doctor_id = ?
      ORDER BY c.id, a.created_at DESC`,
      [doctorId]
    );

    res.json(rows);
  } catch (err) {
    console.error('❌ Lỗi khi lấy hồ sơ:', err);
    res.status(500).json({ error: 'Lỗi máy chủ khi truy vấn hồ sơ.' });
  }
});

module.exports = router;
router.get('/my-appointments', authMiddleware, (req, res) => {
  const customerId = req.user.id;
  const sql = `
    SELECT 
      a.id,
      a.status,
      a.reason,
      a.doctor_id,
      d.name AS doctor_name,
      d.img AS doctor_img,
      spec.name AS specialization_name,
      ts.slot_date,
      ts.start_time
    FROM appointments a
    JOIN doctors d ON a.doctor_id = d.id
    JOIN specializations spec ON d.specialization_id = spec.id
    JOIN doctor_time_slot ts ON a.time_slot_id = ts.id
    WHERE a.customer_id = ?
    ORDER BY ts.slot_date DESC, ts.start_time DESC`;

  db.query(sql, [customerId], (err, results) => {
    if (err) {
      console.error("Lỗi truy vấn lịch hẹn:", err);
      return res.status(500).json({ message: 'Lỗi máy chủ khi truy vấn dữ liệu.' });
    }
    res.json(results);
  });
});

/**
 * ==========================================================
 * ROUTE 3: NGƯỜI DÙNG HỦY LỊCH HẸN
 * METHOD: PUT /api/appointments/:id/cancel
 * ==========================================================
 */
router.put('/:id/cancel', authMiddleware, (req, res) => {
  const { id: appointmentId } = req.params;
  const customerId = req.user.id;

  const findSql = "SELECT status FROM appointments WHERE id = ? AND customer_id = ?";
  db.query(findSql, [appointmentId, customerId], (err, appointments) => {
    if (err) {
      console.error("Lỗi DB khi tìm lịch hẹn:", err);
      return res.status(500).json({ message: "Lỗi máy chủ." });
    }
    if (appointments.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy lịch hẹn hoặc bạn không có quyền thực hiện hành động này." });
    }

    const { status } = appointments[0];
    if (status !== 'Chưa xác nhận') {
      return res.status(400).json({ message: `Không thể hủy lịch hẹn ở trạng thái "${status}".` });
    }

    const updateSql = "UPDATE appointments SET status = 'Đã hủy' WHERE id = ?";
    db.query(updateSql, [appointmentId], (err) => {
      if (err) {
        console.error("Lỗi DB khi hủy lịch hẹn:", err);
        return res.status(500).json({ message: "Lỗi khi cập nhật lịch hẹn." });
      }
      res.json({ message: "Đã hủy lịch hẹn thành công." });
    });
  });
});

/**
 * ==========================================================
 * ROUTE 4: CẬP NHẬT TRẠNG THÁI LỊCH HẸN (Dành cho bác sĩ)
 * METHOD: PUT /api/appointments/:id/status
 * ==========================================================
 */
router.put('/:id/status', [authMiddleware, isDoctor], (req, res) => {
  const { id: appointmentId } = req.params;
  const { status } = req.body;
  const doctorId = req.user.id;

  const validStatuses = ['Đã xác nhận', 'Đang khám', 'Đã khám xong'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: "Trạng thái cập nhật không hợp lệ." });
  }

  const updateSql = `UPDATE appointments SET status = ? WHERE id = ? AND doctor_id = ?`;
  db.query(updateSql, [status, appointmentId, doctorId], (err, result) => {
    if (err) return res.status(500).json({ message: 'Lỗi cập nhật lịch hẹn.' });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Không tìm thấy lịch hẹn hoặc bạn không có quyền cập nhật.' });
    res.json({ message: `Đã cập nhật trạng thái lịch hẹn thành "${status}"` });
  });
});
router.put('/appointments/:id/diagnosis', (req, res) => {
  const { id } = req.params;
  const { diagnosis, doctor_note, follow_up_date, is_examined } = req.body;

  const sql = `
    UPDATE appointments
    SET 
      diagnosis = ?, 
      doctor_note = ?, 
      follow_up_date = ?, 
      is_examined = ?
    WHERE id = ?
  `;

  db.query(sql, [diagnosis, doctor_note, follow_up_date, is_examined || 0, id], (err, result) => {
    if (err) {
      console.error("❌ Lỗi khi lưu bệnh án:", err);
      return res.status(500).json({ error: "Không thể lưu bệnh án." });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Không tìm thấy cuộc hẹn." });
    }
    res.json({ message: "✅ Lưu bệnh án thành công." });
  });
});
module.exports = router;
