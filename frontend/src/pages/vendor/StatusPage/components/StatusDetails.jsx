import React from 'react';
import { FaStore, FaCreditCard } from 'react-icons/fa';
import { styles } from '../styles';

/**
 * Status details list
 */
const StatusDetails = ({ status, config }) => {
  return (
    <div style={styles.statusList}>
      {/* Vendor Status */}
      <div style={styles.statusItem}>
        <div style={styles.statusItemLabel}>
          <FaStore style={styles.statusItemIcon} />
          <span style={styles.statusItemText}>Hesap Durumu</span>
        </div>
        <span style={{
          ...styles.statusBadge,
          backgroundColor: config.bgColor,
          color: config.color
        }}>
          {status.vendor_status_label}
        </span>
      </div>

      {/* iyzico Status */}
      <div style={styles.statusItem}>
        <div style={styles.statusItemLabel}>
          <FaCreditCard style={styles.statusItemIcon} />
          <span style={styles.statusItemText}>Ödeme Durumu</span>
        </div>
        <span style={{
          ...styles.statusBadge,
          backgroundColor: status.iyzico_status === 'active' ? '#dcfce7' : '#f1f5f9',
          color: status.iyzico_status === 'active' ? '#16a34a' : '#64748b'
        }}>
          {status.iyzico_status_label}
        </span>
      </div>
    </div>
  );
};

export default StatusDetails;
