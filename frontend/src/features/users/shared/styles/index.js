// src/features/users/shared/styles/index.js

export const styles = {
  // Container & Cards
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  
  card: {
    backgroundColor: 'var(--bg-card, white)',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
  },
  
  headerCard: {
    padding: '20px 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '16px',
  },

  // Search
  searchWrapper: {
    position: 'relative',
    flex: '1',
    maxWidth: '400px',
    minWidth: '250px',
  },
  
  searchInput: {
    width: '100%',
    padding: '10px 12px 10px 40px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    outline: 'none',
    fontSize: '14px',
  },
  
  searchIcon: {
    position: 'absolute',
    left: '14px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#94a3b8',
  },

  // Buttons
  btn: {
    padding: '10px 16px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    backgroundColor: 'white',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#475569',
    transition: 'all 0.2s',
  },
  
  btnPrimary: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
    color: 'white',
  },
  
  btnDanger: {
    backgroundColor: '#ef4444',
    borderColor: '#ef4444',
    color: 'white',
  },

  // Filter Panel
  filterPanel: {
    padding: '16px 24px',
    borderTop: '1px solid #e2e8f0',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '16px',
    alignItems: 'end',
  },
  
  filterGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  
  filterLabel: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#64748b',
    textTransform: 'uppercase',
  },
  
  filterSelect: {
    padding: '8px 12px',
    borderRadius: '6px',
    border: '1px solid #e2e8f0',
    outline: 'none',
    fontSize: '14px',
  },

  // Table
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  
  th: {
    padding: '14px 20px',
    textAlign: 'left',
    fontSize: '12px',
    fontWeight: '600',
    color: '#64748b',
    textTransform: 'uppercase',
    backgroundColor: '#f8fafc',
    borderBottom: '1px solid #e2e8f0',
    cursor: 'pointer',
    userSelect: 'none',
  },
  
  td: {
    padding: '16px 20px',
    borderBottom: '1px solid #f1f5f9',
    color: '#334155',
    fontSize: '14px',
  },

  // Avatar
  avatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: '#e0e7ff',
    color: '#4338ca',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px',
    flexShrink: 0,
    overflow: 'hidden',
  },

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

  // Action Buttons
  actionBtn: (color) => ({
    padding: '8px',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:
      color === 'blue' ? '#eff6ff' :
      color === 'red' ? '#fef2f2' :
      color === 'green' ? '#ecfdf5' : '#f1f5f9',
    color:
      color === 'blue' ? '#2563eb' :
      color === 'red' ? '#dc2626' :
      color === 'green' ? '#059669' : '#64748b',
    transition: 'all 0.2s',
  }),

  // Modal
  modalOverlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    backdropFilter: 'blur(4px)',
  },
  
  modalContent: {
    backgroundColor: 'white',
    borderRadius: '16px',
    width: '100%',
    maxWidth: '600px',
    maxHeight: '90vh',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
  
  modalHeader: {
    padding: '20px 24px',
    borderBottom: '1px solid #e2e8f0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  modalBody: {
    padding: '24px',
    overflowY: 'auto',
    flex: 1,
  },
  
  modalFooter: {
    padding: '16px 24px',
    borderTop: '1px solid #e2e8f0',
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    backgroundColor: '#f8fafc',
  },

  // Info Display
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
  },
  
  infoItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  
  infoLabel: {
    fontSize: '12px',
    color: '#64748b',
    fontWeight: '600',
    textTransform: 'uppercase',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  
  infoValue: {
    fontSize: '15px',
    color: '#0f172a',
    fontWeight: '500',
  },

  // Form
  formGroup: {
    marginBottom: '16px',
  },
  
  formLabel: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '500',
    color: '#334155',
    marginBottom: '6px',
  },
  
  formInput: {
    width: '100%',
    padding: '10px 12px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    outline: 'none',
    fontSize: '14px',
  },

  // Stats
  stats: {
    display: 'flex',
    gap: '24px',
    alignItems: 'center',
    color: '#64748b',
    fontSize: '14px',
  },
};
