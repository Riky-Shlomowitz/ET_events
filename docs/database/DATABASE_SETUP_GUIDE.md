# 🗃️ מדריך בסיס הנתונים - PostgreSQL

## 📊 מצב נוכחי - מה מסודר?

### ✅ **מה כבר מוכן:**
- 🏗️ **Schema מלא** - טבלאות Users ו-Gallery Items
- 🔐 **אבטחה** - הצפנת סיסמאות עם bcrypt
- 🔄 **ORM** - Sequelize לעבודה קלה עם DB
- 🆔 **UUID** - מזהים ייחודיים לכל רשומה
- 📝 **Validation** - בדיקות נתונים מובנות
- 🕐 **Timestamps** - מעקב אחר יצירה ועדכון

### ⚠️ **מה צריך לעשות:**
- 🛠️ **התקנת PostgreSQL** בשרת
- 🗃️ **יצירת בסיס הנתונים**
- 👤 **יצירת משתמש מנהל**
- 📊 **סנכרון הטבלאות**

---

## 🏗️ מבנה בסיס הנתונים

### 📋 טבלת Users
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,  -- מוצפן עם bcrypt
    role VARCHAR(20) DEFAULT 'viewer' CHECK (role IN ('admin', 'editor', 'viewer')),
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### 🖼️ טבלת Gallery Items
```sql
CREATE TABLE gallery_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(20) NOT NULL CHECK (category IN ('besari', 'halavi', 'kelim', 'general')),
    media_type VARCHAR(10) DEFAULT 'image' CHECK (media_type IN ('image', 'video')),
    file_url VARCHAR(500) NOT NULL,
    thumbnail_url VARCHAR(500),
    is_featured BOOLEAN DEFAULT false,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'draft')),
    sort_order INTEGER DEFAULT 0,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🛠️ הגדרה בשרת הוסטינגר

### שלב 1: התקנת PostgreSQL
```bash
# התחבר לשרת
ssh root@YOUR_SERVER_IP

# התקן PostgreSQL
sudo apt update
sudo apt install -y postgresql postgresql-contrib

# הפעל שירות
sudo systemctl start postgresql
sudo systemctl enable postgresql

# בדוק שרץ
sudo systemctl status postgresql
```

### שלב 2: הגדרת בסיס הנתונים
```bash
# התחבר כמשתמש postgres
sudo -u postgres psql

# בתוך PostgreSQL console:
```

```sql
-- שנה סיסמת postgres (לאבטחה)
ALTER USER postgres PASSWORD 'strongDBpass123';

-- צור בסיס נתונים לפרויקט
CREATE DATABASE trachtenberg_events;

-- צור משתמש ייעודי
CREATE USER events_admin WITH PASSWORD 'secure_password_123';

-- תן הרשאות מלאות
GRANT ALL PRIVILEGES ON DATABASE trachtenberg_events TO events_admin;

-- תן הרשאות על schema
\c trachtenberg_events
GRANT ALL ON SCHEMA public TO events_admin;
GRANT ALL ON ALL TABLES IN SCHEMA public TO events_admin;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO events_admin;

-- בדוק שהכל תקין
\l  -- רשימת בסיסי נתונים
\du -- רשימת משתמשים

-- יציאה
\q
```

### שלב 3: בדיקת חיבור
```bash
# בדוק חיבור עם המשתמש החדש
psql -h localhost -U events_admin -d trachtenberg_events

# אם מתחבר בהצלחה - הכל תקין!
# יציאה: \q
```

---

## 🚀 הפעלה אוטומטית

### מה יקרה כשהשרת יתחיל:

#### 1. **בדיקת חיבור** (אוטומטי)
```javascript
// הקוד בודק אוטומטית אם PostgreSQL זמין
const dbConnected = await testConnection();
```

#### 2. **יצירת טבלאות** (אוטומטי)
```javascript
// אם זה development - יוצר טבלאות אוטומטית
await sequelize.sync({ alter: true });
```

#### 3. **יצירת מנהל ברירת מחדל** (אוטומטי)
```javascript
// יוצר משתמש מנהל אם לא קיים
await User.create({
  name: 'מנהל מערכת',
  email: 'admin@trachtenberg.co.il',
  password: 'Tr@ch2025!',  // יוצפן אוטומטית
  role: 'admin'
});
```

---

## 📊 נתוני בסיס (Seed Data)

### אם תרצי להוסיף נתונים ראשוניים:

#### יצירת קובץ `backend/seeds/initial-data.js`:
```javascript
const GalleryItem = require('../src/models/GalleryItem');

