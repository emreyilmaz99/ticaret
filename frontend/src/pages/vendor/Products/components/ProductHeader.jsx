// src/pages/vendor/Products/components/ProductHeader.jsx
import React from 'react';
import { FaBox, FaPlus } from 'react-icons/fa';
import { styles } from '../styles';

const ProductHeader = ({ onCreateClick }) => {
  return (
    <div style={styles.pageHeader}>
      <div style={styles.headerLeft}>
        <FaBox style={styles.headerIcon} />
        <div>
          <h1 style={styles.title}>Ürünlerim</h1>
          <p style={styles.subtitle}>Ürünlerinizi buradan yönetebilirsiniz</p>
        </div>
      </div>
      <button style={styles.addButton} onClick={onCreateClick}>
        <FaPlus style={styles.buttonIcon} />
        Yeni Ürün Ekle
      </button>
    </div>
  );
};

export default ProductHeader;
