// src/pages/admin/Categories/CategoryStats.jsx
import React from 'react';
import { FaLayerGroup, FaCheck, FaFolder, FaFolderOpen } from 'react-icons/fa';

/**
 * Kategori istatistik kartları bileşeni
 */
const CategoryStats = ({ stats, styles }) => {
  const statItems = [
    {
      icon: FaLayerGroup,
      iconColor: '#059669',
      bgColor: '#d1fae5',
      value: stats.total || 0,
      label: 'Toplam Kategori'
    },
    {
      icon: FaCheck,
      iconColor: '#16a34a',
      bgColor: '#dcfce7',
      value: stats.active || 0,
      label: 'Aktif Kategori'
    },
    {
      icon: FaFolder,
      iconColor: '#d97706',
      bgColor: '#fef3c7',
      value: stats.root_categories || 0,
      label: 'Ana Kategori'
    },
    {
      icon: FaFolderOpen,
      iconColor: '#0284c7',
      bgColor: '#e0f2fe',
      value: stats.sub_categories || 0,
      label: 'Alt Kategori'
    }
  ];

  return (
    <div style={styles.statsGrid}>
      {statItems.map((item, index) => (
        <div key={index} style={styles.statCard}>
          <div style={styles.flexCenter}>
            <div style={styles.statIcon(item.bgColor)}>
              <item.icon size={24} color={item.iconColor} />
            </div>
            <div>
              <div style={styles.statValue}>{item.value}</div>
              <div style={styles.statLabel}>{item.label}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CategoryStats;
