#!/bin/bash

# 🚀 סקריפט הגדרה אוטומטי לשרת הוסטינגר
# עבור פרויקט עמנואל טרכטנברג - הפקת אירועים

echo "🎉 מתחיל הגדרת שרת עבור טרכטנברג אירועים..."
echo "⏰ זמן משוער: 10-15 דקות"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    print_error "אנא הרץ כ-root: sudo ./server-setup.sh"
    exit 1
fi

print_info "מתחיל עדכון מערכת..."

# Update system
apt update && apt upgrade -y
if [ $? -eq 0 ]; then
    print_status "עדכון מערכת הושלם"
else
    print_error "שגיאה בעדכון מערכת"
    exit 1
fi

print_info "מתקין Node.js 18..."

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# Verify Node.js installation
NODE_VERSION=$(node --version)
NPM_VERSION=$(npm --version)
print_status "Node.js $NODE_VERSION ו-npm $NPM_VERSION הותקנו בהצלחה"

print_info "מתקין PostgreSQL..."

# Install PostgreSQL
apt install -y postgresql postgresql-contrib

# Start PostgreSQL service
systemctl start postgresql
systemctl enable postgresql

print_info "מגדיר בסיס נתונים..."

# Setup PostgreSQL database
sudo -u postgres psql << EOF
ALTER USER postgres PASSWORD 'strongDBpass123';
CREATE DATABASE trachtenberg_events;
CREATE USER events_admin WITH PASSWORD 'secure_password_123';
GRANT ALL PRIVILEGES ON DATABASE trachtenberg_events TO events_admin;
\q
EOF

print_status "בסיס הנתונים הוגדר בהצלחה"

print_info "מתקין Nginx..."

# Install Nginx
apt install -y nginx

# Start Nginx service
systemctl start nginx
systemctl enable nginx

print_info "מגדיר Nginx לפרויקט..."

# Configure Nginx for the project
cat > /etc/nginx/sites-available/default << 'EOF'
server {
    listen 80;
    server_name _;
    root /var/www/html;
    index index.html index.htm;

    # Frontend - Serve React app
    location / {
        try_files $uri $uri/ /index.html;
        add_header Cache-Control "public, max-age=3600";
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
        
        # Timeout settings
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Static assets optimization
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

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/json
        application/javascript
        application/xml+rss
        application/atom+xml
        image/svg+xml;
}
EOF

# Test and reload Nginx
nginx -t
if [ $? -eq 0 ]; then
    systemctl reload nginx
    print_status "Nginx הוגדר בהצלחה"
else
    print_error "שגיאה בהגדרת Nginx"
    exit 1
fi

print_info "מתקין PM2 לניהול תהליכים..."

# Install PM2 globally
npm install -g pm2

# Setup PM2 startup
pm2 startup systemd
env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u root --hp /root

print_status "PM2 הותקן והוגדר"

print_info "יוצר תיקיות פרויקט..."

# Create project directories
mkdir -p /var/www/trachtenberg-events
mkdir -p /var/backups/trachtenberg-events
mkdir -p /var/log/trachtenberg-events

# Set proper permissions
chown -R www-data:www-data /var/www/html
chmod -R 755 /var/www/html

print_info "מתקין כלים נוספים..."

# Install additional useful tools
apt install -y htop ufw fail2ban

print_info "מגדיר firewall בסיסי..."

# Basic firewall setup
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow 'Nginx Full'
ufw --force enable

print_status "Firewall הוגדר"

# Create a simple index page
cat > /var/www/html/index.html << 'EOF'
<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>עמנואל טרכטנברג - הפקת אירועים</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            text-align: center;
            padding: 50px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            margin: 0;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background: rgba(255,255,255,0.1);
            padding: 40px;
            border-radius: 20px;
            backdrop-filter: blur(10px);
        }
        h1 { color: #FFD700; margin-bottom: 20px; }
        .status { background: rgba(0,255,0,0.2); padding: 15px; border-radius: 10px; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🎉 השרת מוכן!</h1>
        <p>שרת עמנואל טרכטנברג - הפקת אירועים הוגדר בהצלחה</p>
        <div class="status">
            <strong>✅ מוכן לפריסה עם GitHub Actions</strong>
        </div>
        <p>העלה את הקוד לGitHub והאתר יעלה אוטומטית!</p>
    </div>
</body>
</html>
EOF

print_status "דף בדיקה נוצר"

# Get server IP
SERVER_IP=$(curl -s ifconfig.me)

echo ""
echo "🎉 הגדרת השרת הושלמה בהצלחה!"
echo ""
echo "📊 סיכום הגדרות:"
echo "🌐 IP השרת: $SERVER_IP"
echo "🔗 בדיקת השרת: http://$SERVER_IP"
echo "🐘 PostgreSQL: פעיל עם בסיס נתונים trachtenberg_events"
echo "🌍 Nginx: פעיל ומוגדר"
echo "⚙️  PM2: מותקן ומוכן"
echo "🔥 Firewall: פעיל ומאובטח"
echo ""
echo "🔐 פרטי בסיס נתונים:"
echo "   Database: trachtenberg_events"
echo "   User: events_admin"
echo "   Password: secure_password_123"
echo ""
echo "📋 הצעדים הבאים:"
echo "1. העלה את הקוד לGitHub"
echo "2. הגדר GitHub Secrets"
echo "3. עשה Push - הפריסה תתחיל אוטומטית!"
echo ""
print_status "השרת מוכן לקבל את הפרויקט! 🚀"

