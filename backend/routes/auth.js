const express = require('express');
const router = express.Router();
const { registerStudent, loginStudent, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Public Onboarding Paths
router.post('/register', registerStudent);
router.post('/login', loginStudent);

// Private Diagnostics Path
router.get('/me', protect, getMe);

module.exports = router;