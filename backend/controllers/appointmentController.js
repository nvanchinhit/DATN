const express = require('express');
const router = express.Router();
const db = require('../config/db.config');

// SỬA LỖI Ở ĐÂY: Nhận thêm customer_id từ request body
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
    customer_id // Nhận ID khách hàng
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

  // 1. Kiểm tra slot đã được đặt chưa (giữ nguyên)
  const checkSql = `SELECT id FROM appointments WHERE time_slot_id = ?`;
  db.query(checkSql, [time_slot_id], (err, booked) => {
    if (err) {
      console.error('❌ Lỗi kiểm tra trùng lịch:', err);
      return res.status(500).json({ error: 'Lỗi kiểm tra lịch trùng.' });
    }
    if (booked.length > 0) {
      return res.status(409).json({ error: 'Khung giờ này đã có người đặt.' });
    }

    // SỬA LỖI Ở ĐÂY: Thêm cột `customer_id` vào câu lệnh INSERT
    const insertSql = `
      INSERT INTO appointments
      (doctor_id, time_slot_id, name, age, gender, email, phone, reason, payment_status, status, address, customer_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
      insertSql,
      // SỬA LỖI Ở ĐÂY: Thêm biến `customer_id` vào mảng tham số của query
      [doctor_id, time_slot_id, name, age, gender, email, phone, reason, payment_status, status, address, customer_id],
      (err, result) => {
        if (err) {
          console.error('❌ Lỗi khi lưu lịch hẹn:', err);
          return res.status(500).json({ error: 'Không thể lưu lịch hẹn.' });
        }
        
        // Phần logic còn lại giữ nguyên
        res.status(201).json({
            message: '✅ Đặt lịch thành công!',
            appointmentId: result.insertId,
        });
      }
    );
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
  const appointmentId = req.params.id;

  // 1. Lấy time_slot_id tương ứng
  const getSlotSql = `SELECT time_slot_id FROM appointments WHERE id = ?`;

  db.query(getSlotSql, [appointmentId], (err, results) => {
    if (err) {
      console.error('❌ Lỗi truy vấn slot:', err);
      return res.status(500).json({ error: 'Lỗi khi lấy thông tin slot' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Không tìm thấy lịch hẹn' });
    }

    const timeSlotId = results[0].time_slot_id;

    // 2. Cập nhật lịch hẹn thành "Đã xác nhận"
    const updateAppointmentSql = `
      UPDATE appointments
      SET doctor_confirmation = 'Đã xác nhận'
      WHERE id = ?
    `;

    db.query(updateAppointmentSql, [appointmentId], (errUpdate, resultUpdate) => {
      if (errUpdate) {
        console.error('❌ Lỗi khi cập nhật lịch hẹn:', errUpdate);
        return res.status(500).json({ error: 'Lỗi xác nhận lịch hẹn' });
      }

      if (resultUpdate.affectedRows === 0) {
        return res.status(404).json({ error: 'Không tìm thấy lịch hẹn để xác nhận' });
      }

      // 3. Trả lại slot (is_booked = false)
      const updateSlotSql = `
        UPDATE time_slots
        SET is_booked = false
        WHERE id = ?
      `;

      db.query(updateSlotSql, [timeSlotId], (errSlot) => {
        if (errSlot) {
          console.error('❌ Lỗi khi cập nhật trạng thái slot:', errSlot);
          return res.status(500).json({ error: 'Xác nhận thành công nhưng lỗi khi cập nhật slot' });
        }

        res.json({ message: '✅ Đã xác nhận lịch hẹn và slot đã được trả lại!' });
      });
    });
  });
});

module.exports = router;
