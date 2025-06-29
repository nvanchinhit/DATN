// backend/controllers/user.controller.js

const db = require('../config/db.config');
const bcrypt = require('bcrypt');

// Hàm helper để định dạng ngày tháng an toàn
const formatDateToYYYYMMDD = (dateInput) => {
  if (!dateInput) return null;
  try {
    const date = new Date(dateInput);
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    return date.toISOString().split('T')[0];
  } catch (e) {
    console.error("Lỗi định dạng ngày:", e);
    return null; 
  }
};


// Lấy hồ sơ của người dùng đã xác thực
exports.getProfile = (req, res) => {
  const userId = req.user.id;
  const sql = 'SELECT id, name, email, phone, gender, birthday, avatar, address FROM customers WHERE id = ?';

  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error("❌ Lỗi khi lấy hồ sơ:", err);
      return res.status(500).json({ success: false, message: 'Lỗi server khi truy vấn hồ sơ.' });
    }
    if (results.length === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng.' });
    }
    const userProfile = results[0];
    userProfile.birthday = formatDateToYYYYMMDD(userProfile.birthday);
    res.status(200).json({ success: true, data: userProfile });
  });
};

// Cập nhật hồ sơ của người dùng đã xác thực
exports.updateProfile = (req, res) => {
  const userId = req.user.id;
  const fieldsToUpdate = { ...req.body };

  if (req.file) {
    fieldsToUpdate.avatar = `/uploads/${req.file.filename}`;
  }
  
  delete fieldsToUpdate.id;
  delete fieldsToUpdate.role_id;
  delete fieldsToUpdate.is_verified;

  if (fieldsToUpdate.hasOwnProperty('birthday') && fieldsToUpdate.birthday === '') {
    fieldsToUpdate.birthday = null;
  }

  if (Object.keys(fieldsToUpdate).length === 0) {
    return res.status(400).json({ success: false, message: 'Không có thông tin nào để cập nhật.' });
  }

  const sql = 'UPDATE customers SET ? WHERE id = ?';
  const values = [fieldsToUpdate, userId];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("❌ Lỗi khi cập nhật hồ sơ:", err);
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ success: false, message: 'Email này đã được sử dụng.' });
      }
      if (err.code === 'ER_BAD_FIELD_ERROR') {
          return res.status(400).json({ success: false, message: 'Một số trường thông tin không hợp lệ.' });
      }
      return res.status(500).json({ success: false, message: 'Lỗi server khi cập nhật.' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng để cập nhật.' });
    }
    res.status(200).json({ success: true, message: 'Cập nhật hồ sơ thành công!' });
  });
};

// Đổi mật khẩu cho người dùng đã xác thực
exports.changePassword = (req, res) => {
  const userId = req.user.id;
  const { current_password, new_password } = req.body;

  if (!current_password || !new_password) {
    return res.status(400).json({ success: false, message: 'Vui lòng cung cấp mật khẩu hiện tại và mật khẩu mới.' });
  }

  const sqlSelect = 'SELECT password FROM customers WHERE id = ?';
  db.query(sqlSelect, [userId], (err, results) => {
    if (err) {
      console.error("❌ Lỗi khi lấy mật khẩu cũ:", err);
      return res.status(500).json({ success: false, message: 'Lỗi server khi lấy mật khẩu.' });
    }
    if (results.length === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng.' });
    }

    const hashedPasswordInDb = results[0].password;

    bcrypt.compare(current_password, hashedPasswordInDb, (compareErr, isMatch) => {
      if (compareErr) {
        console.error("❌ Lỗi khi so sánh mật khẩu:", compareErr);
        return res.status(500).json({ success: false, message: 'Lỗi server khi xác thực.' });
      }
      if (!isMatch) {
        return res.status(400).json({ success: false, message: 'Mật khẩu hiện tại không chính xác.' });
      }

      bcrypt.hash(new_password, 10, (hashErr, newHashedPassword) => {
        if (hashErr) {
          console.error("❌ Lỗi khi mã hóa mật khẩu mới:", hashErr);
          return res.status(500).json({ success: false, message: 'Lỗi server khi bảo mật mật khẩu.' });
        }

        const sqlUpdate = 'UPDATE customers SET password = ? WHERE id = ?';
        db.query(sqlUpdate, [newHashedPassword, userId], (updateErr) => {
          if (updateErr) {
            console.error("❌ Lỗi khi cập nhật mật khẩu mới:", updateErr);
            return res.status(500).json({ success: false, message: 'Lỗi server khi cập nhật mật khẩu.' });
          }
          res.status(200).json({ success: true, message: 'Đổi mật khẩu thành công!' });
        });
      });
    });
  });
};

/**
 * [ĐÃ SỬA] Lấy tất cả người dùng (Không JOIN bảng roles)
 */
exports.getAllUsers = (req, res) => {
  // Câu lệnh SQL chỉ lấy dữ liệu từ bảng customers
  const sql = `
    SELECT 
      id, name, email, phone, gender, birthday, address, 
      avatar, is_verified, created_at, role_id
    FROM customers
    ORDER BY created_at DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("❌ Lỗi khi lấy danh sách người dùng:", err);
      return res.status(500).json({ success: false, message: 'Lỗi server khi truy vấn dữ liệu.' });
    }
    
    // Trả về dữ liệu gốc, frontend sẽ xử lý việc hiển thị tên vai trò
    res.status(200).json(results); 
  });
};