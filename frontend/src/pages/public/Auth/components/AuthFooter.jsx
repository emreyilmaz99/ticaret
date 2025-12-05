// src/pages/public/Auth/components/AuthFooter.jsx
import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Auth page footer with navigation link
 */
export const AuthFooter = ({ text, linkText, linkTo, styles }) => {
  return (
    <div style={styles.footer}>
      {text}
      <Link to={linkTo} style={styles.footerLink}>{linkText}</Link>
    </div>
  );
};
