const express = require('express');
const router = express.Router();
const db = require('../config/db.config');
const multer = require('multer');
const path = require('path');
const fs = require('fs');


// ================== CẤU HÌNH UPLOAD ẢNH ==================
const UPLOAD_DIR = path.join(__dirname, '..', 'public', 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_DIR);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

// ================== ĐIỀU PHỐI ROUTER CHÍNH ==================
const authRoutes = require('./authRoutes');
const userRoutes = require('./user.routes');
const doctorRoutes = require('./doctor.routes');
const appointmentRoutes = require('./appointment.routes');
const dashboardRoutes = require('./dashboard.routes');
const medicalRecordRoutes = require('./medicalRecord.routes');
const ratingRoutes = require('./rating.routes'); // <-- Import
const adminRoutes = require('./admin.routes');
const scheduleRoutes = require('./schedule.routes');
const paymentRoutes = require('./payment.routes');



router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/admin', adminRoutes);
router.use('/doctors', doctorRoutes);
router.use('/appointments', appointmentRoutes);
router.use('/dashboard', dashboardRoutes); // Gắn đúng path /dashboard/:
router.use('/medical-records', medicalRecordRoutes);
router.use('/ratings', ratingRoutes);
router.use('/schedules', scheduleRoutes);
router.use('/payment', paymentRoutes); 

// Các route khác (sản phẩm, chuyên khoa, slot, v.v... giữ nguyên như cũ)

router.get('/products', (req, res) => {
  db.query('SELECT * FROM products', (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
});

router.get('/products-by-brand', (req, res) => {
  const { brand_id } = req.query;
  const sql = brand_id ? 'SELECT * FROM products WHERE brand_id = ?' : 'SELECT * FROM products';
  const values = brand_id ? [brand_id] : [];
  db.query(sql, values, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
});
// Lưu bệnh án (diagnosis)
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

  db.query(
    sql,
    [diagnosis, doctor_note, follow_up_date, is_examined || 0, id],
    (err, result) => {
      if (err) {
        console.error("❌ Lỗi khi lưu bệnh án:", err);
        return res.status(500).json({ error: "Không thể lưu bệnh án." });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Không tìm thấy lịch hẹn." });
      }
      res.json({ message: "✅ Lưu bệnh án thành công." });
    }
  );
});

router.get('/doctors/top', (req, res) => {
  const sql = `
    SELECT 
      d.id, 
      d.name, 
      d.img, 
      s.name AS specialty,
      s.price AS price,
      GROUP_CONCAT(DISTINCT DATE_FORMAT(ts.slot_date, '%Y-%m-%d')) AS available_dates
    FROM doctors d
    JOIN specializations s ON d.specialization_id = s.id
    LEFT JOIN doctor_time_slot ts ON ts.doctor_id = d.id
    WHERE d.account_status = 'active'
    GROUP BY d.id
    LIMIT 4`;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: 'Lỗi server' });
    res.json(results);
  });
});
/// Phải nằm BÊN TRONG router.get!



router.get('/doctors-by-specialization/:specializationId', (req, res) => {
  const { specializationId } = req.params;
  if (!specializationId) return res.status(400).json({ error: 'Thiếu ID chuyên khoa.' });

  const sql = `
    SELECT 
      id, name, img, introduction, specialization_id,
      certificate_image AS certificate, degree_image AS degree
    FROM doctors 
    WHERE specialization_id = ? AND account_status = 'active'`;
  db.query(sql, [specializationId], (err, results) => {
    if (err) return res.status(500).json({ error: 'Lỗi server.' });
    res.json(results);
  });
});
// thống kê tổng quan

