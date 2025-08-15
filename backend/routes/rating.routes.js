// backend/routes/rating.routes.js
const express = require('express');
const router = express.Router();
const db = require('../config/db.config');
const authMiddleware = require('../middleware/auth.middleware');
const { isAdmin } = require('../middleware/auth.middleware');
const { checkProfanity } = require('../utils/profanityFilter');

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

    // Kiểm tra từ ngữ thô tục trong comment
    if (comment) {
        const profanityCheck = checkProfanity(comment);
        if (profanityCheck.hasProfanity) {
            // Chỉ trả về lỗi một lần, không cho phép spam
            return res.status(400).json({ 
                message: "Bình luận chứa từ ngữ không phù hợp. Vui lòng sửa lại.",
                foundWords: profanityCheck.foundWords,
                errorType: "profanity",
                timestamp: new Date().toISOString()
            });
        }
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
            INSERT INTO ratings (customer_id, doctor_id, appointment_id, rating, comment, created_at, status)
            VALUES (?, ?, ?, ?, ?, NOW(), 'pending')
        `;
        // Chú ý: Bảng ratings cần có cột doctor_id, appointment_id và status
        db.query(insertSql, [customer_id, doctor_id, appointment_id, rating, comment], (err, result) => {
            if (err) {
                console.error("Lỗi lưu đánh giá:", err);
                return res.status(500).json({ message: "Không thể lưu đánh giá." });
            }
            res.status(201).json({ 
                message: "Đánh giá của bạn đã được gửi và đang chờ duyệt. Cảm ơn!", 
                ratingId: result.insertId 
            });
        });
    });
});

// Lấy tất cả đánh giá của người dùng đã đăng nhập (chỉ hiển thị đã duyệt)
router.get('/my-ratings', authMiddleware, (req, res) => {
    const customer_id = req.user.id;

    const sql = `
        SELECT
            r.id,
            r.rating,
            r.comment,
            r.created_at,
            r.status,
            d.name AS doctor_name,
            d.img AS doctor_img,
            s.name AS specialization_name,
            ts.slot_date,
            ts.start_time
        FROM ratings AS r
        JOIN doctors AS d ON r.doctor_id = d.id
        JOIN appointments AS a ON r.appointment_id = a.id
        JOIN doctor_time_slot ts ON a.time_slot_id = ts.id
        JOIN specializations AS s ON d.specialization_id = s.id
        WHERE r.customer_id = ? AND r.status = 'approved'
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

// API: Lấy tất cả bình luận để admin duyệt (chỉ admin)
router.get('/all', authMiddleware, isAdmin, (req, res) => {
    const sql = `
        SELECT
            r.id,
            r.rating,
            r.comment,
            r.created_at,
            r.status,
            d.name AS doctor_name,
            d.img AS doctor_img,
            s.name AS specialization_name,
            ts.slot_date,
            ts.start_time,
            c.name AS customer_name,
            c.email AS customer_email
        FROM ratings AS r
        JOIN doctors AS d ON r.doctor_id = d.id
        JOIN appointments AS a ON r.appointment_id = a.id
        JOIN doctor_time_slot ts ON a.time_slot_id = ts.id
        JOIN specializations AS s ON d.specialization_id = s.id
        JOIN customers AS c ON r.customer_id = c.id
        ORDER BY r.created_at DESC
    `;
    db.query(sql, (err, results) => {
        if (err) {
            console.error("Lỗi khi lấy danh sách tất cả bình luận:", err);
            return res.status(500).json({ message: "Lỗi máy chủ khi lấy dữ liệu." });
        }
        res.status(200).json(results);
    });
});

// API: Lấy đánh giá của một bác sĩ cụ thể (công khai)
router.get('/doctor/:doctorId', (req, res) => {
    const doctorId = req.params.doctorId;
    
    const sql = `
        SELECT
            r.id,
            r.rating,
            r.comment,
            r.created_at,
            r.status,
            c.name AS customer_name,
            c.email AS customer_email
        FROM ratings AS r
        JOIN customers AS c ON r.customer_id = c.id
        WHERE r.doctor_id = ? AND r.status = 'approved'
        ORDER BY r.created_at DESC
    `;
    
    db.query(sql, [doctorId], (err, results) => {
        if (err) {
            console.error("Lỗi khi lấy đánh giá của bác sĩ:", err);
            return res.status(500).json({ message: "Lỗi máy chủ khi lấy dữ liệu." });
        }
        res.status(200).json(results);
    });
});

// API: Duyệt đánh giá (chỉ admin)
router.put('/:id/approve', authMiddleware, isAdmin, (req, res) => {
    const ratingId = req.params.id;
    const { status } = req.body; // 'approved' hoặc 'rejected'
    
    if (!['approved', 'rejected'].includes(status)) {
        return res.status(400).json({ message: "Trạng thái không hợp lệ." });
    }

    const sql = 'UPDATE ratings SET status = ? WHERE id = ?';
    db.query(sql, [status, ratingId], (err, result) => {
        if (err) {
            console.error("Lỗi khi cập nhật trạng thái đánh giá:", err);
            return res.status(500).json({ message: "Lỗi máy chủ khi cập nhật." });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Không tìm thấy đánh giá để cập nhật." });
        }
        
        const message = status === 'approved' ? 'Đã duyệt đánh giá thành công.' : 'Đã từ chối đánh giá.';
        res.status(200).json({ message });
    });
});

// API: Xóa bình luận theo id (chỉ admin)
router.delete('/:id', authMiddleware, isAdmin, (req, res) => {
    const ratingId = req.params.id;
    const sql = 'DELETE FROM ratings WHERE id = ?';
    db.query(sql, [ratingId], (err, result) => {
        if (err) {
            console.error("Lỗi khi xóa bình luận:", err);
            return res.status(500).json({ message: "Lỗi máy chủ khi xóa bình luận." });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Không tìm thấy bình luận để xóa." });
        }
        res.status(200).json({ message: "Đã xóa bình luận thành công." });
    });
});

module.exports = router;