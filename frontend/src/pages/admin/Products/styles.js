// src/pages/admin/Products/styles.js
import apiClient from '@lib/apiClient';

/**
 * Products sayfası için merkezi stil tanımlamaları
 */
export const getStyles = (isMobile = false) => ({
  // Container
  container: { 
    padding: isMobile ? '16px' : '32px', 
    fontFamily: "'Inter', sans-serif",
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
    letterSpacing: '-0.02em',
    margin: 0
  },
  subtitle: { 
    color: 'rgb(100, 116, 139)', 
    fontSize: '15px',
    margin: '6px 0 0 0',
  },

  // Stats
  statsRow: { 
    display: 'grid', 
    gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(5, 1fr)', 
    gap: '16px', 
    marginBottom: '24px' 
  },
  statCard: (active) => ({ 
    padding: '20px', 
    borderRadius: '12px', 
    backgroundColor: 'white', 
    border: active ? '2px solid #4f46e5' : '1px solid #e2e8f0',
    cursor: 'pointer', 
    transition: 'all 0.2s'
  }),
  statValue: { fontSize: isMobile ? '24px' : '28px', fontWeight: '700', color: '#0f172a' },
  statLabel: { fontSize: '13px', color: '#64748b', marginTop: '4px' },

  // Filter Bar
  filterBar: { 
    display: 'flex', 
    gap: '16px', 
    alignItems: 'center', 
    marginBottom: '24px', 
    padding: '16px', 
    backgroundColor: 'white', 
    borderRadius: '12px', 
    border: '1px solid #e2e8f0',
    flexWrap: 'wrap'
  },
  searchInput: { 
    flex: 1, 
    padding: '10px 16px 10px 40px', 
    borderRadius: '8px', 
    border: '1px solid #e2e8f0', 
    outline: 'none', 
    fontSize: '14px',
    minWidth: '200px'
  },

  // Table
  table: { 
    width: '100%', 
    borderCollapse: 'collapse', 
    backgroundColor: 'white', 
    borderRadius: '12px', 
    overflow: 'hidden', 
    border: '1px solid #e2e8f0' 
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
    color: '#334155', 
    fontSize: '14px' 
  },

  // Buttons
  btn: (variant) => ({
    padding: '6px 12px', 
    borderRadius: '6px', 
    border: 'none', 
    cursor: 'pointer', 
    fontSize: '13px', 
    fontWeight: '500',
    backgroundColor: variant === 'success' ? '#d1fae5' : 
                    variant === 'danger' ? '#fee2e2' : 
                    variant === 'primary' ? '#4f46e5' : '#f1f5f9',
    color: variant === 'success' ? '#047857' : 
           variant === 'danger' ? '#dc2626' : 
           variant === 'primary' ? 'white' : '#475569',
    transition: 'opacity 0.2s'
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
    padding: '20px'
  },
  modalContent: { 
    backgroundColor: 'white', 
    borderRadius: '16px', 
    maxWidth: '800px', 
    width: '90%', 
    maxHeight: '90vh', 
    overflow: 'auto' 
  },
  modalHeader: { 
    padding: '20px 24px', 
    borderBottom: '1px solid #e2e8f0', 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    backgroundColor: '#f8fafc' 
  },
  modalBody: { 
    padding: '24px', 
    maxHeight: '70vh', 
    overflowY: 'auto' 
  },
  modalFooter: { 
    padding: '20px 24px', 
    borderTop: '1px solid #e2e8f0', 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    backgroundColor: '#f8fafc' 
  },

  // Product Thumbnail
  thumbnail: {
    width: '48px', 
    height: '48px', 
    borderRadius: '8px', 
    backgroundColor: '#f1f5f9', 
    overflow: 'hidden', 
    flexShrink: 0,
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center'
  },

  // Info boxes for product detail
  infoBox: (bgColor) => ({
    padding: '14px', 
    backgroundColor: bgColor, 
    borderRadius: '10px', 
    textAlign: 'center'
  }),
  infoLabel: (color) => ({
    fontSize: '11px', 
    color: color, 
    fontWeight: '600', 
    marginBottom: '4px'
  }),
  infoValue: (color) => ({
    fontSize: '18px', 
    fontWeight: '700', 
    color: color
  }),

  // Lightbox
  lightbox: {
    position: 'fixed', 
    inset: 0, 
    backgroundColor: 'rgba(0,0,0,0.9)', 
    zIndex: 2000,
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    padding: '40px'
  }
});

// Backend URL helper
const backendOrigin = (apiClient.defaults.baseURL || '').replace(/\/api\/?$/i, '');

export const toFullUrl = (u) => {
  if (!u) return null;
  if (u.startsWith('http')) return u;
  return `${backendOrigin}${u.startsWith('/') ? '' : '/'}${u}`;
};

// Status config helper
export const getStatusConfig = () => ({
  pending: { bg: '#fef3c7', color: '#b45309', label: 'Onay Bekliyor' },
  active: { bg: '#d1fae5', color: '#047857', label: 'Yayında' },
  rejected: { bg: '#fee2e2', color: '#dc2626', label: 'Reddedildi' },
  draft: { bg: '#f1f5f9', color: '#475569', label: 'Taslak' },
  inactive: { bg: '#e2e8f0', color: '#64748b', label: 'Pasif' },
  banned: { bg: '#fecaca', color: '#991b1b', label: 'Yasaklı' }
});
