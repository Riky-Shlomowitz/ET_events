# 🚀 מדריך פריסה מפורט ל-Railway - עמנואל טרכטנברג הפקת אירועים

## 📋 תוכן עניינים
1. [הכנת הפרויקט](#הכנת-הפרויקט)
2. [הגדרת בסיס הנתונים](#הגדרת-בסיס-הנתונים)
3. [הכנת קבצי תצורה](#הכנת-קבצי-תצורה)
4. [עדכון הקוד](#עדכון-הקוד)
5. [פריסה ב-Railway](#פריסה-ב-railway)
6. [בדיקות ופתרון בעיות](#בדיקות-ופתרון-בעיות)
7. [תחזוקה שוטפת](#תחזוקה-שוטפת)

---

## 🛠️ הכנת הפרויקט

### שלב 1: יצירת קבצי תצורה

#### 1.1 קובץ `railway.json` (בתיקיית השורש)
```json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm run start:prod",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

#### 1.2 קובץ `Dockerfile` (אופציונלי)
```dockerfile
# Multi-stage build for full-stack app
FROM node:18-alpine AS frontend-build

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

# Backend stage
FROM node:18-alpine AS backend

WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm ci --only=production

COPY backend/ .

# Production stage
FROM node:18-alpine AS production

WORKDIR /app

# Copy frontend build
COPY --from=frontend-build /app/dist ./public

# Copy backend
COPY --from=backend /app ./backend

# Install serve for static files
RUN npm install -g serve

# Expose port
EXPOSE 3000

# Start both frontend and backend
CMD ["sh", "-c", "cd backend && npm start & serve -s public -l 3000"]
```

### שלב 2: עדכון package.json

#### 2.1 package.json הראשי
```json
{
  "name": "trachtenberg-events",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "preview": "vite preview",
    "start:prod": "concurrently \"npm run build\" \"cd backend && npm start\"",
    "start:backend": "cd backend && npm start",
    "dev:full": "concurrently \"npm run dev\" \"npm run start:backend\""
  },
  "dependencies": {
    // ... כל התלויות הקיימות
    "concurrently": "^9.2.1"
  }
}
```

#### 2.2 backend/package.json
```json
{
  "name": "backend",
  "version": "1.0.0",
  "description": "Trachtenberg Events API",
  "main": "src/server.js",
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": ["events", "api", "nodejs", "express"],
  "author": "Trachtenberg Events",
  "license": "ISC",
  "type": "commonjs",
  "engines": {
    "node": ">=18.0.0"
  }
}
```

---

## 🗄️ הגדרת בסיס הנתונים

### אפשרות 1: PostgreSQL ב-Railway (מומלץ)

#### שלב 1: יצירת שירות PostgreSQL
1. היכנס ל-[Railway Dashboard](https://railway.app)
2. לחץ על "New Project"
3. בחר "Deploy from GitHub repo"
4. בחר את ה-repository שלך
5. לחץ על "Add Service" → "Database" → "PostgreSQL"

#### שלב 2: קבלת פרטי החיבור
Railway ייצור אוטומטית:
- `DATABASE_URL` - מחרוזת חיבור מלאה
- `PGHOST` - כתובת השרת
- `PGPORT` - פורט (5432)
- `PGDATABASE` - שם בסיס הנתונים
- `PGUSER` - שם משתמש
- `PGPASSWORD` - סיסמה

### אפשרות 2: Supabase (חלופה)

#### שלב 1: יצירת פרויקט ב-Supabase
1. היכנס ל-[Supabase](https://supabase.com)
2. לחץ על "New Project"
3. בחר ארגון
4. הזן שם פרויקט: `trachtenberg-events`
5. הזן סיסמה חזקה
6. בחר אזור קרוב (Europe West)

#### שלב 2: קבלת פרטי החיבור
1. לך ל-Settings → Database
2. העתק את ה-Connection String
3. השתמש בו כ-`DATABASE_URL`

---

## ⚙️ הכנת קבצי תצורה

### שלב 1: יצירת backend/.env.example
```env
# Database Configuration
DATABASE_URL=postgresql://username:password@host:port/database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=trachtenberg_events
DB_USER=events_admin
DB_PASS=secure_password_123

# Server Configuration
PORT=3000
NODE_ENV=production
FRONTEND_URL=https://your-app.railway.app

# JWT Secret (חשוב! שנה לסיסמה חזקה)
JWT_SECRET=your_super_secret_jwt_key_here_2025

# File Upload Configuration
UPLOAD_DIR=uploads
MAX_FILE_SIZE=10485760
```

### שלב 2: יצירת .env.local (לפיתוח מקומי)
```env
# Frontend Environment Variables
VITE_API_URL=http://localhost:3000/api
VITE_APP_NAME=Trachtenberg Events
VITE_APP_VERSION=1.0.0
```

---

## 🔧 עדכון הקוד

### שלב 1: יצירת API Client אמיתי

#### קובץ: `src/lib/apiClient.js`
```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

class ApiClient {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = localStorage.getItem('auth_token');
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  }

  // Gallery methods
  async getGalleryItems() {
    return this.request('/gallery');
  }

  async getGalleryItem(id) {
    return this.request(`/gallery/${id}`);
  }

  async createGalleryItem(data) {
    return this.request('/gallery', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateGalleryItem(id, data) {
    return this.request(`/gallery/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteGalleryItem(id) {
    return this.request(`/gallery/${id}`, {
      method: 'DELETE',
    });
  }

  async getGalleryStats() {
    return this.request('/gallery/stats');
  }

  // Auth methods
  async login(email, password) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (response.token) {
      localStorage.setItem('auth_token', response.token);
    }
    
    return response;
  }

  async logout() {
    localStorage.removeItem('auth_token');
    return this.request('/auth/logout', { method: 'POST' });
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  async changePassword(currentPassword, newPassword) {
    return this.request('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  }

  // File upload
  async uploadFile(file) {
    const formData = new FormData();
    formData.append('file', file);

    const token = localStorage.getItem('auth_token');
    const response = await fetch(`${API_BASE_URL}/gallery/upload`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Upload failed');
    }

    return response.json();
  }
}

export default new ApiClient();
```

### שלב 2: עדכון localData.js להשתמש ב-API

#### קובץ: `src/lib/localData.js` (עדכון)
```javascript
// Local data management system for Trachtenberg Events
import { v4 as uuidv4 } from 'uuid';
import apiClient from './apiClient';

// Check if we're in development mode (use localStorage) or production (use API)
const isDevelopment = import.meta.env.DEV;

// Storage keys for localStorage fallback
const GALLERY_ITEMS_KEY = 'gallery_items';
const USER_SESSION_KEY = 'user_session';

// Default gallery items with local images
const defaultGalleryItems = [
  // ... (same as before)
];

// Gallery Item management
export const GalleryItem = {
  // List all gallery items with optional sorting
  async list(sortBy = '-created_date') {
    if (isDevelopment) {
      // Use localStorage in development
      try {
        const items = JSON.parse(localStorage.getItem(GALLERY_ITEMS_KEY)) || [];
        
        if (items.length === 0) {
          localStorage.setItem(GALLERY_ITEMS_KEY, JSON.stringify(defaultGalleryItems));
          return [...defaultGalleryItems];
        }
        
        const sortedItems = [...items].sort((a, b) => {
          const field = sortBy.startsWith('-') ? sortBy.slice(1) : sortBy;
          const direction = sortBy.startsWith('-') ? -1 : 1;
          
          if (field === 'created_date') {
            return direction * (new Date(b[field]) - new Date(a[field]));
          }
          
          if (typeof a[field] === 'string') {
            return direction * a[field].localeCompare(b[field]);
          }
          
          return direction * (a[field] - b[field]);
        });
        
        return sortedItems;
      } catch (error) {
        console.error('Error loading gallery items:', error);
        return [...defaultGalleryItems];
      }
    } else {
      // Use API in production
      try {
        return await apiClient.getGalleryItems();
      } catch (error) {
        console.error('Error loading gallery items from API:', error);
        return [];
      }
    }
  },

  // Get single item by ID
  async get(id) {
    if (isDevelopment) {
      const items = await this.list();
      return items.find(item => item.id === id);
    } else {
      try {
        return await apiClient.getGalleryItem(id);
      } catch (error) {
        console.error('Error getting gallery item:', error);
        return null;
      }
    }
  },

  // Create new gallery item
  async create(itemData) {
    if (isDevelopment) {
      try {
        const items = await this.list();
        const newItem = {
          id: uuidv4(),
          ...itemData,
          created_date: new Date().toISOString(),
          updated_date: new Date().toISOString()
        };
        
        items.push(newItem);
        localStorage.setItem(GALLERY_ITEMS_KEY, JSON.stringify(items));
        return newItem;
      } catch (error) {
        console.error('Error creating gallery item:', error);
        throw error;
      }
    } else {
      try {
        return await apiClient.createGalleryItem(itemData);
      } catch (error) {
        console.error('Error creating gallery item via API:', error);
        throw error;
      }
    }
  },

  // Update existing gallery item
  async update(id, updateData) {
    if (isDevelopment) {
      try {
        const items = await this.list();
        const itemIndex = items.findIndex(item => item.id === id);
        
        if (itemIndex === -1) {
          throw new Error('Item not found');
        }
        
        items[itemIndex] = {
          ...items[itemIndex],
          ...updateData,
          updated_date: new Date().toISOString()
        };
        
        localStorage.setItem(GALLERY_ITEMS_KEY, JSON.stringify(items));
        return items[itemIndex];
      } catch (error) {
        console.error('Error updating gallery item:', error);
        throw error;
      }
    } else {
      try {
        return await apiClient.updateGalleryItem(id, updateData);
      } catch (error) {
        console.error('Error updating gallery item via API:', error);
        throw error;
      }
    }
  },

  // Delete gallery item
  async delete(id) {
    if (isDevelopment) {
      try {
        const items = await this.list();
        const filteredItems = items.filter(item => item.id !== id);
        localStorage.setItem(GALLERY_ITEMS_KEY, JSON.stringify(filteredItems));
        return true;
      } catch (error) {
        console.error('Error deleting gallery item:', error);
        throw error;
      }
    } else {
      try {
        await apiClient.deleteGalleryItem(id);
        return true;
      } catch (error) {
        console.error('Error deleting gallery item via API:', error);
        throw error;
      }
    }
  }
};

// User/Auth management
export const User = {
  // Login
  async login(email, password) {
    if (isDevelopment) {
      // Simple hardcoded admin credentials for development
      if (email === 'admin@trachtenberg.co.il' && password === 'Tr@ch2025!') {
        const session = {
          user: { email, role: 'admin' },
          token: 'local-admin-token',
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
        };
        localStorage.setItem(USER_SESSION_KEY, JSON.stringify(session));
        return session;
      }
      throw new Error('Invalid credentials');
    } else {
      try {
        return await apiClient.login(email, password);
      } catch (error) {
        console.error('Error logging in via API:', error);
        throw error;
      }
    }
  },

  // Check if user is authenticated
  async isAuthenticated() {
    if (isDevelopment) {
      try {
        const session = JSON.parse(localStorage.getItem(USER_SESSION_KEY));
        if (!session || new Date(session.expires) < new Date()) {
          return false;
        }
        return true;
      } catch {
        return false;
      }
    } else {
      try {
        await apiClient.getCurrentUser();
        return true;
      } catch {
        return false;
      }
    }
  },

  // Logout
  async logout() {
    if (isDevelopment) {
      localStorage.removeItem(USER_SESSION_KEY);
      return true;
    } else {
      try {
        await apiClient.logout();
        return true;
      } catch (error) {
        console.error('Error logging out via API:', error);
        return false;
      }
    }
  }
};

// File upload simulation (for development) or real upload (for production)
export const UploadFile = async ({ file }) => {
  if (isDevelopment) {
    // Development mode - use object URLs
    return new Promise((resolve, reject) => {
      if (!file) {
        reject(new Error('No file provided'));
        return;
      }

      try {
        const objectUrl = URL.createObjectURL(file);
        const fileId = uuidv4();
        
        const fileData = {
          id: fileId,
          name: file.name,
          type: file.type,
          size: file.size,
          objectUrl: objectUrl,
          uploaded_at: new Date().toISOString()
        };
        
        const files = JSON.parse(localStorage.getItem('uploaded_files') || '[]');
        files.push(fileData);
        localStorage.setItem('uploaded_files', JSON.stringify(files));
        
        const demoUrls = [
          '/images/gallery/general-1.jpg',
          '/images/gallery/general-2.jpg',
          '/images/gallery/besari-1.jpg',
          '/images/gallery/halavi-1.jpg',
          '/images/gallery/kelim-1.jpg'
        ];
        
        const randomUrl = demoUrls[Math.floor(Math.random() * demoUrls.length)];
        resolve({ file_url: randomUrl });
      } catch (error) {
        reject(new Error('Failed to process file'));
      }
    });
  } else {
    // Production mode - use real API upload
    try {
      return await apiClient.uploadFile(file);
    } catch (error) {
      console.error('Error uploading file via API:', error);
      throw error;
    }
  }
};

// Initialize default data if needed (development only)
export const initializeDefaultData = () => {
  if (isDevelopment) {
    const existingItems = localStorage.getItem(GALLERY_ITEMS_KEY);
    if (!existingItems) {
      localStorage.setItem(GALLERY_ITEMS_KEY, JSON.stringify(defaultGalleryItems));
    }
  }
};

// Call initialization
initializeDefaultData();
```

---

## 🚀 פריסה ב-Railway

### שלב 1: הכנת Repository

#### 1.1 יצירת Repository ב-GitHub
1. היכנס ל-[GitHub](https://github.com)
2. לחץ על "New repository"
3. שם: `ET_events`
4. תיאור: `Trachtenberg Events - Full Stack Event Management System`
5. בחר "Public" או "Private"
6. **אל תסמן** "Add a README file"
7. לחץ על "Create repository"

#### 1.2 העלאה ל-GitHub
```bash
# בתיקיית הפרויקט
git init
git add .
git commit -m "Initial commit - Ready for Railway deployment"
git branch -M main
git remote add origin https://github.com/Riky-Shlomowitz/ET_events.git
git push -u origin main
```

### שלב 2: חיבור ל-Railway

#### 2.1 יצירת חשבון Railway
1. היכנס ל-[Railway](https://railway.app)
2. לחץ על "Login"
3. בחר "Login with GitHub"
4. אשר את ההרשאות

#### 2.2 יצירת פרויקט
1. לחץ על "New Project"
2. בחר "Deploy from GitHub repo"
3. בחר את ה-repository `ET_events`
4. לחץ על "Deploy Now"

### שלב 3: הגדרת Environment Variables

#### 3.1 הוספת PostgreSQL
1. ב-Railway Dashboard, לחץ על "Add Service"
2. בחר "Database" → "PostgreSQL"
3. Railway ייצור אוטומטית את המשתנים:
   - `DATABASE_URL`
   - `PGHOST`, `PGPORT`, `PGDATABASE`, `PGUSER`, `PGPASSWORD`

#### 3.2 הוספת משתני סביבה נוספים
לחץ על "Variables" והוסף:

```env
# Server Configuration
PORT=3000
NODE_ENV=production
FRONTEND_URL=https://your-app.railway.app

# JWT Secret (חשוב! שנה לסיסמה חזקה)
JWT_SECRET=your_super_secret_jwt_key_here_2025

# File Upload
UPLOAD_DIR=uploads
MAX_FILE_SIZE=10485760

# Frontend Environment
VITE_API_URL=https://your-app.railway.app/api
VITE_APP_NAME=Trachtenberg Events
VITE_APP_VERSION=1.0.0
```

### שלב 4: הגדרת Build Settings

#### 4.1 Build Command
```
npm install && npm run build
```

#### 4.2 Start Command
```
npm run start:prod
```

#### 4.3 Root Directory
```
/
```

---

## ✅ בדיקות ופתרון בעיות

### בדיקה 1: Build מקומי
```bash
# בדיקת build של הפרונט
npm run build

# בדיקת build של הבקאנד
cd backend
npm install
npm start
```

### בדיקה 2: API מקומי
```bash
# בדיקת health check
curl http://localhost:3000/api/health

# בדיקת API docs
curl http://localhost:3000/api
```

### בדיקה 3: חיבור DB
```bash
# בדיקת חיבור לבסיס הנתונים
curl http://localhost:3000/api/gallery
```

### פתרון בעיות נפוצות

#### בעיה: Build נכשל
**פתרון:**
1. בדוק שהכל הקבצים קיימים
2. בדוק שאין שגיאות syntax
3. הרץ `npm install` מחדש

#### בעיה: DB לא מתחבר
**פתרון:**
1. בדוק את `DATABASE_URL`
2. בדוק שהמשתנים מוגדרים נכון
3. בדוק שה-PostgreSQL רץ

#### בעיה: CORS errors
**פתרון:**
1. בדוק את `FRONTEND_URL`
2. בדוק את הגדרות CORS ב-backend

#### בעיה: קבצים לא נשמרים
**פתרון:**
1. בדוק את `UPLOAD_DIR`
2. בדוק הרשאות כתיבה
3. בדוק את `MAX_FILE_SIZE`

---

## 🔧 תחזוקה שוטפת

### עדכון האפליקציה
```bash
# עשה שינויים בקוד
git add .
git commit -m "Update: description of changes"
git push origin main

# Railway יבנה ויפרוס אוטומטית
```

### מעקב אחר לוגים
1. ב-Railway Dashboard
2. לחץ על השירות
3. לך ל-"Logs" tab
4. עקוב אחר שגיאות

### גיבוי בסיס הנתונים
1. ב-Railway Dashboard
2. לחץ על PostgreSQL service
3. לך ל-"Data" tab
4. לחץ על "Backup" או "Export"

### ניטור ביצועים
1. ב-Railway Dashboard
2. לך ל-"Metrics" tab
3. עקוב אחר:
   - CPU usage
   - Memory usage
   - Response time
   - Error rate

---

## 📞 תמיכה ועזרה

### Railway Support
- [Railway Docs](https://docs.railway.app)
- [Railway Discord](https://discord.gg/railway)
- [Railway GitHub](https://github.com/railwayapp)

### GitHub Repository
- [ET_events Repository](https://github.com/Riky-Shlomowitz/ET_events)

### קשר ישיר
- Email: admin@trachtenberg.co.il
- Website: https://your-app.railway.app

---

## 🎯 סיכום

לאחר ביצוע כל השלבים:
1. ✅ האפליקציה תהיה זמינה ב-`https://your-app.railway.app`
2. ✅ בסיס הנתונים יהיה מחובר ופועל
3. ✅ ניהול התמונות יעבוד במלואו
4. ✅ המערכת תהיה מוכנה לשימוש

**בהצלחה! 🚀**
