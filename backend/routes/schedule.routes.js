const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/schedule.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Middleware xác thực token và kiểm tra quyền admin sẽ được áp dụng cho tất cả các route trong file này
router.use(authMiddleware, authMiddleware.isAdmin);

// [POST] /api/schedules/shifts -> Tạo một ca làm việc mới và các slot con
router.post('/shifts', scheduleController.createWorkShift);

// [GET] /api/schedules/shifts?date=YYYY-MM-DD -> Lấy danh sách các ca làm việc theo ngày
router.get('/shifts', scheduleController.getShiftsByDate);

// [PUT] /api/schedules/shifts/:shiftId/cancel -> Hủy một ca làm việc
router.put('/shifts/:shiftId/cancel', scheduleController.cancelWorkShift);

module.exports = router;