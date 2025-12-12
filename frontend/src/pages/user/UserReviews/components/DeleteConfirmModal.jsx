// src/pages/user/UserReviews/components/DeleteConfirmModal.jsx
import React from 'react';
import { FaTimes, FaExclamationTriangle } from 'react-icons/fa';

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, isDeleting, styles }) => {
  if (!isOpen) return null;

  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div 
        style={{ 
          ...styles.modalContent, 
          maxWidth: '400px',
        }} 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ 
          ...styles.modalHeader, 
          backgroundColor: '#fef2f2', 
          borderBottom: '1px solid #fecaca',
          justifyContent: 'center',
        }}>
          <FaExclamationTriangle size={40} color="#ef4444" />
        </div>

        {/* Body */}
        <div style={{ ...styles.modalBody, textAlign: 'center' }}>
          <h3 style={{ 
            fontSize: '18px', 
            fontWeight: '700', 
            color: '#0f172a', 
            marginBottom: '12px',
            marginTop: 0,
          }}>
            Değerlendirmeyi Sil
          </h3>
          <p style={styles.deleteConfirmText}>
            Bu değerlendirmeyi silmek istediğinizden emin misiniz? 
            Bu işlem geri alınamaz.
          </p>

          <div style={styles.deleteConfirmBtns}>
            <button
              style={styles.secondaryBtn}
              onClick={onClose}
              disabled={isDeleting}
            >
              Vazgeç
            </button>
            <button
              style={{
                ...styles.deleteConfirmBtn,
                opacity: isDeleting ? 0.7 : 1,
              }}
              onClick={onConfirm}
              disabled={isDeleting}
            >
              {isDeleting ? 'Siliniyor...' : 'Evet, Sil'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
