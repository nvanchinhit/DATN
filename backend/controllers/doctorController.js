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

    const password = generatePassword();
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

    const payload = {
        id: doctor.id,
        email: doctor.email,
        role_id: doctor.role_id
    };

    const token = jwt.sign(payload, secret, {
      expiresIn: "7d",
    });

    const doctorInfo = {
        id: doctor.id,
        name: doctor.name,
        email: doctor.email,
        specialization_id: doctor.specialization_id,
        account_status: doctor.account_status,
        role_id: doctor.role_id,
        img: doctor.img
    };

    res.json({
      msg: "Đăng nhập thành công!",
      token,
      doctor: doctorInfo,
    });
  });
};


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


// ✅ ĐÃ SỬA LỖI DATABASE: Loại bỏ cột `d.price` không tồn tại
exports.getDoctorById = (req, res) => {
  const doctorId = req.params.id;
  const sql = `
    SELECT 
      d.id, d.name, d.phone, d.email, d.img, d.introduction, d.experience,
      d.university, d.gpa, d.graduation_date, d.degree_type,
      d.certificate_image, d.certificate_source, d.degree_image,
      d.account_status, d.role_id, d.specialization_id,
      d.room_number,
      s.name AS specialization_name,
      s.price AS specialty_price
    FROM doctors d
    LEFT JOIN specializations s ON d.specialization_id = s.id
    WHERE d.id = ?
  `;

  db.query(sql, [doctorId], (err, rows) => {
    if (err) {
      console.error(`[DB ERROR] Lỗi khi truy vấn bác sĩ ID ${doctorId}:`, err);
      return res.status(500).json({ msg: "Lỗi máy chủ khi truy vấn dữ liệu." });
    }

    if (rows.length === 0) {
      return res.status(404).json({ msg: "Không tìm thấy bác sĩ!" });
    }

    try {
      const doctor = rows[0];

      const Certificates = (doctor.certificate_image || '')
        .split('|')
        .filter(filename => filename)
        .map((filename, index) => ({
          id: index + 1,
          filename,
          source: (doctor.certificate_source || '').split('|')[index] || '',
        }));

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

      res.json({
        ...doctor,
        price: doctor.specialty_price || 0, // Lấy giá từ chuyên khoa
        specialty_price: doctor.specialty_price,
        Certificates,
        Degrees,
      });

    } catch (processError) {
      console.error(`[PROCESSING ERROR] Lỗi khi xử lý dữ liệu cho bác sĩ ID ${doctorId}:`, processError);
      return res.status(500).json({ msg: "Lỗi máy chủ khi xử lý thông tin bác sĩ." });
    }
  });
};


