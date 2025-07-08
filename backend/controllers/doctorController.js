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
exports.updateDoctor = async (req, res) => {
    const doctorId = req.params.id;

    // 1. Lấy dữ liệu từ request
    const {
        phone,
        introduction,
        experience,
        gpa,
        university,
        graduation_date,
        degree_type,
        certificate_authorities, // Frontend gửi mảng các "nơi cấp"
    } = req.body;

    // Lấy file từ middleware upload.fields
    const imgFile = req.files?.img?.[0];
    const degreeFile = req.files?.degree_image?.[0];
    const certificateFiles = req.files?.certificate_files || []; // Mảng file chứng chỉ

    try {
        const fieldsToUpdate = {};

        // 2. Thêm các trường text vào đối tượng update
        if (phone !== undefined) fieldsToUpdate.phone = phone;
        if (introduction !== undefined) fieldsToUpdate.introduction = introduction;
        if (experience !== undefined) fieldsToUpdate.experience = experience;
        if (gpa !== undefined) fieldsToUpdate.gpa = gpa;
        if (university !== undefined) fieldsToUpdate.university = university;
        if (graduation_date !== undefined) fieldsToUpdate.graduation_date = graduation_date;
        if (degree_type !== undefined) fieldsToUpdate.degree_type = degree_type;

        // 3. Thêm các file đơn lẻ nếu có
        if (imgFile) fieldsToUpdate.img = imgFile.filename;
        if (degreeFile) fieldsToUpdate.degree_image = degreeFile.filename;

        // 4. Xử lý NHIỀU file chứng chỉ
        if (certificateFiles.length > 0) {
            // Nối tên các file mới thành chuỗi, cách nhau bằng dấu phẩy (hoặc dấu | nếu muốn)
            const newImageNames = certificateFiles.map(file => file.filename).join(',');
            fieldsToUpdate.certificate_image = newImageNames;

            // Nối các "nơi cấp" tương ứng
            const authoritiesArray = [].concat(certificate_authorities || []);
            fieldsToUpdate.certificate_source = authoritiesArray.join(',');
        }

        // 5. Kiểm tra xem có gì để cập nhật không
        if (Object.keys(fieldsToUpdate).length === 0) {
            return res.status(400).json({ msg: "Không có thông tin nào để cập nhật!" });
        }

        // Bất kỳ cập nhật nào cũng cần admin duyệt lại
        fieldsToUpdate.account_status = 'pending';

        // 6. Thực thi câu lệnh UPDATE
        await db.promise().query("UPDATE doctors SET ? WHERE id = ?", [fieldsToUpdate, doctorId]);

        // 7. Trả về dữ liệu mới nhất
        const [updatedRows] = await db.promise().query("SELECT * FROM doctors WHERE id = ?", [doctorId]);
        res.json(updatedRows[0]);

    } catch (err) {
        console.error("❌ Lỗi khi cập nhật hồ sơ bác sĩ:", err);
        res.status(500).json({ msg: "Lỗi máy chủ khi cập nhật hồ sơ." });
    }
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

// FILE: controllers/doctorController.js
// THAY THẾ TOÀN BỘ HÀM NÀY

exports.updateDoctorProfile = async (req, res) => {
    const doctorId = req.params.id;

    // BẮT BUỘC PHẢI CÓ LOG NÀY ĐỂ XEM SERVER NHẬN GÌ
    console.log(`\n\n[INCOMING REQUEST] /api/doctors/${doctorId} at ${new Date().toISOString()}`);
    console.log("--- RAW BODY ---");
    console.log(req.body);
    console.log("--- RAW FILES ---");
    console.log(req.files);
    console.log("------------------\n");
    
    try {
        const {
            introduction, experience, phone, gpa, university, graduation_date, degree_type,
            certificate_authorities,
        } = req.body;

        // ✅ CÁCH LẤY DỮ LIỆU AN TOÀN NHẤT: Kiểm tra cả hai kiểu tên
        const existing_images_string = req.body.existing_certificate_images; // Tên mà frontend đang gửi
        const existing_sources_string = req.body.existing_certificate_sources;

        console.log(`[DEBUG] Chuỗi ảnh cũ nhận được từ req.body: `, existing_images_string);

        const newCertificateFiles = req.files?.certificate_files || [];
        const fieldsToUpdate = {};
        
        // Cập nhật các trường khác
        if (introduction !== undefined) fieldsToUpdate.introduction = introduction;
        // ... (các trường khác)
        if (req.files?.img?.[0]) fieldsToUpdate.img = req.files.img[0].filename;
        if (req.files?.degree_image?.[0]) fieldsToUpdate.degree_image = req.files.degree_image[0].filename;

        // LOGIC GỘP CHUỖI
        let oldImages = [];
        if (existing_images_string && typeof existing_images_string === 'string') {
            oldImages = existing_images_string.split(',').filter(Boolean);
        }
        const newImages = newCertificateFiles.map(file => file.filename);
        const finalImages = oldImages.concat(newImages);

        let oldSources = [];
        if (existing_sources_string && typeof existing_sources_string === 'string') {
            oldSources = existing_sources_string.split(',').filter(Boolean);
        }
        let newSources = certificate_authorities ? (Array.isArray(certificate_authorities) ? certificate_authorities : [certificate_authorities]) : [];
        const finalSources = oldSources.concat(newSources);
        
        fieldsToUpdate.certificate_image = finalImages.join(',');
        fieldsToUpdate.certificate_source = finalSources.join(',');
        fieldsToUpdate.account_status = 'pending';

        console.log("[FINAL CHECK] Dữ liệu chuẩn bị UPDATE vào DB:", fieldsToUpdate);
        
        if (Object.keys(fieldsToUpdate).length > 1) {
             const [result] = await db.promise().query("UPDATE doctors SET ? WHERE id = ?", [fieldsToUpdate, doctorId]);
             console.log("[DB SUCCESS] Query result:", result);
        }

        res.status(200).json({ msg: "Cập nhật hồ sơ thành công!" });

    } catch (err) {
        console.error("❌❌❌ [CONTROLLER ERROR] ❌❌❌", err);
        res.status(500).json({ msg: "Lỗi máy chủ khi cập nhật hồ sơ." });
    }
};
exports.getAllDoctorsForAdmin = (req, res) => {
    const API_BASE_URL = `${req.protocol}://${req.get('host')}`; // Tự động lấy base URL, ví dụ: http://localhost:5000

    const sql = `
        SELECT d.*, s.name AS specialty_name 
        FROM doctors d
        LEFT JOIN specializations s ON d.specialization_id = s.id
        ORDER BY d.id DESC
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error("Lỗi khi lấy danh sách bác sĩ cho admin:", err);
            return res.status(500).json({ error: 'Lỗi server.' });
        }

        const doctorsList = results.map(doctor => {
            const { password, ...doctorDetails } = doctor;
            
            // ✅ Tạo URL đầy đủ cho các trường ảnh ngay tại backend
            return {
                ...doctorDetails,
                img: doctor.img ? `${API_BASE_URL}/uploads/${doctor.img}` : null,
                degree_image: doctor.degree_image ? `${API_BASE_URL}/uploads/${doctor.degree_image}` : null,
                // Xử lý chuỗi ảnh chứng chỉ
                certificate_image: doctor.certificate_image
                    ? doctor.certificate_image
                        .split(',')
                        .map(imgName => `${API_BASE_URL}/uploads/${imgName}`)
                        .join(',')
                    : null
            };
        });

        res.json(doctorsList);
    });
};