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

// [9] Lấy tất cả hồ sơ bệnh án của tất cả bệnh nhân
exports.getAllMedicalRecords = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', status = '', doctor_id = '' } = req.query;
    const offset = (page - 1) * limit;

    let conditions = [];
    let values = [];

    // Chỉ lấy những hồ sơ bệnh án đã được bác sĩ tạo
    conditions.push("mr.id IS NOT NULL");

    // Tìm kiếm theo tên bệnh nhân
    if (search) {
      conditions.push("(a.name LIKE ? OR c.name LIKE ?)");
      values.push(`%${search}%`, `%${search}%`);
    }

    // Lọc theo trạng thái khám
    if (status) {
      conditions.push("a.status = ?");
      values.push(status);
    }

    // Lọc theo bác sĩ
    if (doctor_id) {
      conditions.push("a.doctor_id = ?");
      values.push(doctor_id);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Query để lấy tổng số records
    const countSql = `
      SELECT COUNT(*) as total
      FROM appointments a
      LEFT JOIN customers c ON a.customer_id = c.id
      LEFT JOIN doctors d ON a.doctor_id = d.id
      LEFT JOIN specializations s ON d.specialization_id = s.id
      LEFT JOIN doctor_time_slot dts ON a.time_slot_id = dts.id
      INNER JOIN medical_records mr ON a.id = mr.appointment_id
      ${whereClause}
    `;

    const [countResult] = await db.promise().query(countSql, values);
    const totalRecords = countResult[0].total;

    // Query chính để lấy dữ liệu
    const sql = `
      SELECT 
        a.id AS appointment_id,
        a.name AS patient_name,
        a.age,
        a.gender,
        a.email AS patient_email,
        a.phone,
        a.reason,
        a.doctor_id,
        a.status,
        a.address,
        a.doctor_confirmation,
        a.doctor_note,
        a.diagnosis,
        a.follow_up_date,
        a.is_examined,
        a.time_slot_id,
        c.name AS customer_name,
        c.id AS customer_id,
        d.name AS doctor_name,
        s.name AS specialization_name,
        dts.start_time,
        dts.end_time,
        dts.slot_date,
        mr.id AS medical_record_id,
        mr.treatment,
        mr.notes AS medical_notes,
        mr.created_at AS medical_record_created_at
      FROM appointments a
      LEFT JOIN customers c ON a.customer_id = c.id
      LEFT JOIN doctors d ON a.doctor_id = d.id
      LEFT JOIN specializations s ON d.specialization_id = s.id
      LEFT JOIN doctor_time_slot dts ON a.time_slot_id = dts.id
      INNER JOIN medical_records mr ON a.id = mr.appointment_id
      ${whereClause}
      ORDER BY mr.created_at DESC
      LIMIT ? OFFSET ?
    `;

    const [records] = await db.promise().query(sql, [...values, parseInt(limit), offset]);

    res.json({
      records,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalRecords / limit),
        totalRecords,
        limit: parseInt(limit)
      }
    });
  } catch (err) {
    console.error("❌ Lỗi getAllMedicalRecords:", err);
    res.status(500).json({ error: 'Server error' });
  }
};

// [10] Lấy chi tiết hồ sơ bệnh án theo ID
exports.getMedicalRecordById = async (req, res) => {
  try {
    const { id } = req.params;

    const sql = `
      SELECT 
        a.id AS appointment_id,
        a.name AS patient_name,
        a.age,
        a.gender,
        a.email AS patient_email,
        a.phone,
        a.reason,
        a.doctor_id,
        a.status,
        a.address,
        a.doctor_confirmation,
        a.doctor_note,
        a.diagnosis,
        a.follow_up_date,
        a.is_examined,
        a.time_slot_id,
        c.name AS customer_name,
        c.id AS customer_id,
        c.birthday,
        c.avatar,
        d.name AS doctor_name,
        d.phone AS doctor_phone,
        d.email AS doctor_email,
        s.name AS specialization_name,
        dts.start_time,
        dts.end_time,
        dts.slot_date,
        mr.id AS medical_record_id,
        mr.treatment,
        mr.notes AS medical_notes,
        mr.created_at AS medical_record_created_at
      FROM appointments a
      LEFT JOIN customers c ON a.customer_id = c.id
      LEFT JOIN doctors d ON a.doctor_id = d.id
      LEFT JOIN specializations s ON d.specialization_id = s.id
      LEFT JOIN doctor_time_slot dts ON a.time_slot_id = dts.id
      LEFT JOIN medical_records mr ON a.id = mr.appointment_id
      WHERE a.id = ?
    `;

    const [records] = await db.promise().query(sql, [id]);

    if (records.length === 0) {
      return res.status(404).json({ error: 'Không tìm thấy hồ sơ bệnh án' });
    }

    res.json(records[0]);
  } catch (err) {
    console.error("❌ Lỗi getMedicalRecordById:", err);
    res.status(500).json({ error: 'Server error' });
  }
};

