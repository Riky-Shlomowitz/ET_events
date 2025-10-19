# 🗄️ התקנת PostgreSQL בשרת Hostinger

## 🎯 מטרה
להתקין PostgreSQL בשרת Hostinger כדי לשמור תמונות ונתונים בענן אמיתי.

---

## 📋 שלב 1: התחבר לשרת

### באמצעות SSH מ-Windows:

```bash
ssh root@72.61.144.195
```

**סיסמה**: `Rr@0533174406`

---

## ⚡ שלב 2: התקנה אוטומטית (מומלץ)

### העתק והדבק את הקוד הזה בשרת:

```bash
curl -o setup-postgresql.sh https://raw.githubusercontent.com/Riky-Shlomowitz/ET_events/main/setup-postgresql.sh
chmod +x setup-postgresql.sh
./setup-postgresql.sh
```

**זהו! הסקריפט יעשה הכל בשבילך!**

---

## 🔧 שלב 3: התקנה ידנית (אם הסקריפט לא עובד)

### 3.1 עדכן את המערכת:
```bash
apt update
apt upgrade -y
```

### 3.2 התקן PostgreSQL:
```bash
apt install postgresql postgresql-contrib -y
```

### 3.3 הפעל את השירות:
```bash
systemctl start postgresql
systemctl enable postgresql
```

### 3.4 צור משתמש ו-DB:
```bash
sudo -u postgres psql
```

**בתוך PostgreSQL הקלד:**
```sql
CREATE USER events_admin WITH PASSWORD 'Tr@ch2025!';
CREATE DATABASE trachtenberg_events OWNER events_admin;
GRANT ALL PRIVILEGES ON DATABASE trachtenberg_events TO events_admin;
\c trachtenberg_events
GRANT ALL ON SCHEMA public TO events_admin;
\q
```

### 3.5 הגדר גישה מקומית:
```bash
echo "host    all             all             127.0.0.1/32            md5" >> /etc/postgresql/*/main/pg_hba.conf
systemctl restart postgresql
```

---

## ✅ שלב 4: בדיקה

### בדוק שה-DB עובד:
```bash
sudo -u postgres psql -d trachtenberg_events -c "SELECT 'Success!' as status;"
```

**אמור להציג**: `Success!`

---

## 🔄 שלב 5: הפעל מחדש את הבקאנד

### אתר את התהליך:
```bash
pm2 list
```

### הפעל מחדש:
```bash
pm2 restart trachtenberg-backend
```

### בדוק לוגים:
```bash
pm2 logs trachtenberg-backend --lines 50
```

**אתה אמור לראות**: `✅ התחברות לבסיס הנתונים הצליחה`

---

## 🎉 שלב 6: בדוק את האתר!

פתח בדפדפן: **http://72.61.144.195**

1. **לחץ "כניסת מנהל"**
2. **התחבר**:
   - Email: `admin@trachtenberg.co.il`
   - Password: `Tr@ch2025!`
3. **לחץ "העלאת קבצים"**
4. **בחר תמונות** - הן יישמרו בשרת!

---

## 📂 איפה התמונות?

התמונות נשמרות ב:
- **שרת**: `/var/www/trachtenberg-events/uploads/`
- **URL**: `http://72.61.144.195/uploads/filename.jpg`

---

## 🔍 פתרון בעיות

### ❌ אם Login לא עובד:

```bash
# בדוק שה-backend רץ
pm2 status

# בדוק לוגים
pm2 logs trachtenberg-backend

# בדוק חיבור ל-DB
sudo -u postgres psql -d trachtenberg_events -c "\dt"
```

### ❌ אם PostgreSQL לא מתחיל:

```bash
# בדוק סטטוס
systemctl status postgresql

# הפעל מחדש
systemctl restart postgresql

# בדוק לוגים
journalctl -u postgresql -n 50
```

---

## 📞 צריך עזרה?

אם משהו לא עובד, תן לי לדעת ואני אעזור!

**בהצלחה! 🚀**
