// src/pages/vendor/Products/components/ProductStats.jsx
import React from 'react';
import { styles } from '../styles';

const ProductStats = ({ products = [] }) => {
  const activeCount = products.filter(p => p.status === 'active').length;
  const draftCount = products.filter(p => p.status === 'draft').length;
  const totalStock = products.reduce((sum, p) => sum + (p.stock || 0), 0);

  return (
    <div style={styles.statsBar}>
      <div style={styles.statCard}>
        <span style={styles.statValue}>{products.length}</span>
        <span style={styles.statLabel}>Toplam Ürün</span>
      </div>
      <div style={styles.statCard}>
        <span style={{ ...styles.statValue, color: '#27ae60' }}>{activeCount}</span>
        <span style={styles.statLabel}>Aktif</span>
      </div>
      <div style={styles.statCard}>
        <span style={{ ...styles.statValue, color: '#f39c12' }}>{draftCount}</span>
        <span style={styles.statLabel}>Taslak</span>
      </div>
      <div style={styles.statCard}>
        <span style={styles.statValue}>{totalStock}</span>
        <span style={styles.statLabel}>Toplam Stok</span>
      </div>
    </div>
  );
};

export default ProductStats;
