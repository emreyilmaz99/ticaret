// src/components/Navbar/TopBar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FaPhoneAlt } from 'react-icons/fa';
import { useToast } from '../Toast';
import { styles } from './styles';

/**
 * Üst bar bileşeni - Hoş geldiniz mesajı, satıcı ol linki, telefon ve yardım
 * Bu bileşen props almaz, kendi içinde toast hook'u kullanır
 */
const TopBar = () => {
  const toast = useToast();

  const handleHelpClick = () => {
    toast.info('Bilgi', 'Yardım merkezi şu anda bakımda.');
  };

  return (
    <div style={styles.topBar}>
      <div style={styles.container}>
        <div style={{ display: 'flex', gap: '20px' }}>
          <span>Hoş Geldiniz!</span>
          <span style={{ opacity: 0.8 }}>|</span>
          <Link to="/vendor/register" style={{ color: 'inherit', textDecoration: 'none' }}>Satıcı Ol</Link>
        </div>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <FaPhoneAlt size={10} /> 0850 123 45 67
          </span>
          <span style={{ cursor: 'pointer' }} onClick={handleHelpClick}>Yardım</span>
        </div>
      </div>
    </div>
  );
};

// TopBar props almadığı için PropTypes tanımlamaya gerek yok
// Ancak ileride prop alırsa eklenebilir

export default TopBar;