# 🛠️ הגדרת Backend - מדריך מלא

## 📋 דרישות מערכת

### 1. PostgreSQL
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install postgresql postgresql-contrib

# macOS
brew install postgresql

# Windows
# הורד מ: https://www.postgresql.org/download/windows/
```

### 2. Node.js 18+
```bash
# בדוק גרסה
node --version
npm --version
```

---

## 🗃️ הגדרת בסיס הנתונים

### 1. התחבר ל-PostgreSQL
```bash
sudo -u postgres psql
```

### 2. צור בסיס נתונים ומשתמש
```sql
-- צור בסיס נתונים
CREATE DATABASE trachtenberg_events;

-- צור משתמש
CREATE USER events_admin WITH PASSWORD 'secure_password_123';

-- תן הרשאות
GRANT ALL PRIVILEGES ON DATABASE trachtenberg_events TO events_admin;

-- יציאה
\q
```

### 3. בדוק חיבור
```bash
psql -h localhost -U events_admin -d trachtenberg_events
```

---

## ⚙️ הגדרת הפרויקט

### 1. צור קובץ .env
```bash
# העתק את הדוגמה
cp .env.example .env

# ערוך את הקובץ
nano .env
```

### 2. עדכן את הגדרות בסיס הנתונים
```bash
# Database Configuration
DB_NAME=trachtenberg_events
DB_USER=events_admin
DB_PASS=secure_password_123
DB_HOST=localhost
DB_PORT=5432

# Server Configuration
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# JWT Configuration  
JWT_SECRET=your-super-secret-jwt-key-here-change-in-production
JWT_EXPIRE=7d
```

### 3. התקן dependencies
```bash
npm install
```

---

## 🚀 הפעלת השרת

### פיתוח (Development)
```bash
npm run dev
```

### ייצור (Production)
```bash
npm start
```

---

## 🧪 בדיקת השרת

### 1. Health Check
```bash
curl http://localhost:3000/api/health
```

### 2. API Documentation
```bash
curl http://localhost:3000/api
```

### 3. התחברות מנהל
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@trachtenberg.co.il",
    "password": "Tr@ch2025!"
  }'
```

---

## 📊 API Endpoints

### Authentication
- `POST /api/auth/login` - התחברות
- `GET /api/auth/me` - פרופיל משתמש
- `POST /api/auth/logout` - התנתקות
- `POST /api/auth/change-password` - שינוי סיסמה

### Gallery
- `GET /api/gallery` - כל הפריטים
- `GET /api/gallery/:id` - פריט ספציפי
- `POST /api/gallery` - יצירת פריט (מנהל)
- `PUT /api/gallery/:id` - עדכון פריט (מנהל)
- `DELETE /api/gallery/:id` - מחיקת פריט (מנהל)
- `GET /api/gallery/stats` - סטטיסטיקות

### System
- `GET /api/health` - בדיקת תקינות
- `GET /api` - תיעוד API

---

## 🔧 פתרון בעיות

### שגיאת חיבור לבסיס נתונים
```bash
# בדוק שהשירות רץ
sudo systemctl status postgresql

# הפעל את השירות
sudo systemctl start postgresql

# בדוק חיבור
psql -h localhost -U events_admin -d trachtenberg_events
```

### שגיאת הרשאות
```sql
-- תן הרשאות נוספות
GRANT ALL ON ALL TABLES IN SCHEMA public TO events_admin;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO events_admin;
```

### Port כבר בשימוש
```bash
# מצא תהליך שתופס את הפורט
lsof -i :3000

# הרוג את התהליך
kill -9 <PID>
```

---

## 🎯 מוכן לשימוש!

השרת יתחיל על: http://localhost:3000
API Documentation: http://localhost:3000/api

**פרטי כניסה למנהל:**
- מייל: admin@trachtenberg.co.il
- סיסמה: Tr@ch2025!

