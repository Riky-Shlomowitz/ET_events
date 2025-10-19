# ⚡ הגדרה מהירה - הוסטינגר VPS

## 🎯 רכישה מהירה
1. **Hostinger.com** → **VPS Hosting**
2. **VPS 2** (2GB RAM) - $7/חודש
3. **OS**: Ubuntu 20.04 LTS
4. **קבל**: IP + Password

---

## 🚀 הגדרה מהירה (20 דקות)

### 1. התחבר לשרת
```bash
ssh root@YOUR_SERVER_IP
```

### 2. הגדרה אוטומטית
```bash
# עדכון מערכת
apt update && apt upgrade -y

# התקנת כלים
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs postgresql postgresql-contrib nginx git

# הגדרת PostgreSQL
sudo -u postgres psql -c "ALTER USER postgres PASSWORD 'strongpass123';"
sudo -u postgres createdb trachtenberg_events

# התקנת PM2
npm install -g pm2

# הפעלת שירותים
systemctl enable nginx postgresql
systemctl start nginx postgresql
```

### 3. הגדרת Nginx
```bash
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
    }
}
EOF

nginx -t && systemctl reload nginx
```

---

## 📁 GitHub Setup

### 1. יצירת Repository
```bash
# במחשב המקומי
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/USERNAME/trachtenberg-events.git
git push -u origin main
```

### 2. GitHub Actions
צור `.github/workflows/deploy.yml`:
```yaml
name: Deploy
on:
  push:
    branches: [ main ]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - uses: actions/setup-node@v3
      with:
        node-version: '18'
    - run: |
        cd frontend && npm ci && npm run build
        cd ../backend && npm ci
    - uses: appleboy/ssh-action@v0.1.5
      with:
        host: ${{ secrets.SERVER_HOST }}
        username: ${{ secrets.SERVER_USER }}
        password: ${{ secrets.SERVER_PASSWORD }}
        script: |
          cd /var/www && rm -rf trachtenberg-events
          git clone https://github.com/${{ github.repository }}.git trachtenberg-events
          cd trachtenberg-events/frontend && npm ci && npm run build
          cp -r dist/* /var/www/html/
          cd ../backend && npm ci
          echo "NODE_ENV=production
          PORT=3000
          DB_HOST=localhost
          DB_NAME=trachtenberg_events
          DB_USER=postgres
          DB_PASS=strongpass123
          JWT_SECRET=super-secret-key" > .env
          pm2 stop all || true
          pm2 start src/server.js --name api
          pm2 save
```

### 3. הגדרת Secrets בGitHub
- `SERVER_HOST`: IP השרת
- `SERVER_USER`: root
- `SERVER_PASSWORD`: סיסמת השרת

---

## 🌐 דומיין + SSL

### 1. הגדרת דומיין
```bash
# אם יש דומיין - עדכן DNS:
# A Record: @ → SERVER_IP
# A Record: www → SERVER_IP
```

### 2. SSL חינם
```bash
# התקן Certbot
apt install -y certbot python3-certbot-nginx

# קבל SSL (החלף YOUR_DOMAIN)
certbot --nginx -d your-domain.com -d www.your-domain.com

# חידוש אוטומטי
echo "0 12 * * * /usr/bin/certbot renew --quiet" | crontab -
```

---

## ✅ בדיקה מהירה

### בדוק שהכל עובד:
```bash
# שירותים
systemctl status nginx postgresql
pm2 status

# API
curl http://localhost:3000/api/health

# Frontend
curl http://localhost/

# עם דומיין
curl https://your-domain.com/api/health
```

---

## 🔄 עדכונים אוטומטיים

**מעכשיו כל Push לGitHub = עדכון אוטומטי באתר!**

```bash
# במחשב המקומי
git add .
git commit -m "עדכון האתר"
git push
# GitHub Actions יעשה את השאר אוטומטית
```

---

## 💡 טיפים מהירים

### מעקב לוגים:
```bash
# Backend logs
pm2 logs

# Nginx logs  
tail -f /var/log/nginx/access.log
```

### גיבוי מהיר:
```bash
# גיבוי DB
pg_dump -U postgres trachtenberg_events > backup.sql

# שחזור DB
psql -U postgres trachtenberg_events < backup.sql
```

### הפעלה מחדש:
```bash
# הפעל הכל מחדש
systemctl restart nginx
pm2 restart all
```

---

## 🎉 סיכום מהיר

**✅ זמן הגדרה**: 20-30 דקות
**✅ עלות**: $7/חודש
**✅ תוצאה**: אתר מקצועי עם פריסה אוטומטית

**האתר שלך חי ומוכן!** 🚀