router.get('/doctors/:doctorId/time-slots', (req, res) => {
  const { doctorId } = req.params;

  // 1. Kiểm tra đầu vào
  if (!doctorId || isNaN(parseInt(doctorId))) {
    return res.status(400).json({ error: 'ID bác sĩ không hợp lệ.' });
  }

  // 2. Câu lệnh SQL "Tất cả trong một", đã sửa 'note' thành 'reason'
  const sql = `
    SELECT 
      dts.id, 
      DATE_FORMAT(dts.slot_date, '%Y-%m-%d') AS slot_date,
      dts.start_time, 
      dts.end_time,
      dts.is_active,
      a.id AS appointment_id,
      a.customer_id,
      a.name AS patient_name,
      a.email AS patient_email,
      a.phone AS patient_phone,
      a.reason AS patient_note,      -- << ĐÃ SỬA TẠI ĐÂY
      a.payment_status,
      a.payment_method,
      a.paid_amount,
      a.transaction_id,
      a.payment_date,
      a.status AS booking_status,
      a.diagnosis,
      a.doctor_note,
      a.follow_up_date,
      a.is_examined
    FROM doctor_time_slot AS dts
    LEFT JOIN appointments AS a ON dts.id = a.time_slot_id AND a.status != 'Đã hủy'
    WHERE dts.doctor_id = ? AND dts.slot_date >= CURDATE()
    ORDER BY dts.slot_date, dts.start_time`;

  // 3. Thực thi truy vấn
  db.query(sql, [doctorId], (err, results) => {
    // Bẫy lỗi nếu truy vấn SQL thất bại
    if (err) {
      console.error(`[ERROR] Lỗi khi truy vấn time-slots cho doctorId ${doctorId}:`, err);
      return res.status(500).json({ error: 'Lỗi máy chủ khi truy vấn dữ liệu.' });
    }

    // 4. Xử lý và gom nhóm kết quả
    try {
      const groupedSlots = results.reduce((acc, slot) => {
        const date = slot.slot_date;
        if (!acc[date]) {
          acc[date] = [];
        }

        // Tạo object booking nếu có cuộc hẹn tồn tại (appointment_id không phải là null)
        const bookingInfo = slot.appointment_id
          ? {
              id: slot.appointment_id,
              customer_id: slot.customer_id,
              patientName: slot.patient_name,
              patientEmail: slot.patient_email,
              patientPhone: slot.patient_phone,
              note: slot.patient_note, // Frontend sẽ nhận trường `note`
              paymentStatus: slot.payment_status,
              paymentMethod: slot.payment_method,
              paidAmount: slot.paid_amount,
              transactionId: slot.transaction_id,
              paymentDate: slot.payment_date,
              status: slot.booking_status,
              diagnosis: slot.diagnosis,
              doctorNote: slot.doctor_note,
              followUpDate: slot.follow_up_date,
              isExamined: !!slot.is_examined
            }
          : null;

        acc[date].push({
          id: slot.id, // ID của time_slot
          start: slot.start_time.substring(0, 5),
          end: slot.end_time.substring(0, 5),
          is_active: !!slot.is_active, // Chuyển 1/0 thành true/false
          is_booked: !!bookingInfo,     // true nếu có cuộc hẹn, false nếu không
          booking: bookingInfo          // Object chi tiết cuộc hẹn hoặc null
        });

        return acc;
      }, {});

      // 5. Trả về kết quả thành công
      res.json(groupedSlots);

    } catch (e) {
      // Bẫy lỗi nếu có sự cố trong lúc xử lý logic (ví dụ: lỗi với hàm reduce)
      console.error(`[ERROR] Lỗi logic khi xử lý time-slots cho doctorId ${doctorId}:`, e);
      res.status(500).json({ error: 'Lỗi máy chủ khi xử lý dữ liệu.' });
    }
  });
});


router.put('/appointments/:id/reject', (req, res) => {
  const { id } = req.params;
  const sql = `
    UPDATE appointments
    SET status = 'Từ chối'
    WHERE id = ?`;
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Lỗi khi từ chối lịch hẹn.' });
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Không tìm thấy lịch hẹn.' });
    res.json({ message: 'Đã từ chối lịch hẹn.' });
  });
});


router.get('/specializations', (req, res) => {
  const search = req.query.search;
  let sql = "SELECT id, name, image, price FROM specializations";
  let values = [];
  if (search) {
    sql += " WHERE name LIKE ?";
    values.push(`%${search}%`);
  }
  console.log('GET /specializations query:', sql, values);
  db.query(sql, values, (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: "Lỗi server." });
    }
    console.log('GET /specializations results:', results);
    res.json(results);
  });
});

router.get('/specializations/top', (req, res) => {
  const sql = `SELECT id, name, image, price FROM specializations ORDER BY id DESC LIMIT 4`;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: "Lỗi server." });
    res.json(results);
  });
});

