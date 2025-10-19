#!/bin/bash

echo "🚀 Setting up Trachtenberg Events Server..."

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configure Nginx
echo -e "${YELLOW}📝 Configuring Nginx...${NC}"
sudo tee /etc/nginx/sites-available/trachtenberg-events > /dev/null << 'EOF'
server {
    listen 80;
    server_name 72.61.144.195;
    
    # Frontend (React)
    location / {
        root /var/www/html;
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
}
EOF

# Enable site
echo -e "${YELLOW}🔗 Enabling site...${NC}"
sudo ln -sf /etc/nginx/sites-available/trachtenberg-events /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test and reload Nginx
echo -e "${YELLOW}🔄 Testing Nginx configuration...${NC}"
if sudo nginx -t; then
    echo -e "${GREEN}✅ Nginx config is valid${NC}"
    sudo systemctl reload nginx
    echo -e "${GREEN}✅ Nginx reloaded${NC}"
else
    echo -e "${RED}❌ Nginx config has errors${NC}"
    exit 1
fi

# Update backend .env
echo -e "${YELLOW}📝 Updating backend .env...${NC}"
cd /var/www/trachtenberg-events/current/backend
sudo sed -i 's|FRONTEND_URL=.*|FRONTEND_URL=http://72.61.144.195|g' .env

# Restart backend
echo -e "${YELLOW}🔄 Restarting backend...${NC}"
pm2 restart trachtenberg-backend

# Wait for backend to start
sleep 5

# Test API
echo -e "${YELLOW}🧪 Testing API...${NC}"
if curl -f http://localhost:3000/api/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Backend API is working${NC}"
else
    echo -e "${RED}❌ Backend API is not responding${NC}"
fi

# Test through Nginx
if curl -f http://72.61.144.195/api/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ API accessible through Nginx${NC}"
else
    echo -e "${RED}❌ API not accessible through Nginx${NC}"
fi

# Show status
echo -e "\n${GREEN}📊 Services Status:${NC}"
pm2 list
echo ""
sudo systemctl status nginx --no-pager | head -10

echo -e "\n${GREEN}🎉 Setup completed!${NC}"
echo -e "${GREEN}🌐 Website: http://72.61.144.195/${NC}"
echo -e "${GREEN}🔐 Admin: http://72.61.144.195/AdminLogin${NC}"
echo -e "${GREEN}📖 API: http://72.61.144.195/api/health${NC}"
