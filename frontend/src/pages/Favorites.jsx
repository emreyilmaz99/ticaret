import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaTrash, FaShoppingCart, FaHeartBroken, FaArrowLeft, 
  FaSortAmountDown, FaFilter, FaCheck, FaTimes 
} from 'react-icons/fa';
import { useFavorites } from '../context/FavoritesContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../components/Toast';

const Favorites = () => {
  const { favorites, removeFromFavorites, clearFavorites } = useFavorites();
  const { addToCart } = useCart();
  const toast = useToast();
  const [sortBy, setSortBy] = useState('date'); // date, price-asc, price-desc

  // Sort logic
  const sortedFavorites = [...favorites].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    // Default: date added (assuming new items are added to the end, so reverse for newest first)
    return new Date(b.dateAdded) - new Date(a.dateAdded);
  });

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  const handleMoveAllToCart = () => {
    if (favorites.length === 0) return;
    favorites.forEach(product => addToCart(product));
    toast.success('Başarılı', 'Tüm favori ürünleriniz sepete eklendi.');
  };

  const styles = {
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '40px 20px',
      fontFamily: '"Inter", sans-serif',
      minHeight: '60vh',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '32px',
      flexWrap: 'wrap',
      gap: '20px',
    },
    titleGroup: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
    },
    title: {
      fontSize: '32px',
      fontWeight: '800',
      color: '#0f172a',
      letterSpacing: '-1px',
      margin: 0,
    },
    countBadge: {
      backgroundColor: '#f1f5f9',
      color: '#64748b',
      padding: '6px 12px',
      borderRadius: '20px',
      fontSize: '14px',
      fontWeight: '600',
    },
    actions: {
      display: 'flex',
      gap: '12px',
    },
    actionBtn: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '10px 20px',
      borderRadius: '12px',
      border: '1px solid #e2e8f0',
      backgroundColor: 'white',
      color: '#475569',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s',
    },
    primaryBtn: {
      backgroundColor: '#059669',
      color: 'white',
      border: 'none',
      boxShadow: '0 4px 12px rgba(5, 150, 105, 0.2)',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
      gap: '24px',
    },
    card: {
      backgroundColor: 'white',
      borderRadius: '20px',
      border: '1px solid #f1f5f9',
      overflow: 'hidden',
      position: 'relative',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
    },
    cardHover: {
      transform: 'translateY(-5px)',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
    },
    imageContainer: {
      position: 'relative',
      paddingTop: '100%', // 1:1 Aspect Ratio
      backgroundColor: '#f8fafc',
      overflow: 'hidden',
    },
    image: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      transition: 'transform 0.5s ease',
    },
    discountBadge: {
      position: 'absolute',
      top: '16px',
      left: '16px',
      backgroundColor: '#ef4444',
      color: 'white',
      fontSize: '12px',
      fontWeight: '700',
      padding: '4px 8px',
      borderRadius: '6px',
      zIndex: 2,
    },
    removeBtn: {
      position: 'absolute',
      top: '16px',
      right: '16px',
      width: '36px',
      height: '36px',
      borderRadius: '50%',
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      backdropFilter: 'blur(4px)',
      border: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#ef4444',
      cursor: 'pointer',
      zIndex: 2,
      transition: 'all 0.2s',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
    content: {
      padding: '20px',
    },
    category: {
      fontSize: '12px',
      color: '#94a3b8',
      fontWeight: '600',
      textTransform: 'uppercase',
      marginBottom: '8px',
    },
    productTitle: {
      fontSize: '16px',
      fontWeight: '700',
      color: '#1e293b',
      marginBottom: '12px',
      lineHeight: '1.4',
      display: '-webkit-box',
      WebkitLineClamp: 2,
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden',
      height: '44px',
    },
    priceRow: {
      display: 'flex',
      alignItems: 'baseline',
      gap: '8px',
      marginBottom: '16px',
    },
    price: {
      fontSize: '20px',
      fontWeight: '800',
      color: '#059669',
    },
    oldPrice: {
      fontSize: '14px',
      color: '#94a3b8',
      textDecoration: 'line-through',
    },
    stockStatus: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      fontSize: '12px',
      fontWeight: '600',
      marginBottom: '20px',
    },
    addToCartBtn: {
      width: '100%',
      padding: '12px',
      backgroundColor: '#0f172a',
      color: 'white',
      border: 'none',
      borderRadius: '12px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      transition: 'all 0.2s',
    },
    emptyState: {
      textAlign: 'center',
      padding: '80px 20px',
      backgroundColor: '#f8fafc',
      borderRadius: '32px',
      border: '2px dashed #e2e8f0',
    },
    emptyIcon: {
      fontSize: '64px',
      color: '#cbd5e1',
      marginBottom: '24px',
    },
    emptyTitle: {
      fontSize: '24px',
      fontWeight: '700',
      color: '#334155',
      marginBottom: '12px',
    },
    emptyText: {
      color: '#64748b',
      marginBottom: '32px',
      maxWidth: '400px',
      margin: '0 auto 32px',
    },
  };

  if (favorites.length === 0) {
    return (
      <div style={styles.container}>
        <div style={styles.emptyState}>
          <FaHeartBroken style={styles.emptyIcon} />
          <h2 style={styles.emptyTitle}>Favori Listeniz Boş</h2>
          <p style={styles.emptyText}>
            Henüz favorilerinize ürün eklemediniz. Beğendiğiniz ürünleri kalp ikonuna tıklayarak buraya ekleyebilirsiniz.
          </p>
          <Link to="/" style={{ ...styles.actionBtn, ...styles.primaryBtn, display: 'inline-flex' }}>
            <FaArrowLeft /> Alışverişe Başla
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.titleGroup}>
          <h1 style={styles.title}>Favorilerim</h1>
          <span style={styles.countBadge}>{favorites.length} Ürün</span>
        </div>

        <div style={styles.actions}>
          <div style={{ position: 'relative' }}>
            <select 
              style={{ ...styles.actionBtn, paddingRight: '32px', appearance: 'none' }}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="date">En Yeniler</option>
              <option value="price-asc">Fiyat (Artan)</option>
              <option value="price-desc">Fiyat (Azalan)</option>
            </select>
            <FaSortAmountDown style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b', pointerEvents: 'none' }} />
          </div>
          
          <button style={styles.actionBtn} onClick={clearFavorites}>
            <FaTrash size={14} /> Temizle
          </button>
          
          <button 
            style={{ ...styles.actionBtn, ...styles.primaryBtn }}
            onClick={handleMoveAllToCart}
          >
            <FaShoppingCart size={14} /> Tümünü Sepete Ekle
          </button>
        </div>
      </div>

      {/* Grid */}
      <div style={styles.grid}>
        {sortedFavorites.map((product) => {
          // Simulate random stock status for demo purposes if not present
          const inStock = product.inStock !== undefined ? product.inStock : Math.random() > 0.2;
          const discount = product.oldPrice ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) : 0;

          return (
            <div 
              key={product.id} 
              style={styles.card}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = styles.cardHover.transform;
                e.currentTarget.style.boxShadow = styles.cardHover.boxShadow;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = styles.card.boxShadow;
              }}
            >
              <div style={styles.imageContainer}>
                {discount > 0 && (
                  <span style={styles.discountBadge}>%{discount} İndirim</span>
                )}
                <button 
                  style={styles.removeBtn}
                  onClick={() => removeFromFavorites(product.id)}
                  title="Favorilerden Kaldır"
                >
                  <FaTimes />
                </button>
                <img src={product.image} alt={product.title} style={styles.image} />
              </div>

              <div style={styles.content}>
                <div style={styles.category}>{product.category || 'Genel'}</div>
                <h3 style={styles.productTitle}>{product.title}</h3>
                
                <div style={styles.priceRow}>
                  <span style={styles.price}>{product.price.toLocaleString('tr-TR')} TL</span>
                  {product.oldPrice && (
                    <span style={styles.oldPrice}>{product.oldPrice.toLocaleString('tr-TR')} TL</span>
                  )}
                </div>

                <div style={{ 
                  ...styles.stockStatus, 
                  color: inStock ? '#059669' : '#ef4444' 
                }}>
                  {inStock ? <FaCheck size={12} /> : <FaTimesCircle size={12} />}
                  {inStock ? 'Stokta Var' : 'Tükendi'}
                </div>

                <button 
                  style={{ 
                    ...styles.addToCartBtn,
                    opacity: inStock ? 1 : 0.5,
                    cursor: inStock ? 'pointer' : 'not-allowed'
                  }}
                  onClick={() => inStock && handleAddToCart(product)}
                  disabled={!inStock}
                >
                  <FaShoppingCart /> {inStock ? 'Sepete Ekle' : 'Stokta Yok'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Favorites;
