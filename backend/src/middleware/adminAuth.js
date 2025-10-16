const adminAuth = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'משתמש לא מאומת'
      });
    }

    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'אין הרשאות מנהל - גישה נדחתה'
      });
    }

    next();
  } catch (error) {
    console.error('Admin auth middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'שגיאה בבדיקת הרשאות'
    });
  }
};

module.exports = adminAuth;
