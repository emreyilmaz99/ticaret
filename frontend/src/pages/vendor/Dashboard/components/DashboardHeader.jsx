import React from 'react';
import { FaBell, FaCalendarAlt } from 'react-icons/fa';
import { styles } from '../styles';

/**
 * Dashboard header with title and action buttons
 */
const DashboardHeader = () => {
  return (
    <div style={styles.header}>
      <div>
        <h1 style={styles.title}>Mağaza Paneli</h1>
        <p style={styles.subtitle}>
          Hoşgeldiniz, mağazanızın performans özeti burada.
        </p>
      </div>
      <div style={styles.headerActions}>
        {/* Date Filter */}
        <div style={styles.dateFilter}>
          <FaCalendarAlt /> Bu Hafta
        </div>

        {/* Notification Bell */}
        <div style={styles.notificationButton}>
          <FaBell />
          <div style={styles.notificationDot}></div>
        </div>

        <button style={styles.addButton}>
          Yeni Ürün Ekle
        </button>
      </div>
    </div>
  );
};

export default DashboardHeader;
