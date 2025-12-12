/**
 * Generates all styles for the shipping settings page
 */
export const getStyles = () => ({
  container: {
    fontFamily: "'Inter', sans-serif",
    color: '#1e293b',
    padding: '24px'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '24px',
    background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
    padding: '28px 32px',
    borderRadius: '16px',
    border: '1px solid #e2e8f0',
    flexWrap: 'wrap',
    gap: '16px'
  },
  title: {
    fontSize: '26px',
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: '-0.02em',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    margin: 0
  },
  titleIcon: {
    color: '#059669',
    fontSize: '28px'
  },
  subtitle: {
    color: '#64748b',
    fontSize: '15px',
    margin: '6px 0 0 0'
  },
  infoCard: {
    backgroundColor: '#f0fdf4',
    border: '1px solid #bbf7d0',
    borderRadius: '16px',
    padding: '20px 24px',
    marginBottom: '24px',
    display: 'flex',
    gap: '16px',
    alignItems: 'flex-start'
  },
  infoIcon: {
    color: '#16a34a',
    fontSize: '20px',
    marginTop: '2px',
    flexShrink: 0
  },
  infoTitle: {
    fontWeight: '600',
    color: '#15803d',
    marginBottom: '4px',
    fontSize: '14px'
  },
  infoText: {
    color: '#166534',
    fontSize: '13px',
    lineHeight: '1.6',
    margin: 0
  },
  mainCard: {
    backgroundColor: 'white',
    padding: '32px',
    borderRadius: '24px',
    border: '1px solid #f1f5f9',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.02)',
    marginBottom: '24px'
  },
  toggleSection: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '20px 24px',
    borderRadius: '16px',
    marginBottom: '32px',
    transition: 'all 0.3s'
  },
  toggleSectionEnabled: {
    backgroundColor: '#f0fdf4',
    border: '1px solid #bbf7d0'
  },
  toggleSectionDisabled: {
    backgroundColor: '#f8fafc',
    border: '1px solid #e2e8f0'
  },
  toggleIconWrapper: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  toggleIconWrapperEnabled: {
    backgroundColor: '#dcfce7'
  },
  toggleIconWrapperDisabled: {
    backgroundColor: '#f1f5f9'
  },
  toggleIcon: {
    fontSize: '20px'
  },
  toggleIconEnabled: {
    color: '#16a34a'
  },
  toggleIconDisabled: {
    color: '#94a3b8'
  },
  toggleTitle: {
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: '2px',
    fontSize: '15px'
  },
  toggleSubtitle: {
    color: '#64748b',
    fontSize: '13px',
    margin: 0
  },
  toggleButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '44px',
    display: 'flex',
    alignItems: 'center',
    transition: 'color 0.2s'
  },
  toggleButtonEnabled: {
    color: '#16a34a'
  },
  toggleButtonDisabled: {
    color: '#cbd5e1'
  },
  formFieldsContainer: {
    transition: 'opacity 0.3s'
  },
  formFieldsEnabled: {
    opacity: 1,
    pointerEvents: 'auto'
  },
  formFieldsDisabled: {
    opacity: 0.5,
    pointerEvents: 'none'
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '24px',
    marginBottom: '32px'
  },
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: '8px'
  },
  labelIcon: {
    marginRight: '8px',
    color: '#64748b'
  },
  inputWrapper: {
    position: 'relative'
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    paddingRight: '50px',
    borderRadius: '10px',
    border: '1px solid #e2e8f0',
    outline: 'none',
    fontSize: '14px',
    transition: 'all 0.2s',
    boxSizing: 'border-box'
  },
  inputSuffix: {
    position: 'absolute',
    right: '16px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#64748b',
    fontWeight: '600',
    fontSize: '14px'
  },
  inputHint: {
    fontSize: '12px',
    color: '#94a3b8',
    marginTop: '6px'
  },
  previewCard: {
    backgroundColor: '#f8fafc',
    borderRadius: '16px',
    padding: '24px',
    border: '1px solid #e2e8f0'
  },
  previewTitle: {
    fontWeight: '600',
    color: '#475569',
    marginBottom: '16px',
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  previewIcon: {
    color: '#14532d'
  },
  previewList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  previewRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 16px',
    borderRadius: '10px'
  },
  previewRowDefault: {
    backgroundColor: 'white',
    border: '1px solid #e2e8f0'
  },
  previewRowFree: {
    backgroundColor: '#f0fdf4',
    border: '1px solid #bbf7d0'
  },
  previewLabel: {
    color: '#64748b',
    fontSize: '14px'
  },
  previewValue: {
    fontWeight: '700',
    fontSize: '15px'
  },
  previewValuePaid: {
    color: '#0f172a'
  },
  previewValueFree: {
    color: '#16a34a'
  },
  actionButtons: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  resetButton: {
    padding: '12px 20px',
    backgroundColor: 'white',
    border: '1px solid #e2e8f0',
    borderRadius: '10px',
    fontWeight: '600',
    color: '#64748b',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'all 0.2s'
  },
  saveButton: {
    padding: '12px 32px',
    background: 'linear-gradient(135deg, #14532d 0%, #166534 100%)',
    border: 'none',
    borderRadius: '10px',
    fontWeight: '600',
    color: 'white',
    cursor: 'pointer',
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    boxShadow: '0 4px 12px rgba(20, 83, 45, 0.3)',
    transition: 'all 0.2s'
  },
  saveButtonDisabled: {
    cursor: 'not-allowed',
    opacity: 0.7
  },
  loadingContainer: {
    padding: 24,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 400
  },
  loadingSpinner: {
    fontSize: 32,
    color: '#64748b',
    animation: 'spin 1s linear infinite'
  },
  buttonIcon: {
    marginRight: '4px'
  }
});

export const styles = getStyles();

// CSS for animations
export const globalStyles = `
  @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  .spin { animation: spin 1s linear infinite; }
  input:focus { border-color: #14532d !important; box-shadow: 0 0 0 3px rgba(20, 83, 45, 0.1); }
`;
