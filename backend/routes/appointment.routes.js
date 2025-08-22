 // backend/routes/appointment.routes.js
// backend/routes/appointment.routes.js

const express = require('express');
const router = express.Router();
const db = require('../config/db.config');
const authMiddleware = require('../middleware/auth.middleware');
const { isDoctor } = require('../middleware/auth.middleware');
const nodemailer = require('nodemailer');
const mailConfig = require('../config/mail.config');

// Cấu hình transporter email
const transporter = nodemailer.createTransport({
  host: mailConfig.HOST,
  port: mailConfig.PORT,
  secure: false,
  auth: {
    user: mailConfig.USERNAME,
    pass: mailConfig.PASSWORD,
  }
});

// ===== Hàm gửi email khi đặt lịch thành công =====
function sendBookingConfirmationEmail({ name, email, doctor, room, floor, date, start, end, reason, payment }) {
  const mailOptions = {
    from: mailConfig.FROM_ADDRESS,
    to: email,
    subject: '✅ Lịch hẹn khám đã được đặt thành công',
    html: `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <h2 style="color: #007bff;">XÁC NHẬN ĐẶT LỊCH KHÁM</h2>
        <p>Chào <strong>${name}</strong>,</p>
        <p>Cảm ơn bạn đã đặt lịch khám tại bệnh viện chúng tôi. Dưới đây là thông tin chi tiết:</p>
        <ul>
          <li><strong>Bác sĩ:</strong> ${doctor}</li>
          <li><strong>Phòng:</strong> ${room || 'N/A'}</li>
          <li><strong>Tầng:</strong> ${floor || 'N/A'}</li>
          <li><strong>Ngày khám:</strong> ${date}</li>
          <li><strong>Thời gian:</strong> ${start} - ${end}</li>
          <li><strong>Lý do khám:</strong> ${reason}</li>
          <li><strong>Trạng thái thanh toán:</strong> ${payment}</li>
        </ul>
        <p><strong>Lưu ý:</strong></p>
        <ul>
          <li>Vui lòng đến trước 15 phút để làm thủ tục</li>
          <li>Lịch hẹn của bạn đang chờ bác sĩ xác nhận</li>
        </ul>
        <p>Trân trọng,<br><strong>${mailConfig.FROM_NAME || 'Bệnh viện ABC'}</strong></p>
      </div>
    `
  };
  transporter.sendMail(mailOptions, (err) => {
    if (err) console.error('❌ Lỗi gửi mail đặt lịch:', err);
  });
}

// ===== Hàm gửi email khi bác sĩ xác nhận =====
function sendConfirmationEmail({ name, email, doctor, room, floor, date, start, end, reason, payment }) {
  const mailOptions = {
    from: mailConfig.FROM_ADDRESS,
    to: email,
    subject: '✅ Xác nhận lịch hẹn khám tại bệnh viện',
    html: `
      <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 10px; padding: 20px; background: #f9f9f9;">
        
        <!-- Logo -->
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="cid:logo" alt="TDCARE Logo" style="height: 80px;" />
        </div>

        <!-- Title -->
        <h2 style="color: #007bff; text-align: center;">XÁC NHẬN LỊCH KHÁM</h2>

        <!-- Greeting -->
        <p>Chào <strong>${name}</strong>,</p>

        <!-- Intro -->
        <p>Bệnh viện xin trân trọng thông báo rằng lịch hẹn khám của bạn đã được xác nhận thành công với các thông tin chi tiết sau:</p>

        <!-- Details -->
        <ul style="line-height: 1.6;">
          <li><strong>Bác sĩ phụ trách khám cho quý khách là:</strong> ${doctor}</li>
          <li><strong>Phòng khám được sắp xếp cho quý khách là:</strong> ${room || 'Chưa cập nhật'}</li>
          <li><strong>Tầng mà quý khách sẽ đến khám là:</strong> ${floor || 'Chưa cập nhật'}</li>
          <li><strong>Ngày khám đã được ấn định là:</strong> ${date}</li>
          <li><strong>Thời gian khám sẽ diễn ra từ:</strong> ${start} đến ${end}</li>
          <li><strong>Lý do khám mà quý khách đã đăng ký là:</strong> ${reason}</li>
          <li><strong>Hình thức thanh toán mà quý khách đã lựa chọn là:</strong> ${payment}</li>
        </ul>

        <!-- Note -->
        <p>Quý khách vui lòng có mặt tại bệnh viện trước <strong>15 phút</strong> để hoàn tất các thủ tục cần thiết.</p>
        
        <!-- Thank you -->
        <p>Xin cảm ơn quý khách đã tin tưởng và lựa chọn dịch vụ của chúng tôi.</p>

        <!-- Signature -->
        <p>Trân trọng,<br><strong>${mailConfig.FROM_NAME || 'Bệnh viện ABC'}</strong></p>
      </div>
    `,
    attachments: [
      {
        filename: 'logo.jpeg',
        path: 'https://i.imgur.com/bUBPKF9.jpeg', // link logo của bạn
        cid: 'logo' // trùng với src="cid:logo"
      }
    ]
  };

  transporter.sendMail(mailOptions, (err) => {
    if (err) {
      console.error('❌ Lỗi gửi mail xác nhận:', err);
    } else {
      console.log('✅ Email xác nhận đã được gửi thành công!');
    }
  });
}

