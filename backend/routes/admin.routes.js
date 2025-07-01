// backend/routes/admin.routes.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');

// Định nghĩa route cho việc đăng nhập của admin
// URL cuối cùng sẽ là: POST /api/admin/login
router.post('/login', adminController.adminLogin);
router.get('/',adminController.getAllUsers)
module.exports = router;