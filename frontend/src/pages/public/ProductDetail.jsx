import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { 
  FaStar, FaShoppingCart, FaHeart, FaRegHeart, FaTruck, FaShieldAlt, 
  FaUndo, FaShareAlt, FaChevronRight, FaStore, FaMinus, FaPlus,
  FaCheck, FaBox, FaTag, FaFacebook, FaTwitter, FaWhatsapp, FaCopy,
  FaExclamationTriangle, FaCalendarAlt, FaBoxOpen, FaClock, FaEye
} from 'react-icons/fa';
import { getProduct, getRelatedProducts } from '../../api/publicApi';
import { useCart } from '../../context/CartContext';
import { useFavorites } from '../../context/FavoritesContext';
import { useToast } from '../../components/Toast';

const ProductDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const toast = useToast();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState('description');
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [showLightbox, setShowLightbox] = useState(false);

  // Fetch product data
  const { data, isLoading, error } = useQuery({
    queryKey: ['product', slug],
    queryFn: () => getProduct(slug),
    enabled: !!slug,
  });

  // Fetch related products
  const { data: relatedData } = useQuery({
    queryKey: ['relatedProducts', slug],
    queryFn: () => getRelatedProducts(slug, 4),
    enabled: !!slug,
  });

  const product = data?.data?.product;
  const relatedProducts = relatedData?.data?.products || [];

  // Set default variant when product loads
  useEffect(() => {
    if (product?.variants?.length > 0 && !selectedVariant) {
      setSelectedVariant(product.variants[0]);
    }
  }, [product, selectedVariant]);

  // Load recently viewed products from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('recentlyViewed');
    if (stored) {
      setRecentlyViewed(JSON.parse(stored).filter(p => p.slug !== slug));
    }
  }, [slug]);

  // Save current product to recently viewed
  useEffect(() => {
    if (product) {
      const stored = localStorage.getItem('recentlyViewed');
      let items = stored ? JSON.parse(stored) : [];
      // Remove if already exists
      items = items.filter(p => p.slug !== product.slug);
      // Add to beginning
      items.unshift({
        id: product.id,
        slug: product.slug,
        name: product.name,
        price: product.price,
        image: product.images?.[0]?.url
      });
      // Keep only last 10
      items = items.slice(0, 10);
      localStorage.setItem('recentlyViewed', JSON.stringify(items));
    }
  }, [product]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!showLightbox) return;
      
      if (e.key === 'Escape') {
        setShowLightbox(false);
      } else if (e.key === 'ArrowLeft' && product?.images?.length > 1) {
        setSelectedImage(prev => prev === 0 ? product.images.length - 1 : prev - 1);
      } else if (e.key === 'ArrowRight' && product?.images?.length > 1) {
        setSelectedImage(prev => prev === product.images.length - 1 ? 0 : prev + 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showLightbox, product]);

  // Prevent body scroll when lightbox is open
  useEffect(() => {
    if (showLightbox) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showLightbox]);

  // Get current price based on selected variant
  const currentPrice = selectedVariant?.price || product?.price || 0;
  const currentStock = selectedVariant?.stock ?? product?.stock ?? 0;
  const isInStock = currentStock > 0;

  const handleAddToCart = () => {
    if (!isInStock) {
      toast.error('Hata', 'Bu ürün şu anda stokta yok.');
      return;
    }

    addToCart({
      id: product.id,
      variantId: selectedVariant?.id,
    }, quantity, selectedVariant);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(price);
  };

  // Social sharing functions
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareText = product?.name || '';

  const handleShare = (platform) => {
    const urls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`,
    };
    if (urls[platform]) {
      window.open(urls[platform], '_blank', 'width=600,height=400');
    }
    setShowShareMenu(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    toast.success('Kopyalandı', 'Ürün linki panoya kopyalandı!');
    setShowShareMenu(false);
  };

  // Check if low stock warning should show
  const showLowStockWarning = product?.low_stock_warning || (selectedVariant?.low_stock);

  // Styles
  const styles = {
    container: {
      maxWidth: '1400px',
      margin: '0 auto',
      padding: isMobile ? '16px 12px 40px' : '24px 20px 60px',
      fontFamily: '"Inter", sans-serif',
    },
    // Breadcrumb
    breadcrumb: {
      display: isMobile ? 'none' : 'flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: '14px',
      color: '#64748b',
      marginBottom: '32px',
      flexWrap: 'wrap',
    },
    breadcrumbLink: {
      color: '#64748b',
      textDecoration: 'none',
      transition: 'color 0.2s',
    },
    // Main Grid
    mainGrid: {
      display: isMobile ? 'flex' : 'grid',
      flexDirection: 'column',
      gridTemplateColumns: '1fr 1fr',
      gap: isMobile ? '24px' : '60px',
      marginBottom: isMobile ? '32px' : '60px',
    },
    // Image Gallery
    imageSection: {
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      gap: '16px',
    },
    thumbnails: {
      display: 'flex',
      flexDirection: isMobile ? 'row' : 'column',
      gap: '12px',
      order: isMobile ? 2 : 1,
      overflowX: isMobile ? 'auto' : 'visible',
      padding: isMobile ? '8px 0' : '0',
    },
    thumbnail: (isActive) => ({
      width: isMobile ? '60px' : '80px',
      height: isMobile ? '60px' : '80px',
      borderRadius: '12px',
      border: isActive ? '2px solid #059669' : '2px solid #e2e8f0',
      overflow: 'hidden',
      cursor: 'pointer',
      transition: 'all 0.2s',
      flexShrink: 0,
    }),
    thumbnailImg: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
    },
    mainImage: {
      flex: 1,
      backgroundColor: '#f8fafc',
      borderRadius: '16px',
      padding: isMobile ? '12px' : '20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      minHeight: isMobile ? '280px' : '350px',
      cursor: 'zoom-in',
      order: isMobile ? 1 : 2,
    },
    mainImageImg: {
      maxWidth: '100%',
      maxHeight: isMobile ? '280px' : '500px',
      objectFit: 'contain',
    },
    featuredBadge: {
      position: 'absolute',
      top: '20px',
      left: '20px',
      backgroundColor: '#059669',
      color: 'white',
      padding: '6px 14px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '600',
    },
    noImage: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#94a3b8',
      gap: '12px',
    },
    // Product Info
    infoSection: {
      display: 'flex',
      flexDirection: 'column',
      gap: isMobile ? '16px' : '20px',
    },
    vendorLink: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      color: '#059669',
      textDecoration: 'none',
      fontSize: isMobile ? '13px' : '14px',
      fontWeight: '500',
    },
    title: {
      fontSize: isMobile ? '22px' : '32px',
      fontWeight: '700',
      color: '#0f172a',
      lineHeight: 1.2,
      margin: 0,
    },
    rating: {
      display: 'flex',
      alignItems: 'center',
      gap: isMobile ? '8px' : '12px',
    },
    stars: {
      display: 'flex',
      gap: '2px',
    },
    reviewsText: {
      color: '#64748b',
      fontSize: isMobile ? '12px' : '14px',
    },
    priceSection: {
      display: 'flex',
      alignItems: 'baseline',
      gap: isMobile ? '8px' : '12px',
    },
    price: {
      fontSize: isMobile ? '28px' : '36px',
      fontWeight: '700',
      color: '#059669',
    },
    priceRange: {
      fontSize: isMobile ? '13px' : '16px',
      color: '#64748b',
    },
    shortDescription: {
      color: '#475569',
      lineHeight: 1.7,
      fontSize: isMobile ? '14px' : '15px',
    },
    // Variants
    variantsSection: {
      borderTop: '1px solid #e2e8f0',
      borderBottom: '1px solid #e2e8f0',
      padding: isMobile ? '16px 0' : '20px 0',
    },
    variantLabel: {
      fontSize: isMobile ? '13px' : '14px',
      fontWeight: '600',
      color: '#334155',
      marginBottom: isMobile ? '10px' : '12px',
    },
    variantOptions: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: isMobile ? '8px' : '10px',
    },
    variantBtn: (isActive, disabled) => ({
      padding: isMobile ? '8px 14px' : '10px 20px',
      borderRadius: isMobile ? '8px' : '10px',
      border: isActive ? '2px solid #059669' : '1px solid #e2e8f0',
      backgroundColor: disabled ? '#f1f5f9' : isActive ? '#ecfdf5' : 'white',
      color: disabled ? '#94a3b8' : isActive ? '#059669' : '#475569',
      fontSize: isMobile ? '12px' : '14px',
      fontWeight: '500',
      cursor: disabled ? 'not-allowed' : 'pointer',
      transition: 'all 0.2s',
      display: 'flex',
      alignItems: 'center',
      gap: isMobile ? '6px' : '8px',
      opacity: disabled ? 0.6 : 1,
    }),
    // Stock
    stockBadge: (inStock) => ({
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      padding: '8px 16px',
      borderRadius: '8px',
      backgroundColor: inStock ? '#ecfdf5' : '#fef2f2',
      color: inStock ? '#059669' : '#dc2626',
      fontSize: '14px',
      fontWeight: '500',
    }),
    // Quantity
    quantitySection: {
      display: 'flex',
      alignItems: 'center',
      gap: isMobile ? '12px' : '20px',
      flexWrap: isMobile ? 'wrap' : 'nowrap',
    },
    quantityLabel: {
      fontSize: isMobile ? '13px' : '14px',
      fontWeight: '600',
      color: '#334155',
    },
    quantityControls: {
      display: 'flex',
      alignItems: 'center',
      border: '1px solid #e2e8f0',
      borderRadius: isMobile ? '10px' : '12px',
      overflow: 'hidden',
    },
    quantityBtn: {
      width: isMobile ? '40px' : '44px',
      height: isMobile ? '40px' : '44px',
      border: 'none',
      backgroundColor: '#f8fafc',
      color: '#475569',
      fontSize: isMobile ? '14px' : '16px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'background 0.2s',
    },
    quantityValue: {
      width: isMobile ? '48px' : '60px',
      textAlign: 'center',
      fontSize: isMobile ? '14px' : '16px',
      fontWeight: '600',
      color: '#0f172a',
      border: 'none',
      outline: 'none',
      backgroundColor: 'transparent',
      padding: 0,
      appearance: 'textfield',
      margin: 0,
    },
    // Actions
    actionsSection: {
      display: 'flex',
      gap: isMobile ? '8px' : '12px',
      flexWrap: isMobile ? 'wrap' : 'nowrap',
    },
    addToCartBtn: {
      flex: 1,
      backgroundColor: '#0f172a',
      color: 'white',
      border: 'none',
      padding: isMobile ? '14px 20px' : '16px 32px',
      borderRadius: isMobile ? '12px' : '14px',
      fontSize: isMobile ? '14px' : '16px',
      fontWeight: '600',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: isMobile ? '8px' : '10px',
      transition: 'all 0.2s',
      minWidth: isMobile ? '100%' : 'auto',
    },
    addToCartBtnDisabled: {
      backgroundColor: '#94a3b8',
      cursor: 'not-allowed',
    },
    iconBtn: {
      width: isMobile ? '48px' : '54px',
      height: isMobile ? '48px' : '54px',
      borderRadius: isMobile ? '12px' : '14px',
      border: '1px solid #e2e8f0',
      backgroundColor: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: isMobile ? '18px' : '20px',
      color: '#64748b',
      cursor: 'pointer',
      transition: 'all 0.2s',
    },
    // Features
    features: {
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
      gap: isMobile ? '12px' : '16px',
      marginTop: isMobile ? '16px' : '24px',
      padding: isMobile ? '16px' : '24px',
      backgroundColor: '#f8fafc',
      borderRadius: isMobile ? '12px' : '16px',
    },
    featureItem: {
      display: 'flex',
      flexDirection: isMobile ? 'row' : 'column',
      alignItems: 'center',
      textAlign: isMobile ? 'left' : 'center',
      gap: isMobile ? '12px' : '8px',
    },
    featureIcon: {
      width: isMobile ? '36px' : '40px',
      height: isMobile ? '36px' : '40px',
      borderRadius: isMobile ? '8px' : '10px',
      backgroundColor: '#ecfdf5',
      color: '#059669',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    },
    featureTitle: {
      fontSize: isMobile ? '12px' : '13px',
      fontWeight: '600',
      color: '#334155',
    },
    featureText: {
      fontSize: isMobile ? '11px' : '12px',
      color: '#64748b',
    },
    // Tabs
    tabsSection: {
      marginBottom: isMobile ? '32px' : '60px',
    },
    tabs: {
      display: 'flex',
      borderBottom: '2px solid #e2e8f0',
      marginBottom: isMobile ? '20px' : '32px',
      overflowX: isMobile ? 'auto' : 'visible',
    },
    tab: (isActive) => ({
      padding: isMobile ? '12px 16px' : '16px 32px',
      border: 'none',
      backgroundColor: 'transparent',
      color: isActive ? '#059669' : '#64748b',
      fontSize: isMobile ? '13px' : '15px',
      fontWeight: '600',
      cursor: 'pointer',
      borderBottom: isActive ? '2px solid #059669' : '2px solid transparent',
      marginBottom: '-2px',
      transition: 'all 0.2s',
      whiteSpace: 'nowrap',
    }),
    tabContent: {
      color: '#475569',
      lineHeight: 1.8,
      fontSize: isMobile ? '14px' : '15px',
    },
    // Specifications
    specsGrid: {
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
      gap: isMobile ? '12px' : '16px',
    },
    specItem: {
      display: 'flex',
      padding: isMobile ? '12px' : '16px',
      backgroundColor: '#f8fafc',
      borderRadius: isMobile ? '10px' : '12px',
    },
    specLabel: {
      width: isMobile ? '100px' : '140px',
      color: '#64748b',
      fontSize: isMobile ? '12px' : '14px',
    },
    specValue: {
      flex: 1,
      fontWeight: '500',
      color: '#0f172a',
      fontSize: isMobile ? '12px' : '14px',
    },
    // Tags
    tagsSection: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '10px',
      marginTop: '20px',
      alignItems: 'center',
    },
    tag: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      padding: '8px 14px',
      backgroundColor: '#f1f5f9',
      color: '#475569',
      borderRadius: '20px',
      fontSize: '13px',
      textDecoration: 'none',
    },
    // Related Products
    relatedSection: {
      marginTop: isMobile ? '32px' : '60px',
    },
    sectionTitle: {
      fontSize: isMobile ? '18px' : '24px',
      fontWeight: '700',
      color: '#0f172a',
      marginBottom: isMobile ? '20px' : '32px',
    },
    relatedGrid: {
      display: 'grid',
      gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
      gap: isMobile ? '12px' : '24px',
    },
    productCard: {
      backgroundColor: 'white',
      borderRadius: isMobile ? '12px' : '16px',
      overflow: 'hidden',
      border: '1px solid #e2e8f0',
      transition: 'all 0.2s',
      textDecoration: 'none',
    },
    productCardImage: {
      width: '100%',
      height: isMobile ? '140px' : '200px',
      objectFit: 'cover',
      backgroundColor: '#f8fafc',
    },
    productCardInfo: {
      padding: isMobile ? '12px' : '16px',
    },
    productCardName: {
      fontSize: isMobile ? '12px' : '14px',
      fontWeight: '600',
      color: '#0f172a',
      marginBottom: '4px',
      display: '-webkit-box',
      WebkitLineClamp: 2,
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden',
    },
    productCardPrice: {
      fontSize: isMobile ? '14px' : '16px',
      fontWeight: '700',
      color: '#059669',
    },
    // Loading & Error
    loadingContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '400px',
      color: '#64748b',
    },
    errorContainer: {
      textAlign: 'center',
      padding: '60px 20px',
      color: '#dc2626',
    },
    // Low Stock Warning
    lowStockWarning: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '12px 16px',
      backgroundColor: '#fef3c7',
      color: '#92400e',
      borderRadius: '10px',
      fontSize: '14px',
      fontWeight: '500',
    },
    // Share Menu
    shareMenuContainer: {
      position: 'relative',
    },
    shareMenu: {
      position: 'absolute',
      bottom: '60px',
      right: '0',
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
      padding: '8px',
      zIndex: 100,
      minWidth: '180px',
    },
    shareMenuItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      padding: '10px 14px',
      border: 'none',
      backgroundColor: 'transparent',
      width: '100%',
      fontSize: '14px',
      color: '#334155',
      cursor: 'pointer',
      borderRadius: '8px',
      transition: 'background 0.2s',
    },
    // Vendor Card
    vendorCard: {
      backgroundColor: '#f8fafc',
      borderRadius: '16px',
      padding: '20px',
      marginTop: '24px',
    },
    vendorCardHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      marginBottom: '16px',
    },
    vendorLogo: {
      width: '60px',
      height: '60px',
      borderRadius: '12px',
      backgroundColor: '#e2e8f0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    },
    vendorLogoImg: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
    },
    vendorInfo: {
      flex: 1,
    },
    vendorName: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#0f172a',
      marginBottom: '4px',
    },
    vendorStats: {
      display: 'flex',
      gap: '16px',
      fontSize: '13px',
      color: '#64748b',
    },
    vendorStat: {
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
    },
    vendorVisitBtn: {
      padding: '10px 20px',
      backgroundColor: '#059669',
      color: 'white',
      border: 'none',
      borderRadius: '10px',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      textDecoration: 'none',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
    },
    // Recently Viewed
    recentlyViewedSection: {
      marginTop: '60px',
      paddingTop: '40px',
      borderTop: '1px solid #e2e8f0',
    },
    // Lightbox
    lightboxOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'zoom-out',
    },
    lightboxContent: {
      position: 'relative',
      maxWidth: '90vw',
      maxHeight: '90vh',
    },
    lightboxImage: {
      maxWidth: '90vw',
      maxHeight: '85vh',
      objectFit: 'contain',
      borderRadius: '8px',
    },
    lightboxClose: {
      position: 'absolute',
      top: '-50px',
      right: '0',
      background: 'none',
      border: 'none',
      color: 'white',
      fontSize: '32px',
      cursor: 'pointer',
      padding: '10px',
    },
    lightboxNav: {
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      background: 'rgba(255,255,255,0.2)',
      border: 'none',
      color: 'white',
      fontSize: '24px',
      cursor: 'pointer',
      padding: '20px 15px',
      borderRadius: '8px',
      transition: 'background 0.2s',
    },
    lightboxThumbnails: {
      display: 'flex',
      justifyContent: 'center',
      gap: '10px',
      marginTop: '20px',
    },
    lightboxThumb: (isActive) => ({
      width: '60px',
      height: '60px',
      borderRadius: '8px',
      overflow: 'hidden',
      cursor: 'pointer',
      border: isActive ? '2px solid white' : '2px solid transparent',
      opacity: isActive ? 1 : 0.6,
    }),
  };

  if (isLoading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingContainer}>
          <div>Ürün yükleniyor...</div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div style={styles.container}>
        <div style={styles.errorContainer}>
          <h2>Ürün bulunamadı</h2>
          <p>Aradığınız ürün mevcut değil veya kaldırılmış olabilir.</p>
          <Link to="/products" style={{ color: '#059669' }}>Ürünlere Dön</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Lightbox Modal */}
      {showLightbox && product.images?.length > 0 && (
        <div style={styles.lightboxOverlay} onClick={() => setShowLightbox(false)}>
          <div style={styles.lightboxContent} onClick={(e) => e.stopPropagation()}>
            <button 
              style={styles.lightboxClose}
              onClick={() => setShowLightbox(false)}
            >
              ✕
            </button>
            
            {/* Previous Button */}
            {product.images.length > 1 && (
              <button 
                style={{...styles.lightboxNav, left: '-80px'}}
                onClick={() => setSelectedImage(prev => prev === 0 ? product.images.length - 1 : prev - 1)}
                onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.3)'}
                onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
              >
                ‹
              </button>
            )}
            
            <img 
              src={product.images[selectedImage]?.url} 
              alt={product.name}
              style={styles.lightboxImage}
            />
            
            {/* Next Button */}
            {product.images.length > 1 && (
              <button 
                style={{...styles.lightboxNav, right: '-80px'}}
                onClick={() => setSelectedImage(prev => prev === product.images.length - 1 ? 0 : prev + 1)}
                onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.3)'}
                onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
              >
                ›
              </button>
            )}
            
            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div style={styles.lightboxThumbnails}>
                {product.images.map((img, idx) => (
                  <div 
                    key={img.id || idx}
                    style={styles.lightboxThumb(selectedImage === idx)}
                    onClick={() => setSelectedImage(idx)}
                  >
                    <img src={img.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ))}
              </div>
            )}
            
            {/* Image Counter */}
            <div style={{ textAlign: 'center', color: 'white', marginTop: '15px', fontSize: '14px' }}>
              {selectedImage + 1} / {product.images.length}
            </div>
          </div>
        </div>
      )}

      {/* Breadcrumb */}
      <nav style={styles.breadcrumb}>
        <Link to="/" style={styles.breadcrumbLink}>Ana Sayfa</Link>
        <FaChevronRight size={10} />
        <Link to="/products" style={styles.breadcrumbLink}>Ürünler</Link>
        {product.breadcrumb?.map((crumb, i) => (
          <React.Fragment key={i}>
            <FaChevronRight size={10} />
            <Link to={`/category/${crumb.slug}`} style={styles.breadcrumbLink}>{crumb.name}</Link>
          </React.Fragment>
        ))}
        <FaChevronRight size={10} />
        <span style={{ color: '#0f172a' }}>{product.name}</span>
      </nav>

      {/* Main Content */}
      <div style={styles.mainGrid}>
        {/* Image Gallery */}
        <div style={styles.imageSection}>
          {product.images?.length > 1 && (
            <div style={styles.thumbnails}>
              {product.images.map((img, idx) => (
                <div 
                  key={img.id || idx}
                  style={styles.thumbnail(selectedImage === idx)}
                  onClick={() => setSelectedImage(idx)}
                >
                  <img src={img.url} alt={img.alt || product.name} style={styles.thumbnailImg} />
                </div>
              ))}
            </div>
          )}
          <div style={styles.mainImage} onClick={() => product.images?.length > 0 && setShowLightbox(true)}>
            {product.is_featured && (
              <span style={styles.featuredBadge}>⭐ Öne Çıkan</span>
            )}
            {product.images?.length > 0 ? (
              <img 
                src={product.images[selectedImage]?.url} 
                alt={product.name}
                style={styles.mainImageImg}
              />
            ) : (
              <div style={styles.noImage}>
                <FaBox size={64} />
                <span>Görsel yok</span>
              </div>
            )}
            {product.images?.length > 0 && (
              <div style={{
                position: 'absolute',
                bottom: '15px',
                right: '15px',
                backgroundColor: 'rgba(0,0,0,0.6)',
                color: 'white',
                padding: '6px 12px',
                borderRadius: '20px',
                fontSize: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <FaEye size={12} /> Büyütmek için tıkla
              </div>
            )}
          </div>
        </div>

        {/* Product Info */}
        <div style={styles.infoSection}>
          {/* Vendor */}
          {product.vendor && (
            <Link to={`/store/${product.vendor.slug}`} style={styles.vendorLink}>
              <FaStore />
              {product.vendor.name}
              {product.vendor.rating > 0 && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#f59e0b' }}>
                  <FaStar size={12} /> {product.vendor.rating.toFixed(1)}
                </span>
              )}
            </Link>
          )}

          {/* Title */}
          <h1 style={styles.title}>{product.name}</h1>

          {/* Rating */}
          <div style={styles.rating}>
            <div style={styles.stars}>
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} size={16} color={i < Math.floor(product.rating || 0) ? '#f59e0b' : '#e2e8f0'} />
              ))}
            </div>
            <span style={styles.reviewsText}>
              {(product.rating || 0).toFixed(1)} ({product.reviews_count || 0} değerlendirme)
            </span>
          </div>

          {/* Price */}
          <div style={styles.priceSection}>
            <span style={styles.price}>{formatPrice(currentPrice * (typeof quantity === 'number' ? quantity : 1))}</span>
            {quantity > 1 && (
              <span style={{ fontSize: '16px', color: '#64748b', fontWeight: '500' }}>
                ({formatPrice(currentPrice)} / adet)
              </span>
            )}
            {product.price_range && quantity === 1 && (
              <span style={styles.priceRange}>
                {formatPrice(product.price_range.min)} - {formatPrice(product.price_range.max)}
              </span>
            )}
          </div>

          {/* Short Description */}
          {product.short_description && (
            <p style={styles.shortDescription}>{product.short_description}</p>
          )}

          {/* Variants */}
          {product.variants?.length > 1 && (
            <div style={styles.variantsSection}>
              <div style={styles.variantLabel}>Seçenekler</div>
              <div style={styles.variantOptions}>
                {product.variants.map((variant) => (
                  <button
                    key={variant.id}
                    style={styles.variantBtn(selectedVariant?.id === variant.id, !variant.in_stock)}
                    onClick={() => variant.in_stock && setSelectedVariant(variant)}
                    disabled={!variant.in_stock}
                  >
                    {selectedVariant?.id === variant.id && <FaCheck size={12} />}
                    {variant.title || 'Varsayılan'}
                    {!variant.in_stock && ' (Tükendi)'}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Stock Status */}
          <div style={styles.stockBadge(isInStock)}>
            {isInStock ? (
              <>
                <FaCheck /> Stokta ({currentStock} adet)
              </>
            ) : (
              <>
                <FaBox /> Stokta Yok
              </>
            )}
          </div>

          {/* Low Stock Warning */}
          {showLowStockWarning && (
            <div style={styles.lowStockWarning}>
              <FaExclamationTriangle />
              Son {currentStock} adet kaldı! Acele edin!
            </div>
          )}

          {/* Quantity */}
          <div style={styles.quantitySection}>
            <span style={styles.quantityLabel}>Adet:</span>
            <div style={styles.quantityControls}>
              <button 
                style={styles.quantityBtn}
                onClick={() => setQuantity(Math.max(1, (typeof quantity === 'number' ? quantity : 1) - 1))}
              >
                <FaMinus size={12} />
              </button>
              <input 
                type="number"
                min="1"
                max={currentStock || 99}
                value={quantity}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === '') {
                    setQuantity('');
                  } else {
                    const numVal = parseInt(val);
                    if (!isNaN(numVal)) {
                      setQuantity(numVal);
                    }
                  }
                }}
                onBlur={() => {
                  let val = typeof quantity === 'number' ? quantity : parseInt(quantity);
                  if (isNaN(val) || val < 1) val = 1;
                  if (currentStock && val > currentStock) val = currentStock;
                  setQuantity(val);
                }}
                style={styles.quantityValue}
              />
              <button 
                style={styles.quantityBtn}
                onClick={() => setQuantity(Math.min(currentStock || 99, (typeof quantity === 'number' ? quantity : 1) + 1))}
              >
                <FaPlus size={12} />
              </button>
            </div>
          </div>

          {/* Actions */}
          <div style={styles.actionsSection}>
            <button 
              style={{
                ...styles.addToCartBtn,
                ...(isInStock ? {} : styles.addToCartBtnDisabled)
              }}
              onClick={handleAddToCart}
              disabled={!isInStock}
            >
              <FaShoppingCart />
              {isInStock ? 'Sepete Ekle' : 'Stokta Yok'}
            </button>
            <button 
              style={{
                ...styles.iconBtn,
                backgroundColor: isFavorite(product?.id) ? '#fef2f2' : '#f8fafc',
              }}
              onClick={() => toggleFavorite({
                id: product?.id,
                name: product?.name,
                slug: product?.slug,
                image: product?.images?.[0]?.url || product?.image,
                price: currentPrice,
                compare_price: product?.compare_price,
                stock: currentStock,
                in_stock: isInStock
              })}
            >
              {isFavorite(product?.id) ? <FaHeart color="#ef4444" /> : <FaRegHeart />}
            </button>
            <div style={styles.shareMenuContainer}>
              <button 
                style={styles.iconBtn}
                onClick={() => setShowShareMenu(!showShareMenu)}
              >
                <FaShareAlt />
              </button>
              {showShareMenu && (
                <div style={styles.shareMenu}>
                  <button 
                    style={{...styles.shareMenuItem, ':hover': { backgroundColor: '#f1f5f9' }}}
                    onClick={() => handleShare('facebook')}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#f1f5f9'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                  >
                    <FaFacebook color="#1877f2" /> Facebook
                  </button>
                  <button 
                    style={styles.shareMenuItem}
                    onClick={() => handleShare('twitter')}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#f1f5f9'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                  >
                    <FaTwitter color="#1da1f2" /> Twitter
                  </button>
                  <button 
                    style={styles.shareMenuItem}
                    onClick={() => handleShare('whatsapp')}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#f1f5f9'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                  >
                    <FaWhatsapp color="#25d366" /> WhatsApp
                  </button>
                  <button 
                    style={styles.shareMenuItem}
                    onClick={copyToClipboard}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#f1f5f9'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                  >
                    <FaCopy color="#64748b" /> Linki Kopyala
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Features */}
          <div style={styles.features}>
            <div style={styles.featureItem}>
              <div style={styles.featureIcon}><FaTruck size={18} /></div>
              <span style={styles.featureTitle}>Hızlı Teslimat</span>
              <span style={styles.featureText}>24 saatte kargoda</span>
            </div>
            <div style={styles.featureItem}>
              <div style={styles.featureIcon}><FaShieldAlt size={18} /></div>
              <span style={styles.featureTitle}>Güvenli Ödeme</span>
              <span style={styles.featureText}>256-bit SSL</span>
            </div>
            <div style={styles.featureItem}>
              <div style={styles.featureIcon}><FaUndo size={18} /></div>
              <span style={styles.featureTitle}>Kolay İade</span>
              <span style={styles.featureText}>14 gün iade hakkı</span>
            </div>
          </div>

          {/* Vendor Card */}
          {product.vendor && (
            <div style={styles.vendorCard}>
              <div style={styles.vendorCardHeader}>
                <div style={styles.vendorLogo}>
                  {product.vendor.logo ? (
                    <img src={product.vendor.logo} alt={product.vendor.name} style={styles.vendorLogoImg} />
                  ) : (
                    <FaStore size={24} color="#94a3b8" />
                  )}
                </div>
                <div style={styles.vendorInfo}>
                  <div style={styles.vendorName}>{product.vendor.name}</div>
                  <div style={styles.vendorStats}>
                    {product.vendor.rating > 0 && (
                      <span style={styles.vendorStat}>
                        <FaStar color="#f59e0b" size={12} />
                        {product.vendor.rating.toFixed(1)} ({product.vendor.rating_count} değerlendirme)
                      </span>
                    )}
                    {product.vendor.product_count > 0 && (
                      <span style={styles.vendorStat}>
                        <FaBoxOpen size={12} />
                        {product.vendor.product_count} ürün
                      </span>
                    )}
                    {product.vendor.member_since && (
                      <span style={styles.vendorStat}>
                        <FaCalendarAlt size={12} />
                        {product.vendor.member_since}'den beri üye
                      </span>
                    )}
                  </div>
                </div>
                <Link to={`/store/${product.vendor.slug}`} style={styles.vendorVisitBtn}>
                  <FaStore size={14} />
                  Mağazayı Ziyaret Et
                </Link>
              </div>
              {product.vendor.description && (
                <p style={{ margin: 0, fontSize: '14px', color: '#64748b', lineHeight: 1.6 }}>
                  {product.vendor.description.substring(0, 150)}{product.vendor.description.length > 150 ? '...' : ''}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Tabs Section */}
      <div style={styles.tabsSection}>
        <div style={styles.tabs}>
          <button 
            style={styles.tab(activeTab === 'description')}
            onClick={() => setActiveTab('description')}
          >
            Açıklama
          </button>
          {Object.keys(product.specifications || {}).length > 0 && (
            <button 
              style={styles.tab(activeTab === 'specs')}
              onClick={() => setActiveTab('specs')}
            >
              Özellikler
            </button>
          )}
          <button 
            style={styles.tab(activeTab === 'reviews')}
            onClick={() => setActiveTab('reviews')}
          >
            Değerlendirmeler ({product.reviews_count || 0})
          </button>
        </div>

        <div style={styles.tabContent}>
          {activeTab === 'description' && (
            <div>
              {product.description ? (
                <div dangerouslySetInnerHTML={{ __html: product.description.replace(/\n/g, '<br/>') }} />
              ) : (
                <p>Bu ürün için detaylı açıklama henüz eklenmemiş.</p>
              )}
              
              {/* Tags */}
              {product.tags?.length > 0 && (
                <div style={styles.tagsSection}>
                  <FaTag style={{ color: '#64748b' }} />
                  {product.tags.map((tag) => (
                    <Link 
                      key={tag.id} 
                      to={`/products?tag=${tag.slug}`}
                      style={styles.tag}
                    >
                      {tag.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'specs' && (
            <div style={styles.specsGrid}>
              {Object.entries(product.specifications || {}).map(([key, value]) => (
                <div key={key} style={styles.specItem}>
                  <span style={styles.specLabel}>{key}</span>
                  <span style={styles.specValue}>{value}</span>
                </div>
              ))}
              {selectedVariant?.weight && (
                <div style={styles.specItem}>
                  <span style={styles.specLabel}>Ağırlık</span>
                  <span style={styles.specValue}>{selectedVariant.weight}g</span>
                </div>
              )}
              {selectedVariant?.dimensions && (
                <div style={styles.specItem}>
                  <span style={styles.specLabel}>Boyutlar</span>
                  <span style={styles.specValue}>
                    {selectedVariant.dimensions.length} x {selectedVariant.dimensions.width} x {selectedVariant.dimensions.height} cm
                  </span>
                </div>
              )}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
              <p>Henüz değerlendirme yapılmamış.</p>
              <p style={{ fontSize: '14px', marginTop: '8px' }}>İlk değerlendiren siz olun!</p>
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div style={styles.relatedSection}>
          <h2 style={styles.sectionTitle}>Benzer Ürünler</h2>
          <div style={styles.relatedGrid}>
            {relatedProducts.map((item) => (
              <Link 
                key={item.id} 
                to={`/product/${item.slug}`}
                style={styles.productCard}
              >
                <img 
                  src={item.image || '/placeholder.jpg'} 
                  alt={item.name}
                  style={styles.productCardImage}
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
                <div style={styles.productCardInfo}>
                  <div style={styles.productCardName}>{item.name}</div>
                  <div style={styles.productCardPrice}>{formatPrice(item.price)}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Recently Viewed Products */}
      {recentlyViewed.length > 0 && (
        <div style={styles.recentlyViewedSection}>
          <h2 style={styles.sectionTitle}>
            <FaClock style={{ marginRight: '10px', color: '#64748b' }} />
            Son Görüntülediğiniz Ürünler
          </h2>
          <div style={styles.relatedGrid}>
            {recentlyViewed.slice(0, 4).map((item) => (
              <Link 
                key={item.id} 
                to={`/product/${item.slug}`}
                style={styles.productCard}
              >
                {item.image ? (
                  <img 
                    src={item.image} 
                    alt={item.name}
                    style={styles.productCardImage}
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                ) : (
                  <div style={{...styles.productCardImage, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <FaBox size={32} color="#cbd5e1" />
                  </div>
                )}
                <div style={styles.productCardInfo}>
                  <div style={styles.productCardName}>{item.name}</div>
                  <div style={styles.productCardPrice}>{formatPrice(item.price)}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
