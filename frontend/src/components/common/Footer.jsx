import React from 'react';

const Footer = () => {
  const styles = {
    footer: {
      background: '#0f172a',
      color: 'white',
      padding: '40px 20px',
      textAlign: 'center',
      position: 'relative',
      zIndex: 1,
      marginTop: 'auto', // Sayfa içeriği azsa en alta itmek için
    },
    footerText: {
      fontSize: '14px',
      opacity: 0.7,
      fontFamily: '"Inter", sans-serif',
    },
  };

  return (
    <footer style={styles.footer}>
      <p style={styles.footerText}>
        © 2025 E-Ticaret. Tüm hakları saklıdır.
      </p>
    </footer>
  );
};

export default Footer;
