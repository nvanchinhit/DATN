const db = require("../config/db.config");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendMail = require("../utils/mailer");

const secret = process.env.JWT_SECRET || "your_default_secret";

// Tạo mật khẩu ngẫu nhiên
function generatePassword(length = 10) {
  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  return Array.from({ length }, () =>
    chars.charAt(Math.floor(Math.random() * chars.length))
  ).join("");
}

// Admin tạo tài khoản bác sĩ
exports.createDoctorAccount = async (req, res) => {
  const { name, email, specialization_id } = req.body;
  if (!name || !email || !specialization_id)
    return res
      .status(400)
      .json({ msg: "Vui lòng điền đầy đủ tên, email và chuyên khoa!" });

  db.query(
    "SELECT * FROM doctors WHERE email = ?",
    [email],
    async (err, rows) => {
      if (err)
        return res.status(500).json({ msg: "Lỗi khi kiểm tra email!" });
      if (rows.length > 0)
        return res.status(400).json({ msg: "Email này đã tồn tại!" });

      const password = generatePassword();
      const hashedPassword = await bcrypt.hash(password, 10);

      // <<< THAY ĐỔI QUAN TRỌNG #1 >>>
      // Trạng thái ban đầu khi mới tạo tài khoản là 'inactive' (chưa hoạt động),
      // không phải 'pending' (chờ duyệt).
      const insertSQL = `
      INSERT INTO doctors (name, email, password, specialization_id, account_status, role_id)
      VALUES (?, ?, ?, ?, 'inactive', 3)
    `;

      db.query(
        insertSQL,
        [name, email, hashedPassword, specialization_id],
        async (err2) => {
          if (err2) return res.status(500).json({ msg: "Lỗi khi thêm bác sĩ!" });

          try {
            await sendMail({
              to: email,
              subject: "Tài khoản bác sĩ được tạo",
              html: `
            <p>Xin chào <strong>${name}</strong>,</p>
            <p>Tài khoản bác sĩ của bạn đã được tạo.</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Mật khẩu:</strong> ${password}</p>
            <p>Vui lòng đăng nhập và hoàn thiện hồ sơ để được duyệt sử dụng hệ thống.</p>
          `,
            });
            res.status(201).json({
              msg: "Tạo tài khoản thành công, mật khẩu đã gửi qua email!",
            });
          } catch (e) {
            console.error("❌ Lỗi gửi email:", e);
            res
              .status(500)
              .json({ msg: "Tạo thành công nhưng lỗi khi gửi email!" });
          }
        }
      );
    }
  );
};

// Đăng nhập bác sĩ (Giữ nguyên, không cần sửa)
exports.doctorLogin = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ msg: "Thiếu email hoặc mật khẩu!" });

  db.query("SELECT * FROM doctors WHERE email = ?", [email], async (err, rows) => {
    if (err) return res.status(500).json({ msg: "Lỗi server!" });
    if (rows.length === 0)
      return res.status(400).json({ msg: "Tài khoản không tồn tại!" });

    const doctor = rows[0];
    if (doctor.role_id !== 3)
      return res.status(403).json({ msg: "Không đúng quyền bác sĩ!" });

    const match = await bcrypt.compare(password, doctor.password);
    if (!match) return res.status(400).json({ msg: "Mật khẩu không đúng!" });

    const token = jwt.sign({ id: doctor.id, email }, secret, {
      expiresIn: "7d",
    });

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

// Duyệt bác sĩ (Giữ nguyên, không cần sửa)
exports.approveDoctor = (req, res) => {
  const doctorId = req.params.id;
  const sql = "UPDATE doctors SET account_status = 'active' WHERE id = ?";

  db.query(sql, [doctorId], (err, result) => {
    if (err) {
      console.error("Lỗi khi cập nhật trạng thái bác sĩ:", err);
      return res.status(500).json({ msg: "Lỗi máy chủ khi duyệt bác sĩ." });
    }
    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ msg: `Không tìm thấy bác sĩ với ID ${doctorId}.` });
    }
    res
      .status(200)
      .json({ msg: `Bác sĩ ID ${doctorId} đã được duyệt thành công.` });
  });
};

// Lấy thông tin bác sĩ theo ID (Giữ nguyên, không cần sửa)
exports.getDoctorById = (req, res) => {
  const doctorId = req.params.id;
  const sql = `
    SELECT d.*, s.name AS specialization_name
    FROM doctors d
    LEFT JOIN specializations s ON d.specialization_id = s.id
    WHERE d.id = ?
  `;
  db.query(sql, [doctorId], (err, rows) => {
    if (err) return res.status(500).json({ msg: "Lỗi truy vấn!" });
    if (rows.length === 0)
      return res.status(404).json({ msg: "Không tìm thấy bác sĩ!" });

    res.json(rows[0]);
  });
};

