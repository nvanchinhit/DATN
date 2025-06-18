const express = require('express');
const router = express.Router();
const db = require('../config/db.config');

const authRoutes = require('./authRoutes');
router.use('/auth', authRoutes);

// API: Lấy toàn bộ sản phẩm
router.get('/products', (req, res) => {
  db.query('SELECT * FROM products', (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
});

// API: Lấy sản phẩm theo brand_id (nếu có)
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

// API: Lấy danh sách chuyên khoa
router.get('/specializations', (req, res) => {
  db.query('SELECT * FROM specializations', (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
});

// ✅ API: Lấy danh sách bác sĩ kèm chuyên khoa
router.get('/doctors', (req, res) => {
  const sql = `
    SELECT 
      doctors.id, doctors.name, doctors.phone, doctors.email, doctors.img, 
      specializations.name AS specialization
    FROM doctors
    JOIN specializations ON doctors.specialization_id = specializations.id
  `;

  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
});

// ✅ API: Lấy bác sĩ theo chuyên khoa
router.get('/specializations', (req, res) => {
  const sql = 'SELECT * FROM specializations ORDER BY name ASC';

  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
});


module.exports = router;
