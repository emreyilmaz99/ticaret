import React from 'react';
import { FaBell, FaCalendarAlt, FaPlus } from 'react-icons/fa';
import { useOutletContext } from 'react-router-dom';
import { styles } from '../styles';

/**
 * Dashboard header with title and action buttons
 */
const DashboardHeader = () => {
  const { isMobile } = useOutletContext() || {};

  // On mobile, the title is in the top navbar, so we can hide it or simplify it
  if (isMobile) {
    return (
      <div style={{ ...styles.header, marginBottom: '24px', flexDirection: 'column', alignItems: 'stretch', gap: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p style={{ ...styles.subtitle, margin: 0 }}>
            Hoşgeldiniz, mağazanızın performans özeti.
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={{ ...styles.dateFilter, flex: 1, justifyContent: 'center' }}>
            <FaCalendarAlt /> Bu Hafta
          </div>
          <button style={{ ...styles.addButton, flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <FaPlus /> Yeni Ürün
          </button>
        </div>
      </div>
    );
  }

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