// [11] Lấy danh sách bác sĩ cho filter
exports.getDoctors = async (req, res) => {
  try {
    const [doctors] = await db.promise().query(`
      SELECT id, name, specialization_id
      FROM doctors 
      WHERE account_status = 'active'
      ORDER BY name ASC
    `);
    res.json(doctors);
  } catch (err) {
    console.error("❌ Lỗi getDoctors:", err);
    res.status(500).json({ error: 'Server error' });
  }
};

// [12] Lấy tất cả hồ sơ bệnh án của các bác sĩ đã tạo
exports.getMedicalRecordsByDoctors = async (req, res) => {
  try {
    const { page = 1, limit = 10, doctor_id = '', search = '', status = '' } = req.query;
    const offset = (page - 1) * limit;

    let conditions = [];
    let values = [];

    // Chỉ lấy những hồ sơ bệnh án đã được bác sĩ tạo
    conditions.push("mr.id IS NOT NULL");

    // Lọc theo bác sĩ cụ thể
    if (doctor_id) {
      conditions.push("mr.doctor_id = ?");
      values.push(doctor_id);
    }

    // Tìm kiếm theo tên bệnh nhân
    if (search) {
      conditions.push("(a.name LIKE ? OR c.name LIKE ?)");
      values.push(`%${search}%`, `%${search}%`);
    }

    // Lọc theo trạng thái khám
    if (status) {
      conditions.push("a.status = ?");
      values.push(status);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Query để lấy tổng số records
    const countSql = `
      SELECT COUNT(*) as total
      FROM medical_records mr
      LEFT JOIN appointments a ON mr.appointment_id = a.id
      LEFT JOIN customers c ON a.customer_id = c.id
      LEFT JOIN doctors d ON mr.doctor_id = d.id
      LEFT JOIN specializations s ON d.specialization_id = s.id
      LEFT JOIN doctor_time_slot dts ON a.time_slot_id = dts.id
      ${whereClause}
    `;

    const [countResult] = await db.promise().query(countSql, values);
    const totalRecords = countResult[0].total;

    // Query chính để lấy dữ liệu
    const sql = `
      SELECT 
        mr.id AS medical_record_id,
        mr.appointment_id,
        mr.doctor_id,
        mr.customer_id,
        mr.diagnosis,
        mr.treatment,
        mr.notes AS medical_notes,
        mr.created_at AS medical_record_created_at,
        a.name AS patient_name,
        a.age,
        a.gender,
        a.email AS patient_email,
        a.phone,
        a.reason,
        a.status,
        a.address,
        a.doctor_confirmation,
        a.doctor_note,
        a.diagnosis AS appointment_diagnosis,
        a.follow_up_date,
        a.is_examined,
        a.time_slot_id,
        c.name AS customer_name,
        d.name AS doctor_name,
        d.phone AS doctor_phone,
        d.email AS doctor_email,
        s.name AS specialization_name,
        dts.start_time,
        dts.end_time,
        dts.slot_date
      FROM medical_records mr
      LEFT JOIN appointments a ON mr.appointment_id = a.id
      LEFT JOIN customers c ON a.customer_id = c.id
      LEFT JOIN doctors d ON mr.doctor_id = d.id
      LEFT JOIN specializations s ON d.specialization_id = s.id
      LEFT JOIN doctor_time_slot dts ON a.time_slot_id = dts.id
      ${whereClause}
      ORDER BY mr.created_at DESC
      LIMIT ? OFFSET ?
    `;

    const [records] = await db.promise().query(sql, [...values, parseInt(limit), offset]);

    res.json({
      records,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalRecords / limit),
        totalRecords,
        limit: parseInt(limit)
      }
    });
  } catch (err) {
    console.error("❌ Lỗi getMedicalRecordsByDoctors:", err);
    res.status(500).json({ error: 'Server error' });
  }
};

