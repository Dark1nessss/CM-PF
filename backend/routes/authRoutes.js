const express = require('express');
const { registerUser, loginUser, getUserProfile, getFavorites, getOtherPages } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

// Fetch Register Function
router.post('/register', registerUser);

// Fetch Login Function
router.post('/login', loginUser);

// Fetch User Profile Function
router.get('/profile', protect, getUserProfile);

// Fetch Favorites Function
router.get('/favorites', getFavorites);

// Fetch Other Pages Function
router.get('/otherPages', getOtherPages);

module.exports = router;