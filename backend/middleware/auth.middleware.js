// backend/middleware/auth.middleware.js
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-key";

/**
 * Middleware để xác minh token JWT từ header Authorization.
 */
exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: "Yêu cầu cần token xác thực." });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    // Gắn thông tin người dùng vào request để các xử lý sau sử dụng
    req.user = decoded; 
    next();
  } catch (err) {
    return res.status(403).json({ success: false, message: "Token không hợp lệ hoặc đã hết hạn." });
  }
};

/**
 * Middleware để kiểm tra vai trò admin.
 */
exports.isAdmin = (req, res, next) => {
  if (req.user && req.user.role_id === 1) { // Giả sử role_id=1 là admin
    next();
  } else {
    return res.status(403).json({ success: false, message: 'Từ chối truy cập: Yêu cầu quyền Admin.' });
  }
};