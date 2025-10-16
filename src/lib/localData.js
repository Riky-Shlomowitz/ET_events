// Local data management system to replace Base44
import { v4 as uuidv4 } from 'uuid';

// Storage keys
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
    try {
      const items = JSON.parse(localStorage.getItem(GALLERY_ITEMS_KEY)) || [];
      
      // If no items in storage, initialize with defaults
      if (items.length === 0) {
        localStorage.setItem(GALLERY_ITEMS_KEY, JSON.stringify(defaultGalleryItems));
        return [...defaultGalleryItems];
      }
      
      // Sort items
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
  },

  // Get single item by ID
  async get(id) {
    const items = await this.list();
    return items.find(item => item.id === id);
  },

  // Create new gallery item
  async create(itemData) {
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
  },

  // Update existing gallery item
  async update(id, updateData) {
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
  },

  // Delete gallery item
  async delete(id) {
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
};

// User/Auth management (simple local implementation)
export const User = {
  // Simple login check
  async login(email, password) {
    // Simple hardcoded admin credentials
    if (email === 'admin@trachtenberg.co.il' && password === 'Tr@ch2025!') {
      const session = {
        user: { email, role: 'admin' },
        token: 'local-admin-token',
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
      };
      localStorage.setItem(USER_SESSION_KEY, JSON.stringify(session));
      return session;
    }
    throw new Error('Invalid credentials');
  },

  // Check if user is authenticated
  async isAuthenticated() {
    try {
      const session = JSON.parse(localStorage.getItem(USER_SESSION_KEY));
      if (!session || new Date(session.expires) < new Date()) {
        return false;
      }
      return true;
    } catch {
      return false;
    }
  },

  // Logout
  async logout() {
    localStorage.removeItem(USER_SESSION_KEY);
    return true;
  }
};

// File upload simulation (stores base64 locally)
export const UploadFile = async ({ file }) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('No file provided'));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      // In a real app, this would upload to a server
      // For now, we'll create a local URL
      const fileId = uuidv4();
      const fileUrl = reader.result; // This will be a data URL
      
      // Store file data in localStorage (for demo purposes)
      const fileData = {
        id: fileId,
        name: file.name,
        type: file.type,
        size: file.size,
        url: fileUrl,
        uploaded_at: new Date().toISOString()
      };
      
      // Store in a files collection
      const files = JSON.parse(localStorage.getItem('uploaded_files') || '[]');
      files.push(fileData);
      localStorage.setItem('uploaded_files', JSON.stringify(files));
      
      resolve({ file_url: fileUrl });
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsDataURL(file);
  });
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

