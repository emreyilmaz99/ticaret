import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { 
  FaStar, FaShoppingCart, FaHeart, FaRegHeart, FaFilter, FaChevronDown, 
  FaCheck, FaTimes, FaCookieBite, FaUsers, FaStore, FaBox, FaShieldAlt, FaTruck, FaArrowRight,
  FaEye, FaClock, FaSpinner
} from 'react-icons/fa';
import { useToast } from '../../components/Toast';
import { useAuth } from '../../context/AuthContext';
import QuickViewModal from '../../components/QuickViewModal';
import ProductCard from '../../components/ProductCard';
import { getProducts, getCategories, getFeaturedProducts } from '../../api/publicApi';

const Home = () => {
  const [searchParams] = useSearchParams();
  const { showToast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showCookieBanner, setShowCookieBanner] = useState(true);
  
  // New Features State
  const [favorites, setFavorites] = useState([]);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  
  // Filter States
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');

  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [searchParams]);

  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [minRating, setMinRating] = useState(0);
  const [sortOrder, setSortOrder] = useState('featured'); // featured, price-asc, price-desc, rating-desc

  // Fetch categories from API
  const { data: categoriesData } = useQuery({
    queryKey: ['public-categories'],
    queryFn: getCategories,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch products from API
  const { data: productsData, isLoading: productsLoading, error: productsError } = useQuery({
    queryKey: ['public-products', selectedCategory, priceRange, sortOrder],
    queryFn: () => getProducts({
      category_id: selectedCategory !== 'all' ? selectedCategory : undefined,
      min_price: priceRange[0] > 0 ? priceRange[0] : undefined,
      max_price: priceRange[1] < 100000 ? priceRange[1] : undefined,
      sort_by: sortOrder === 'price-asc' ? 'price_asc' : sortOrder === 'price-desc' ? 'price_desc' : 'featured',
      per_page: 12,
    }),
    staleTime: 1 * 60 * 1000, // 1 minute
  });

  // Transform API categories to local format
  const categories = [
    { id: 'all', name: 'Tüm Ürünler' },
    ...(categoriesData?.data?.categories || []).map(cat => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      icon: cat.icon,
      image: cat.image,
    })),
  ];

  // Get products from API response
  const products = productsData?.data?.products || [];

  // Filter by rating (client-side since API doesn't support it yet)
  const filteredProducts = products.filter(product => {
    const matchesRating = (product.rating || 0) >= minRating;
    return matchesRating;
  });

  const addToCart = (product) => {
    if (!user) {
      showToast('Sepete eklemek için lütfen giriş yapın.', 'warning');
      navigate('/login');
      return;
    }
    showToast(`${product.name} sepete eklendi!`, 'success');
    if (quickViewProduct) setQuickViewProduct(null);
  };

  const toggleFavorite = (e, productId) => {
    e.stopPropagation();
    e.preventDefault();
    if (!user) {
      showToast('Favorilere eklemek için lütfen giriş yapın.', 'warning');
      navigate('/login');
      return;
    }
    if (favorites.includes(productId)) {
      setFavorites(favorites.filter(id => id !== productId));
      showToast('Ürün favorilerden çıkarıldı.', 'info');
    } else {
      setFavorites([...favorites, productId]);
      showToast('Ürün favorilere eklendi!', 'success');
    }
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  // Countdown Timer Component
  const CountdownTimer = () => {
    const [timeLeft, setTimeLeft] = useState({ hours: 5, minutes: 43, seconds: 12 });

    useEffect(() => {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
          if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
          if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
          return prev;
        });
      }, 1000);
      return () => clearInterval(timer);
    }, []);

    return (
      <div style={{ display: 'flex', gap: '8px', fontSize: '20px', fontWeight: '700', color: '#ef4444' }}>
        <span>{String(timeLeft.hours).padStart(2, '0')}</span>:
        <span>{String(timeLeft.minutes).padStart(2, '0')}</span>:
        <span>{String(timeLeft.seconds).padStart(2, '0')}</span>
      </div>
    );
  };

  // Quick View Modal Component - REMOVED (Moved to src/components/QuickViewModal.jsx)

  // Animated background style
  const backgroundStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: -1,
    background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 50%, #f0fdf4 100%)',
    overflow: 'hidden',
  };

  // Floating circles for subtle animation
  const FloatingCircle = ({ size, top, left, delay, duration }) => (
    <div
      style={{
        position: 'absolute',
        width: size,
        height: size,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.05) 100%)',
        top,
        left,
        animation: `float ${duration}s ease-in-out infinite`,
        animationDelay: `${delay}s`,
      }}
    />
  );

  const styles = {
    container: {
      fontFamily: '"Inter", sans-serif',
      backgroundColor: '#f8fafc',
      minHeight: '100vh',
      paddingBottom: '80px',
      position: 'relative',
    },
    hero: {
      background: 'linear-gradient(135deg, #064e3b 0%, #059669 100%)',
      color: 'white',
      padding: '80px 0', // Daha fazla boşluk
      marginBottom: '60px',
      position: 'relative',
      zIndex: 1,
      borderRadius: '0 0 60px 60px', // Alt köşeleri yuvarla
      boxShadow: '0 20px 60px -20px rgba(6, 78, 59, 0.5)',
    },
    heroContent: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    heroText: {
      maxWidth: '600px',
    },
    heroTitle: {
      fontFamily: '"DM Sans", sans-serif',
      fontSize: '64px', // Daha büyük başlık
      fontWeight: '800',
      marginBottom: '24px',
      lineHeight: '1.05',
      letterSpacing: '-2px',
    },
    heroSubtitle: {
      fontSize: '20px',
      opacity: 0.9,
      marginBottom: '40px',
      lineHeight: '1.6',
      fontWeight: '300', // Daha ince font
    },
    heroButtons: {
      display: 'flex',
      gap: '20px',
    },
    heroBtn: {
      backgroundColor: '#ffffff',
      color: '#059669',
      padding: '18px 40px', // Daha büyük butonlar
      borderRadius: '50px',
      fontWeight: '700',
      fontSize: '16px',
      border: 'none',
      cursor: 'pointer',
      transition: 'transform 0.2s, box-shadow 0.2s',
      boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
      textDecoration: 'none',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '10px',
    },
    secondaryButton: {
      backgroundColor: 'rgba(255,255,255,0.1)', // Yarı saydam
      backdropFilter: 'blur(10px)',
      color: 'white',
      padding: '18px 40px',
      borderRadius: '50px',
      fontWeight: '600',
      fontSize: '16px',
      border: '1px solid rgba(255,255,255,0.3)',
      cursor: 'pointer',
      transition: 'all 0.2s',
      textDecoration: 'none',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '10px',
    },
    mainLayout: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 20px',
      position: 'relative',
      zIndex: 1,
    },
    filterBar: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '20px',
      alignItems: 'center',
      backgroundColor: 'white',
      padding: '20px',
      borderRadius: '24px',
      marginBottom: '40px',
      boxShadow: '0 10px 30px -10px rgba(0,0,0,0.05)',
    },
    filterGroup: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    },
    filterSelect: {
      padding: '10px 16px',
      borderRadius: '12px',
      border: '1px solid #e2e8f0',
      outline: 'none',
      fontFamily: 'inherit',
      fontSize: '14px',
      color: '#334155',
      cursor: 'pointer',
      backgroundColor: '#f8fafc',
    },
    filterInput: {
      width: '80px',
      padding: '10px',
      borderRadius: '12px',
      border: '1px solid #e2e8f0',
      outline: 'none',
      fontFamily: 'inherit',
      fontSize: '14px',
      backgroundColor: '#f8fafc',
    },
    content: {
      width: '100%',
    },
    sortBar: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '32px',
      backgroundColor: 'white',
      padding: '16px 24px',
      borderRadius: '20px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', // Biraz daha geniş kartlar
      gap: '32px',
    },
    card: {
      backgroundColor: 'white',
      borderRadius: '32px', // Çok modern, yuvarlak köşeler
      overflow: 'hidden',
      border: 'none', // Kenarlık yok
      boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.07)', // Derin, yumuşak gölge
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      position: 'relative',
      cursor: 'pointer',
    },
    cardImage: {
      width: '100%',
      aspectRatio: '1/1',
      objectFit: 'cover',
      backgroundColor: '#f8fafc',
      margin: '12px', // Resim kenarlardan içeride
      width: 'calc(100% - 24px)',
      borderRadius: '24px', // Resim de yuvarlak
    },
    cardBody: {
      padding: '0 24px 24px 24px',
    },
    cardCategory: {
      fontSize: '12px',
      color: '#64748b',
      textTransform: 'uppercase',
      fontWeight: '600',
      marginBottom: '4px',
    },
    cardTitle: {
      fontSize: '15px',
      fontWeight: '600',
      color: '#1e293b',
      marginBottom: '8px',
      lineHeight: '1.4',
      height: '42px',
      overflow: 'hidden',
    },
    rating: {
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      fontSize: '12px',
      color: '#f59e0b',
      marginBottom: '12px',
    },
    priceRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    price: {
      fontSize: '18px',
      fontWeight: '700',
      color: '#059669',
    },
    addToCartBtn: {
      width: '36px',
      height: '36px',
      borderRadius: '50%',
      backgroundColor: '#ecfdf5',
      color: '#059669',
      border: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      transition: 'background-color 0.2s',
    },
    discountBadge: {
      position: 'absolute',
      top: '12px',
      left: '12px',
      backgroundColor: '#ef4444',
      color: 'white',
      fontSize: '12px',
      fontWeight: '700',
      padding: '4px 8px',
      borderRadius: '6px',
    },
    cookieBanner: {
      position: 'fixed',
      bottom: '24px',
      left: '50%',
      transform: 'translateX(-50%)',
      backgroundColor: '#1e293b',
      color: 'white',
      padding: '16px 24px',
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      gap: '24px',
      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.2)',
      zIndex: 2000,
      maxWidth: '90%',
      width: '600px',
    },
    cookieBtn: {
      padding: '8px 20px',
      borderRadius: '8px',
      fontSize: '13px',
      fontWeight: '600',
      cursor: 'pointer',
      border: 'none',
    },
    statsSection: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '24px',
      maxWidth: '1000px',
      margin: '0 auto 80px',
      padding: '0 20px',
      position: 'relative',
      zIndex: 1,
    },
    statCard: {
      background: 'white',
      borderRadius: '20px',
      padding: '32px',
      textAlign: 'center',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    },
    statIcon: {
      width: '60px',
      height: '60px',
      borderRadius: '16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 16px',
      fontSize: '24px',
    },
    statNumber: {
      fontSize: '32px',
      fontWeight: '700',
      color: '#064e3b',
      marginBottom: '8px',
    },
    statLabel: {
      fontSize: '14px',
      color: '#64748b',
      fontWeight: '500',
    },
    popularCategories: {
      display: 'flex',
      justifyContent: 'center',
      gap: '32px',
      marginBottom: '60px',
      flexWrap: 'wrap',
      position: 'relative',
      zIndex: 1,
    },
    categoryCircle: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '12px',
      cursor: 'pointer',
      transition: 'transform 0.2s',
      textDecoration: 'none',
      color: '#334155',
      fontWeight: '600',
    },
    catImg: {
      width: '80px',
      height: '80px',
      borderRadius: '50%',
      objectFit: 'cover',
      border: '3px solid white',
      boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
    },
    dealSection: {
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      color: 'white',
      padding: '80px', // Daha geniş iç boşluk
      borderRadius: '40px', // Çok yuvarlak köşeler
      margin: '0 auto 100px',
      maxWidth: '1200px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'relative',
      overflow: 'hidden',
      zIndex: 1,
      boxShadow: '0 30px 60px -15px rgba(15, 23, 42, 0.4)', // Güçlü gölge
    },
    brandStrip: {
      padding: '40px 0',
      borderTop: '1px solid #e2e8f0',
      borderBottom: '1px solid #e2e8f0',
      marginBottom: '60px',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      position: 'relative',
      zIndex: 1,
      backgroundColor: 'rgba(255,255,255,0.5)',
    },
    brandLogo: {
      display: 'inline-block',
      fontSize: '24px',
      fontWeight: '800',
      color: '#94a3b8',
      margin: '0 40px',
      fontFamily: '"DM Sans", sans-serif',
    },
    cardActionBtn: {
      width: '32px',
      height: '32px',
      borderRadius: '50%',
      backgroundColor: 'white',
      border: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      color: '#64748b',
      transition: 'all 0.2s',
      position: 'absolute',
      right: '12px',
      zIndex: 2,
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    },
    featuresSection: {
      background: 'white',
      padding: '80px 20px',
      position: 'relative',
      zIndex: 1,
    },
    sectionTitle: {
      fontFamily: '"DM Sans", sans-serif',
      fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
      fontWeight: '700',
      color: '#064e3b',
      textAlign: 'center',
      marginBottom: '16px',
    },
    sectionSubtitle: {
      fontSize: '16px',
      color: '#64748b',
      textAlign: 'center',
      maxWidth: '600px',
      margin: '0 auto 48px',
    },
    featuresGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '32px',
      maxWidth: '1200px',
      margin: '0 auto',
    },
    featureCard: {
      padding: '32px',
      borderRadius: '20px',
      border: '1px solid #e2e8f0',
      transition: 'all 0.3s ease',
      background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
    },
    featureIcon: {
      width: '56px',
      height: '56px',
      borderRadius: '14px',
      background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '24px',
      color: '#047857',
      marginBottom: '20px',
    },
    featureTitle: {
      fontSize: '20px',
      fontWeight: '700',
      color: '#0f172a',
      marginBottom: '12px',
    },
    featureDescription: {
      fontSize: '15px',
      color: '#64748b',
      lineHeight: '1.7',
    },
    ctaSection: {
      padding: '80px 20px',
      textAlign: 'center',
      background: 'linear-gradient(135deg, #064e3b 0%, #047857 100%)',
      color: 'white',
      position: 'relative',
      zIndex: 1,
    },
    ctaTitle: {
      fontFamily: '"DM Sans", sans-serif',
      fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
      fontWeight: '700',
      marginBottom: '16px',
    },
    ctaText: {
      fontSize: '18px',
      opacity: 0.9,
      maxWidth: '600px',
      margin: '0 auto 32px',
    },
    ctaButton: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '10px',
      padding: '18px 36px',
      backgroundColor: 'white',
      color: '#047857',
      borderRadius: '12px',
      textDecoration: 'none',
      fontWeight: '700',
      fontSize: '16px',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 14px rgba(0, 0, 0, 0.2)',
    },
  };

  return (
    <div style={styles.container}>
      {/* Animated Background */}
      <div style={backgroundStyle}>
        <FloatingCircle size="300px" top="10%" left="5%" delay={0} duration={8} />
        <FloatingCircle size="200px" top="60%" left="80%" delay={2} duration={10} />
        <FloatingCircle size="150px" top="30%" left="70%" delay={4} duration={7} />
        <FloatingCircle size="250px" top="70%" left="20%" delay={1} duration={9} />
        <FloatingCircle size="180px" top="5%" left="60%" delay={3} duration={11} />
      </div>

      {/* Hero Section */}
      <div style={styles.hero}>
        <div style={styles.heroContent}>
          <div style={styles.heroText}>
            <h1 style={styles.heroTitle}>Tarzını Keşfet,<br/>Fırsatları Yakala.</h1>
            <p style={styles.heroSubtitle}>
              En yeni koleksiyonlar, özel indirimler ve binlerce ürün seçeneği ile alışverişin keyfini çıkarın.
            </p>
            <div style={styles.heroButtons}>
              <Link to="/products" style={styles.heroBtn}>
                <FaShoppingCart /> Alışverişe Başla
              </Link>
              <Link to="/vendor/register" style={styles.secondaryButton}>
                <FaStore /> Satıcı Ol
              </Link>
            </div>
          </div>
          {/* Placeholder for Hero Image */}
          <div style={{ width: '400px', height: '300px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '80px', opacity: 0.5 }}>🛍️</span>
          </div>
        </div>
      </div>

      {/* Popular Categories */}
      <div style={styles.popularCategories}>
        {categories.filter(c => c.id !== 'all').slice(0, 5).map(cat => (
          <Link to={`/?category=${cat.id}`} key={cat.id} style={styles.categoryCircle} onClick={() => setSelectedCategory(cat.id)}>
            <div style={{ 
              ...styles.catImg, 
              backgroundColor: '#e2e8f0', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              fontSize: '32px',
              backgroundImage: cat.image ? `url(${cat.image})` : 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}>
              {!cat.image && (cat.icon || '📦')}
            </div>
            <span>{cat.name}</span>
          </Link>
        ))}
      </div>

      {/* Stats Section */}
      <section style={styles.statsSection}>
        <div style={styles.statCard}>
          <div style={{ ...styles.statIcon, background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)', color: '#047857' }}>
            <FaUsers />
          </div>
          <div style={styles.statNumber}>50K+</div>
          <div style={styles.statLabel}>Mutlu Müşteri</div>
        </div>
        <div style={styles.statCard}>
          <div style={{ ...styles.statIcon, background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)', color: '#2563eb' }}>
            <FaStore />
          </div>
          <div style={styles.statNumber}>1.2K+</div>
          <div style={styles.statLabel}>Aktif Satıcı</div>
        </div>
        <div style={styles.statCard}>
          <div style={{ ...styles.statIcon, background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', color: '#d97706' }}>
            <FaBox />
          </div>
          <div style={styles.statNumber}>100K+</div>
          <div style={styles.statLabel}>Ürün Çeşidi</div>
        </div>
        <div style={styles.statCard}>
          <div style={{ ...styles.statIcon, background: 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)', color: '#db2777' }}>
            <FaStar />
          </div>
          <div style={styles.statNumber}>4.9</div>
          <div style={styles.statLabel}>Ortalama Puan</div>
        </div>
      </section>

      <div style={styles.mainLayout}>
        {/* Horizontal Filter Bar */}
        <div style={styles.filterBar}>
          <div style={styles.filterGroup}>
            <span style={{ fontWeight: '600', color: '#1e293b' }}><FaFilter /> Filtrele:</span>
          </div>
          
          <div style={styles.filterGroup}>
            <select 
              value={selectedCategory} 
              onChange={(e) => handleCategoryChange(e.target.value)}
              style={styles.filterSelect}
            >
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div style={styles.filterGroup}>
            <input 
              type="number" 
              placeholder="Min TL" 
              value={priceRange[0]}
              onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
              style={styles.filterInput} 
            />
            <span style={{ color: '#94a3b8' }}>-</span>
            <input 
              type="number" 
              placeholder="Max TL" 
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
              style={styles.filterInput} 
            />
          </div>

          <div style={styles.filterGroup}>
            <select 
              value={minRating} 
              onChange={(e) => setMinRating(Number(e.target.value))}
              style={styles.filterSelect}
            >
              <option value={0}>Tüm Puanlar</option>
              <option value={4}>4 Yıldız & Üzeri</option>
              <option value={3}>3 Yıldız & Üzeri</option>
              <option value={2}>2 Yıldız & Üzeri</option>
              <option value={1}>1 Yıldız & Üzeri</option>
            </select>
          </div>

          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '14px', color: '#64748b' }}>Sırala:</span>
            <select 
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              style={styles.filterSelect}
            >
              <option value="featured">Önerilen</option>
              <option value="price-asc">En Düşük Fiyat</option>
              <option value="price-desc">En Yüksek Fiyat</option>
              <option value="rating-desc">En Yüksek Puan</option>
            </select>
          </div>
        </div>

        {/* Main Content */}
        <main style={styles.content}>
          {/* Product Grid */}
          {productsLoading ? (
            <div style={{ textAlign: 'center', padding: '60px', backgroundColor: 'white', borderRadius: '24px', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.05)' }}>
              <FaSpinner style={{ fontSize: '48px', color: '#059669', animation: 'spin 1s linear infinite' }} />
              <p style={{ color: '#64748b', marginTop: '16px' }}>Ürünler yükleniyor...</p>
            </div>
          ) : productsError ? (
            <div style={{ textAlign: 'center', padding: '60px', backgroundColor: 'white', borderRadius: '24px', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.05)' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
              <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#1e293b', marginBottom: '8px' }}>Bir Hata Oluştu</h3>
              <p style={{ color: '#64748b' }}>Ürünler yüklenirken bir hata oluştu. Lütfen tekrar deneyin.</p>
            </div>
          ) : filteredProducts.length > 0 ? (
            <div style={styles.grid}>
              {filteredProducts.map(product => (
                <ProductCard 
                  key={product.id} 
                  product={{
                    ...product,
                    reviews: product.reviews_count || 0,
                  }} 
                  favorites={favorites}
                  toggleFavorite={toggleFavorite}
                  setQuickViewProduct={setQuickViewProduct}
                  addToCart={addToCart}
                />
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '60px', backgroundColor: 'white', borderRadius: '24px', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.05)' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
              <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#1e293b', marginBottom: '8px' }}>Ürün Bulunamadı</h3>
              <p style={{ color: '#64748b' }}>Seçtiğiniz kriterlere uygun ürün bulunmamaktadır. Filtreleri temizleyip tekrar deneyin.</p>
              <button 
                onClick={() => { setSelectedCategory('all'); setPriceRange([0, 100000]); setMinRating(0); }}
                style={{ marginTop: '20px', padding: '10px 24px', backgroundColor: '#059669', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: '600' }}
              >
                Filtreleri Temizle
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Deal of the Day */}
      <div style={styles.dealSection}>
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '500px' }}>
          <div style={{ display: 'inline-block', padding: '8px 16px', backgroundColor: '#ef4444', borderRadius: '50px', fontSize: '14px', fontWeight: '700', marginBottom: '24px' }}>
            Günün Fırsatı
          </div>
          <h2 style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '48px', fontWeight: '800', marginBottom: '24px', lineHeight: 1.1 }}>
            Premium Kablosuz Kulaklık
          </h2>
          <p style={{ fontSize: '18px', opacity: 0.8, marginBottom: '32px', lineHeight: 1.6 }}>
            Üstün ses kalitesi ve gürültü engelleme özelliği ile müziğin keyfini çıkarın. Sınırlı süre için özel indirim.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '40px' }}>
            <div style={{ fontSize: '36px', fontWeight: '700', color: '#34d399' }}>1.299 TL</div>
            <div style={{ fontSize: '24px', textDecoration: 'line-through', opacity: 0.5 }}>1.899 TL</div>
          </div>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <button onClick={() => addToCart({ id: 99, name: 'Premium Kulaklık', price: 1299 })} style={{ ...styles.heroBtn, backgroundColor: '#34d399', color: '#0f172a' }}>
              <FaShoppingCart /> Sepete Ekle
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: 'rgba(255,255,255,0.1)', padding: '12px 24px', borderRadius: '50px' }}>
              <FaClock /> <CountdownTimer />
            </div>
          </div>
        </div>
        <div style={{ position: 'relative', zIndex: 2 }}>
          <img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80" alt="Deal Product" style={{ width: '400px', height: '400px', objectFit: 'cover', borderRadius: '24px', transform: 'rotate(-10deg)', boxShadow: '0 20px 50px rgba(0,0,0,0.3)' }} />
        </div>
        {/* Background Pattern */}
        <div style={{ position: 'absolute', top: 0, right: 0, width: '600px', height: '100%', background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.05) 100%)', transform: 'skewX(-20deg)' }}></div>
      </div>

      {/* Features Section */}
      <section style={styles.featuresSection}>
        <h2 style={styles.sectionTitle}>Neden Bizi Tercih Etmelisiniz?</h2>
        <p style={styles.sectionSubtitle}>
          Alışveriş deneyiminizi en üst seviyeye çıkarmak için sürekli çalışıyoruz.
        </p>
        <div style={styles.featuresGrid}>
          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>
              <FaShieldAlt />
            </div>
            <h3 style={styles.featureTitle}>Güvenli Alışveriş</h3>
            <p style={styles.featureDescription}>
              256-bit SSL şifreleme ile tüm işlemleriniz güvende. Ödeme bilgileriniz tamamen korunur.
            </p>
          </div>
          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>
              <FaTruck />
            </div>
            <h3 style={styles.featureTitle}>Hızlı Teslimat</h3>
            <p style={styles.featureDescription}>
              Aynı gün kargo ile siparişleriniz hızlıca kapınıza gelsin. Türkiye'nin her yerine teslimat.
            </p>
          </div>
          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>
              <FaStar />
            </div>
            <h3 style={styles.featureTitle}>Kalite Garantisi</h3>
            <p style={styles.featureDescription}>
              Tüm satıcılarımız titizlikle seçilir ve ürün kalitesi sürekli denetlenir.
            </p>
          </div>
        </div>
      </section>

      {/* Brands Strip */}
      <div style={styles.brandStrip}>
        <div style={{ display: 'inline-block', animation: 'scroll 20s linear infinite' }}>
          {['SAMSUNG', 'APPLE', 'NIKE', 'ADIDAS', 'SONY', 'LG', 'PUMA', 'ZARA', 'H&M', 'DYSON', 'BOSCH', 'PHILIPS'].map((brand, i) => (
            <span key={i} style={styles.brandLogo}>{brand}</span>
          ))}
          {['SAMSUNG', 'APPLE', 'NIKE', 'ADIDAS', 'SONY', 'LG', 'PUMA', 'ZARA', 'H&M', 'DYSON', 'BOSCH', 'PHILIPS'].map((brand, i) => (
            <span key={`dup-${i}`} style={styles.brandLogo}>{brand}</span>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <section style={styles.ctaSection}>
        <h2 style={styles.ctaTitle}>Satıcı Olmak İster misiniz?</h2>
        <p style={styles.ctaText}>
          Ürünlerinizi milyonlarca müşteriye ulaştırın. Hemen başvurun, satışa başlayın!
        </p>
        <Link to="/vendor/register" style={styles.ctaButton}>
          <FaStore /> Hemen Başvur <FaArrowRight />
        </Link>
      </section>

      {/* Cookie Consent Banner */}
      {showCookieBanner && (
        <div style={styles.cookieBanner}>
          <FaCookieBite size={24} color="#f59e0b" />
          <div style={{ flex: 1, fontSize: '13px', lineHeight: '1.5' }}>
            Size daha iyi bir alışveriş deneyimi sunabilmek için çerezleri kullanıyoruz. 
            Detaylı bilgi için <a href="#" style={{ color: '#38bdf8' }}>Çerez Politikamızı</a> inceleyebilirsiniz.
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              onClick={() => setShowCookieBanner(false)}
              style={{ ...styles.cookieBtn, backgroundColor: 'transparent', color: '#94a3b8', border: '1px solid #475569' }}
            >
              Reddet
            </button>
            <button 
              onClick={() => setShowCookieBanner(false)}
              style={{ ...styles.cookieBtn, backgroundColor: '#059669', color: 'white' }}
            >
              Kabul Et
            </button>
          </div>
        </div>
      )}

      {/* Quick View Modal */}
      <QuickViewModal 
        product={quickViewProduct} 
        onClose={() => setQuickViewProduct(null)} 
        addToCart={addToCart}
        toggleFavorite={toggleFavorite}
        favorites={favorites}
      />

      {/* CSS Animations */}
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
          }
        }
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Home;
