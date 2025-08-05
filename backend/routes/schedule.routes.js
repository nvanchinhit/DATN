// file: routes/schedule.routes.js

const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/schedule.controller');

// Import theo đúng cách bạn đã export từ auth.middleware.js
// `authMiddleware` sẽ là hàm `verifyToken`
const authMiddleware = require('../middleware/auth.middleware');
// `isDoctor` là một thuộc tính của module được import
const { isDoctor } = authMiddleware;

// Áp dụng middleware một cách tường minh và đúng thứ tự
// 1. Chạy `authMiddleware` (chính là verifyToken) để xác thực token và lấy ra `req.user`.
// 2. Chạy `isDoctor` để kiểm tra `req.user.role_id`.
router.use(authMiddleware, isDoctor);

// Tất cả các route bên dưới giờ đây đều đã được bảo vệ đúng cách
router.post('/shifts', scheduleController.createWorkShift);
router.get('/doctor-schedule', scheduleController.getScheduleForDoctorByDate);
router.put('/shifts/:shiftId/cancel', scheduleController.cancelWorkShift);
router.put('/slots/:slotId/toggle-status', scheduleController.toggleSlotStatus);

module.exports = router;