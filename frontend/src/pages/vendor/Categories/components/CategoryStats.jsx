import React from 'react';
import { FaFolderOpen, FaCheckCircle, FaLayerGroup } from 'react-icons/fa';
import { styles } from '../styles';

/**
 * Statistics cards for category overview
 * Shows total, selected, and expanded counts
 */
const CategoryStats = ({ stats }) => {
  const cards = [
    {
      icon: FaFolderOpen,
      label: 'Toplam Kategori',
      value: stats.totalCategories,
      color: '#3b82f6'
    },
    {
      icon: FaCheckCircle,
      label: 'Seçili Kategori',
      value: stats.selectedCount,
      color: '#10b981'
    },
    {
      icon: FaLayerGroup,
      label: 'Açık Kategori',
      value: stats.expandedCount,
      color: '#8b5cf6'
    }
  ];

  return (
    <div style={styles.statsContainer}>
      {cards.map((card, index) => {
        const IconComponent = card.icon;
        return (
          <div key={index} style={styles.statCard}>
            <div style={{ ...styles.statIcon, backgroundColor: `${card.color}20` }}>
              <IconComponent style={{ color: card.color, fontSize: '1.25rem' }} />
            </div>
            <div style={styles.statInfo}>
              <span style={styles.statValue}>{card.value}</span>
              <span style={styles.statLabel}>{card.label}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CategoryStats;
