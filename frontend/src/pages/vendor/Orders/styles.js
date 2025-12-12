// src/pages/vendor/VendorOrders/styles.js

// --- RENK PALETİ ---
const COLORS = {
  bgBody: '#F3F4F6',       // Sayfa Zemini
  bgCard: '#FFFFFF',       // Kart Zemini
  textMain: '#111827',     // Ana Metin
  textMuted: '#6B7280',    // Gri Metin
  border: '#E5E7EB',       // Kenarlıklar
  primary: '#059669',      // Zümrüt Yeşili (Panel Rengi)
  primaryLight: '#D1FAE5', // Açık Yeşil
  primaryDark: '#047857',  // Hover
  
  // Durum Renkleri
  status: {
    pending: { bg: '#FEF3C7', text: '#D97706' },    // Bekliyor (Amber)
    processing: { bg: '#DBEAFE', text: '#2563EB' }, // Hazırlanıyor (Blue)
    shipped: { bg: '#E0E7FF', text: '#4F46E5' },    // Kargoda (Indigo)
    delivered: { bg: '#D1FAE5', text: '#059669' },  // Teslim (Green)
    cancelled: { bg: '#FEE2E2', text: '#DC2626' },  // İptal (Red)
  },
  
  shadowSm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  shadowMd: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
};

