import React from 'react';
import { FaTimesCircle } from 'react-icons/fa';
import { styles } from '../styles';

/**
 * Loading state component
 */
export const LoadingState = () => (
  <div style={styles.loadingContainer}>
    <div style={styles.loadingContent}>
      <div style={styles.spinner} />
      <p style={styles.loadingText}>Yükleniyor...</p>
    </div>
  </div>
);

/**
 * Error state component
 */
export const ErrorState = ({ error }) => (
  <div style={styles.errorContainer}>
    <div style={styles.errorContent}>
      <FaTimesCircle size={48} color="#ef4444" style={{ marginBottom: '16px' }} />
      <h2 style={styles.errorTitle}>Hata</h2>
      <p style={styles.errorText}>{error.message}</p>
    </div>
  </div>
);

export default { LoadingState, ErrorState };
