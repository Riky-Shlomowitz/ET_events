# 🗃️ מדריך התקנת PostgreSQL על שרת Hostinger

## 📋 מה נעשה כאן?
נתקין PostgreSQL על השרת ונגדיר את מסד הנתונים לאפליקציה שלך.

---

## 🚀 שלב 1: התחברות לשרת

פתחי טרמינל (PowerShell או CMD) והתחברי לשרת:

```bash
ssh your_username@72.61.144.195
```

**החלף את `your_username` בשם המשתמש שלך בהוסטינגר!**

אם זו ההתחברות הראשונה, תראי הודעה - הקלידי `yes` ולחצי Enter.

הזיני את הסיסמה שלך (לא תראי אותה בזמן ההקלדה - זה נורמלי).

---

## 🚀 שלב 2: הורדת סקריפט ההתקנה

ברגע שאת בתוך השרת, הריצי:

```bash
# יצירת תיקייה לפרויקט (אם לא קיימת)
mkdir -p ~/trachtenberg-events
cd ~/trachtenberg-events

# הורדת סקריפט ההתקנה
wget https://raw.githubusercontent.com/Riky-Shlomowitz/ET_events/main/install-postgresql-hostinger.sh

# מתן הרשאות הרצה
chmod +x install-postgresql-hostinger.sh
```

---

## 🚀 שלב 3: הרצת סקריפט ההתקנה

```bash
sudo ./install-postgresql-hostinger.sh
```

**הסקריפט יבצע:**
- ✅ עדכון מערכת
- ✅ התקנת PostgreSQL
- ✅ יצירת מסד נתונים `trachtenberg_events`
- ✅ יצירת משתמש `events_admin`
- ✅ הגדרת הרשאות
- ✅ בדיקת חיבור

**זה ייקח כ-5-10 דקות.**

---

## 🚀 שלב 4: בדיקה שהכל עובד

אחרי שהסקריפט מסיים, בדקי שהכל תקין:

```bash
# בדיקה שPostgreSQL רץ:
sudo systemctl status postgresql

# בדיקת חיבור למסד:
PGPASSWORD='Tr@ch2025!' psql -h localhost -U events_admin -d trachtenberg_events -c "SELECT version();"
```

אם הכל עבד, תראי את גרסת PostgreSQL! ✅

---

## 🚀 שלב 5: התקנת Node.js והאפליקציה

עכשיו נתקין את שאר הדברים:

```bash
# הורדת סקריפט ההתקנה המלא
wget https://raw.githubusercontent.com/Riky-Shlomowitz/ET_events/main/setup-server.sh

# מתן הרשאות
chmod +x setup-server.sh

# הרצה
sudo ./setup-server.sh
```

---

## 📊 פרטי מסד הנתונים

אחרי ההתקנה, אלו הפרטים שלך:

```
Host: localhost
Port: 5432
Database: trachtenberg_events
Username: events_admin
Password: Tr@ch2025!
```

---

## 🔧 פקודות שימושיות

### התחברות למסד נתונים:
```bash
PGPASSWORD='Tr@ch2025!' psql -h localhost -U events_admin -d trachtenberg_events
```

### בדיקת סטטוס PostgreSQL:
```bash
sudo systemctl status postgresql
```

### אתחול PostgreSQL:
```bash
sudo systemctl restart postgresql
```

### צפייה בטבלאות:
```bash
PGPASSWORD='Tr@ch2025!' psql -h localhost -U events_admin -d trachtenberg_events -c "\dt"
```

### צפייה בנתונים בטבלת Gallery:
```bash
PGPASSWORD='Tr@ch2025!' psql -h localhost -U events_admin -d trachtenberg_events -c "SELECT * FROM gallery_items;"
```

---

## ❗ פתרון בעיות

### אם הסקריפט נכשל:

**1. בדוק אם PostgreSQL כבר מותקן:**
```bash
which psql
psql --version
```

**2. אם כבר מותקן, פשוט צור את המסד ידנית:**
```bash
sudo -u postgres psql << EOF
DROP DATABASE IF EXISTS trachtenberg_events;
DROP USER IF EXISTS events_admin;
CREATE USER events_admin WITH PASSWORD 'Tr@ch2025!';
CREATE DATABASE trachtenberg_events;
GRANT ALL PRIVILEGES ON DATABASE trachtenberg_events TO events_admin;
\c trachtenberg_events
GRANT ALL ON SCHEMA public TO events_admin;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO events_admin;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO events_admin;
EOF
```

**3. אם אין הרשאות sudo:**
פנה לתמיכה של Hostinger ובקש הרשאות root או עזרה בהתקנת PostgreSQL.

---

## 🎉 סיימנו!

אחרי שPostgreSQL מותקן ועובד:

1. ✅ PostgreSQL מותקן ורץ
2. ✅ מסד נתונים נוצר
3. ✅ משתמש הוגדר
4. ⏭️ **הבא**: הרץ את `setup-server.sh` להתקנת שאר המערכת

---

## 💡 צריכה עזרה?

אם יש בעיה בשלב כלשהו:
1. 📸 צלמי את השגיאה שמופיעה
2. 📋 העתיקי את הפלט של הפקודה
3. 🗣️ שלחי לי ואני אעזור!

---

## 🔗 קישורים מועילים

- **מדריך פריסה מלא**: `HOSTINGER_DEPLOYMENT_GUIDE.md`
- **הגדרות GitHub Actions**: `docs/deployment/GITHUB_SECRETS_SETUP.md`
- **ארכיטקטורת Backend**: `docs/database/BACKEND_ARCHITECTURE.md`

בהצלחה! 🚀

