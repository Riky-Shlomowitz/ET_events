const express = require('express');
const galleryController = require('../controllers/galleryController');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

const router = express.Router();

// Public routes (לא דורשים אימות)
router.get('/', galleryController.getAll);
router.get('/stats', galleryController.getStats);
router.get('/:id', galleryController.getById);

// Protected routes (דורשים אימות מנהל)
router.post('/', auth, adminAuth, galleryController.create);
router.put('/:id', auth, adminAuth, galleryController.update);
router.delete('/:id', auth, adminAuth, galleryController.delete);

module.exports = router;
