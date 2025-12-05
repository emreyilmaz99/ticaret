// src/pages/admin/Applications/components/InfoBox.jsx
import React from 'react';
import { FaClock } from 'react-icons/fa';

/**
 * Bilgi kutusu komponenti
 */
const InfoBox = ({ count, message }) => {
  return (
    <div style={{ 
      background: '#fef3c7', 
      padding: '16px 20px', 
      borderRadius: '12px', 
      marginBottom: '24px',
      border: '1px solid #fde68a',
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    }}>
      <FaClock size={20} color="#d97706" />
      <div style={{ fontSize: '14px', color: '#92400e' }}>
        <strong>Toplam {count} satıcı</strong> {message || 'aktivasyon bekliyor.'}
      </div>
    </div>
  );
};

export default InfoBox;
