// Satıcı türleri
export const MERCHANT_TYPES = {
  personal: { 
    value: 'personal', 
    label: 'Bireysel Satıcı', 
    description: 'Şahıs olarak satış yapacaksınız',
    icon: '👤'
  },
  private_company: { 
    value: 'private_company', 
    label: 'Şahıs Şirketi', 
    description: 'Şahıs şirketi olarak satış yapacaksınız',
    icon: '🏪'
  },
  limited_company: { 
    value: 'limited_company', 
    label: 'Limited / Anonim Şirket', 
    description: 'Tüzel kişilik olarak satış yapacaksınız',
    icon: '🏢'
  }
};

// Initial form state
export const INITIAL_FORM_STATE = {
  full_name: '',
  company_name: '',
  slug: '',
  phone: '',
  // iyzico SubMerchant fields
  merchant_type: '',
  identity_number: '',
  contact_name: '',
  contact_surname: '',
  tax_id: '',
  tax_office: '',
  legal_company_title: '',
  // Address fields
  address: '',
  city: '',
  district: '',
  postal_code: '',
  // Bank account fields
  bank_name: '',
  account_holder: '',
  iban: ''
};

/**
 * Generates all styles for the full application page
 */
export const getStyles = () => ({
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0fdf4',
    fontFamily: '"Plus Jakarta Sans", sans-serif',
    padding: '20px'
  },
  card: {
    width: '100%',
    maxWidth: '600px',
    backgroundColor: 'white',
    borderRadius: '24px',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    padding: '48px',
    position: 'relative',
    overflow: 'hidden'
  },
  cardWide: {
    maxWidth: '700px'
  },
  header: {
    textAlign: 'center',
    marginBottom: '40px'
  },
  iconWrapper: {
    width: '64px',
    height: '64px',
    backgroundColor: '#d1fae5',
    color: '#047857',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
    margin: '0 auto 24px auto'
  },
  iconWrapperError: {
    backgroundColor: '#fee2e2',
    color: '#dc2626'
  },
  iconWrapperWarning: {
    backgroundColor: '#fef3c7',
    color: '#d97706'
  },
  title: {
    fontFamily: '"Playfair Display", serif',
    fontSize: '32px',
    fontWeight: '700',
    color: '#064e3b',
    marginBottom: '8px'
  },
  titleError: {
    color: '#dc2626'
  },
  titleWarning: {
    color: '#d97706'
  },
  subtitle: {
    color: '#64748b',
    fontSize: '16px',
    lineHeight: '1.5'
  },
  backButton: {
    position: 'absolute',
    top: '24px',
    left: '24px',
    background: 'none',
    border: 'none',
    color: '#64748b',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px'
  },
  formGroup: {
    marginBottom: '20px'
  },
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '600',
    color: '#334155',
    marginBottom: '8px'
  },
  inputWrapper: {
    position: 'relative'
  },
  inputIcon: {
    position: 'absolute',
    left: '16px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#94a3b8',
    fontSize: '16px'
  },
  input: {
    width: '100%',
    padding: '14px 16px 14px 48px',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    fontSize: '15px',
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
  inputHint: {
    color: '#64748b',
    fontSize: '12px',
    marginTop: '4px',
    display: 'block'
  },
  gridTwo: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px'
  },
  gridThree: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '12px',
    marginBottom: '24px'
  },
  sectionTitle: {
    textAlign: 'left',
    marginTop: '32px',
    marginBottom: '16px',
    fontWeight: '600',
    color: '#047857'
  },
  merchantTypeCard: {
    padding: '16px',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    textAlign: 'center'
  },
  merchantTypeCardActive: {
    border: '2px solid #047857',
    backgroundColor: '#f0fdf4'
  },
  merchantTypeCardInactive: {
    border: '1px solid #e2e8f0',
    backgroundColor: '#f8fafc'
  },
  merchantTypeIcon: {
    fontSize: '24px',
    marginBottom: '8px'
  },
  merchantTypeLabel: {
    fontWeight: '600',
    color: '#1e293b',
    fontSize: '14px'
  },
  merchantTypeDesc: {
    fontSize: '11px',
    color: '#64748b',
    marginTop: '4px'
  },
  warningBox: {
    marginTop: '24px',
    marginBottom: '16px',
    padding: '16px',
    backgroundColor: '#fffbeb',
    borderRadius: '12px',
    border: '1px solid #fde68a'
  },
  warningText: {
    fontSize: '14px',
    color: '#92400e',
    lineHeight: '1.6'
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
  buttonPrimary: {
    width: '100%',
    padding: '16px',
    backgroundColor: '#047857',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px'
  },
  buttonCentered: {
    marginTop: '24px',
    maxWidth: '200px',
    margin: '24px auto 0'
  }
});

export const styles = getStyles();
