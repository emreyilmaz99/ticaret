// src/pages/public/VendorStore/components/VendorHomePage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaStar, 
  FaBox, 
  FaShoppingCart, 
  FaTruck, 
  FaShieldAlt, 
  FaHeadset,
  FaFireAlt,
  FaArrowRight,
  FaCheckCircle,
  FaUsers,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaPercent,
  FaHeart,
  FaEye,
  FaBolt
} from 'react-icons/fa';

const VendorHomePage = ({ vendor, stats, products, onAddToCart, isMobile, setActiveTab }) => {
  // En çok satan ürünler (ilk 4)
  const featuredProducts = products?.slice(0, 4) || [];
  // İndirimli ürünler - backend'den gelen has_deal ve original_price kontrolü
  const discountedProducts = products?.filter(p => p.has_deal && p.original_price)?.slice(0, 4) || [];

  return (
    <div style={styles.container}>
      {/* Hoş Geldiniz Bölümü */}
      <section style={styles.welcomeSection}>
        <div style={styles.welcomeContent}>
          <h1 style={styles.welcomeTitle}>
            <span style={styles.welcomeHighlight}>{vendor?.name || 'Mağaza'}</span> Mağazasına Hoş Geldiniz!
          </h1>
          <p style={styles.welcomeText}>
            {vendor?.description || 'En kaliteli ürünleri uygun fiyatlarla sunuyoruz. Hemen alışverişe başlayın!'}
          </p>
          <div style={styles.welcomeStats}>
            <div style={styles.welcomeStatItem}>
              <FaBox style={styles.welcomeStatIcon} />
              <span style={styles.welcomeStatNumber}>{stats?.product_count || 0}</span>
              <span style={styles.welcomeStatLabel}>Ürün</span>
            </div>
            <div style={styles.welcomeStatItem}>
              <FaStar style={{ ...styles.welcomeStatIcon, color: '#f59e0b' }} />
              <span style={styles.welcomeStatNumber}>{vendor?.rating_avg?.toFixed(1) || '5.0'}</span>
              <span style={styles.welcomeStatLabel}>Puan</span>
            </div>
            <div style={styles.welcomeStatItem}>
              <FaUsers style={styles.welcomeStatIcon} />
              <span style={styles.welcomeStatNumber}>{stats?.follower_count || 0}</span>
              <span style={styles.welcomeStatLabel}>Takipçi</span>
            </div>
            <div style={styles.welcomeStatItem}>
              <FaCalendarAlt style={styles.welcomeStatIcon} />
              <span style={styles.welcomeStatNumber}>{stats?.member_since || new Date().getFullYear()}</span>
              <span style={styles.welcomeStatLabel}>yılından beri</span>
            </div>
          </div>
        </div>
      </section>

      {/* Öne Çıkan Özellikler */}
      <section style={styles.featuresSection}>
        <div style={styles.featureItem}>
          <div style={styles.featureIcon}>
            <FaTruck />
          </div>
          <div style={styles.featureText}>
            <h4 style={styles.featureTitle}>Hızlı Kargo</h4>
            <p style={styles.featureDesc}>Aynı gün kargo</p>
          </div>
        </div>
        <div style={styles.featureItem}>
          <div style={{ ...styles.featureIcon, backgroundColor: '#ecfdf5' }}>
            <FaShieldAlt style={{ color: '#059669' }} />
          </div>
          <div style={styles.featureText}>
            <h4 style={styles.featureTitle}>Güvenli Alışveriş</h4>
            <p style={styles.featureDesc}>256-bit SSL koruması</p>
          </div>
        </div>
        <div style={styles.featureItem}>
          <div style={{ ...styles.featureIcon, backgroundColor: '#fef3c7' }}>
            <FaHeadset style={{ color: '#d97706' }} />
          </div>
          <div style={styles.featureText}>
            <h4 style={styles.featureTitle}>7/24 Destek</h4>
            <p style={styles.featureDesc}>Her zaman yanınızdayız</p>
          </div>
        </div>
        <div style={styles.featureItem}>
          <div style={{ ...styles.featureIcon, backgroundColor: '#fce7f3' }}>
            <FaPercent style={{ color: '#db2777' }} />
          </div>
          <div style={styles.featureText}>
            <h4 style={styles.featureTitle}>Özel Fırsatlar</h4>
            <p style={styles.featureDesc}>Sürekli indirimler</p>
          </div>
        </div>
      </section>

      {/* Öne Çıkan Ürünler */}
      {featuredProducts.length > 0 && (
        <section style={styles.productsSection}>
          <div style={styles.sectionHeader}>
            <div style={styles.sectionTitleWrapper}>
              <FaFireAlt style={styles.sectionIcon} />
              <h2 style={styles.sectionTitle}>Öne Çıkan Ürünler</h2>
            </div>
            <button 
              style={styles.viewAllLink} 
              onClick={() => setActiveTab('products')}
            >
              Tümünü Gör <FaArrowRight />
            </button>
          </div>
          <div style={styles.productsGrid}>
            {featuredProducts.map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onAddToCart={onAddToCart}
              />
            ))}
          </div>
        </section>
      )}

      {/* İndirimli Ürünler */}
      {discountedProducts.length > 0 && (
        <section style={styles.productsSection}>
          <div style={styles.sectionHeader}>
            <div style={styles.sectionTitleWrapper}>
              <FaPercent style={{ ...styles.sectionIcon, color: '#db2777' }} />
              <h2 style={styles.sectionTitle}>Fırsat Ürünleri</h2>
            </div>
            <button 
              style={styles.viewAllLink} 
              onClick={() => setActiveTab('deals')}
            >
              Tümünü Gör <FaArrowRight />
            </button>
          </div>
          <div style={styles.productsGrid}>
            {discountedProducts.map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onAddToCart={onAddToCart}
                showDiscount
              />
            ))}
          </div>
        </section>
      )}

      {/* Satıcı Hakkında */}
      <section style={styles.aboutSection}>
        <h2 style={styles.aboutTitle}>
          <FaCheckCircle style={{ color: '#059669', marginRight: '12px' }} />
          {vendor?.name || 'Mağaza'} Hakkında
        </h2>
        <div style={styles.aboutContent}>
          <div style={styles.aboutInfo}>
            <p style={styles.aboutText}>
              {vendor?.description || 
                `${vendor?.name || 'Mağazamız'}, müşteri memnuniyetini ön planda tutarak en kaliteli ürünleri en uygun fiyatlarla sunmayı hedeflemektedir. Geniş ürün yelpazemiz ve hızlı teslimat seçeneklerimizle her zaman yanınızdayız.`
              }
            </p>
            <div style={styles.aboutDetails}>
              {vendor?.city && (
                <div style={styles.aboutDetailItem}>
                  <FaMapMarkerAlt style={styles.aboutDetailIcon} />
                  <span>{vendor.city}, Türkiye</span>
                </div>
              )}
              <div style={styles.aboutDetailItem}>
                <FaCalendarAlt style={styles.aboutDetailIcon} />
                <span>{stats?.member_since || new Date().getFullYear()} yılından beri aktif</span>
              </div>
              <div style={styles.aboutDetailItem}>
                <FaStar style={{ ...styles.aboutDetailIcon, color: '#f59e0b' }} />
                <span>{vendor?.rating_avg?.toFixed(1) || '5.0'} ortalama puan ({vendor?.review_count || 0} değerlendirme)</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

