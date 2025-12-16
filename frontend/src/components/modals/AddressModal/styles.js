// src/components/modals/AddressModal/styles.js
export const styles = {
  scrollContainer: {
    maxHeight: '70vh',
    overflowY: 'auto',
    padding: '20px',
  },
  
  addressList: {
    display: 'grid',
    gap: '12px',
    marginBottom: '24px',
  },
  
  addressCard: (isSelected) => ({
    padding: '16px',
    border: `2px solid ${isSelected ? '#4CAF50' : '#e0e0e0'}`,
    borderRadius: '8px',
    backgroundColor: isSelected ? '#f1f8f4' : '#fff',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  }),
  
  addressCardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '8px',
  },
  
  addressLabel: {
    fontWeight: '600',
    fontSize: '14px',
    color: '#333',
  },
  
  addressName: {
    color: '#666',
    fontSize: '13px',
    marginBottom: '4px',
  },
  
  addressText: {
    color: '#888',
    fontSize: '12px',
    lineHeight: '1.6',
  },
  
  deleteButton: {
    background: 'none',
    border: 'none',
    color: '#f44336',
    cursor: 'pointer',
    padding: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  formSection: {
    marginBottom: '16px',
  },
  
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '16px',
  },
  
  errorBox: {
    backgroundColor: '#ffebee',
    border: '1px solid #f44336',
    borderRadius: '4px',
    padding: '12px',
    marginBottom: '16px',
  },
  
  errorList: {
    margin: 0,
    paddingLeft: '20px',
    color: '#d32f2f',
    fontSize: '14px',
  },
  
  buttonGroup: {
    display: 'flex',
    gap: '12px',
    marginTop: '20px',
  },
  
  actionButton: (variant = 'primary') => ({
    flex: 1,
    padding: '12px 24px',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    backgroundColor: variant === 'primary' ? '#4CAF50' : '#f5f5f5',
    color: variant === 'primary' ? '#fff' : '#666',
  }),
};
