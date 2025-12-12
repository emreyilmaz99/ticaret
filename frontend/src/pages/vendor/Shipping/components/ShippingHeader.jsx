import React from 'react';
import { FaTruck } from 'react-icons/fa';
import { styles } from '../styles';

/**
 * Page header component
 */
const ShippingHeader = () => {
  return (
    <div style={styles.header}>
      <div>
        <h1 style={styles.title}>
          <FaTruck style={styles.titleIcon} /> Kargo Ayarları
        </h1>
        <p style={styles.subtitle}>
          Müşterilerinize uygulayacağınız kargo ücretlerini ve ücretsiz kargo limitini belirleyin
        </p>
      </div>
    </div>
  );
};

export default ShippingHeader;
