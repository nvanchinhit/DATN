// backend/middleware/auth.middleware.js

const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-key-for-development";

/**
 * ================================================================
 * Middleware chính: Xác thực JSON Web Token
 * ================================================================
 * - Middleware này được export mặc định.
 * - Nó kiểm tra header 'Authorization' để tìm token 'Bearer'.
 * - Nếu token hợp lệ, nó giải mã và gắn thông tin người dùng vào `req.user`.
 *
 * Cách dùng:
 * const authMiddleware = require('../middleware/auth.middleware');
 * router.get('/protected-route', authMiddleware, (req, res) => { ... });
 */
const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: "Yêu cầu cần token xác thực theo định dạng 'Bearer'." });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Gắn thông tin người dùng (id, role_id,...) vào request
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
  if (req.user && req.user.role_id === 3) {
    next();
  } else {
    return res.status(403).json({ success: false, message: 'Từ chối truy cập: Yêu cầu quyền Bác sĩ.' });
  }
};