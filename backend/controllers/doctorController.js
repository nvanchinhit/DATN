const db = require("../config/db.config");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendMail = require("../utils/mailer");

const path = require('path');
const fs = require('fs');

const secret = process.env.JWT_SECRET || "your_default_secret";

// Tạo mật khẩu ngẫu nhiên
function generatePassword(length = 10) {
  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  return Array.from({ length }, () =>
    chars.charAt(Math.floor(Math.random() * chars.length))
  ).join("");
}


exports.createDoctorAccount = async (req, res) => {
  const { name, email, specialization_id } = req.body;
  if (!name || !email || !specialization_id)
    return res.status(400).json({ msg: "Vui lòng điền đầy đủ thông tin!" });

  try {
    const [existing] = await db.promise().query(
      "SELECT * FROM doctors WHERE email = ?",
      [email]
    );

    if (existing.length > 0)
      return res.status(400).json({ msg: "Email này đã tồn tại!" });

    const password = generatePassword(); // hoặc: const password = "Test123@";
    const hashedPassword = await bcrypt.hash(password, 10);
    const insertSQL = `
      INSERT INTO doctors (name, email, password, specialization_id, account_status, role_id)
      VALUES (?, ?, ?, ?, 'inactive', 3)
    `;

    await db
      .promise()
      .query(insertSQL, [name, email, hashedPassword, specialization_id]);

    await sendMail({
      to: email,
      subject: "Tài khoản bác sĩ được tạo",
      html: `
        <p>Xin chào <strong>${name}</strong>,</p>
        <p>Tài khoản bác sĩ của bạn đã được tạo.</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Mật khẩu:</strong> ${password}</p>
        <p>Vui lòng đăng nhập và hoàn thiện hồ sơ để được duyệt.</p>
      `,
    });

    return res
      .status(201)
      .json({ msg: "Tạo tài khoản thành công, mật khẩu đã gửi qua email!" });
  } catch (err) {
    console.error("❌ Lỗi khi tạo tài khoản:", err);
    return res.status(500).json({ msg: "Lỗi khi tạo tài khoản!" });
  }
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

// ✅ Lấy thông tin bác sĩ theo ID (CÓ HỖ TRỢ NHIỀU ẢNH chứng chỉ & bằng cấp)
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

    const doctor = rows[0];

    // ✅ Chuyển TEXT => MẢNG cho ảnh chứng chỉ & bằng cấp
    const Certificates = doctor.certificate_image
  ? doctor.certificate_image.split('|').map((filename, index) => ({
      id: index + 1,
      filename,
      source:
        doctor.certificate_source?.split('|')[index] || '', // lấy đúng nơi cấp tương ứng
    }))
  : [];


    const Degrees = doctor.degree_image
  ? doctor.degree_image.split('|').map((filename, index) => ({
      id: index + 1,
      filename,
      gpa: doctor.gpa ?? '',
      university: doctor.university ?? '',
      graduation_date: doctor.graduation_date ?? '',
      degree_type: doctor.degree_type ?? '',
    }))
  : [];


    // ✅ Gửi phản hồi về client
    res.json({
      ...doctor,
      Certificates,
      Degrees,
    });
  });
};


// Cập nhật hồ sơ bác sĩ
exports.updateDoctor = (req, res) => {
  const doctorId = req.params.id;
  const { phone, introduction, experience, gpa, university, graduation_date, degree_type } = req.body;

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

  // ✅ Thêm các trường học vấn nếu có
  if (gpa !== undefined) { fields.push("gpa = ?"); values.push(gpa); }
  if (university !== undefined) { fields.push("university = ?"); values.push(university); }
  if (graduation_date !== undefined) { fields.push("graduation_date = ?"); values.push(graduation_date); }
  if (degree_type !== undefined) { fields.push("degree_type = ?"); values.push(degree_type); }

  // <<< Giữ nguyên logic cập nhật trạng thái >>>
  if (fields.length > 0) {
    fields.push("account_status = ?");
    values.push("pending");
  } else {
    return res.status(400).json({ msg: "Không có thông tin nào để cập nhật!" });
  }

  values.push(doctorId);
  const sql = `UPDATE doctors SET ${fields.join(", ")} WHERE id = ?`;

  db.query(sql, values, (err) => {
    if (err) {
      console.error("❌ Lỗi khi cập nhật:", err);
      return res.status(500).json({ msg: "Lỗi khi cập nhật bác sĩ!" });
    }

    db.query("SELECT * FROM doctors WHERE id = ?", [doctorId], (err2, rows) => {
      if (err2 || rows.length === 0) {
        return res.status(500).json({ msg: "Không thể lấy dữ liệu sau khi cập nhật!" });
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
    ? doc.certificate_image.split('|').map(img => `/uploads/${img}`).join('|')
    : null,
  degree_image: doc.degree_image
    ? doc.degree_image.split('|').map(img => `/uploads/${img}`).join('|')
    : null,
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
    d.degree_image,
    d.gpa,
    d.university,
    d.graduation_date,
    d.degree_type,
    d.certificate_image,
    d.certificate_source,
    s.name AS specialty_name,
    AVG(r.rating) AS average_rating,
    COUNT(r.id) AS review_count
  FROM
    doctors d
  LEFT JOIN
    specializations s ON d.specialization_id = s.id
  LEFT JOIN
    ratings r ON d.id = r.product_id
  WHERE
    d.account_status = 'active'
  GROUP BY
    d.id, d.name, d.img, d.introduction,
    d.degree_image, d.gpa, d.university, d.graduation_date, d.degree_type,
    d.certificate_image, d.certificate_source,
    s.name
  HAVING
    COUNT(r.id) > 0
  ORDER BY
    average_rating DESC,
    review_count DESC
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
  average_rating: parseFloat(doc.average_rating).toFixed(1),
  review_count: doc.review_count,

  // Thông tin bằng cấp
  degrees: doc.degree_image
    ? doc.degree_image.split('|').map((img) => ({
        filename: `/uploads/${img}`,
        gpa: doc.gpa || '',
        university: doc.university || '',
        graduation_date: doc.graduation_date || '',
        degree_type: doc.degree_type || '',
      }))
    : [],

  // Chứng chỉ hành nghề + nơi cấp
  certificate_images: doc.certificate_image
    ? doc.certificate_image.split('|').map((img, i) => ({
        filename: `/uploads/${img}`,
        source: doc.certificate_source?.split('|')[i] || '',
      }))
    : [],
}));


    res.json(topDoctors);
  });
};



