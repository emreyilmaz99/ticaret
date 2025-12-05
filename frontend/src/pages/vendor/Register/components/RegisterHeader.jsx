import React from 'react';
import { FaStore } from 'react-icons/fa';

/**
 * Registration page header
 */
const RegisterHeader = ({ step, styles }) => {
  return (
    <div style={styles.header}>
      <div style={styles.iconWrapper}>
        <FaStore />
      </div>
      <h1 style={styles.title}>Satıcı Başvurusu</h1>
      <p style={styles.subtitle}>
        Platformumuzda mağazanızı açın ve satışa başlayın.<br/>
        <span style={styles.subtitleHighlight}>
          {step === 1 ? 'Hesap Bilgileri' : 'Mağaza Detayları'}
        </span>
      </p>
    </div>
  );
};

export default RegisterHeader;
