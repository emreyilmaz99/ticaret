import React from 'react';
import { FaBars, FaBell, FaStore } from 'react-icons/fa';

const VendorMobileHeader = ({ onMenuClick, onNotificationClick, title }) => {
  const styles = {
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '16px',
      backgroundColor: 'white',
      borderBottom: '1px solid #e2e8f0',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      height: '60px'
    },
    left: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    },
    menuBtn: {
      background: 'none',
      border: 'none',
      fontSize: '20px',
      color: '#64748b',
      cursor: 'pointer',
      padding: '4px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    title: {
      fontSize: '16px',
      fontWeight: '700',
      color: '#0f172a',
      margin: 0
    },
    right: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    },
    iconBtn: {
      background: 'none',
      border: 'none',
      fontSize: '18px',
      color: '#64748b',
      cursor: 'pointer',
      position: 'relative'
    },
    badge: {
      position: 'absolute',
      top: '-2px',
      right: '-2px',
      width: '8px',
      height: '8px',
      backgroundColor: '#ef4444',
      borderRadius: '50%',
      border: '1px solid white'
    }
  };

  return (
    <div style={styles.header}>
      <div style={styles.left}>
        <button onClick={onMenuClick} style={styles.menuBtn}>
          <FaBars />
        </button>
        <h1 style={styles.title}>{title || 'Mağaza Paneli'}</h1>
      </div>
      
      <div style={styles.right}>
        <button style={styles.iconBtn} onClick={onNotificationClick}>
          <FaBell />
          <span style={styles.badge} />
        </button>
      </div>
    </div>
  );
};

export default VendorMobileHeader;
