// src/pages/public/Home/components/BrandStrip.jsx
import React from 'react';
import { BRANDS } from '../styles';

/**
 * Scrolling brand strip
 */
const BrandStrip = ({ styles }) => {
  return (
    <div style={styles.brandStrip}>
      <div style={{ display: 'inline-block', animation: 'scroll 20s linear infinite' }}>
        {BRANDS.map((brand, i) => (
          <span key={i} style={styles.brandLogo}>{brand}</span>
        ))}
        {/* Duplicate for seamless loop */}
        {BRANDS.map((brand, i) => (
          <span key={`dup-${i}`} style={styles.brandLogo}>{brand}</span>
        ))}
      </div>
    </div>
  );
};

export default BrandStrip;