// [9] Lấy danh sách lịch hẹn đã thanh toán
exports.getPaidAppointments = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', payment_method = '', date_from = '', date_to = '' } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    
    let conditions = ["a.payment_status = 'Đã thanh toán'"];
    let values = [];

    // Tìm kiếm theo tên bệnh nhân, email, số điện thoại
    if (search) {
      conditions.push("(a.name LIKE ? OR a.email LIKE ? OR a.phone LIKE ?)");
      values.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    // Lọc theo phương thức thanh toán
    if (payment_method) {
      conditions.push("a.payment_method = ?");
      values.push(payment_method);
    }

    // Lọc theo khoảng thời gian thanh toán
    if (date_from) {
      conditions.push("DATE(a.payment_date) >= ?");
      values.push(date_from);
    }

    if (date_to) {
      conditions.push("DATE(a.payment_date) <= ?");
      values.push(date_to);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Query để lấy tổng số records
    const countSql = `
      SELECT COUNT(*) as total
      FROM appointments a
      JOIN doctors d ON a.doctor_id = d.id
      JOIN specializations s ON d.specialization_id = s.id
      JOIN doctor_time_slot dts ON a.time_slot_id = dts.id
      ${whereClause}
    `;

    const [countResult] = await db.promise().query(countSql, values);
    const totalRecords = countResult[0].total;

    // Query chính để lấy dữ liệu
    const sql = `
      SELECT 
        a.id,
        a.name AS patient_name,
        a.age,
        a.gender,
        a.email,
        a.phone,
        a.reason,
        a.address,
        a.payment_status,
        a.payment_method,
        a.transaction_id,
        a.paid_amount,
        a.payment_date,
        a.status,
        a.doctor_confirmation,
        a.doctor_note,
        a.diagnosis,
        a.follow_up_date,
        a.is_examined,
        d.name AS doctor_name,
        d.phone AS doctor_phone,
        d.email AS doctor_email,
        s.name AS specialization_name,
        dts.slot_date,
        dts.start_time,
        dts.end_time
      FROM appointments a
      JOIN doctors d ON a.doctor_id = d.id
      JOIN specializations s ON d.specialization_id = s.id
      JOIN doctor_time_slot dts ON a.time_slot_id = dts.id
      ${whereClause}
      ORDER BY a.payment_date DESC
      LIMIT ? OFFSET ?
    `;

    const [appointments] = await db.promise().query(sql, [...values, parseInt(limit), offset]);

    // Tính tổng doanh thu
    const revenueSql = `
      SELECT SUM(paid_amount) as total_revenue
      FROM appointments a
      ${whereClause}
    `;
    const [revenueResult] = await db.promise().query(revenueSql, values);
    const totalRevenue = revenueResult[0].total_revenue || 0;

    res.json({
      appointments,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalRecords / limit),
        totalRecords,
        limit: parseInt(limit)
      },
      totalRevenue: parseFloat(totalRevenue)
    });
  } catch (err) {
    console.error("❌ Lỗi getPaidAppointments:", err);
    res.status(500).json({ error: 'Server error' });
  }
};

// [10] Thống kê thanh toán theo thời gian
exports.getPaymentStats = async (req, res) => {
  try {
    const { period = 'month' } = req.query;
    
    let groupBy, dateFormat;
    switch (period) {
      case 'day':
        groupBy = 'DATE(payment_date)';
        dateFormat = '%Y-%m-%d';
        break;
      case 'week':
        groupBy = 'YEARWEEK(payment_date)';
        dateFormat = '%Y-%u';
        break;
      case 'month':
      default:
        groupBy = 'DATE_FORMAT(payment_date, "%Y-%m")';
        dateFormat = '%Y-%m';
        break;
    }

    const sql = `
      SELECT 
        DATE_FORMAT(payment_date, ?) AS period,
        COUNT(*) AS total_appointments,
        SUM(paid_amount) AS total_revenue,
        AVG(paid_amount) AS avg_amount
      FROM appointments 
      WHERE payment_status = 'Đã thanh toán' 
        AND payment_date IS NOT NULL
      GROUP BY ${groupBy}
      ORDER BY period DESC
      LIMIT 12
    `;

    const [stats] = await db.promise().query(sql, [dateFormat]);
    res.json(stats);
  } catch (err) {
    console.error("❌ Lỗi getPaymentStats:", err);
    res.status(500).json({ error: 'Server error' });
  }
};