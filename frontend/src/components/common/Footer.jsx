// src/components/common/Footer.jsx
import React from 'react';

const styles = {
  footer: {
    background: '#0f172a',
    color: 'white',
    padding: '40px 20px',
    textAlign: 'center',
    position: 'relative',
    zIndex: 1,
    marginTop: 'auto',
  },
  footerText: {
    fontSize: '14px',
    opacity: 0.7,
    fontFamily: '"Inter", sans-serif',
  },
};

const Footer = () => {
  return (
    <footer style={styles.footer}>
      <p style={styles.footerText}>
        © {new Date().getFullYear()} E-Ticaret. Tüm hakları saklıdır.
      </p>
    </footer>
  );
};

export default React.memo(Footer);
