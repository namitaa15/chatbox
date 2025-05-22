// server/routes/authRoutes.js

const express = require('express');
const { signup, login } = require('../controllers/authController');

const router = express.Router();

// @route   POST /api/signup
// @desc    Register a new user
router.post('/signup', signup);

// @route   POST /api/login
// @desc    Authenticate user & get token
router.post('/login', login);

module.exports = router;
