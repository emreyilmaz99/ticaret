import React from 'react';
import PropTypes from 'prop-types';

const ReviewsHeader = ({ styles }) => {
  return (
    <div style={styles.header}>
      <div style={styles.titleGroup}>
        <h1 style={styles.title}>Değerlendirmeler</h1>
        <p style={styles.subtitle}>
          Müşteri yorumlarını görüntüleyin ve yanıtlayın
        </p>
      </div>
    </div>
  );
};

ReviewsHeader.propTypes = {
  styles: PropTypes.object.isRequired,
};

export default ReviewsHeader;