router.get('/specializations/:id', (req, res) => {
  const { id } = req.params;
  db.query("SELECT id, name, image, price FROM specializations WHERE id = ?", [id], (err, results) => {
    if (err) return res.status(500).json({ error: 'Lỗi server.' });
    if (results.length === 0) return res.status(404).json({ error: 'Không tìm thấy.' });
    res.json(results[0]);
  });
});
router.get('/doctors/:doctorId/schedule', (req, res) => {
  const doctorId = req.params.doctorId;

  const sql = `
    SELECT 
      ts.id AS slot_id,
      DATE_FORMAT(ts.slot_date, '%Y-%m-%d') AS slot_date,
      TIME_FORMAT(ts.start_time, '%H:%i') AS start_time,
      TIME_FORMAT(ts.end_time, '%H:%i') AS end_time,
      a.id AS appointment_id,
      a.name AS patient_name,
      a.status
    FROM doctor_time_slot ts
    LEFT JOIN appointments a ON a.time_slot_id = ts.id AND a.doctor_id = ?
    WHERE ts.doctor_id = ?
    ORDER BY 
      CASE 
        WHEN a.status = 'Chưa xác nhận' THEN 0
        ELSE 1
      END,
      ts.slot_date, ts.start_time
  `;

  db.query(sql, [doctorId, doctorId], (err, results) => {
    if (err) {
      console.error("Lỗi truy vấn lịch khám:", err);
      return res.status(500).json({ error: 'Lỗi server' });
    }

    const grouped = {};
    results.forEach(slot => {
      const date = slot.slot_date;
      if (!grouped[date]) grouped[date] = [];

      grouped[date].push({
        slotId: slot.slot_id,
        time: `${slot.start_time} - ${slot.end_time}`,
        booked: !!slot.appointment_id,
        confirmation: slot.status,
        patient: slot.patient_name || null,
        status: slot.status
      });
    });

    res.json(grouped);
  });
});

router.get('/doctors/:doctorId/dashboard', (req, res) => {
  const doctorId = req.params.doctorId;
  const sql = `
    SELECT 
      COUNT(*) AS total_appointments,
      SUM(CASE WHEN status = 'Chưa xác nhận' THEN 1 ELSE 0 END) AS pending_confirmations
    FROM appointments
    WHERE doctor_id = ?`;

  db.query(sql, [doctorId], (err, results) => {
    if (err) {
      console.error('Lỗi lấy dashboard:', err);
      return res.status(500).json({ error: 'Lỗi server' });
    }
    res.json(results[0]);
  });
});

router.post('/specializations', upload.single('image'), (req, res) => {
  const { name, price } = req.body;
  if (!req.file || !name) return res.status(400).json({ error: 'Thiếu tên hoặc ảnh.' });
  const imageUrl = `/uploads/${req.file.filename}`;
  const priceValue = price ? parseFloat(price) : 0;
  db.query('INSERT INTO specializations (name, image, price) VALUES (?, ?, ?)', [name, imageUrl, priceValue], (err, result) => {
    if (err) return res.status(500).json({ error: 'Lỗi khi thêm chuyên khoa.' });
    res.status(201).json({ message: 'Thêm thành công!', newSpecialization: { id: result.insertId, name, image: imageUrl, price: priceValue } });
  });
});

router.put('/specializations/:id', upload.single('image'), (req, res) => {
  const { id } = req.params;
  const { name, price } = req.body;
  console.log('Update specialization request:', { id, name, price, file: req.file });
  
  if (!name) return res.status(400).json({ error: 'Tên là bắt buộc.' });
  const priceValue = price ? parseFloat(price) : 0;
  console.log('Parsed price value:', priceValue);
  
  if (req.file) {
    const imageUrl = `/uploads/${req.file.filename}`;
    console.log('Updating with image:', imageUrl);
    db.query('UPDATE specializations SET name = ?, image = ?, price = ? WHERE id = ?', [name, imageUrl, priceValue, id], (err, result) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Lỗi cập nhật' });
      }
      if (result.affectedRows === 0) {
        console.log('No rows affected for ID:', id);
        return res.status(404).json({ error: 'Không tìm thấy' });
      }
      console.log('Update successful, affected rows:', result.affectedRows);
      res.json({ message: 'Cập nhật thành công!' });
    });
  } else {
    console.log('Updating without image');
    db.query('UPDATE specializations SET name = ?, price = ? WHERE id = ?', [name, priceValue, id], (err, result) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Lỗi cập nhật' });
      }
      if (result.affectedRows === 0) {
        console.log('No rows affected for ID:', id);
        return res.status(404).json({ error: 'Không tìm thấy' });
      }
      console.log('Update successful, affected rows:', result.affectedRows);
      res.json({ message: 'Cập nhật thành công!' });
    });
  }
});