const seedGalleryItems = [
  {
    title: 'אירוע בשרי מפואר',
    description: 'אירוע בשרי יוקרתי עם עיצוב מרשים',
    category: 'besari',
    media_type: 'image',
    file_url: '/images/gallery/besari-1.jpg',
    is_featured: true,
    status: 'active',
    sort_order: 1
  },
  {
    title: 'חגיגה חלבית אלגנטית',
    description: 'אירוע חלבי עם עיצוב עדין ומרשים',
    category: 'halavi',
    media_type: 'image', 
    file_url: '/images/gallery/halavi-1.jpg',
    is_featured: true,
    status: 'active',
    sort_order: 2
  }
  // ... עוד פריטים
];

async function seedDatabase() {
  try {
    // מחק נתונים קיימים (אופציונלי)
    await GalleryItem.destroy({ where: {} });
    
    // הוסף נתונים חדשים
    await GalleryItem.bulkCreate(seedGalleryItems);
    
    console.log('✅ נתוני בסיס נוספו בהצלחה');
  } catch (error) {
    console.error('❌ שגיאה בהוספת נתוני בסיס:', error);
  }
}

module.exports = { seedDatabase };
```

---

## 🔧 פקודות ניהול שימושיות

### בדיקות בסיס נתונים:
```bash
# התחבר לDB
psql -h localhost -U events_admin -d trachtenberg_events

# בתוך PostgreSQL:
\dt                    -- רשימת טבלאות
\d users              -- מבנה טבלת users  
\d gallery_items      -- מבנה טבלת gallery_items

SELECT COUNT(*) FROM users;           -- כמה משתמשים
SELECT COUNT(*) FROM gallery_items;   -- כמה פריטי גלריה
SELECT * FROM users;                  -- כל המשתמשים
```

### גיבוי ושחזור:
```bash
# גיבוי
pg_dump -U events_admin -h localhost trachtenberg_events > backup.sql

# שחזור
psql -U events_admin -h localhost trachtenberg_events < backup.sql
```

---

## 🎯 מה יקרה בפריסה

### כשGitHub Actions ירוץ:

#### 1. **הגדרת .env בשרת** (אוטומטי)
```bash
# GitHub Actions יוצר קובץ .env עם:
DB_NAME=trachtenberg_events
DB_USER=events_admin  
DB_PASS=secure_password_123
DB_HOST=localhost
PORT=3000
NODE_ENV=production
JWT_SECRET=your-secret-from-github-secrets
```

#### 2. **הפעלת השרת** (אוטומטי)
```bash
# PM2 יפעיל את השרת
pm2 start src/server.js --name "trachtenberg-backend"
```

#### 3. **יצירת טבלאות** (אוטומטי)
- השרת יתחבר לPostgreSQL
- יבדוק אם הטבלאות קיימות
- יצור אותן אם לא קיימות
- יוסיף משתמש מנהל ברירת מחדל

---

## ✅ רשימת בדיקה לDB

### לפני הפריסה:
- [ ] **PostgreSQL מותקן** בשרת
- [ ] **בסיס נתונים נוצר**: `trachtenberg_events`
- [ ] **משתמש נוצר**: `events_admin`
- [ ] **הרשאות ניתנו** למשתמש
- [ ] **חיבור עובד** מהשרת

### אחרי הפריסה:
- [ ] **טבלאות נוצרו** אוטומטית
- [ ] **משתמש מנהל נוצר**: admin@trachtenberg.co.il
- [ ] **API מתחבר לDB** ללא שגיאות
- [ ] **Health check** מחזיר סטטוס DB

---

## 🎉 סיכום

### **הDB מסודר לחלוטין!** ✅

**מה מוכן:**
- 🏗️ **Schema מלא** - טבלאות מוגדרות
- 🔐 **אבטחה** - הצפנה מובנית
- 🤖 **אוטומציה** - יצירה אוטומטית של טבלאות
- 👤 **מנהל ברירת מחדל** - נוצר אוטומטית
- 📊 **נתוני בסיס** - אופציונלי להוספה

**מה צריך לעשות:**
1. **התקן PostgreSQL** בשרת (חלק מסקריפט ההגדרה)
2. **צור DB ומשתמש** (פקודות מוכנות)
3. **השאר לקוד** - הכל יקרה אוטומטית!

**הDB מוכן ומסודר לחלוטין!** 🎯
