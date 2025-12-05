// src/pages/user/Cart/styles.js

/**
 * Cart sayfası için merkezi stil tanımlamaları
 * Tüm alt bileşenler bu stilleri kullanır
 */
export const getStyles = (isMobile) => ({
  // Container stilleri
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: isMobile ? '20px 12px' : '40px 20px',
    fontFamily: '"Inter", sans-serif',
    minHeight: '80vh',
  },

  // Header stilleri
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: isMobile ? '20px' : '32px',
  },
  headerTitle: {
    fontSize: isMobile ? '24px' : '32px',
    fontWeight: '800',
    color: '#1e293b',
    margin: 0,
  },
  headerCount: {
    fontSize: isMobile ? '14px' : '18px',
    fontWeight: '500',
    color: '#64748b',
  },

  // Layout stilleri
  layout: {
    display: 'flex',
    flexDirection: isMobile ? 'column' : 'row',
    gap: isMobile ? '24px' : '32px',
  },
  productList: {
    flex: '1',
    minWidth: 0,
  },
  summary: {
    width: isMobile ? '100%' : '380px',
    flexShrink: 0,
  },

  // Boş sepet stilleri
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '60vh',
    textAlign: 'center',
    padding: isMobile ? '20px' : '0',
  },
  emptyIconBg: {
    backgroundColor: '#f8fafc',
    padding: isMobile ? '24px' : '32px',
    borderRadius: '50%',
    marginBottom: '24px',
  },
  emptyTitle: {
    fontSize: isMobile ? '20px' : '24px',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '8px',
  },
  emptyText: {
    color: '#64748b',
    marginBottom: '32px',
    maxWidth: '400px',
    lineHeight: '1.5',
    fontSize: isMobile ? '14px' : '16px',
  },
  startShoppingBtn: {
    backgroundColor: '#059669',
    color: 'white',
    padding: isMobile ? '10px 24px' : '12px 32px',
    borderRadius: '12px',
    fontWeight: '600',
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    boxShadow: '0 4px 12px rgba(5, 150, 105, 0.2)',
    transition: 'transform 0.2s',
    fontSize: isMobile ? '14px' : '16px',
  },

  // Kart stilleri
  card: {
    backgroundColor: 'white',
    borderRadius: isMobile ? '16px' : '24px',
    border: '1px solid #e2e8f0',
    overflow: 'hidden',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
  },
  tableHeader: {
    display: isMobile ? 'none' : 'grid',
    gridTemplateColumns: '2fr 1fr 1fr 1fr',
    padding: '16px 24px',
    backgroundColor: '#f8fafc',
    borderBottom: '1px solid #e2e8f0',
    fontSize: '14px',
    fontWeight: '600',
    color: '#64748b',
  },

  // Ürün satırı stilleri
  cartItem: {
    padding: isMobile ? '16px' : '24px',
    borderBottom: '1px solid #f1f5f9',
    display: isMobile ? 'flex' : 'grid',
    flexDirection: isMobile ? 'column' : 'row',
    gridTemplateColumns: '2fr 1fr 1fr 1fr',
    alignItems: isMobile ? 'flex-start' : 'center',
    gap: '16px',
  },
  productInfo: {
    display: 'flex',
    gap: isMobile ? '12px' : '16px',
  },
  productImage: {
    width: isMobile ? '70px' : '80px',
    height: isMobile ? '70px' : '80px',
    borderRadius: '12px',
    objectFit: 'cover',
    border: '1px solid #e2e8f0',
  },
  productDetails: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  productName: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '4px',
    textDecoration: 'none',
  },
  variantText: {
    fontSize: '13px',
    color: '#64748b',
  },

  // Buton stilleri
  removeBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    color: '#ef4444',
    fontSize: '13px',
    fontWeight: '500',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    marginTop: '8px',
    padding: 0,
  },
  quantityControl: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    backgroundColor: '#f8fafc',
    padding: '4px',
    borderRadius: '8px',
    width: 'fit-content',
  },
  qtyBtn: {
    width: '28px',
    height: '28px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    border: '1px solid #e2e8f0',
    borderRadius: '6px',
    cursor: 'pointer',
    color: '#475569',
  },
  qtyText: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#1e293b',
    minWidth: '20px',
    textAlign: 'center',
  },

  // Fiyat stilleri
  priceText: {
    fontSize: '16px',
    color: '#475569',
    fontWeight: '500',
  },
  totalText: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#059669',
    textAlign: 'right',
  },

  // Footer stilleri
  footer: {
    padding: '20px 24px',
    backgroundColor: '#f8fafc',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  continueLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: '#475569',
    textDecoration: 'none',
    fontWeight: '500',
    fontSize: '14px',
  },
  clearBtn: {
    color: '#ef4444',
    background: 'none',
    border: 'none',
    fontWeight: '500',
    fontSize: '14px',
    cursor: 'pointer',
  },

  // Özet kartı stilleri
  summaryCard: {
    backgroundColor: 'white',
    borderRadius: '24px',
    border: '1px solid #e2e8f0',
    padding: '24px',
    position: 'sticky',
    top: '100px',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)',
  },
  summaryTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '24px',
  },

  // Kupon stilleri
  couponSection: {
    marginBottom: '24px',
  },
  couponLabel: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '500',
    color: '#475569',
    marginBottom: '8px',
  },
  couponForm: {
    display: 'flex',
    gap: '8px',
  },
  couponInput: {
    flex: 1,
    padding: '10px 16px',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    fontSize: '14px',
    outline: 'none',
  },
  couponBtn: {
    backgroundColor: '#1e293b',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    padding: '0 16px',
    fontWeight: '600',
    fontSize: '14px',
    cursor: 'pointer',
  },
  activeCoupon: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    border: '1px solid #bbf7d0',
    padding: '12px',
    borderRadius: '12px',
    color: '#15803d',
  },

  // Hesaplama satırları
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '12px',
    color: '#64748b',
    fontSize: '15px',
  },
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '24px',
    paddingTop: '24px',
    borderTop: '1px solid #e2e8f0',
    fontSize: '20px',
    fontWeight: '800',
    color: '#1e293b',
  },

  // Checkout butonu
  checkoutBtn: {
    width: '100%',
    backgroundColor: '#059669',
    color: 'white',
    border: 'none',
    padding: '16px',
    borderRadius: '16px',
    fontSize: '16px',
    fontWeight: '700',
    cursor: 'pointer',
    marginTop: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    boxShadow: '0 4px 12px rgba(5, 150, 105, 0.3)',
    transition: 'background-color 0.2s',
  },
});
