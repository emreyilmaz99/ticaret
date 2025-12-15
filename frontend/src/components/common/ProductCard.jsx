// src/components/common/ProductCard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  FaHeart, 
  FaRegHeart, 
  FaShoppingCart, 
  FaEye, 
  FaExchangeAlt,
  FaStar,
  FaBolt
} from 'react-icons/fa';
import { useFavorites } from '../../context/FavoritesContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from './Toast';

export const ProductCard = ({
  product,
  viewMode = 'grid', // 'grid' veya 'list'
  isInCompareList = false,
  onToggleCompare,
  onAddToCart,
  onQuickView,
  styles: propStyles
}) => {
  const { isFavorite, addToFavorites, removeFromFavorites } = useFavorites();
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const isFav = isFavorite(product.id);

  const productUrl = `/product/${product.slug || product.id}`;

  // Get product image URL from API
  const getImageUrl = () => {
    // API'den gelen image alanını kullan (backend zaten tam URL döndürüyor)
    const imageFromAPI = product.image || product.thumbnail || product.image_url;
    
    if (imageFromAPI) {
      return imageFromAPI;
    }
    
    // Eğer images array'i varsa ilk resmi kullan
    if (product.images && Array.isArray(product.images) && product.images.length > 0) {
      return product.images[0];
    }
    
    // Fallback placeholder
    return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23fafafa" width="400" height="400"/%3E%3Ctext fill="%23cbd5e1" font-family="system-ui" font-size="18" font-weight="600" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EÜrün Görseli%3C/text%3E%3C/svg%3E';
  };

  const productImageUrl = getImageUrl();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleToggleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isFav) removeFromFavorites(product.id);
    else addToFavorites(product);
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      showToast('Sepete ürün eklemek için lütfen giriş yapın.', 'warning');
      navigate('/register');
      return;
    }
    if (onAddToCart) onAddToCart(product);
  };

  const handleBuyNow = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      showToast('Satın alma işlemi için lütfen giriş yapın.', 'warning');
      navigate('/register');
      return;
    }
    if (onAddToCart) onAddToCart(product);
    navigate('/cart');
  };

  const handleQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onQuickView) onQuickView(product);
    else navigate(productUrl);
  };

  const handleToggleCompare = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onToggleCompare) onToggleCompare(product);
  };

  // --- KATEGORİ İSMİNİ GÜVENLİ ALMA ---
  const getCategoryName = () => {
    if (product.vendor_name) return product.vendor_name;
    if (product.category && typeof product.category === 'object') {
      return product.category.name || 'GENEL';
    }
    return product.category || 'GENEL';
  };

  // --- MODERN SENIOR LEVEL STİLLER ---
  const cardStyles = propStyles || {
    card: {
      backgroundColor: 'white',
      borderRadius: isMobile ? '20px' : '24px',
      overflow: 'hidden',
      border: '1px solid #e5e7eb',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      position: 'relative',
      cursor: 'pointer',
      display: 'flex',
      flexDirection: 'column',
      textDecoration: 'none',
      color: 'inherit',
      height: '100%',
      ...(viewMode === 'list' && !isMobile ? { flexDirection: 'row', maxHeight: '280px' } : {}),
    },
    imageContainer: {
      width: viewMode === 'list' && !isMobile ? '280px' : '100%',
      height: viewMode === 'list' && !isMobile ? '100%' : isMobile ? '220px' : '280px',
      backgroundColor: '#fafafa',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      position: 'relative',
      flexShrink: 0,
    },
    cardImage: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
    },
    cardBody: {
      padding: isMobile ? '14px' : '18px',
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
    },
    cardCategory: {
      fontSize: '10px',
      color: '#059669',
      textTransform: 'uppercase',
      fontWeight: '800',
      letterSpacing: '1px',
      marginBottom: '2px',
    },
    cardTitle: {
      fontSize: isMobile ? '13px' : '14px',
      fontWeight: '600',
      color: '#0f172a',
      lineHeight: '1.3',
      height: isMobile ? '34px' : '36px',
      overflow: 'hidden',
      display: '-webkit-box',
      WebkitLineClamp: 2,
      WebkitBoxOrient: 'vertical',
      marginBottom: '4px',
    },
    rating: {
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      fontSize: '11px',
      color: '#f59e0b',
      marginBottom: '6px',
    },
    priceSection: {
      marginTop: 'auto',
      paddingTop: '8px',
      borderTop: '1px solid #f1f5f9',
    },
    priceRow: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      marginBottom: '10px',
    },
    priceGroup: { 
      display: 'flex', 
      flexDirection: 'column',
      gap: '2px',
      flex: 1,
    },
    price: { 
      fontSize: isMobile ? '17px' : '20px', 
      fontWeight: '800', 
      color: '#0f172a',
      letterSpacing: '-0.5px',
    },
    oldPrice: { 
      fontSize: '11px', 
      color: '#94a3b8', 
      textDecoration: 'line-through',
      fontWeight: '500',
    },
    buttonsRow: {
      display: 'flex',
      gap: '8px',
      width: '100%',
    },
    buyNowBtn: {
      flex: 1,
      height: '38px',
      borderRadius: '10px',
      backgroundColor: '#059669',
      color: 'white',
      border: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '6px',
      fontSize: '12px',
      fontWeight: '700',
      cursor: 'pointer',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      boxShadow: '0 2px 8px rgba(5, 150, 105, 0.25)',
    },
    addToCartBtn: {
      width: '38px',
      height: '38px',
      borderRadius: '10px',
      backgroundColor: '#f0fdf4',
      color: '#059669',
      border: '1px solid #d1fae5',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      flexShrink: 0,
    },
    discountBadge: {
      position: 'absolute',
      top: '12px',
      left: '12px',
      backgroundColor: '#dc2626',
      color: 'white',
      fontSize: '10px',
      fontWeight: '800',
      padding: '5px 10px',
      borderRadius: '8px',
      zIndex: 3,
      boxShadow: '0 4px 12px rgba(220, 38, 38, 0.4)',
      letterSpacing: '0.5px',
    },
    actionOverlay: {
      position: 'absolute',
      top: '12px',
      right: '12px',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      zIndex: 10,
    },
    cardActionBtn: {
      width: '36px',
      height: '36px',
      borderRadius: '10px',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(0, 0, 0, 0.06)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      color: '#64748b',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
    },
  };

  return (
    <div
      style={cardStyles.card}
      onMouseEnter={(e) => {
        if (!isMobile) {
          e.currentTarget.style.transform = 'translateY(-8px)';
          e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.12)';
          const img = e.currentTarget.querySelector('img');
          if (img) img.style.transform = 'scale(1.08)';
        }
      }}
      onMouseLeave={(e) => {
        if (!isMobile) {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.08)';
          const img = e.currentTarget.querySelector('img');
          if (img) img.style.transform = 'scale(1)';
        }
      }}
    >
      {/* Featured Deal Badge */}
      {product.has_deal && product.deal_badge && (
        <div style={{
          ...cardStyles.discountBadge,
          backgroundColor: product.deal_badge.color || '#dc2626'
        }}>
          {product.deal_badge.text || `%${Math.round(product.discount_percentage)} İNDİRİM`}
        </div>
      )}
      
      {/* Discount Badge (geriye dönük uyumluluk) */}
      {!product.has_deal && product.discount_percent > 0 && (
        <div style={cardStyles.discountBadge}>
          %{product.discount_percent} İNDİRİM
        </div>
      )}
      
      {/* Action Overlay */}
      <div style={cardStyles.actionOverlay}>
        <button 
          style={cardStyles.cardActionBtn} 
          onClick={handleToggleFavorite} 
          title="Favorilere Ekle"
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = isFav ? '#fee2e2' : 'white';
            e.currentTarget.style.transform = 'scale(1.1)';
            e.currentTarget.style.borderColor = isFav ? '#fca5a5' : '#e5e7eb';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.borderColor = 'rgba(0, 0, 0, 0.06)';
          }}
        >
          {isFav ? <FaHeart color="#ef4444" size={15} /> : <FaRegHeart size={15} />}
        </button>
        <button 
          style={cardStyles.cardActionBtn} 
          onClick={handleQuickView} 
          title="Hızlı Bakış"
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#f0fdf4';
            e.currentTarget.style.transform = 'scale(1.1)';
            e.currentTarget.style.color = '#059669';
            e.currentTarget.style.borderColor = '#d1fae5';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.color = '#64748b';
            e.currentTarget.style.borderColor = 'rgba(0, 0, 0, 0.06)';
          }}
        >
          <FaEye size={15} />
        </button>
        {onToggleCompare && (
          <button 
            style={{ 
              ...cardStyles.cardActionBtn,
              backgroundColor: isInCompareList ? '#059669' : 'rgba(255, 255, 255, 0.95)',
              color: isInCompareList ? 'white' : '#64748b',
              borderColor: isInCompareList ? '#059669' : 'rgba(0, 0, 0, 0.06)'
            }} 
            onClick={handleToggleCompare} 
            title="Karşılaştır"
            onMouseEnter={(e) => {
              if (!isInCompareList) {
                e.currentTarget.style.backgroundColor = '#f0fdf4';
                e.currentTarget.style.color = '#059669';
                e.currentTarget.style.borderColor = '#d1fae5';
              }
              e.currentTarget.style.transform = 'scale(1.1)';
            }}
            onMouseLeave={(e) => {
              if (!isInCompareList) {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
                e.currentTarget.style.color = '#64748b';
                e.currentTarget.style.borderColor = 'rgba(0, 0, 0, 0.06)';
              }
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <FaExchangeAlt size={14} />
          </button>
        )}
      </div>

      {/* Product Image */}
      <Link to={productUrl} style={{ textDecoration: 'none' }}>
        <div style={cardStyles.imageContainer}>
          <img
            src={productImageUrl}
            alt={product.name}
            style={cardStyles.cardImage}
            loading="lazy"
            onError={(e) => {
              // Eğer resim yüklenemezse fallback göster
              e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23fafafa" width="400" height="400"/%3E%3Ctext fill="%23cbd5e1" font-family="system-ui" font-size="18" font-weight="600" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EÜrün Görseli%3C/text%3E%3C/svg%3E';
            }}
          />
        </div>
      </Link>

      {/* Card Body */}
      <div style={cardStyles.cardBody}>
        {/* Category */}
        <div style={cardStyles.cardCategory}>{getCategoryName()}</div>
        
        {/* Product Title */}
        <Link to={productUrl} style={{ textDecoration: 'none', color: 'inherit' }}>
          <h3 style={cardStyles.cardTitle}>{product.name}</h3>
        </Link>

        {/* Rating */}
        <div style={cardStyles.rating}>
          {[...Array(5)].map((_, i) => {
            const rating = parseFloat(product.rating || product.rating_avg || 0);
            const isFilled = i < Math.floor(rating);
            
            return (
              <FaStar 
                key={i} 
                color={isFilled ? '#f59e0b' : '#e5e7eb'} 
                size={11}
              />
            );
          })}
          <span style={{ color: '#0f172a', marginLeft: '4px', fontSize: '11px', fontWeight: '700' }}>
            {parseFloat(product.rating || product.rating_avg || 0).toFixed(1)}
          </span>
          <span style={{ color: '#94a3b8', fontSize: '10px' }}>
            ({product.review_count || product.reviews_count || 0})
          </span>
        </div>

        {/* Price Section */}
        <div style={cardStyles.priceSection}>
          {/* Price Row */}
          <div style={cardStyles.priceRow}>
            <div style={cardStyles.priceGroup}>
              {/* Original Price (crossed out) */}
              {(product.has_deal && product.original_price) || (!product.has_deal && product.discount_percent > 0 && product.compare_at_price) ? (
                <span style={cardStyles.oldPrice}>
                  {parseFloat(product.original_price || product.compare_at_price).toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL
                </span>
              ) : null}
              
              {/* Current Price */}
              <div style={{
                ...cardStyles.price,
                color: (product.has_deal || product.discount_percent > 0) ? '#059669' : '#0f172a'
              }}>
                {parseFloat(product.price || 0).toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL
              </div>
            </div>
          </div>
          
          {/* Buttons Row */}
          <div style={cardStyles.buttonsRow}>
            <button 
              style={cardStyles.buyNowBtn} 
              onClick={handleBuyNow} 
              title="Hemen Satın Al"
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#047857';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(5, 150, 105, 0.35)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#059669';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(5, 150, 105, 0.25)';
              }}
            >
              <FaBolt size={13} />
              <span>Hemen Al</span>
            </button>
            <button 
              style={cardStyles.addToCartBtn} 
              onClick={handleAddToCart} 
              title="Sepete Ekle"
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#059669';
                e.currentTarget.style.color = 'white';
                e.currentTarget.style.borderColor = '#059669';
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#f0fdf4';
                e.currentTarget.style.color = '#059669';
                e.currentTarget.style.borderColor = '#d1fae5';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <FaShoppingCart size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