export const getStyles = () => ({
  // --- SAYFA GENELİ ---
  container: {
    padding: '32px',
    backgroundColor: '#FFFFFF',
    minHeight: '100vh',
    fontFamily: '"Plus Jakarta Sans", "Inter", sans-serif',
  },

  // --- HEADER ---
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '24px',
    background: '#FFFFFF',
    padding: '28px 32px',
    borderRadius: '16px',
    border: '1px solid #e2e8f0',
    flexWrap: 'wrap',
    gap: '16px',
  },
  titleGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  title: {
    fontSize: '26px',
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: '-0.02em',
    margin: 0,
  },
  subtitle: {
    fontSize: '15px',
    color: '#64748b',
    margin: 0,
  },
  headerActions: {
    display: 'flex',
    gap: '12px',
  },
  exportBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 16px',
    backgroundColor: COLORS.bgCard,
    border: `1px solid ${COLORS.border}`,
    borderRadius: '10px',
    color: COLORS.textMain,
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
    boxShadow: COLORS.shadowSm,
  },

  // --- KPI KARTLARI ---
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '24px',
    marginBottom: '32px',
  },
  statCard: {
    backgroundColor: COLORS.bgCard,
    padding: '24px',
    borderRadius: '16px',
    border: `1px solid ${COLORS.border}`,
    boxShadow: COLORS.shadowSm,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  statLabel: {
    fontSize: '13px',
    fontWeight: '600',
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  statValue: {
    fontSize: '28px',
    fontWeight: '800',
    color: COLORS.textMain,
  },
  statIconBox: (color) => ({
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: color === 'green' ? COLORS.primaryLight : 
                     color === 'blue' ? '#DBEAFE' : 
                     color === 'amber' ? '#FEF3C7' : '#F3F4F6',
    color: color === 'green' ? COLORS.primary : 
           color === 'blue' ? '#2563EB' : 
           color === 'amber' ? '#D97706' : COLORS.textMuted,
  }),

  // --- MODERN TOOLBAR & FİLTRELEME ---
  toolbar: {
    backgroundColor: COLORS.bgCard,
    padding: '20px',
    borderRadius: '16px',
    border: `1px solid ${COLORS.border}`,
    boxShadow: COLORS.shadowSm,
    marginBottom: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  
  // Toolbar Üst Satır
  toolbarTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '16px',
    width: '100%',
  },

  searchWrapper: {
    position: 'relative',
    flex: 1,
    minWidth: '280px',
  },
  searchInput: {
    width: '100%',
    padding: '12px 16px 12px 44px',
    borderRadius: '10px',
    border: `1px solid ${COLORS.border}`,
    fontSize: '14px',
    outline: 'none',
    backgroundColor: '#fff',
    transition: 'all 0.2s',
    color: COLORS.textMain,
  },
  searchIcon: {
    position: 'absolute',
    left: '14px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: COLORS.textMuted,
    fontSize: '16px',
  },

  controlsRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },

  // Şık Dropdown
  statusSelect: {
    padding: '12px 16px',
    borderRadius: '10px',
    border: `1px solid ${COLORS.border}`,
    backgroundColor: '#fff',
    fontSize: '14px',
    color: COLORS.textMain,
    cursor: 'pointer',
    outline: 'none',
    minWidth: '180px',
  },

  // Filtre Butonu (Aktif/Pasif durumlu)
  filterBtn: (isActive) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 20px',
    borderRadius: '10px',
    border: isActive ? `1px solid ${COLORS.primary}` : `1px solid ${COLORS.border}`,
    backgroundColor: isActive ? COLORS.primaryLight : '#fff',
    color: isActive ? COLORS.primary : COLORS.textMain,
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
  }),

  // Gelişmiş Filtre Paneli (Açılır Kısım)
  advancedFilterPanel: {
    paddingTop: '20px',
    borderTop: `1px dashed ${COLORS.border}`,
    display: 'flex',
    flexWrap: 'wrap',
    gap: '24px',
    animation: 'fadeIn 0.3s ease',
  },
  advFilterGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  advLabel: {
    fontSize: '12px',
    fontWeight: '600',
    color: COLORS.textMuted,
    textTransform: 'uppercase',
  },
  advInputRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  advInput: {
    padding: '10px 12px',
    borderRadius: '8px',
    border: `1px solid ${COLORS.border}`,
    fontSize: '13px',
    width: '120px',
    outline: 'none',
    backgroundColor: '#F9FAFB',
  },

  // --- TABLO ALANI ---
  tableContainer: {
    backgroundColor: COLORS.bgCard,
    borderRadius: '16px',
    border: `1px solid ${COLORS.border}`,
    boxShadow: COLORS.shadowMd,
    overflow: 'hidden',
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left',
  },
  th: {
    padding: '16px 24px',
    backgroundColor: '#fff',
    borderBottom: `1px solid ${COLORS.border}`,
    fontSize: '12px',
    fontWeight: '700',
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  tr: {
    borderBottom: `1px solid ${COLORS.border}`,
    transition: 'background-color 0.2s',
    cursor: 'pointer',
  },
  td: {
    padding: '20px 24px',
    fontSize: '14px',
    color: COLORS.textMain,
    verticalAlign: 'middle',
  },
  
  // Tablo İçi Elemanlar
  orderId: {
    fontWeight: '700',
    color: COLORS.primary,
  },
  customerInfo: {
    display: 'flex',
    flexDirection: 'column',
  },
  customerName: {
    fontWeight: '600',
    color: COLORS.textMain,
  },
  customerEmail: {
    fontSize: '12px',
    color: COLORS.textMuted,
  },
  price: {
    fontWeight: '700',
    fontSize: '15px',
  },
  date: {
    color: COLORS.textMuted,
    fontSize: '13px',
  },

  statusBadge: (status) => ({
    display: 'inline-flex',
    alignItems: 'center',
    padding: '6px 12px',
    borderRadius: '50px',
    fontSize: '12px',
    fontWeight: '700',
    backgroundColor: COLORS.status[status]?.bg || '#F3F4F6',
    color: COLORS.status[status]?.text || COLORS.textMuted,
    textTransform: 'capitalize',
  }),

  // --- AKSİYON BUTONLARI ---
  actionGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  actionBtnSmall: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 12px',
    borderRadius: '6px',
    border: 'none',
    fontSize: '12px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'transform 0.1s, box-shadow 0.2s',
  },
  btnApprove: {
    backgroundColor: '#DCFCE7',
    color: '#166534',
    border: '1px solid #BBF7D0',
  },
  btnShip: {
    backgroundColor: '#E0E7FF',
    color: '#4338CA',
    border: '1px solid #C7D2FE',
  },
  btnCancel: {
    backgroundColor: '#FEE2E2',
    color: '#991B1B',
    border: '1px solid #FECACA',
  },
  btnDetail: {
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '6px',
    border: `1px solid ${COLORS.border}`,
    backgroundColor: 'white',
    color: COLORS.textMuted,
    cursor: 'pointer',
    transition: 'all 0.2s',
  },

  // --- MODAL STİLLERİ ---
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: 'white',
    width: '90%',
    maxWidth: '800px',
    maxHeight: '90vh', 
    borderRadius: '20px',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  modalHeader: {
    padding: '24px',
    borderBottom: `1px solid ${COLORS.border}`,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  modalTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: COLORS.textMain,
  },
  modalStatusBadge: (status) => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 14px',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '700',
    backgroundColor: COLORS.status[status]?.bg || '#F3F4F6',
    color: COLORS.status[status]?.text || COLORS.textMuted,
    textTransform: 'capitalize',
    marginLeft: '12px',
  }),
  closeBtn: {
    background: 'none',
    border: 'none',
    fontSize: '24px',
    color: COLORS.textLight,
    cursor: 'pointer',
    padding: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    transition: 'background-color 0.2s',
  },
  modalBody: {
    padding: '24px',
    overflowY: 'auto',
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '24px',
    marginBottom: '32px',
  },
  infoCard: {
    padding: '16px',
    backgroundColor: '#F8FAFC',
    borderRadius: '12px',
    border: `1px solid ${COLORS.border}`,
  },
  infoTitle: {
    fontSize: '12px',
    fontWeight: '700',
    color: COLORS.textLight,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '12px',
  },
  productList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  productItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    paddingBottom: '16px',
    borderBottom: `1px dashed ${COLORS.border}`,
  },
  productImg: {
    width: '60px',
    height: '60px',
    borderRadius: '8px',
    objectFit: 'cover',
    border: `1px solid ${COLORS.border}`,
  },
  productDetails: {
    flex: 1,
  },
  productName: {
    fontSize: '14px',
    fontWeight: '600',
    color: COLORS.textMain,
    display: 'block',
  },
  productVariant: {
    fontSize: '12px',
    color: COLORS.textLight,
  },
  productPrice: {
    fontSize: '14px',
    fontWeight: '700',
    color: COLORS.textMain,
  },
  totalSection: {
    marginTop: '24px',
    display: 'flex',
    justifyContent: 'flex-end',
  },
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '250px',
    marginBottom: '8px',
    fontSize: '14px',
    color: COLORS.textLight,
  },
  grandTotal: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '250px',
    marginTop: '12px',
    paddingTop: '12px',
    borderTop: `1px solid ${COLORS.border}`,
    fontSize: '18px',
    fontWeight: '800',
    color: COLORS.primary,
  },
  
  // Modal Alt Aksiyon Barı
  modalFooter: {
    padding: '20px 24px',
    borderTop: `1px solid ${COLORS.border}`,
    backgroundColor: '#F9FAFB',
    display: 'flex',
    justifyContent: 'space-between', 
    alignItems: 'center',
    gap: '12px',
  },
  modalBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 24px',
    borderRadius: '10px',
    border: 'none',
    fontSize: '14px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'transform 0.1s, box-shadow 0.2s',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
  },

  // --- FATURA BUTONU ---
  btnInvoice: {
    backgroundColor: '#F3F4F6',
    color: '#4B5563',
    border: '1px solid #D1D5DB',
    marginLeft: 'auto',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 16px',
    borderRadius: '10px',
    fontSize: '13px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
});