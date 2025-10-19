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
  {
    id: uuidv4(),
    title: 'אירוע בשרי מפואר',
    description: 'אירוע בשרי יוקרתי עם עיצוב מרשים',
    category: 'besari',
    media_type: 'image',
    file_url: '/images/gallery/besari-1.jpg',
    is_featured: true,
    status: 'active',
    sort_order: 1,
    created_date: new Date().toISOString()
  },
  {
    id: uuidv4(),
    title: 'חגיגה חלבית אלגנטית',
    description: 'אירוע חלבי עם עיצוב עדין ומרשים',
    category: 'halavi',
    media_type: 'image',
    file_url: '/images/gallery/halavi-1.jpg',
    is_featured: true,
    status: 'active',
    sort_order: 2,
    created_date: new Date().toISOString()
  },
  {
    id: uuidv4(),
    title: 'עיצוב שולחן מרשים',
    description: 'כלים וחמרים איכותיים לעיצוב מושלם',
    category: 'kelim',
    media_type: 'image',
    file_url: '/images/gallery/kelim-1.jpg',
    is_featured: false,
    status: 'active',
    sort_order: 3,
    created_date: new Date().toISOString()
  },
  {
    id: uuidv4(),
    title: 'ערב גאלה יוקרתי',
    description: 'אירוע בשרי גדול עם כל הפרטים',
    category: 'besari',
    media_type: 'image',
    file_url: '/images/gallery/besari-2.jpg',
    is_featured: false,
    status: 'active',
    sort_order: 4,
    created_date: new Date().toISOString()
  },
  {
    id: uuidv4(),
    title: 'חתונה רומנטית',
    description: 'חתונה חלבית עם אווירה רומנטית',
    category: 'halavi',
    media_type: 'image',
    file_url: '/images/gallery/halavi-2.jpg',
    is_featured: false,
    status: 'active',
    sort_order: 5,
    created_date: new Date().toISOString()
  },
  {
    id: uuidv4(),
    title: 'כלים מעוצבים',
    description: 'מגוון כלים מעוצבים לאירועים מיוחדים',
    category: 'kelim',
    media_type: 'image',
    file_url: '/images/gallery/kelim-2.jpg',
    is_featured: false,
    status: 'active',
    sort_order: 6,
    created_date: new Date().toISOString()
  },
  {
    id: uuidv4(),
    title: 'בר מצווה מרשים',
    description: 'חגיגת בר מצווה עם עיצוב מיוחד',
    category: 'general',
    media_type: 'image',
    file_url: '/images/gallery/general-1.jpg',
    is_featured: false,
    status: 'active',
    sort_order: 7,
    created_date: new Date().toISOString()
  },
  {
    id: uuidv4(),
    title: 'אירוע עסקי מקצועי',
    description: 'כנס עסקי עם הפקה מקצועית',
    category: 'general',
    media_type: 'image',
    file_url: '/images/gallery/general-2.jpg',
    is_featured: false,
    status: 'active',
    sort_order: 8,
    created_date: new Date().toISOString()
  }
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

