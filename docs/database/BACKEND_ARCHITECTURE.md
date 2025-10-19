# 🖥️ ארכיטקטורת Backend - Node.js + Express

## 🎯 המטרה: Backend מלא עם בסיס נתונים על השרת

### 📊 ארכיטקטורה מוצעת:

```
┌─────────────────────────────────────┐
│            🌐 FRONTEND              │
│                                     │
│        React App (SPA)              │
│        Port: 5173 (dev)             │
│                                     │
└─────────────┬───────────────────────┘
              │ REST API Calls
              │ (JSON)
              ▼
┌─────────────────────────────────────┐
│         🖥️ BACKEND SERVER           │
│                                     │
│    Node.js + Express.js             │
│    Port: 3000 (API)                 │
│                                     │
│  ┌─────────────────────────────────┐│
│  │        📁 DATABASE              ││
│  │                                 ││
│  │  🐘 PostgreSQL (מומלץ ביותר)    ││
│  │  🗃️ SQLite (פשוט לפיתוח)       ││
│  │  🐬 MySQL/MariaDB (פופולרי)     ││
│  │                                 ││
│  └─────────────────────────────────┘│
└─────────────────────────────────────┘
```

---

## 🗃️ אפשרויות בסיס נתונים על השרת

### 🥇 **PostgreSQL (הכי מומלץ)**

#### למה PostgreSQL?
- ✅ **חינמי וקוד פתוח**
- ✅ **מהיר וחזק** - עד מיליוני רשומות
- ✅ **תמיכה ב-JSON** - גמיש כמו MongoDB
- ✅ **ACID compliance** - אמינות מקסימלית
- ✅ **תמיכה מצוינת** בכל הפלטפורמות
- ✅ **קהילה ענקית** - הרבה תיעוד

#### התקנה:
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install postgresql postgresql-contrib

# CentOS/RHEL
sudo yum install postgresql-server postgresql-contrib

# macOS
brew install postgresql

# Windows
# הורד מ: https://www.postgresql.org/download/windows/
```

#### הגדרה בסיסית:
```sql
-- יצירת בסיס נתונים
CREATE DATABASE trachtenberg_events;

-- יצירת משתמש
CREATE USER events_admin WITH PASSWORD 'secure_password_123';
GRANT ALL PRIVILEGES ON DATABASE trachtenberg_events TO events_admin;
```

### 🥈 **SQLite (הכי פשוט לפיתוח)**

#### למה SQLite?
- ✅ **אפס הגדרה** - קובץ אחד
- ✅ **מהיר מאוד** לפרויקטים קטנים
- ✅ **אין צורך בשרת** נפרד
- ✅ **מושלם לפיתוח** ובדיקות
- ⚠️ **מוגבל לפרויקט אחד** (לא concurrent)

#### שימוש:
```bash
npm install sqlite3
# הכל נשמר בקובץ: database.sqlite
```

### 🥉 **MySQL/MariaDB (פופולרי)**

#### למה MySQL?
- ✅ **נפוץ מאוד** - הרבה hosting providers
- ✅ **ביצועים טובים**
- ✅ **תיעוד מצוין**
- ✅ **MariaDB** - גרסה משופרת וחינמית

#### התקנה:
```bash
# Ubuntu/Debian
sudo apt install mysql-server

# או MariaDB (מומלץ יותר)
sudo apt install mariadb-server
```

---

## 🏗️ מבנה הפרויקט המוצע

```
trachtenberg-events/
├── frontend/                 # React App (הקוד הנוכחי)
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/                  # Node.js API Server
│   ├── src/
│   │   ├── controllers/      # Logic של API
│   │   ├── models/          # מודלים של DB
│   │   ├── routes/          # API endpoints
│   │   ├── middleware/      # Authentication, etc.
│   │   ├── config/          # הגדרות DB
│   │   └── server.js        # Entry point
│   ├── migrations/          # DB schema changes
│   ├── seeds/              # נתוני בסיס
│   └── package.json
│
├── shared/                  # קוד משותף
│   └── types/              # TypeScript definitions
│
└── docker-compose.yml      # לפיתוח מקומי
```

---

## 🛠️ יישום Backend - Node.js + Express + PostgreSQL

### 📦 **שלב 1: הגדרת הפרויקט**

```bash
# צור תיקיית backend
mkdir backend
cd backend

# אתחל npm project
npm init -y

# התקן dependencies
npm install express cors helmet morgan dotenv
npm install pg pg-hstore sequelize  # PostgreSQL + ORM
npm install bcryptjs jsonwebtoken    # Authentication
npm install multer cloudinary       # File uploads

# Dev dependencies
npm install --save-dev nodemon concurrently
```

### 🗃️ **שלב 2: הגדרת בסיס הנתונים**

#### `backend/src/config/database.js`
```javascript
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME || 'trachtenberg_events',
  process.env.DB_USER || 'events_admin', 
  process.env.DB_PASS || 'secure_password_123',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

