const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const db = require("../config/db.config");

// 📁 Tạo thư mục lưu ảnh nếu chưa có
const UPLOADS_DIR = path.join(__dirname, "..", "public", "uploads");
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// 📦 Cấu hình multer cho nhiều ảnh (img, certificate, degree)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_DIR),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// ✅ Lấy thông tin bác sĩ theo ID
router.get("/:id", (req, res) => {
  const doctorId = req.params.id;
  const sql = `SELECT * FROM doctors WHERE id = ?`;
  db.query(sql, [doctorId], (err, results) => {
    if (err) return res.status(500).json({ error: "Lỗi truy vấn" });
    if (results.length === 0) return res.status(404).json({ error: "Không tìm thấy bác sĩ" });
    res.json(results[0]);
  });
});

// ✅ Cập nhật hồ sơ bác sĩ (chỉ set 'pending' nếu cập nhật bằng cấp/chứng chỉ)
router.put(
  "/:id",
  upload.fields([
    { name: "img", maxCount: 1 },
    { name: "certificate_image", maxCount: 1 },
    { name: "degree_image", maxCount: 1 },
  ]),
  (req, res) => {
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

    const img = req.files?.img?.[0]?.filename || null;
    const certificate = req.files?.certificate_image?.[0]?.filename || null;
    const degree = req.files?.degree_image?.[0]?.filename || null;

    // Xác định xem có cần set lại trạng thái pending hay không
    const shouldSetPending = certificate || degree;

    // ⚙️ Xây dựng câu lệnh SQL
    let updateSql = `
      UPDATE doctors SET
        name = ?, email = ?, phone = ?, 
        specialization_id = ?, introduction = ?, 
        education = ?, experience = ?
        ${shouldSetPending ? ", account_status = 'pending'" : ""}
        ${img ? ', img = ?' : ''}
        ${certificate ? ', certificate_image = ?' : ''}
        ${degree ? ', degree_image = ?' : ''}
      WHERE id = ?
    `;

    // ⚙️ Chuẩn bị dữ liệu tương ứng
    const values = [
      name,
      email,
      phone,
      specialization_id,
      introduction,
      education,
      experience,
      ...(img ? [img] : []),
      ...(certificate ? [certificate] : []),
      ...(degree ? [degree] : []),
      doctorId,
    ];

    // 🛠️ Thực thi truy vấn cập nhật
    db.query(updateSql, values, (err, result) => {
      if (err) {
        console.error("❌ Lỗi cập nhật:", err);
        return res.status(500).json({ error: "Lỗi cập nhật hồ sơ bác sĩ" });
      }

      // ✅ Lấy lại thông tin bác sĩ sau khi cập nhật
      db.query("SELECT * FROM doctors WHERE id = ?", [doctorId], (err2, rows) => {
        if (err2 || rows.length === 0) {
          return res.status(500).json({ error: "Không thể lấy lại thông tin" });
        }
        res.json(rows[0]);
      });
    });
  }
);



module.exports = router;
