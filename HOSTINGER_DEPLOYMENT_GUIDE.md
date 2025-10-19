# 🚀 מדריך פריסה מפורט ל-Hostinger VPS - עמנואל טרכטנברג הפקת אירועים

## 📋 תוכן עניינים
1. [בחירת תוכנית Hostinger](#בחירת-תוכנית-hostinger)
2. [הכנת השרת](#הכנת-השרת)
3. [התקנת סביבת הפיתוח](#התקנת-סביבת-הפיתוח)
4. [הגדרת בסיס הנתונים](#הגדרת-בסיס-הנתונים)
5. [העלאת האפליקציה](#העלאת-האפליקציה)
6. [הגדרת Nginx](#הגדרת-nginx)
7. [הגדרת SSL](#הגדרת-ssl)
8. [בדיקות ופתרון בעיות](#בדיקות-ופתרון-בעיות)
9. [תחזוקה שוטפת](#תחזוקה-שוטפת)

---

## 💰 בחירת תוכנית Hostinger

### **התוכניות הזמינות (2024):**

#### **VPS 1 (מומלץ עבורך) ✅**
- **מחיר**: $3.99/חודש
- **RAM**: 1GB
- **CPU**: 1 vCore
- **אחסון**: 20GB SSD
- **תעבורה**: 1TB
- **מתאים ל**: אתרים קטנים-בינוניים

#### **VPS 2**
- **מחיר**: $5.99/חודש
- **RAM**: 2GB
- **CPU**: 1 vCore
- **אחסון**: 40GB SSD
- **תעבורה**: 2TB

#### **VPS 3**
- **מחיר**: $7.99/חודש
- **RAM**: 4GB
- **CPU**: 2 vCores
- **אחסון**: 60GB SSD
- **תעבורה**: 4TB

### **המלצה עבור האפליקציה שלך:**
**VPS 1 ($3.99/חודש)** - מספיק לחלוטין!
- ✅ 200 תמונות (600MB) נכנסות ב-20GB
- ✅ 1GB RAM מספיק ל-Node.js + PostgreSQL
- ✅ 1TB תעבורה - הרבה יותר מדי

---

## 🖥️ הכנת השרת

### **שלב 1: רכישת VPS**
1. לך ל-[Hostinger](https://hostinger.com)
2. בחר "VPS Hosting"
3. בחר "VPS 1" ($3.99/חודש)
4. בחר מערכת הפעלה: **Ubuntu 22.04 LTS**
5. השלם את הרכישה

### **שלב 2: קבלת פרטי חיבור**
Hostinger ישלח לך:
- **IP Address**: `xxx.xxx.xxx.xxx`
- **Username**: `root`
- **Password**: `your_password`
- **Port**: `22` (SSH)

### **שלב 3: חיבור לשרת**
```bash
# ב-Windows (PowerShell)
ssh root@YOUR_IP_ADDRESS

# או ב-PuTTY
# Host: YOUR_IP_ADDRESS
# Port: 22
# Username: root
# Password: your_password
```

---

## ⚙️ התקנת סביבת הפיתוח

### **שלב 1: עדכון המערכת**
```bash
# התחבר לשרת
ssh root@YOUR_IP_ADDRESS

# עדכן את המערכת
apt update && apt upgrade -y
```

### **שלב 2: התקנת Node.js 18**
```bash
# הורד והתקן Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt-get install -y nodejs

# בדוק שההתקנה הצליחה
node --version  # צריך להציג v18.x.x
npm --version   # צריך להציג 9.x.x
```

### **שלב 3: התקנת PostgreSQL**
```bash
# התקן PostgreSQL
apt install postgresql postgresql-contrib -y

# הפעל את השירות
systemctl start postgresql
systemctl enable postgresql

# בדוק שהשירות רץ
systemctl status postgresql
```

### **שלב 4: התקנת Nginx**
```bash
# התקן Nginx
apt install nginx -y

# הפעל את השירות
systemctl start nginx
systemctl enable nginx

# בדוק שהשירות רץ
systemctl status nginx
```

### **שלב 5: התקנת PM2**
```bash
# התקן PM2 גלובלית
npm install -g pm2

# הגדר PM2 להתחיל עם המערכת
pm2 startup
# העתק את הפקודה שמוצגת והרץ אותה
```

### **שלב 6: התקנת Git**
```bash
# התקן Git
apt install git -y

# בדוק שההתקנה הצליחה
git --version
```

---

## 🗄️ הגדרת בסיס הנתונים

### **שלב 1: יצירת משתמש DB**
```bash
# עבור למשתמש postgres
sudo -u postgres psql

# בתוך PostgreSQL:
CREATE USER events_admin WITH PASSWORD 'Tr@ch2025!';
CREATE DATABASE trachtenberg_events OWNER events_admin;
GRANT ALL PRIVILEGES ON DATABASE trachtenberg_events TO events_admin;
\q
```

### **שלב 2: בדיקת החיבור**
```bash
# בדוק שהחיבור עובד
sudo -u postgres psql -d trachtenberg_events -c "SELECT version();"
```

---

## 📁 העלאת האפליקציה

### **שלב 1: יצירת תיקיית האפליקציה**
```bash
# צור תיקייה לאפליקציה
mkdir -p /var/www/trachtenberg-events
cd /var/www/trachtenberg-events

# שנה הרשאות
chown -R www-data:www-data /var/www/trachtenberg-events
```

### **שלב 2: העלאת הקוד**
```bash
# הורד את הקוד מ-GitHub
git clone https://github.com/Riky-Shlomowitz/ET_events.git .

# או העלה ידנית עם SFTP/SCP
```

### **שלב 3: התקנת Frontend**
```bash
# התקן dependencies
npm install

# בנה את הפרונט
npm run build

# בדוק שהבנייה הצליחה
ls -la dist/
```

### **שלב 4: התקנת Backend**
```bash
# עבור לתיקיית הבקאנד
cd backend

# התקן dependencies
npm install --only=production

# צור קובץ .env
nano .env
```

### **שלב 5: הגדרת .env**
```bash
# תוכן קובץ .env:
DB_HOST=localhost
DB_PORT=5432
DB_NAME=trachtenberg_events
DB_USER=events_admin
DB_PASS=Tr@ch2025!
PORT=3000
NODE_ENV=production
FRONTEND_URL=https://your-domain.com
JWT_SECRET=Tr@ch2025_Super_Secret_Key_2025
UPLOAD_DIR=/var/www/trachtenberg-events/uploads
MAX_FILE_SIZE=10485760
```

### **שלב 6: יצירת תיקיית uploads**
```bash
# צור תיקיית uploads
mkdir -p /var/www/trachtenberg-events/uploads
chown -R www-data:www-data /var/www/trachtenberg-events/uploads
chmod 755 /var/www/trachtenberg-events/uploads
```

---

## 🌐 הגדרת Nginx

### **שלב 1: יצירת קובץ תצורה**
```bash
# צור קובץ תצורה
nano /etc/nginx/sites-available/trachtenberg-events
```

### **שלב 2: תוכן קובץ התצורה**
```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    
    # Frontend (React)
    location / {
        root /var/www/trachtenberg-events/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
    }
    
    # Backend API
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    
    # Static files (uploads)
    location /uploads {
        alias /var/www/trachtenberg-events/uploads;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
}
```

### **שלב 3: הפעלת התצורה**
```bash
# הפעל את האתר
ln -s /etc/nginx/sites-available/trachtenberg-events /etc/nginx/sites-enabled/

# הסר את התצורה הדיפולטית
rm /etc/nginx/sites-enabled/default

# בדוק את התצורה
nginx -t

# הפעל מחדש את Nginx
systemctl reload nginx
```

---

## 🔒 הגדרת SSL

### **שלב 1: התקנת Certbot**
```bash
# התקן Certbot
apt install certbot python3-certbot-nginx -y
```

### **שלב 2: קבלת תעודת SSL**
```bash
# החלף your-domain.com בדומיין שלך
certbot --nginx -d your-domain.com -d www.your-domain.com

# עקוב אחר ההוראות על המסך
# בחר "Redirect" כשמבקשים
```

### **שלב 3: בדיקת חידוש אוטומטי**
```bash
# בדוק שהחידוש האוטומטי עובד
certbot renew --dry-run
```

---

## 🚀 הפעלת האפליקציה

### **שלב 1: הפעלת Backend**
```bash
# עבור לתיקיית הבקאנד
cd /var/www/trachtenberg-events/backend

# הפעל עם PM2
pm2 start src/server.js --name "trachtenberg-api"

# שמור את התצורה
pm2 save
```

### **שלב 2: הפעלת Frontend**
```bash
# התקן serve גלובלית
npm install -g serve

# הפעל את הפרונט
pm2 start "serve -s /var/www/trachtenberg-events/dist -l 3001" --name "trachtenberg-frontend"

# שמור את התצורה
pm2 save
```

### **שלב 3: בדיקת סטטוס**
```bash
# בדוק שכל התהליכים רצים
pm2 status

# בדוק לוגים
pm2 logs trachtenberg-api
pm2 logs trachtenberg-frontend
```

---

## ✅ בדיקות ופתרון בעיות

### **בדיקה 1: Backend API**
```bash
# בדוק שה-API עובד
curl http://localhost:3000/api/health

# צריך להחזיר:
# {"status":"OK","timestamp":"...","uptime":...}
```

### **בדיקה 2: Frontend**
```bash
# בדוק שהפרונט עובד
curl http://localhost:3001

# צריך להחזיר HTML של האתר
```

### **בדיקה 3: Nginx**
```bash
# בדוק שה-Nginx עובד
curl http://your-domain.com

# צריך להחזיר את האתר
```

### **בדיקה 4: Database**
```bash
# בדוק חיבור ל-DB
sudo -u postgres psql -d trachtenberg_events -c "SELECT COUNT(*) FROM information_schema.tables;"
```

### **פתרון בעיות נפוצות:**

#### **בעיה: 502 Bad Gateway**
```bash
# בדוק ש-PM2 רץ
pm2 status

# אם לא רץ, הפעל מחדש
pm2 restart all
```

#### **בעיה: 404 Not Found**
```bash
# בדוק שהקבצים קיימים
ls -la /var/www/trachtenberg-events/dist/

# אם לא, בנה מחדש
cd /var/www/trachtenberg-events
npm run build
```

#### **בעיה: Database Connection Error**
```bash
# בדוק ש-PostgreSQL רץ
systemctl status postgresql

# בדוק את קובץ .env
cat /var/www/trachtenberg-events/backend/.env
```

---

## 🔧 תחזוקה שוטפת

### **גיבוי יומי**
```bash
# צור סקריפט גיבוי
nano /var/www/backup.sh
```

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/var/backups/trachtenberg-events"

# צור תיקיית גיבוי
mkdir -p $BACKUP_DIR

# גבה את ה-DB
pg_dump -U events_admin -h localhost trachtenberg_events > $BACKUP_DIR/db_$DATE.sql

# גבה את הקבצים
tar -czf $BACKUP_DIR/files_$DATE.tar.gz /var/www/trachtenberg-events/uploads

# מחק גיבויים ישנים (יותר מ-7 ימים)
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete

echo "Backup completed: $DATE"
```

```bash
# הפוך את הסקריפט לבר-הרצה
chmod +x /var/www/backup.sh

# הוסף ל-cron (גיבוי יומי ב-2:00)
crontab -e
# הוסף: 0 2 * * * /var/www/backup.sh
```

### **עדכון האפליקציה**
```bash
# עבור לתיקיית האפליקציה
cd /var/www/trachtenberg-events

# הורד עדכונים
git pull origin main

# עדכן Frontend
npm run build

# עדכן Backend
cd backend
npm install --only=production

# הפעל מחדש
pm2 restart all
```

### **ניטור ביצועים**
```bash
# בדוק שימוש ב-RAM
free -h

# בדוק שימוש בדיסק
df -h

# בדוק תהליכים
pm2 monit

# בדוק לוגים
pm2 logs --lines 100
```

---

## 📊 סיכום עלויות

### **Hostinger VPS 1:**
- **VPS**: $3.99/חודש
- **דומיין**: $0.99/שנה (אם קונים ב-Hostinger)
- **SSL**: חינם (Let's Encrypt)
- **סה"כ**: **~$4/חודש**

### **יתרונות:**
- ✅ **זול מאוד** - $4/חודש
- ✅ **שליטה מלאה** על השרת
- ✅ **200 תמונות** בקלות
- ✅ **לא נרדם** לעולם
- ✅ **מהיר ואמין**

---

## 🎯 השלבים הבאים

1. **רכוש VPS 1** ב-Hostinger ($3.99/חודש)
2. **עקוב אחר המדריך** שלב אחר שלב
3. **בדוק שהכל עובד** עם הבדיקות
4. **הגדר גיבויים** אוטומטיים
5. **האפליקציה מוכנה!** 🎉

---

## 📞 תמיכה

### **אם יש בעיות:**
1. בדוק את הלוגים: `pm2 logs`
2. בדוק את הסטטוס: `pm2 status`
3. בדוק את Nginx: `systemctl status nginx`
4. בדוק את PostgreSQL: `systemctl status postgresql`

### **קישורים שימושיים:**
- [Hostinger VPS](https://hostinger.com/vps-hosting)
- [Node.js Documentation](https://nodejs.org/docs/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Nginx Documentation](https://nginx.org/en/docs/)

**בהצלחה! 🚀**
