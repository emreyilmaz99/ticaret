import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaStar, FaShoppingCart, FaHeart, FaRegHeart, FaEye, FaBolt } from 'react-icons/fa';
import { useFavorites } from '../context/FavoritesContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';

const ProductCard = ({ product, setQuickViewProduct }) => {
  const { isFavorite, addToFavorites, removeFromFavorites } = useFavorites();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const isFav = isFavorite(product.id);

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
    actions: {
      display: 'flex',
      gap: '8px',
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
    buyNowBtn: {
      height: '36px',
      padding: '0 12px',
      borderRadius: '18px',
      backgroundColor: '#059669',
      color: 'white',
      border: 'none',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      fontSize: '12px',
      fontWeight: '700',
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
  };

  return (
    <div style={styles.card} onClick={() => setQuickViewProduct(product)}>
      {product.discount && (
        <div style={styles.discountBadge}>%{product.discount} İndirim</div>
      )}
      
      {/* Action Buttons */}
      <button 
        style={{ ...styles.cardActionBtn, top: '12px' }} 
        onClick={handleToggleFavorite}
        title={isFav ? "Favorilerden Çıkar" : "Favorilere Ekle"}
      >
        {isFav ? <FaHeart color="#ef4444" /> : <FaRegHeart />}
      </button>
      <button 
        style={{ ...styles.cardActionBtn, top: '52px' }} 
        onClick={(e) => { e.stopPropagation(); setQuickViewProduct(product); }}
        title="Hızlı Bakış"
      >
        <FaEye />
      </button>

      <img src={product.image} alt={product.name} style={styles.cardImage} />
      <div style={styles.cardBody}>
        <div style={styles.cardCategory}>
          {typeof product.category === 'object' ? product.category?.name : product.category}
        </div>
        <h3 style={styles.cardTitle}>{product.name}</h3>
        <div style={styles.rating}>
          <FaStar />
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
              <FaShoppingCart size={14} />
            </button>
            <button 
              style={styles.buyNowBtn} 
              title="Hemen Al"
              onClick={handleBuyNow}
            >
              <FaBolt size={12} />
              <span>AL</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
