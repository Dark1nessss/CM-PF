const express = require('express');
const { registerUser, loginUser, getUserProfile, validateToken } = require('../controllers/authController');
const { protect } = require('../middleware/Middleware');
const router = express.Router();

// Fetch Register Function
router.post('/register', registerUser);

// Fetch Login Function
router.post('/login', loginUser);

// Fetch User Profile Function
router.get('/profile', protect, getUserProfile);

// Validate Token
router.post('/validate-token', validateToken);

module.exports = router;