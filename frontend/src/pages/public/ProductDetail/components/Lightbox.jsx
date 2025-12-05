// src/pages/public/ProductDetail/components/Lightbox.jsx
import React from 'react';

/**
 * Fullscreen image lightbox modal
 */
const Lightbox = ({ 
  product, 
  selectedImage, 
  setSelectedImage, 
  onClose, 
  styles 
}) => {
  if (!product.images?.length) return null;

  const handlePrev = () => {
    setSelectedImage(prev => prev === 0 ? product.images.length - 1 : prev - 1);
  };

  const handleNext = () => {
    setSelectedImage(prev => prev === product.images.length - 1 ? 0 : prev + 1);
  };

  return (
    <div style={styles.lightboxOverlay} onClick={onClose}>
      <div style={styles.lightboxContent} onClick={(e) => e.stopPropagation()}>
        <button style={styles.lightboxClose} onClick={onClose}>
          ✕
        </button>
        
        {/* Previous Button */}
        {product.images.length > 1 && (
          <button 
            style={{...styles.lightboxNav, left: '-80px'}}
            onClick={handlePrev}
            onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.3)'}
            onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
          >
            ‹
          </button>
        )}
        
        <img 
          src={product.images[selectedImage]?.url} 
          alt={product.name}
          style={styles.lightboxImage}
        />
        
        {/* Next Button */}
        {product.images.length > 1 && (
          <button 
            style={{...styles.lightboxNav, right: '-80px'}}
            onClick={handleNext}
            onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.3)'}
            onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
          >
            ›
          </button>
        )}
        
        {/* Thumbnails */}
        {product.images.length > 1 && (
          <div style={styles.lightboxThumbnails}>
            {product.images.map((img, idx) => (
              <div 
                key={img.id || idx}
                style={styles.lightboxThumb(selectedImage === idx)}
                onClick={() => setSelectedImage(idx)}
              >
                <img 
                  src={img.url} 
                  alt="" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
              </div>
            ))}
          </div>
        )}
        
        {/* Image Counter */}
        <div style={{ textAlign: 'center', color: 'white', marginTop: '15px', fontSize: '14px' }}>
          {selectedImage + 1} / {product.images.length}
        </div>
      </div>
    </div>
  );
};

export default Lightbox;
