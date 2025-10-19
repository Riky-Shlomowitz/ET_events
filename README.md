# 🎉 עמנואל טרכטנברג - הפקת אירועים

## 📖 תיאור

אתר Full Stack מקצועי לניהול הפקת אירועים, כולל:
- 🌐 **Frontend**: אתר רספונסיבי עם גלריה מרשימה
- 🔐 **ממשק ניהול**: לוח בקרה מלא למנהל
- 🖥️ **Backend**: API עם Node.js + Express + PostgreSQL
- 📸 **ניהול תמונות**: העלאה, עריכה, מחיקה
- 🔒 **אבטחה**: JWT authentication

---

## 🚀 פריסה מהירה

### **אפשרות 1: Hostinger VPS (מומלץ - $3.99/חודש)**
- ✅ **זול ביותר** - $3.99/חודש
- ✅ **שליטה מלאה** - שרת שלך
- ✅ **פריסה אוטומטית** - דרך GitHub Actions
- ✅ **200 תמונות** בקלות

📖 **מדריך מלא**: [HOSTINGER_DEPLOYMENT_GUIDE.md](HOSTINGER_DEPLOYMENT_GUIDE.md)

### **אפשרות 2: Railway ($20/חודש)**
- ✅ **ניהול אוטומטי** - אפס תחזוקה
- ✅ **פריסה בקליק** - חיבור ל-GitHub
- ⚠️ **יקר יותר** - $20/חודש

📖 **מדריך מלא**: [RAILWAY_DEPLOYMENT_GUIDE.md](RAILWAY_DEPLOYMENT_GUIDE.md)

---

## 💻 הפעלה מקומית (פיתוח)

### **דרישות:**
- Node.js 18+
- npm או yarn

### **התקנה:**
```bash
# Clone הפרויקט
git clone https://github.com/Riky-Shlomowitz/ET_events.git
cd ET_events

# התקנת Frontend
npm install

# התקנת Backend
cd backend
npm install
```

### **הפעלה:**
```bash
# Frontend (בטרמינל ראשון)
npm run dev
# יפתח ב-http://localhost:5173

# Backend (בטרמינל שני)
cd backend
npm run dev
# יפתח ב-http://localhost:3000
```

---

## 📁 מבנה הפרויקט

```
ET_events/
├── src/                      # Frontend (React + Vite)
│   ├── pages/                # דפים
│   │   ├── EventPlanning.jsx # דף ראשי
│   │   ├── AdminLogin.jsx    # התחברות מנהל
│   │   └── AdminDashboard.jsx # ממשק ניהול
│   ├── components/           # קומפוננטות UI
│   └── lib/                  # ספריות עזר
│
├── backend/                  # Backend (Node.js + Express)
│   ├── src/
│   │   ├── models/           # מודלים (User, GalleryItem)
│   │   ├── controllers/      # לוגיקת עסקים
│   │   ├── routes/           # API routes
│   │   ├── middleware/       # Authentication
│   │   └── server.js         # נקודת כניסה
│   └── package.json
│
├── public/images/            # תמונות סטטיות
├── docs/                     # תיעוד מפורט
│   ├── deployment/           # מדריכי פריסה
│   ├── database/             # מדריכי DB
│   └── development/          # מדריכי פיתוח
│
├── .github/workflows/        # GitHub Actions
└── README.md                 # קובץ זה
```

---

## 🔐 ממשק ניהול

### **פרטי התחברות:**
- **URL**: `/AdminLogin`
- **אימייל**: `admin@trachtenberg.co.il`
- **סיסמה**: `Tr@ch2025!`

### **תכונות:**
- ✅ העלאת תמונות וסרטונים
- ✅ עריכת פריטים בגלריה
- ✅ מחיקת פריטים
- ✅ ניהול קטגוריות
- ✅ סטטיסטיקות

---

## 🛠️ טכנולוגיות

### **Frontend:**
- ⚛️ React 18
- ⚡ Vite
- 🎨 Tailwind CSS
- 🧩 Shadcn/ui
- 🔄 React Router DOM
- 📝 React Hook Form

### **Backend:**
- 🟢 Node.js 18
- 🚂 Express 5
- 🐘 PostgreSQL
- 🔐 JWT Authentication
- 📦 Sequelize ORM
- 📤 Multer (העלאת קבצים)

---

## 📚 תיעוד

### **מדריכי פריסה:**
- [Hostinger VPS Deployment](HOSTINGER_DEPLOYMENT_GUIDE.md)
- [Railway Deployment](RAILWAY_DEPLOYMENT_GUIDE.md)
- [GitHub Actions Setup](docs/deployment/GITHUB_SECRETS_SETUP.md)

### **מדריכי Backend:**
- [Backend Architecture](docs/database/BACKEND_ARCHITECTURE.md)
- [Database Setup](docs/database/DATABASE_REAL_SETUP.md)

### **מדריכי פיתוח:**
- [Fullstack Summary](docs/development/FULLSTACK_SUMMARY.md)
- [Manual GitHub Upload](docs/development/MANUAL_GITHUB_UPLOAD.md)

---

## 🔧 Scripts

```bash
# Frontend
npm run dev          # הרצת dev server
npm run build        # בנייה לproduction
npm run preview      # תצוגה מקדימה של build

# Backend
cd backend
npm run dev          # הרצת dev server (עם nodemon)
npm start            # הרצת production server
```

---

## 🌟 תכונות

### **למבקרים:**
- 🏠 דף בית מרשים
- 📸 גלריית תמונות וסרטונים
- 🎯 פירוט שירותים
- 📞 טופס יצירת קשר (Formspree)

### **למנהל:**
- 🔐 התחברות מאובטחת
- 📤 העלאת תמונות/סרטונים
- ✏️ עריכת פריטים
- 🗑️ מחיקת פריטים
- 📊 סטטיסטיקות

---

## 📞 יצירת קשר

- **אתר**: [לקישור לאתר]
- **אימייל**: admin@trachtenberg.co.il
- **GitHub**: [Riky-Shlomowitz/ET_events](https://github.com/Riky-Shlomowitz/ET_events)

---

## 📄 רישיון

This project is private and proprietary.

---

**בנוי עם ❤️ לעמנואל טרכטנברג הפקת אירועים**