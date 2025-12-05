import React from 'react';
import { FaSave, FaSpinner } from 'react-icons/fa';
import { styles } from '../styles';

/**
 * Action buttons for reset and save
 */
const ActionButtons = ({ onReset, isSaving }) => {
  return (
    <div style={styles.actionButtons}>
      <button
        type="button"
        onClick={onReset}
        style={styles.resetButton}
      >
        Varsayılana Dön
      </button>
      
      <button
        type="submit"
        disabled={isSaving}
        style={{
          ...styles.saveButton,
          ...(isSaving ? styles.saveButtonDisabled : {})
        }}
      >
        {isSaving ? (
          <>
            <FaSpinner className="spin" /> Kaydediliyor...
          </>
        ) : (
          <>
            <FaSave /> Kaydet
          </>
        )}
      </button>
    </div>
  );
};

export default ActionButtons;
