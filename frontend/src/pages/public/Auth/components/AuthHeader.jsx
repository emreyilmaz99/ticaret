// src/pages/public/Auth/components/AuthHeader.jsx
import React from 'react';

/**
 * Auth page header component
 */
export const AuthHeader = ({ title, subtitle, styles }) => {
  return (
    <div style={styles.header}>
      <h1 style={styles.title}>{title}</h1>
      <p style={styles.subtitle}>{subtitle}</p>
    </div>
  );
};
