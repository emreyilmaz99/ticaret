// src/pages/public/Auth/components/SocialButtons.jsx
import React from 'react';
import { FaGoogle, FaFacebookF } from 'react-icons/fa';

/**
 * Social login buttons component
 */
export const SocialButtons = ({ dividerText, styles }) => {
  return (
    <>
      <div style={styles.divider}>
        <div style={styles.dividerLine}></div>
        <span style={styles.dividerText}>{dividerText}</span>
        <div style={styles.dividerLine}></div>
      </div>

      <div style={styles.socialButtons}>
        <button style={styles.socialBtn} type="button">
          <FaGoogle color="#DB4437" size={20} />
          Google
        </button>
        <button style={styles.socialBtn} type="button">
          <FaFacebookF color="#4267B2" size={20} />
          Facebook
        </button>
      </div>
    </>
  );
};