// Cập nhật hồ sơ bác sĩ
exports.updateDoctor = (req, res) => {
  const doctorId = req.params.id;
  const { phone, introduction, experience } = req.body;

  const img = req.files?.img?.[0]?.filename || null;
  const certificate = req.files?.certificate_image?.[0]?.filename || null;
  const degree = req.files?.degree_image?.[0]?.filename || null;

  const fields = [];
  const values = [];

  if (phone) { fields.push("phone = ?"); values.push(phone); }
  if (introduction !== undefined) { fields.push("introduction = ?"); values.push(introduction); }
  if (experience !== undefined) { fields.push("experience = ?"); values.push(experience); }
  if (img) { fields.push("img = ?"); values.push(img); }
  if (certificate) { fields.push("certificate_image = ?"); values.push(certificate); }
  if (degree) { fields.push("degree_image = ?"); values.push(degree); }

  // <<< THAY ĐỔI QUAN TRỌNG #2 >>>
  // Khi bác sĩ nộp hồ sơ (tức là có cập nhật ít nhất một trường),
  // trạng thái sẽ chuyển thành 'pending' để admin duyệt.
  if (fields.length > 0) {
    fields.push("account_status = ?");
    values.push("pending");
  } else {
    // Nếu không có gì để cập nhật thì báo lỗi
    return res.status(400).json({ msg: "Không có thông tin nào để cập nhật!" });
  }

  values.push(doctorId);
  const sql = `UPDATE doctors SET ${fields.join(", ")} WHERE id = ?`;

  db.query(sql, values, (err) => {
    if (err) {
      console.error("❌ Lỗi khi cập nhật:", err);
      return res.status(500).json({ msg: "Lỗi khi cập nhật bác sĩ!" });
    }

    // Trả về thông tin mới nhất của bác sĩ sau khi cập nhật
    db.query("SELECT * FROM doctors WHERE id = ?", [doctorId], (err2, rows) => {
      if (err2 || rows.length === 0) {
        return res
          .status(500)
          .json({ msg: "Không thể lấy dữ liệu sau khi cập nhật!" });
      }
      res.json(rows[0]);
    });
  });
};

// Lấy tất cả bác sĩ (Giữ nguyên, không cần sửa)
exports.getAllDoctors = (req, res) => {
  const sql = `
    SELECT 
      d.id, d.name, d.phone, d.email, d.img, d.introduction, 
      d.certificate_image, d.degree_image, d.account_status,
      s.name AS specialty_name
    FROM doctors d
    LEFT JOIN specializations s ON d.specialization_id = s.id
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Lỗi truy vấn database:", err);
      return res.status(500).json({ msg: "Lỗi truy vấn dữ liệu bác sĩ!" });
    }

    const mappedDoctors = results.map((doc) => ({
      id: doc.id,
      name: doc.name,
      phone: doc.phone,
      email: doc.email,
      introduction: doc.introduction,
      account_status: doc.account_status,
      specialty_name: doc.specialty_name || "Chưa cập nhật",
      img: doc.img ? `/uploads/${doc.img}` : null,
      certificate_image: doc.certificate_image
        ? `/uploads/${doc.certificate_image}`
        : null,
      degree_image: doc.degree_image ? `/uploads/${doc.degree_image}` : null,
    }));

    res.json(mappedDoctors);
  });
};
exports.getTopDoctors = (req, res) => {
  // Cho phép client tùy chỉnh số lượng bác sĩ top, mặc định là 5
  const limit = parseInt(req.query.limit, 10) || 5;

  const sql = `
    SELECT
      d.id,
      d.name,
      d.img,
      d.introduction,
      s.name AS specialty_name,
      AVG(r.rating) AS average_rating,
      COUNT(r.id) AS review_count
    FROM
      doctors d
    LEFT JOIN
      specializations s ON d.specialization_id = s.id
    LEFT JOIN
      ratings r ON d.id = r.product_id -- THAY ĐỔI: Join với bảng 'ratings' qua cột 'product_id'
    WHERE
      d.account_status = 'active' -- Chỉ lấy các bác sĩ đang hoạt động
    GROUP BY
      d.id, d.name, d.img, d.introduction, s.name
    HAVING
      COUNT(r.id) > 0 -- Chỉ lấy những bác sĩ có ít nhất 1 đánh giá
    ORDER BY
      average_rating DESC, -- Ưu tiên xếp hạng trung bình cao nhất
      review_count DESC    -- Nếu bằng điểm, ai nhiều đánh giá hơn thì xếp trên
    LIMIT ?;
  `;

  db.query(sql, [limit], (err, results) => {
    if (err) {
      console.error("Lỗi truy vấn bác sĩ hàng đầu:", err);
      return res.status(500).json({ msg: "Lỗi máy chủ khi lấy dữ liệu." });
    }

    // Ánh xạ kết quả để có đường dẫn ảnh đầy đủ và định dạng dữ liệu
    const topDoctors = results.map((doc) => ({
      id: doc.id,
      name: doc.name,
      introduction: doc.introduction,
      specialty_name: doc.specialty_name || "Chưa cập nhật",
      img: doc.img ? `/uploads/${doc.img}` : null,
      // Làm tròn điểm trung bình đến 1 chữ số thập phân
      average_rating: parseFloat(doc.average_rating).toFixed(1),
      review_count: doc.review_count,
    }));

    res.json(topDoctors);
  });
};