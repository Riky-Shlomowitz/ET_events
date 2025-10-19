# 🚀 מדריך פריסה מלא בהוסטינגר - צעד אחרי צעד

## 📋 תוכן עניינים
1. [בחירת תוכנית הוסטינגר](#בחירת-תוכנית-הוסטינגר)
2. [הגדרת VPS בהוסטינגר](#הגדרת-vps-בהוסטינגר)
3. [הגדרת השרת](#הגדרת-השרת)
4. [העלאה לGitHub](#העלאה-לgithub)
5. [הגדרת GitHub Actions](#הגדרת-github-actions)
6. [פריסה אוטומטית](#פריסה-אוטומטית)
7. [הגדרת דומיין](#הגדרת-דומיין)
8. [SSL ואבטחה](#ssl-ואבטחה)
9. [מעקב ותחזוקה](#מעקב-ותחזוקה)

---

## 🎯 בחירת תוכנית הוסטינגר

### אפשרות 1: Frontend בלבד (מומלץ להתחלה)
**🌐 Web Hosting Premium**
- **מחיר**: ~$3/חודש
- **מתאים ל**: אתרים סטטיים
- **כולל**: SSL, דומיין, cPanel
- **מגבלות**: רק Frontend (ללא Backend)

### אפשרות 2: Fullstack מלא (מומלץ לעתיד)
**🖥️ VPS Hosting**
- **מחיר**: ~$4-12/חודש
- **מתאים ל**: Frontend + Backend + Database
- **כולל**: Root access, Ubuntu/CentOS
- **יתרונות**: שליטה מלאה

---

## 🛒 רכישה והגדרה בהוסטינגר

### שלב 1: רכישת VPS
1. **לך להוסטינגר**: https://hostinger.com
2. **בחר VPS Hosting**
3. **בחר תוכנית**:
   - **VPS 1**: 1GB RAM, 20GB SSD (~$4/חודש) - מינימום
   - **VPS 2**: 2GB RAM, 40GB SSD (~$7/חודש) - מומלץ
   - **VPS 4**: 4GB RAM, 80GB SSD (~$12/חודש) - מתקדם

4. **הגדרות רכישה**:
   - **OS**: Ubuntu 20.04 LTS (מומלץ)
   - **Location**: בחר הכי קרוב (Europe)
   - **Hostname**: trachtenberg-events

### שלב 2: קבלת פרטי גישה
אחרי הרכישה תקבל:
```
IP Address: 123.456.789.123
Username: root
Password: your_generated_password
```

---

## 🔧 הגדרת השרת - צעד אחרי צעד

### שלב 1: התחברות לשרת
```bash
# Windows (PowerShell/CMD)
ssh root@123.456.789.123

# הזן סיסמה כשמתבקש
```

### שלב 2: עדכון המערכת
```bash
# עדכון חבילות
sudo apt update && sudo apt upgrade -y

# התקנת כלים בסיסיים
sudo apt install -y curl wget git unzip software-properties-common
```

### שלב 3: התקנת Node.js
```bash
# הוסף Node.js repository
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -

# התקן Node.js
sudo apt install -y nodejs

# בדוק גרסה
node --version
npm --version
```

### שלב 4: התקנת PostgreSQL
```bash
# התקן PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# הפעל שירות
sudo systemctl start postgresql
sudo systemctl enable postgresql

# הגדר סיסמה למשתמש postgres
sudo -u postgres psql
```

```sql
-- בתוך PostgreSQL console
ALTER USER postgres PASSWORD 'your_strong_password';
CREATE DATABASE trachtenberg_events;
CREATE USER events_admin WITH PASSWORD 'secure_password_123';
GRANT ALL PRIVILEGES ON DATABASE trachtenberg_events TO events_admin;
\q
```

### שלב 5: התקנת Nginx
```bash
# התקן Nginx
sudo apt install -y nginx

# הפעל שירות
sudo systemctl start nginx
sudo systemctl enable nginx

# בדוק סטטוס
sudo systemctl status nginx
```

### שלב 6: התקנת PM2 (Process Manager)
```bash
# התקן PM2 globally
sudo npm install -g pm2

# הגדר PM2 להפעלה אוטומטית
pm2 startup
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u root --hp /root
```

---

## 📁 הכנת הפרויקט לGitHub

### שלב 1: ארגון הפרויקט
```bash
# במחשב המקומי - ארגן את הפרויקט
mkdir trachtenberg-events-fullstack
cd trachtenberg-events-fullstack

# העבר את הקבצים
cp -r ../ארועים ./frontend
cp -r ../ארועים/backend ./backend
```

### שלב 2: יצירת קבצי הגדרה
צור קובץ `.gitignore` בשורש הפרויקט:
```gitignore
# Dependencies
node_modules/
*/node_modules/

# Production builds
frontend/dist/
backend/dist/

# Environment files
.env
.env.local
.env.production
backend/.env

# Logs
*.log
npm-debug.log*
logs/

# Runtime data
pids/
*.pid
*.seed

# Coverage directory used by tools like istanbul
coverage/

# IDE files
.vscode/
.idea/
*.swp
*.swo

# OS files
.DS_Store
Thumbs.db

# PM2
.pm2/
```

### שלב 3: יצירת GitHub Repository
1. **לך לGitHub**: https://github.com
2. **צור repository חדש**: `trachtenberg-events`
3. **הגדרות**:
   - ✅ Public/Private (לפי בחירה)
   - ✅ Add README
   - ✅ Add .gitignore (Node)

### שלב 4: העלאה לGitHub
```bash
# אתחל git
git init
git add .
git commit -m "Initial commit - Trachtenberg Events Fullstack"

# חבר לrepository
git remote add origin https://github.com/YOUR_USERNAME/trachtenberg-events.git
git branch -M main
git push -u origin main
```

---

## ⚙️ הגדרת GitHub Actions - פריסה אוטומטית

### שלב 1: יצירת GitHub Secrets
1. **לך לrepository בGitHub**
2. **Settings** → **Secrets and variables** → **Actions**
3. **הוסף Secrets**:

```
SERVER_HOST = 123.456.789.123
SERVER_USER = root
SERVER_PASSWORD = your_vps_password
DB_PASSWORD = your_strong_password
JWT_SECRET = your-super-secret-jwt-key-change-in-production
```

### שלב 2: יצירת GitHub Actions Workflow
צור קובץ `.github/workflows/deploy.yml`:

```yaml
name: 🚀 Deploy to Hostinger VPS

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: 📥 Checkout code
      uses: actions/checkout@v3

    - name: 🟢 Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
        cache-dependency-path: |
          frontend/package-lock.json
          backend/package-lock.json

    - name: 📦 Install Frontend Dependencies
      working-directory: ./frontend
      run: npm ci

    - name: 🏗️ Build Frontend
      working-directory: ./frontend
      run: npm run build

    - name: 📦 Install Backend Dependencies
      working-directory: ./backend
      run: npm ci

    - name: 🧪 Run Tests (if any)
      working-directory: ./backend
      run: npm test --if-present

    - name: 🚀 Deploy to Server
      uses: appleboy/ssh-action@v0.1.5
      with:
        host: ${{ secrets.SERVER_HOST }}
        username: ${{ secrets.SERVER_USER }}
        password: ${{ secrets.SERVER_PASSWORD }}
        script: |
          # Navigate to app directory
          cd /var/www/trachtenberg-events || mkdir -p /var/www/trachtenberg-events
          cd /var/www/trachtenberg-events
          
          # Backup current version
          if [ -d "current" ]; then
            mv current backup-$(date +%Y%m%d-%H%M%S)
          fi
          
          # Clone/pull latest code
          if [ -d ".git" ]; then
            git pull origin main
          else
            git clone https://github.com/${{ github.repository }}.git .
          fi
          
          # Setup Backend
          cd backend
          npm ci --production
          
          # Create .env file
          cat > .env << EOF
          DB_NAME=trachtenberg_events
          DB_USER=events_admin
          DB_PASS=secure_password_123
          DB_HOST=localhost
          DB_PORT=5432
          PORT=3000
          NODE_ENV=production
          FRONTEND_URL=https://your-domain.com
          JWT_SECRET=${{ secrets.JWT_SECRET }}
          JWT_EXPIRE=7d
          EOF
          
          # Restart backend with PM2
          pm2 stop trachtenberg-backend || true
          pm2 start src/server.js --name "trachtenberg-backend"
          pm2 save
          
          # Setup Frontend
          cd ../frontend
          npm ci
          npm run build
          
          # Copy frontend build to nginx
          sudo cp -r dist/* /var/www/html/
          
          # Restart nginx
          sudo systemctl reload nginx
          
          echo "🎉 Deployment completed successfully!"
```

---

## 🌐 הגדרת Nginx - Web Server

### שלב 1: הגדרת Nginx Configuration
```bash
# במחשב השרת - צור קובץ הגדרה
sudo nano /etc/nginx/sites-available/trachtenberg-events
```

הוסף את התוכן הבא:
```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    root /var/www/html;
    index index.html index.htm;

    # Frontend - Serve static files
    location / {
        try_files $uri $uri/ /index.html;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    # Backend API - Proxy to Node.js
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

    # Optimize static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private must-revalidate auth;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript;
}
```

### שלב 2: הפעלת האתר
```bash
# הפעל את הקונפיגורציה
sudo ln -s /etc/nginx/sites-available/trachtenberg-events /etc/nginx/sites-enabled/

# בדוק תקינות הקונפיגורציה
sudo nginx -t

# אם הכל תקין - הפעל מחדש
sudo systemctl reload nginx
```

---

## 🔒 הגדרת SSL עם Let's Encrypt

### שלב 1: התקנת Certbot
```bash
# התקן Certbot
sudo apt install -y certbot python3-certbot-nginx

# קבל תעודת SSL
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# הגדר חידוש אוטומטי
sudo crontab -e
```

הוסף לcrontab:
```bash
0 12 * * * /usr/bin/certbot renew --quiet
```

### שלב 2: בדיקת SSL
```bash
# בדוק תוקף התעודה
sudo certbot certificates

# בדוק חידוש אוטומטי
sudo certbot renew --dry-run
```

---

## 🌍 הגדרת דומיין בהוסטינגר

### שלב 1: רכישת דומיין
1. **לך להוסטינגר**
2. **Domains** → **Register Domain**
3. **בחר דומיין**: `trachtenberg-events.com`

### שלב 2: הגדרת DNS Records
1. **Domains** → **Manage** → **DNS Zone**
2. **הוסף Records**:

```
Type: A
Name: @
Value: 123.456.789.123 (IP של השרת)
TTL: 3600

Type: A  
Name: www
Value: 123.456.789.123
TTL: 3600

Type: CNAME
Name: api
Value: your-domain.com
TTL: 3600
```

---

## 📊 מעקב ותחזוקה

### שלב 1: הגדרת Monitoring
```bash
# התקן htop לניטור
sudo apt install -y htop

# בדוק סטטוס שירותים
sudo systemctl status nginx
sudo systemctl status postgresql
pm2 status

# בדוק לוגים
pm2 logs trachtenberg-backend
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### שלב 2: גיבויים אוטומטיים
צור סקריפט גיבוי `/root/backup.sh`:
```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/root/backups"

# צור תיקיית גיבויים
mkdir -p $BACKUP_DIR

# גיבוי בסיס נתונים
pg_dump -U events_admin -h localhost trachtenberg_events > $BACKUP_DIR/db_backup_$DATE.sql

# גיבוי קבצים
tar -czf $BACKUP_DIR/files_backup_$DATE.tar.gz /var/www/trachtenberg-events

# מחק גיבויים ישנים (שמור 7 ימים)
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete

echo "Backup completed: $DATE"
```

הפעל אוטומטית:
```bash
chmod +x /root/backup.sh
echo "0 2 * * * /root/backup.sh" | sudo crontab -
```

---

## 🚀 תהליך הפריסה המלא

### כשאתה עושה שינויים:
1. **עדכן קוד** במחשב המקומי
2. **Commit & Push** לGitHub:
```bash
git add .
git commit -m "Update: description of changes"
git push origin main
```
3. **GitHub Actions יפעיל אוטומטית** ויעשה:
   - Build של Frontend
   - Deploy לשרת
   - Restart של Backend
   - עדכון Nginx

### בדיקה שהכל עובד:
```bash
# בדוק שהשרת רץ
curl http://your-domain.com/api/health

# בדוק Frontend
curl http://your-domain.com

# בדוק SSL
curl https://your-domain.com/api/health
```

---

## 💰 סיכום עלויות

### חודשית:
- **VPS Hostinger**: $4-12
- **דומיין**: $1-2 (שנתי)
- **SSL**: חינם (Let's Encrypt)
- **סה"כ**: ~$5-14/חודש

### חד פעמי:
- **הגדרה ראשונית**: 2-4 שעות
- **GitHub Actions**: חינם
- **Monitoring**: חינם

---

## 🎯 יתרונות הפתרון

✅ **פריסה אוטומטית** - Push לGitHub = עדכון אוטומטי
✅ **עלות נמוכה** - החל מ-$5/חודש
✅ **ביצועים מעולים** - שרת ייעודי
✅ **שליטה מלאה** - Root access
✅ **SSL חינם** - Let's Encrypt
✅ **גיבויים אוטומטיים** - בטיחות מקסימלית
✅ **Monitoring** - מעקב אחר תקינות

---

## 🆘 פתרון בעיות נפוצות

### שרת לא מגיב:
```bash
# בדוק סטטוס שירותים
sudo systemctl status nginx
sudo systemctl status postgresql
pm2 status

# הפעל מחדש
sudo systemctl restart nginx
pm2 restart all
```

### GitHub Actions נכשל:
1. בדוק Secrets בGitHub
2. בדוק לוגים בActions tab
3. בדוק חיבור SSH לשרת

### SSL לא עובד:
```bash
# חדש תעודה
sudo certbot renew --force-renewal
sudo systemctl reload nginx
```

### בסיס נתונים לא מחובר:
```bash
# בדוק PostgreSQL
sudo systemctl status postgresql
sudo -u postgres psql -c "SELECT version();"
```

---

## 🎉 סיכום

**עכשיו יש לך:**
1. 🌐 **אתר חי** על https://your-domain.com
2. 🔄 **פריסה אוטומטית** עם GitHub Actions
3. 🔒 **SSL מאובטח** עם Let's Encrypt
4. 📊 **מעקב ותחזוקה** אוטומטיים
5. 💾 **גיבויים** יומיים

**הפרויקט שלך עכשיו מקצועי ומוכן לעסק!** 🚀

---

*מדריך נוצר עבור עמנואל טרכטנברג - הפקת אירועים*
*© 2025 - הפריסה המושלמת בהוסטינגר*
