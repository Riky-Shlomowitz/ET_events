# 📋 צעד אחרי צעד - פריסה בהוסטינגר

## ⏰ זמן משוער: 45 דקות

---

## 🛒 שלב 1: רכישת VPS (5 דקות)

### בהוסטינגר:
1. **לך ל**: https://hostinger.com
2. **VPS Hosting** → **Choose Plan**
3. **VPS 2** (2GB RAM, $7/חודש) - **מומלץ**
4. **הגדרות**:
   - OS: **Ubuntu 20.04 LTS**
   - Location: **Europe** (הכי קרוב)
   - Hostname: **trachtenberg-events**
5. **שלם** ו**קבל פרטי גישה**

### פרטים שתקבל:
```
IP Address: 123.456.789.123
Username: root
Password: Xy9#mK$2pL8@
```

---

## 🔧 שלב 2: הגדרת השרת (15 דקות)

### התחבר לשרת:
```bash
ssh root@123.456.789.123
# הזן סיסמה
```

### הרץ סקריפט הגדרה אוטומטי:
```bash
#!/bin/bash
echo "🚀 מתחיל הגדרת שרת עבור טרכטנברג..."

# עדכון מערכת
apt update && apt upgrade -y

# התקנת Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# התקנת PostgreSQL
apt install -y postgresql postgresql-contrib

# התקנת Nginx
apt install -y nginx

# התקנת Git
apt install -y git

# התקנת PM2
npm install -g pm2

# הגדרת PostgreSQL
sudo -u postgres psql << EOF
ALTER USER postgres PASSWORD 'strongDBpass123';
CREATE DATABASE trachtenberg_events;
CREATE USER events_admin WITH PASSWORD 'secure_password_123';
GRANT ALL PRIVILEGES ON DATABASE trachtenberg_events TO events_admin;
\q
EOF

# הפעלת שירותים
systemctl enable nginx postgresql
systemctl start nginx postgresql

# יצירת תיקיות
mkdir -p /var/www/trachtenberg-events
mkdir -p /var/backups/trachtenberg-events

# הגדרת Nginx בסיסי
cat > /etc/nginx/sites-available/default << 'EOF'
server {
    listen 80;
    server_name _;
    root /var/www/html;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location /api {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

# בדיקה והפעלה
nginx -t && systemctl reload nginx

echo "✅ הגדרת השרת הושלמה בהצלחה!"
echo "🌐 השרת זמין ב: http://$(curl -s ifconfig.me)"
echo "🔐 PostgreSQL הוגדר עם סיסמה: strongDBpass123"
```

### העתק והרץ:
```bash
# שמור את הסקריפט
nano setup.sh

# הוסף את הקוד למעלה, שמור (Ctrl+X, Y, Enter)

# הפעל
chmod +x setup.sh
./setup.sh
```

---

## 📁 שלב 3: הכנת הפרויקט (10 דקות)

### במחשב המקומי:

#### צור מבנה נכון:
```bash
# צור תיקיית פרויקט חדשה
mkdir trachtenberg-events-fullstack
cd trachtenberg-events-fullstack

# העתק קבצים
# Frontend
mkdir frontend
cp -r "C:/Users/user1/Downloads/ארועים/src" frontend/
cp -r "C:/Users/user1/Downloads/ארועים/public" frontend/
cp "C:/Users/user1/Downloads/ארועים/package.json" frontend/
cp "C:/Users/user1/Downloads/ארועים/vite.config.js" frontend/
cp "C:/Users/user1/Downloads/ארועים/tailwind.config.js" frontend/
cp "C:/Users/user1/Downloads/ארועים/index.html" frontend/

# Backend  
cp -r "C:/Users/user1/Downloads/ארועים/backend" ./

# Documentation
cp "C:/Users/user1/Downloads/ארועים/*.md" ./
```

#### צור package.json ראשי:
```json
{
  "name": "trachtenberg-events-fullstack",
  "version": "1.0.0",
  "description": "עמנואל טרכטנברג - אתר הפקת אירועים",
  "scripts": {
    "install:frontend": "cd frontend && npm install",
    "install:backend": "cd backend && npm install", 
    "install:all": "npm run install:frontend && npm run install:backend",
    "dev:frontend": "cd frontend && npm run dev",
    "dev:backend": "cd backend && npm run dev",
    "build:frontend": "cd frontend && npm run build",
    "deploy": "npm run build:frontend"
  },
  "keywords": ["events", "catering", "wedding"],
  "author": "Emanuel Trachtenberg",
  "license": "Private"
}
```

