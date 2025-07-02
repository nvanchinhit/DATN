const db = require('../config/db.config');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendMail = require("../utils/mailer"); // Gửi mail xác thực

const secret = process.env.JWT_SECRET || "your_default_secret";

// ===================== ĐĂNG KÝ =====================
exports.register = async (req, res) => {
  const { name, email, password, phone } = req.body;

  if (!name || !email || !password || !phone) {
    return res.status(400).json({ msg: "Vui lòng nhập đầy đủ thông tin bắt buộc!" });
  }

  db.query("SELECT * FROM customers WHERE email = ?", [email], async (err, result) => {
    if (err) return res.status(500).json({ msg: "Lỗi server khi kiểm tra email!" });

    if (result.length > 0) {
      return res.status(400).json({ msg: "Email đã được đăng ký!" });
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      db.query(
        "INSERT INTO customers (name, email, password, phone, role_id) VALUES (?, ?, ?, ?, ?)",
        [name, email, hashedPassword, phone, 2],
        async (err, result) => {
          if (err) return res.status(500).json({ msg: "Lỗi khi lưu thông tin người dùng!" });

          const userId = result.insertId;

          // Gửi email xác thực
          const verifyToken = jwt.sign({ id: userId }, secret, { expiresIn: "1d" });
          const verifyUrl = `http://localhost:3000/verify-email?token=${verifyToken}`;

try {
  await sendMail({
    to: email,
    subject: "Xác thực tài khoản",
    html: `
      <div style="font-family: Arial, sans-serif; background-color: #f9fafb; padding: 20px; color: #111;">
        <h2 style="color: #1d4ed8;">Chào mừng, ${name}!</h2>
        <p>Cảm ơn bạn đã đăng ký. Vui lòng xác thực tài khoản của bạn bằng cách nhấn vào nút dưới đây:</p>
        
        <div style="margin: 24px 0;">
          <a href="${verifyUrl}" 
             style="background-color: #10b981; color: white; padding: 12px 24px; border-radius: 8px; 
                    text-decoration: none; display: inline-block; font-weight: bold;">
            Xác thực tài khoản
          </a>
        </div>

        <p>Nếu bạn không thực hiện hành động này, vui lòng bỏ qua email này.</p>
        <p style="color: #6b7280; font-size: 14px;">Liên kết sẽ hết hạn sau 24 giờ.</p>
      </div>
    `
  });
} catch (err) {
  console.error("❌ Gửi email xác thực thất bại:", err);
  res.status(500).json({ msg: "Lỗi khi gửi email xác thực!" });
}


          const token = jwt.sign({ id: userId, email }, secret, { expiresIn: "7d" });

          res.status(201).json({
            msg: "Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản.",
            token,
            user: { id: userId, name, email, phone },
          });
        }
      );
    } catch (hashErr) {
      return res.status(500).json({ msg: "Lỗi khi xử lý mật khẩu!" });
    }
  });
};

// ===================== XÁC THỰC EMAIL =====================
exports.verifyEmail = (req, res) => {
  const { token } = req.query;

  if (!token) return res.status(400).json({ msg: "Thiếu token xác thực!" });

  try {
    const decoded = jwt.verify(token, secret);
    const userId = decoded.id;

    db.query("UPDATE customers SET is_verified = true WHERE id = ?", [userId], (err, result) => {
      if (err) {
        console.error("❌ Lỗi cập nhật xác thực:", err);
        return res.status(500).json({ msg: "Lỗi server khi xác thực tài khoản!" });
      }

      if (result.affectedRows === 0) {
        return res.status(400).json({ msg: "Tài khoản không tồn tại!" });
      }

      res.json({ msg: "Tài khoản đã được xác thực thành công!" });
    });
  } catch (err) {
    return res.status(400).json({ msg: "Token không hợp lệ hoặc đã hết hạn!" });
  }
};

