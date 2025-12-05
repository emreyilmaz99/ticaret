// src/pages/admin/Products/ImageLightbox.jsx
import React from 'react';
import { FaTimes } from 'react-icons/fa';

/**
 * Tam ekran görsel görüntüleyici
 */
const ImageLightbox = ({ imageUrl, onClose, styles }) => {
  if (!imageUrl) return null;

  return (
    <div style={styles.lightbox} onClick={onClose}>
      <button 
        style={{
          position: 'absolute', 
          top: '20px', 
          right: '20px', 
          background: 'none', 
          border: 'none', 
          color: 'white', 
          cursor: 'pointer'
        }}
        onClick={onClose}
      >
        <FaTimes size={32} />
      </button>
      <img 
        src={imageUrl} 
        alt="Full size" 
        style={{ 
          maxWidth: '100%', 
          maxHeight: '100%', 
          objectFit: 'contain', 
          borderRadius: '8px' 
        }} 
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
};

export default ImageLightbox;
