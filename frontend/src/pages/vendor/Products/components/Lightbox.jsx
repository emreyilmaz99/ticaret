// src/pages/vendor/Products/components/Lightbox.jsx
import React from 'react';
import { FaTimes } from 'react-icons/fa';
import { styles } from '../styles';

const Lightbox = ({ imageUrl, onClose }) => {
  if (!imageUrl) return null;

  return (
    <div style={styles.lightboxOverlay} onClick={onClose}>
      <button style={styles.lightboxCloseBtn} onClick={onClose}>
        <FaTimes />
      </button>
      <img 
        src={imageUrl} 
        alt="Büyütülmüş görsel" 
        style={styles.lightboxImage}
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
};

export default Lightbox;
