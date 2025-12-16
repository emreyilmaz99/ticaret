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
    marginBottom: '32px',
    flexWrap: 'wrap',
    gap: '16px',
    background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
    padding: isMobile ? '20px 24px' : '28px 32px',
    borderRadius: '16px',
    border: '1px solid #e2e8f0'
  },
  title: {
    fontSize: '26px',
    fontWeight: '800',
    color: '#0f172a',
    margin: 0,
    letterSpacing: '-0.02em'
  },
  subtitle: {
    color: '#64748b',
    marginTop: '6px',
    fontSize: '15px',
    fontWeight: '400'
  },
  headerActions: {
    display: 'flex',
    gap: '12px',
  },
  exportBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 16px',
    backgroundColor: 'rgb(255, 255, 255)',
    border: '1px solid rgb(229, 231, 235)',
    borderRadius: '10px',
    color: 'rgb(17, 24, 39)',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
    boxShadow: 'rgba(0, 0, 0, 0.05) 0px 1px 2px 0px',
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
    backgroundColor: '#f0fdf4',
    color: '#059669',
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
  btnView: { background: '#f0fdf4', color: '#059669' },
  btnApprove: { background: '#dcfce7', color: '#16a34a' },
  btnReject: { background: '#f3f4f6', color: '#6b7280' },
  
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
    color: '#059669',
    borderBottom: '2px solid #059669',
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
    color: '#6b7280',
    border: '1px solid #e5e7eb',
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
  emptyIcon: {
    fontSize: '48px',
    marginBottom: '16px',
  },
  loadingState: {
    padding: '24px'
  },
  
  // Table Row (function for hover state)
  tableRow: (isHovered) => ({
    backgroundColor: isHovered ? '#f8fafc' : 'transparent',
    transition: 'background-color 0.2s',
  }),
  
  // Store Icon
  storeIcon: {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    backgroundColor: '#ecfdf5',
    color: '#059669',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Status badges
  badge: {
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
  },
  badgePending: { background: '#f0fdf4', color: '#065f46' },
  badgeApproved: { background: '#dcfce7', color: '#047857' },
  badgeRejected: { background: '#f3f4f6', color: '#374151' },
  
  // Detail Grid (for PreApplicationDetailModal)
  detailGrid: {
    display: 'grid',
    gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
    gap: '16px',
  },
  
  // VendorDetailModal specific styles
  vendorModal: {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px',
      animation: 'fadeIn 0.2s ease',
    },
    content: {
      background: 'white',
      borderRadius: '20px',
      maxWidth: '900px',
      width: '100%',
      maxHeight: '90vh',
      overflow: 'hidden',
      boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
      animation: 'slideUp 0.3s ease',
      display: 'flex',
      flexDirection: 'column',
    },
    header: {
      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      padding: '28px 32px',
      borderTopLeftRadius: '20px',
      borderTopRightRadius: '20px',
      position: 'relative',
      overflow: 'hidden',
    },
    headerPattern: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'radial-gradient(circle at 30% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)',
      pointerEvents: 'none',
    },
    headerContent: {
      position: 'relative',
      zIndex: 1,
    },
    companyIcon: {
      width: '52px',
      height: '52px',
      borderRadius: '14px',
      background: 'rgba(255, 255, 255, 0.25)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '22px',
      border: '2px solid rgba(255, 255, 255, 0.3)',
      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
    },
    companyName: {
      fontSize: '26px',
      fontWeight: '800',
      color: 'white',
      margin: 0,
      textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      letterSpacing: '-0.5px',
    },
    closeButton: {
      background: 'rgba(255, 255, 255, 0.2)',
      border: '2px solid rgba(255, 255, 255, 0.3)',
      borderRadius: '12px',
      width: '44px',
      height: '44px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      transition: 'all 0.2s',
      backdropFilter: 'blur(10px)',
    },
    tabNav: {
      display: 'flex',
      gap: '10px',
      padding: '0 32px',
      background: '#f9fafb',
      borderBottom: '2px solid #e5e7eb',
    },
    tabButton: (isActive) => ({
      flex: 1,
      padding: '16px 24px',
      background: isActive ? 'white' : 'transparent',
      border: 'none',
      borderBottom: isActive ? '3px solid #10b981' : '3px solid transparent',
      color: isActive ? '#10b981' : '#6b7280',
      fontSize: '15px',
      fontWeight: isActive ? '700' : '600',
      cursor: 'pointer',
      transition: 'all 0.2s',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px',
    }),
    bodyContent: {
      padding: '32px',
      overflowY: 'auto',
      flex: 1,
    },
    footer: {
      padding: '24px 32px',
      background: '#f9fafb',
      borderTop: '2px solid #e5e7eb',
      display: 'flex',
      gap: '12px',
      justifyContent: 'flex-end',
      borderBottomLeftRadius: '20px',
      borderBottomRightRadius: '20px',
    },
    footerButton: (variant = 'default') => {
      const variants = {
        default: {
          padding: '12px 32px',
          background: 'white',
          border: '2px solid #d1d5db',
          borderRadius: '10px',
          fontSize: '15px',
          fontWeight: '600',
          color: '#4b5563',
          cursor: 'pointer',
          transition: 'all 0.2s',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        },
        reject: {
          padding: '12px 32px',
          background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
          border: 'none',
          borderRadius: '10px',
          fontSize: '15px',
          fontWeight: '700',
          color: 'white',
          cursor: 'pointer',
          transition: 'all 0.2s',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)',
        },
        approve: {
          padding: '12px 32px',
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          border: 'none',
          borderRadius: '10px',
          fontSize: '15px',
          fontWeight: '700',
          color: 'white',
          cursor: 'pointer',
          transition: 'all 0.2s',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
        },
      };
      return variants[variant] || variants.default;
    },
  },
});

// CSS Keyframes for animations
export const modalAnimations = `
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes fadeInContent {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

// Default export for components using named import { styles }
export const styles = getStyles();