exports.updateDoctor = async (req, res) => {
    const doctorId = req.params.id;
    const {
        phone,
        introduction,
        experience,
        gpa,
        university,
        graduation_date,
        degree_type,
        certificate_authorities,
    } = req.body;

    const imgFile = req.files?.img?.[0];
    const degreeFile = req.files?.degree_image?.[0];
    const certificateFiles = req.files?.certificate_files || [];

    try {
        const fieldsToUpdate = {};
        if (phone !== undefined) fieldsToUpdate.phone = phone;
        if (introduction !== undefined) fieldsToUpdate.introduction = introduction;
        if (experience !== undefined) fieldsToUpdate.experience = experience;
        if (gpa !== undefined) fieldsToUpdate.gpa = gpa;
        if (university !== undefined) fieldsToUpdate.university = university;
        if (graduation_date !== undefined) fieldsToUpdate.graduation_date = graduation_date;
        if (degree_type !== undefined) fieldsToUpdate.degree_type = degree_type;

        if (imgFile) fieldsToUpdate.img = imgFile.filename;
        if (degreeFile) fieldsToUpdate.degree_image = degreeFile.filename;

        if (certificateFiles.length > 0) {
            const newImageNames = certificateFiles.map(file => file.filename).join(',');
            fieldsToUpdate.certificate_image = newImageNames;
            const authoritiesArray = [].concat(certificate_authorities || []);
            fieldsToUpdate.certificate_source = authoritiesArray.join(',');
        }

        if (Object.keys(fieldsToUpdate).length === 0) {
            return res.status(400).json({ msg: "Không có thông tin nào để cập nhật!" });
        }

        fieldsToUpdate.account_status = 'pending';
        await db.promise().query("UPDATE doctors SET ? WHERE id = ?", [fieldsToUpdate, doctorId]);
        const [updatedRows] = await db.promise().query("SELECT * FROM doctors WHERE id = ?", [doctorId]);
        res.json(updatedRows[0]);
    } catch (err) {
        console.error("❌ Lỗi khi cập nhật hồ sơ bác sĩ:", err);
        res.status(500).json({ msg: "Lỗi máy chủ khi cập nhật hồ sơ." });
    }
};


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
        COALESCE(AVG(r.rating), 0) AS average_rating,
        COALESCE(COUNT(r.id), 0) AS review_count
    FROM
        doctors d
    LEFT JOIN
        specializations s ON d.specialization_id = s.id
    LEFT JOIN
        ratings r ON d.id = r.doctor_id
    WHERE
        d.account_status = 'active'
    GROUP BY
        d.id, d.name, d.img, d.introduction,
        d.degree_image, d.gpa, d.university, d.graduation_date, d.degree_type,
        d.certificate_image, d.certificate_source,
        s.name
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
      specialty: doc.specialty_name || "Chưa cập nhật", // Đổi tên field để khớp với frontend
      img: doc.img ? `/uploads/${doc.img}` : null,
      average_rating: parseFloat(doc.average_rating || 0),
      review_count: parseInt(doc.review_count || 0),
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

    try {
        const {
            phone, introduction, experience, gpa, university, graduation_date, degree_type,
            certificate_authorities,
        } = req.body;

        const imgFile = req.files?.img?.[0];
        const degreeFile = req.files?.degree_image?.[0];
        const newCertificateFiles = req.files?.certificate_files || [];
        const fieldsToUpdate = {};

        const textFields = {
            phone,
            introduction,
            experience,
            gpa,
            university,
            graduation_date,
            degree_type
        };

        for (const [key, value] of Object.entries(textFields)) {
            if (value !== undefined) {
                fieldsToUpdate[key] = (value === '') ? null : value;
            }
        }

        if (imgFile) fieldsToUpdate.img = imgFile.filename;
        if (degreeFile) fieldsToUpdate.degree_image = degreeFile.filename;

        if (newCertificateFiles.length > 0) {
            const newImageNames = newCertificateFiles.map(file => file.filename).join(',');
            fieldsToUpdate.certificate_image = newImageNames;
            const authoritiesArray = Array.isArray(certificate_authorities) ? certificate_authorities : (certificate_authorities ? [certificate_authorities] : []);
            fieldsToUpdate.certificate_source = authoritiesArray.join(',');
        }

        if (Object.keys(fieldsToUpdate).length === 0) {
            return res.status(400).json({ msg: "Không có thông tin mới nào để cập nhật." });
        }

        fieldsToUpdate.account_status = 'pending';

        const [result] = await db.promise().query("UPDATE doctors SET ? WHERE id = ?", [fieldsToUpdate, doctorId]);
        
        if (result.affectedRows > 0) {
            res.status(200).json({ msg: "Cập nhật hồ sơ thành công! Hồ sơ của bạn sẽ được xét duyệt lại." });
        } else {
            res.status(404).json({ msg: `Không tìm thấy bác sĩ với ID ${doctorId}.` });
        }

    } catch (err) {
        console.error("❌❌❌ [CONTROLLER ERROR] ❌❌❌", err);
        const errorMessage = err.sqlMessage || "Lỗi máy chủ khi cập nhật hồ sơ.";
        res.status(500).json({ msg: errorMessage });
    }
};


exports.getAllDoctorsForAdmin = (req, res) => {
    const API_BASE_URL = `${req.protocol}://${req.get('host')}`;
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
            return {
                ...doctorDetails,
                img: doctor.img ? `${API_BASE_URL}/uploads/${doctor.img}` : null,
                degree_image: doctor.degree_image ? `${API_BASE_URL}/uploads/${doctor.degree_image}` : null,
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


exports.changePassword = (req, res) => {
  const doctorId = req.user.id;
  const { current_password, new_password } = req.body;

  if (!current_password || !new_password) {
    return res.status(400).json({ success: false, message: 'Vui lòng cung cấp mật khẩu hiện tại và mật khẩu mới.' });
  }

  const sqlSelect = 'SELECT password FROM doctors WHERE id = ?';
  db.query(sqlSelect, [doctorId], (err, results) => {
    if (err) {
      console.error("❌ Lỗi khi lấy mật khẩu cũ:", err);
      return res.status(500).json({ success: false, message: 'Lỗi server khi lấy mật khẩu.' });
    }
    if (results.length === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy bác sĩ.' });
    }

    const hashedPasswordInDb = results[0].password;
    bcrypt.compare(current_password, hashedPasswordInDb, (compareErr, isMatch) => {
      if (compareErr) {
        return res.status(500).json({ success: false, message: 'Lỗi server khi xác thực.' });
      }
      if (!isMatch) {
        return res.status(400).json({ success: false, message: 'Mật khẩu hiện tại không chính xác.' });
      }

      bcrypt.hash(new_password, 10, (hashErr, newHashedPassword) => {
        if (hashErr) {
          return res.status(500).json({ success: false, message: 'Lỗi server khi bảo mật mật khẩu.' });
        }
        const sqlUpdate = 'UPDATE doctors SET password = ? WHERE id = ?';
        db.query(sqlUpdate, [newHashedPassword, doctorId], (updateErr) => {
          if (updateErr) {
            return res.status(500).json({ success: false, message: 'Lỗi server khi cập nhật mật khẩu.' });
          }
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

        const slots = results.map(row => ({
            id: row.id,
            start: row.start_time,
            end: row.end_time,
            is_booked: !!row.appointment_id,
            is_active: true,
            booking: row.appointment_id ? {
                id: row.appointment_id,
                patientName: row.patient_name,
                note: row.reason,
                status: row.appointment_status,
                patientEmail: null,
                patientPhone: null
            } : null
        }));
        
        const scheduleResponse = {
            [date]: slots 
        };

        res.json(scheduleResponse);
    });
};