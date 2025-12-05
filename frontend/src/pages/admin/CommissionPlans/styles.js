// src/pages/admin/CommissionPlans/styles.js

/**
 * Commission Plans sayfası için merkezi stil tanımlamaları
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
  
  // Create Button
  createBtn: {
    padding: '10px 20px',
    background: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '500',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'background 0.2s',
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
