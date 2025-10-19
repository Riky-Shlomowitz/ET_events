#!/bin/bash

##############################################################################
# PostgreSQL Installation Script for Hostinger VPS
# התקנה אוטומטית של PostgreSQL ומסד נתונים לפרויקט טרכטנברג
##############################################################################

set -e  # Exit on error

echo "🚀 Starting PostgreSQL installation..."
echo "=================================================="

# Update system packages
echo "📦 Updating system packages..."
sudo apt update
sudo apt upgrade -y

# Install PostgreSQL
echo "🗃️ Installing PostgreSQL..."
sudo apt install -y postgresql postgresql-contrib

# Start PostgreSQL service
echo "▶️ Starting PostgreSQL service..."
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL to be ready..."
sleep 5

# Check PostgreSQL status
echo "✅ Checking PostgreSQL status..."
sudo systemctl status postgresql --no-pager -l

echo ""
echo "=================================================="
echo "🎉 PostgreSQL installed successfully!"
echo "=================================================="

# Create database and user
echo ""
echo "🔧 Creating database and user..."
echo "=================================================="

sudo -u postgres psql << EOF
-- Drop existing database and user if they exist
DROP DATABASE IF EXISTS trachtenberg_events;
DROP USER IF EXISTS events_admin;

-- Create new user
CREATE USER events_admin WITH PASSWORD 'Tr@ch2025!';

-- Create database
CREATE DATABASE trachtenberg_events;

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE trachtenberg_events TO events_admin;

-- Connect to the database and grant schema privileges
\c trachtenberg_events

-- Grant schema privileges
GRANT ALL ON SCHEMA public TO events_admin;

-- Allow user to create tables
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO events_admin;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO events_admin;

-- Show databases
\l

-- Show users
\du

EOF

echo ""
echo "=================================================="
echo "✅ Database setup completed!"
echo "=================================================="
echo ""
echo "📊 Database Information:"
echo "   Database Name: trachtenberg_events"
echo "   Username: events_admin"
echo "   Password: Tr@ch2025!"
echo "   Host: localhost"
echo "   Port: 5432"
echo ""
echo "=================================================="

# Configure PostgreSQL to allow local connections
echo "🔐 Configuring PostgreSQL authentication..."

# Backup original files
sudo cp /etc/postgresql/*/main/pg_hba.conf /etc/postgresql/*/main/pg_hba.conf.backup

# Update pg_hba.conf to allow password authentication
sudo sed -i 's/local   all             all                                     peer/local   all             all                                     md5/' /etc/postgresql/*/main/pg_hba.conf
sudo sed -i 's/host    all             all             127.0.0.1\/32            ident/host    all             all             127.0.0.1\/32            md5/' /etc/postgresql/*/main/pg_hba.conf

# Restart PostgreSQL to apply changes
echo "🔄 Restarting PostgreSQL..."
sudo systemctl restart postgresql

echo ""
echo "=================================================="
echo "✅ PostgreSQL configuration updated!"
echo "=================================================="

# Test database connection
echo ""
echo "🧪 Testing database connection..."
PGPASSWORD='Tr@ch2025!' psql -h localhost -U events_admin -d trachtenberg_events -c "SELECT version();" && echo "✅ Connection test PASSED!" || echo "❌ Connection test FAILED!"

echo ""
echo "=================================================="
echo "🎊 PostgreSQL Installation Complete!"
echo "=================================================="
echo ""
echo "📝 Next Steps:"
echo "   1. Install Node.js and dependencies"
echo "   2. Run the main setup script: ./setup-server.sh"
echo "   3. Deploy your application"
echo ""
echo "💡 To connect to PostgreSQL manually:"
echo "   psql -h localhost -U events_admin -d trachtenberg_events"
echo "   Password: Tr@ch2025!"
echo ""
echo "=================================================="

