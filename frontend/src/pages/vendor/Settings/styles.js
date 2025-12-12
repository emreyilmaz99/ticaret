// src/pages/vendor/Settings/styles.js

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
    margin: 0
  },
  subtitle: {
    color: '#64748b',
    fontSize: '15px',
    margin: '6px 0 0 0'
  },

  // Tabs
  tabsContainer: {
    display: 'flex',
    gap: '24px',
    borderBottom: '1px solid #e2e8f0',
    marginBottom: '32px'
  },
  tab: {
    padding: '0 0 16px 0',
    border: 'none',
    background: 'none',
    borderBottom: '2px solid transparent',
    color: '#64748b',
    fontWeight: '500',
    cursor: 'pointer',
    fontSize: '14px'
  },
  tabActive: {
    borderBottom: '2px solid #14532d',
    color: '#14532d',
    fontWeight: '600'
  },

  // Card
  card: {
    backgroundColor: 'white',
    padding: '32px',
    borderRadius: '24px',
    border: '1px solid #f1f5f9',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.02)'
  },

  // Form
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: '8px'
  },
  input: {
    width: '100%',
    padding: '12px 12px 12px 40px',
    borderRadius: '10px',
    border: '1px solid #e2e8f0',
    outline: 'none',
    fontSize: '14px',
    transition: 'all 0.2s',
    boxSizing: 'border-box'
  },
  inputPlain: {
    width: '100%',
    padding: '12px',
    borderRadius: '10px',
    border: '1px solid #e2e8f0',
    outline: 'none',
    fontSize: '14px',
    transition: 'all 0.2s',
    boxSizing: 'border-box'
  },
  inputDisabled: {
    backgroundColor: '#f8fafc',
    color: '#94a3b8'
  },
  textarea: {
    width: '100%',
    padding: '12px',
    borderRadius: '10px',
    border: '1px solid #e2e8f0',
    outline: 'none',
    fontSize: '14px',
    minHeight: '80px',
    resize: 'vertical',
    boxSizing: 'border-box'
  },
  select: {
    width: '100%',
    padding: '12px',
    borderRadius: '10px',
    border: '1px solid #e2e8f0',
    outline: 'none',
    fontSize: '14px',
    cursor: 'pointer',
    boxSizing: 'border-box'
  },
  helpText: {
    fontSize: '12px',
    color: '#94a3b8',
    marginTop: '4px'
  },
  inputIcon: {
    position: 'absolute',
    left: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#94a3b8'
  },

  // Grid layouts
  formGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '24px',
    marginBottom: '24px'
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
    marginBottom: '16px'
  },
  formRowWide: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: '16px',
    marginBottom: '16px'
  },

  // Logo upload
  logoSection: {
    marginBottom: '32px'
  },
  logoWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '24px'
  },
  logoPreview: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    backgroundColor: '#f1f5f9',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#94a3b8',
    border: '2px dashed #cbd5e1',
    overflow: 'hidden',
    position: 'relative'
  },
  logoImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  uploadBtn: {
    padding: '8px 16px',
    backgroundColor: 'white',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    fontWeight: '600',
    color: '#475569',
    cursor: 'pointer',
    marginRight: '12px',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px'
  },
  removeBtn: {
    padding: '8px 16px',
    backgroundColor: 'transparent',
    border: 'none',
    color: '#ef4444',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px'
  },

  // Submit button
  submitBtn: {
    backgroundColor: '#14532d',
    color: 'white',
    border: 'none',
    padding: '12px 32px',
    borderRadius: '10px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    boxShadow: '0 4px 12px rgba(20, 83, 45, 0.2)'
  },
  submitBtnDisabled: {
    opacity: 0.7,
    cursor: 'not-allowed'
  },
  addBtn: {
    backgroundColor: '#059669',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  },
  cancelBtn: {
    backgroundColor: '#f1f5f9',
    color: '#64748b',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer'
  },

  // Section header
  sectionHeader: {
    fontSize: '18px',
    fontWeight: '700',
    marginBottom: '24px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  sectionIcon: {
    color: '#059669'
  },

  // List items
  listContainer: {
    marginTop: '32px'
  },
  listTitle: {
    fontSize: '16px',
    fontWeight: '600',
    marginBottom: '16px',
    color: '#64748b'
  },
  listItems: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  listItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px',
    backgroundColor: '#f8fafc',
    borderRadius: '12px',
    border: '1px solid #e2e8f0'
  },
  itemInfo: {
    flex: 1
  },
  itemTitle: {
    fontWeight: '600',
    color: '#0f172a',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  itemSubtitle: {
    fontSize: '13px',
    color: '#64748b',
    marginTop: '4px'
  },
  itemMeta: {
    fontSize: '12px',
    color: '#94a3b8',
    marginTop: '2px'
  },
  primaryBadge: {
    fontSize: '11px',
    backgroundColor: '#dcfce7',
    color: '#059669',
    padding: '2px 8px',
    borderRadius: '12px',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px'
  },
  itemActions: {
    display: 'flex',
    gap: '8px'
  },
  editBtn: {
    padding: '8px',
    backgroundColor: '#eff6ff',
    color: '#2563eb',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer'
  },
  deleteBtn: {
    padding: '8px',
    backgroundColor: '#fef2f2',
    color: '#dc2626',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer'
  },

  // Empty state
  emptyState: {
    marginTop: '24px',
    padding: '32px',
    backgroundColor: '#f8fafc',
    borderRadius: '12px',
    textAlign: 'center',
    border: '2px dashed #e2e8f0'
  },
  emptyIcon: {
    color: '#cbd5e1',
    marginBottom: '12px'
  },
  emptyText: {
    color: '#64748b',
    margin: 0
  },
  emptySubtext: {
    color: '#94a3b8',
    fontSize: '13px',
    marginTop: '4px'
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

  // IBAN prefix
  ibanPrefix: {
    position: 'absolute',
    left: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#64748b',
    fontWeight: '600',
    fontSize: '14px'
  },

  // Global Styles
  globalStyles: `
    @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    .spin { animation: spin 1s linear infinite; }
  `
});

export const styles = getStyles();
