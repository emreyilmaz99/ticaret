import React from 'react';
import PropTypes from 'prop-types';
import { FaStar } from 'react-icons/fa';

const RatingSummary = ({ stats, renderStars, styles }) => {
  if (stats.total_reviews === 0) return null;

  return (
    <div style={styles.ratingSummary}>
      <div style={styles.ratingOverview}>
        <div style={styles.ratingNumber}>
          {stats.average_rating?.toFixed(1) || '0.0'}
        </div>
        <div style={styles.ratingStars}>
          {renderStars(Math.round(stats.average_rating || 0), 20)}
        </div>
        <div style={styles.ratingTotal}>
          {stats.total_reviews} değerlendirme
        </div>
      </div>
      <div style={styles.ratingBars}>
        {[5, 4, 3, 2, 1].map((rating) => {
          const count = stats.rating_breakdown?.[rating] || 0;
          const percentage = stats.total_reviews > 0 
            ? (count / stats.total_reviews) * 100 
            : 0;
          return (
            <div key={rating} style={styles.ratingBarRow}>
              <div style={styles.ratingBarLabel}>
                {rating} <FaStar size={12} color="#f59e0b" />
              </div>
              <div style={styles.ratingBarBg}>
                <div style={styles.ratingBarFill(percentage)} />
              </div>
              <div style={styles.ratingBarCount}>{count}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

RatingSummary.propTypes = {
  stats: PropTypes.shape({
    total_reviews: PropTypes.number,
    average_rating: PropTypes.number,
    rating_breakdown: PropTypes.object,
  }).isRequired,
  renderStars: PropTypes.func.isRequired,
  styles: PropTypes.object.isRequired,
};

export default RatingSummary;
