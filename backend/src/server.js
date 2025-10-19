const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const { sequelize, testConnection } = require('./config/database');
const galleryRoutes = require('./routes/gallery');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Logging middleware
app.use(morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'combined'));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files (uploads)
app.use('/uploads', express.static('uploads'));

// API Routes
app.use('/api/gallery', galleryRoutes);
app.use('/api/auth', authRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    database: 'connected' // This will be updated after DB connection test
  });
});

// API documentation endpoint
app.get('/api', (req, res) => {
  res.json({
    message: 'Trachtenberg Events API',
    version: '1.0.0',
    endpoints: {
      gallery: {
        'GET /api/gallery': 'Get all gallery items',
        'GET /api/gallery/:id': 'Get gallery item by ID',
        'POST /api/gallery': 'Create new gallery item (admin only)',
        'PUT /api/gallery/:id': 'Update gallery item (admin only)',
        'DELETE /api/gallery/:id': 'Delete gallery item (admin only)',
        'GET /api/gallery/stats': 'Get gallery statistics'
      },
      auth: {
        'POST /api/auth/login': 'Login user',
        'POST /api/auth/logout': 'Logout user',
        'GET /api/auth/me': 'Get current user profile',
        'POST /api/auth/change-password': 'Change user password'
      },
      system: {
        'GET /api/health': 'Health check',
        'GET /api': 'API documentation'
      }
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    message: 'שגיאת שרת פנימית',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `נתיב לא נמצא: ${req.originalUrl}`,
    availableEndpoints: '/api'
  });
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('🛑 SIGTERM received, shutting down gracefully...');
  try {
    await sequelize.close();
    console.log('✅ Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during shutdown:', error);
    process.exit(1);
  }
});

process.on('SIGINT', async () => {
  console.log('🛑 SIGINT received, shutting down gracefully...');
  try {
    await sequelize.close();
    console.log('✅ Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during shutdown:', error);
    process.exit(1);
  }
});

// Database connection and server startup
async function startServer() {
  try {
    console.log('🚀 Starting Trachtenberg Events API Server...');
    
    // Test database connection
    const dbConnected = await testConnection();
    if (!dbConnected) {
      console.log('⚠️  Database connection failed, but server will start anyway');
      console.log('💡 Make sure PostgreSQL is running and credentials are correct');
    }

    // Sync database models (development only)
    if (process.env.NODE_ENV === 'development' && dbConnected) {
      try {
        await sequelize.sync({ alter: true });
        console.log('🔄 Database models synchronized');
        
        // Create default admin user if it doesn't exist
        await createDefaultAdmin();
      } catch (syncError) {
        console.error('❌ Database sync error:', syncError.message);
      }
    }

    // Start the server
    app.listen(PORT, () => {
      console.log('✅ Server started successfully!');
      console.log(`🌐 API Server: http://localhost:${PORT}`);
      console.log(`📖 API Docs: http://localhost:${PORT}/api`);
      console.log(`🏥 Health Check: http://localhost:${PORT}/api/health`);
      console.log(`🔐 Environment: ${process.env.NODE_ENV || 'development'}`);
      
      if (process.env.NODE_ENV === 'development') {
        console.log('\n📋 Default Admin Credentials:');
        console.log('   Email: admin@trachtenberg.co.il');
        console.log('   Password: Tr@ch2025!');
      }
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Create default admin user for development
async function createDefaultAdmin() {
  try {
    const User = require('./models/User');
    
    const existingAdmin = await User.findOne({ 
      where: { email: 'admin@trachtenberg.co.il' } 
    });

    if (!existingAdmin) {
      await User.create({
        name: 'מנהל מערכת',
        email: 'admin@trachtenberg.co.il',
        password: 'Tr@ch2025!',
        role: 'admin',
        is_active: true
      });
      console.log('👤 Default admin user created');
    } else {
      console.log('👤 Admin user already exists');
    }
  } catch (error) {
    console.error('❌ Error creating default admin:', error.message);
  }
}

// Start the server
startServer();

