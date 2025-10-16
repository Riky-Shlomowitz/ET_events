const { Sequelize } = require('sequelize');
require('dotenv').config();

// Database configuration
const sequelize = new Sequelize(
  process.env.DB_NAME || 'trachtenberg_events',
  process.env.DB_USER || 'events_admin', 
  process.env.DB_PASS || 'secure_password_123',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    define: {
      timestamps: true,
      underscored: true, // Use snake_case instead of camelCase
    }
  }
);

// Test database connection
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('✅ התחברות לבסיס הנתונים הצליחה');
    return true;
  } catch (error) {
    console.error('❌ שגיאה בהתחברות לבסיס הנתונים:', error.message);
    return false;
  }
}

module.exports = { sequelize, testConnection };
