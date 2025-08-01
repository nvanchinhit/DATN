// backend/middleware/auth.middleware.js

const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-key-for-development";
const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: "Yêu cầu cần token xác thực theo định dạng 'Bearer'." });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    console.log('🔐 Token verified, user:', req.user); // Thêm log này
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: "Token đã hết hạn. Vui lòng đăng nhập lại." });
    }
    return res.status(403).json({ success: false, message: "Token không hợp lệ." });
  }
};

// Export hàm verifyToken làm module chính
module.exports = verifyToken;


/**
 * ================================================================
 * Middleware phụ: Kiểm tra vai trò Admin (role_id = 1)
 * ================================================================
 * - Phải được dùng SAU middleware `verifyToken`.
 *
 * Cách dùng:
 * const authMiddleware = require('../middleware/auth.middleware');
 * const { isAdmin } = require('../middleware/auth.middleware');
 * router.post('/admin-action', authMiddleware, isAdmin, (req, res) => { ... });
 */
module.exports.isAdmin = (req, res, next) => {
  if (req.user && req.user.role_id === 1) { 
    next();
  } else {
    return res.status(403).json({ success: false, message: 'Từ chối truy cập: Yêu cầu quyền Admin.' });
  }
};

/**
 * ================================================================
 * Middleware phụ: Kiểm tra vai trò Bác sĩ (role_id = 3)
 * ================================================================
 * - Phải được dùng SAU middleware `verifyToken`.
 */
module.exports.isDoctor = (req, res, next) => {
  console.log('🔍 isDoctor middleware - User role:', req.user?.role_id); // Thêm log này
  if (req.user && req.user.role_id === 3) {
    console.log('✅ Doctor access granted'); // Thêm log này
    next();
  } else {
    console.log('❌ Doctor access denied - role_id:', req.user?.role_id); // Thêm log này
    return res.status(403).json({ success: false, message: 'Từ chối truy cập: Yêu cầu quyền Bác sĩ.' });
  }
};