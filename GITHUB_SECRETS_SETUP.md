# 🔐 הגדרת GitHub Secrets ל-Hostinger VPS

## 📋 מה זה GitHub Secrets?

GitHub Secrets הם משתנים מוצפנים שמאפשרים ל-GitHub Actions לגשת לשרת שלך בבטחה.

## 🔧 שלב 1: יצירת SSH Key

### **על השרת Hostinger:**

```bash
# התחבר לשרת
ssh root@YOUR_HOSTINGER_IP

# צור SSH key
ssh-keygen -t rsa -b 4096 -C "github-deploy"
# לחץ Enter לכל השאלות (ברירת מחדל)

# העתק את המפתח הציבורי
cat ~/.ssh/id_rsa.pub

# העתק את המפתח הפרטי
cat ~/.ssh/id_rsa
```

### **העתק את המפתח הפרטי** - תצטרך אותו ל-GitHub Secrets!

---

## 🔑 שלב 2: הגדרת GitHub Secrets

### **1. לך ל-GitHub Repository:**
- `https://github.com/Riky-Shlomowitz/ET_events`
- לחץ על **Settings** (בתפריט העליון)
- לחץ על **Secrets and variables** → **Actions**

### **2. הוסף את ה-Secrets הבאים:**

#### **HOSTINGER_HOST**
- **Name**: `HOSTINGER_HOST`
- **Value**: `YOUR_HOSTINGER_IP` (למשל: `123.456.789.012`)

#### **HOSTINGER_USER**
- **Name**: `HOSTINGER_USER`
- **Value**: `root`

#### **HOSTINGER_SSH_KEY**
- **Name**: `HOSTINGER_SSH_KEY`
- **Value**: `-----BEGIN OPENSSH PRIVATE KEY-----
YOUR_PRIVATE_KEY_CONTENT_HERE
-----END OPENSSH PRIVATE KEY-----`

#### **HOSTINGER_PORT** (אופציונלי)
- **Name**: `HOSTINGER_PORT`
- **Value**: `22`

#### **DOMAIN_NAME** (אופציונלי)
- **Name**: `DOMAIN_NAME`
- **Value**: `your-domain.com`

#### **DB_PASSWORD** (אופציונלי)
- **Name**: `DB_PASSWORD`
- **Value**: `Tr@ch2025!`

#### **JWT_SECRET** (אופציונלי)
- **Name**: `JWT_SECRET`
- **Value**: `Tr@ch2025_Super_Secret_Key_2025`

---

## 🚀 שלב 3: הפעלת הפריסה

### **1. העלה את השינויים ל-GitHub:**
```bash
git add .
git commit -m "Add GitHub Actions for Hostinger deployment"
git push origin main
```

### **2. בדוק את הפריסה:**
- לך ל-GitHub Repository
- לחץ על **Actions** (בתפריט העליון)
- תראה את ה-workflow "🚀 Deploy to Hostinger VPS"
- לחץ עליו לראות את ההתקדמות

---

## ✅ מה יקרה אוטומטית:

### **כל push ל-main:**
1. **GitHub Actions** יתחיל לרוץ
2. **יבנה** את הפרונט והבקאנד
3. **יתחבר** לשרת Hostinger
4. **יעדכן** את הקוד
5. **יפעיל מחדש** את השירותים
6. **יבדוק** שהכל עובד

### **זמן פריסה:** ~3-5 דקות

---

## 🔧 פתרון בעיות:

### **בעיה: Permission denied (publickey)**
```bash
# בדוק שה-SSH key הועתק נכון
cat ~/.ssh/id_rsa

# בדוק שהמפתח הציבורי בשרת
cat ~/.ssh/authorized_keys
```

### **בעיה: Connection refused**
```bash
# בדוק שה-SSH רץ
systemctl status ssh

# בדוק את הפורט
netstat -tlnp | grep :22
```

### **בעיה: Build failed**
```bash
# בדוק את הלוגים ב-GitHub Actions
# לחץ על ה-workflow → View logs
```

---

## 🎯 תוצאה:

**עכשיו כל פעם שתעלה קוד ל-GitHub:**
- ✅ **האתר יתעדכן אוטומטית**
- ✅ **לא תצטרך להתחבר לשרת**
- ✅ **הכל יקרה ב-3-5 דקות**
- ✅ **תקבל התראה אם יש בעיה**

**זה בדיוק מה שרצית! 🎉**
