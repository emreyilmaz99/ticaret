// src/components/modals/QuickViewModal/styles.js
export const styles = {
  content: {
    display: 'flex',
    gap: '30px',
    padding: '20px',
    maxHeight: '70vh',
    overflow: 'auto',
  },

  imageSection: {
    flex: '0 0 400px',
  },

  imageContainer: {
    position: 'relative',
    width: '100%',
    paddingBottom: '100%',
    backgroundColor: '#f5f5f5',
    borderRadius: '8px',
    overflow: 'hidden',
  },

  image: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'contain',
  },

  infoSection: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },

  title: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#333',
    marginBottom: '8px',
  },

  priceSection: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '12px',
  },

  price: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#4CAF50',
  },

  oldPrice: {
    fontSize: '20px',
    color: '#999',
    textDecoration: 'line-through',
  },

  discount: {
    backgroundColor: '#f44336',
    color: '#fff',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '14px',
    fontWeight: '600',
  },

  description: {
    color: '#666',
    lineHeight: '1.6',
    fontSize: '14px',
  },

  specs: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },

  specRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '10px',
    backgroundColor: '#f9f9f9',
    borderRadius: '6px',
  },

  specLabel: {
    fontSize: '14px',
    color: '#666',
    fontWeight: '500',
    minWidth: '100px',
  },

  specValue: {
    fontSize: '14px',
    color: '#333',
    fontWeight: '600',
  },

  quantitySection: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },

  quantityLabel: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#333',
  },

  quantityControl: {
    display: 'flex',
    alignItems: 'center',
    border: '1px solid #ddd',
    borderRadius: '6px',
    overflow: 'hidden',
  },

  quantityButton: {
    width: '36px',
    height: '36px',
    border: 'none',
    backgroundColor: '#f5f5f5',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.2s ease',
  },

  quantityInput: {
    width: '60px',
    height: '36px',
    border: 'none',
    textAlign: 'center',
    fontSize: '14px',
    fontWeight: '600',
  },

  actions: {
    display: 'flex',
    gap: '12px',
    marginTop: 'auto',
  },

  button: (variant = 'primary') => ({
    flex: 1,
    padding: '14px 24px',
    border: 'none',
    borderRadius: '6px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    backgroundColor: variant === 'primary' ? '#4CAF50' : variant === 'secondary' ? '#2196F3' : '#f5f5f5',
    color: variant === 'outline' ? '#666' : '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
  }),

  '@media (max-width: 768px)': {
    content: {
      flexDirection: 'column',
      gap: '20px',
    },
    imageSection: {
      flex: '1',
    },
  },
};
