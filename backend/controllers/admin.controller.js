const db = require('../config/db.config');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const secret = process.env.JWT_SECRET || "your_default_secret";

// [1] Đăng nhập admin
exports.adminLogin = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ msg: "Vui lòng nhập email và mật khẩu." });
  }

  const sql = "SELECT * FROM admins WHERE email = ?";
  db.query(sql, [email], async (err, rows) => {
    if (err) return res.status(500).json({ msg: "Lỗi server!" });
    if (rows.length === 0) return res.status(400).json({ msg: "Tài khoản quản trị không tồn tại." });

    const admin = rows[0];
    const match = await bcrypt.compare(password, admin.password);
    if (!match) return res.status(400).json({ msg: "Mật khẩu không chính xác." });

    const token = jwt.sign(
      { id: admin.id, email: admin.email, role_id: admin.role_id || 1 },
      secret,
      { expiresIn: '1d' }
    );

    res.json({
      msg: "Đăng nhập quản trị viên thành công!",
      token,
      user: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role_id: admin.role_id || 1,
      },
    });
  });
};

// [2] Danh sách người dùng
exports.getAllUsers = (req, res) => {
  const sql = `
    SELECT id, name, email, phone, gender, birthday, address, 
           avatar, is_verified, created_at, role_id
    FROM customers
    ORDER BY created_at DESC
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ success: false, message: 'Lỗi server khi truy vấn dữ liệu.' });
    res.status(200).json(results);
  });
};

// [3] Thống kê tổng quan
exports.getStats = async (req, res) => {
  try {
    const [[{ users }]] = await db.promise().query("SELECT COUNT(*) AS users FROM customers");
    const [[{ doctors }]] = await db.promise().query("SELECT COUNT(*) AS doctors FROM doctors");
    const [[{ appointments }]] = await db.promise().query("SELECT COUNT(*) AS appointments FROM appointments");
    const [[{ examined }]] = await db.promise().query("SELECT COUNT(*) AS examined FROM appointments WHERE is_examined = 1");
    const [[{ notExamined }]] = await db.promise().query("SELECT COUNT(*) AS notExamined FROM appointments WHERE is_examined = 0");

    res.json({ users, doctors, appointments, examined, notExamined });
  } catch (err) {
    console.error("❌ Lỗi getStats:", err);
    res.status(500).json({ error: 'Server error' });
  }
};

// [4] Doanh thu theo tháng
exports.getRevenueByMonth = async (req, res) => {
  try {
    const [result] = await db.promise().query(`
      SELECT DATE_FORMAT(order_date, '%Y-%m') AS month, SUM(total_amount) AS total
      FROM orders
      WHERE payment_status = 'Đã thanh toán'
      GROUP BY month
      ORDER BY month ASC
      LIMIT 12
    `);
    res.json(result);
  } catch (err) {
    console.error("❌ Lỗi getRevenueByMonth:", err);
    res.status(500).json({ error: 'Server error' });
  }
};

// [5] Doanh thu theo ngày
exports.getRevenueByDay = async (req, res) => {
  try {
    const [result] = await db.promise().query(`
      SELECT DATE(order_date) AS day, SUM(total_amount) AS total
      FROM orders
      WHERE payment_status = 'Đã thanh toán'
      GROUP BY day
      ORDER BY day DESC
      LIMIT 30
    `);
    res.json(result);
  } catch (err) {
    console.error("❌ Lỗi getRevenueByDay:", err);
    res.status(500).json({ error: 'Server error' });
  }
};

// [6] Doanh thu theo năm
exports.getRevenueByYear = async (req, res) => {
  try {
    const [result] = await db.promise().query(`
      SELECT YEAR(order_date) AS year, SUM(total_amount) AS total
      FROM orders
      WHERE payment_status = 'Đã thanh toán'
      GROUP BY year
      ORDER BY year ASC
    `);
    res.json(result);
  } catch (err) {
    console.error("❌ Lỗi getRevenueByYear:", err);
    res.status(500).json({ error: 'Server error' });
  }
};
// controllers/admin.controller.js

// [7] Thống kê lịch đặt khám theo chuyên khoa
// [7] Thống kê lịch đặt khám theo chuyên khoa
// [7] Thống kê lịch đặt khám theo chuyên khoa
exports.getAppointmentStatsBySpecialty = async (req, res) => {
  try {
    const { month, year } = req.query

    let conditions = ''
    const values = []

    if (month) {
      conditions += ' AND MONTH(dts.slot_date) = ?'
      values.push(month)
    }

    if (year) {
      conditions += ' AND YEAR(dts.slot_date) = ?'
      values.push(year)
    }

    const [result] = await db.promise().query(`
      SELECT 
        s.name AS specialization,
        dts.slot_date AS day,
        COUNT(*) AS total_appointments
      FROM appointments a
      JOIN doctors d ON a.doctor_id = d.id
      JOIN specializations s ON d.specialization_id = s.id
      JOIN doctor_time_slot dts ON a.time_slot_id = dts.id
      WHERE 1=1 ${conditions}
      GROUP BY s.name, dts.slot_date
      ORDER BY dts.slot_date ASC
    `, values)

    res.json(result)
  } catch (err) {
    console.error("❌ Lỗi getAppointmentStatsBySpecialty:", err)
    res.status(500).json({ error: 'Server error' })
  }
}


exports.getBookingRatioByMonth = async (req, res) => {
  try {
    const [rows] = await db.promise().query(`
      SELECT 
        DATE_FORMAT(dts.slot_date, '%m/%Y') AS month,
        COUNT(DISTINCT dts.id) AS total_slots,
        COUNT(DISTINCT a.id) AS booked_slots
      FROM doctor_time_slot dts
      LEFT JOIN appointments a ON a.time_slot_id = dts.id AND a.status != 'Đã hủy'
      GROUP BY month
      ORDER BY MIN(dts.slot_date)
    `)

    const result = rows.map(row => ({
      month: row.month,
      ratio: row.total_slots > 0 ? (row.booked_slots / row.total_slots).toFixed(2) : 0
    }))

    res.json(result)
  } catch (err) {
    console.error("❌ Lỗi getBookingRatioByMonth:", err)
    res.status(500).json({ error: "Server error" })
  }
}

// [8] Trả danh sách tất cả chuyên khoa
exports.getAllSpecialties = async (req, res) => {
  try {
    const [rows] = await db.promise().query(`SELECT name FROM specializations ORDER BY name`);
    res.json(rows);
  } catch (err) {
    console.error("❌ Lỗi getAllSpecialties:", err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getPieStats = async (req, res) => {
  try {
    const [[{ verified }]] = await db.promise().query("SELECT COUNT(*) AS verified FROM customers WHERE is_verified = 1")
    const [[{ unverified }]] = await db.promise().query("SELECT COUNT(*) AS unverified FROM customers WHERE is_verified = 0")
    const [[{ examined }]] = await db.promise().query("SELECT COUNT(*) AS examined FROM appointments WHERE is_examined = 1")
    const [[{ not_examined }]] = await db.promise().query("SELECT COUNT(*) AS not_examined FROM appointments WHERE is_examined = 0")
    const [genderStats] = await db.promise().query("SELECT gender, COUNT(*) as count FROM customers GROUP BY gender")
    const [statusStats] = await db.promise().query("SELECT status, COUNT(*) as count FROM appointments GROUP BY status")

    res.json({
      verified, unverified,
      examined, not_examined,
      genderStats,
      statusStats
    })
  } catch (err) {
    console.error("❌ Lỗi getPieStats:", err)
    res.status(500).json({ error: "Server error" })
  }
}