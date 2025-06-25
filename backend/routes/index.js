const express = require('express');
const router = express.Router();
const db = require('../config/db.config');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// ================== CẤU HÌNH UPLOAD ẢNH (Giữ nguyên) ==================
const UPLOAD_DIR = path.join(__dirname, '..', 'public', 'uploads');

// SỬA LỖI Ở ĐÂY: UPLOAD_DÍR -> UPLOAD_DIR
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


// ================== ĐIỀU PHỐI ROUTER (Phần quan trọng nhất) ==================
// 1. Import các router con mà chúng ta đã tạo
const authRoutes = require('./auth.routes'); // Route cho /register, /login
const userRoutes = require('./user.routes'); // Route cho /profile

// 2. Gắn các router con vào đường dẫn tương ứng
// Mọi request tới /api/auth/* sẽ được authRoutes xử lý
router.use('/auth', authRoutes);

// Mọi request tới /api/users/* sẽ được userRoutes xử lý (GET, PUT profile)
router.use('/users', userRoutes);


// ================== CÁC API CŨ CỦA BẠN (Giữ nguyên) ==================
// Các API này vẫn hoạt động bình thường

// === API SẢN PHẨM ===
router.get('/products', (req, res) => {
  db.query('SELECT * FROM products', (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
});

router.get('/products-by-brand', (req, res) => {
  const { brand_id } = req.query;
  const sql = brand_id
    ? 'SELECT * FROM products WHERE brand_id = ?'
    : 'SELECT * FROM products';
  const values = brand_id ? [brand_id] : [];
  db.query(sql, values, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
});

// === API BÁC SĨ & LỊCH KHÁM ===
router.get('/doctors-by-specialization/:specializationId', (req, res) => {
  const { specializationId } = req.params;
  if (!specializationId) return res.status(400).json({ error: 'Thiếu ID chuyên khoa.' });

  const sql = `
    SELECT 
      id, name, img, introduction, specialization_id,
      certificate_image AS certificate, degree_image AS degree
    FROM doctors 
    WHERE specialization_id = ? AND account_status = 'active'
  `;
  db.query(sql, [specializationId], (err, results) => {
    if (err) {
      console.error("Lỗi truy vấn bác sĩ:", err);
      return res.status(500).json({ error: 'Lỗi server.' });
    }
    res.json(results);
  });
});

router.get('/doctors/:doctorId/time-slots', (req, res) => {
    const { doctorId } = req.params;
    if (!doctorId) return res.status(400).json({ error: 'Thiếu ID bác sĩ.' });
  
    const sql = `
      SELECT slot_date, start_time, end_time
      FROM doctor_time_slot 
      WHERE doctor_id = ? AND slot_date >= CURDATE()
      ORDER BY slot_date, start_time
    `;
    db.query(sql, [doctorId], (err, results) => {
      if (err) {
        console.error("Lỗi truy vấn slot:", err);
        return res.status(500).json({ error: 'Lỗi server.' });
      }
      const groupedSlots = results.reduce((acc, slot) => {
        const dateObj = new Date(slot.slot_date);
        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const day = String(dateObj.getDate()).padStart(2, '0');
        const date = `${year}-${month}-${day}`;
        const start = slot.start_time.substring(0, 5);
        const end = slot.end_time.substring(0, 5);
  
        if (!acc[date]) acc[date] = [];
        acc[date].push({ start, end });
        return acc;
      }, {});
      res.json(groupedSlots);
    });
});

// === API CHUYÊN KHOA (CRUD) ===
// (Giữ nguyên toàn bộ các route GET, POST, PUT, DELETE cho /specializations)
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
      res.status(201).json({ message: 'Thêm thành công!', newSpecialization: { id: result.insertId, name, image: imageUrl }});
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
      if (err || result.affectedRows === 0) return res.status(err ? 500 : 404).json({ error: err ? 'Lỗi xóa' : 'Không tìm thấy' });
      res.json({ message: 'Xóa thành công!' });
    });
});

module.exports = router;