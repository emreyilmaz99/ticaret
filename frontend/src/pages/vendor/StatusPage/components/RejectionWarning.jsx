import React from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';
import { styles } from '../styles';

/**
 * Rejection warning box
 */
const RejectionWarning = ({ reason }) => {
  return (
    <div style={styles.rejectionBox}>
      <FaExclamationTriangle style={styles.rejectionIcon} />
      <div>
        <p style={styles.rejectionTitle}>Önceki Başvurunuz Reddedildi</p>
        <p style={styles.rejectionText}>{reason}</p>
      </div>
    </div>
  );
};

export default RejectionWarning;
