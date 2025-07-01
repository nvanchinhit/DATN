// backend/controllers/admin.controller.js
const db = require('../config/db.config');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const secret = process.env.JWT_SECRET || "your_default_secret";

// === ĐĂNG NHẬP CHO ADMIN - ĐÃ SỬA ĐỂ DÙNG BẢNG `admins` ===
exports.adminLogin = (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ msg: "Vui lòng nhập email và mật khẩu." });
    }

    // <<< THAY ĐỔI 1: Truy vấn vào đúng bảng `admins` >>>
    const sql = "SELECT * FROM admins WHERE email = ?";
    db.query(sql, [email], async (err, rows) => {
        if (err) {
            console.error("Lỗi truy vấn admin:", err);
            return res.status(500).json({ msg: "Lỗi server!" });
        }
        if (rows.length === 0) {
            return res.status(400).json({ msg: "Tài khoản quản trị không tồn tại." });
        }
        
        const admin = rows[0];

        // <<< THAY ĐỔI 2: Không cần kiểm tra role_id nữa >>>
        // Vì đã truy vấn thẳng vào bảng `admins`, mọi tài khoản trong đây đều là admin.

        const match = await bcrypt.compare(password, admin.password);
        if (!match) {
            return res.status(400).json({ msg: "Mật khẩu không chính xác." });
        }

        // Tạo token với thông tin của admin
        const token = jwt.sign(
            { 
                id: admin.id, 
                email: admin.email, 
                role_id: admin.role_id || 1 // Gán cứng role_id = 1 cho admin
            },
            secret,
            { expiresIn: '1d' } // Token admin nên có thời gian sống ngắn
        );

        res.json({
            msg: "Đăng nhập quản trị viên thành công!",
            token,
            // <<< THAY ĐỔI 3: Trả về đối tượng `user` cho nhất quán >>>
            // Giúp frontend dễ xử lý khi lưu vào localStorage
            user: { 
                id: admin.id,
                name: admin.name,
                email: admin.email,
                role_id: admin.role_id || 1,
            },
        });
    });
};
exports.getAllUsers = (req, res) => {
    try {
        const sql = `
            SELECT 
                   id, name, email, phone, gender, birthday, address, 
                   avatar, is_verified, created_at, role_id
            FROM customers
            ORDER BY created_at DESC
        `;
        
        // Sử dụng cú pháp callback: db.query(sql, (err, results) => { ... })
        db.query(sql, (err, results) => {
            if (err) {
                // Nếu có lỗi trong quá trình truy vấn
                console.error("❌ Lỗi khi lấy danh sách người dùng:", err);
                // Chỉ gửi một phản hồi lỗi duy nhất
                return res.status(500).json({ success: false, message: 'Lỗi server khi truy vấn dữ liệu.' });
            }
            
            // Nếu không có lỗi, gửi kết quả thành công
            res.status(200).json(results);
        });

    } catch (err) {
        // Khối catch này chủ yếu để bắt các lỗi đồng bộ (hiếm khi xảy ra ở đây)
        console.error("❌ Lỗi không xác định trong controller:", err);
        res.status(500).json({ success: false, message: 'Lỗi không xác định trên server.' });
    }
};