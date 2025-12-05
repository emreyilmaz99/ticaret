// src/pages/public/ProductDetail/components/ShareMenu.jsx
import React from 'react';
import { FaShareAlt, FaFacebook, FaTwitter, FaWhatsapp, FaCopy } from 'react-icons/fa';

/**
 * Share menu dropdown
 */
const ShareMenu = ({ 
  showShareMenu, 
  setShowShareMenu, 
  handleShare, 
  copyToClipboard, 
  styles 
}) => {
  return (
    <div style={styles.shareMenuContainer}>
      <button 
        style={styles.iconBtn}
        onClick={() => setShowShareMenu(!showShareMenu)}
      >
        <FaShareAlt />
      </button>
      {showShareMenu && (
        <div style={styles.shareMenu}>
          <button 
            style={styles.shareMenuItem}
            onClick={() => handleShare('facebook')}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#f1f5f9'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            <FaFacebook color="#1877f2" /> Facebook
          </button>
          <button 
            style={styles.shareMenuItem}
            onClick={() => handleShare('twitter')}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#f1f5f9'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            <FaTwitter color="#1da1f2" /> Twitter
          </button>
          <button 
            style={styles.shareMenuItem}
            onClick={() => handleShare('whatsapp')}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#f1f5f9'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            <FaWhatsapp color="#25d366" /> WhatsApp
          </button>
          <button 
            style={styles.shareMenuItem}
            onClick={copyToClipboard}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#f1f5f9'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            <FaCopy color="#64748b" /> Linki Kopyala
          </button>
        </div>
      )}
    </div>
  );
};

export default ShareMenu;
