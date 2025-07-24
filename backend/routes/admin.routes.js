const express = require('express');
const router = express.Router();

// GỌI DUY NHẤT 1 CONTROLLER ĐÃ GỘP
const adminController = require('../controllers/admin.controller');

// AUTH + USERS
router.post('/login', adminController.adminLogin);
router.get('/', adminController.getAllUsers);

// DASHBOARD - STATS
router.get('/stats', adminController.getStats);
router.get('/revenue/monthly', adminController.getRevenueByMonth);
router.get('/revenue/daily', adminController.getRevenueByDay);
router.get('/revenue/yearly', adminController.getRevenueByYear);
router.get('/specialty-stats', adminController.getAppointmentStatsBySpecialty) // ✅ mới thêm
router.get('/specialty-list', adminController.getAllSpecialties);
// routes/admin.route.js
// routes/admin.route.js
router.get('/booking-ratio-monthly', adminController.getBookingRatioByMonth)
// routes/admin.routes.js
router.get('/pie-stats', adminController.getPieStats)



module.exports = router;
