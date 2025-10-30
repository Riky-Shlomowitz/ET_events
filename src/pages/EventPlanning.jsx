
import { useState, useEffect, useCallback } from 'react';
import { Menu, X, Phone, Mail, MessageCircle, Star, Users, Calendar, Camera, ChevronLeft, ChevronRight, Play, Heart, Award } from 'lucide-react';
import { Button } from '@/components/ui/forms/button';
import apiClient from '@/lib/apiClient';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

// Move constants outside component to avoid dependency issues
const navItems = [
  { id: 'home', label: 'בית' },
  { id: 'about', label: 'אודות' },
  { id: 'gallery', label: 'גלריה' },
  { id: 'services', label: 'שירותים' },
  { id: 'contact', label: 'יצירת קשר' }
];

const galleryFilters = [
  { id: 'all', label: 'הכול' },
  { id: 'besari', label: 'בשרי' },
  { id: 'halavi', label: 'חלבי' },
  { id: 'kelim', label: 'כלים' }
];

const services = [
  {
    title: 'בריתות',
    description: 'אירוע קדוש ומרגש עם כל הפרטים',
    icon: Star
  },
  {
    title: 'בר/בת מצווה',
    description: 'חגיגת בלתי נשכחת לילד ולמשפחה',
    icon: Users
  },
  {
    title: 'אירוסין',
    description: 'ערב מיוחד  ',
    icon: Heart
  },
  {
    title: 'שבע ברכות',
    description: 'שבוע של שמחה וחגיגות לזוג הטרי',
    icon: Star
  },
  {
    title: 'כנסים פרטיים',
    description: 'אירועים משפחתיים ומיוחדים',
    icon: Users
  },
  {
    title: 'כנסים עסקיים',
    description: 'אירועי חברה מקצועיים ומרשימים',
    icon: Award
  },
  {
    title: 'רגעים מיוחדים',
    description: 'כל חגיגה בחיים שראויה לציון מושלם',
    icon: Calendar
  }
];

// Gallery items loaded from server only

