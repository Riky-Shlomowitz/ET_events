const jwt = require('jsonwebtoken');
const User = require('../models/User');
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

class AuthController {
  // POST /api/auth/login
  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'נדרש מייל וסיסמה'
        });
      }

      // Check DB connection first
      const dbConnected = await isDatabaseConnected();
      if (!dbConnected) {
        // Return error when DB not connected for login
        return res.status(503).json({
          success: false,
          message: 'שירות בסיס הנתונים לא זמין'
        });
      }

      // Find user by email
      const user = await User.findOne({ where: { email } });

      if (!user || !user.is_active) {
        return res.status(401).json({
          success: false,
          message: 'פרטי התחברות שגויים'
        });
      }

      // Check password
      const isValidPassword = await user.validatePassword(password);

      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          message: 'פרטי התחברות שגויים'
        });
      }

      // Update last login
      await user.update({ last_login: new Date() });

      // Generate JWT token
      const token = jwt.sign(
        { 
          id: user.id, 
          email: user.email, 
          role: user.role 
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE || '7d' }
      );

      res.json({
        success: true,
        message: 'התחברות בוצעה בהצלחה',
        data: {
          user: user.toJSON(),
          token
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        message: 'שגיאה בהתחברות',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // GET /api/auth/me
  async getProfile(req, res) {
    try {
      res.json({
        success: true,
        data: {
          user: req.user.toJSON()
        }
      });
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({
        success: false,
        message: 'שגיאה בטעינת פרופיל',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // POST /api/auth/logout
  async logout(req, res) {
    try {
      // In a more advanced implementation, you might want to blacklist the token
      res.json({
        success: true,
        message: 'התנתקות בוצעה בהצלחה'
      });
    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({
        success: false,
        message: 'שגיאה בהתנתקות',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // POST /api/auth/change-password
  async changePassword(req, res) {
    try {
      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          success: false,
          message: 'נדרשת סיסמה נוכחית וסיסמה חדשה'
        });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'סיסמה חדשה חייבת להכיל לפחות 6 תווים'
        });
      }

      // Verify current password
      const isValidPassword = await req.user.validatePassword(currentPassword);

      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          message: 'סיסמה נוכחית שגויה'
        });
      }

      // Update password
      await req.user.update({ password: newPassword });

      res.json({
        success: true,
        message: 'סיסמה שונתה בהצלחה'
      });
    } catch (error) {
      console.error('Change password error:', error);
      res.status(500).json({
        success: false,
        message: 'שגיאה בשינוי סיסמה',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
}

module.exports = new AuthController();