---

## 🐙 שלב 4: העלאה לGitHub (5 דקות)

### יצירת Repository:
1. **GitHub.com** → **New Repository**
2. **Repository name**: `trachtenberg-events`
3. **Description**: `אתר הפקת אירועים מקצועי`
4. **Public/Private**: לפי בחירה
5. **Create Repository**

### העלאת הקוד:
```bash
# אתחול Git
git init
git add .
git commit -m "🎉 Initial commit - Trachtenberg Events Fullstack"

# חיבור לGitHub
git remote add origin https://github.com/YOUR_USERNAME/trachtenberg-events.git
git branch -M main
git push -u origin main
```

---

## 🔐 שלב 5: הגדרת GitHub Secrets (5 דקות)

### בGitHub Repository:
1. **Settings** → **Secrets and variables** → **Actions**
2. **הוסף Secrets**:

```
Name: SERVER_HOST
Value: 123.456.789.123 (ה-IP שקיבלת)

Name: SERVER_USER  
Value: root

Name: SERVER_PASSWORD
Value: Xy9#mK$2pL8@ (הסיסמה שקיבלת)

Name: DB_PASSWORD
Value: strongDBpass123

Name: JWT_SECRET
Value: trachtenberg-events-jwt-secret-production-2025-very-long-key
```

---

## 🚀 שלב 6: פריסה ראשונה (5 דקות)

### הפעלת GitHub Actions:
1. **עשה שינוי קטן** (למשל עדכן README)
2. **Commit & Push**:
```bash
git add .
git commit -m "🚀 First deployment"
git push origin main
```

3. **בדוק בGitHub**:
   - **Actions tab** → תראה את הפריסה רצה
   - **אם ירוק** ✅ = הצליח
   - **אם אדום** ❌ = בדוק לוגים

### בדיקה שהכל עובד:
```bash
# בדוק שהאתר חי
curl http://123.456.789.123

# בדוק API
curl http://123.456.789.123/api/health

# בדוק ממשק ניהול
# לך לדפדפן: http://123.456.789.123/AdminLogin
```

---

## 🌐 שלב 7: הגדרת דומיין (אופציונלי)

### אם יש דומיין:
1. **Hostinger Panel** → **Domains** → **DNS Zone**
2. **עדכן A Records**:
```
@ → 123.456.789.123
www → 123.456.789.123
```

### הגדרת SSL:
```bash
# בשרת
sudo apt install -y certbot python3-certbot-nginx

# קבל תעודה (החלף YOUR_DOMAIN)
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# בדוק
curl https://your-domain.com/api/health
```

---

## ✅ בדיקות סופיות

### בדוק שהכל עובד:
- [ ] **אתר ראשי**: http://your-server-ip/
- [ ] **גלריה**: תמונות נטענות
- [ ] **פורמס**: שולח הודעות
- [ ] **ממשק ניהול**: /AdminLogin
- [ ] **כניסה למנהל**: admin@trachtenberg.co.il / Tr@ch2025!
- [ ] **API**: /api/health מחזיר 200
- [ ] **SSL**: https עובד (אם יש דומיין)

### בדיקת GitHub Actions:
- [ ] **Push** מפעיל deployment
- [ ] **Logs** ירוקים ללא שגיאות
- [ ] **Health checks** עוברים
- [ ] **Services** מתחילים אוטומטית

---

## 🎉 מזל טוב! האתר חי!

### מה השגת:
✅ **VPS מקצועי** בהוסטינגר
✅ **פריסה אוטומטית** עם GitHub Actions  
✅ **בסיס נתונים** PostgreSQL
✅ **SSL מאובטח** (אם יש דומיין)
✅ **מעקב ולוגים** מלאים

### מעכשיו:
```bash
# כל שינוי בקוד
git add .
git commit -m "עדכון האתר"
git push

# = עדכון אוטומטי באתר! 🚀
```

### כתובות חשובות:
- **אתר**: http://your-server-ip (או https://your-domain.com)
- **ממשק ניהול**: /AdminLogin
- **API**: /api/health
- **GitHub Actions**: github.com/your-username/trachtenberg-events/actions

**האתר שלך עכשיו מקצועי ואוטומטי!** 🎉

---

*מדריך מלא לפריסה מקצועית בהוסטינגר*
*נוצר עבור עמנואל טרכטנברג - הפקת אירועים*

