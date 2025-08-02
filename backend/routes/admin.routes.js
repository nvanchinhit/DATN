const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const { isAdmin } = require('../middleware/auth.middleware');

// GỌI DUY NHẤT 1 CONTROLLER ĐÃ GỘP
const adminController = require('../controllers/admin.controller');

// AUTH + USERS
router.post('/login', adminController.adminLogin);
router.get('/', authMiddleware, isAdmin, adminController.getAllUsers);

// DASHBOARD - STATS
router.get('/stats', authMiddleware, isAdmin, adminController.getStats);
router.get('/revenue/monthly', authMiddleware, isAdmin, adminController.getRevenueByMonth);
router.get('/revenue/daily', authMiddleware, isAdmin, adminController.getRevenueByDay);
router.get('/revenue/yearly', authMiddleware, isAdmin, adminController.getRevenueByYear);
router.get('/specialty-stats', authMiddleware, isAdmin, adminController.getAppointmentStatsBySpecialty) // ✅ mới thêm
router.get('/specialty-list', authMiddleware, isAdmin, adminController.getAllSpecialties);
// routes/admin.route.js
// routes/admin.route.js
router.get('/booking-ratio-monthly', authMiddleware, isAdmin, adminController.getBookingRatioByMonth)
// routes/admin.routes.js
router.get('/pie-stats', authMiddleware, isAdmin, adminController.getPieStats)

// MEDICAL RECORDS - HỒ SƠ BỆNH ÁN
router.get('/medical-records', authMiddleware, isAdmin, adminController.getAllMedicalRecords);
router.get('/medical-records/:id', authMiddleware, isAdmin, adminController.getMedicalRecordById);
router.get('/medical-records-by-doctors', authMiddleware, isAdmin, adminController.getMedicalRecordsByDoctors);
router.get('/doctors', authMiddleware, isAdmin, adminController.getDoctors);

// PAYMENT APPOINTMENTS - LỊCH HẸN ĐÃ THANH TOÁN
router.get('/paid-appointments', authMiddleware, isAdmin, adminController.getPaidAppointments);
router.get('/payment-stats', authMiddleware, isAdmin, adminController.getPaymentStats);

module.exports = router;
