# 📚 תיעוד - עמנואל טרכטנברג הפקת אירועים

## 🗂️ מבנה התיעוד

### **📁 deployment/** - מדריכי פריסה
- **HOSTINGER_DEPLOYMENT_GUIDE.md** - מדריך מפורט לפריסה ב-Hostinger VPS
- **GITHUB_SECRETS_SETUP.md** - הגדרת GitHub Secrets לפריסה אוטומטית
- **server-setup.sh** - סקריפט התקנה אוטומטי לשרת

### **📁 database/** - מדריכי בסיס נתונים
- **BACKEND_ARCHITECTURE.md** - ארכיטקטורת הBackend
- **DATABASE_REAL_SETUP.md** - הגדרת PostgreSQL אמיתי

### **📁 development/** - מדריכי פיתוח
- **FULLSTACK_SUMMARY.md** - סיכום המערכת המלאה
- **MANUAL_GITHUB_UPLOAD.md** - העלאה ידנית ל-GitHub

---

## 🚀 מדריכי פריסה

### **Hostinger VPS** (מומלץ - $3.99/חודש)

#### **למה Hostinger?**
- ✅ **זול ביותר** - $3.99/חודש
- ✅ **שליטה מלאה** - שרת שלך
- ✅ **פריסה אוטומטית** דרך GitHub Actions
- ✅ **200 תמונות** בקלות
- ✅ **לא נרדם** - תמיד זמין

#### **צעדים:**
1. **רכוש VPS 1** ב-Hostinger
2. **עקוב אחר המדריך**: [HOSTINGER_DEPLOYMENT_GUIDE.md](deployment/HOSTINGER_DEPLOYMENT_GUIDE.md)
3. **הגדר GitHub Actions**: [GITHUB_SECRETS_SETUP.md](deployment/GITHUB_SECRETS_SETUP.md)
4. **האתר יהיה זמין!**

### **Railway** ($20/חודש)

#### **למה Railway?**
- ✅ **פריסה בקליק** - ללא תחזוקה
- ✅ **ניהול אוטומטי** - Railway מטפל בהכל
- ⚠️ **יקר יותר** - $20/חודש
- ⚠️ **עלול לירדם** בHobby Plan

#### **צעדים:**
1. **היכנס ל-Railway.app**
2. **חבר את GitHub Repository**
3. **הוסף PostgreSQL**
4. **הגדר Environment Variables**
5. **האתר יהיה זמין!**

📖 **מדריך מלא**: ראה ב-README הראשי

---

## 🗄️ בסיס נתונים

### **PostgreSQL Setup**

#### **למה PostgreSQL?**
- 🐘 **אמין ומקצועי**
- 📊 **מושלם ל-Node.js**
- 🔒 **בטוח**
- 🆓 **חינמי**

#### **מה זה כולל:**
- **טבלת Users** - משתמשי מערכת (מנהלים)
- **טבלת GalleryItems** - פריטי גלריה
- **JWT Authentication** - אבטחה
- **Sequelize ORM** - ניהול DB קל

📖 **מדריך מלא**: [DATABASE_REAL_SETUP.md](database/DATABASE_REAL_SETUP.md)

---

## 💻 פיתוח מקומי

### **התקנה:**
```bash
# Clone
git clone https://github.com/Riky-Shlomowitz/ET_events.git
cd ET_events

# Frontend
npm install
npm run dev

# Backend (בטרמינל נפרד)
cd backend
npm install
npm run dev
```

### **הגדרת DB מקומי:**
```bash
# התקן PostgreSQL
# צור DB
createdb trachtenberg_events

# הגדר .env
cp backend/.env.example backend/.env
# ערוך את הפרטים
```

📖 **מדריך מלא**: [FULLSTACK_SUMMARY.md](development/FULLSTACK_SUMMARY.md)

---

## 🔧 כלים ושירותים

### **Frontend:**
- ⚛️ React 18
- ⚡ Vite
- 🎨 Tailwind CSS + Shadcn/ui

### **Backend:**
- 🟢 Node.js 18
- 🚂 Express 5
- 🐘 PostgreSQL
- 🔐 JWT

### **DevOps:**
- 🔄 GitHub Actions
- 🖥️ Hostinger VPS
- 🚂 Railway (אלטרנטיבה)

---

## 📞 תמיכה

יש שאלות? בעיות?
- 📖 בדוק את המדריכים המפורטים
- 🔍 חפש בקוד
- 📧 פנה למפתח

---

**תיעוד מעודכן: אוקטובר 2024**