import React from 'react';
import { FaSave, FaSpinner } from 'react-icons/fa';
import { styles } from '../styles';

/**
 * Header component for vendor categories page
 * Shows title and save button
 */
const CategoryHeader = ({ hasChanges, isSaving, onSave }) => {
  return (
    <div style={styles.header}>
      <div style={styles.headerLeft}>
        <h1 style={styles.title}>Kategori Yönetimi</h1>
        <p style={styles.subtitle}>
          Ürünleriniz için kategorileri seçin ve yönetin
        </p>
      </div>
      
      <button
        onClick={onSave}
        disabled={!hasChanges || isSaving}
        style={{
          ...styles.saveButton,
          opacity: (!hasChanges || isSaving) ? 0.6 : 1,
          cursor: (!hasChanges || isSaving) ? 'not-allowed' : 'pointer'
        }}
      >
        {isSaving ? (
          <>
            <FaSpinner style={{ ...styles.buttonIcon, animation: 'spin 1s linear infinite' }} />
            Kaydediliyor...
          </>
        ) : (
          <>
            <FaSave style={styles.buttonIcon} />
            Değişiklikleri Kaydet
          </>
        )}
      </button>
    </div>
  );
};

export default CategoryHeader;
