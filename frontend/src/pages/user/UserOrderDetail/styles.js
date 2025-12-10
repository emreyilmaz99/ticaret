export const styles = {
  // Themes & base
  primary: '#0F5132',
  accent: '#B78B43',
  muted: '#6B7280',
  border: '#E6E9EE',
  // Overlay and modal
  overlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1050,
    backdropFilter: 'blur(3px)',
    padding: '16px'
  },
  modalContainer: {
    backgroundColor: '#fff',
    width: '100%',
    maxWidth: '960px',
    borderRadius: '18px',
    boxShadow: '0 30px 80px rgba(8, 12, 20, 0.08)',
    display: 'flex',
    flexDirection: 'column',
    maxHeight: '85vh',
    overflow: 'hidden',
    animation: 'fadeIn 0.2s ease-out'
  },
  // --- Header ---
  header: {
    padding: '22px 28px',
    borderBottom: `1px solid ${'#E6E9EE'}`,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff'
  },
  titleGroup: {
    display: 'flex',
    flexDirection: 'column'
  },
  title: {
    fontSize: '21px',
    fontWeight: '700',
    color: '#0B1220',
    fontFamily: '"Playfair Display", serif',
    margin: 0
  },
  orderNumber: { fontSize: 13, color: '#6b7280', marginTop: 6 },
  subtitle: {
    fontSize: '13px',
    color: '#6b7280',
    marginTop: '2px'
  },
  iconCloseBtn: {
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    color: '#9ca3af',
    padding: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  // --- Body ---
  body: {
    padding: '20px 24px',
    overflowY: 'auto',
    display: 'grid',
    gridTemplateColumns: '1fr 360px',
    gap: '24px',
    alignItems: 'start'
  },
  sectionTitle: {
    fontSize: '15px',
    fontWeight: '700',
    color: '#0B1220',
    marginBottom: '16px'
  },
  section: { marginBottom: '18px' },
  // Status cards (top area)
  statusCards: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '12px',
    marginBottom: '18px'
  },
  statusCard: {
    padding: '14px',
    borderRadius: '10px',
    background: '#ffffff',
    border: `1px solid ${'#F3F4F6'}`,
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    boxShadow: '0 6px 18px rgba(11,18,32,0.03)'
  },
  statusBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '6px 10px',
    borderRadius: '999px',
    fontWeight: 700,
    fontSize: '13px'
  },
  // Liste ve Tablo Yapısı
  productList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  // Items list specific keys used in index.jsx
  itemsList: { display: 'flex', flexDirection: 'column', gap: '12px' },
  itemCard: { display: 'flex', gap: '16px', alignItems: 'center', padding: '12px', borderRadius: '10px', border: `1px solid ${'#F3F4F6'}`, backgroundColor: '#fff', textDecoration: 'none', color: 'inherit' },
  itemImage: { width: 72, height: 72, borderRadius: 12, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F9FAFB', border: `1px solid ${'#F3F4F6'}` },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 15, fontWeight: 700, color: '#0B1220' },
  itemVariant: { marginTop: 6, fontSize: 13, color: '#6b7280' },
  itemPriceRow: { display: 'flex', gap: 8, alignItems: 'baseline', marginTop: 8 },
  itemQuantity: { fontWeight: 700, color: '#6B7280' },
  itemPrice: { fontWeight: 700, color: '#0B1220' },
  itemTotal: { fontSize: 15, fontWeight: 700, color: '#0B1220' },
  // Address card
  addressCard: { padding: '12px', borderRadius: '10px', border: `1px solid ${'#F3F4F6'}`, background: '#fff', boxShadow: '0 6px 18px rgba(11,18,32,0.03)' },
  addressTitle: { fontSize: 14, fontWeight: 700, color: '#0B1220' },
  addressText: { fontSize: 13, color: '#6b7280', marginTop: 6 },
  // History
  historyList: { display: 'flex', flexDirection: 'column', gap: 10 },
  historyItem: { display: 'flex', gap: 12, alignItems: 'flex-start', padding: 10, borderRadius: 10, border: `1px solid ${'#F3F4F6'}`, background: '#fff' },
  historyIcon: { width: 40, height: 40, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  historyContent: { flex: 1 },
  historyStatus: { fontWeight: 700, fontSize: 14, color: '#0B1220' },
  historyComment: { fontSize: 13, color: '#6b7280', marginTop: 6 },
  historyDate: { fontSize: 13, color: '#9ca3af', marginTop: 8 },
  // Loading/Error container aliases (copy of earlier boxes)
  loadingContainer: { backgroundColor: '#fff', padding: '30px', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  errorContainer: { backgroundColor: '#fff', padding: '30px', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: '350px' },
  productRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '14px',
    borderRadius: '12px',
    border: `1px solid ${'#F3F4F6'}`,
    backgroundColor: '#ffffff',
    boxShadow: '0 6px 18px rgba(11,18,32,0.04)'
  },
  imageBox: {
    width: '56px',
    height: '56px',
    borderRadius: '8px',
    backgroundColor: '#f3f4f6',
    border: '1px solid #e5e7eb',
    overflow: 'hidden',
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  img: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  infoBox: {
    flex: 1
  },
  productName: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: '2px'
  },
  variantInfo: {
    fontSize: '13px',
    color: '#6b7280'
  },
  priceBox: {
    fontSize: '15px',
    fontWeight: '700',
    color: '#111827'
  },
  // Özet Alanı
  summaryContainer: {
    marginTop: '6px',
    backgroundColor: '#ffffff',
    padding: '18px',
    borderRadius: '12px',
    border: `1px solid ${'#E6E9EE'}`,
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    boxShadow: '0 6px 20px rgba(11,18,32,0.03)'
  },
  summarySection: { marginTop: '12px' },
  summaryDivider: { height: 1, backgroundColor: '#F3F4F6', margin: '12px 0' },
  summaryTotal: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 800, color: '#0B1220', fontSize: '18px' },
  cancelButton: { padding: '10px 14px', backgroundColor: '#fef2f2', color: '#b91c1c', border: `1px solid #fca5a5`, borderRadius: 10, fontWeight: '700', cursor: 'pointer' },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '14px',
    color: '#4b5563'
  },
  summaryTotalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '16px',
    fontWeight: '700',
    color: '#111827',
    borderTop: '1px solid #e5e7eb',
    paddingTop: '8px',
    marginTop: '4px'
  },
  // --- Footer ---
  footer: {
    padding: '18px 26px',
    borderTop: `1px solid ${'#E6E9EE'}`,
    display: 'flex',
    justifyContent: 'flex-end',
    backgroundColor: '#ffffff'
  },
  closeButton: {
    padding: '10px 22px',
    backgroundColor: '#0F5132',
    color: '#ffffff',
    border: 'none',
    borderRadius: '10px',
    fontWeight: '700',
    cursor: 'pointer',
    fontSize: '14px',
    boxShadow: '0 6px 20px rgba(11,18,32,0.06)'
  },
  actionLink: {
    color: '#0F5132',
    textDecoration: 'none',
    fontWeight: 700,
    marginRight: 12
  },
  // Yüklenme & Hata
  loadingBox: {
    backgroundColor: '#fff',
    padding: '30px',
    borderRadius: '12px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  errorBox: {
    backgroundColor: '#fff',
    padding: '30px',
    borderRadius: '12px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    maxWidth: '350px'
  }
};