const express = require('express');
const { getFavorites, getOtherPages, createPage, moveToFavorites, moveToPrivate, getPageFromCollections, updatePage, createBlock, updateBlock } = require('../controllers/pageController');
const { protect } = require('../middleware/Middleware');
const router = express.Router();

// Layer routes
router.get('/favorites', protect, getFavorites);
router.get('/otherPages', protect, getOtherPages);

// Page routes
router.post('/create', protect, createPage);
router.patch('/page/:id', protect, updatePage);
router.post('/block', protect, createBlock);
router.patch('/block/:id', protect, updateBlock);

// Move routes
router.patch('/move-to-favorites/:id', protect, moveToFavorites);
router.patch('/move-to-private/:id', protect, moveToPrivate);
router.get('/page/:id', protect, getPageFromCollections);

module.exports = router;