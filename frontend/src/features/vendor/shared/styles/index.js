// src/features/vendor/shared/styles/index.js

export const styles = {
  // Container
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },

  // Card
  card: {
    backgroundColor: 'var(--bg-card)',
    borderRadius: 'var(--radius)',
    boxShadow: 'var(--shadow-sm)',
    border: '1px solid #e2e8f0',
  },

  // Header
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 24px',
  },

  // Tabs
  tabContainer: {
    display: 'flex',
    gap: '8px',
  },

  tab: (isActive) => ({
    padding: '8px 16px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: isActive ? 'var(--primary)' : 'transparent',
    color: isActive ? 'white' : 'var(--text-muted)',
    fontWeight: '500',
    cursor: 'pointer',
    textTransform: 'capitalize',
    transition: 'all 0.2s',
  }),

  // Search & Filter
  actionGroup: {
    display: 'flex',
    gap: '12px',
  },

  searchWrapper: {
    position: 'relative',
  },

  searchIcon: {
    position: 'absolute',
    left: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: 'var(--text-muted)',
  },

  searchInput: {
    padding: '10px 10px 10px 36px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    outline: 'none',
    width: '250px',
    fontFamily: 'Inter, sans-serif',
  },

  filterButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 16px',
    backgroundColor: 'white',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    color: 'var(--text-main)',
    cursor: 'pointer',
  },

  // Table
  tableContainer: {
    backgroundColor: 'var(--bg-card)',
    borderRadius: 'var(--radius)',
    boxShadow: 'var(--shadow-sm)',
    overflow: 'hidden',
    border: '1px solid #e2e8f0',
  },

  table: {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left',
  },

  thead: {
    backgroundColor: '#f8fafc',
    borderBottom: '1px solid #e2e8f0',
  },

  th: {
    padding: '16px 24px',
    fontSize: '12px',
    fontWeight: '600',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
  },

  tr: {
    borderBottom: '1px solid #f1f5f9',
  },

  td: {
    padding: '16px 24px',
  },

  // Vendor Cell
  vendorCell: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },

  vendorAvatar: {
    width: '40px',
    height: '40px',
    backgroundColor: '#e0e7ff',
    color: 'var(--primary)',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
  },

  vendorName: {
    fontWeight: '600',
    color: 'var(--text-main)',
  },

  vendorProducts: {
    fontSize: '12px',
    color: 'var(--text-muted)',
  },

  // Owner Cell
  ownerName: {
    fontWeight: '500',
    color: 'var(--text-main)',
  },

  ownerEmail: {
    fontSize: '12px',
    color: 'var(--text-muted)',
  },

  // Revenue & Rating
  revenue: {
    fontWeight: '600',
    color: 'var(--text-main)',
  },

  ratingContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    color: '#f59e0b',
  },

  ratingValue: {
    fontWeight: '600',
    color: 'var(--text-main)',
  },

  // Actions
  actionsCell: {
    textAlign: 'right',
  },

  actionGroup: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '8px',
  },

  actionButton: (variant = 'default') => ({
    padding: '8px',
    borderRadius: '6px',
    border: variant === 'default' ? '1px solid #e2e8f0' : `1px solid ${variant === 'approve' ? '#dcfce7' : variant === 'reject' ? '#fee2e2' : '#e2e8f0'}`,
    backgroundColor: variant === 'default' ? 'white' : variant === 'approve' ? '#dcfce7' : variant === 'reject' ? '#fff1f2' : 'white',
    color: variant === 'default' ? 'var(--text-muted)' : variant === 'approve' ? '#16a34a' : variant === 'reject' ? '#ef4444' : 'var(--primary)',
    cursor: 'pointer',
    transition: 'all 0.2s',
  }),

  // Badge
  badge: (color) => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    padding: '4px 10px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
    backgroundColor:
      color === 'green' ? '#d1fae5' :
      color === 'red' ? '#fee2e2' :
      color === 'yellow' ? '#fef3c7' :
      color === 'blue' ? '#dbeafe' : '#f1f5f9',
    color:
      color === 'green' ? '#047857' :
      color === 'red' ? '#dc2626' :
      color === 'yellow' ? '#b45309' :
      color === 'blue' ? '#1e40af' : '#475569',
  }),

  // Pagination
  paginationContainer: {
    padding: '16px 24px',
    backgroundColor: '#f8fafc',
    borderTop: '1px solid #e2e8f0',
  },

  // Loading & Empty
  loadingContainer: {
    padding: '24px',
    color: 'var(--text-muted)',
  },

  emptyCell: {
    padding: '24px',
    textAlign: 'center',
    color: 'var(--text-muted)',
  },
};
