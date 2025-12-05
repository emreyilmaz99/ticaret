// src/pages/admin/Products/ProductStats.jsx
import React from 'react';

/**
 * Ürün istatistik kartları
 */
const ProductStats = ({ stats, currentFilter, onFilterChange, styles }) => {
  const statItems = [
    { key: 'all', value: stats.total || 0, label: 'Toplam Ürün', color: '#4f46e5' },
    { key: 'pending', value: stats.pending || 0, label: 'Onay Bekleyen', color: '#b45309' },
    { key: 'active', value: stats.active || 0, label: 'Yayında', color: '#047857' },
    { key: 'rejected', value: stats.rejected || 0, label: 'Reddedilen', color: '#dc2626' },
    { key: 'draft', value: stats.draft || 0, label: 'Taslak', color: '#475569' }
  ];

  return (
    <div style={styles.statsRow}>
      {statItems.map(item => (
        <div 
          key={item.key}
          style={styles.statCard(currentFilter === item.key)} 
          onClick={() => onFilterChange(item.key)}
        >
          <div style={{ ...styles.statValue, color: item.color }}>{item.value}</div>
          <div style={styles.statLabel}>{item.label}</div>
        </div>
      ))}
    </div>
  );
};

export default ProductStats;
