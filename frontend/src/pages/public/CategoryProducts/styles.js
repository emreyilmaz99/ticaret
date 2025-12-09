// src/pages/public/CategoryProducts/styles.js

// --- 1. EKSİK OLAN VERİLER (Hata Çözümü İçin Eklendi) ---
// Hook dosyası bunu import ettiği için burada durması şart, ama ekranda kullanmayacağız.
export const CATEGORY_BANNERS = {
  default: {
    image: '',
    title: '',
    description: '',
  },
};

export const MOCK_BRANDS = ['Apple', 'Samsung', 'Lenovo', 'Asus', 'HP', 'Dyson', 'Sony', 'Huawei', 'Xiaomi'];

// --- 2. PREMIUM RENK PALETİ ---
const COLORS = {
  bgBody: '#F3F4F6',       // Cool Gray
  bgSurface: '#FFFFFF',    // Beyaz
  textMain: '#111827',     // Koyu Antrasit
  textMuted: '#6B7280',    // Gri Metin
  border: '#E5E7EB',       // İnce Çizgiler
  primary: '#059669',      // Emerald Green (Ana Renk)
  primaryHover: '#047857', // Koyu Yeşil
  danger: '#DC2626',       // İndirim Kırmızısı
  shadowSubtle: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  shadowCard: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
  shadowHover: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
};

const getStyles = (isMobile = false) => ({
  // --- ANA YAPI ---
  container: {
    backgroundColor: COLORS.bgBody,
    minHeight: '100vh',
    paddingTop: '20px',
    paddingBottom: '80px',
    fontFamily: '"Plus Jakarta Sans", "Inter", sans-serif',
  },
  wrapper: {
    maxWidth: '1360px',
    margin: '0 auto',
    padding: isMobile ? '0 16px' : '0 40px',
  },
  
  breadcrumbArea: {
    marginBottom: '20px',
    color: COLORS.textMuted,
    fontSize: '13px',
  },

  // --- DÜZEN (SIDEBAR + GRID) ---
  mainContent: {
    display: 'flex',
    gap: '32px',
    alignItems: 'flex-start',
  },

  // --- SOL SIDEBAR (FİLTRELER - Çerçeveli) ---
  sidebar: {
    width: '280px',
    flexShrink: 0,
    display: isMobile ? 'none' : 'block',
    backgroundColor: COLORS.bgSurface,
    borderRadius: '16px',
    border: `1px solid ${COLORS.border}`,
    padding: '24px',
    position: 'sticky',
    top: '100px',
    boxShadow: COLORS.shadowCard,
  },
  
  filterTitle: {
    fontSize: '14px',
    fontWeight: '700',
    color: COLORS.textMain,
    marginBottom: '12px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },

  priceFilterGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '24px',
  },
  priceInput: {
    width: '100%',
    padding: '10px',
    borderRadius: '8px',
    border: `1px solid ${COLORS.border}`,
    fontSize: '14px',
    outline: 'none',
    color: COLORS.textMain,
    backgroundColor: '#F9FAFB',
    transition: 'border-color 0.2s',
  },

  // --- SAĞ TARAF ---
  productsSection: {
    flex: 1,
    width: '100%',
  },

  // --- SORT BAR ---
  sortBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    padding: '16px 24px',
    backgroundColor: COLORS.bgSurface,
    borderRadius: '16px',
    border: `1px solid ${COLORS.border}`,
    boxShadow: COLORS.shadowSubtle,
  },

  // --- GRID ---
  grid: {
    display: 'grid',
    gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(auto-fill, minmax(260px, 1fr))',
    gap: isMobile ? '12px' : '24px',
  },

  // --- ÜRÜN KARTI (ELİT GÖRÜNÜM) ---
  card: {
    backgroundColor: COLORS.bgSurface,
    borderRadius: '16px',
    border: `1px solid ${COLORS.border}`,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
  },
  imgWrap: {
    position: 'relative',
    width: '100%',
    paddingTop: '110%',
    backgroundColor: '#fff', 
    borderBottom: `1px solid ${COLORS.bgBody}`,
    overflow: 'hidden',
  },
  img: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '85%', 
    height: '85%',
    objectFit: 'contain',
    transition: 'transform 0.5s ease',
  },

  // İndirim Rozeti
  badge: {
    position: 'absolute',
    top: '12px',
    left: '12px',
    background: COLORS.danger,
    color: 'white',
    padding: '4px 10px',
    borderRadius: '6px',
    fontSize: '11px',
    fontWeight: '700',
    zIndex: 2,
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },

  content: {
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    gap: '8px',
  },
  
  brand: {
    fontSize: '11px',
    fontWeight: '700',
    color: COLORS.primary,
    textTransform: 'uppercase',
    letterSpacing: '1px',
    marginBottom: '4px',
  },
  title: {
    fontSize: isMobile ? '13px' : '15px',
    fontWeight: '600',
    color: COLORS.textMain,
    lineHeight: '1.4',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    height: '42px', 
  },

  priceRow: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '8px',
    marginTop: 'auto',
    marginBottom: '12px',
  },
  price: {
    fontSize: '18px',
    fontWeight: '800',
    color: COLORS.textMain,
  },
  priceOld: {
    fontSize: '13px',
    color: COLORS.textMuted,
    textDecoration: 'line-through',
  },

  // --- BUTON (Klas Yeşil) ---
  addToCartBtn: {
    width: '100%',
    padding: '12px',
    backgroundColor: COLORS.primary,
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontWeight: '600',
    fontSize: '14px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    transition: 'all 0.2s',
    letterSpacing: '0.3px',
    boxShadow: '0 4px 6px rgba(5, 150, 105, 0.2)',
  },
});

// Yardımcılar
export const resolveImage = (product) => {
  if (!product) return 'https://via.placeholder.com/400x400?text=Urun';
  if (typeof product === 'string') return product;
  if (product.image) return product.image;
  if (product.main_photo?.file_path) return product.main_photo.file_path;
  if (product.images && product.images.length) return product.images[0];
  return 'https://via.placeholder.com/400x400?text=Urun';
};

export const formatPrice = (price) => {
  if (price === null || price === undefined) return '-';
  return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(price);
};

export default getStyles;