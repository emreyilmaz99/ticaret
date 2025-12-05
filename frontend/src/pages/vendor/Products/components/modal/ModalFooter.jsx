// src/pages/vendor/Products/components/modal/ModalFooter.jsx
import React from 'react';
import { FaSave, FaTimes } from 'react-icons/fa';
import { styles } from '../../styles';

const ModalFooter = ({ mode, onClose, onSubmit, isSubmitting }) => {
  if (mode === 'view') {
    return (
      <div style={styles.modalFooter}>
        <button 
          type="button" 
          style={styles.cancelBtn}
          onClick={onClose}
        >
          Kapat
        </button>
      </div>
    );
  }

  return (
    <div style={styles.modalFooter}>
      <button 
        type="button" 
        style={styles.cancelBtn}
        onClick={onClose}
        disabled={isSubmitting}
      >
        <FaTimes style={{ marginRight: 6 }} />
        İptal
      </button>
      <button 
        type="submit" 
        style={styles.submitBtn}
        onClick={onSubmit}
        disabled={isSubmitting}
      >
        <FaSave style={{ marginRight: 6 }} />
        {isSubmitting ? 'Kaydediliyor...' : (mode === 'create' ? 'Ürün Ekle' : 'Güncelle')}
      </button>
    </div>
  );
};

export default ModalFooter;
