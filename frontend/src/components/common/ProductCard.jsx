import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaStar, FaShoppingCart, FaHeart, FaRegHeart, FaEye, FaBolt, FaExchangeAlt } from 'react-icons/fa';
import { useFavorites } from '../../context/FavoritesContext';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from './Toast';

const ProductCard = ({ product, setQuickViewProduct, isCompared, onToggleCompare }) => {
  const { isFavorite, addToFavorites, removeFromFavorites } = useFavorites();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const isFav = isFavorite(product.id);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

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
      toast.warning('Giriş Yapmalısınız', 'Sepete ürün eklemek için lütfen giriş yapın veya kayıt olun.');
      navigate('/register');
      return;
    }
    addToCart(product);
  };

  const handleBuyNow = (e) => {
    e.stopPropagation();
    if (!user) {
      toast.warning('Giriş Yapmalısınız', 'Satın alma işlemi için lütfen giriş yapın veya kayıt olun.');
      navigate('/register');
      return;
    }
    addToCart(product);
    navigate('/cart');
  };

  const styles = {
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
      width: '100%',
      aspectRatio: '1/1',
      objectFit: 'cover',
      backgroundColor: '#f8fafc',
      margin: isMobile ? '8px' : '12px',
      width: isMobile ? 'calc(100% - 16px)' : 'calc(100% - 24px)',
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
    <div style={styles.card} onClick={() => navigate(`/product/${product.slug || product.id}`)}>
      {product.discount && (
        <div style={styles.discountBadge}>%{product.discount} İndirim</div>
      )}
      
      {/* Action Buttons */}
      <button 
        style={{ ...styles.cardActionBtn, top: isMobile ? '8px' : '12px' }} 
        onClick={handleToggleFavorite}
        title={isFav ? "Favorilerden Çıkar" : "Favorilere Ekle"}
      >
        {isFav ? <FaHeart color="#ef4444" size={isMobile ? 12 : 14} /> : <FaRegHeart size={isMobile ? 12 : 14} />}
      </button>
      <button 
        style={{ ...styles.cardActionBtn, top: isMobile ? '40px' : '52px' }} 
        onClick={(e) => { e.stopPropagation(); setQuickViewProduct(product); }}
        title="Hızlı Bakış"
      >
        <FaEye size={isMobile ? 12 : 14} />
      </button>

      {onToggleCompare && (
        <button 
          style={{ 
            ...styles.cardActionBtn, 
            top: isMobile ? '72px' : '92px',
            backgroundColor: isCompared ? '#059669' : 'white',
            color: isCompared ? 'white' : '#64748b'
          }} 
          onClick={(e) => { e.stopPropagation(); onToggleCompare(product); }}
          title={isCompared ? "Karşılaştırmadan Çıkar" : "Karşılaştır"}
        >
          <FaExchangeAlt size={isMobile ? 12 : 14} />
        </button>
      )}

      <img src={product.image} alt={product.name} style={styles.cardImage} />
      <div style={styles.cardBody}>
        <div style={styles.cardCategory}>
          {typeof product.category === 'object' ? product.category?.name : product.category}
        </div>
        <h3 style={styles.cardTitle}>{product.name}</h3>
        <div style={styles.rating}>
          <FaStar size={isMobile ? 10 : 12} />
          <span>{product.rating || 0}</span>
          <span style={{ color: '#94a3b8' }}>({product.reviews || product.reviews_count || 0})</span>
        </div>
        <div style={styles.priceRow}>
          <div style={styles.price}>
            {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(product.price)}
          </div>
          <div style={styles.actions}>
            <button 
              style={styles.addToCartBtn} 
              title="Sepete Ekle"
              onClick={handleAddToCart}
            >
              <FaShoppingCart size={isMobile ? 12 : 14} />
            </button>
            <button 
              style={styles.buyNowBtn} 
              title="Hemen Al"
              onClick={handleBuyNow}
            >
              <FaBolt size={isMobile ? 10 : 12} />
              <span>AL</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
