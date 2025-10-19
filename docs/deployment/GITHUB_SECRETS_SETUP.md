# 🔐 הגדרת GitHub Secrets - מדריך מהיר

## 🎯 מה זה GitHub Secrets?
משתני סביבה מוצפנים שמאפשרים ל-GitHub Actions להתחבר לשרת שלך בצורה מאובטחת.

---

## 📋 רשימת Secrets נדרשים

### ✅ חובה (בסיסי):
```
SERVER_HOST = 123.456.789.123        # IP של השרת
SERVER_USER = root                   # משתמש SSH
SERVER_PASSWORD = your_vps_password  # סיסמת VPS
```

### ✅ מומלץ (מתקדם):
```
DB_PASSWORD = secure_db_password_123
JWT_SECRET = super-secret-jwt-key-for-production
DOMAIN_NAME = trachtenberg-events.com
SERVER_PORT = 22
```

---

## 🔧 הגדרה צעד אחרי צעד

### שלב 1: כניסה לGitHub Repository
1. **לך לrepository שלך** בGitHub
2. **לחץ על "Settings"** (בתפריט העליון)
3. **בתפריט השמאלי** לחץ **"Secrets and variables"**
4. **לחץ על "Actions"**

### שלב 2: הוספת Secrets
לכל secret:
1. **לחץ "New repository secret"**
2. **הזן Name** (בדיוק כמו ברשימה למעלה)
3. **הזן Value** (הערך האמיתי)
4. **לחץ "Add secret"**

---

## 📝 הגדרת Secrets - דוגמאות

### 1. SERVER_HOST
```
Name: SERVER_HOST
Value: 123.456.789.123
```
*איפה למצוא:* בpanel של הוסטינגר → VPS → IP Address

### 2. SERVER_USER  
```
Name: SERVER_USER
Value: root
```
*הערה:* תמיד root ב-VPS של הוסטינגר

### 3. SERVER_PASSWORD
```
Name: SERVER_PASSWORD
Value: Xy9#mK$2pL8@
```
*איפה למצוא:* במייל שקיבלת מהוסטינגר או בpanel

### 4. DB_PASSWORD
```
Name: DB_PASSWORD  
Value: secure_db_password_123
```
*הערה:* הסיסמה שהגדרת לPostgreSQL

### 5. JWT_SECRET
```
Name: JWT_SECRET
Value: trachtenberg-events-super-secret-jwt-key-production-2025
```
*הערה:* מחרוזת ארוכה ואקראית לאבטחה

### 6. DOMAIN_NAME (אופציונלי)
```
Name: DOMAIN_NAME
Value: trachtenberg-events.com
```
*הערה:* רק אם יש דומיין מותאם אישית

---

## 🔍 איך למצוא את פרטי השרת

### בpanel הוסטינגר:
1. **התחבר להוסטינגר**
2. **לך ל-VPS** בתפריט
3. **בחר את השרת שלך**
4. **פרטי החיבור**:
   - **IP Address**: זה ה-SERVER_HOST
   - **Root Password**: זה ה-SERVER_PASSWORD
   - **SSH Port**: בדרך כלל 22

### במייל מהוסטינגר:
תקבל מייל עם הכותרת: "VPS Details"
```
IP: 123.456.789.123
Username: root  
Password: Xy9#mK$2pL8@
```

---

## 🧪 בדיקת הגדרה

### שלב 1: בדוק Secrets
1. **לך ל-Actions** בrepository
2. **לחץ על workflow האחרון**
3. **בדוק שאין שגיאות** של missing secrets

### שלב 2: בדיקה ידנית
```bash
# במחשב המקומי - בדוק חיבור SSH
ssh root@YOUR_SERVER_IP

# אם עובד - הSecrets נכונים
```

### שלב 3: הפעלת GitHub Action
1. **עשה שינוי קטן** בקוד
2. **Commit & Push**:
```bash
git add .
git commit -m "Test deployment"
git push origin main
```
3. **בדוק בActions tab** שהפריסה עובדת

---

## ⚠️ אבטחה חשובה

### 🔒 אל תשתף Secrets!
- ❌ **לא בקוד**
- ❌ **לא בהודעות**  
- ❌ **לא בscreenshots**
- ✅ **רק בGitHub Secrets**

### 🔄 שינוי Secrets
אם צריך לשנות:
1. **שנה בשרת** (סיסמאות וכו')
2. **עדכן בGitHub Secrets**
3. **הפעל deployment מחדש**

---

## 🎯 דוגמה מלאה

### הגדרה מלאה לפרויקט שלנו:
```
GitHub Repository: your-username/trachtenberg-events

Secrets:
├── SERVER_HOST: 123.456.789.123
├── SERVER_USER: root  
├── SERVER_PASSWORD: Xy9#mK$2pL8@
├── DB_PASSWORD: secure_db_password_123
├── JWT_SECRET: trachtenberg-events-jwt-secret-production-2025
└── DOMAIN_NAME: trachtenberg-events.com (אופציונלי)
```

### תוצאה:
```bash
# כל push לmain branch יפעיל:
git push origin main

# GitHub Actions יעשה:
1. Build Frontend ✅
2. Install Backend ✅  
3. Deploy לשרת ✅
4. Restart services ✅
5. Health check ✅
```

---

## 🎉 סיכום

**אחרי ההגדרה הזו:**
- ✅ **Push = Deploy** אוטומטי
- ✅ **אבטחה מקסימלית** עם Secrets
- ✅ **מעקב מלא** בGitHub Actions
- ✅ **גיבויים אוטומטיים** לפני כל עדכון
- ✅ **בדיקות תקינות** אחרי כל פריסה

**הפריסה שלך עכשיו מקצועית ואוטומטית!** 🚀

---

*מדריך נוצר עבור עמנואל טרכטנברג - הפקת אירועים*
*אבטחה ופריסה מקצועית עם GitHub Actions*