// ===================== ĐĂNG NHẬP =====================
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

    if (!user.is_verified) {
      return res.status(403).json({ msg: "Vui lòng xác thực email trước khi đăng nhập!" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Mật khẩu không chính xác!" });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, secret, { expiresIn: "7d" });

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
exports.forgotPassword = (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ msg: "Vui lòng nhập email!" });

  db.query("SELECT * FROM customers WHERE email = ?", [email], (err, result) => {
    if (err) return res.status(500).json({ msg: "Lỗi server!" });
    if (result.length === 0) {
      return res.status(400).json({ msg: "Email không tồn tại trong hệ thống!" });
    }

    const user = result[0];
    const resetToken = jwt.sign({ id: user.id }, secret, { expiresIn: "15m" });
    const resetUrl = `http://localhost:3000/reset-password?token=${resetToken}`;

    sendMail({
      to: email,
      subject: "Đặt lại mật khẩu",
      html: `<p>Xin chào ${user.name},</p>
             <p>Bạn đã yêu cầu đặt lại mật khẩu. Nhấn vào liên kết sau để thực hiện:</p>
             <a href="${resetUrl}">${resetUrl}</a>
             <p>Liên kết có hiệu lực trong 15 phút.</p>`
    })
      .then(() => {
        res.json({ msg: "Đã gửi email đặt lại mật khẩu. Vui lòng kiểm tra hộp thư!" });
      })
      .catch((err) => {
        console.error("❌ Gửi mail thất bại:", err);
        res.status(500).json({ msg: "Lỗi khi gửi email!" });
      });
  });
};

exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res.status(400).json({ msg: "Thiếu token hoặc mật khẩu mới!" });
  }

  try {
    const decoded = jwt.verify(token, secret);
    const hashed = await bcrypt.hash(newPassword, 10);

    db.query("UPDATE customers SET password = ? WHERE id = ?", [hashed, decoded.id], (err) => {
      if (err) {
        console.error("❌ Lỗi cập nhật mật khẩu:", err);
        return res.status(500).json({ msg: "Không thể cập nhật mật khẩu!" });
      }

      res.json({ msg: "Đặt lại mật khẩu thành công!" });
    });
  } catch (err) {
    return res.status(400).json({ msg: "Token không hợp lệ hoặc đã hết hạn!" });
  }
};
exports.resendVerification = (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ msg: "Vui lòng nhập email!" });

  db.query("SELECT * FROM customers WHERE email = ?", [email], (err, result) => {
    if (err) return res.status(500).json({ msg: "Lỗi server!" });
    if (result.length === 0) return res.status(400).json({ msg: "Email không tồn tại!" });

    const user = result[0];

    if (user.is_verified) {
      return res.status(400).json({ msg: "Tài khoản đã được xác thực rồi!" });
    }

    const verifyToken = jwt.sign({ id: user.id }, secret, { expiresIn: "1d" });
    const verifyUrl = `http://localhost:3000/verify-email?token=${verifyToken}`;

    sendMail({
      to: user.email,
      subject: "Xác thực tài khoản lại",
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #f9fafb; padding: 20px; color: #111;">
          <h2 style="color: #1d4ed8;">Xin chào, ${user.name}!</h2>
          <p>Bạn đã yêu cầu gửi lại email xác thực. Vui lòng nhấn vào nút dưới đây:</p>
          <div style="margin: 24px 0;">
            <a href="${verifyUrl}" 
              style="background-color: #10b981; color: white; padding: 12px 24px; border-radius: 8px; 
              text-decoration: none; display: inline-block; font-weight: bold;">
              Xác thực tài khoản
            </a>
          </div>
          <p style="color: #6b7280; font-size: 14px;">Liên kết có hiệu lực trong 24 giờ.</p>
        </div>
      `
    })
      .then(() => {
        res.json({ msg: "Đã gửi lại email xác thực!" });
      })
      .catch((err) => {
        console.error("❌ Gửi lại email thất bại:", err);
        res.status(500).json({ msg: "Lỗi khi gửi lại email xác thực!" });
      });
  });
};
// ===================== GỬI ĐƠN THUỐC QUA EMAIL (KHÔNG LƯU DB) =====================
exports.sendPrescription = async (req, res) => {
  // Nhận ID hồ sơ và nội dung đơn thuốc từ frontend
  const { medical_record_id, prescription_text } = req.body;

  if (!medical_record_id || !prescription_text) {
    return res.status(400).json({ msg: "Thiếu ID hồ sơ hoặc nội dung đơn thuốc!" });
  }

  // Lấy thông tin cần thiết để gửi email (tên bệnh nhân, email, tên bác sĩ)
  const query = `
    SELECT 
      c.name AS patient_name,
      c.email AS patient_email,
      d.name AS doctor_name,
      mr.diagnosis  -- Lấy cả chẩn đoán để đưa vào email
    FROM medical_records mr
    JOIN customers c ON mr.customer_id = c.id
    JOIN doctors d ON mr.doctor_id = d.id
    WHERE mr.id = ?
  `;

  db.query(query, [medical_record_id], async (err, result) => {
    if (err) {
      console.error("❌ Lỗi truy vấn khi lấy thông tin để gửi mail:", err);
      return res.status(500).json({ msg: "Lỗi server khi truy vấn dữ liệu." });
    }

    if (result.length === 0) {
      return res.status(404).json({ msg: "Không tìm thấy hồ sơ bệnh án tương ứng." });
    }

    const record = result[0];
    const { patient_name, patient_email, doctor_name, diagnosis } = record;

    // Tạo nội dung email từ thông tin lấy được và `prescription_text` từ frontend
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px;">
        <h2 style="color: #0056b3; text-align: center;">Thông Tin Đơn Thuốc</h2>
        <p>Xin chào <strong>${patient_name}</strong>,</p>
        <p>Bác sĩ <strong>${doctor_name}</strong> đã gửi cho bạn thông tin đơn thuốc. Vui lòng xem nội dung dưới đây:</p>
        
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; margin-top: 20px;">
          <h3 style="color: #0056b3; border-bottom: 2px solid #eee; padding-bottom: 10px;">Chi tiết</h3>
          <p><strong>Chẩn đoán:</strong></p>
          <p style="white-space: pre-wrap;">${diagnosis}</p>
          
          <p><strong>Đơn thuốc:</strong></p>
          <p style="white-space: pre-wrap; font-weight: bold;">${prescription_text}</p>
        </div>

        <p style="margin-top: 25px; font-size: 14px; color: #555;">
          <strong>Lưu ý:</strong> Đây là thông tin tham khảo. Vui lòng tuân thủ chính xác theo chỉ dẫn của bác sĩ.
        </p>
      </div>
    `;

    try {
      await sendMail({
        to: patient_email,
        subject: `[Thông báo] Đơn thuốc từ Bác sĩ ${doctor_name}`,
        html: emailHtml
      });
      res.status(200).json({ msg: `Đã gửi đơn thuốc thành công đến email ${patient_email}` });
    } catch (mailErr) {
      console.error("❌ Lỗi khi gửi email đơn thuốc:", mailErr);
      res.status(500).json({ msg: "Gặp lỗi trong quá trình gửi email." });
    }
  });
};