// Status configuration mapping
export const STATUS_CONFIGS = {
  pending_pre_approval: {
    iconType: 'clock',
    color: '#f59e0b',
    bgColor: '#fef3c7',
    border: '2px solid #fcd34d',
    title: 'Ön Başvurunuz İnceleniyor',
    description: 'Başvurunuz admin ekibimiz tarafından inceleniyor. En kısa sürede size dönüş yapacağız.',
    showAction: false,
  },
  pre_approved: {
    iconType: 'file',
    color: '#3b82f6',
    bgColor: '#dbeafe',
    border: '2px solid #93c5fd',
    title: 'Ön Başvurunuz Onaylandı! 🎉',
    description: 'Tebrikler! Ön başvurunuz onaylandı. Şimdi temel başvurunuzu tamamlayarak satışa başlayabilirsiniz.',
    showAction: true,
    actionText: 'Temel Başvuruyu Tamamla',
    actionPath: '/vendor/full-application',
  },
  pending_full_approval: {
    iconType: 'clock',
    color: '#8b5cf6',
    bgColor: '#ede9fe',
    border: '2px solid #c4b5fd',
    title: 'Temel Başvurunuz İnceleniyor',
    description: 'Temel başvurunuz ve ödeme bilgileriniz inceleniyor. Bu işlem genellikle 1-2 iş günü sürmektedir.',
    showAction: false,
  },
  active: {
    iconType: 'check',
    color: '#16a34a',
    bgColor: '#dcfce7',
    border: '2px solid #86efac',
    title: 'Hesabınız Aktif! 🎉',
    description: 'Tebrikler! Artık ürünlerinizi satışa sunabilir ve ödeme alabilirsiniz.',
    showAction: true,
    actionText: 'Panele Git',
    actionPath: '/vendor/dashboard',
  },
  suspended: {
    iconType: 'warning',
    color: '#f59e0b',
    bgColor: '#fef3c7',
    border: '2px solid #fcd34d',
    title: 'Hesabınız Askıya Alındı',
    description: 'Hesabınız geçici olarak askıya alınmıştır. Detaylar için destek ile iletişime geçin.',
    showAction: false,
  },
  banned: {
    iconType: 'times',
    color: '#ef4444',
    bgColor: '#fef2f2',
    border: '2px solid #fca5a5',
    title: 'Hesabınız Yasaklandı',
    description: 'Hesabınız platformdan yasaklanmıştır. İtiraz için destek ile iletişime geçebilirsiniz.',
    showAction: false,
  },
  default: {
    iconType: 'clock',
    color: '#64748b',
    bgColor: '#f1f5f9',
    border: '2px solid #cbd5e1',
    title: 'Durum Belirsiz',
    description: 'Hesabınızın durumu kontrol ediliyor.',
    showAction: false,
  }
};

/**
 * Get status configuration based on vendor status
 */
export const getStatusConfig = (vendorStatus) => {
  return STATUS_CONFIGS[vendorStatus] || STATUS_CONFIGS.default;
};

/**
 * Generates all styles for the status page
 */
export const getStyles = () => ({
  container: {
    minHeight: '100vh',
    backgroundColor: '#f0fdf4',
    backgroundImage: 'radial-gradient(#dcfce7 1px, transparent 1px)',
    backgroundSize: '24px 24px',
    padding: '40px 20px'
  },
  wrapper: {
    maxWidth: '600px',
    margin: '0 auto'
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '24px',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden'
  },
  header: {
    padding: '40px',
    textAlign: 'center'
  },
  headerIcon: {
    marginBottom: '16px'
  },
  headerTitle: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '12px'
  },
  headerDescription: {
    color: '#64748b',
    fontSize: '15px',
    lineHeight: '1.6',
    maxWidth: '400px',
    margin: '0 auto'
  },
  content: {
    padding: '32px'
  },
  rejectionBox: {
    backgroundColor: '#fef2f2',
    border: '1px solid #fecaca',
    borderRadius: '12px',
    padding: '16px',
    marginBottom: '24px',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px'
  },
  rejectionIcon: {
    marginTop: '2px',
    color: '#ef4444'
  },
  rejectionTitle: {
    fontWeight: '600',
    color: '#991b1b',
    marginBottom: '4px',
    fontSize: '14px'
  },
  rejectionText: {
    color: '#dc2626',
    fontSize: '13px'
  },
  statusList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  statusItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px',
    backgroundColor: '#f8fafc',
    borderRadius: '12px'
  },
  statusItemLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  statusItemIcon: {
    color: '#64748b'
  },
  statusItemText: {
    color: '#475569',
    fontWeight: '500'
  },
  statusBadge: {
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '13px',
    fontWeight: '600'
  },
  actionButton: {
    width: '100%',
    marginTop: '32px',
    backgroundColor: '#16a34a',
    color: 'white',
    padding: '16px',
    borderRadius: '12px',
    border: 'none',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    transition: 'all 0.2s',
    boxShadow: '0 4px 6px -1px rgba(22, 163, 74, 0.2)'
  },
  actionButtonHover: {
    backgroundColor: '#15803d'
  },
  helpText: {
    textAlign: 'center',
    marginTop: '24px',
    color: '#64748b',
    fontSize: '14px'
  },
  helpLink: {
    color: '#16a34a',
    fontWeight: '600'
  },
  loadingContainer: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0fdf4'
  },
  loadingContent: {
    textAlign: 'center'
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #dcfce7',
    borderTopColor: '#16a34a',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    margin: '0 auto 16px'
  },
  loadingText: {
    color: '#64748b'
  },
  errorContainer: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fef2f2'
  },
  errorContent: {
    textAlign: 'center',
    padding: '40px'
  },
  errorTitle: {
    color: '#991b1b',
    marginBottom: '8px'
  },
  errorText: {
    color: '#dc2626'
  }
});

export const styles = getStyles();

// Global CSS for animations
export const globalStyles = `
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;
