// backend/controllers/user.controller.js
const db = require('../config/db.config');

/**
 * Hàm helper để định dạng ngày tháng an toàn, tránh lỗi timezone
 * @param {Date | string} dateInput - Ngày tháng từ database
 * @returns {string | null} - Chuỗi ngày tháng dạng YYYY-MM-DD hoặc null
 */
const formatDateToYYYYMMDD = (dateInput) => {
  if (!dateInput) return null;
  const date = new Date(dateInput);
  // Thêm chênh lệch múi giờ của client để bù lại phần bị trừ đi khi chuyển sang UTC
  // Ví dụ: new Date('2017-02-10T00:00:00') ở GMT+7 -> toISOString() -> '2017-02-09T17:00:00.000Z'
  // getTimezoneOffset() của GMT+7 là -420 (phút).
  // Bù lại bằng cách cộng thêm số phút đó.
  date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Lấy hồ sơ của người dùng đã xác thực
 */
exports.getProfile = (req, res) => {
  const userId = req.user.id;

  const sql = 'SELECT id, name, email, phone, gender, birthday, avatar, address FROM customers WHERE id = ?';

  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error("❌ Lỗi khi lấy hồ sơ:", err);
      return res.status(500).json({ success: false, message: 'Lỗi server.' });
    }

    if (results.length === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng.' });
    }

    const userProfile = results[0];
    userProfile.birthday = formatDateToYYYYMMDD(userProfile.birthday);

    res.status(200).json({ success: true, data: userProfile });
  });
};


/**
 * Cập nhật hồ sơ của người dùng đã xác thực
 */
exports.updateProfile = (req, res) => {
  const userId = req.user.id;
  const fieldsToUpdate = { ...req.body };

  if (req.file) {
    fieldsToUpdate.avatar = `/uploads/${req.file.filename}`;
  }

  // ✅ Chuyển đổi trường 'dob' thành 'birthday' nếu cần
  if (fieldsToUpdate.dob) {
    fieldsToUpdate.birthday = fieldsToUpdate.dob;
    delete fieldsToUpdate.dob;
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
      return res.status(500).json({ success: false, message: 'Lỗi server khi cập nhật.' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng.' });
    }

    res.status(200).json({ success: true, message: 'Cập nhật hồ sơ thành công!' });
  });
};
