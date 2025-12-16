import React from 'react';
import PropTypes from 'prop-types';

/**
 * FinanceHeader Component - Sayfa başlığı ve açıklama
 */
const FinanceHeader = ({ styles }) => {
  return (
    <div style={styles.header}>
      <div>
        <h1 style={styles.headerTitle}>Finans & Ödemeler</h1>
        <p style={styles.headerSubtitle}>
          Kazançlarınızı ve ödeme geçmişinizi buradan takip edin
        </p>
      </div>
    </div>
  );
};

FinanceHeader.propTypes = {
  styles: PropTypes.object.isRequired,
};

export default FinanceHeader;
