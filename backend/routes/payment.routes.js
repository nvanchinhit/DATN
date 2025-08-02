const express = require('express');
const router = express.Router();
const PaymentController = require('../controllers/paymentController');
const verifyToken = require('../middleware/auth.middleware');
const { isAdmin } = require('../middleware/auth.middleware');

// Middleware xác thực cho admin
const adminAuth = [verifyToken, isAdmin];

// Tạo instance controller
const paymentController = new PaymentController();

// GET - Lấy thông tin payment settings (không cần xác thực)
router.get('/settings', paymentController.getPaymentSettings.bind(paymentController));

// POST - Lưu thông tin payment settings
router.post('/settings', adminAuth, paymentController.savePaymentSettings.bind(paymentController));

// PUT - Cập nhật thông tin payment settings theo ID
router.put('/settings/:id', adminAuth, paymentController.updatePaymentSettings.bind(paymentController));

// DELETE - Xóa thông tin payment settings theo ID
router.delete('/settings/:id', adminAuth, paymentController.deletePaymentSettings.bind(paymentController));

// POST - Check payment history từ API bên ngoài
router.post('/check-history', paymentController.checkPaymentHistory.bind(paymentController));

// POST - Test API thanh toán (chỉ để debug)
router.post('/test-api', adminAuth, paymentController.testPaymentAPI.bind(paymentController));

// POST - Tạo QR code động
router.post('/generate-qr', paymentController.generateQR.bind(paymentController));

module.exports = router; 