export default function EventPlanning() {
  const [activeSection, setActiveSection] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [galleryFilter, setGalleryFilter] = useState('all');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentMedia, setCurrentMedia] = useState(null);
  const [galleryItems, setGalleryItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [displayCount, setDisplayCount] = useState(16);
  const ITEMS_PER_PAGE = 16;

  // Scroll spy effect
  useEffect(() => {
    const handleScroll = () => {
      const sections = navItems.map(item => item.id);
      const scrollPosition = window.scrollY + 100;

      for (let i = sections.length - 1; i >= 0; i--) {
        const element = document.getElementById(sections[i]);
        if (element && element.offsetTop <= scrollPosition) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Memoize loadGalleryItems to avoid dependency issues
  const loadGalleryItems = useCallback(async () => {
    setIsLoading(true);
    try {
      // Load from database
      const dbItems = await apiClient.getGalleryItems();
      const activeItems = dbItems.filter(item => item.status === 'active');
      
      // Filter by category
      const filteredItems = galleryFilter === 'all' 
        ? activeItems 
        : activeItems.filter(item => item.category === galleryFilter);
      
      // Convert to expected format
      const formattedItems = filteredItems.map(item => ({
        id: item.id,
        type: item.media_type,
        url: item.file_url,
        category: item.category,
        title: item.title,
        description: item.description
      }));
      
      setGalleryItems(formattedItems);
    } catch (err) {
      console.error('Error loading gallery:', err);
      setGalleryItems([]);
    }
    setIsLoading(false);
  }, [galleryFilter]);

  // Load gallery items from database or fallback to mock data
  useEffect(() => {
    loadGalleryItems();
    setDisplayCount(ITEMS_PER_PAGE); // Reset display count when filter changes
  }, [loadGalleryItems]);

  // Get currently displayed items
  const displayedItems = galleryItems.slice(0, displayCount);
  const hasMore = displayCount < galleryItems.length;

  const loadMore = () => {
    setDisplayCount(prev => prev + ITEMS_PER_PAGE);
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  const openLightbox = (item) => {
    setCurrentMedia(item);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    setCurrentMedia(null);
  };

  const nextMedia = useCallback(() => {
    if (!galleryItems || galleryItems.length === 0 || !currentMedia) return;
    const currentIndex = galleryItems.findIndex(item => item.id === currentMedia.id);
    const nextIndex = (currentIndex + 1) % galleryItems.length;
    setCurrentMedia(galleryItems[nextIndex]);
  }, [galleryItems, currentMedia]);

  const prevMedia = useCallback(() => {
    if (!galleryItems || galleryItems.length === 0 || !currentMedia) return;
    const currentIndex = galleryItems.findIndex(item => item.id === currentMedia.id);
    const prevIndex = currentIndex === 0 ? galleryItems.length - 1 : currentIndex - 1;
    setCurrentMedia(galleryItems[prevIndex]);
  }, [galleryItems, currentMedia]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!lightboxOpen) return;
      
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') prevMedia(); // RTL - right arrow goes to previous
      if (e.key === 'ArrowLeft') nextMedia(); // RTL - left arrow goes to next
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [lightboxOpen, nextMedia, prevMedia]);

  return (
    <div className="min-h-screen bg-white text-gray-900" dir="rtl">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-black/95 backdrop-blur-sm z-50 border-b border-gold/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <img 
                src="/images/logo.png" 
                alt="עמנואל טרכטנברג הפקת אירועים" 
                className="h-10 w-auto"
              />
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="flex items-center space-x-reverse space-x-8">
                {navItems.map(item => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`px-3 py-2 text-sm font-medium transition-all duration-300 ${
                      activeSection === item.id 
                        ? 'text-gold border-b-2 border-gold' 
                        : 'text-white hover:text-gold'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-white hover:text-gold p-2"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-black/98 border-t border-gold/20">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`block w-full text-right px-3 py-2 text-base font-medium transition-colors ${
                    activeSection === item.id 
                      ? 'text-gold bg-gold/10' 
                      : 'text-white hover:text-gold hover:bg-gold/5'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat animate-hero-zoom"
          style={{
            backgroundImage: 'url("/images/gallery/general-1.jpg")'
          }}
        >
          <div className="absolute inset-0 bg-black/60"></div>
        </div>
        
        <div className="relative z-10 text-center text-white px-4 max-w-5xl mx-auto">
          {/* Logo Large */}
          <div className="mb-8 animate-fade-in-up">
            <img
              src="/images/logo.png"
              alt="עמנואל טרכטנברג הפקת אירועים"
              className="h-64 md:h-80 lg:h-96 w-auto mx-auto mb-6"
            />
          </div>
          
          <h1 className="text-base md:text-lg lg:text-xl font-medium mb-8 leading-tight animate-fade-in-up-delayed">
            ✨ ברוכים הבאים לעולם שבו חלומות הופכים לאירועים בלתי נשכחים ✨
          </h1>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8 animate-fade-in-up-more-delayed">
            <Button 
              onClick={() => scrollToSection('gallery')}
              className="bg-gold hover:bg-gold/90 text-black font-semibold px-8 py-3 text-lg transform hover:scale-105 transition-all duration-300"
            >
              צפו בגלריה
            </Button>
            <Button 
              onClick={() => scrollToSection('contact')}
              className="bg-gold hover:bg-gold/90 text-black font-semibold px-8 py-3 text-lg transform hover:scale-105 transition-all duration-300"
            >
              צרו קשר
            </Button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-6">
              אודותינו
            </h2>
            <div className="w-24 h-1 bg-gold mx-auto mb-8"></div>
          </div>

          <div className="text-center max-w-4xl mx-auto animate-fade-in-up">
            <div className="space-y-8 text-lg text-gray-700 leading-relaxed">
              <p className="text-xl font-medium">
                אנחנו מתמחים בהפקת אירועים ברמה גבוהה, בריתות, בר/בת מצוות, אירוסין, שבע ברכות,
                כנסים פרטיים ועסקיים, לפי התקציב שלכם, וכל רגע חשוב בחיים שראוי לציון מושלם.
              </p>
              
              <p>
                כל פרט באירוע נבנה בקפידה מהעיצוב המרשים, דרך הקולינריה העשירה,
                אנחנו כאן כדי לוודא שכל רגע יהיה מדויק, מרגש ומיוחד – בשבילכם ובשביל האורחים שלכם.
              </p>
              
              <p>
                כשתבחרו בנו, לא תצטרכו לדאוג לדבר. הצוות המקצועי שלנו ילווה אתכם יד ביד, ינהל את כל ההפקה,
                וייתן לכם להיות האורחים של עצמכם – לחוות, להתרגש וליהנות מכל שנייה.
              </p>

              <div className="bg-gradient-to-r from-gold/10 via-gold/5 to-gold/10 p-8 rounded-xl border-r-4 border-l-4 border-gold text-center">
                <p className="text-gold font-semibold text-2xl mb-4">
                  &quot;כי בסופו של דבר, מה שנשאר הם הזיכרונות&quot;
                </p>
                <p className="text-xl text-gray-800">
                  ואנחנו כאן כדי להפוך אותם לבלתי נשכחים
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-fade-in-up">
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">גלריית האירועים שלנו</h2>
            <div className="w-24 h-1 bg-gold mx-auto mb-6"></div>
            <p className="text-lg text-gray-600">צפו בכמה מהאירועים המיוחדים שהפקנו</p>
          </div>

          {/* Gallery Filters */}
          <div className="flex justify-center mb-8 animate-fade-in-up">
            <div className="flex flex-wrap gap-2">
              {galleryFilters.map(filter => (
                <Button
                  key={filter.id}
                  onClick={() => setGalleryFilter(filter.id)}
                  variant={galleryFilter === filter.id ? 'default' : 'outline'}
                  className={`transform hover:scale-105 transition-all duration-300 ${
                    galleryFilter === filter.id 
                      ? 'bg-gold text-black hover:bg-gold/90' 
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {filter.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-fade-in-up">
            {isLoading ? (
              Array(8).fill(0).map((_, index) => (
                <div key={index} className="aspect-square bg-gray-200 rounded-lg animate-pulse"></div>
              ))
            ) : displayedItems.length > 0 ? (
              displayedItems.map(item => (
                <div
                  key={item.id}
                  className="relative aspect-square cursor-pointer group overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
                  onClick={() => openLightbox(item)}
                >
                  {item.type === 'video' ? (
                    <video
                      src={item.url}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      muted
                    />
                  ) : (
                    <img
                      src={item.url}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {item.type === 'video' ? (
                        <Play className="w-12 h-12 text-white" />
                      ) : (
                        <Camera className="w-12 h-12 text-white" />
                      )}
                    </div>
                  </div>
                  {item.title && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 text-right">
                      <p className="text-white text-sm font-medium">{item.title}</p>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500">אין פריטים להצגה בקטגוריה זו</p>
              </div>
            )}
          </div>

          {/* Load More Button */}
          {!isLoading && hasMore && (
            <div className="flex justify-center mt-8 animate-fade-in-up">
              <Button
                onClick={loadMore}
                className="bg-gold hover:bg-gold/90 text-black font-semibold px-8 py-3 text-lg transform hover:scale-105 transition-all duration-300"
              >
                טען עוד ({galleryItems.length - displayCount} נותרו)
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-fade-in-up">
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">השירותים שלנו</h2>
            <div className="w-24 h-1 bg-gold mx-auto mb-6"></div>
            <p className="text-lg text-gray-600">מגוון רחב של אירועים בכל הגדלים והסגנונות</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => {
              const IconComponent = service.icon;
              return (
                <div 
                  key={index}
                  className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 group hover:-translate-y-1 animate-fade-in-up"
                >
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center mr-4 group-hover:bg-gold/20 transition-colors duration-300">
                      <IconComponent className="w-6 h-6 text-gold" />
                    </div>
                    <h3 className="text-xl font-bold text-black">{service.title}</h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed text-right">{service.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gradient-to-b from-black to-gray-900 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-fade-in-up">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">יצירת קשר</h2>
            <div className="w-24 h-1 bg-gold mx-auto mb-6"></div>
            <p className="text-lg text-gray-300">בואו נתחיל לתכנן את האירוע המושלם שלכם</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Contact Form */}
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gold/20 animate-fade-in-up">
              <h3 className="text-xl font-bold text-gold mb-4 text-right">שלחו לנו הודעה</h3>
              <form action="https://formspree.io/f/xyzbzrvq" method="POST" className="space-y-4">
                <input type="text" name="_gotcha" className="hidden" />
                
                <div>
                  <input
                    type="text"
                    name="name"
                    placeholder="שם מלא"
                    required
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent text-right"
                  />
                </div>
                
                <div>
                  <input
                    type="email"
                    name="email"
                    placeholder="כתובת מייל"
                    required
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent text-right"
                  />
                </div>
                
                <div>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="מספר טלפון"
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent text-right"
                  />
                </div>
                
                <div>
                  <textarea
                    name="message"
                    placeholder="ספרו לנו על האירוע שלכם..."
                    required
                    rows="4"
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent resize-none text-right"
                  ></textarea>
                </div>
                
                <Button 
                  type="submit"
                  className="w-full bg-gold hover:bg-gold/90 text-black font-semibold py-3 text-lg rounded-lg transform hover:scale-105 transition-all duration-300"
                >
                  שלח הודעה
                </Button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-6 animate-fade-in-up">
              <div className="text-center lg:text-right">
                <h3 className="text-xl font-bold text-gold mb-6">בואו נדבר</h3>
                
                <div className="space-y-4">
                  <div className="bg-gray-900/30 rounded-lg p-4 border border-gold/10">
                    <div className="flex items-center justify-center lg:justify-end mb-2">
                      <Phone className="w-5 h-5 text-gold mr-2" />
                      <span className="text-gray-300">טלפון</span>
                    </div>
                    <a href="tel:0559585990" className="text-xl font-bold hover:text-gold transition-colors">
                      055-958-5990
                    </a>
                  </div>
                  
                  <div className="bg-gray-900/30 rounded-lg p-4 border border-gold/10">
                    <div className="flex items-center justify-center lg:justify-end mb-2">
                      <Mail className="w-5 h-5 text-gold mr-2" />
                      <span className="text-gray-300">מייל</span>
                    </div>
                    <a href="mailto:et0559585990@gmail.com" className="text-lg hover:text-gold transition-colors">
                      et0559585990@gmail.com
                    </a>
                  </div>
                </div>

                <div className="mt-6">
                  <a
                    href="https://wa.me/+972559585990?text=שלום, אשמח לקבל פרטים על הפקת אירוע"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center bg-green-600 hover:bg-green-500 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105"
                  >
                    <MessageCircle className="w-5 h-5 mr-2" />
                    צ'אט בוואטסאפ
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 border-t border-gold/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mb-6">
              <img 
                src="/images/logo.png" 
                alt="עמנואל טרכטנברג הפקת אירועים" 
                className="h-12 w-auto mx-auto opacity-70"
              />
            </div>
            <p className="text-lg">© {new Date().getFullYear()} עמנואל טרכטנברג – הפקת אירועים. כל הזכויות שמורות.</p>
            <div className="mt-4 text-gold font-medium">
              &quot;הופכים חלומות לזיכרונות בלתי נשכחים&quot;
            </div>

            {/* Developer Credit */}
            <div className="mt-6 pt-6 border-t border-gray-700/50">
              <p className="text-sm text-gray-500">
                פותח ועוצב על ידי{' '}
                <a
                  href="https://mail.google.com/mail/?view=cm&fs=1&to=riky.shlomowitz@gmail.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gold hover:text-gold/80 transition-colors font-medium underline decoration-gold/50 hover:decoration-gold"
                >
                  ריקי שלומוביץ
                </a>
              </p>
            </div>

            <div className="mt-6">
              <Link to={createPageUrl('AdminLogin')} className="text-xs text-gray-600 hover:text-gold transition-colors tracking-widest uppercase">
                Admin
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Action Button (Mobile) */}
      <div
        onClick={() => scrollToSection('contact')}
        className="fixed bottom-6 right-6 md:hidden h-14 rounded-full bg-gradient-to-r from-gold to-gold/80 hover:from-gold/90 hover:to-gold/70 text-black shadow-xl z-40 px-4 font-semibold transform hover:scale-110 transition-all duration-300 flex items-center cursor-pointer"
      >
        <Phone className="w-4 h-4 mr-2" />
        <span className="text-sm">צור קשר</span>
      </div>

      {/* Lightbox */}
      {lightboxOpen && currentMedia && (
        <div 
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <div className="relative max-w-4xl max-h-full">
            {currentMedia.type === 'video' ? (
              <video
                controls
                autoPlay
                playsInline
                preload="auto"
                className="max-w-full max-h-full object-contain"
                onClick={(e) => e.stopPropagation()}
              >
                <source src={currentMedia.url} type="video/mp4" />
                <source src={currentMedia.url} type="video/webm" />
                <source src={currentMedia.url} type="video/ogg" />
                הדפדפן שלך לא תומך בהצגת וידאו
              </video>
            ) : (
              <img 
                src={currentMedia.url}
                alt={currentMedia.title}
                className="max-w-full max-h-full object-contain"
                onClick={(e) => e.stopPropagation()}
              />
            )}
            
            {/* Navigation Buttons */}
            {galleryItems.length > 1 && (
              <>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    prevMedia();
                  }}
                  className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-300"
                >
                  <ChevronRight className="w-6 h-6" />
                </Button>

                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    nextMedia();
                  }}
                  className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-300"
                >
                  <ChevronLeft className="w-6 h-6" />
                </Button>
              </>
            )}
            
            {/* Close Button */}
            <Button
              onClick={closeLightbox}
              className="absolute top-4 left-4 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-300"
            >
              <X className="w-6 h-6" />
            </Button>
            
            {/* Image Title */}
            {currentMedia.title && (
              <div className="absolute bottom-4 left-4 right-4 text-center">
                <p className="text-white text-lg font-semibold bg-black/50 rounded-lg px-4 py-2">
                  {currentMedia.title}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        .text-gold { color: #D4AF37; }
        .bg-gold { background-color: #D4AF37; }
        .border-gold { border-color: #D4AF37; }
        .hover\\:bg-gold\\/90:hover { background-color: rgba(212, 175, 55, 0.9); }
        .hover\\:text-gold:hover { color: #D4AF37; }
        .bg-gold\\/10 { background-color: rgba(212, 175, 55, 0.1); }
        .bg-gold\\/5 { background-color: rgba(212, 175, 55, 0.05); }
        .bg-gold\\/20 { background-color: rgba(212, 175, 55, 0.2); }
        .border-gold\\/20 { border-color: rgba(212, 175, 55, 0.2); }
        .border-gold\\/10 { border-color: rgba(212, 175, 55, 0.1); }
        .ring-gold { --tw-ring-color: #D4AF37; }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out;
        }
        
        .animate-fade-in-up-delayed {
          animation: fadeInUp 0.8s ease-out 0.3s both;
        }
        
        .animate-fade-in-up-more-delayed {
          animation: fadeInUp 0.8s ease-out 0.6s both;
        }

        /* RTL support enhancements */
        [dir="rtl"] .space-x-reverse > :not([hidden]) ~ :not([hidden]) {
          --tw-space-x-reverse: 1;
        }
      `}</style>
    </div>
  );
}
