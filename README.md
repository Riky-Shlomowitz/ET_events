# Trachtenberg Events

A professional full-stack event planning platform for managing events, galleries, and client interactions.

## 🌟 Features

- **Event Gallery Management** - Upload and manage photos and videos with priority-based sorting
- **Admin Dashboard** - Full control panel for content management
- **Responsive Design** - Beautiful, mobile-first interface
- **Secure Authentication** - JWT-based admin authentication
- **File Upload System** - Support for images and videos (up to 200MB)
- **Priority System** - 5-star rating system for gallery items
- **HTTPS Support** - Secure SSL/TLS encryption with Let's Encrypt

## 🛠️ Tech Stack

### Frontend
- **React** - UI library
- **Vite** - Build tool and dev server
- **TailwindCSS** - Utility-first CSS framework
- **Shadcn/ui** - Component library

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **PostgreSQL** - Database
- **Sequelize** - ORM
- **JWT** - Authentication
- **Multer** - File upload handling

### Infrastructure
- **Nginx** - Web server and reverse proxy
- **PM2** - Process manager
- **GitHub Actions** - CI/CD pipeline
- **Hostinger VPS** - Hosting platform

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Riky-Shlomowitz/ET_events.git
cd ET_events
```

2. **Install dependencies**
```bash
# Frontend
npm install

# Backend
cd backend
npm install
```

3. **Configure environment variables**

Create `.env` file in `backend/` directory:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=trachtenberg_events
DB_USER=your_db_user
DB_PASS=your_db_password

PORT=3000
NODE_ENV=development

FRONTEND_URL=http://localhost:5173
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d

ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your_admin_password

UPLOAD_DIR=./uploads
MAX_FILE_SIZE=209715200
```

4. **Set up database**
```bash
# Create PostgreSQL database
createdb trachtenberg_events

# Tables will be created automatically by Sequelize
```

5. **Run the application**

Development mode:
```bash
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Backend
cd backend
npm run dev
```

Production mode:
```bash
# Build frontend
npm run build

# Start backend
cd backend
npm start
```

## 📁 Project Structure

```
trachtenberg-events/
├── backend/
│   ├── src/
│   │   ├── config/        # Database and app configuration
│   │   ├── controllers/   # Request handlers
│   │   ├── middleware/    # Authentication, file upload
│   │   ├── models/        # Sequelize models
│   │   ├── routes/        # API routes
│   │   └── server.js      # Entry point
│   └── uploads/           # Uploaded files
├── src/
│   ├── components/        # React components
│   ├── lib/              # Utilities and API client
│   ├── pages/            # Page components
│   └── main.jsx          # App entry point
├── public/               # Static assets
└── .github/
    └── workflows/        # CI/CD pipelines
```

## 🔐 Admin Access

Access the admin dashboard at `/adminlogin`

Default credentials are set via environment variables:
- Email: Configured in `ADMIN_EMAIL`
- Password: Configured in `ADMIN_PASSWORD`

## 📸 Gallery Management

The admin dashboard allows you to:
- Upload images and videos (up to 200MB)
- Set priority (0-5 stars) for each item
- Organize by categories
- Manage visibility (active/inactive)
- Delete items (removes both database record and physical file)

## 🌐 Deployment

The project includes automated deployment via GitHub Actions:

1. Push to `main` branch triggers automatic deployment
2. Frontend is built and deployed to `/var/www/html`
3. Backend is restarted with PM2
4. Nginx serves the application

Manual deployment:
```bash
npm run build
pm2 restart trachtenberg-backend
```

## 📝 API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `GET /api/auth/profile` - Get user profile
- `POST /api/auth/logout` - Logout

### Gallery
- `GET /api/gallery` - Get all gallery items
- `POST /api/gallery` - Create gallery item
- `PUT /api/gallery/:id` - Update gallery item
- `DELETE /api/gallery/:id` - Delete gallery item
- `POST /api/gallery/upload` - Upload file

## 🤝 Contributing

This is a private project. For any questions or suggestions, please contact the repository owner.

## 📄 License

All rights reserved.

## 🔗 Links

- **Live Site**: https://trachtenberg.sbs
- **Repository**: https://github.com/Riky-Shlomowitz/ET_events

---

Built with ❤️ for Trachtenberg Events

