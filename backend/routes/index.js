const express = require('express');
const router = express.Router();
const db = require('../config/db.config');

// ✅ Lấy danh sách sản phẩm
router.get('/products', (req, res) => {
  db.query('SELECT * FROM products', (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
});

// ✅ Lấy danh sách thương hiệu
router.get('/brands', (req, res) => {
  db.query('SELECT * FROM brands', (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
});

// ✅ Lấy sản phẩm theo brand_id (nếu có query)
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

module.exports = router;
