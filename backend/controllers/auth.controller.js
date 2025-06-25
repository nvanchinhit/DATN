// backend/controllers/auth.controller.js
const db = require('../config/db.config');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-key";

/**
 * Đăng ký người dùng mới
 */
exports.register = (req, res) => {
  const { name, email, password, phone } = req.body;

  if (!name || !email || !password || !phone) {
    return res.status(400).json({ success: false, message: "Vui lòng nhập đầy đủ thông tin bắt buộc." });
  }

  // 1. Kiểm tra xem email đã tồn tại chưa
  db.query("SELECT email FROM customers WHERE email = ?", [email], (err, results) => {
    if (err) {
      console.error("❌ Lỗi khi kiểm tra email:", err);
      return res.status(500).json({ success: false, message: "Lỗi server khi đăng ký." });
    }

    if (results.length > 0) {
      return res.status(400).json({ success: false, message: "Email đã được đăng ký!" });
    }

    // 2. Mã hóa mật khẩu
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        console.error("❌ Lỗi khi mã hóa mật khẩu:", err);
        return res.status(500).json({ success: false, message: "Lỗi xử lý mật khẩu." });
      }

      const role_id = 2; // Mặc định là user

      // 3. Thêm người dùng mới vào CSDL
      db.query(
        "INSERT INTO customers (name, email, password, phone, role_id) VALUES (?, ?, ?, ?, ?)",
        [name, email, hashedPassword, phone, role_id],
        (err, result) => {
          if (err) {
            console.error("❌ Lỗi khi thêm người dùng:", err);
            return res.status(500).json({ success: false, message: "Lỗi khi lưu người dùng." });
          }

          const userId = result.insertId;
          const token = jwt.sign({ id: userId, email, role_id }, JWT_SECRET, { expiresIn: "7d" });

          res.status(201).json({
            success: true,
            message: "Đăng ký thành công!",
            token,
            user: { id: userId, name, email, phone, role_id },
          });
        }
      );
    });
  });
};

/**
 * Đăng nhập người dùng
 */
exports.login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Vui lòng nhập email và mật khẩu!" });
  }

  // 1. Tìm người dùng bằng email
  db.query("SELECT * FROM customers WHERE email = ?", [email], (err, results) => {
    if (err) {
      console.error("❌ Lỗi khi tìm người dùng:", err);
      return res.status(500).json({ success: false, message: "Lỗi server khi đăng nhập." });
    }

    if (results.length === 0) {
      return res.status(404).json({ success: false, message: "Email không tồn tại!" });
    }

    const user = results[0];

    // 2. So sánh mật khẩu
    bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) {
            console.error("❌ Lỗi khi so sánh mật khẩu:", err);
            return res.status(500).json({ success: false, message: "Lỗi server." });
        }
        
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Mật khẩu không chính xác!" });
        }

        const token = jwt.sign({ id: user.id, email: user.email, role_id: user.role_id }, JWT_SECRET, {
            expiresIn: "7d",
        });

        res.status(200).json({
            success: true,
            message: "Đăng nhập thành công!",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role_id: user.role_id,
            },
        });
    });
  });
};


// Các hàm khác có thể được triển khai sau
exports.refreshToken = (req, res) => res.status(501).json({ success: false, message: 'Chức năng chưa được triển khai' });
exports.logout = (req, res) => res.status(501).json({ success: false, message: 'Chức năng chưa được triển khai' });
exports.forgotPassword = (req, res) => res.status(501).json({ success: false, message: 'Chức năng chưa được triển khai' });
exports.resetPassword = (req, res) => res.status(501).json({ success: false, message: 'Chức năng chưa được triển khai' });