router.delete('/specializations/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM specializations WHERE id = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Lỗi xóa.' });
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Không tìm thấy chuyên khoa.' });
    res.json({ message: 'Xóa thành công!' });
  });
});

// GET: Lấy danh sách tất cả các bác sĩ (chỉ lấy các bác sĩ đang hoạt động)
router.get('/doctors', (req, res) => {
  const sql = `
    SELECT 
      d.id, 
      d.name, 
      d.phone, 
      d.email, 
      d.img, 
      d.introduction, 
      d.certificate_image, 
      d.degree_image, 
      d.account_status,
      s.name AS specialty_name,
      s.price AS price
    FROM doctors d
    LEFT JOIN specializations s ON d.specialization_id = s.id
    WHERE d.account_status = 'active'`;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: 'Lỗi server khi truy vấn dữ liệu.' });
    res.json(results);
  });
});


// Thay thế route này trong file index.js của bạn

router.get('/specializations/:specializationId/schedule', (req, res) => {
    const { specializationId } = req.params;
    const { date } = req.query;

    if (!specializationId || !date) {
        return res.status(400).json({ error: 'Thiếu ID chuyên khoa hoặc ngày.' });
    }

            const sql = `
        SELECT 
            dts.id AS time_slot_id,
            dts.is_active, 
            TIME_FORMAT(dts.start_time, '%H:%i') AS start_time,
            TIME_FORMAT(dts.end_time, '%H:%i') AS end_time,
            d.id AS doctor_id,
            d.name AS doctor_name,
            d.img AS doctor_img,
            s.price AS specialty_price,
            a.id AS appointment_id
        FROM doctor_time_slot dts
        JOIN doctors d ON dts.doctor_id = d.id
        JOIN specializations s ON d.specialization_id = s.id
        LEFT JOIN appointments a ON dts.id = a.time_slot_id AND a.status != 'Đã hủy'
        WHERE 
            d.specialization_id = ? 
            AND d.account_status = 'active'
            AND dts.slot_date = ?
        ORDER BY dts.start_time, d.name;
    `;

    db.query(sql, [specializationId, date], (err, results) => {
        if (err) {
            console.error("Lỗi truy vấn lịch khám:", err);
            return res.status(500).json({ error: 'Lỗi server.' });
        }

        // <<<<<<< SỬA ĐỔI LOGIC GOM NHÓM >>>>>>>
        const groupedByTime = results.reduce((acc, slot) => {
            const timeKey = `${slot.start_time} - ${slot.end_time}`;

            if (!acc[timeKey]) {
                acc[timeKey] = {
                    time: timeKey,
                    totalSlots: 0,
                    availableSlots: 0,
                    bookedSlots: 0,     // Đếm số slot đã được đặt
                    inactiveSlots: 0,   // Đếm số slot bị bác sĩ tắt
                    slots: []
                };
            }

            const group = acc[timeKey];
            group.totalSlots++;

            if (slot.appointment_id !== null) {
                group.bookedSlots++;
            } else if (!slot.is_active) {
                group.inactiveSlots++;
            } else {
                // Chỉ "có sẵn" khi chưa đặt VÀ bác sĩ đang bật
                group.availableSlots++;
                
                // Sử dụng giá từ chuyên khoa thay vì giá của bác sĩ
                const finalPrice = slot.specialty_price || 0;
                
                group.slots.push({
                    time_slot_id: slot.time_slot_id,
                    doctor: {
                        id: slot.doctor_id,
                        name: slot.doctor_name,
                        img: slot.doctor_img,
                        price: finalPrice // Sử dụng giá từ chuyên khoa
                    }
                });
            }
            return acc;
        }, {});
        
        res.json(Object.values(groupedByTime));
    });
});

module.exports = router;