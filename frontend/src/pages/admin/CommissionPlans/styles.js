// src/pages/admin/CommissionPlans/styles.js

/**
 * Commission Plans sayfası için merkezi stil tanımlamaları
 */
export const getStyles = (isMobile = false) => ({
  // Container
  container: {
    padding: isMobile ? '16px' : '32px',
    fontFamily: "'Inter', sans-serif",
    color: '#1e293b',
    backgroundColor: '#F3F4F6',
    minHeight: '100vh',
  },
  
  // Header - Siparişler sayfasındaki gibi
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '32px',
    background: 'linear-gradient(135deg, rgb(248, 250, 252) 0%, rgb(241, 245, 249) 100%)',
    padding: isMobile ? '20px 24px' : '28px 32px',
    borderRadius: '16px',
    border: '1px solid rgb(226, 232, 240)',
    flexWrap: 'wrap',
    gap: '24px'
  },
  title: {
    fontSize: '26px',
    fontWeight: '800',
    color: 'rgb(15, 23, 42)',
    margin: 0,
    letterSpacing: '-0.02em',
  },
  subtitle: {
    color: 'rgb(100, 116, 139)',
    margin: '6px 0 0 0',
    fontSize: '15px',
  },
  
  // Create Button
  createBtn: {
    padding: '12px 24px',
    background: '#059669',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontWeight: '600',
    fontSize: '14px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 12px rgba(5, 150, 105, 0.25)',
    fontFamily: '"Inter", sans-serif',
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
  
  // Action Buttons
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
  btnEdit: { background: '#eff6ff', color: '#3b82f6' },
  btnDelete: { background: '#fef2f2', color: '#ef4444' },
  btnDefault: { background: '#fff7ed', color: '#f97316' },
  btnDefaultDisabled: { background: '#f1f5f9', color: '#cbd5e1', cursor: 'not-allowed' },
  btnToggleOn: { background: '#f0fdf4', color: '#16a34a' },
  btnToggleOff: { background: '#fef2f2', color: '#94a3b8' },
  
  // Modal Styles
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
    maxWidth: '500px',
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
    alignItems: 'center',
    background: '#f8fafc',
  },
  modalBody: {
    padding: '24px',
  },
  modalFooter: {
    padding: '16px 24px',
    borderTop: '1px solid #e2e8f0',
    background: '#f8fafc',
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
  },
  
  // Form
  formGroup: {
    marginBottom: '16px',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: '500',
    color: '#334155',
    fontSize: '14px',
  },
  input: {
    width: '100%',
    padding: '10px',
    border: '1px solid #cbd5e1',
    borderRadius: '8px',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box', 
  },
  textarea: {
    width: '100%',
    padding: '10px',
    border: '1px solid #cbd5e1',
    borderRadius: '8px',
    fontSize: '14px',
    outline: 'none',
    minHeight: '80px',
    resize: 'vertical',
    boxSizing: 'border-box',
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
  },
  cancelBtn: {
    padding: '10px 20px',
    background: 'white',
    color: '#64748b',
    border: '1px solid #cbd5e1',
    borderRadius: '8px',
    fontWeight: '500',
    cursor: 'pointer',
  },
  
  // Badges
  badge: {
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: '600',
    display: 'inline-block',
  },
  badgeActive: { background: '#dcfce7', color: '#166534' },
  badgeInactive: { background: '#f1f5f9', color: '#64748b' },
  badgeDefault: { background: '#ffedd5', color: '#9a3412', marginLeft: '8px' },
  
  // Empty & Loading
  emptyState: {
    padding: '32px',
    textAlign: 'center',
    color: '#94a3b8'
  },
  loadingState: {
    padding: '24px',
    textAlign: 'center',
    color: '#64748b'
  },
  errorState: {
    padding: '24px',
    color: 'red'
  }
});
