// backend/routes/rating.routes.js
const express = require('express');
const router = express.Router();
const db = require('../config/db.config');
const authMiddleware = require('../middleware/auth.middleware'); 

// Dùng middleware để đảm bảo chỉ người dùng đăng nhập mới có thể đánh giá
router.post('/', authMiddleware, (req, res) => {
    // authMiddleware sẽ giải mã token và gắn user.id vào req
    const customer_id_from_token = req.user.id; 

    const { rating, comment, customer_id, doctor_id, appointment_id } = req.body;

    // Kiểm tra bảo mật: ID người dùng từ token phải khớp với ID gửi lên
    if (customer_id_from_token !== customer_id) {
        return res.status(403).json({ message: "Hành động không được phép." });
    }

    if (!rating || !customer_id || !doctor_id || !appointment_id) {
        return res.status(400).json({ message: "Thiếu thông tin bắt buộc." });
    }

    // Nên có thêm bước kiểm tra xem người dùng đã đánh giá cho lịch hẹn này chưa
    const checkSql = "SELECT id FROM ratings WHERE appointment_id = ?";
    db.query(checkSql, [appointment_id], (err, existing) => {
        if (err) {
            return res.status(500).json({ message: "Lỗi máy chủ." });
        }
        if (existing.length > 0) {
            return res.status(409).json({ message: "Bạn đã đánh giá cho lịch hẹn này rồi." });
        }

        const insertSql = `
            INSERT INTO ratings (customer_id, doctor_id, appointment_id, rating, comment, created_at)
            VALUES (?, ?, ?, ?, ?, NOW())
        `;
        // Chú ý: Bảng ratings cần có cột doctor_id và appointment_id
        db.query(insertSql, [customer_id, doctor_id, appointment_id, rating, comment], (err, result) => {
            if (err) {
                console.error("Lỗi lưu đánh giá:", err);
                return res.status(500).json({ message: "Không thể lưu đánh giá." });
            }
            res.status(201).json({ message: "Đánh giá của bạn đã được ghi nhận. Cảm ơn!", ratingId: result.insertId });
        });
    });
});
// Lấy tất cả đánh giá của người dùng đã đăng nhập
router.get('/my-ratings', authMiddleware, (req, res) => {
    const customer_id = req.user.id;

    const sql = `
        SELECT
            r.id,
            r.rating,
            r.comment,
            r.created_at,
            d.full_name AS doctor_name,
            d.img AS doctor_img,
            s.name AS specialization_name,
            a.slot_date,
            a.start_time
        FROM ratings AS r
        JOIN doctors AS d ON r.doctor_id = d.id
        JOIN appointments AS a ON r.appointment_id = a.id
        JOIN specializations AS s ON d.specialization_id = s.id
        WHERE r.customer_id = ?
        ORDER BY r.created_at DESC
    `;

    db.query(sql, [customer_id], (err, results) => {
        if (err) {
            console.error("Lỗi khi lấy danh sách đánh giá:", err);
            return res.status(500).json({ message: "Lỗi máy chủ khi lấy dữ liệu." });
        }
        res.status(200).json(results);
    });
});

module.exports = router;