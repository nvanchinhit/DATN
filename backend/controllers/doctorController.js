const db = require("../config/db.config");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendMail = require("../utils/mailer");

const secret = process.env.JWT_SECRET || "your_default_secret";

// Hàm tạo mật khẩu ngẫu nhiên
function generatePassword(length = 10) {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += chars[Math.floor(Math.random() * chars.length)];
  }
  return password;
}

// =========== ADMIN THÊM BÁC SĨ =========== 
exports.createDoctorAccount = async (req, res) => {
  const { name, email, specialization_id } = req.body;

  if (!name || !email || !specialization_id) {
    return res.status(400).json({ msg: "Vui lòng điền đầy đủ tên, email và chuyên khoa!" });
  }

  db.query("SELECT * FROM doctors WHERE email = ?", [email], async (err, result) => {
    if (err) return res.status(500).json({ msg: "Lỗi khi kiểm tra email!" });
    if (result.length > 0) return res.status(400).json({ msg: "Email này đã tồn tại!" });

    const password = generatePassword();
    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = `
      INSERT INTO doctors (name, email, password, specialization_id, account_status, role_id)
      VALUES (?, ?, ?, ?, 'pending', 3)
    `;
    db.query(sql, [name, email, hashedPassword, specialization_id], async (err, result) => {
      if (err) return res.status(500).json({ msg: "Lỗi khi thêm tài khoản bác sĩ!" });

      try {
        await sendMail({
          to: email,
          subject: "Tài khoản bác sĩ được tạo",
          html: `
            <p>Xin chào ${name},</p>
            <p>Tài khoản bác sĩ của bạn đã được tạo thành công.</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Mật khẩu:</strong> ${password}</p>
            <p>Trạng thái: <b>Chờ phê duyệt</b>. Bạn sẽ được thông báo khi tài khoản được kích hoạt.</p>
          `,
        });

        res.status(201).json({ msg: "Tài khoản bác sĩ được tạo và mật khẩu đã gửi qua email (trạng thái pending)!" });
      } catch (err) {
        console.error("❌ Lỗi gửi mail:", err);
        res.status(500).json({ msg: "Tạo tài khoản thành công nhưng lỗi khi gửi email!" });
      }
    });
  });
};


// =========== ĐĂNG NHẬP BÁC SĨ =========== 
exports.doctorLogin = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ msg: "Thiếu email hoặc mật khẩu!" });
  }

  db.query("SELECT * FROM doctors WHERE email = ?", [email], async (err, result) => {
    if (err) return res.status(500).json({ msg: "Lỗi server!" });
    if (result.length === 0) return res.status(400).json({ msg: "Tài khoản không tồn tại!" });

    const doctor = result[0];

    if (doctor.role_id !== 3) {
      return res.status(403).json({ msg: "Bạn không có quyền đăng nhập với vai trò bác sĩ!" });
    }

    const match = await bcrypt.compare(password, doctor.password);
    if (!match) return res.status(400).json({ msg: "Mật khẩu không đúng!" });

    const token = jwt.sign({ id: doctor.id, email }, secret, { expiresIn: "7d" });

    // ✅ Luôn trả về token, để frontend xử lý điều hướng theo trạng thái
    res.json({
      msg: "Đăng nhập thành công!",
      token,
      doctor: {
        id: doctor.id,
        name: doctor.name,
        email: doctor.email,
        specialization_id: doctor.specialization_id,
        account_status: doctor.account_status,  // pending, active, locked...
        role_id: doctor.role_id
      },
    });
  });
};

