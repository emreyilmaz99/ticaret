// Initial form state
export const INITIAL_FORM_STATE = {
  full_name: '',
  company_name: '',
  email: '',
  phone: '',
  tax_id: '',
  password: '',
  password_confirmation: ''
};

/**
 * Generates styles for the registration page
 * @param {boolean} isMobile - Whether the view is mobile
 */
export const getStyles = (isMobile = false) => ({
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0fdf4',
    fontFamily: '"Plus Jakarta Sans", sans-serif',
    padding: isMobile ? '16px 12px' : '20px'
  },
  card: {
    width: isMobile ? '100%' : '100%',
    maxWidth: isMobile ? '440px' : '600px',
    backgroundColor: 'white',
    borderRadius: isMobile ? '20px' : '24px',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    padding: isMobile ? '24px' : '48px',
    position: 'relative',
    overflow: 'hidden'
  },
  header: {
    textAlign: 'center',
    marginBottom: isMobile ? '24px' : '40px'
  },
  iconWrapper: {
    width: isMobile ? '56px' : '64px',
    height: isMobile ? '56px' : '64px',
    backgroundColor: '#d1fae5',
    color: '#047857',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: isMobile ? '20px' : '24px',
    margin: isMobile ? '0 auto 16px auto' : '0 auto 24px auto'
  },
  title: {
    fontFamily: '"Playfair Display", serif',
    fontSize: isMobile ? '24px' : '32px',
    fontWeight: '700',
    color: '#064e3b',
    marginBottom: '8px'
  },
  subtitle: {
    color: '#64748b',
    fontSize: isMobile ? '14px' : '16px',
    lineHeight: '1.5'
  },
  subtitleHighlight: {
    fontSize: '14px',
    color: '#059669',
    fontWeight: '600'
  },
  formGroup: {
    marginBottom: isMobile ? '16px' : '20px'
  },
  label: {
    display: 'block',
    fontSize: isMobile ? '13px' : '14px',
    fontWeight: '600',
    color: '#334155',
    marginBottom: isMobile ? '6px' : '8px'
  },
  labelOptional: {
    fontWeight: 400,
    color: '#94a3b8'
  },
  inputWrapper: {
    position: 'relative'
  },
  inputIcon: {
    position: 'absolute',
    left: isMobile ? '14px' : '16px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#94a3b8',
    fontSize: isMobile ? '14px' : '16px'
  },
  input: {
    width: '100%',
    padding: isMobile ? '12px 14px 12px 42px' : '14px 16px 14px 48px',
    borderRadius: isMobile ? '10px' : '12px',
    border: '1px solid #e2e8f0',
    fontSize: isMobile ? '14px' : '15px',
    color: '#1e293b',
    transition: 'all 0.2s',
    outline: 'none',
    backgroundColor: '#f8fafc'
  },
  inputFocus: {
    borderColor: '#059669',
    boxShadow: '0 0 0 4px rgba(5, 150, 105, 0.1)',
    backgroundColor: 'white'
  },
  buttonPrimary: {
    width: '100%',
    padding: isMobile ? '14px' : '16px',
    backgroundColor: '#047857',
    color: 'white',
    border: 'none',
    borderRadius: isMobile ? '10px' : '12px',
    fontSize: isMobile ? '14px' : '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px'
  },
  buttonSecondary: {
    padding: isMobile ? '14px 20px' : '16px 24px',
    backgroundColor: 'white',
    color: '#475569',
    border: '1px solid #e2e8f0',
    borderRadius: isMobile ? '10px' : '12px',
    fontSize: isMobile ? '14px' : '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  buttonDisabled: {
    opacity: 0.7,
    cursor: 'not-allowed'
  },
  stepIndicator: {
    display: 'flex',
    justifyContent: 'center',
    gap: '8px',
    marginBottom: isMobile ? '24px' : '32px'
  },
  termsBox: {
    marginBottom: '24px',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    padding: '16px',
    backgroundColor: '#f0fdf4',
    borderRadius: '12px',
    border: '1px solid #dcfce7'
  },
  termsCheckbox: {
    marginTop: '4px',
    width: '18px',
    height: '18px',
    accentColor: '#047857',
    cursor: 'pointer'
  },
  termsLabel: {
    fontSize: '14px',
    color: '#334155',
    lineHeight: '1.5',
    cursor: 'pointer'
  },
  termsLink: {
    fontWeight: '600',
    color: '#047857'
  },
  buttonRow: {
    display: 'flex',
    gap: '16px'
  },
  stepContent: {
    animation: 'fadeIn 0.5s ease'
  }
});

/**
 * Get step dot style
 */
export const getStepDotStyle = (isActive) => ({
  width: isActive ? '32px' : '10px',
  height: '10px',
  borderRadius: '5px',
  backgroundColor: isActive ? '#047857' : '#e2e8f0',
  transition: 'all 0.3s ease'
});

// Global CSS for animations
export const globalStyles = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

export const styles = getStyles(false);
