const express = require('express');
const router = express.Router();
const db = require('../config/db.config');
const authMiddleware = require('../middleware/auth.middleware');
const { isDoctor } = require('../middleware/auth.middleware');

// POST - Tạo appointment mới với thông tin thanh toán
router.post('/', authMiddleware, (req, res) => {
  const customer_id = req.user.id;
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
    payment_method = 'cash',
    transaction_id = null,
    paid_amount = 0,
    payment_date = null,
    status = 'Chưa xác nhận',
    time_slot_id
  } = req.body;

  console.log('📝 Creating appointment with payment info:', {
    payment_status,
    payment_method,
    transaction_id,
    paid_amount,
    payment_date
  });

  if (!doctor_id || !time_slot_id || !name || !age || !phone || !email) {
    console.log('❌ Validation failed:', { doctor_id, time_slot_id, name, age, phone, email });
    return res.status(400).json({ error: 'Thiếu hoặc sai kiểu dữ liệu bắt buộc.' });
  }

  // Kiểm tra slot đã được đặt chưa
  const checkSql = `SELECT id FROM appointments WHERE time_slot_id = ? AND status != 'Đã hủy'`;
  db.query(checkSql, [time_slot_id], (err, booked) => {
    if (err) {
      console.error('❌ Lỗi kiểm tra trùng lịch:', err);
      return res.status(500).json({ error: 'Lỗi kiểm tra lịch trùng.' });
    }
    if (booked.length > 0) {
      console.log('❌ Slot already booked:', time_slot_id);
      return res.status(409).json({ error: 'Khung giờ này đã có người đặt.' });
    }

    // Tạo appointment với thông tin thanh toán đầy đủ
    const insertSql = `
      INSERT INTO appointments (
        customer_id, doctor_id, time_slot_id, name, age, gender, email, phone, reason, address,
        status, doctor_confirmation, payment_status, payment_method, transaction_id, paid_amount, payment_date
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Chưa xác nhận', ?, ?, ?, ?, ?)
    `;

    const insertParams = [
      customer_id, doctor_id, time_slot_id, name, age, gender, email, phone, reason, address,
      status, payment_status, payment_method, transaction_id, paid_amount, payment_date
    ];

    console.log('📝 Inserting appointment with params:', insertParams);

    db.query(insertSql, insertParams, (err, result) => {
      if (err) {
        console.error('❌ Lỗi khi lưu lịch hẹn:', err);
        return res.status(500).json({ error: 'Không thể lưu lịch hẹn.' });
      }
      
      console.log('✅ Appointment created successfully with ID:', result.insertId);
      console.log('✅ Payment status:', payment_status);
      console.log('✅ Payment method:', payment_method);
      console.log('✅ Transaction ID:', transaction_id);
      console.log('✅ Paid amount:', paid_amount);
      
      res.status(201).json({
        message: '✅ Đặt lịch thành công!',
        appointmentId: result.insertId,
        paymentStatus: payment_status,
        paymentMethod: payment_method,
        transactionId: transaction_id,
        paidAmount: paid_amount
      });
    });
  });
});

// GET - Lấy tất cả appointments với thông tin thanh toán (cho admin)
router.get('/all', authMiddleware, (req, res) => {
  const sql = `
    SELECT 
      a.id, a.name, a.age, a.gender, a.email, a.phone, a.reason, a.address,
      a.payment_status, a.payment_method, a.transaction_id, a.paid_amount, a.payment_date,
      a.status, a.doctor_confirmation, a.created_at,
      d.name AS doctor_name,
      spec.name AS specialization_name,
      ts.slot_date, ts.start_time, ts.end_time
    FROM appointments a
    JOIN doctors d ON a.doctor_id = d.id
    JOIN specializations spec ON d.specialization_id = spec.id
    JOIN doctor_time_slot ts ON a.time_slot_id = ts.id
    ORDER BY a.created_at DESC
  `;
  
  db.query(sql, (err, results) => {
    if (err) {
      console.error('❌ Error fetching appointments:', err);
      return res.status(500).json({ error: 'Lỗi server khi truy vấn' });
    }
    
    res.json({
      success: true,
      appointments: results
    });
  });
});

