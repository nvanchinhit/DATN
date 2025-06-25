// backend/controllers/user.controller.js

const db = require('../config/db.config');

/**
 * [FINAL FIX] Hàm helper để định dạng ngày tháng an toàn, miễn nhiễm với lỗi timezone.
 * Luôn trả về chuỗi ngày tháng dạng YYYY-MM-DD chính xác.
 * @param {Date | string | null} dateInput - Ngày tháng từ database, ví dụ: '2015-06-20'
 * @returns {string | null}
 */
const formatDateToYYYYMMDD = (dateInput) => {
  if (!dateInput) return null;

  try {
    // Khi new Date('YYYY-MM-DD') được tạo, nó sẽ là nửa đêm (00:00:00) theo giờ UTC.
    const date = new Date(dateInput);

    // getTimezoneOffset() trả về chênh lệch giữa UTC và giờ địa phương của server (tính bằng phút).
    // Ví dụ: Server ở Việt Nam (GMT+7) sẽ trả về -420.
    // Để bù lại việc JavaScript có thể lùi ngày về 1 ngày khi ở múi giờ dương,
    // chúng ta cần trừ đi offset này (trừ của số âm thành cộng).
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    
    // Bây giờ, việc lấy chuỗi ISO và cắt sẽ cho ra ngày chính xác.
    return date.toISOString().split('T')[0];
  } catch (e) {
    console.error("Lỗi định dạng ngày:", e);
    return null; // Trả về null nếu ngày không hợp lệ
  }
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
      return res.status(500).json({ success: false, message: 'Lỗi server khi truy vấn hồ sơ.' });
    }

    if (results.length === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng.' });
    }

    const userProfile = results[0];

    // Sử dụng hàm đã được sửa lỗi để định dạng ngày sinh
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

  // Nếu có file ảnh được tải lên, thêm đường dẫn vào object để cập nhật
  if (req.file) {
    fieldsToUpdate.avatar = `/uploads/${req.file.filename}`;
  }
  
  // [SECURITY] Xóa các trường không nên cho phép người dùng tự cập nhật
  delete fieldsToUpdate.id;
  delete fieldsToUpdate.role_id;
  delete fieldsToUpdate.is_verified;

  // [LOGIC] Nếu ngày sinh là một chuỗi rỗng, đổi nó thành NULL để DB chấp nhận
  if (fieldsToUpdate.hasOwnProperty('birthday') && fieldsToUpdate.birthday === '') {
    fieldsToUpdate.birthday = null;
  }

  // [LOGIC] Kiểm tra xem có gì để cập nhật không
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