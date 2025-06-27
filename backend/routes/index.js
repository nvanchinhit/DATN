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

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/doctors', doctorRoutes);
router.use('/appointments', appointmentRoutes);
router.use('/dashboard', dashboardRoutes); // Gắn đúng path /dashboard/:id

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

router.get('/doctors/top', (req, res) => {
  const sql = `
    SELECT 
      d.id, 
      d.name, 
      d.img, 
      s.name AS specialty,
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

router.get('/doctors/:doctorId/time-slots', (req, res) => {
  const { doctorId } = req.params;
  if (!doctorId) return res.status(400).json({ error: 'Thiếu ID bác sĩ.' });

  const sql = `
    SELECT 
      dts.id, 
      DATE_FORMAT(dts.slot_date, '%Y-%m-%d') AS slot_date,
      dts.start_time, 
      dts.end_time,
      CASE WHEN a.id IS NOT NULL THEN TRUE ELSE FALSE END AS is_booked
    FROM doctor_time_slot AS dts
    LEFT JOIN appointments AS a ON dts.id = a.time_slot_id
    WHERE dts.doctor_id = ? AND dts.slot_date >= CURDATE()
    ORDER BY dts.slot_date, dts.start_time`;
  db.query(sql, [doctorId], (err, results) => {
    if (err) return res.status(500).json({ error: 'Lỗi server.' });
    const groupedSlots = results.reduce((acc, slot) => {
      const date = slot.slot_date; 
      const start = slot.start_time.substring(0, 5);
      const end = slot.end_time.substring(0, 5);
      if (!acc[date]) acc[date] = [];
      acc[date].push({ id: slot.id, start, end, is_booked: !!slot.is_booked });
      return acc;
    }, {});
    res.json(groupedSlots);
  });
});

router.get('/specializations', (req, res) => {
  const search = req.query.search;
  let sql = "SELECT id, name, image FROM specializations";
  let values = [];
  if (search) {
    sql += " WHERE name LIKE ?";
    values.push(`%${search}%`);
  }
  db.query(sql, values, (err, results) => {
    if (err) return res.status(500).json({ error: "Lỗi server." });
    res.json(results);
  });
});

router.get('/specializations/top', (req, res) => {
  const sql = `SELECT id, name, image FROM specializations ORDER BY id DESC LIMIT 4`;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: "Lỗi server." });
    res.json(results);
  });
});

router.get('/specializations/:id', (req, res) => {
  const { id } = req.params;
  db.query("SELECT id, name, image FROM specializations WHERE id = ?", [id], (err, results) => {
    if (err) return res.status(500).json({ error: 'Lỗi server.' });
    if (results.length === 0) return res.status(404).json({ error: 'Không tìm thấy.' });
    res.json(results[0]);
  });
});

router.post('/specializations', upload.single('image'), (req, res) => {
  const { name } = req.body;
  if (!req.file || !name) return res.status(400).json({ error: 'Thiếu tên hoặc ảnh.' });
  const imageUrl = `/uploads/${req.file.filename}`;
  db.query('INSERT INTO specializations (name, image) VALUES (?, ?)', [name, imageUrl], (err, result) => {
    if (err) return res.status(500).json({ error: 'Lỗi khi thêm chuyên khoa.' });
    res.status(201).json({ message: 'Thêm thành công!', newSpecialization: { id: result.insertId, name, image: imageUrl } });
  });
});

router.put('/specializations/:id', upload.single('image'), (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'Tên là bắt buộc.' });
  if (req.file) {
    const imageUrl = `/uploads/${req.file.filename}`;
    db.query('UPDATE specializations SET name = ?, image = ? WHERE id = ?', [name, imageUrl, id], (err, result) => {
      if (err || result.affectedRows === 0) return res.status(err ? 500 : 404).json({ error: err ? 'Lỗi cập nhật' : 'Không tìm thấy' });
      res.json({ message: 'Cập nhật thành công!' });
    });
  } else {
    db.query('UPDATE specializations SET name = ? WHERE id = ?', [name, id], (err, result) => {
      if (err || result.affectedRows === 0) return res.status(err ? 500 : 404).json({ error: err ? 'Lỗi cập nhật' : 'Không tìm thấy' });
      res.json({ message: 'Cập nhật tên thành công!' });
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
      s.name AS specialty_name 
    FROM doctors d
    LEFT JOIN specializations s ON d.specialization_id = s.id
    WHERE d.account_status = 'active'`;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: 'Lỗi server khi truy vấn dữ liệu.' });
    res.json(results);
  });
});

module.exports = router;