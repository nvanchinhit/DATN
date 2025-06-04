const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Public routes
router.get('/public-profile/:id', userController.getPublicProfile);

// Protected routes
router.get('/profile', authMiddleware.verifyToken, userController.getProfile);
router.put('/profile', authMiddleware.verifyToken, userController.updateProfile);
router.delete('/', authMiddleware.verifyToken, userController.deleteAccount);

module.exports = router;