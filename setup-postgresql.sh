#!/bin/bash
# PostgreSQL Installation Script for Hostinger VPS
# Run this script on your Hostinger server

set -e  # Exit on error

echo "🚀 Starting PostgreSQL installation..."

# Update system
echo "📦 Updating system packages..."
apt update
apt upgrade -y

# Install PostgreSQL
echo "📥 Installing PostgreSQL..."
apt install postgresql postgresql-contrib -y

# Start and enable PostgreSQL
echo "▶️  Starting PostgreSQL service..."
systemctl start postgresql
systemctl enable postgresql

# Wait for PostgreSQL to start
sleep 3

# Create database and user
echo "👤 Creating database and user..."
sudo -u postgres psql << EOF
-- Create user
CREATE USER events_admin WITH PASSWORD 'Tr@ch2025!';

-- Create database
CREATE DATABASE trachtenberg_events OWNER events_admin;

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE trachtenberg_events TO events_admin;

-- Connect to database
\c trachtenberg_events

-- Grant schema privileges
GRANT ALL ON SCHEMA public TO events_admin;

-- Exit
\q
EOF

# Configure PostgreSQL to accept local connections
echo "🔧 Configuring PostgreSQL..."

# Backup original config
cp /etc/postgresql/*/main/pg_hba.conf /etc/postgresql/*/main/pg_hba.conf.backup

# Allow local connections
echo "host    all             all             127.0.0.1/32            md5" >> /etc/postgresql/*/main/pg_hba.conf

# Restart PostgreSQL
echo "🔄 Restarting PostgreSQL..."
systemctl restart postgresql

# Check status
echo "✅ Checking PostgreSQL status..."
systemctl status postgresql --no-pager

# Test connection
echo "🧪 Testing database connection..."
sudo -u postgres psql -d trachtenberg_events -c "SELECT 'Database connection successful!' as status;"

echo ""
echo "✅ PostgreSQL installation completed successfully!"
echo ""
echo "📊 Database details:"
echo "   Database: trachtenberg_events"
echo "   User: events_admin"
echo "   Password: Tr@ch2025!"
echo "   Host: localhost"
echo "   Port: 5432"
echo ""
echo "🎉 You can now restart your Node.js backend!"
