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
import { useFavorites } from '../../../../context/FavoritesContext';
import { useAuth } from '../../../../context/AuthContext';
import { useToast } from '../../../../components/common/Toast';

export const ProductCard = ({
  product,
  viewMode,
  isInCompareList,
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
    onAddToCart(product);
  };

  const handleBuyNow = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      showToast('Satın alma işlemi için lütfen giriş yapın.', 'warning');
      navigate('/register');
      return;
    }
    onAddToCart(product);
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

  // --- KATEGORİ İSMİNİ GÜVENLİ ALMA (HATA ÇÖZÜMÜ) ---
  const getCategoryName = () => {
    if (product.vendor_name) return product.vendor_name;
    // Eğer product.category bir obje ise .name'ini al, string ise kendisini al
    if (product.category && typeof product.category === 'object') {
      return product.category.name || 'GENEL';
    }
    return product.category || 'GENEL';
  };

  // --- STİLLER ---
  const cardStyles = {
    card: {
      backgroundColor: 'white',
      borderRadius: isMobile ? '16px' : '24px',
      overflow: 'hidden',
      border: '1px solid #f1f5f9',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      position: 'relative',
      cursor: 'pointer',
      display: 'block',
      textDecoration: 'none',
      color: 'inherit',
      ...(viewMode === 'list' && !isMobile ? { display: 'flex', flexDirection: 'row', maxHeight: '240px' } : {}),
    },
    cardImage: {
      width: viewMode === 'list' && !isMobile ? '220px' : '100%',
      aspectRatio: viewMode === 'list' && !isMobile ? 'auto' : '1/1',
      height: viewMode === 'list' && !isMobile ? '100%' : 'auto',
      objectFit: 'contain',
      backgroundColor: 'white',
      padding: '16px',
      flexShrink: 0,
    },
    cardBody: {
      padding: viewMode === 'list' && !isMobile ? '24px' : '16px',
      flex: viewMode === 'list' && !isMobile ? 1 : 'initial',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      height: viewMode === 'list' && !isMobile ? '100%' : 'auto',
    },
    cardCategory: {
      fontSize: '11px',
      color: '#059669',
      textTransform: 'uppercase',
      fontWeight: '700',
      marginBottom: '6px',
      letterSpacing: '0.5px',
    },
    cardTitle: {
      fontSize: isMobile ? '14px' : '15px',
      fontWeight: '600',
      color: '#1e293b',
      marginBottom: '8px',
      lineHeight: '1.4',
      height: '42px',
      overflow: 'hidden',
      display: '-webkit-box',
      WebkitLineClamp: 2,
      WebkitBoxOrient: 'vertical',
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
      alignItems: 'flex-end',
      marginTop: 'auto',
      gap: '16px',
      paddingTop: '8px',
    },
    priceGroup: { display: 'flex', flexDirection: 'column', flex: 1, paddingRight: '8px' },
    price: { fontSize: isMobile ? '16px' : '18px', fontWeight: '800', color: '#1e293b' },
    oldPrice: { fontSize: '12px', color: '#94a3b8', textDecoration: 'line-through', marginBottom: '2px' },
    actions: { display: 'flex', gap: '8px', alignItems: 'center', flexShrink: 0, marginRight: '0' },
    addToCartBtn: {
      width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#059669', color: 'white',
      border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
      transition: 'all 0.2s', boxShadow: '0 4px 6px -1px rgba(5, 150, 105, 0.3)',
    },
    buyNowBtn: {
      height: '36px', padding: '0 16px', borderRadius: '10px', backgroundColor: '#f0fdf4',
      color: '#059669', border: '1px solid #d1fae5', display: 'flex', alignItems: 'center', gap: '6px',
      fontSize: '12px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s',
    },
    discountBadge: {
      position: 'absolute', top: '12px', left: '12px', backgroundColor: '#dc2626', color: 'white',
      fontSize: '11px', fontWeight: '700', padding: '4px 8px', borderRadius: '6px', zIndex: 3,
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
    actionOverlay: {
      position: 'absolute', top: '12px', right: '12px', display: 'flex', flexDirection: 'column', gap: '8px', zIndex: 10,
    },
    cardActionBtn: {
      width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'white', border: '1px solid #e2e8f0',
      display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b',
      transition: 'all 0.2s', boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    },
  };

  return (
    <div
      style={cardStyles.card}
      onMouseEnter={(e) => {
        if (!isMobile) {
          e.currentTarget.style.transform = 'translateY(-5px)';
          e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
        }
      }}
      onMouseLeave={(e) => {
        if (!isMobile) {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.05)';
        }
      }}
    >
      {/* Featured Deal Badge - API'den gelen kampanya bilgisi */}
      {product.has_deal && product.deal_badge && (
        <div style={{
          ...cardStyles.discountBadge,
          backgroundColor: product.deal_badge.color || '#ef4444'
        }}>
          {product.deal_badge.text || `%${Math.round(product.discount_percentage)} İndirim`}
        </div>
      )}
      
      {/* Eski discount alanı (geriye dönük uyumluluk) */}
      {!product.has_deal && product.discount_percent > 0 && (
        <div style={cardStyles.discountBadge}>%{product.discount_percent} İndirim</div>
      )}
      
      <div style={cardStyles.actionOverlay}>
        <button style={cardStyles.cardActionBtn} onClick={handleToggleFavorite} title="Favori">
          {isFav ? <FaHeart color="#ef4444" size={14} /> : <FaRegHeart size={14} />}
        </button>
        <button style={cardStyles.cardActionBtn} onClick={handleQuickView} title="Hızlı Bakış">
          <FaEye size={14} />
        </button>
        {onToggleCompare && (
          <button 
            style={{ 
              ...cardStyles.cardActionBtn,
              backgroundColor: isInCompareList ? '#059669' : 'white',
              color: isInCompareList ? 'white' : '#64748b',
              borderColor: isInCompareList ? '#059669' : '#e2e8f0'
            }} 
            onClick={handleToggleCompare} title="Karşılaştır"
          >
            <FaExchangeAlt size={14} />
          </button>
        )}
      </div>

      <Link to={productUrl} style={{ textDecoration: 'none', color: 'inherit' }}>
        <img
          src={product.image || 'https://via.placeholder.com/300?text=Urun'}
          alt={product.name}
          style={cardStyles.cardImage}
        />
      </Link>

      <div style={cardStyles.cardBody}>
        <div>
          {/* GÜVENLİ KATEGORİ GÖSTERİMİ */}
          <div style={cardStyles.cardCategory}>{getCategoryName()}</div>
          
          <Link to={productUrl} style={{ textDecoration: 'none', color: 'inherit' }}>
            <h3 style={cardStyles.cardTitle}>{product.name}</h3>
          </Link>

          <div style={cardStyles.rating}>
            {[...Array(5)].map((_, i) => (
              <FaStar key={i} color={i < (product.rating || 4) ? '#f59e0b' : '#e2e8f0'} size={12} />
            ))}
            <span style={{ color: '#94a3b8', marginLeft: '4px' }}>({product.review_count || 0})</span>
          </div>
        </div>

        <div style={cardStyles.priceRow}>
          <div style={cardStyles.priceGroup}>
            {/* Featured deal'den gelen orijinal fiyat (üstü çizili) */}
            {product.has_deal && product.original_price && (
              <span style={cardStyles.oldPrice}>{product.original_price.toLocaleString('tr-TR')} TL</span>
            )}
            {/* Eski discount alanı için geriye dönük destek */}
            {!product.has_deal && product.discount_percent > 0 && product.original_price && (
              <span style={cardStyles.oldPrice}>{product.original_price.toLocaleString('tr-TR')} TL</span>
            )}
            <div style={{
              ...cardStyles.price,
              color: product.has_deal ? '#ef4444' : '#1e293b'
            }}>
              {product.price?.toLocaleString('tr-TR')} TL
            </div>
          </div>
          
          <div style={cardStyles.actions}>
            <button style={cardStyles.buyNowBtn} onClick={handleBuyNow} title="Hemen Satın Al">
              <FaBolt size={12} />
              <span style={{display: isMobile ? 'none' : 'inline'}}>Hemen Al</span>
            </button>
            <button style={cardStyles.addToCartBtn} onClick={handleAddToCart} title="Sepete Ekle">
              <FaShoppingCart size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};