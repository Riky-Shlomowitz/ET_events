const express = require('express');
const galleryController = require('../controllers/galleryController');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');
const upload = require('../middleware/upload');

const router = express.Router();

// Public routes (לא דורשים אימות)
router.get('/', galleryController.getAll);
router.get('/stats', galleryController.getStats);
router.get('/:id', galleryController.getById);

// Protected routes (דורשים אימות מנהל)
router.post('/', auth, adminAuth, galleryController.create);
router.put('/:id', auth, adminAuth, galleryController.update);
router.delete('/:id', auth, adminAuth, galleryController.delete);

// Upload route with multer error handling
router.post('/upload', auth, adminAuth, (req, res, next) => {
  upload.single('file')(req, res, (err) => {
    if (err) {
      console.error('Multer upload error:', err);
      return res.status(400).json({
        success: false,
        message: err.message || 'שגיאה בהעלאת הקובץ',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
      });
    }
    next();
  });
}, galleryController.uploadFile);

module.exports = router;
