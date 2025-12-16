import React from 'react';
import PropTypes from 'prop-types';
import { FaHistory, FaCreditCard, FaArrowUp } from 'react-icons/fa';

/**
 * SecondaryStatsCards Component - İkincil istatistik kartları
 */
const SecondaryStatsCards = ({ walletData, styles }) => {
  return (
    <>
      {/* Bekleyen Ödeme */}
      <div style={styles.statCard}>
        <div style={styles.statIconBox('#fef3c7', '#d97706')}>
          <FaHistory size={20} />
        </div>
        <p style={styles.statLabel}>Bekleyen Ödeme</p>
        <h3 style={styles.statValue}>{walletData.pendingAmount}</h3>
        <p style={styles.statDescription}>{walletData.pendingDate}</p>
      </div>

      {/* Toplam Ödenen */}
      <div style={styles.statCard}>
        <div style={styles.statIconBox('#dbeafe', '#2563eb')}>
          <FaCreditCard size={20} />
        </div>
        <p style={styles.statLabel}>Toplam Ödenen</p>
        <h3 style={styles.statValue}>{walletData.totalPaid}</h3>
        <p style={styles.statTrend}>
          <FaArrowUp size={10} /> Geçen aya göre {walletData.growthPercent}
        </p>
      </div>
    </>
  );
};

SecondaryStatsCards.propTypes = {
  walletData: PropTypes.shape({
    pendingAmount: PropTypes.string.isRequired,
    pendingDate: PropTypes.string.isRequired,
    totalPaid: PropTypes.string.isRequired,
    growthPercent: PropTypes.string.isRequired,
  }).isRequired,
  styles: PropTypes.object.isRequired,
};

export default SecondaryStatsCards;
