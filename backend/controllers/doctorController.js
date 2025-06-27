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

    res.json({
      msg: "Đăng nhập thành công!",
      token,
      doctor: {
        id: doctor.id,
        name: doctor.name,
        email: doctor.email,
        specialization_id: doctor.specialization_id,
        account_status: doctor.account_status,
        role_id: doctor.role_id,
      },
    });
  });
};

// =========== LẤY THÔNG TIN BÁC SĨ ===========
exports.getDoctorById = (req, res) => {
  const doctorId = req.params.id;

  const sql = `
    SELECT id, name, email, phone, img, introduction, specialization_id, account_status 
    FROM doctors 
    WHERE id = ?
  `;
  db.query(sql, [doctorId], (err, result) => {
    if (err) return res.status(500).json({ msg: "Lỗi truy vấn!" });
    if (result.length === 0) return res.status(404).json({ msg: "Không tìm thấy bác sĩ!" });

    res.json(result[0]);
  });
};

// =========== CẬP NHẬT THÔNG TIN BÁC SĨ (KÈM ẢNH, CHỨNG CHỈ, BẰNG CẤP) ===========
exports.updateDoctor = (req, res) => {
  const doctorId = req.params.id;
  const {
    name,
    email,
    phone,
    introduction,
    specialization_id,
    education,
    experience,
  } = req.body;

  // Lấy các file nếu có
  const img = req.files?.img?.[0]?.filename || null;
  const certificate = req.files?.certificate?.[0]?.filename || null;
  const degree = req.files?.degree?.[0]?.filename || null;

  const fields = [];
  const values = [];

  // Cập nhật các trường thông tin nếu có
  if (name) { fields.push("name = ?"); values.push(name); }
  if (email) { fields.push("email = ?"); values.push(email); }
  if (phone) { fields.push("phone = ?"); values.push(phone); }
  if (introduction !== undefined) { fields.push("introduction = ?"); values.push(introduction); }
  if (specialization_id) { fields.push("specialization_id = ?"); values.push(specialization_id); }
  if (education !== undefined) { fields.push("education = ?"); values.push(education); }
  if (experience !== undefined) { fields.push("experience = ?"); values.push(experience); }

  if (img) { fields.push("img = ?"); values.push(img); }
  if (certificate) { fields.push("certificate_image = ?"); values.push(certificate); }
  if (degree) { fields.push("degree_image = ?"); values.push(degree); }

  // 🔍 Chỉ khi cập nhật bằng cấp hoặc chứng chỉ thì mới chuyển về trạng thái pending
if (certificate || degree) {
  fields.push("account_status = ?");
  values.push("pending");
}


  values.push(doctorId);

  const sql = `UPDATE doctors SET ${fields.join(', ')} WHERE id = ?`;

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("❌ Lỗi khi cập nhật hồ sơ bác sĩ:", err);
      return res.status(500).json({ msg: "Lỗi khi cập nhật bác sĩ!" });
    }

    // Trả về bản ghi đã cập nhật
    db.query("SELECT * FROM doctors WHERE id = ?", [doctorId], (err2, data) => {
      if (err2 || data.length === 0) {
        return res.status(500).json({ msg: "Cập nhật xong nhưng không lấy được dữ liệu!" });
      }
      res.json(data[0]);
    });
  });
};
exports.updateDoctorProfile = (req, res) => {
  const doctorId = req.params.id;
  const {
    name,
    email,
    phone,
    specialization_id,
    introduction,
    education,
    experience,
  } = req.body;

  // Lấy ảnh nếu có
  const img = req.files?.img?.[0]?.filename || null;
  const certificate_image = req.files?.certificate_image?.[0]?.filename || null;
  const degree_image = req.files?.degree_image?.[0]?.filename || null;

  // Xây dựng câu lệnh SQL động
  let sql = `
    UPDATE doctors SET 
      name = ?, email = ?, phone = ?, 
      specialization_id = ?, introduction = ?, 
      education = ?, experience = ?, 
      account_status = 'pending'
      ${img ? ', img = ?' : ''}
      ${certificate_image ? ', certificate_image = ?' : ''}
      ${degree_image ? ', degree_image = ?' : ''}
    WHERE id = ?
  `;

  const values = [
    name,
    email,
    phone,
    specialization_id,
    introduction,
    education,
    experience,
    ...(img ? [img] : []),
    ...(certificate_image ? [certificate_image] : []),
    ...(degree_image ? [degree_image] : []),
    doctorId,
  ];

  // Thực thi
  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("❌ Lỗi cập nhật:", err);
      return res.status(500).json({ msg: "Lỗi cập nhật hồ sơ bác sĩ!" });
    }

    // Trả về dữ liệu sau khi cập nhật
    db.query("SELECT * FROM doctors WHERE id = ?", [doctorId], (err2, rows) => {
      if (err2 || rows.length === 0) {
        return res.status(500).json({ msg: "Không lấy được thông tin sau khi cập nhật!" });
      }
      res.json(rows[0]);
    });
  });
};
