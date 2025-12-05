// src/pages/admin/Applications/styles.js

/**
 * Application sayfaları için merkezi stil tanımlamaları
 */
export const getStyles = (isMobile = false) => ({
  // Container
  container: {
    padding: isMobile ? '16px' : '24px',
    fontFamily: "'Inter', sans-serif",
    color: '#1e293b',
  },
  
  // Header
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
    flexWrap: 'wrap',
    gap: '16px'
  },
  title: {
    fontSize: isMobile ? '20px' : '24px',
    fontWeight: '700',
    color: '#0f172a',
    margin: 0,
  },
  subtitle: {
    color: '#64748b',
    marginTop: '4px',
    fontSize: '14px',
  },
  
  // Search & Filter
  searchContainer: {
    position: 'relative',
  },
  searchInput: {
    padding: '10px 16px 10px 40px',
    border: '1px solid #cbd5e1',
    borderRadius: '8px',
    fontSize: '14px',
    width: isMobile ? '100%' : '280px',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  searchIcon: {
    position: 'absolute',
    left: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#94a3b8',
  },
  filterBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
    backgroundColor: 'white',
    padding: '12px',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    flexWrap: 'wrap',
    gap: '16px',
  },
  filterTabs: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
  },
  filterTab: {
    padding: '8px 16px',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
    border: 'none',
    backgroundColor: 'transparent',
    color: '#64748b',
    transition: 'all 0.2s',
  },
  activeFilterTab: {
    backgroundColor: '#6366f1',
    color: 'white',
  },
  
  // Table
  tableContainer: {
    background: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)',
    overflow: 'hidden',
    border: '1px solid #e2e8f0',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left',
  },
  th: {
    background: '#f8fafc',
    padding: '16px',
    fontSize: '12px',
    fontWeight: '600',
    textTransform: 'uppercase',
    color: '#64748b',
    borderBottom: '1px solid #e2e8f0',
  },
  td: {
    padding: '16px',
    borderBottom: '1px solid #f1f5f9',
    fontSize: '14px',
    color: '#334155',
  },
  row: {
    transition: 'background-color 0.2s',
  },
  avatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: '#eff6ff',
    color: '#3b82f6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: '16px',
    marginRight: '12px',
  },
  flexCenter: {
    display: 'flex',
    alignItems: 'center',
  },
  
  // Action buttons
  actionBtn: {
    padding: '8px',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    marginLeft: '8px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background 0.2s',
  },
  btnView: { background: '#eff6ff', color: '#3b82f6' },
  btnApprove: { background: '#f0fdf4', color: '#16a34a' },
  btnReject: { background: '#fef2f2', color: '#ef4444' },
  
  // Modal
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '20px',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: '16px',
    width: '100%',
    maxWidth: '900px',
    maxHeight: '90vh',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
  },
  modalHeader: {
    padding: '24px',
    borderBottom: '1px solid #e2e8f0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    background: '#f8fafc',
  },
  modalBody: {
    padding: '24px',
    overflowY: 'auto',
    flex: 1,
  },
  modalFooter: {
    padding: '16px 24px',
    borderTop: '1px solid #e2e8f0',
    background: '#f8fafc',
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
  },
  
  // Tabs
  tabContainer: {
    display: 'flex',
    borderBottom: '1px solid #e2e8f0',
    padding: '0 24px',
  },
  tab: {
    padding: '16px 20px',
    background: 'none',
    border: 'none',
    borderBottom: '2px solid transparent',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    color: '#64748b',
    transition: 'all 0.2s',
  },
  activeTab: {
    color: '#2563eb',
    borderBottom: '2px solid #2563eb',
  },
  
  // Section
  sectionTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  infoBox: {
    background: '#f8fafc',
    padding: '16px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
  },
  infoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '8px',
    fontSize: '14px',
  },
  label: { color: '#64748b' },
  value: { fontWeight: '500', color: '#334155' },
  grid2: {
    display: 'grid',
    gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
    gap: '24px',
  },
  
  // Buttons
  primaryBtn: {
    padding: '10px 20px',
    background: '#16a34a',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '500',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  dangerBtn: {
    padding: '10px 20px',
    background: 'white',
    color: '#ef4444',
    border: '1px solid #fecaca',
    borderRadius: '8px',
    fontWeight: '500',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  cancelBtn: {
    padding: '10px 20px',
    background: 'white',
    color: '#64748b',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    fontWeight: '500',
    cursor: 'pointer',
  },
  
  // Empty & Loading
  emptyState: {
    padding: '32px',
    textAlign: 'center',
    color: '#94a3b8'
  },
  loadingState: {
    padding: '24px'
  },
  
  // Status badges
  badge: {
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
  },
  badgePending: { background: '#fef3c7', color: '#b45309' },
  badgeApproved: { background: '#dcfce7', color: '#166534' },
  badgeRejected: { background: '#fee2e2', color: '#991b1b' },
});

// Default export for components using named import { styles }
export const styles = getStyles();
