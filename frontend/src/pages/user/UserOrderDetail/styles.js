// src/pages/user/UserOrderDetail/styles.js
export const styles = {
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '400px',
    width: '100%'
  },
  errorContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '400px',
    padding: '24px',
    textAlign: 'center'
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '24px'
  },
  header: {
    marginBottom: '24px'
  },
  backButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    backgroundColor: 'transparent',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    color: '#374151',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    textDecoration: 'none',
    transition: 'all 0.2s',
    marginBottom: '16px',
    '&:hover': {
      backgroundColor: '#f9fafb',
      borderColor: '#d1d5db'
    }
  },
  headerInfo: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '12px',
    flexWrap: 'wrap'
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#111827',
    margin: 0
  },
  orderNumber: {
    fontSize: '16px',
    color: '#6b7280',
    margin: 0
  },
  statusCards: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '16px',
    marginBottom: '32px'
  },
  statusCard: {
    backgroundColor: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: '12px',
    padding: '20px'
  },
  statusBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 12px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500'
  },
  mainContent: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '24px',
    marginBottom: '24px'
  },
  section: {
    backgroundColor: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: '12px',
    padding: '24px'
  },
  sectionTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '18px',
    fontWeight: '600',
    color: '#111827',
    marginBottom: '16px',
    marginTop: 0
  },
  itemsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  itemCard: {
    display: 'flex',
    gap: '16px',
    padding: '16px',
    backgroundColor: '#f9fafb',
    borderRadius: '8px',
    alignItems: 'center',
    textDecoration: 'none',
    color: 'inherit',
    transition: 'all 0.2s',
    border: '1px solid #e5e7eb',
    cursor: 'pointer',
  },
  itemImage: {
    width: '80px',
    height: '80px',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    border: '1px solid #e5e7eb',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    overflow: 'hidden'
  },
  itemInfo: {
    flex: 1,
    minWidth: 0
  },
  itemName: {
    fontSize: '15px',
    fontWeight: '500',
    color: '#111827',
    marginBottom: '4px',
    margin: 0
  },
  itemVariant: {
    fontSize: '13px',
    color: '#6b7280',
    marginBottom: '8px',
    margin: '4px 0 8px'
  },
  itemPriceRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontSize: '14px'
  },
  itemQuantity: {
    color: '#6b7280'
  },
  itemPrice: {
    color: '#374151',
    fontWeight: '500'
  },
  itemTotal: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#111827',
    textAlign: 'right'
  },
  addressCard: {
    padding: '16px',
    backgroundColor: '#f9fafb',
    borderRadius: '8px'
  },
  addressTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#111827',
    marginBottom: '8px'
  },
  addressText: {
    fontSize: '14px',
    color: '#6b7280',
    lineHeight: '1.6',
    margin: '4px 0'
  },
  summarySection: {
    backgroundColor: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: '12px',
    padding: '24px',
    marginBottom: '24px'
  },
  summaryCard: {
    backgroundColor: '#f9fafb',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '16px'
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '8px 0',
    fontSize: '14px',
    color: '#374151'
  },
  summaryDivider: {
    height: '1px',
    backgroundColor: '#e5e7eb',
    margin: '12px 0'
  },
  summaryTotal: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '8px 0',
    fontSize: '18px',
    fontWeight: '700',
    color: '#111827'
  },
  cancelButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    width: '100%',
    padding: '12px 24px',
    backgroundColor: '#fee2e2',
    border: '1px solid #fecaca',
    borderRadius: '8px',
    color: '#dc2626',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s',
    '&:hover': {
      backgroundColor: '#fecaca'
    }
  },
  historyList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  historyItem: {
    display: 'flex',
    gap: '12px',
    padding: '12px',
    backgroundColor: '#f9fafb',
    borderRadius: '8px'
  },
  historyIcon: {
    width: '36px',
    height: '36px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },
  historyContent: {
    flex: 1
  },
  historyStatus: {
    fontSize: '15px',
    fontWeight: '500',
    color: '#111827',
    marginBottom: '4px',
    margin: 0
  },
  historyComment: {
    fontSize: '14px',
    color: '#6b7280',
    marginBottom: '4px',
    margin: '4px 0'
  },
  historyDate: {
    fontSize: '13px',
    color: '#9ca3af',
    margin: 0
  }
};
