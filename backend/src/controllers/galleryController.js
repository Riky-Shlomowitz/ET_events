const GalleryItem = require('../models/GalleryItem');
const { Op } = require('sequelize');
const path = require('path');
const { sequelize } = require('../config/database');

// Check if database is connected
async function isDatabaseConnected() {
  try {
    await sequelize.authenticate();
    return true;
  } catch {
    return false;
  }
}

class GalleryController {
  // GET /api/gallery
  async getAll(req, res) {
    try {
      // Check DB connection first
      const dbConnected = await isDatabaseConnected();
      if (!dbConnected) {
        // Return empty array if DB not connected
        return res.json({
          success: true,
          data: [],
          pagination: { page: 1, limit: 50, total: 0, pages: 0 }
        });
      }

      const {
        category,
        status = 'active',
        page = 1,
        limit = 50,
        sort = '-created_at'
      } = req.query;

      const where = {};

      // Filter by category
      if (category && category !== 'all') {
        where.category = category;
      }

      // Filter by status
      if (status) {
        where.status = status;
      }

      // Sorting
      const [sortField, sortDirection] = sort.startsWith('-')
        ? [sort.slice(1), 'DESC']
        : [sort, 'ASC'];

      const offset = (page - 1) * limit;

      const { rows: items, count: total } = await GalleryItem.findAndCountAll({
        where,
        order: [[sortField, sortDirection]],
        limit: parseInt(limit),
        offset: parseInt(offset)
      });

      res.json({
        success: true,
        data: items,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      console.error('Error in getAll:', error);
      // Return empty array on error instead of 500
      res.json({
        success: true,
        data: [],
        pagination: { page: 1, limit: 50, total: 0, pages: 0 }
      });
    }
  }

  // GET /api/gallery/:id
  async getById(req, res) {
    try {
      const item = await GalleryItem.findByPk(req.params.id);
      
      if (!item) {
        return res.status(404).json({
          success: false,
          message: 'פריט לא נמצא'
        });
      }

      res.json({
        success: true,
        data: item
      });
    } catch (error) {
      console.error('Error in getById:', error);
      res.status(500).json({
        success: false,
        message: 'שגיאה בטעינת הפריט',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // POST /api/gallery
  async create(req, res) {
    try {
      const item = await GalleryItem.create(req.body);
      
      res.status(201).json({
        success: true,
        message: 'פריט נוצר בהצלחה',
        data: item
      });
    } catch (error) {
      console.error('Error in create:', error);
      res.status(400).json({
        success: false,
        message: 'שגיאה ביצירת הפריט',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // PUT /api/gallery/:id
  async update(req, res) {
    try {
      const [updatedRows] = await GalleryItem.update(req.body, {
        where: { id: req.params.id },
        returning: true
      });

      if (updatedRows === 0) {
        return res.status(404).json({
          success: false,
          message: 'פריט לא נמצא'
        });
      }

      const updatedItem = await GalleryItem.findByPk(req.params.id);
      
      res.json({
        success: true,
        message: 'פריט עודכן בהצלחה',
        data: updatedItem
      });
    } catch (error) {
      console.error('Error in update:', error);
      res.status(400).json({
        success: false,
        message: 'שגיאה בעדכון הפריט',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // DELETE /api/gallery/:id
  async delete(req, res) {
    try {
      const deletedRows = await GalleryItem.destroy({
        where: { id: req.params.id }
      });

      if (deletedRows === 0) {
        return res.status(404).json({
          success: false,
          message: 'פריט לא נמצא'
        });
      }

      res.json({
        success: true,
        message: 'פריט נמחק בהצלחה'
      });
    } catch (error) {
      console.error('Error in delete:', error);
      res.status(500).json({
        success: false,
        message: 'שגיאה במחיקת הפריט',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // POST /api/gallery/upload
  async uploadFile(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'לא נבחר קובץ להעלאה'
        });
      }

      // Generate file URL
      const fileUrl = `/uploads/${req.file.filename}`;
      
      res.json({
        success: true,
        message: 'קובץ הועלה בהצלחה',
        data: {
          file_url: fileUrl,
          filename: req.file.filename,
          originalname: req.file.originalname,
          mimetype: req.file.mimetype,
          size: req.file.size
        }
      });
    } catch (error) {
      console.error('Error in uploadFile:', error);
      res.status(500).json({
        success: false,
        message: 'שגיאה בהעלאת הקובץ',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // GET /api/gallery/stats
  async getStats(req, res) {
    try {
      const { sequelize } = require('../config/database');
      
      const totalItems = await GalleryItem.count();
      const activeItems = await GalleryItem.count({ where: { status: 'active' } });
      const featuredItems = await GalleryItem.count({ where: { is_featured: true } });
      
      const categoryStats = await GalleryItem.findAll({
        attributes: [
          'category',
          [sequelize.fn('COUNT', sequelize.col('id')), 'count']
        ],
        group: ['category'],
        raw: true
      });

      const mediaTypeStats = await GalleryItem.findAll({
        attributes: [
          'media_type',
          [sequelize.fn('COUNT', sequelize.col('id')), 'count']
        ],
        group: ['media_type'],
        raw: true
      });

      res.json({
        success: true,
        data: {
          total: totalItems,
          active: activeItems,
          featured: featuredItems,
          categories: categoryStats,
          mediaTypes: mediaTypeStats
        }
      });
    } catch (error) {
      console.error('Error in getStats:', error);
      res.status(500).json({
        success: false,
        message: 'שגיאה בטעינת הסטטיסטיקות',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
}

module.exports = new GalleryController();