module.exports = sequelize;
```

### 📋 **שלב 3: מודלים**

#### `backend/src/models/GalleryItem.js`
```javascript
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const GalleryItem = sequelize.define('GalleryItem', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [1, 255]
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  category: {
    type: DataTypes.ENUM('besari', 'halavi', 'kelim', 'general'),
    allowNull: false,
    defaultValue: 'general'
  },
  media_type: {
    type: DataTypes.ENUM('image', 'video'),
    allowNull: false,
    defaultValue: 'image'
  },
  file_url: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isUrl: true
    }
  },
  thumbnail_url: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isUrl: true
    }
  },
  is_featured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive', 'draft'),
    defaultValue: 'active'
  },
  sort_order: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  metadata: {
    type: DataTypes.JSONB, // PostgreSQL JSON field
    defaultValue: {}
  }
}, {
  tableName: 'gallery_items',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = GalleryItem;
```

#### `backend/src/models/User.js`
```javascript
const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [6, 255]
    }
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('admin', 'editor', 'viewer'),
    defaultValue: 'viewer'
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  last_login: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'users',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        user.password = await bcrypt.hash(user.password, 12);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        user.password = await bcrypt.hash(user.password, 12);
      }
    }
  }
});

// Instance methods
User.prototype.validatePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = User;
```

### 🛣️ **שלב 4: Controllers**

#### `backend/src/controllers/galleryController.js`
```javascript
const GalleryItem = require('../models/GalleryItem');
const { Op } = require('sequelize');

class GalleryController {
  // GET /api/gallery
  async getAll(req, res) {
    try {
      const { category, status = 'active', page = 1, limit = 50, sort = '-created_at' } = req.query;
      
      const where = {};
      if (category && category !== 'all') {
        where.category = category;
      }
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
      res.status(500).json({
        success: false,
        message: 'שגיאה בטעינת פריטי הגלריה',
        error: error.message
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
      res.status(500).json({
        success: false,
        message: 'שגיאה בטעינת הפריט',
        error: error.message
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
      res.status(400).json({
        success: false,
        message: 'שגיאה ביצירת הפריט',
        error: error.message
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
      res.status(400).json({
        success: false,
        message: 'שגיאה בעדכון הפריט',
        error: error.message
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
      res.status(500).json({
        success: false,
        message: 'שגיאה במחיקת הפריט',
        error: error.message
      });
    }
  }

  // GET /api/gallery/stats
  async getStats(req, res) {
    try {
      const totalItems = await GalleryItem.count();
      const activeItems = await GalleryItem.count({ where: { status: 'active' } });
      const featuredItems = await GalleryItem.count({ where: { is_featured: true } });
      
      const categoryStats = await GalleryItem.findAll({
        attributes: [
          'category',
          [sequelize.fn('COUNT', sequelize.col('id')), 'count']
        ],
        group: ['category']
      });

      const mediaTypeStats = await GalleryItem.findAll({
        attributes: [
          'media_type',
          [sequelize.fn('COUNT', sequelize.col('id')), 'count']
        ],
        group: ['media_type']
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
      res.status(500).json({
        success: false,
        message: 'שגיאה בטעינת הסטטיסטיקות',
        error: error.message
      });
    }
  }
}

module.exports = new GalleryController();
```

### 🛣️ **שלב 5: Routes**

#### `backend/src/routes/gallery.js`
```javascript
const express = require('express');
const galleryController = require('../controllers/galleryController');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

const router = express.Router();

// Public routes
router.get('/', galleryController.getAll);
router.get('/stats', galleryController.getStats);
router.get('/:id', galleryController.getById);

// Protected routes (admin only)
router.post('/', auth, adminAuth, galleryController.create);
router.put('/:id', auth, adminAuth, galleryController.update);
router.delete('/:id', auth, adminAuth, galleryController.delete);

module.exports = router;
```

### 🚀 **שלב 6: Server מרכזי**

#### `backend/src/server.js`
```javascript
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const sequelize = require('./config/database');
const galleryRoutes = require('./routes/gallery');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/gallery', galleryRoutes);
app.use('/api/auth', authRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'שגיאת שרת פנימית',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'נתיב לא נמצא'
  });
});

// Database connection and server startup
async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('✅ התחברות לבסיס הנתונים הצליחה');
    
    // Sync database (development only)
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true });
      console.log('🔄 סנכרון בסיס הנתונים הושלם');
    }

    app.listen(PORT, () => {
      console.log(`🚀 השרת רץ על פורט ${PORT}`);
      console.log(`🌐 API זמין ב: http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('❌ שגיאה בהפעלת השרת:', error);
    process.exit(1);
  }
}

startServer();
```

---

## 🔧 הגדרת הפיתוח

### `.env` file:
```bash
# Database
DB_NAME=trachtenberg_events
DB_USER=events_admin
DB_PASS=secure_password_123
DB_HOST=localhost
DB_PORT=5432

# Server
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# JWT
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=7d

# Cloudinary (for file uploads)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### `package.json` scripts:
```json
{
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js",
    "migrate": "npx sequelize-cli db:migrate",
    "seed": "npx sequelize-cli db:seed:all",
    "test": "jest"
  }
}
```

---

## 🚀 הפעלת הפרויקט

### Backend:
```bash
cd backend
npm install
npm run dev  # Development server
```

### Frontend (עדכון):
```bash
cd frontend
# עדכן את src/lib/localData.js להשתמש ב-API
npm run dev
```

---

## 📊 יתרונות הפתרון:

✅ **PostgreSQL** - בסיס נתונים מקצועי ומהיר
✅ **Sequelize ORM** - קל לעבודה עם SQL
✅ **JWT Authentication** - אבטחה מקצועית
✅ **RESTful API** - תקן בתעשייה
✅ **Error Handling** - טיפול מקצועי בשגיאות
✅ **Validation** - בדיקת נתונים מקיפה
✅ **Pagination** - לביצועים טובים
✅ **Logging** - מעקב אחר פעילות

**האם תרצה שאתחיל ליישם את הפתרון הזה?** 🎯

