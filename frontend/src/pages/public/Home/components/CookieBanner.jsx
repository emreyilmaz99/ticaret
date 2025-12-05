// src/pages/public/Home/components/CookieBanner.jsx
import React from 'react';
import { FaCookieBite } from 'react-icons/fa';

/**
 * Cookie consent banner
 */
const CookieBanner = ({ show, onClose, styles }) => {
  if (!show) return null;

  return (
    <div style={styles.cookieBanner}>
      <FaCookieBite size={24} color="#f59e0b" />
      <div style={{ flex: 1, fontSize: '13px', lineHeight: '1.5' }}>
        Size daha iyi bir alışveriş deneyimi sunabilmek için çerezleri kullanıyoruz. 
        Detaylı bilgi için <a href="#" style={{ color: '#38bdf8' }}>Çerez Politikamızı</a> inceleyebilirsiniz.
      </div>
      <div style={{ display: 'flex', gap: '8px' }}>
        <button 
          onClick={onClose}
          style={{ 
            ...styles.cookieBtn, 
            backgroundColor: 'transparent', 
            color: '#94a3b8', 
            border: '1px solid #475569' 
          }}
        >
          Reddet
        </button>
        <button 
          onClick={onClose}
          style={{ 
            ...styles.cookieBtn, 
            backgroundColor: '#059669', 
            color: 'white' 
          }}
        >
          Kabul Et
        </button>
      </div>
    </div>
  );
};

export default CookieBanner;