// PUT - Cập nhật trạng thái thanh toán (cho admin)
router.put('/:id/payment-status', authMiddleware, (req, res) => {
  const appointmentId = req.params.id;
  const { payment_status, payment_method, transaction_id, paid_amount, payment_date } = req.body;

  const updateSql = `
    UPDATE appointments 
    SET payment_status = ?, payment_method = ?, transaction_id = ?, paid_amount = ?, payment_date = ?
    WHERE id = ?
  `;

  const updateParams = [
    payment_status || 'Chưa thanh toán',
    payment_method || 'cash',
    transaction_id,
    paid_amount || 0,
    payment_date || null,
    appointmentId
  ];

  db.query(updateSql, updateParams, (err, result) => {
    if (err) {
      console.error('❌ Error updating payment status:', err);
      return res.status(500).json({ error: 'Lỗi server khi cập nhật thanh toán' });
    }
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Không tìm thấy appointment' });
    }
    
    res.json({
      success: true,
      message: 'Cập nhật trạng thái thanh toán thành công',
      appointmentId: appointmentId,
      paymentStatus: payment_status,
      paymentMethod: payment_method,
      transactionId: transaction_id,
      paidAmount: paid_amount
    });
  });
});

// GET - Lấy chi tiết lịch theo slot_id
router.get('/slot/:slotId', (req, res) => {
  const slotId = req.params.slotId;
  const sql = `
    SELECT 
      a.id, a.reason, a.payment_status, a.payment_method, a.transaction_id, a.paid_amount, a.payment_date,
      a.doctor_confirmation, a.status, a.address,
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

// PUT - Bác sĩ xác nhận lịch khám
router.put('/:id/confirm', [authMiddleware, isDoctor], (req, res) => {
  const appointmentId = req.params.id;

  // Lấy time_slot_id tương ứng
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

    // Cập nhật lịch hẹn thành "Đã xác nhận"
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

      // Trả lại slot (is_booked = false)
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

// GET - Lấy appointment mới nhất
router.get('/latest', (req, res) => {
  const sql = `
    SELECT 
      id, name, age, gender, email, phone, reason, address,
      payment_status, payment_method, transaction_id, paid_amount, payment_date,
      status, doctor_id, time_slot_id, customer_id,
      created_at
    FROM appointments 
    ORDER BY created_at DESC 
    LIMIT 5
  `;
  
  db.query(sql, (err, results) => {
    if (err) {
      console.error('❌ Error fetching latest appointments:', err);
      return res.status(500).json({ error: 'Lỗi server khi truy vấn' });
    }
    
    console.log('📋 Latest appointments:', results);
    res.json({
      success: true,
      appointments: results
    });
  });
});

// GET - Kiểm tra appointment theo ID
router.get('/:id', (req, res) => {
  const appointmentId = req.params.id;
  const sql = `
    SELECT 
      id, name, age, gender, email, phone, reason, address,
      payment_status, payment_method, transaction_id, paid_amount, payment_date,
      status, doctor_id, time_slot_id, customer_id,
      created_at
    FROM appointments 
    WHERE id = ?
  `;
  
  db.query(sql, [appointmentId], (err, results) => {
    if (err) {
      console.error('❌ Error fetching appointment:', err);
      return res.status(500).json({ error: 'Lỗi server khi truy vấn' });
    }
    
    if (results.length === 0) {
      return res.status(404).json({ error: 'Không tìm thấy appointment' });
    }
    
    console.log('📋 Appointment details:', results[0]);
    res.json({
      success: true,
      appointment: results[0]
    });
  });
});

module.exports = router;
