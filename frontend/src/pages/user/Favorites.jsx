import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaTrash, FaShoppingCart, FaHeartBroken, FaArrowLeft, 
  FaSortAmountDown, FaCheck, FaTimes, FaSpinner 
} from 'react-icons/fa';
import { useFavorites } from '../../context/FavoritesContext';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/Toast';

const Favorites = () => {
  const { favorites, removeFromFavorites, clearFavorites, loading, count, fetchFavorites } = useFavorites();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const toast = useToast();
  const [sortBy, setSortBy] = useState('date'); // date, price-asc, price-desc
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Sayfa açıldığında favorileri yenile
  useEffect(() => {
    fetchFavorites(true);
  }, []);

  // Helper: API formatı veya localStorage formatı
  const getProduct = (item) => {
    // API formatı: { id, product: {...} }
    // localStorage formatı: { id, title, price, image, ... }
    if (item.product) {
      return {
        id: item.product.id,
        title: item.product.name,
        slug: item.product.slug,
        image: item.product.image,
        price: item.product.price,
        oldPrice: item.product.compare_price,
        inStock: item.product.in_stock,
        stock: item.product.stock,
        vendor: item.product.vendor,
        dateAdded: item.added_at,
      };
    }
    // localStorage formatı
    return {
      id: item.id,
      title: item.title || item.name,
      slug: item.slug,
      image: item.image,
      price: item.price,
      oldPrice: item.oldPrice || item.compare_price,
      inStock: item.inStock !== undefined ? item.inStock : true,
      stock: item.stock,
      dateAdded: item.dateAdded,
    };
  };

  // Sort logic
  const sortedFavorites = [...favorites].sort((a, b) => {
    const productA = getProduct(a);
    const productB = getProduct(b);
    
    if (sortBy === 'price-asc') return (productA.price || 0) - (productB.price || 0);
    if (sortBy === 'price-desc') return (productB.price || 0) - (productA.price || 0);
    // Default: date added
    return new Date(productB.dateAdded || 0) - new Date(productA.dateAdded || 0);
  });

  const handleAddToCart = (product) => {
    addToCart({ id: product.id, name: product.title });
  };

  const handleMoveAllToCart = () => {
    if (favorites.length === 0) return;
    favorites.forEach(item => {
      const product = getProduct(item);
      if (product.inStock) {
        addToCart({ id: product.id, name: product.title });
      }
    });
    toast.success('Başarılı', 'Stokta olan ürünler sepete eklendi.');
  };

  const handleRemove = async (productId) => {
    await removeFromFavorites(productId);
  };

  const handleClearAll = async () => {
    if (window.confirm('Tüm favorileri silmek istediğinize emin misiniz?')) {
      await clearFavorites();
    }
  };

  const styles = {
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: isMobile ? '20px 12px' : '40px 20px',
      fontFamily: '"Inter", sans-serif',
      minHeight: '60vh',
    },
    header: {
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      justifyContent: 'space-between',
      alignItems: isMobile ? 'flex-start' : 'center',
      marginBottom: isMobile ? '20px' : '32px',
      gap: isMobile ? '16px' : '20px',
    },
    titleGroup: {
      display: 'flex',
      alignItems: 'center',
      gap: isMobile ? '12px' : '16px',
    },
    title: {
      fontSize: isMobile ? '24px' : '32px',
      fontWeight: '800',
      color: '#0f172a',
      letterSpacing: '-1px',
      margin: 0,
    },
    countBadge: {
      backgroundColor: '#f1f5f9',
      color: '#64748b',
      padding: isMobile ? '4px 10px' : '6px 12px',
      borderRadius: '20px',
      fontSize: isMobile ? '12px' : '14px',
      fontWeight: '600',
    },
    actions: {
      display: 'flex',
      gap: isMobile ? '8px' : '12px',
      flexWrap: 'wrap',
      width: isMobile ? '100%' : 'auto',
    },
    actionBtn: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: isMobile ? '8px 12px' : '10px 20px',
      borderRadius: '12px',
      border: '1px solid #e2e8f0',
      backgroundColor: 'white',
      color: '#475569',
      fontSize: isMobile ? '12px' : '14px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s',
      flex: isMobile ? '1' : 'none',
      justifyContent: 'center',
    },
    primaryBtn: {
      backgroundColor: '#059669',
      color: 'white',
      border: 'none',
      boxShadow: '0 4px 12px rgba(5, 150, 105, 0.2)',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(auto-fill, minmax(280px, 1fr))',
      gap: isMobile ? '12px' : '24px',
    },
    card: {
      backgroundColor: 'white',
      borderRadius: isMobile ? '16px' : '20px',
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
      width: '100%',
      height: isMobile ? '180px' : '280px',
      backgroundColor: '#f8fafc',
      overflow: 'hidden',
      display: 'block',
    },
    image: {
      width: '100%',
      height: '100%',
      objectFit: 'contain',
      transition: 'transform 0.5s ease',
      padding: isMobile ? '8px' : '16px',
    },
    discountBadge: {
      position: 'absolute',
      top: isMobile ? '8px' : '16px',
      left: isMobile ? '8px' : '16px',
      backgroundColor: '#ef4444',
      color: 'white',
      fontSize: isMobile ? '10px' : '12px',
      fontWeight: '700',
      padding: isMobile ? '2px 6px' : '4px 8px',
      borderRadius: '6px',
      zIndex: 2,
    },
    removeBtn: {
      position: 'absolute',
      top: isMobile ? '8px' : '16px',
      right: isMobile ? '8px' : '16px',
      width: isMobile ? '30px' : '36px',
      height: isMobile ? '30px' : '36px',
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
      padding: isMobile ? '12px' : '20px',
    },
    vendorName: {
      fontSize: isMobile ? '10px' : '12px',
      color: '#94a3b8',
      fontWeight: '600',
      marginBottom: isMobile ? '4px' : '8px',
    },
    productTitle: {
      fontSize: isMobile ? '13px' : '16px',
      fontWeight: '700',
      color: '#1e293b',
      marginBottom: isMobile ? '8px' : '12px',
      lineHeight: '1.4',
      display: '-webkit-box',
      WebkitLineClamp: 2,
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden',
      height: isMobile ? '36px' : '44px',
      textDecoration: 'none',
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
    loadingContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '300px',
    },
    spinner: {
      animation: 'spin 1s linear infinite',
      fontSize: '32px',
      color: '#059669',
    },
    loginPrompt: {
      textAlign: 'center',
      padding: '60px 20px',
      backgroundColor: '#fef3c7',
      borderRadius: '16px',
      marginBottom: '24px',
    },
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingContainer}>
          <FaSpinner style={styles.spinner} className="animate-spin" />
        </div>
      </div>
    );
  }

  const itemCount = count || favorites.length;

  if (itemCount === 0) {
    return (
      <div style={styles.container}>
        {!user && (
          <div style={styles.loginPrompt}>
            <p style={{ margin: 0, color: '#92400e', fontWeight: '600' }}>
              Favorilerinizi tüm cihazlarınızda senkronize etmek için{' '}
              <Link to="/login" style={{ color: '#d97706', textDecoration: 'underline' }}>giriş yapın</Link>.
            </p>
          </div>
        )}
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
      {/* Login Prompt */}
      {!user && (
        <div style={styles.loginPrompt}>
          <p style={{ margin: 0, color: '#92400e', fontWeight: '600' }}>
            Favorilerinizi tüm cihazlarınızda senkronize etmek için{' '}
            <Link to="/login" style={{ color: '#d97706', textDecoration: 'underline' }}>giriş yapın</Link>.
          </p>
        </div>
      )}

      {/* Header */}
      <div style={styles.header}>
        <div style={styles.titleGroup}>
          <h1 style={styles.title}>Favorilerim</h1>
          <span style={styles.countBadge}>{itemCount} Ürün</span>
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
          
          <button style={styles.actionBtn} onClick={handleClearAll}>
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
        {sortedFavorites.map((item) => {
          const product = getProduct(item);
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
              <Link to={`/product/${product.slug || product.id}`} style={styles.imageContainer}>
                {discount > 0 && (
                  <span style={styles.discountBadge}>%{discount} İndirim</span>
                )}
                <img 
                  src={product.image || '/placeholder-product.jpg'} 
                  alt={product.title} 
                  style={styles.image} 
                  onError={(e) => { e.target.src = '/placeholder-product.jpg'; }}
                />
              </Link>
              
              <button 
                style={styles.removeBtn}
                onClick={() => handleRemove(product.id)}
                title="Favorilerden Kaldır"
              >
                <FaTimes />
              </button>

              <div style={styles.content}>
                {product.vendor && (
                  <div style={styles.vendorName}>{product.vendor.name}</div>
                )}
                <Link to={`/product/${product.slug || product.id}`} style={styles.productTitle}>
                  {product.title}
                </Link>
                
                <div style={styles.priceRow}>
                  <span style={styles.price}>{(product.price || 0).toLocaleString('tr-TR')} TL</span>
                  {product.oldPrice && product.oldPrice > product.price && (
                    <span style={styles.oldPrice}>{product.oldPrice.toLocaleString('tr-TR')} TL</span>
                  )}
                </div>

                <div style={{ 
                  ...styles.stockStatus, 
                  color: product.inStock ? '#059669' : '#ef4444' 
                }}>
                  {product.inStock ? <FaCheck size={12} /> : <FaTimes size={12} />}
                  {product.inStock ? 'Stokta Var' : 'Tükendi'}
                </div>

                <button 
                  style={{ 
                    ...styles.addToCartBtn,
                    opacity: product.inStock ? 1 : 0.5,
                    cursor: product.inStock ? 'pointer' : 'not-allowed'
                  }}
                  onClick={() => product.inStock && handleAddToCart(product)}
                  disabled={!product.inStock}
                >
                  <FaShoppingCart /> {product.inStock ? 'Sepete Ekle' : 'Stokta Yok'}
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
