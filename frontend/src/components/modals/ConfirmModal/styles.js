// src/components/modals/ConfirmModal/styles.js
export const getConfirmModalStyles = (color) => ({
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10000,
    backdropFilter: 'blur(4px)',
    animation: 'modalFadeIn 0.2s ease',
  },
  
  modal: {
    backgroundColor: 'white',
    borderRadius: '20px',
    width: '90%',
    maxWidth: '400px',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    overflow: 'hidden',
    animation: 'modalSlideUp 0.3s ease',
  },
  
  header: {
    display: 'flex',
    justifyContent: 'flex-end',
    padding: '12px 16px 0',
  },
  
  closeBtn: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    border: 'none',
    backgroundColor: '#f1f5f9',
    color: '#64748b',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s',
  },
  
  closeBtnHover: {
    backgroundColor: '#e2e8f0',
    transform: 'scale(1.05)',
  },
  
  content: {
    padding: '0 32px 32px',
    textAlign: 'center',
  },
  
  iconWrapper: {
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    backgroundColor: color.iconBg,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 20px',
  },
  
  title: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '12px',
  },
  
  message: {
    fontSize: '15px',
    color: '#64748b',
    lineHeight: '1.6',
    marginBottom: '28px',
  },
  
  buttons: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'center',
  },
  
  cancelBtn: {
    flex: 1,
    padding: '14px 24px',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    backgroundColor: 'white',
    color: '#475569',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  
  cancelBtnHover: {
    backgroundColor: '#f8fafc',
  },
  
  confirmBtn: (isLoading) => ({
    flex: 1,
    padding: '14px 24px',
    borderRadius: '12px',
    border: 'none',
    backgroundColor: color.button,
    color: 'white',
    fontSize: '15px',
    fontWeight: '600',
    cursor: isLoading ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    opacity: isLoading ? 0.7 : 1,
  }),
  
  confirmBtnHover: {
    backgroundColor: color.buttonHover,
    transform: 'translateY(-1px)',
  },
  
  spinner: {
    width: '16px',
    height: '16px',
    border: '2px solid rgba(255,255,255,0.3)',
    borderTopColor: 'white',
    borderRadius: '50%',
    animation: 'modalSpin 0.8s linear infinite',
  },
});
