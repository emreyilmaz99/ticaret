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

// --- 3. ANA STİLLER ---
export const styles = {
  // ... (Diğer genel stiller aynen kalıyor)
  container: { backgroundColor: COLORS.bgBody, minHeight: '100vh', paddingTop: '20px', paddingBottom: '80px', fontFamily: '"Plus Jakarta Sans", "Inter", sans-serif' },
  wrapper: { maxWidth: '1360px', margin: '0 auto', padding: '0 40px' },
  breadcrumbArea: { marginBottom: '20px', color: COLORS.textMuted, fontSize: '13px' },
  mainContent: { display: 'flex', gap: '32px', alignItems: 'flex-start' },
  sidebar: { width: '280px', flexShrink: 0, backgroundColor: COLORS.bgSurface, borderRadius: '16px', border: `1px solid ${COLORS.border}`, padding: '24px', position: 'sticky', top: '100px', maxHeight: 'calc(100vh - 120px)', overflowY: 'auto', boxShadow: COLORS.shadowCard },
  productsSection: { flex: 1, width: '100%' },
  
  // Sidebar Filter Styles
  filterSection: { marginBottom: '24px', paddingBottom: '24px', borderBottom: `1px solid ${COLORS.border}` },
  filterTitle: { fontSize: '16px', fontWeight: '700', color: COLORS.textMain, marginBottom: '16px', fontFamily: '"Inter", sans-serif' },
  brandList: { display: 'flex', flexDirection: 'column', gap: '12px' },
  brandItem: { display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', padding: '8px', borderRadius: '8px', transition: 'background-color 0.2s' },
  brandCheckbox: { width: '18px', height: '18px', cursor: 'pointer', accentColor: COLORS.primary },
  brandLabel: { fontSize: '14px', fontWeight: '500', color: COLORS.textMain, cursor: 'pointer', flex: 1, fontFamily: '"Inter", sans-serif' },
  priceInputs: { display: 'flex', alignItems: 'center', gap: '12px' },
  priceInput: { flex: 1, padding: '10px 12px', border: `1px solid ${COLORS.border}`, borderRadius: '8px', fontSize: '14px', fontWeight: '500', color: COLORS.textMain, outline: 'none', fontFamily: '"Inter", sans-serif', backgroundColor: '#F9FAFB' },
  
  // SortBar (Yeşil Butonlu Toolbar)
  toolbar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', backgroundColor: COLORS.bgSurface, padding: '18px 32px', borderRadius: '16px', boxShadow: COLORS.shadowCard, border: 'none', minHeight: '72px' },
  resultCount: { fontSize: '15px', fontWeight: '600', color: COLORS.textMuted, flex: 1 },
  resultNumber: { color: COLORS.primary, fontWeight: '800', margin: '0 4px' },
  controlsRight: { display: 'flex', alignItems: 'center', gap: '16px', marginLeft: 'auto' },
  sortWrapper: { position: 'relative', display: 'flex', alignItems: 'center', minWidth: '180px' },
  sortSelect: { appearance: 'none', backgroundColor: '#F9FAFB', border: `1px solid ${COLORS.border}`, borderRadius: '8px', padding: '12px 40px 12px 16px', fontSize: '14px', fontWeight: '600', color: COLORS.textMain, cursor: 'pointer', outline: 'none', width: '100%', whiteSpace: 'nowrap' },
  sortIcon: { position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: COLORS.textMuted, pointerEvents: 'none', fontSize: '11px' },
  viewToggle: { display: 'flex', gap: '6px', backgroundColor: '#F9FAFB', padding: '4px', borderRadius: '8px', border: `1px solid ${COLORS.border}` },
  viewBtn: { width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '6px', border: 'none', backgroundColor: 'transparent', color: COLORS.textMuted, cursor: 'pointer' },
  viewBtnActive: { width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '6px', border: 'none', backgroundColor: COLORS.primary, color: 'white', cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(5, 150, 105, 0.3)' },

  // Grid & Kart
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '24px' },
  card: { backgroundColor: COLORS.bgSurface, borderRadius: '16px', border: `1px solid ${COLORS.border}`, overflow: 'hidden', display: 'flex', flexDirection: 'column', position: 'relative', cursor: 'pointer' },
  imgWrap: { position: 'relative', width: '100%', paddingTop: '110%', backgroundColor: '#fff', borderBottom: `1px solid ${COLORS.bgBody}`, overflow: 'hidden' },
  img: { position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '85%', height: '85%', objectFit: 'contain' },
  content: { padding: '16px', display: 'flex', flexDirection: 'column', flex: 1, gap: '8px' },
  title: { fontSize: '15px', fontWeight: '600', color: COLORS.textMain, lineHeight: '1.4', height: '42px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' },
  price: { fontSize: '18px', fontWeight: '800', color: COLORS.textMain },
  priceRow: { display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: 'auto', marginBottom: '12px' },
  addToCartBtn: { width: '100%', padding: '12px', backgroundColor: COLORS.primary, color: 'white', border: 'none', borderRadius: '10px', fontWeight: '600', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 4px 6px rgba(5, 150, 105, 0.2)' },
  
  // ============================================
  // --- SENIOR QUICK VIEW MODAL STİLLERİ ---
  // ============================================
  modalOverlay: {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(4px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, padding: '20px',
  },
  modalContent: {
    backgroundColor: '#FFFFFF', borderRadius: '24px', width: '100%', maxWidth: '950px',
    height: 'auto', maxHeight: '85vh', display: 'flex', flexDirection: 'row',
    overflow: 'hidden', position: 'relative', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  },
  modalClose: {
    position: 'absolute', top: '20px', right: '20px', width: '40px', height: '40px',
    backgroundColor: '#F3F4F6', color: '#374151', border: 'none', borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10, fontSize: '18px',
    transition: 'all 0.2s ease',
  },
  // SOL: GÖRSEL
  modalImageContainer: {
    flex: '0.85', backgroundColor: '#F9FAFB', display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '40px 30px', borderRight: `1px solid ${COLORS.border}`, position: 'relative',
  },
  modalMainImage: {
    maxWidth: '100%', maxHeight: '380px', objectFit: 'contain', mixBlendMode: 'multiply',
    filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.08))',
  },
  // SAĞ: BİLGİ
  modalInfoContainer: { flex: '1.15', display: 'flex', flexDirection: 'column', position: 'relative', minWidth: '420px' },
  modalHeader: { padding: '32px 32px 20px 32px', borderBottom: `1px solid ${COLORS.border}` },
  modalBrand: { fontSize: '12px', fontWeight: '700', color: COLORS.primary, textTransform: 'uppercase', letterSpacing: '1.2px', marginBottom: '8px', fontFamily: '"Inter", sans-serif' },
  modalTitle: { fontSize: '24px', fontWeight: '700', color: COLORS.textMain, lineHeight: '1.3', marginBottom: '16px', fontFamily: '"Inter", sans-serif' },
  modalMetaRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' },
  modalPrice: { fontSize: '28px', fontWeight: '800', color: '#111827', fontFamily: '"Inter", sans-serif', letterSpacing: '-0.5px' },
  modalOldPrice: { fontSize: '16px', color: '#9CA3AF', textDecoration: 'line-through', marginLeft: '12px', fontWeight: '500', fontFamily: '"Inter", sans-serif' },
  modalRating: { display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', fontWeight: '600', color: '#F59E0B', backgroundColor: '#FFFBEB', padding: '8px 14px', borderRadius: '10px', border: '1px solid #FEF3C7' },
  modalRatingScore: { fontWeight: '700', color: '#D97706', fontSize: '15px', fontFamily: '"Inter", sans-serif' },
  modalRatingCount: { fontWeight: '500', color: '#78716C', fontSize: '13px', fontFamily: '"Inter", sans-serif' },
  
  // Scroll İçerik
  modalScrollContent: { padding: '24px 32px 32px 32px', overflowY: 'auto', flex: 1 },
  modalDescription: { fontSize: '14px', color: '#6B7280', lineHeight: '1.7', marginBottom: '24px', fontFamily: '"Inter", sans-serif', fontWeight: '400' },
  
  // Bölüm Başlığı
  infoSectionTitle: { fontSize: '16px', fontWeight: '700', color: '#111827', marginBottom: '16px', fontFamily: '"Inter", sans-serif', letterSpacing: '-0.2px' },
  
  // Bilgi Izgarası (Grid Tablo)
  infoGrid: { 
    display: 'grid', 
    gridTemplateColumns: '1fr 1fr', 
    gap: '12px', 
    backgroundColor: '#FFFFFF', 
    padding: '0', 
    borderRadius: '0', 
    border: 'none' 
  },
  infoItem: { 
    display: 'flex', 
    alignItems: 'flex-start', 
    gap: '12px', 
    padding: '16px', 
    backgroundColor: '#F9FAFB', 
    borderRadius: '12px', 
    border: '1px solid #E5E7EB',
    transition: 'all 0.2s ease'
  },
  infoIconWrapper: {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    backgroundColor: '#E0F2FE',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },
  infoIcon: {
    fontSize: '16px',
    color: '#0284C7'
  },
  infoContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    flex: 1
  },
  infoLabel: { 
    fontSize: '11px', 
    fontWeight: '600', 
    color: '#6B7280', 
    textTransform: 'uppercase', 
    letterSpacing: '0.8px',
    fontFamily: '"Inter", sans-serif'
  },
  infoValue: { 
    fontSize: '14px', 
    fontWeight: '600', 
    color: '#111827',
    fontFamily: '"Inter", sans-serif',
    lineHeight: '1.4'
  },

  // Footer
  modalFooter: { padding: '24px 32px 32px 32px', borderTop: `1px solid ${COLORS.border}`, display: 'flex', gap: '12px', backgroundColor: '#fff' },
  modalBtnPrimary: { 
    flex: 2, 
    padding: '16px 24px', 
    backgroundColor: COLORS.primary, 
    color: '#fff', 
    border: 'none', 
    borderRadius: '12px', 
    fontSize: '15px', 
    fontWeight: '700', 
    cursor: 'pointer', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    gap: '10px', 
    boxShadow: '0 4px 12px rgba(5, 150, 105, 0.3)',
    fontFamily: '"Inter", sans-serif',
    transition: 'all 0.2s ease'
  },
  modalBtnSecondary: { 
    flex: 1, 
    padding: '16px 24px', 
    backgroundColor: '#F9FAFB', 
    color: '#374151', 
    border: `1px solid ${COLORS.border}`, 
    borderRadius: '12px', 
    fontSize: '15px', 
    fontWeight: '700', 
    cursor: 'pointer', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    gap: '8px',
    fontFamily: '"Inter", sans-serif',
    transition: 'all 0.2s ease'
  },
};

// --- YARDIMCILAR ---
export const resolveImage = (product) => product?.image || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23f1f5f9" width="400" height="400"/%3E%3Ctext fill="%2394a3b8" font-family="Arial" font-size="18" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EÜrün Görseli%3C/text%3E%3C/svg%3E';
export const formatPrice = (price) => new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(price || 0);

// --- HATA ÖNLEYİCİ EXPORT ---
const getStyles = () => styles;
export default getStyles;