// src/pages/public/CategoryProducts/styles.js

// --- 1. SABİT VERİLER ---
export const CATEGORY_BANNERS = {
  default: { image: '', title: '', description: '' },
};

export const MOCK_BRANDS = ['Apple', 'Samsung', 'Lenovo', 'Asus', 'HP', 'Dyson', 'Sony', 'Huawei', 'Xiaomi'];

// --- 2. RENK PALETİ ---
const COLORS = {
  bgBody: '#F3F4F6', bgSurface: '#FFFFFF', textMain: '#111827', textMuted: '#6B7280',
  border: '#E5E7EB', primary: '#059669', primaryHover: '#047857', danger: '#DC2626',
  shadowSubtle: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  shadowCard: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
  shadowHover: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
};

// --- 3. ANA STİLLER (HATA DÜZELTİLDİ: isMobile kaldırıldı) ---
export const styles = {
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
    padding: '0 40px', // Varsayılan padding (isMobile kontrolü kaldırıldı)
  },
  breadcrumbArea: { marginBottom: '20px', color: COLORS.textMuted, fontSize: '13px' },
  mainContent: { display: 'flex', gap: '32px', alignItems: 'flex-start' },

  // --- SOL SIDEBAR ---
  sidebar: {
    width: '280px',
    flexShrink: 0,
    display: 'block', // Varsayılan görünür
    backgroundColor: COLORS.bgSurface,
    borderRadius: '16px',
    border: `1px solid ${COLORS.border}`,
    padding: '24px',
    position: 'sticky',
    top: '100px',
    maxHeight: 'calc(100vh - 120px)',
    overflowY: 'auto',
    boxShadow: COLORS.shadowCard,
  },
  filterTitle: { fontSize: '14px', fontWeight: '700', color: COLORS.textMain, marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' },
  priceInputs: { display: 'flex', alignItems: 'center', gap: '10px' },
  priceFilterGroup: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' },
  priceInput: { width: '100%', padding: '10px', borderRadius: '8px', border: `1px solid ${COLORS.border}`, fontSize: '14px', outline: 'none', color: COLORS.textMain, backgroundColor: '#F9FAFB' },

  // --- SAĞ TARAF ---
  productsSection: { flex: 1, width: '100%' },

  // --- MODERN TOOLBAR (YEŞİL TASARIM) ---
  toolbar: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: '24px', backgroundColor: COLORS.bgSurface,
    padding: '16px 24px', borderRadius: '16px',
    boxShadow: COLORS.shadowCard, border: 'none',
  },
  resultCount: { fontSize: '15px', fontWeight: '600', color: COLORS.textMuted },
  resultNumber: { color: COLORS.primary, fontWeight: '800', margin: '0 4px' },
  controlsRight: { display: 'flex', alignItems: 'center', gap: '16px' },
  sortWrapper: { position: 'relative', display: 'flex', alignItems: 'center' },
  sortSelect: {
    appearance: 'none', backgroundColor: '#F9FAFB',
    border: `1px solid ${COLORS.border}`, borderRadius: '8px',
    padding: '10px 36px 10px 16px', fontSize: '14px', fontWeight: '600',
    color: COLORS.textMain, cursor: 'pointer', outline: 'none',
  },
  sortIcon: { position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: COLORS.textMuted, pointerEvents: 'none', fontSize: '12px' },
  viewToggle: { display: 'flex', gap: '6px', backgroundColor: '#F9FAFB', padding: '4px', borderRadius: '8px', border: `1px solid ${COLORS.border}` },
  viewBtn: { width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '6px', border: 'none', backgroundColor: 'transparent', color: COLORS.textMuted, cursor: 'pointer', transition: 'all 0.2s' },
  viewBtnActive: { width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '6px', border: 'none', backgroundColor: COLORS.primary, color: 'white', cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(5, 150, 105, 0.3)' },

  // --- GRID ---
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', // Dinamik grid
    gap: '24px',
  },

  // --- KART ---
  card: { backgroundColor: COLORS.bgSurface, borderRadius: '16px', border: `1px solid ${COLORS.border}`, overflow: 'hidden', display: 'flex', flexDirection: 'column', position: 'relative', transition: 'all 0.3s ease', cursor: 'pointer' },
  imgWrap: { position: 'relative', width: '100%', paddingTop: '110%', backgroundColor: '#fff', borderBottom: `1px solid ${COLORS.bgBody}`, overflow: 'hidden' },
  img: { position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '85%', height: '85%', objectFit: 'contain' },
  badge: { position: 'absolute', top: '12px', left: '12px', background: COLORS.danger, color: 'white', padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: '700', zIndex: 2 },
  content: { padding: '16px', display: 'flex', flexDirection: 'column', flex: 1, gap: '8px' },
  brand: { fontSize: '11px', fontWeight: '700', color: COLORS.primary, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' },
  title: { fontSize: '15px', fontWeight: '600', color: COLORS.textMain, lineHeight: '1.4', height: '42px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' },
  priceRow: { display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: 'auto', marginBottom: '12px' },
  price: { fontSize: '18px', fontWeight: '800', color: COLORS.textMain },
  priceOld: { fontSize: '13px', color: COLORS.textMuted, textDecoration: 'line-through' },
  addToCartBtn: { width: '100%', padding: '12px', backgroundColor: COLORS.primary, color: 'white', border: 'none', borderRadius: '10px', fontWeight: '600', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 4px 6px rgba(5, 150, 105, 0.2)' },

  // --- DİĞER BİLEŞENLER ---
  breadcrumbContainer: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: COLORS.textMuted },
  breadcrumbLink: { color: COLORS.textMuted, textDecoration: 'none', transition: 'color 0.2s' },
  filterSection: { marginBottom: '24px', paddingBottom: '24px', borderBottom: `1px solid ${COLORS.border}` },
  brandList: { display: 'flex', flexDirection: 'column', gap: '8px' },
  brandItem: { display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '6px 0' },
  brandCheckbox: { width: '18px', height: '18px', cursor: 'pointer', accentColor: COLORS.primary },
  brandLabel: { fontSize: '14px', color: COLORS.textMain, cursor: 'pointer' },
  
  // Mobil & Modal
  mobileFilterOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 999 },
  mobileFilterPanel: { position: 'fixed', top: 0, left: 0, bottom: 0, width: '85%', maxWidth: '320px', backgroundColor: COLORS.bgSurface, padding: '20px', overflowY: 'auto', zIndex: 1000, boxShadow: '2px 0 10px rgba(0, 0, 0, 0.1)' },
  mobileFilterHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '16px', borderBottom: `1px solid ${COLORS.border}` },
  mobileFilterTitle: { fontSize: '18px', fontWeight: '700', color: COLORS.textMain },
  mobileFilterClose: { background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: COLORS.textMuted, padding: '0', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  mobileFilterBtn: { padding: '8px 16px', backgroundColor: COLORS.primary, color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' },

  // Efektler
  cardHover: { transform: 'translateY(-5px)', boxShadow: COLORS.shadowHover },
  imageHover: { transform: 'translate(-50%, -50%) scale(1.05)' },
  quickViewBtn: { position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', padding: '10px 20px', backgroundColor: COLORS.bgSurface, color: COLORS.textMain, border: `1px solid ${COLORS.border}`, borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', opacity: 0, transition: 'opacity 0.3s', zIndex: 3 },
  compareBtn: { position: 'absolute', top: '12px', right: '12px', width: '32px', height: '32px', backgroundColor: COLORS.bgSurface, border: `1px solid ${COLORS.border}`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s', zIndex: 2 },
  compareBtnActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary, color: 'white' },
  ratingRow: { display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '8px' },
  stars: { color: '#FCD34D', fontSize: '12px' },
  ratingText: { fontSize: '12px', color: COLORS.textMuted },

  // Compare Bar & Modal
  compareBar: { position: 'fixed', bottom: '20px', left: '50%', transform: 'translateX(-50%)', backgroundColor: COLORS.bgSurface, padding: '16px 20px', borderRadius: '20px', boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)', border: `1px solid ${COLORS.border}`, zIndex: 100 },
  compareBarContent: { display: 'flex', alignItems: 'center', gap: '20px' },
  compareProducts: { display: 'flex', gap: '12px', alignItems: 'center' },
  compareProduct: { position: 'relative', width: '70px', height: '70px', borderRadius: '12px', border: `2px solid ${COLORS.border}`, overflow: 'hidden', backgroundColor: '#F9FAFB' },
  compareProductImage: { width: '100%', height: '100%', objectFit: 'contain', padding: '4px' },
  compareRemoveBtn: { position: 'absolute', top: '-6px', right: '-6px', width: '20px', height: '20px', borderRadius: '50%', backgroundColor: COLORS.danger, color: 'white', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '10px', fontWeight: '700', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' },
  compareEmptySlot: { width: '70px', height: '70px', borderRadius: '12px', border: `2px dashed ${COLORS.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F9FAFB' },
  compareButton: { padding: '12px 24px', backgroundColor: COLORS.primary, color: 'white', border: 'none', borderRadius: '12px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s', whiteSpace: 'nowrap' },
  compareBarText: { fontSize: '14px', fontWeight: '600', color: COLORS.textMain },
  compareBarBtns: { display: 'flex', gap: '8px' },
  compareBarBtn: { padding: '8px 16px', borderRadius: '8px', border: 'none', fontSize: '13px', fontWeight: '600', cursor: 'pointer' },
  compareBarBtnPrimary: { backgroundColor: COLORS.primary, color: 'white' },
  compareBarBtnSecondary: { backgroundColor: COLORS.bgBody, color: COLORS.textMain },
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' },
  modalContent: { backgroundColor: COLORS.bgSurface, borderRadius: '16px', maxWidth: '900px', width: '100%', maxHeight: '90vh', overflow: 'auto', position: 'relative' },
  modalClose: { position: 'absolute', top: '16px', right: '16px', width: '36px', height: '36px', backgroundColor: COLORS.bgBody, border: 'none', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '20px', color: COLORS.textMain, zIndex: 2 },
  modalBody: { display: 'flex', gap: '32px', padding: '32px' },
  modalImage: { flex: 1, maxWidth: '400px' },
  modalImageImg: { width: '100%', height: 'auto', borderRadius: '12px' },
  modalDetails: { flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' },
  modalBrand: { fontSize: '12px', fontWeight: '700', color: COLORS.primary, textTransform: 'uppercase', letterSpacing: '1px' },
  modalTitle: { fontSize: '24px', fontWeight: '700', color: COLORS.textMain, lineHeight: '1.3' },
  modalDescription: { fontSize: '14px', color: COLORS.textMuted, lineHeight: '1.6' },
  modalPrice: { fontSize: '28px', fontWeight: '800', color: COLORS.textMain },
  modalAddToCart: { padding: '14px 32px', backgroundColor: COLORS.primary, color: 'white', border: 'none', borderRadius: '10px', fontSize: '16px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s' },

  // --- BANNER ---
  bannerContainer: { width: '100%', height: '300px', borderRadius: '16px', overflow: 'hidden', marginBottom: '24px', position: 'relative' },
  bannerImage: { width: '100%', height: '100%', objectFit: 'cover' },
  bannerOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: '24px', background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)', color: 'white' },
};

// --- 4. YARDIMCILAR ---
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

// --- 5. UYUMLULUK MODU ---
const getStyles = (isMobile = false) => {
    return styles;
};

export default getStyles;