// ====== Đặt lịch khám ======
router.post('/', authMiddleware, (req, res) => {
  const customer_id = req.user.id;
  const { 
    doctor_id, time_slot_id, name, age, gender, email, phone, reason, address,
    payment_status = 'Chưa thanh toán',
    payment_method = 'cash',
    transaction_id = null,
    paid_amount = 0,
    payment_date = null
  } = req.body;

  if (!doctor_id || !time_slot_id || !name || !age || !phone || !email) {
    return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin.' });
  }

  const checkSql = `SELECT id FROM appointments WHERE time_slot_id = ? AND status != 'Đã hủy'`;
  db.query(checkSql, [time_slot_id], (err, existing) => {
    if (err) return res.status(500).json({ message: 'Lỗi máy chủ khi kiểm tra lịch hẹn.' });
    if (existing.length > 0) {
      return res.status(409).json({ message: 'Khung giờ này đã có người khác đặt.' });
    }

    const insertSql = `
      INSERT INTO appointments (
        customer_id, doctor_id, time_slot_id, name, age, gender, email, phone, reason, address, 
        status, doctor_confirmation, payment_status, payment_method, transaction_id, paid_amount, payment_date
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Chưa xác nhận', 'Chưa xác nhận', ?, ?, ?, ?, ?)`;
    const values = [
      customer_id, doctor_id, time_slot_id, name, age, gender, email, phone, reason, address,
      payment_status, payment_method, transaction_id, paid_amount, payment_date
    ];

    db.query(insertSql, values, (err, result) => {
      if (err) return res.status(500).json({ message: 'Không thể tạo lịch hẹn.' });

      // Lấy thông tin cần thiết để gửi email và trả về thông tin phòng khám
      const infoSql = `
        SELECT 
          d.name AS doctor_name, d.room_number,
          DATE_FORMAT(ts.slot_date, '%d-%m-%Y') AS slot_date,
          TIME_FORMAT(ts.start_time, '%H:%i') AS start_time,
          TIME_FORMAT(ts.end_time, '%H:%i') AS end_time
        FROM doctors d
        JOIN doctor_time_slot ts ON ts.id = ?
        WHERE d.id = ?
      `;

      db.query(infoSql, [time_slot_id, doctor_id], (err2, rows) => {
        if (err2) {
          console.error('❌ Lỗi lấy thông tin email sau khi đặt lịch:', err2);
        }

        const clinic_name = "Phòng khám Đa khoa ABC"; // hardcode
        const address = "123 Đường Tĩnh, Quận 1, TP.HCM"; // hardcode
        const room_number = rows && rows.length > 0 ? rows[0].room_number : "N/A";

        // Thử gửi email xác nhận đặt lịch cho bệnh nhân (không chặn response nếu lỗi)
        try {
          const mailData = rows && rows[0] ? rows[0] : {};
          sendBookingConfirmationEmail({
            name,
            email,
            doctor: mailData.doctor_name || 'Bác sĩ',
            room: room_number,
            floor: 'N/A',
            date: mailData.slot_date || '',
            start: mailData.start_time || '',
            end: mailData.end_time || '',
            reason: reason || '',
            payment: payment_status || 'Chưa thanh toán'
          });
        } catch (mailErr) {
          console.error('❌ Lỗi khi gửi email xác nhận đặt lịch:', mailErr);
        }

        res.status(201).json({
          message: 'Đặt lịch thành công!',
          clinic: {
            clinic_name,
            room_number,
            address
          }
        });
      });
    });
  });
});