exports.updateDoctorProfile = async (req, res) => {
  const doctorId = req.params.id;
  console.log("📦 req.body:", req.body);
  console.log("📁 req.files:", req.files);

  const { introduction, experience } = req.body;
  const degreesToDelete = JSON.parse(req.body.degreesToDelete || '[]');
  const certificatesToDelete = JSON.parse(req.body.certificatesToDelete || '[]');

  const newDegreeFiles = req.files?.degree_images || [];
  const newCertificateFiles = req.files?.certificate_images || [];

  // Đọc thông tin degrees[i][...] từ req.body
  let degrees = [];

if (typeof req.body.degrees === 'string') {
  degrees = JSON.parse(req.body.degrees);
} else if (Array.isArray(req.body.degrees)) {
  degrees = req.body.degrees;
}



  // Lấy các nơi cấp chứng chỉ (được gửi theo từng ảnh)
  const certificateSources = Array.isArray(req.body.certificate_source)
    ? req.body.certificate_source
    : req.body.certificate_source
    ? [req.body.certificate_source]
    : [];

  try {
    const [rows] = await db.promise().query(
      `SELECT certificate_image, certificate_source, degree_image, gpa, university, graduation_date, degree_type 
       FROM doctors WHERE id = ?`,
      [doctorId]
    );
    const doctor = rows[0];

    // --- XỬ LÝ BẰNG CẤP ---
    let degreeArr = doctor.degree_image ? doctor.degree_image.split('|') : [];
    let degreeInfo = {
      gpa: doctor.gpa || '',
      university: doctor.university || '',
      graduation_date: doctor.graduation_date || '',
      degree_type: doctor.degree_type || '',
    };

    degreesToDelete.forEach((index) => {
      if (degreeArr[index - 1]) degreeArr[index - 1] = null;
    });
    degreeArr = degreeArr.filter(Boolean);

    // Nếu có file thì push filename và info kèm theo
newDegreeFiles.forEach((file, idx) => {
  degreeArr.push(file.filename);
});

// Nếu form có gửi thông tin degrees[0], thì cập nhật vào DB
if (degrees[0]) {
  degreeInfo = {
    gpa: degrees[0].gpa || '',
    university: degrees[0].university || '',
    graduation_date: degrees[0].graduation_date || '',
    degree_type: degrees[0].degree_type || '',
  };
}

// Nếu không còn bằng cấp nào thì xóa hết thông tin học vấn
if (degreeArr.length === 0) {
  degreeInfo = {
    gpa: null,
    university: null,
    graduation_date: null,
    degree_type: null,
  };
}


    // --- XỬ LÝ CHỨNG CHỈ ---
    let certArr = doctor.certificate_image ? doctor.certificate_image.split('|') : [];
    let sourceArr = doctor.certificate_source ? doctor.certificate_source.split('|') : [];

    certificatesToDelete.forEach((index) => {
      if (certArr[index - 1]) certArr[index - 1] = null;
      if (sourceArr[index - 1]) sourceArr[index - 1] = null;
    });
    certArr = certArr.filter(Boolean);
    sourceArr = sourceArr.filter(Boolean);

    newCertificateFiles.forEach((file, idx) => {
      certArr.push(file.filename);
      sourceArr.push(certificateSources[idx] || '');
    });

    // --- CẬP NHẬT DATABASE ---
    const updateFields = {
      introduction,
      experience,
      degree_image: degreeArr.join('|'),
      certificate_image: certArr.join('|'),
      certificate_source: sourceArr.join('|'),
      ...degreeInfo,
      account_status:
        newDegreeFiles.length > 0 ||
        newCertificateFiles.length > 0 ||
        degreesToDelete.length > 0 ||
        certificatesToDelete.length > 0
          ? 'pending'
          : undefined,
    };

    // Xóa field không cần update
    Object.keys(updateFields).forEach((key) => {
      if (updateFields[key] === undefined) delete updateFields[key];
    });

    console.log("🛠 UPDATE FIELDS:", updateFields);

    await db
      .promise()
      .query(`UPDATE doctors SET ? WHERE id = ?`, [updateFields, doctorId]);

    res.json({ msg: "Cập nhật hồ sơ thành công!" });
  } catch (err) {
    console.error("❌ Lỗi cập nhật hồ sơ:", err);
    res.status(500).json({ msg: "Lỗi máy chủ khi cập nhật hồ sơ." });
  }
};



exports.getAllDoctorsForAdmin = (req, res) => {

    const sql = `
        SELECT 
          d.id, 
          d.name, 
          d.account_status,
          s.name AS specialty_name 
        FROM doctors d
        LEFT JOIN specializations s ON d.specialization_id = s.id
        ORDER BY d.name
    `;
    db.query(sql, (err, results) => {
        if (err) {
            console.error("Lỗi khi lấy danh sách bác sĩ cho admin:", err);
            return res.status(500).json({ error: 'Lỗi server.' });
        }
        res.json(results);
    });
};
