import React from 'react';
import PropTypes from 'prop-types';
import { FaTimes } from 'react-icons/fa';

const Lightbox = ({ lightboxImage, handleCloseLightbox, styles }) => {
  if (!lightboxImage) return null;

  return (
    <div style={styles.lightbox} onClick={handleCloseLightbox}>
      <button style={styles.lightboxClose} onClick={handleCloseLightbox}>
        <FaTimes />
      </button>
      <img
        src={lightboxImage}
        alt="Review media"
        style={styles.lightboxImage}
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
};

Lightbox.propTypes = {
  lightboxImage: PropTypes.string,
  handleCloseLightbox: PropTypes.func.isRequired,
  styles: PropTypes.object.isRequired,
};

export default Lightbox;
