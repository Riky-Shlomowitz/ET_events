
import { useState, useEffect, useCallback } from 'react';
import { GalleryItem, UploadFile } from '@/lib/localData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Upload, 
  Image as ImageIcon, 
  Video, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  Star,
  LogOut,
  Plus,
  Save,
  X,
  Check,
  AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [galleryItems, setGalleryItems] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [alert, setAlert] = useState({ type: '', message: '' });

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'general',
    media_type: 'image',
    is_featured: false,
    status: 'active',
    sort_order: 0,
    file_url: ''
  });

  const categories = [
    { value: 'besari', label: 'בשרי' },
    { value: 'halavi', label: 'חלבי' },
    { value: 'kelim', label: 'כלים' },
    { value: 'general', label: 'כללי' }
  ];

  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert({ type: '', message: '' }), 5000);
  };

  // Memoize loadGalleryItems to avoid dependency issues
  const loadGalleryItems = useCallback(async () => {
    try {
      const items = await GalleryItem.list('-created_date');
      setGalleryItems(items);
      } catch (err) {
        // showAlert is a stable function as setAlert is stable, so no need to list it as dependency
        showAlert('error', 'שגיאה בטעינת פריטי הגלריה');
        console.error('Error loading gallery:', err);
      }
  }, []); // showAlert is stable, so no dependencies needed for this useCallback

  // Load gallery items
  useEffect(() => {
    loadGalleryItems();
  }, [loadGalleryItems]);

  const handleFileUpload = async (files) => {
    const fileList = Array.from(files);
    setUploadingFiles(fileList.map(file => ({ file, progress: 0, status: 'uploading' })));

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      try {
        // Update progress
        setUploadingFiles(prev => 
          prev.map((item, index) => 
            index === i ? { ...item, progress: 50 } : item
          )
        );

        const { file_url } = await UploadFile({ file });

        // Create gallery item
        // Check both MIME type and file extension
        const videoExtensions = ['mp4', 'mov', 'avi', 'webm', 'mpeg', 'mpg'];
        const fileExtension = file.name.split('.').pop().toLowerCase();
        const isVideo = file.type.startsWith('video/') || videoExtensions.includes(fileExtension);
        const mediaType = isVideo ? 'video' : 'image';
        const newItem = {
          title: '',
          description: '',
          category: 'general',
          media_type: mediaType,
          file_url: file_url,
          is_featured: false,
          status: 'active',
          sort_order: galleryItems.length // This might need adjustment if galleryItems changes between uploads
        };

        await GalleryItem.create(newItem);

        // Update progress
        setUploadingFiles(prev => 
          prev.map((item, index) => 
            index === i ? { ...item, progress: 100, status: 'completed' } : item
          )
        );

      } catch (err) {
        setUploadingFiles(prev => 
          prev.map((item, index) => 
            index === i ? { ...item, status: 'error' } : item
          )
        );
        showAlert('error', `שגיאה בהעלאת קובץ ${file.name}`);
        console.error('Upload error:', err);
      }
    }

    // Reload gallery items
    setTimeout(() => {
      setUploadingFiles([]);
      loadGalleryItems();
      showAlert('success', `${fileList.length} קבצים הועלו בהצלחה`);
    }, 1000);
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description || '',
      category: item.category,
      media_type: item.media_type,
      is_featured: item.is_featured || false,
      status: item.status,
      sort_order: item.sort_order || 0,
      file_url: item.file_url
    });
  };

  const handleSaveItem = async () => {
    try {
      if (editingItem && editingItem.id) { // Check for editing an existing item
        await GalleryItem.update(editingItem.id, formData);
        showAlert('success', 'הפריט עודכן בהצלחה');
      } else { // Creating a new item
        if (!formData.file_url) {
            showAlert('error', 'יש להעלות קובץ עבור פריט חדש.');
            return;
        }
        await GalleryItem.create(formData);
        showAlert('success', 'פריט חדש נוצר בהצלחה');
      }
      
      setEditingItem(null);
      setFormData({
        title: '',
        description: '',
        category: 'general',
        media_type: 'image',
        is_featured: false,
        status: 'active',
        sort_order: 0,
        file_url: ''
      });
      loadGalleryItems();
    } catch (err) {
      console.error("Error saving item:", err);
      showAlert('error', 'שגיאה בשמירת הפריט');
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (confirm('האם אתם בטוחים שברצונכם למחוק פריט זה?')) {
      try {
        await GalleryItem.delete(itemId);
        showAlert('success', 'הפריט נמחק בהצלחה');
        loadGalleryItems();
      } catch (err) {
        showAlert('error', 'שגיאה במחיקת הפריט');
        console.error('Delete error:', err);
      }
    }
  };

  const toggleItemStatus = async (item) => {
    try {
      const newStatus = item.status === 'active' ? 'inactive' : 'active';
      await GalleryItem.update(item.id, { ...item, status: newStatus });
      showAlert('success', `הפריט ${newStatus === 'active' ? 'הופעל' : 'הוסתר'}`);
      loadGalleryItems();
    } catch (err) {
      showAlert('error', 'שגיאה בעדכון הסטטוס');
      console.error('Status update error:', err);
    }
  };

  const handleLogout = () => {
    navigate(createPageUrl('EventPlanning'));
  };

  const handleBackToSite = () => {
    navigate(createPageUrl('EventPlanning'));
  };

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <img 
                src="/images/logo.png" 
                alt="לוגו" 
                className="h-8 w-auto"
              />
              <h1 className="text-xl font-bold text-gray-900">מערכת ניהול תוכן</h1>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                onClick={handleBackToSite}
                variant="outline" 
                className="flex items-center gap-2"
              >
                <Eye className="w-4 h-4" />
                צפייה באתר
              </Button>
              <Button 
                onClick={handleLogout}
                variant="outline" 
                className="flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4" />
                יציאה
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Alerts */}
        {alert.message && (
          <Alert className={`mb-6 ${alert.type === 'error' ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}`}>
            <AlertCircle className="w-4 h-4" />
            <AlertDescription className={alert.type === 'error' ? 'text-red-800' : 'text-green-800'}>
              {alert.message}
            </AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="gallery" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="gallery">ניהול גלריה</TabsTrigger>
            <TabsTrigger value="upload">העלאת קבצים</TabsTrigger>
            <TabsTrigger value="statistics">סטטיסטיקות</TabsTrigger>
          </TabsList>

          {/* Gallery Management */}
          <TabsContent value="gallery" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">ניהול גלריה</h2>
              <Button onClick={() => setEditingItem({})}> {/* Pass an empty object for new item */}
                <Plus className="w-4 h-4 ml-2" />
                הוסף פריט חדש
              </Button>
            </div>

            {/* Items Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {galleryItems.map((item) => (
                <Card key={item.id} className="overflow-hidden">
                  <div className="relative aspect-video">
                    {item.media_type === 'video' ? (
                      <video 
                        src={item.file_url} 
                        className="w-full h-full object-cover"
                        controls={false}
                        muted // Mute videos for autoplay in grid
                        loop
                        playsInline
                      />
                    ) : (
                      <img 
                        src={item.file_url} 
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    )}
                    
                    {/* Status overlay */}
                    <div className="absolute top-2 right-2 flex gap-2">
                      {item.is_featured && (
                        <Badge className="bg-yellow-500">
                          <Star className="w-3 h-3" />
                        </Badge>
                      )}
                      <Badge 
                        variant={item.status === 'active' ? 'default' : 'secondary'}
                        className={item.status === 'active' ? 'bg-green-500' : 'bg-gray-500'}
                      >
                        {item.status === 'active' ? 'פעיל' : 'מוסתר'}
                      </Badge>
                    </div>

                    {/* Media type indicator */}
                    <div className="absolute bottom-2 left-2">
                      {item.media_type === 'video' ? (
                        <Badge variant="outline" className="bg-black/50 text-white border-white/20">
                          <Video className="w-3 h-3 ml-1" />
                          וידאו
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-black/50 text-white border-white/20">
                          <ImageIcon className="w-3 h-3 ml-1" />
                          תמונה
                        </Badge>
                      )}
                    </div>
                  </div>

                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <h3 className="font-semibold text-lg">{item.title}</h3>
                      {item.description && (
                        <p className="text-gray-600 text-sm">{item.description}</p>
                      )}
                      <div className="flex items-center justify-between">
                        <Badge variant="outline">
                          {categories.find(cat => cat.value === item.category)?.label || item.category}
                        </Badge>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => toggleItemStatus(item)}
                          >
                            {item.status === 'active' ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleEditItem(item)}
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleDeleteItem(item.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* File Upload */}
          <TabsContent value="upload" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>העלאת קבצים</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium mb-2">העלו תמונות ווידאו</h3>
                  <p className="text-gray-600 mb-4">גררו קבצים לכאן או לחצו לבחירה</p>
                  
                  <input
                    type="file"
                    id="file-upload"
                    multiple
                    accept="image/*,video/*"
                    onChange={(e) => handleFileUpload(e.target.files)}
                    className="hidden"
                  />
                  <label
                    htmlFor="file-upload"
                    className="inline-flex items-center px-6 py-3 bg-gold text-black font-medium rounded-lg cursor-pointer hover:bg-gold/90 transition-colors"
                  >
                    <Plus className="w-4 h-4 ml-2" />
                    בחר קבצים
                  </label>
                </div>

                {/* Upload Progress */}
                {uploadingFiles.length > 0 && (
                  <div className="mt-6 space-y-3">
                    <h4 className="font-medium">העלאה בתהליך:</h4>
                    {uploadingFiles.map((upload, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm">{upload.file.name}</span>
                        <div className="flex items-center gap-3">
                          {upload.status === 'completed' && <Check className="w-4 h-4 text-green-500" />}
                          {upload.status === 'error' && <X className="w-4 h-4 text-red-500" />}
                          {upload.status === 'uploading' && (
                            <div className="w-20 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-gold h-2 rounded-full transition-all duration-300" 
                                style={{ width: `${upload.progress}%` }}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Statistics */}
          <TabsContent value="statistics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-gold mb-2">
                    {galleryItems.length}
                  </div>
                  <div className="text-gray-600">סך הפריטים</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {galleryItems.filter(item => item.status === 'active').length}
                  </div>
                  <div className="text-gray-600">פריטים פעילים</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {galleryItems.filter(item => item.media_type === 'image').length}
                  </div>
                  <div className="text-gray-600">תמונות</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    {galleryItems.filter(item => item.media_type === 'video').length}
                  </div>
                  <div className="text-gray-600">סרטונים</div>
                </CardContent>
              </Card>
            </div>

            {/* Category breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>פילוח לפי קטגוריות</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {categories.map(category => {
                    const count = galleryItems.filter(item => item.category === category.value).length;
                    const percentage = galleryItems.length > 0 ? (count / galleryItems.length) * 100 : 0;
                    
                    return (
                      <div key={category.value} className="flex items-center justify-between">
                        <span className="font-medium">{category.label}</span>
                        <div className="flex items-center gap-3">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-gold h-2 rounded-full transition-all duration-300" 
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-600 w-8">{count}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Edit Item Modal */}
        {editingItem && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle>{editingItem.id ? 'עריכת פריט' : 'הוספת פריט חדש'}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">כותרת</label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="כותרת הפריט"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">תיאור</label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="תיאור הפריט"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">קטגוריה</label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => setFormData({...formData, category: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="בחר קטגוריה" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(cat => (
                          <SelectItem key={cat.value} value={cat.value}>
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">סוג מדיה</label>
                    <Select
                      value={formData.media_type}
                      onValueChange={(value) => setFormData({...formData, media_type: value})}
                      disabled={!!editingItem.id} // Disable media type change for existing items if file is already uploaded
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="image">תמונה</SelectItem>
                        <SelectItem value="video">וידאו</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* File upload only for new items, or if file_url is missing for some reason */}
                {!editingItem.id && (
                  <div>
                    <label className="block text-sm font-medium mb-2">קובץ</label>
                    <input
                      type="file"
                      accept="image/*,video/*"
                      onChange={async (e) => {
                        const file = e.target.files[0];
                        if (file) {
                          try {
                            // Indicate upload is happening
                            showAlert('info', 'מעלה קובץ...');
                            const { file_url } = await UploadFile({ file });

                            // Check both MIME type and file extension
                            const videoExtensions = ['mp4', 'mov', 'avi', 'webm', 'mpeg', 'mpg'];
                            const fileExtension = file.name.split('.').pop().toLowerCase();
                            const isVideo = file.type.startsWith('video/') || videoExtensions.includes(fileExtension);

                            setFormData({
                              ...formData,
                              file_url,
                              media_type: isVideo ? 'video' : 'image'
                            });
                            showAlert('success', 'קובץ הועלה בהצלחה');
                          } catch (error) {
                            showAlert('error', 'שגיאה בהעלאת הקובץ');
                            console.error("Error uploading file:", error);
                          }
                        }
                      }}
                      className="w-full"
                    />
                    {formData.file_url && (
                        <p className="text-sm text-gray-500 mt-2">
                            קובץ נוכחי: <a href={formData.file_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">צפה בקובץ</a>
                        </p>
                    )}
                  </div>
                )}

                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.is_featured}
                      onChange={(e) => setFormData({...formData, is_featured: e.target.checked})}
                      className="h-4 w-4 text-gold focus:ring-gold border-gray-300 rounded"
                    />
                    פריט מומלץ
                  </label>

                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData({...formData, status: value})}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">פעיל</SelectItem>
                      <SelectItem value="inactive">מוסתר</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button onClick={handleSaveItem} disabled={!formData.file_url}>
                    <Save className="w-4 h-4 ml-2" />
                    שמור
                  </Button>
                  <Button variant="outline" onClick={() => setEditingItem(null)}>
                    ביטול
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      <style>{`
        .text-gold { color: #D4AF37; }
        .bg-gold { background-color: #D4AF37; }
        .border-gold { border-color: #D4AF37; }
        .hover\\:bg-gold\\/90:hover { background-color: rgba(212, 175, 55, 0.9); }
      `}</style>
    </div>
  );
}
