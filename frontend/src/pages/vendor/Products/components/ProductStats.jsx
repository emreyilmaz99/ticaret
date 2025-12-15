// src/pages/vendor/Products/components/ProductStats.jsx
import React from 'react';
import { styles } from '../styles';

const ProductStats = ({ products = [], statusFilter, setStatusFilter }) => {
  const activeCount = products.filter(p => p.status === 'active').length;
  const draftCount = products.filter(p => p.status === 'draft').length;
  const totalStock = products.reduce((sum, p) => sum + (p.stock || 0), 0);

  const handleStatClick = (filter) => {
    setStatusFilter(statusFilter === filter ? 'all' : filter);
  };

  const getStatCardStyle = (filter) => ({
    ...styles.statCard,
    cursor: 'pointer',
    transition: 'all 0.2s',
    transform: statusFilter === filter ? 'translateY(-4px)' : 'none',
    boxShadow: statusFilter === filter 
      ? '0 4px 12px rgba(5, 150, 105, 0.2)' 
      : '0 1px 2px rgba(0,0,0,0.05)',
    borderColor: statusFilter === filter ? '#059669' : '#e2e8f0',
    borderWidth: statusFilter === filter ? '2px' : '1px'
  });

  return (
    <div style={styles.statsBar}>
      <div 
        style={getStatCardStyle('all')} 
        onClick={() => handleStatClick('all')}
        title="Tüm ürünleri göster"
      >
        <span style={styles.statValue}>{products.length}</span>
        <span style={styles.statLabel}>Toplam Ürün</span>
      </div>
      <div 
        style={getStatCardStyle('active')} 
        onClick={() => handleStatClick('active')}
        title="Sadece aktif ürünleri göster"
      >
        <span style={{ ...styles.statValue, color: '#27ae60' }}>{activeCount}</span>
        <span style={styles.statLabel}>Aktif</span>
      </div>
      <div 
        style={getStatCardStyle('draft')} 
        onClick={() => handleStatClick('draft')}
        title="Sadece taslak ürünleri göster"
      >
        <span style={{ ...styles.statValue, color: '#f39c12' }}>{draftCount}</span>
        <span style={styles.statLabel}>Taslak</span>
      </div>
      <div style={{ ...styles.statCard, opacity: 0.7 }}>
        <span style={styles.statValue}>{totalStock}</span>
        <span style={styles.statLabel}>Toplam Stok</span>
      </div>
    </div>
  );
};

export default ProductStats;
