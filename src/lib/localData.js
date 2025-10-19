// Local data management system for Trachtenberg Events
import { v4 as uuidv4 } from 'uuid';
import apiClient from './apiClient';

// Auto-detect if API is available
let useAPI = true; // Try API first
let apiCheckDone = false;

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

// Helper function to check API availability and fallback to localStorage
async function withAPIFallback(apiCall, localStorageFallback) {
  if (useAPI) {
    try {
      const result = await apiCall();
      apiCheckDone = true;
      return result;
    } catch (error) {
      console.warn('API call failed, using localStorage fallback:', error);
      if (!apiCheckDone) {
        useAPI = false; // Switch to localStorage after first API failure
        apiCheckDone = true;
      }
      return localStorageFallback();
    }
  } else {
    return localStorageFallback();
  }
}

// Gallery Item management
export const GalleryItem = {
  // List all gallery items with optional sorting
  async list(sortBy = '-created_date') {
    return withAPIFallback(
      // API call
      () => apiClient.getGalleryItems(),
      // localStorage fallback
      () => {
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
      }
    );
  },

  // Get single item by ID
  async get(id) {
    return withAPIFallback(
      () => apiClient.getGalleryItem(id),
      async () => {
        const items = await this.list();
        return items.find(item => item.id === id);
      }
    );
  },

  // Create new gallery item
  async create(itemData) {
    return withAPIFallback(
      () => apiClient.createGalleryItem(itemData),
      async () => {
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
      }
    );
  },

  // Update existing gallery item
  async update(id, updateData) {
    return withAPIFallback(
      () => apiClient.updateGalleryItem(id, updateData),
      async () => {
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
      }
    );
  },

  // Delete gallery item
  async delete(id) {
    return withAPIFallback(
      () => apiClient.deleteGalleryItem(id),
      async () => {
        try {
          const items = await this.list();
          const filteredItems = items.filter(item => item.id !== id);
          localStorage.setItem(GALLERY_ITEMS_KEY, JSON.stringify(filteredItems));
          return true;
        } catch (error) {
          console.error('Error deleting gallery item:', error);
          throw error;
        }
      }
    );
  }
};

// User/Auth management
export const User = {
  // Login
  async login(email, password) {
    return withAPIFallback(
      () => apiClient.login(email, password),
      () => {
        // Simple hardcoded admin credentials for fallback
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
      }
    );
  },

  // Check if user is authenticated
  async isAuthenticated() {
    return withAPIFallback(
      async () => {
        await apiClient.getCurrentUser();
        return true;
      },
      () => {
        try {
          const session = JSON.parse(localStorage.getItem(USER_SESSION_KEY));
          if (!session || new Date(session.expires) < new Date()) {
            return false;
          }
          return true;
        } catch {
          return false;
        }
      }
    );
  },

  // Logout
  async logout() {
    return withAPIFallback(
      () => apiClient.logout(),
      () => {
        localStorage.removeItem(USER_SESSION_KEY);
        return true;
      }
    );
  }
};

// File upload simulation (for development) or real upload (for production)
export const UploadFile = async ({ file }) => {
  return withAPIFallback(
    () => apiClient.uploadFile(file),
    () => {
      // Fallback - use demo images
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
    }
  );
};

// Initialize default data if needed
export const initializeDefaultData = () => {
  const existingItems = localStorage.getItem(GALLERY_ITEMS_KEY);
  if (!existingItems) {
    localStorage.setItem(GALLERY_ITEMS_KEY, JSON.stringify(defaultGalleryItems));
  }
};

// Call initialization
initializeDefaultData();

