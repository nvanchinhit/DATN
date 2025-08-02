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

    // =========================================================
    // SỬA LỖI Ở ĐÂY: Thêm `role_id` vào payload của token
    // =========================================================
    const payload = {
        id: doctor.id,
        email: doctor.email,
        role_id: doctor.role_id // Đảm bảo `role_id` được đưa vào token
    };

    const token = jwt.sign(payload, secret, {
      expiresIn: "7d",
    });

    // Trả về object doctor đầy đủ (nhưng không có mật khẩu)
    const doctorInfo = {
        id: doctor.id,
        name: doctor.name,
        email: doctor.email,
        specialization_id: doctor.specialization_id,
        account_status: doctor.account_status,
        role_id: doctor.role_id, // Trả về cả role_id cho frontend
        img: doctor.img
    };

    res.json({
      msg: "Đăng nhập thành công!",
      token,
      doctor: doctorInfo,
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

// ✅ Lấy thông tin bác sĩ theo ID (ĐÃ SỬA LỖI VÀ TĂNG TÍNH AN TOÀN)
exports.getDoctorById = (req, res) => {
  const doctorId = req.params.id;
  const sql = `
    SELECT 
      d.id, d.name, d.phone, d.email, d.img, d.introduction, d.experience,
      d.university, d.gpa, d.graduation_date, d.degree_type,
      d.certificate_image, d.certificate_source, d.degree_image,
      d.account_status, d.role_id, d.specialization_id,
      d.room_number, d.price,
      s.name AS specialization_name,
      s.price AS specialty_price
    FROM doctors d
    LEFT JOIN specializations s ON d.specialization_id = s.id
    WHERE d.id = ?
  `;

  db.query(sql, [doctorId], (err, rows) => {
    // Luôn kiểm tra lỗi truy vấn trước tiên
    if (err) {
      console.error(`[DB ERROR] Lỗi khi truy vấn bác sĩ ID ${doctorId}:`, err);
      return res.status(500).json({ msg: "Lỗi máy chủ khi truy vấn dữ liệu." });
    }

    if (rows.length === 0) {
      return res.status(404).json({ msg: "Không tìm thấy bác sĩ!" });
    }

    // ================== KHỐI TRY...CATCH BẢO VỆ ==================
    try {
      const doctor = rows[0];

      // Xử lý an toàn: Nếu certificate_image là null/undefined, kết quả sẽ là mảng rỗng.
      const Certificates = (doctor.certificate_image || '')
        .split('|')
        .filter(filename => filename) // Lọc ra các chuỗi rỗng nếu có (ví dụ: "img1.jpg||img2.jpg")
        .map((filename, index) => ({
          id: index + 1,
          filename,
          source: (doctor.certificate_source || '').split('|')[index] || '',
        }));

      // Xử lý an toàn cho bằng cấp
      const Degrees = (doctor.degree_image || '')
        .split('|')
        .filter(filename => filename)
        .map((filename, index) => ({
          id: index + 1,
          filename,
          gpa: doctor.gpa ?? '',
          university: doctor.university ?? '',
          graduation_date: doctor.graduation_date ?? '',
          degree_type: doctor.degree_type ?? '',
        }));

      // Gửi phản hồi về client
      res.json({
        ...doctor,
        specialty_price: doctor.specialty_price,
        Certificates,
        Degrees,
      });

    } catch (processError) {
      // Bắt bất kỳ lỗi nào xảy ra trong quá trình xử lý dữ liệu (ví dụ: .split on null)
      console.error(`[PROCESSING ERROR] Lỗi khi xử lý dữ liệu cho bác sĩ ID ${doctorId}:`, processError);
      return res.status(500).json({ msg: "Lỗi máy chủ khi xử lý thông tin bác sĩ." });
    }
    // =============================================================
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
    ratings r ON d.id = r.doctor_id -- ✅ sửa tại đây
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

    const topDoctors = results.map((doc) => ({
      id: doc.id,
      name: doc.name,
      introduction: doc.introduction,
      specialty_name: doc.specialty_name || "Chưa cập nhật",
      img: doc.img ? `/uploads/${doc.img}` : null,
      average_rating: parseFloat(doc.average_rating).toFixed(1),
      review_count: doc.review_count,

      degrees: doc.degree_image
        ? doc.degree_image.split('|').map((img) => ({
            filename: `/uploads/${img}`,
            gpa: doc.gpa || '',
            university: doc.university || '',
            graduation_date: doc.graduation_date || '',
            degree_type: doc.degree_type || '',
          }))
        : [],

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

    console.log(`\n[INCOMING REQUEST] /api/doctors/${doctorId}/profile at ${new Date().toISOString()}`);
    console.log("--- RAW BODY ---");
    console.log(req.body);
    console.log("--- RAW FILES ---");
    console.log(req.files);
    console.log("------------------\n");
    
    try {
        const {
            phone, introduction, experience, gpa, university, graduation_date, degree_type,
            certificate_authorities,
        } = req.body;

        const imgFile = req.files?.img?.[0];
        const degreeFile = req.files?.degree_image?.[0];
        const newCertificateFiles = req.files?.certificate_files || [];

        const fieldsToUpdate = {};

        // ✅ SỬA LỖI TẠI ĐÂY:
        // Tạo một đối tượng chứa các trường văn bản để dễ dàng lặp qua
        const textFields = {
            phone,
            introduction,
            experience,
            gpa,
            university,
            graduation_date,
            degree_type
        };

        // Lặp qua từng trường để xử lý
        for (const [key, value] of Object.entries(textFields)) {
            // Chỉ thêm vào object update nếu trường đó được gửi từ frontend
            if (value !== undefined) {
                // QUAN TRỌNG: Chuyển chuỗi rỗng thành NULL để tương thích với DB
                // Nếu giá trị là chuỗi rỗng, gán là null, ngược lại giữ nguyên giá trị.
                fieldsToUpdate[key] = (value === '') ? null : value;
            }
        }

        // Xử lý các file (logic này vẫn giữ nguyên)
        if (imgFile) fieldsToUpdate.img = imgFile.filename;
        if (degreeFile) fieldsToUpdate.degree_image = degreeFile.filename;

        // Xử lý logic cho các chứng chỉ
        if (newCertificateFiles.length > 0) {
            const newImageNames = newCertificateFiles.map(file => file.filename).join(',');
            fieldsToUpdate.certificate_image = newImageNames;
            const authoritiesArray = Array.isArray(certificate_authorities) ? certificate_authorities : (certificate_authorities ? [certificate_authorities] : []);
            fieldsToUpdate.certificate_source = authoritiesArray.join(',');
        }

        if (Object.keys(fieldsToUpdate).length === 0) {
            return res.status(400).json({ msg: "Không có thông tin mới nào để cập nhật." });
        }

        // Bất kỳ cập nhật nào cũng cần admin duyệt lại
        fieldsToUpdate.account_status = 'pending';

        console.log("[FINAL CHECK] Dữ liệu chuẩn bị UPDATE vào DB:", fieldsToUpdate);

        const [result] = await db.promise().query("UPDATE doctors SET ? WHERE id = ?", [fieldsToUpdate, doctorId]);
        
        console.log("[DB SUCCESS] Query result:", result);

        if (result.affectedRows > 0) {
            res.status(200).json({ msg: "Cập nhật hồ sơ thành công! Hồ sơ của bạn sẽ được xét duyệt lại." });
        } else {
            res.status(404).json({ msg: `Không tìm thấy bác sĩ với ID ${doctorId}.` });
        }

    } catch (err) {
        console.error("❌❌❌ [CONTROLLER ERROR] ❌❌❌", err);
        // Trả về lỗi cụ thể hơn cho client nếu có thể
        const errorMessage = err.sqlMessage || "Lỗi máy chủ khi cập nhật hồ sơ.";
        res.status(500).json({ msg: errorMessage });
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

// Đổi mật khẩu cho bác sĩ đã đăng nhập
exports.changePassword = (req, res) => {
  console.log('🔐 Doctor change password request received');
  console.log('User ID:', req.user.id);
  console.log('User role:', req.user.role_id);
  console.log('Request body:', req.body);
  
  const doctorId = req.user.id;
  const { current_password, new_password } = req.body;

  if (!current_password || !new_password) {
    console.log('❌ Missing password fields');
    return res.status(400).json({ success: false, message: 'Vui lòng cung cấp mật khẩu hiện tại và mật khẩu mới.' });
  }

  const sqlSelect = 'SELECT password FROM doctors WHERE id = ?';
  db.query(sqlSelect, [doctorId], (err, results) => {
    if (err) {
      console.error("❌ Lỗi khi lấy mật khẩu cũ:", err);
      return res.status(500).json({ success: false, message: 'Lỗi server khi lấy mật khẩu.' });
    }
    if (results.length === 0) {
      console.log('❌ Doctor not found with ID:', doctorId);
      return res.status(404).json({ success: false, message: 'Không tìm thấy bác sĩ.' });
    }

    const hashedPasswordInDb = results[0].password;

    bcrypt.compare(current_password, hashedPasswordInDb, (compareErr, isMatch) => {
      if (compareErr) {
        console.error("❌ Lỗi khi so sánh mật khẩu:", compareErr);
        return res.status(500).json({ success: false, message: 'Lỗi server khi xác thực.' });
      }
      if (!isMatch) {
        console.log('❌ Current password does not match');
        return res.status(400).json({ success: false, message: 'Mật khẩu hiện tại không chính xác.' });
      }

      bcrypt.hash(new_password, 10, (hashErr, newHashedPassword) => {
        if (hashErr) {
          console.error("❌ Lỗi khi mã hóa mật khẩu mới:", hashErr);
          return res.status(500).json({ success: false, message: 'Lỗi server khi bảo mật mật khẩu.' });
        }

        const sqlUpdate = 'UPDATE doctors SET password = ? WHERE id = ?';
        db.query(sqlUpdate, [newHashedPassword, doctorId], (updateErr) => {
          if (updateErr) {
            console.error("❌ Lỗi khi cập nhật mật khẩu mới:", updateErr);
            return res.status(500).json({ success: false, message: 'Lỗi server khi cập nhật mật khẩu.' });
          }
          console.log('✅ Password changed successfully for doctor ID:', doctorId);
          res.status(200).json({ success: true, message: 'Đổi mật khẩu thành công!' });
        });
      });
    });
  });
};
exports.getScheduleByDateForAdmin = (req, res) => {
    const doctorId = req.params.id;
    const { date } = req.query;

    if (!date) {
        return res.status(400).json({ message: 'Vui lòng cung cấp tham số ngày (date).' });
    }

    const sql = `
        SELECT 
            ts.id,
            ts.start_time,
            ts.end_time,
            a.id AS appointment_id,
            a.name AS patient_name,
            a.reason,
            a.status AS appointment_status
        FROM doctor_time_slot ts
        LEFT JOIN appointments a ON ts.id = a.time_slot_id AND a.status != 'Đã hủy'
        WHERE ts.doctor_id = ? AND ts.slot_date = ?
        ORDER BY ts.start_time;
    `;

    db.query(sql, [doctorId, date], (err, results) => {
        if (err) {
            console.error("Lỗi truy vấn lịch làm việc của bác sĩ:", err);
            return res.status(500).json({ message: "Lỗi máy chủ." });
        }

        // Tạo mảng slots từ kết quả
        const slots = results.map(row => ({
            id: row.id,
            start: row.start_time,
            end: row.end_time,
            is_booked: !!row.appointment_id,
            is_active: true, // Giả định là active, có thể thêm trường này vào DB nếu cần
            booking: row.appointment_id ? {
                id: row.appointment_id,
                patientName: row.patient_name,
                note: row.reason,
                status: row.appointment_status,
                patientEmail: null, // Thêm các trường còn thiếu nếu cần
                patientPhone: null
            } : null
        }));
        
        // LUÔN LUÔN trả về một object có key là ngày và value là một MẢNG các slots
        // Ngay cả khi không có slot nào, value vẫn là một mảng rỗng [].
        const scheduleResponse = {
            [date]: slots 
        };

        res.json(scheduleResponse);
    });
};