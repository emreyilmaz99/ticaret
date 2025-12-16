/**
 * Vendor Onboarding Styles
 */

export const getStyles = () => ({
  // Container
  container: {
    padding: '24px',
    maxWidth: '900px',
    margin: '24px auto',
    fontFamily: "'Inter', sans-serif",
  },

  // Header
  header: {
    fontSize: '28px',
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: '8px',
  },
  stepIndicator: {
    fontSize: '16px',
    color: '#64748b',
    marginBottom: '24px',
  },

  // Form Section
  formSection: {
    marginTop: '16px',
    backgroundColor: 'white',
    padding: '32px',
    borderRadius: '16px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '24px',
  },

  // Form Fields
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '600',
    color: '#334155',
    marginBottom: '8px',
    marginTop: '16px',
  },
  input: {
    width: '100%',
    padding: '12px',
    border: '2px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '15px',
    outline: 'none',
    marginTop: '8px',
    transition: 'all 0.2s',
  },
  select: {
    width: '100%',
    padding: '12px',
    border: '2px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '15px',
    outline: 'none',
    marginTop: '8px',
    backgroundColor: 'white',
    cursor: 'pointer',
  },
  textarea: {
    width: '100%',
    padding: '12px',
    border: '2px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '15px',
    outline: 'none',
    marginTop: '8px',
    minHeight: '100px',
    resize: 'vertical',
  },
  fileInput: {
    marginTop: '8px',
    fontSize: '14px',
  },

  // Buttons
  buttonGroup: {
    marginTop: '24px',
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
  },
  primaryButton: {
    padding: '12px 24px',
    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
    boxShadow: '0 4px 6px rgba(16, 185, 129, 0.2)',
  },
  secondaryButton: {
    padding: '12px 24px',
    backgroundColor: '#f1f5f9',
    color: '#475569',
    border: 'none',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },

  // Loading
  loadingText: {
    padding: '24px',
    textAlign: 'center',
    fontSize: '16px',
    color: '#64748b',
  },
});

export default getStyles;
