// src/pages/public/Auth/styles.js

/**
 * Shared styles for Login and Register pages
 */
export const getStyles = (isMobile) => ({
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
    fontFamily: '"Inter", sans-serif',
    padding: isMobile ? '16px' : '20px',
    position: 'relative',
    overflow: 'hidden',
  },
  backgroundShape1: {
    position: 'absolute',
    top: '-10%',
    right: '-5%',
    width: isMobile ? '300px' : '500px',
    height: isMobile ? '300px' : '500px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, rgba(5, 150, 105, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%)',
    zIndex: 0,
  },
  backgroundShape2: {
    position: 'absolute',
    bottom: '-10%',
    left: '-5%',
    width: isMobile ? '250px' : '400px',
    height: isMobile ? '250px' : '400px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, rgba(5, 150, 105, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%)',
    zIndex: 0,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(20px)',
    borderRadius: isMobile ? '24px' : '32px',
    boxShadow: '0 20px 50px -10px rgba(0, 0, 0, 0.1)',
    width: isMobile ? '95%' : '100%',
    maxWidth: isMobile ? '400px' : '480px',
    padding: isMobile ? '24px' : '48px',
    position: 'relative',
    zIndex: 1,
    border: '1px solid rgba(255, 255, 255, 0.5)',
  },
  header: {
    textAlign: 'center',
    marginBottom: isMobile ? '20px' : '32px',
  },
  title: {
    fontFamily: '"DM Sans", sans-serif',
    fontSize: isMobile ? '24px' : '32px',
    fontWeight: '800',
    color: '#064e3b',
    marginBottom: isMobile ? '8px' : '12px',
    letterSpacing: '-1px',
  },
  subtitle: {
    color: '#64748b',
    fontSize: isMobile ? '13px' : '15px',
    lineHeight: '1.5',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: isMobile ? '16px' : '20px',
  },
  inputGroup: {
    position: 'relative',
  },
  inputIcon: {
    position: 'absolute',
    left: isMobile ? '16px' : '20px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#94a3b8',
    fontSize: isMobile ? '16px' : '18px',
    transition: 'color 0.3s',
  },
  input: {
    width: '100%',
    padding: isMobile ? '14px 16px 14px 44px' : '16px 20px 16px 52px',
    borderRadius: isMobile ? '12px' : '16px',
    border: '1px solid #e2e8f0',
    backgroundColor: '#f8fafc',
    fontSize: isMobile ? '14px' : '15px',
    color: '#1e293b',
    outline: 'none',
    transition: 'all 0.3s ease',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
  },
  passwordToggle: {
    position: 'absolute',
    right: isMobile ? '16px' : '20px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#94a3b8',
    cursor: 'pointer',
    background: 'none',
    border: 'none',
    fontSize: isMobile ? '16px' : '18px',
  },
  optionsRow: {
    display: 'flex',
    flexDirection: isMobile ? 'column' : 'row',
    justifyContent: 'space-between',
    alignItems: isMobile ? 'flex-start' : 'center',
    fontSize: isMobile ? '13px' : '14px',
    gap: isMobile ? '12px' : '0',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: '#64748b',
    cursor: 'pointer',
    userSelect: 'none',
  },
  checkbox: {
    width: '18px',
    height: '18px',
    borderRadius: '4px',
    accentColor: '#059669',
    cursor: 'pointer',
  },
  forgotLink: {
    color: '#059669',
    textDecoration: 'none',
    fontWeight: '600',
    transition: 'color 0.2s',
  },
  submitBtn: {
    backgroundColor: '#059669',
    color: 'white',
    border: 'none',
    padding: isMobile ? '14px' : '18px',
    borderRadius: isMobile ? '12px' : '16px',
    fontSize: isMobile ? '14px' : '16px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    boxShadow: '0 10px 20px -5px rgba(5, 150, 105, 0.3)',
    marginTop: '10px',
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    margin: isMobile ? '16px 0' : '24px 0',
    color: '#94a3b8',
    fontSize: isMobile ? '12px' : '14px',
  },
  dividerLine: {
    flex: 1,
    height: '1px',
    backgroundColor: '#e2e8f0',
  },
  dividerText: {
    padding: isMobile ? '0 12px' : '0 16px',
  },
  socialButtons: {
    display: 'grid',
    gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
    gap: isMobile ? '12px' : '16px',
  },
  socialBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: isMobile ? '8px' : '10px',
    padding: isMobile ? '12px' : '14px',
    borderRadius: isMobile ? '12px' : '16px',
    border: '1px solid #e2e8f0',
    backgroundColor: 'white',
    color: '#475569',
    fontSize: isMobile ? '13px' : '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  footer: {
    textAlign: 'center',
    marginTop: isMobile ? '16px' : '24px',
    fontSize: isMobile ? '13px' : '15px',
    color: '#64748b',
  },
  footerLink: {
    color: '#059669',
    fontWeight: '700',
    textDecoration: 'none',
    marginLeft: '5px',
  },
});

/**
 * Input focus/blur handlers
 */
export const inputFocusStyle = {
  borderColor: '#059669',
  backgroundColor: 'white',
};

export const inputBlurStyle = {
  borderColor: '#e2e8f0',
  backgroundColor: '#f8fafc',
};

export const iconFocusColor = '#059669';
export const iconBlurColor = '#94a3b8';
