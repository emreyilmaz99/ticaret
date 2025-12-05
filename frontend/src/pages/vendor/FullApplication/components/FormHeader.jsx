import React from 'react';
import { FaStore, FaArrowLeft } from 'react-icons/fa';
import { styles } from '../styles';

/**
 * Form header with back button and title
 */
const FormHeader = ({ vendorName, onGoBack }) => {
  return (
    <>
      {/* Back Button */}
      <button onClick={onGoBack} style={styles.backButton}>
        <FaArrowLeft /> Duruma Dön
      </button>

      <div style={styles.header}>
        <div style={styles.iconWrapper}>
          <FaStore />
        </div>
        <h1 style={styles.title}>Tam Başvuru Formu</h1>
        <p style={styles.subtitle}>
          Merhaba <strong>{vendorName}</strong>! Hesabınızı aktifleştirmek için kalan bilgileri tamamlayın.
        </p>
      </div>
    </>
  );
};

export default FormHeader;
