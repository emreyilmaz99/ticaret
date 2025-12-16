import React from 'react';
import PropTypes from 'prop-types';
import { FaPlay } from 'react-icons/fa';

const ReviewMedia = ({ media, getMediaUrl, handleOpenLightbox, styles }) => {
  return (
    <div style={styles.reviewMediaGrid}>
      {media.map((item, idx) => (
        <div
          key={idx}
          style={styles.reviewMediaItem}
          onClick={() => handleOpenLightbox(item.url || getMediaUrl(item.path))}
        >
          {(item.type === 'video' || item.media_type === 'video') ? (
            <div style={{ 
              position: 'relative', 
              width: '100%', 
              height: '100%', 
              backgroundColor: '#1f2937', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}>
              <FaPlay size={24} color="#fff" />
            </div>
          ) : (
            <img
              src={item.url || getMediaUrl(item.path)}
              alt={`Review media ${idx + 1}`}
              style={styles.reviewMediaImage}
            />
          )}
        </div>
      ))}
    </div>
  );
};

ReviewMedia.propTypes = {
  media: PropTypes.array.isRequired,
  getMediaUrl: PropTypes.func.isRequired,
  handleOpenLightbox: PropTypes.func.isRequired,
  styles: PropTypes.object.isRequired,
};

export default ReviewMedia;
