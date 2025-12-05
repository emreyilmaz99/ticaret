// src/pages/public/CategoryProducts/components/CategoryBanner.jsx
import React from 'react';

/**
 * Category banner component
 */
export const CategoryBanner = ({ banner, styles }) => {
  if (!banner) return null;

  return (
    <div style={styles.banner}>
      <div style={{
        position: 'absolute',
        inset: 0,
        background: banner.gradient,
        zIndex: 0
      }} />
      <div style={{
        position: 'relative',
        zIndex: 10,
        textAlign: 'center'
      }}>
        <h1 style={styles.bannerTitle}>{banner.title}</h1>
        <p style={styles.bannerDescription}>{banner.description}</p>
      </div>
    </div>
  );
};
