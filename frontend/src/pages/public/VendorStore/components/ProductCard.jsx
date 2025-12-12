// src/pages/public/VendorStore/components/ProductCard.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaHeart, 
  FaRegHeart, 
  FaShoppingCart, 
  FaStar, 
  FaEye,
  FaBolt,
  FaExchangeAlt
} from 'react-icons/fa';
import { useFavorites } from '../../../../context/FavoritesContext';
import { useAuth } from '../../../../context/AuthContext';
import { useToast } from '../../../../components/common/Toast';

const ProductCard = ({ product, onAddToCart }) => {
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

  const getImageUrl = () => {
    // Backend returns full URL with /storage/ path
    if (product.image) {
      return product.image;
    }
    
    // Fallback to placeholder
    return 'https://via.placeholder.com/300x300?text=Ürün';
  };

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
    navigate(productUrl);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('tr-TR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price || 0);
  };

  // Use backend-provided discount info
  const hasDiscount = product.has_deal && product.original_price;
  const discountPercentage = product.discount_percentage || 0;

  // Kategori ismini güvenli alma
  const getCategoryName = () => {
    if (product.vendor_name) return product.vendor_name;
    if (product.category && typeof product.category === 'object') {
      return product.category.name || 'GENEL';
    }
    return product.category || 'GENEL';
  };

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
    },
    cardImage: {
      width: '100%',
      aspectRatio: '1/1',
      objectFit: 'contain',
      backgroundColor: 'white',
      padding: '16px',
    },
    cardBody: {
      padding: '16px',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
    },
    cardCategory: {
      fontSize: '11px',
      color: '#059669',
      textTransform: 'uppercase',
      fontWeight: '700',
      marginBottom: '4px',
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
      margin: 0,
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
      marginTop: 'auto',
      gap: '8px',
      paddingTop: '8px',
    },
    priceGroup: { 
      display: 'flex', 
      flexDirection: 'column', 
      flex: 1, 
      minWidth: 0,
    },
    price: { 
      fontSize: isMobile ? '14px' : '16px', 
      fontWeight: '700', 
      color: '#1e293b' 
    },
    oldPrice: { 
      fontSize: '11px', 
      color: '#94a3b8', 
      textDecoration: 'line-through', 
      marginBottom: '2px' 
    },
    actions: { 
      display: 'flex', 
      gap: '6px', 
      alignItems: 'center', 
      flexShrink: 0,
    },
    addToCartBtn: {
      width: isMobile ? '28px' : '32px', 
      height: isMobile ? '28px' : '32px', 
      borderRadius: '8px', 
      backgroundColor: '#059669', 
      color: 'white',
      border: 'none', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      cursor: 'pointer',
      transition: 'all 0.2s', 
      flexShrink: 0,
    },
    buyNowBtn: {
      height: isMobile ? '28px' : '32px', 
      padding: isMobile ? '0 8px' : '0 10px', 
      borderRadius: '8px', 
      backgroundColor: '#f0fdf4',
      color: '#059669', 
      border: '1px solid #d1fae5', 
      display: 'flex', 
      alignItems: 'center', 
      gap: '4px',
      fontSize: isMobile ? '10px' : '11px', 
      fontWeight: '700', 
      cursor: 'pointer', 
      transition: 'all 0.2s',
      whiteSpace: 'nowrap',
    },
    discountBadge: {
      position: 'absolute', 
      top: '12px', 
      left: '12px', 
      backgroundColor: '#dc2626', 
      color: 'white',
      fontSize: '11px', 
      fontWeight: '700', 
      padding: '4px 8px', 
      borderRadius: '6px', 
      zIndex: 3,
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
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
      width: '32px', 
      height: '32px', 
      borderRadius: '50%', 
      backgroundColor: 'white', 
      border: '1px solid #e2e8f0',
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      cursor: 'pointer', 
      color: '#64748b',
      transition: 'all 0.2s', 
      boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
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
      {/* Discount Badge */}
      {hasDiscount && product.deal_badge && (
        <div style={{
          ...cardStyles.discountBadge,
          backgroundColor: product.deal_badge.color || '#dc2626'
        }}>
          {product.deal_badge.text || `%${discountPercentage} İndirim`}
        </div>
      )}
      
      {/* Action Overlay */}
      <div style={cardStyles.actionOverlay}>
        <button style={cardStyles.cardActionBtn} onClick={handleToggleFavorite} title="Favori">
          {isFav ? <FaHeart color="#ef4444" size={14} /> : <FaRegHeart size={14} />}
        </button>
        <button style={cardStyles.cardActionBtn} onClick={handleQuickView} title="Hızlı Bakış">
          <FaEye size={14} />
        </button>
      </div>

      <Link to={productUrl} style={{ textDecoration: 'none', color: 'inherit' }}>
        <img
          src={getImageUrl()}
          alt={product.name}
          style={cardStyles.cardImage}
        />
      </Link>

      <div style={cardStyles.cardBody}>
        <div>
          <div style={cardStyles.cardCategory}>{getCategoryName()}</div>
          
          <Link to={productUrl} style={{ textDecoration: 'none', color: 'inherit' }}>
            <h3 style={cardStyles.cardTitle}>{product.name}</h3>
          </Link>

          <div style={cardStyles.rating}>
            {[...Array(5)].map((_, i) => (
              <FaStar key={i} color={i < (product.rating_avg || product.rating || 4) ? '#f59e0b' : '#e2e8f0'} size={12} />
            ))}
            <span style={{ color: '#94a3b8', marginLeft: '4px' }}>({product.rating_count || 0})</span>
          </div>
        </div>

        <div style={cardStyles.priceRow}>
          <div style={cardStyles.priceGroup}>
            {hasDiscount && product.original_price && (
              <span style={cardStyles.oldPrice}>{formatPrice(product.original_price)} TL</span>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <div style={{
                ...cardStyles.price,
                color: hasDiscount ? '#ef4444' : '#1e293b',
                lineHeight: '1'
              }}>
                {formatPrice(product.price)}
              </div>
              <div style={{ fontSize: isMobile ? '9px' : '10px', fontWeight: '600', color: '#94a3b8' }}>TL</div>
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

export default ProductCard;
