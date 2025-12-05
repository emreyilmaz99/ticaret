// src/pages/vendor/Products/components/modal/ModalHeader.jsx
import React from 'react';
import { FaTimes } from 'react-icons/fa';
import { styles } from '../../styles';

const ModalHeader = ({ mode, onClose }) => {
  const getTitle = () => {
    switch (mode) {
      case 'create': return 'Yeni Ürün Ekle';
      case 'edit': return 'Ürün Düzenle';
      case 'view': return 'Ürün Detayları';
      default: return 'Ürün';
    }
  };

  return (
    <div style={styles.modalHeader}>
      <h2 style={styles.modalTitle}>{getTitle()}</h2>
      <button style={styles.modalCloseBtn} onClick={onClose}>
        <FaTimes />
      </button>
    </div>
  );
};

export default ModalHeader;
