// src/pages/vendor/Products/styles.js

export const styles = {
  container: { 
    padding: '24px', 
    fontFamily: "'Inter', sans-serif", 
    color: '#1e293b' 
  },
  header: { 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: '32px' 
  },
  title: { 
    fontSize: '24px', 
    fontWeight: '800', 
    color: '#0f172a', 
    letterSpacing: '-0.5px' 
  },
  subtitle: { 
    color: '#64748b', 
    fontSize: '14px', 
    marginTop: '4px' 
  },
  
  // Buttons
  btnPrimary: { 
    backgroundColor: '#059669', 
    color: 'white', 
    border: 'none', 
    padding: '10px 20px', 
    borderRadius: '8px', 
    fontWeight: '600', 
    display: 'flex', 
    alignItems: 'center', 
    gap: '8px', 
    cursor: 'pointer', 
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)' 
  },
  btnSecondary: { 
    padding: '0 20px', 
    backgroundColor: 'white', 
    border: '1px solid #e2e8f0', 
    borderRadius: '8px', 
    color: '#475569', 
    fontWeight: '600', 
    display: 'flex', 
    alignItems: 'center', 
    gap: '8px', 
    cursor: 'pointer' 
  },
  
  // Filter & Search
  filterContainer: { 
    backgroundColor: 'white', 
    padding: '16px', 
    borderRadius: '12px', 
    marginBottom: '24px', 
    display: 'flex', 
    gap: '16px', 
    border: '1px solid #e2e8f0', 
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)' 
  },
  inputWrapper: { 
    flex: 1, 
    position: 'relative' 
  },
  inputIcon: { 
    position: 'absolute', 
    left: '16px', 
    top: '50%', 
    transform: 'translateY(-50%)', 
    color: '#94a3b8' 
  },
  input: { 
    width: '100%', 
    padding: '10px 10px 10px 40px', 
    borderRadius: '8px', 
    border: '1px solid #e2e8f0', 
    outline: 'none', 
    fontSize: '14px' 
  },
  
  // Table
  tableContainer: { 
    backgroundColor: 'white', 
    borderRadius: '12px', 
    border: '1px solid #e2e8f0', 
    overflow: 'hidden', 
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.02)' 
  },
  table: { 
    width: '100%', 
    borderCollapse: 'collapse' 
  },
  th: { 
    padding: '16px', 
    textAlign: 'left', 
    fontSize: '12px', 
    fontWeight: '600', 
    color: '#64748b', 
    textTransform: 'uppercase', 
    backgroundColor: '#f8fafc', 
    borderBottom: '1px solid #e2e8f0' 
  },
  td: { 
    padding: '16px', 
    borderBottom: '1px solid #f1f5f9', 
    color: '#334155' 
  },
  
  // Modal
  modalOverlay: { 
    position: 'fixed', 
    inset: 0, 
    backgroundColor: 'rgba(0,0,0,0.5)', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    zIndex: 1200, 
    backdropFilter: 'blur(4px)' 
  },
  modalContent: { 
    backgroundColor: 'white', 
    width: '100%', 
    maxWidth: '900px', 
    borderRadius: '16px', 
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', 
    display: 'flex', 
    flexDirection: 'column', 
    maxHeight: '90vh' 
  },
  modalHeader: { 
    padding: '20px 24px', 
    borderBottom: '1px solid #f1f5f9', 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center' 
  },
  modalTitle: { 
    fontSize: '18px', 
    fontWeight: '700', 
    color: '#0f172a' 
  },
  modalBody: { 
    flex: 1, 
    overflow: 'hidden', 
    display: 'flex' 
  },
  modalFooter: { 
    padding: '20px 24px', 
    borderTop: '1px solid #f1f5f9', 
    display: 'flex', 
    justifyContent: 'flex-end', 
    gap: '12px', 
    backgroundColor: '#f8fafc', 
    borderBottomLeftRadius: '16px', 
    borderBottomRightRadius: '16px' 
  },
  
  // Sidebar
  sidebar: { 
    width: '240px', 
    backgroundColor: '#f8fafc', 
    borderRight: '1px solid #f1f5f9', 
    padding: '16px', 
    display: 'flex', 
    flexDirection: 'column', 
    gap: '8px', 
    overflowY: 'auto' 
  },
  tabBtn: (active) => ({
    display: 'flex', 
    alignItems: 'center', 
    gap: '12px', 
    padding: '12px 16px', 
    borderRadius: '8px', 
    fontSize: '14px', 
    fontWeight: '500', 
    cursor: 'pointer',
    backgroundColor: active ? 'white' : 'transparent',
    color: active ? '#059669' : '#64748b',
    boxShadow: active ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
    border: active ? '1px solid #e2e8f0' : '1px solid transparent',
    width: '100%', 
    textAlign: 'left'
  }),
  contentArea: { 
    flex: 1, 
    padding: '32px', 
    overflowY: 'auto' 
  },
  
  // Form
  formGroup: { 
    marginBottom: '20px' 
  },
  label: { 
    display: 'block', 
    fontSize: '14px', 
    fontWeight: '500', 
    color: '#334155', 
    marginBottom: '8px' 
  },
  formInput: { 
    width: '100%', 
    padding: '10px 12px', 
    borderRadius: '8px', 
    border: '1px solid #e2e8f0', 
    outline: 'none', 
    fontSize: '14px', 
    transition: 'border-color 0.2s' 
  },
  
  // Grid layouts
  grid2: { 
    display: 'grid', 
    gridTemplateColumns: '1fr 1fr', 
    gap: '20px' 
  },
  grid4: { 
    display: 'grid', 
    gridTemplateColumns: 'repeat(4, 1fr)', 
    gap: '16px' 
  },
  
  // Cards & Badges
  variantCard: { 
    padding: '16px', 
    border: '1px solid #e2e8f0', 
    borderRadius: '8px', 
    backgroundColor: '#f8fafc', 
    position: 'relative', 
    marginBottom: '12px' 
  },
  uploadBox: { 
    border: '2px dashed #cbd5e1', 
    borderRadius: '12px', 
    padding: '32px', 
    textAlign: 'center', 
    cursor: 'pointer', 
    position: 'relative', 
    backgroundColor: '#f8fafc' 
  },
  statBadge: { 
    display: 'flex', 
    alignItems: 'center', 
    gap: '8px', 
    padding: '8px 16px', 
    borderRadius: '20px', 
    fontSize: '13px', 
    fontWeight: '600' 
  },
  
  // Grid Card
  gridCard: { 
    backgroundColor: 'white', 
    borderRadius: '12px', 
    border: '1px solid #e2e8f0', 
    overflow: 'hidden', 
    transition: 'transform 0.2s, box-shadow 0.2s', 
    display: 'flex', 
    flexDirection: 'column' 
  },
  gridCardImg: { 
    width: '100%', 
    aspectRatio: '1/1', 
    objectFit: 'cover', 
    backgroundColor: '#f1f5f9' 
  },
  gridCardBody: { 
    padding: '16px', 
    flex: 1, 
    display: 'flex', 
    flexDirection: 'column' 
  },
  
  // Status Badge
  statusBadge: (status) => ({
    padding: '4px 10px', 
    borderRadius: '20px', 
    fontSize: '12px', 
    fontWeight: '600',
    backgroundColor: 
      status === 'active' ? '#d1fae5' : 
      status === 'pending' ? '#fef3c7' : 
      status === 'rejected' ? '#fee2e2' : 
      status === 'inactive' ? '#e2e8f0' : 
      status === 'banned' ? '#fecaca' : '#f1f5f9',
    color: 
      status === 'active' ? '#047857' : 
      status === 'pending' ? '#b45309' : 
      status === 'rejected' ? '#dc2626' : 
      status === 'inactive' ? '#64748b' : 
      status === 'banned' ? '#991b1b' : '#475569'
  }),
};

export const getStatusLabel = (status) => {
  const labels = {
    active: 'Yayında',
    pending: 'Onay Bekliyor',
    rejected: 'Reddedildi',
    inactive: 'Pasif',
    banned: 'Yasaklı',
    draft: 'Taslak'
  };
  return labels[status] || 'Taslak';
};
