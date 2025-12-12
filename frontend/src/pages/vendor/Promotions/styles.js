// src/pages/vendor/Promotions/styles.js

export const getStyles = () => ({
  container: {
    fontFamily: "'Inter', sans-serif",
    color: '#1e293b',
    padding: '24px'
  },

  // Header
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '24px',
    background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
    padding: '28px 32px',
    borderRadius: '16px',
    border: '1px solid #e2e8f0',
    flexWrap: 'wrap',
    gap: '16px'
  },
  title: {
    fontSize: '26px',
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: '-0.02em',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    margin: 0
  },
  titleIcon: {
    color: '#059669',
    fontSize: '28px'
  },
  subtitle: {
    color: '#64748b',
    fontSize: '15px',
    margin: '6px 0 0 0'
  },

  // Info Card
  infoCard: {
    backgroundColor: '#f0fdf4',
    border: '1px solid #bbf7d0',
    borderRadius: '16px',
    padding: '20px 24px',
    marginBottom: '24px',
    display: 'flex',
    gap: '16px',
    alignItems: 'flex-start'
  },
  infoIcon: {
    color: '#16a34a',
    fontSize: '20px',
    marginTop: '2px',
    flexShrink: 0
  },
  infoTitle: {
    fontWeight: '600',
    color: '#15803d',
    marginBottom: '4px',
    fontSize: '14px'
  },
  infoText: {
    color: '#166534',
    fontSize: '13px',
    lineHeight: '1.6',
    margin: 0
  },

  // Tabs
  tabsContainer: {
    display: 'flex',
    gap: '12px',
    marginBottom: '24px'
  },
  tab: {
    padding: '12px 24px',
    backgroundColor: 'white',
    color: '#64748b',
    border: '1px solid #e2e8f0',
    borderRadius: '10px',
    fontWeight: '600',
    fontSize: '14px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.2s'
  },
  tabActive: {
    backgroundColor: '#14532d',
    color: 'white',
    border: 'none'
  },

  // Card
  card: {
    backgroundColor: 'white',
    borderRadius: '16px',
    border: '1px solid #f1f5f9',
    padding: '20px',
    marginBottom: '16px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
  },
  cardInactive: {
    opacity: 0.6
  },

  // Button
  addButton: {
    padding: '10px 20px',
    backgroundColor: '#14532d',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontWeight: '600',
    fontSize: '14px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },

  // Empty State
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px'
  },
  emptyIcon: {
    fontSize: '48px',
    color: '#cbd5e1',
    marginBottom: '16px'
  },
  emptyText: {
    color: '#64748b',
    fontSize: '15px'
  },

  // Coupon Card
  couponHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  couponInfo: {
    flex: 1
  },
  couponTitleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '8px'
  },
  couponCode: {
    backgroundColor: '#f0fdf4',
    color: '#16a34a',
    padding: '6px 12px',
    borderRadius: '8px',
    fontWeight: '700',
    fontSize: '14px',
    fontFamily: 'monospace'
  },
  couponName: {
    fontWeight: '600',
    color: '#0f172a',
    fontSize: '15px'
  },
  badgeInactive: {
    backgroundColor: '#fef2f2',
    color: '#dc2626',
    padding: '4px 8px',
    borderRadius: '6px',
    fontSize: '12px'
  },
  badgeExpired: {
    backgroundColor: '#fef2f2',
    color: '#dc2626',
    padding: '4px 8px',
    borderRadius: '6px',
    fontSize: '12px'
  },
  badgeNotStarted: {
    backgroundColor: '#eff6ff',
    color: '#2563eb',
    padding: '4px 8px',
    borderRadius: '6px',
    fontSize: '12px'
  },
  couponMeta: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '16px',
    fontSize: '13px',
    color: '#64748b'
  },
  discountAmount: {
    color: '#14532d',
    fontWeight: 'bold'
  },

  // Campaign Card
  campaignBadge: {
    backgroundColor: '#fef3c7',
    color: '#d97706',
    padding: '6px 12px',
    borderRadius: '8px',
    fontWeight: '700',
    fontSize: '14px'
  },
  productTag: {
    backgroundColor: '#f1f5f9',
    color: '#475569',
    padding: '4px 10px',
    borderRadius: '6px',
    fontSize: '12px'
  },
  productTagsRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px'
  },
  moreProducts: {
    color: '#64748b',
    fontSize: '12px',
    padding: '4px'
  },

  // Actions
  actionsContainer: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center'
  },
  toggleBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '28px'
  },
  toggleActive: {
    color: '#16a34a'
  },
  toggleInactive: {
    color: '#cbd5e1'
  },
  actionBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#64748b',
    fontSize: '16px'
  },
  deleteBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#dc2626',
    fontSize: '16px'
  },

  // Modal
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: '20px',
    padding: '32px',
    width: '100%',
    maxWidth: '500px',
    maxHeight: '90vh',
    overflow: 'auto'
  },
  modalWide: {
    maxWidth: '600px'
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px'
  },
  modalTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#0f172a',
    margin: 0
  },
  modalCloseBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '20px',
    color: '#64748b'
  },

  // Form
  formGrid: {
    display: 'grid',
    gap: '16px'
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px'
  },
  formGroup: {
    marginBottom: 0
  },
  label: {
    display: 'block',
    fontSize: '13px',
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: '6px'
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '10px',
    border: '1px solid #e2e8f0',
    fontSize: '14px',
    boxSizing: 'border-box'
  },
  textarea: {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '10px',
    border: '1px solid #e2e8f0',
    fontSize: '14px',
    boxSizing: 'border-box',
    minHeight: '60px',
    resize: 'vertical'
  },
  helpText: {
    fontSize: '11px',
    color: '#94a3b8',
    marginTop: '4px'
  },

  // Product Selector
  searchContainer: {
    position: 'relative',
    marginBottom: '12px'
  },
  searchIcon: {
    position: 'absolute',
    left: '14px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#94a3b8'
  },
  searchInput: {
    width: '100%',
    padding: '12px 16px 12px 40px',
    borderRadius: '10px',
    border: '1px solid #e2e8f0',
    fontSize: '14px',
    boxSizing: 'border-box'
  },
  productList: {
    border: '1px solid #e2e8f0',
    borderRadius: '10px',
    maxHeight: '200px',
    overflow: 'auto'
  },
  productItem: {
    padding: '12px 16px',
    borderBottom: '1px solid #f1f5f9',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    backgroundColor: 'white',
    transition: 'background-color 0.15s'
  },
  productItemSelected: {
    backgroundColor: '#f0fdf4'
  },
  checkbox: {
    width: '22px',
    height: '22px',
    borderRadius: '6px',
    border: '2px solid #cbd5e1',
    backgroundColor: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },
  checkboxSelected: {
    border: 'none',
    backgroundColor: '#16a34a'
  },
  checkIcon: {
    color: 'white',
    fontSize: '12px'
  },
  productName: {
    fontWeight: '500',
    color: '#0f172a',
    fontSize: '14px',
    margin: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  emptyProducts: {
    padding: '20px',
    textAlign: 'center',
    color: '#94a3b8'
  },

  // Preview
  previewBox: {
    backgroundColor: '#fef3c7',
    border: '1px solid #fcd34d',
    borderRadius: '10px',
    padding: '12px 16px',
    textAlign: 'center'
  },
  previewText: {
    fontWeight: '700',
    color: '#92400e',
    fontSize: '16px'
  },
  previewSub: {
    color: '#a16207',
    fontSize: '13px',
    marginLeft: '8px'
  },

  // Modal Footer
  modalFooter: {
    display: 'flex',
    gap: '12px',
    marginTop: '24px',
    justifyContent: 'flex-end'
  },
  cancelBtn: {
    padding: '12px 24px',
    backgroundColor: 'white',
    border: '1px solid #e2e8f0',
    borderRadius: '10px',
    fontWeight: '600',
    color: '#64748b',
    cursor: 'pointer'
  },
  submitBtn: {
    padding: '12px 24px',
    background: 'linear-gradient(135deg, #14532d 0%, #166534 100%)',
    border: 'none',
    borderRadius: '10px',
    fontWeight: '600',
    color: 'white',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  submitBtnDisabled: {
    cursor: 'not-allowed',
    opacity: 0.7
  },

  // Loading
  loadingContainer: {
    padding: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '400px'
  },
  spinner: {
    fontSize: '32px',
    color: '#64748b'
  },

  // Global Styles
  globalStyles: `
    @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    .spin { animation: spin 1s linear infinite; }
    input:focus, select:focus, textarea:focus { border-color: #14532d !important; box-shadow: 0 0 0 3px rgba(20, 83, 45, 0.1); outline: none; }
  `
});

export const styles = getStyles();
