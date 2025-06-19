const db = require('../config/db.config');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  // <<< THAY ĐỔI: Bỏ `address` khỏi req.body
  const { name, email, password, phone } = req.body;

  // Kiểm tra dữ liệu đầu vào
  if (!name || !email || !password || !phone) { // Thêm phone vào check
    return res.status(400).json({ msg: "Vui lòng nhập đầy đủ thông tin bắt buộc!" });
  }

  // Kiểm tra biến môi trường
  const secret = process.env.JWT_SECRET || "your_default_secret";
  if (!process.env.JWT_SECRET) {
    console.warn("⚠️ Chưa có biến môi trường JWT_SECRET. Đang dùng giá trị mặc định.");
  }

  try {
    // Kiểm tra email đã tồn tại chưa
    db.query("SELECT * FROM customers WHERE email = ?", [email], async (err, result) => {
      if (err) {
        console.error("❌ Lỗi truy vấn SELECT:", err);
        return res.status(500).json({ msg: "Lỗi server khi kiểm tra email!" });
      }

      if (result.length > 0) {
        return res.status(400).json({ msg: "Email đã được đăng ký!" });
      }

      try {
        // Mã hóa mật khẩu
        const hashedPassword = await bcrypt.hash(password, 10);

        // <<< THAY ĐỔI: Bỏ `address` khỏi câu lệnh INSERT
        db.query(
          "INSERT INTO customers (name, email, password, phone, role_id) VALUES (?, ?, ?, ?, ?)",
          [name, email, hashedPassword, phone, 2], // <<< THAY ĐỔI: Bỏ `address` khỏi mảng giá trị
          (err, result) => {
            if (err) {
              console.error("❌ Lỗi truy vấn INSERT:", err);
              return res.status(500).json({ msg: "Lỗi khi lưu thông tin người dùng!" });
            }

            // Tạo token JWT
            const token = jwt.sign({ id: result.insertId, email }, secret, {
              expiresIn: "7d",
            });

            res.status(201).json({
              msg: "Đăng ký thành công!",
              token,
              // <<< THAY ĐỔI: Bỏ `address` khỏi đối tượng user trả về
              user: {
                id: result.insertId,
                name,
                email,
                phone,
              },
            });
          }
        );
      } catch (hashErr) {
        console.error("❌ Lỗi mã hóa mật khẩu:", hashErr);
        return res.status(500).json({ msg: "Lỗi khi xử lý mật khẩu!" });
      }
    });
  } catch (err) {
    console.error("❌ Lỗi không xác định:", err);
    return res.status(500).json({ msg: "Đã có lỗi xảy ra!" });
  }
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ msg: "Vui lòng nhập email và mật khẩu!" });
  }

  db.query("SELECT * FROM customers WHERE email = ?", [email], async (err, result) => {
    if (err) return res.status(500).json({ msg: "Lỗi server!" });

    if (result.length === 0) {
      return res.status(400).json({ msg: "Email không tồn tại!" });
    }

    const user = result[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ msg: "Mật khẩu không chính xác!" });
    }

    const secret = process.env.JWT_SECRET || "your_default_secret";
    const token = jwt.sign({ id: user.id, email: user.email }, secret, {
      expiresIn: "7d",
    });

    res.status(200).json({
      msg: "Đăng nhập thành công!",
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
};