// Ürün Kartı - Görsel 2 gibi tasarım
const ProductCard = ({ product, onAddToCart, showDiscount }) => {
  const [isFavorite, setIsFavorite] = React.useState(false);
  const price = parseFloat(product.price || 0);
  // Use backend-provided discount info
  const hasDiscount = product.has_deal && product.original_price;
  const discount = product.discount_percentage || 0;

  // Backend returns full URL in 'image' field
  const mainImage = product.image || '/placeholder-product.png';
  const categoryName = product.category?.name || '';

  // 5 yıldız gösterimi - sayısal değer ile
  const renderStars = (rating) => {
    const stars = [];
    const ratingValue = parseFloat(rating || 0);
    
    for (let i = 0; i < 5; i++) {
      const isFilled = i < Math.floor(ratingValue);
      
      stars.push(
        <FaStar 
          key={i} 
          style={{ 
            color: isFilled ? '#f59e0b' : '#e2e8f0',
            fontSize: '12px'
          }} 
        />
      );
    }
    
    // Yıldızların yanına sayısal değeri ekle
    stars.push(
      <span key="rating-value" style={{ 
        color: '#1e293b', 
        marginLeft: '4px', 
        fontSize: '13px',
        fontWeight: '600'
      }}>
        {parseFloat(ratingValue || 0).toFixed(1)}
      </span>
    );
    
    return stars;
  };

  return (
    <div style={styles.productCard}>
      {/* Favori & Göz Butonları */}
      <div style={styles.cardActions}>
        <button 
          style={styles.cardActionBtn}
          onClick={() => setIsFavorite(!isFavorite)}
        >
          <FaHeart style={{ color: isFavorite ? '#ef4444' : '#94a3b8' }} />
        </button>
        <Link to={`/product/${product.slug}`} style={styles.cardActionBtn}>
          <FaEye style={{ color: '#94a3b8' }} />
        </Link>
      </div>

      {/* İndirim Rozeti */}
      {showDiscount && hasDiscount && discount > 0 && (
        <div style={styles.discountBadge}>%{discount}</div>
      )}

      {/* Ürün Görseli */}
      <Link to={`/product/${product.slug}`} style={styles.productImageWrapper}>
        <img 
          src={mainImage} 
          alt={product.name}
          style={styles.productImage}
          onError={(e) => { e.target.src = '/placeholder-product.png'; }}
        />
      </Link>

      {/* Ürün Bilgileri */}
      <div style={styles.productInfo}>
        {/* Kategori */}
        {categoryName && (
          <span style={styles.productCategory}>{categoryName.toUpperCase()}</span>
        )}
        
        {/* Ürün Adı */}
        <Link to={`/product/${product.slug}`} style={styles.productName}>
          {product.name}
        </Link>

        {/* Yıldızlar */}
        <div style={styles.productRating}>
          <div style={styles.starsWrapper}>
            {renderStars(product.rating_avg)}
          </div>
          <span style={styles.reviewCount}>({product.review_count || 0})</span>
        </div>

        {/* Fiyat & Butonlar */}
        <div style={styles.productPriceRow}>
          <div style={styles.priceWrapper}>
            {hasDiscount && product.original_price && (
              <span style={styles.oldPrice}>
                {parseFloat(product.original_price).toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL
              </span>
            )}
            <span style={styles.productPrice}>
              {price.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
            </span>
            <span style={styles.priceCurrency}>TL</span>
          </div>
          <div style={styles.actionButtons}>
            <button
              onClick={() => onAddToCart(product)}
              style={styles.buyNowBtn}
            >
              <FaBolt style={{ fontSize: '12px' }} />
              Hemen Al
            </button>
            <button
              onClick={() => onAddToCart(product)}
              style={styles.addToCartBtn}
            >
              <FaShoppingCart />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  // Welcome Section
  welcomeSection: {
    background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
    borderRadius: '20px',
    padding: '40px',
    color: '#fff',
    boxShadow: '0 10px 40px rgba(5, 150, 105, 0.2)',
  },
  welcomeContent: {
    maxWidth: '800px',
  },
  welcomeTitle: {
    fontSize: '32px',
    fontWeight: '800',
    marginBottom: '16px',
    lineHeight: '1.2',
  },
  welcomeHighlight: {
    color: '#d1fae5',
  },
  welcomeText: {
    fontSize: '16px',
    lineHeight: '1.6',
    opacity: 0.9,
    marginBottom: '32px',
  },
  welcomeStats: {
    display: 'flex',
    gap: '32px',
    flexWrap: 'wrap',
  },
  welcomeStatItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
    padding: '16px 24px',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: '12px',
    backdropFilter: 'blur(10px)',
  },
  welcomeStatIcon: {
    fontSize: '24px',
    marginBottom: '4px',
  },
  welcomeStatNumber: {
    fontSize: '24px',
    fontWeight: '700',
  },
  welcomeStatLabel: {
    fontSize: '12px',
    opacity: 0.8,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  // Features Section
  featuresSection: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '16px',
  },
  featureItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '20px',
    backgroundColor: '#fff',
    borderRadius: '16px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
    border: '1px solid #e2e8f0',
  },
  featureIcon: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    backgroundColor: '#eff6ff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    color: '#3b82f6',
    flexShrink: 0,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: '15px',
    fontWeight: '700',
    color: '#1e293b',
    margin: 0,
    marginBottom: '4px',
  },
  featureDesc: {
    fontSize: '13px',
    color: '#64748b',
    margin: 0,
  },
  // Products Section
  productsSection: {
    backgroundColor: '#fff',
    borderRadius: '20px',
    padding: '28px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
    border: '1px solid #e2e8f0',
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '24px',
  },
  sectionTitleWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  sectionIcon: {
    fontSize: '22px',
    color: '#f97316',
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#1e293b',
    margin: 0,
  },
  viewAllLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#059669',
    textDecoration: 'none',
    transition: 'color 0.2s',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    padding: 0,
  },
  productsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
    gap: '20px',
  },
  // Product Card
  productCard: {
    position: 'relative',
    backgroundColor: '#fff',
    borderRadius: '20px',
    overflow: 'hidden',
    border: '1px solid #e2e8f0',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
  },
  cardActions: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    zIndex: 3,
  },
  cardActionBtn: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    backgroundColor: '#fff',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    transition: 'all 0.2s',
    textDecoration: 'none',
  },
  discountBadge: {
    position: 'absolute',
    top: '12px',
    left: '12px',
    backgroundColor: '#ef4444',
    color: '#fff',
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '700',
    zIndex: 2,
  },
  productImageWrapper: {
    display: 'block',
    aspectRatio: '1',
    overflow: 'hidden',
    backgroundColor: '#f8fafc',
    borderRadius: '16px',
    margin: '12px',
  },
  productImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.3s ease',
    borderRadius: '12px',
  },
  productInfo: {
    padding: '12px 14px 14px',
  },
  productCategory: {
    fontSize: '11px',
    fontWeight: '700',
    color: '#059669',
    letterSpacing: '0.5px',
    marginBottom: '6px',
    display: 'block',
  },
  productName: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#1e293b',
    textDecoration: 'none',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    lineHeight: '1.4',
    marginBottom: '8px',
  },
  productRating: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    marginBottom: '8px',
  },
  starsWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '2px',
  },
  reviewCount: {
    fontSize: '12px',
    color: '#94a3b8',
  },
  productPriceRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '8px',
    marginTop: '8px',
  },
  priceWrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    flex: '1',
    minWidth: 0,
  },
  oldPrice: {
    fontSize: '12px',
    fontWeight: '500',
    color: '#94a3b8',
    textDecoration: 'line-through',
  },
  productPrice: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#1e293b',
    lineHeight: '1',
  },
  priceCurrency: {
    fontSize: '10px',
    fontWeight: '600',
    color: '#94a3b8',
  },
  actionButtons: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    flexShrink: 0,
  },
  buyNowBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    padding: '0 10px',
    height: '32px',
    borderRadius: '8px',
    backgroundColor: '#f0fdf4',
    color: '#059669',
    border: '1px solid #d1fae5',
    fontSize: '11px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.2s',
    whiteSpace: 'nowrap',
  },
  addToCartBtn: {
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    backgroundColor: '#059669',
    color: '#fff',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'all 0.2s',
    flexShrink: 0,
  },
  // About Section
  aboutSection: {
    backgroundColor: '#fff',
    borderRadius: '20px',
    padding: '28px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
    border: '1px solid #e2e8f0',
  },
  aboutTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#1e293b',
    margin: 0,
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center',
  },
  aboutContent: {
    display: 'flex',
    gap: '32px',
  },
  aboutInfo: {
    flex: 1,
  },
  aboutText: {
    fontSize: '15px',
    lineHeight: '1.7',
    color: '#475569',
    margin: 0,
    marginBottom: '24px',
  },
  aboutDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  aboutDetailItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontSize: '14px',
    color: '#64748b',
  },
  aboutDetailIcon: {
    fontSize: '16px',
    color: '#059669',
    width: '20px',
  },
};

export default VendorHomePage;