// ====== Bác sĩ xác nhận lịch hẹn ======
router.put('/:id/confirm', [authMiddleware, isDoctor], (req, res) => {
  const appointmentId = req.params.id;

  db.query("UPDATE appointments SET status = 'Đã xác nhận' WHERE id = ?", [appointmentId], (err, result) => {
    if (err) return res.status(500).json({ message: 'Lỗi server khi xác nhận.' });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Không tìm thấy lịch hẹn.' });

    const infoSql = `
      SELECT a.name, a.email, a.reason, a.payment_status,
             d.name AS doctor_name, d.room_number,
             DATE_FORMAT(ts.slot_date, '%d-%m-%Y') as slot_date, 
             TIME_FORMAT(ts.start_time, '%H:%i') as start_time, 
             TIME_FORMAT(ts.end_time, '%H:%i') as end_time
      FROM appointments a
      JOIN doctors d ON a.doctor_id = d.id
      JOIN doctor_time_slot ts ON a.time_slot_id = ts.id
      WHERE a.id = ?`;
      
    db.query(infoSql, [appointmentId], (e, rows) => {
      if (!e && rows.length > 0) {
        const appt = rows[0];
        sendConfirmationEmail({
          name: appt.name,
          email: appt.email,
          doctor: appt.doctor_name,
          room: appt.room_number,
          floor: 'N/A',
          date: appt.slot_date,
          start: appt.start_time,
          end: appt.end_time,
          reason: appt.reason,
          payment: appt.payment_status
        });
      }
      res.json({ message: 'Xác nhận thành công!' });
    });
  });
});
router.get('/my-appointments', authMiddleware, (req, res) => {
  const customerId = req.user.id;
     const sql = `
     SELECT 
       a.id,
       a.status,
       a.reason,
       a.doctor_id,
       a.payment_status,
       a.payment_method,
       a.transaction_id,
       a.paid_amount,
       a.payment_date,
       d.name AS doctor_name,
       d.img AS doctor_img,
       spec.name AS specialization_name,
       ts.slot_date,
       ts.start_time,
       r.rating,
       r.comment,
       r.status AS rating_status
     FROM appointments a
     JOIN doctors d ON a.doctor_id = d.id
     JOIN specializations spec ON d.specialization_id = spec.id
     JOIN doctor_time_slot ts ON a.time_slot_id = ts.id
     LEFT JOIN ratings r ON a.id = r.appointment_id
     WHERE a.customer_id = ?
     ORDER BY ts.slot_date DESC, ts.start_time DESC`;

  db.query(sql, [customerId], (err, results) => {
    if (err) {
      // Lần tới nếu có lỗi, nó sẽ hiển thị ở đây
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

/**
 * ==========================================================
 * ROUTE 5: CẬP NHẬT THANH TOÁN CHO BÁC SĨ
 * ==========================================================
 */
router.put('/:id/payment', (req, res) => {
  const { id } = req.params;
  const { payment_method, paid_amount, payment_note } = req.body;

  // Kiểm tra dữ liệu đầu vào
  if (!payment_method || !paid_amount) {
    return res.status(400).json({ 
      error: "Thiếu thông tin thanh toán." 
    });
  }

  console.log('💰 Updating payment for appointment:', { id, payment_method, paid_amount, payment_note });

  // Cập nhật: số tiền vào paid_amount, ghi chú vào transaction_id
  const sql = `
    UPDATE appointments 
    SET 
      payment_status = 'Đã thanh toán',
      payment_method = ?,
      paid_amount = ?,
      payment_date = NOW(),
      transaction_id = ?
    WHERE id = ?
  `;

  db.query(sql, [payment_method, paid_amount, payment_note || null, id], (err, result) => {
    if (err) {
      console.error("❌ Lỗi khi cập nhật thanh toán:", err);
      return res.status(500).json({ error: "Không thể cập nhật thanh toán." });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Không tìm thấy cuộc hẹn." });
    }
    
    console.log("✅ Cập nhật thanh toán thành công cho appointment ID:", id);
    res.json({ 
      message: "✅ Cập nhật thanh toán thành công.",
      data: {
        payment_method,
        paid_amount,
        payment_note
      }
    });
  });
});

/**
 * ==========================================================
 * ROUTE 6: LẤY THÔNG TIN CHI TIẾT CUỘC HẸN (Dành cho bác sĩ)
 * METHOD: GET /api/appointments/:id/details
 * ==========================================================
 */
router.get('/:id/details', [authMiddleware, isDoctor], (req, res) => {
  const { id: appointmentId } = req.params;
  const doctorId = req.user.id;

  const sql = `
    SELECT 
      a.id,
      a.customer_id,
      a.name,
      a.age,
      a.gender,
      a.email,
      a.phone,
      a.address,
      a.reason,
      a.status,
      a.payment_status,
      a.payment_method,
      a.paid_amount,
      a.payment_date,
      a.transaction_id,
      d.name AS doctor_name,
      d.room_number,
      ts.slot_date,
      ts.start_time,
      ts.end_time
    FROM appointments a
    JOIN doctors d ON a.doctor_id = d.id
    JOIN doctor_time_slot ts ON a.time_slot_id = ts.id
    WHERE a.id = ? AND a.doctor_id = ?
  `;

  db.query(sql, [appointmentId, doctorId], (err, results) => {
    if (err) {
      console.error("❌ Lỗi khi lấy thông tin cuộc hẹn:", err);
      return res.status(500).json({ message: 'Lỗi máy chủ khi lấy thông tin cuộc hẹn.' });
    }
    
    if (results.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy cuộc hẹn hoặc bạn không có quyền xem.' });
    }

    const appointment = results[0];
    
    // Format dates and times
    const appointmentDate = new Date(appointment.slot_date);
    const formattedDate = appointmentDate.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });

    const formattedStartTime = appointment.start_time.substring(0, 5);
    const formattedEndTime = appointment.end_time.substring(0, 5);

    res.json({
      ...appointment,
      slot_date: formattedDate,
      start_time: formattedStartTime,
      end_time: formattedEndTime
    });
  });
});

module.exports = router;
