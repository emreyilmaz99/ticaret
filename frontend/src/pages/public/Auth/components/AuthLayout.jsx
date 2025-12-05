// src/pages/public/Auth/components/AuthLayout.jsx
import React from 'react';

/**
 * Shared layout wrapper for auth pages
 */
export const AuthLayout = ({ children, styles }) => {
  return (
    <div style={styles.container}>
      <div style={styles.backgroundShape1}></div>
      <div style={styles.backgroundShape2}></div>
      <div style={styles.card}>
        {children}
      </div>
    </div>
  );
};
