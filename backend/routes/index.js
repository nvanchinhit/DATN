const express = require('express');
const router = express.Router();

const userRoutes = require('./user.routes');
const authRoutes = require('./auth.routes');

// Mount route groups
router.use('/users', userRoutes);
router.use('/auth', authRoutes);

// Base API route
router.get('/', (req, res) => {
  res.json({
    message: 'API is running',
    version: '1.0.0',
  });
});

module.exports = router;