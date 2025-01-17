const express = require('express');
const { getFavorites, getOtherPages, createPage, getPages, updatePage, deletePage, createBlock, updateBlock, deleteBlock } = require('../controllers/pageController');
const { protect } = require('../middleware/Middleware');
const router = express.Router();

// Layer routes
router.get('/favorites', protect, getFavorites);
router.get('/otherPages', protect, getOtherPages);

// Page routes
router.post('/create', protect, createPage);
router.get('/:layerType/:layerId', protect, getPages);
router.patch('/update/:id', protect, updatePage);
router.delete('/delete/:id', protect, deletePage);

// Block routes
router.post('/blocks/create', protect, createBlock);
router.patch('/blocks/update/:id', protect, updateBlock);
router.delete('/blocks/delete/:id', protect, deleteBlock);

module.exports = router;