// src/pages/public/CategoryProducts/components/ProductCard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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

/**
 * Product card component - modern design matching Home page
 */
export const ProductCard = ({
  product,
  viewMode,
  isInCompareList,
  onToggleCompare,
  onAddToCart,
  onQuickView,
  styles
}) => {
  const { isFavorite, addToFavorites, removeFromFavorites } = useFavorites();
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const isFav = isFavorite(product.id);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleToggleFavorite = (e) => {
    e.stopPropagation();
    if (isFav) {
      removeFromFavorites(product.id);
    } else {
      addToFavorites(product);
    }
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (!user) {
      showToast('Sepete ürün eklemek için lütfen giriş yapın.', 'warning');
      navigate('/register');
      return;
    }
    onAddToCart(product);
  };

  const handleBuyNow = (e) => {
    e.stopPropagation();
    if (!user) {
      showToast('Satın alma işlemi için lütfen giriş yapın.', 'warning');
      navigate('/register');
      return;
    }
    onAddToCart(product);
    navigate('/cart');
  };

  const handleCardClick = () => {
    navigate(`/product/${product.slug}`);
  };

  const cardStyles = {
    card: {
      backgroundColor: 'white',
      borderRadius: isMobile ? '16px' : '32px',
      overflow: 'hidden',
      border: 'none',
      boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.07)',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      position: 'relative',
      cursor: 'pointer',
    },
    cardImage: {
      width: isMobile ? 'calc(100% - 16px)' : 'calc(100% - 24px)',
      aspectRatio: '1/1',
      objectFit: 'cover',
      backgroundColor: '#f8fafc',
      margin: isMobile ? '8px' : '12px',
      borderRadius: isMobile ? '12px' : '24px',
    },
    cardBody: {
      padding: isMobile ? '0 12px 12px 12px' : '0 24px 24px 24px',
    },
    cardCategory: {
      fontSize: isMobile ? '10px' : '12px',
      color: '#64748b',
      textTransform: 'uppercase',
      fontWeight: '600',
      marginBottom: '4px',
    },
    cardTitle: {
      fontSize: isMobile ? '13px' : '15px',
      fontWeight: '600',
      color: '#1e293b',
      marginBottom: '8px',
      lineHeight: '1.4',
      height: isMobile ? '36px' : '42px',
      overflow: 'hidden',
    },
    rating: {
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      fontSize: isMobile ? '10px' : '12px',
      color: '#f59e0b',
      marginBottom: isMobile ? '8px' : '12px',
    },
    priceRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: isMobile ? 'wrap' : 'nowrap',
      gap: isMobile ? '8px' : '0',
    },
    price: {
      fontSize: isMobile ? '14px' : '18px',
      fontWeight: '700',
      color: '#059669',
    },
    oldPrice: {
      fontSize: isMobile ? '11px' : '13px',
      color: '#94a3b8',
      textDecoration: 'line-through',
      display: 'block',
      marginBottom: '2px',
    },
    actions: {
      display: 'flex',
      gap: isMobile ? '4px' : '8px',
    },
    addToCartBtn: {
      width: isMobile ? '30px' : '36px',
      height: isMobile ? '30px' : '36px',
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
    buyNowBtn: {
      height: isMobile ? '30px' : '36px',
      padding: isMobile ? '0 8px' : '0 12px',
      borderRadius: isMobile ? '15px' : '18px',
      backgroundColor: '#059669',
      color: 'white',
      border: 'none',
      display: 'flex',
      alignItems: 'center',
      gap: isMobile ? '4px' : '6px',
      fontSize: isMobile ? '10px' : '12px',
      fontWeight: '700',
      cursor: 'pointer',
      transition: 'background-color 0.2s',
    },
    discountBadge: {
      position: 'absolute',
      top: isMobile ? '8px' : '12px',
      left: isMobile ? '8px' : '12px',
      backgroundColor: '#ef4444',
      color: 'white',
      fontSize: isMobile ? '10px' : '12px',
      fontWeight: '700',
      padding: isMobile ? '2px 6px' : '4px 8px',
      borderRadius: '6px',
      zIndex: 3,
    },
    cardActionBtn: {
      width: isMobile ? '28px' : '32px',
      height: isMobile ? '28px' : '32px',
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
      right: isMobile ? '8px' : '12px',
      zIndex: 2,
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    },
  };

  return (
    <div 
      style={cardStyles.card} 
      onClick={handleCardClick}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-8px)';
        e.currentTarget.style.boxShadow = '0 25px 50px -10px rgba(0, 0, 0, 0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 20px 40px -10px rgba(0, 0, 0, 0.07)';
      }}
    >
      {/* Discount Badge */}
      {product.discount_percent > 0 && (
        <div style={cardStyles.discountBadge}>
          -{product.discount_percent}%
        </div>
      )}
      
      {/* Action Buttons - Right Side */}
      <button 
        style={{ ...cardStyles.cardActionBtn, top: isMobile ? '8px' : '12px' }} 
        onClick={handleToggleFavorite}
        title={isFav ? "Favorilerden Çıkar" : "Favorilere Ekle"}
      >
        {isFav ? <FaHeart color="#ef4444" size={isMobile ? 12 : 14} /> : <FaRegHeart size={isMobile ? 12 : 14} />}
      </button>
      
      <button 
        style={{ ...cardStyles.cardActionBtn, top: isMobile ? '40px' : '52px' }} 
        onClick={(e) => {
          e.stopPropagation();
          onQuickView(product);
        }}
        title="Hızlı Bakış"
      >
        <FaEye size={isMobile ? 12 : 14} />
      </button>

      {onToggleCompare && (
        <button 
          style={{ 
            ...cardStyles.cardActionBtn, 
            top: isMobile ? '72px' : '92px',
            backgroundColor: isInCompareList ? '#059669' : 'white',
            color: isInCompareList ? 'white' : '#64748b',
          }} 
          onClick={(e) => {
            e.stopPropagation();
            onToggleCompare(product);
          }}
          title="Karşılaştır"
        >
          <FaExchangeAlt size={isMobile ? 12 : 14} />
        </button>
      )}

      {/* Product Image */}
      <img
        src={product.image || '/placeholder.jpg'}
        alt={product.name}
        style={cardStyles.cardImage}
      />

      {/* Product Info */}
      <div style={cardStyles.cardBody}>
        <div style={cardStyles.cardCategory}>
          {product.vendor_name || 'MARKA'}
        </div>
        
        <h3 style={cardStyles.cardTitle}>
          {product.name}
        </h3>

        {/* Rating */}
        <div style={cardStyles.rating}>
          {[...Array(5)].map((_, i) => (
            <FaStar
              key={i}
              color={i < (product.rating || 4) ? '#f59e0b' : '#e0e0e0'}
              size={isMobile ? 10 : 12}
            />
          ))}
          <span style={{ color: '#64748b', marginLeft: '4px' }}>
            ({product.review_count || 0})
          </span>
        </div>

        {/* Price & Actions */}
        <div style={cardStyles.priceRow}>
          <div>
            {product.discount_percent > 0 && product.original_price && (
              <span style={cardStyles.oldPrice}>
                {product.original_price?.toLocaleString('tr-TR')} TL
              </span>
            )}
            <div style={cardStyles.price}>
              {product.price?.toLocaleString('tr-TR')} TL
            </div>
          </div>
          
          <div style={cardStyles.actions}>
            <button
              style={cardStyles.addToCartBtn}
              onClick={handleAddToCart}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#d1fae5';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#ecfdf5';
              }}
              title="Sepete Ekle"
            >
              <FaShoppingCart size={isMobile ? 12 : 14} />
            </button>
            
            <button
              style={cardStyles.buyNowBtn}
              onClick={handleBuyNow}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#047857';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#059669';
              }}
            >
              <FaBolt size={isMobile ? 10 : 12} />
              Hemen Al
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
