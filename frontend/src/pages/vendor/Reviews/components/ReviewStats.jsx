import React from 'react';
import PropTypes from 'prop-types';
import { FaStar, FaImages } from 'react-icons/fa';

const ReviewStats = ({ stats, styles }) => {
  return (
    <div style={styles.statsGrid}>
      <div style={styles.statCard}>
        <div style={styles.statValue}>{stats.total_reviews || 0}</div>
        <div style={styles.statLabel}>Toplam Yorum</div>
      </div>
      <div style={styles.statCard}>
        <div style={{ ...styles.statValue, color: '#f59e0b' }}>
          <FaStar size={20} />
          {stats.average_rating?.toFixed(1) || '0.0'}
        </div>
        <div style={styles.statLabel}>Ortalama Puan</div>
      </div>
      <div style={styles.statCard}>
        <div style={{ ...styles.statValue, color: '#059669' }}>{stats.total_responses || 0}</div>
        <div style={styles.statLabel}>Yanıtlanan</div>
      </div>
      <div style={styles.statCard}>
        <div style={{ ...styles.statValue, color: '#dc2626' }}>{stats.pending_responses || 0}</div>
        <div style={styles.statLabel}>Yanıt Bekleyen</div>
      </div>
      <div style={styles.statCard}>
        <div style={{ ...styles.statValue, color: '#8b5cf6' }}>
          <FaImages size={18} />
          {stats.with_media || 0}
        </div>
        <div style={styles.statLabel}>Medya İçeren</div>
      </div>
    </div>
  );
};

ReviewStats.propTypes = {
  stats: PropTypes.shape({
    total_reviews: PropTypes.number,
    average_rating: PropTypes.number,
    total_responses: PropTypes.number,
    pending_responses: PropTypes.number,
    with_media: PropTypes.number,
  }).isRequired,
  styles: PropTypes.object.isRequired,
};

export default ReviewStats;
