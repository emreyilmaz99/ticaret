// src/pages/vendor/Products/components/ConfirmModal.jsx
import React from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';
import { styles } from '../styles';

const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm?.();
    onCancel?.();
  };

  return (
    <div style={styles.confirmOverlay} onClick={onCancel}>
      <div style={styles.confirmModal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.confirmIcon}>
          <FaExclamationTriangle />
        </div>
        <h3 style={styles.confirmTitle}>{title}</h3>
        <p style={styles.confirmMessage}>{message}</p>
        <div style={styles.confirmButtons}>
          <button style={styles.confirmCancelBtn} onClick={onCancel}>
            İptal
          </button>
          <button style={styles.confirmDeleteBtn} onClick={handleConfirm}>
            Onayla
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
