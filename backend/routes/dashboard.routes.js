// File: routes/dashboard.routes.js
const express = require('express');
const router = express.Router();
const db = require('../config/db.config');

router.get('/:id/dashboard', (req, res) => {
  const doctorId = req.params.id;

  const today = new Date().toISOString().split('T')[0]; // yyyy-mm-dd

  // Lấy tổng số lịch hôm nay & số bệnh nhân chưa xác nhận
  const sqlToday = `
    SELECT 
      COUNT(*) AS total_today,
      SUM(CASE WHEN doctor_confirmation = 'Chưa xác nhận' THEN 1 ELSE 0 END) AS pending
    FROM appointments
    WHERE doctor_id = ? AND DATE(created_at) = ?
  `;

  // Biểu đồ 7 ngày gần nhất
  const sqlChart = `
    SELECT 
      DATE(created_at) AS date,
      COUNT(*) AS total
    FROM appointments
    WHERE doctor_id = ?
    GROUP BY DATE(created_at)
    ORDER BY DATE(created_at) DESC
    LIMIT 7
  `;

  db.query(sqlToday, [doctorId, today], (err1, todayResult) => {
    if (err1) return res.status(500).json({ error: 'Lỗi thống kê hôm nay.' });

    db.query(sqlChart, [doctorId], (err2, chartResult) => {
      if (err2) return res.status(500).json({ error: 'Lỗi biểu đồ.' });

      const chart = chartResult
        .map(row => ({
          date: row.date.toISOString().slice(5, 10).replace('-', '/'), // mm/dd
          total: row.total
        }))
        .reverse(); // sắp tăng dần theo thời gian

      res.json({
        today: todayResult[0], // { total_today, pending }
        chart
      });
    });
  });
});

module.exports = router;
