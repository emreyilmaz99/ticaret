// src/features/admin/shared/components/RejectModal.jsx
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FaTimes, FaBan } from 'react-icons/fa';

/**
 * Merkezi Reject/Red Modal bileşeni
 * Başvuru, ürün, yorum vb. reddetme işlemleri için
 */
const RejectModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = 'Reddet',
  description = 'Bu işlemi reddetmek istediğinizden emin misiniz?',
  placeholder = 'Red sebebini yazın... (Opsiyonel)',
  submitText = 'Reddet',
  cancelText = 'İptal',
  requireReason = false,
  minLength = 10,
  isLoading = false 
}) => {
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = () => {
    // Validation
    if (requireReason && reason.trim().length < minLength) {
      setError(`En az ${minLength} karakter gereklidir.`);
      return;
    }

    onConfirm(reason.trim());
    handleClose();
  };

  const handleClose = () => {
    setReason('');
    setError('');
    onClose();
  };

  return (
    <div style={styles.overlay} onClick={handleClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.headerContent}>
            <div style={styles.iconBox}>
              <FaBan />
            </div>
            <h2 style={styles.title}>{title}</h2>
          </div>
          <button style={styles.closeBtn} onClick={handleClose}>
            <FaTimes />
          </button>
        </div>

        {/* Body */}
        <div style={styles.body}>
          <p style={styles.description}>{description}</p>
          
          <textarea
            value={reason}
            onChange={(e) => {
              setReason(e.target.value);
              setError('');
            }}
            placeholder={placeholder}
            style={styles.textarea}
            rows={4}
            disabled={isLoading}
          />
          
          {error && (
            <div style={styles.error}>{error}</div>
          )}
          
          <div style={styles.charCount}>
            {reason.length} karakter
          </div>
        </div>

        {/* Footer */}
        <div style={styles.footer}>
          <button 
            style={styles.cancelBtn} 
            onClick={handleClose}
            disabled={isLoading}
          >
            {cancelText}
          </button>
          <button 
            style={styles.submitBtn} 
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? 'İşleniyor...' : submitText}
          </button>
        </div>
      </div>
    </div>
  );
};

RejectModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  title: PropTypes.string,
  description: PropTypes.string,
  placeholder: PropTypes.string,
  submitText: PropTypes.string,
  cancelText: PropTypes.string,
  requireReason: PropTypes.bool,
  minLength: PropTypes.number,
  isLoading: PropTypes.bool,
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '20px',
    animation: 'fadeIn 0.2s ease',
  },
  modal: {
    background: 'white',
    borderRadius: '16px',
    maxWidth: '500px',
    width: '100%',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
    animation: 'slideUp 0.3s ease',
    overflow: 'hidden',
  },
  header: {
    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
    padding: '24px',
    color: 'white',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  iconBox: {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    background: 'rgba(255, 255, 255, 0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
  },
  title: {
    margin: 0,
    fontSize: '20px',
    fontWeight: '700',
  },
  closeBtn: {
    background: 'rgba(255, 255, 255, 0.2)',
    border: 'none',
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: 'white',
    fontSize: '16px',
    transition: 'all 0.2s',
  },
  body: {
    padding: '24px',
  },
  description: {
    margin: '0 0 16px 0',
    color: '#64748b',
    fontSize: '14px',
    lineHeight: '1.5',
  },
  textarea: {
    width: '100%',
    padding: '12px',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '14px',
    fontFamily: 'inherit',
    resize: 'vertical',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  error: {
    color: '#ef4444',
    fontSize: '13px',
    marginTop: '8px',
    fontWeight: '500',
  },
  charCount: {
    fontSize: '12px',
    color: '#94a3b8',
    marginTop: '8px',
    textAlign: 'right',
  },
  footer: {
    padding: '16px 24px',
    borderTop: '1px solid #e2e8f0',
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
  },
  cancelBtn: {
    padding: '10px 20px',
    background: 'white',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    color: '#64748b',
    transition: 'all 0.2s',
  },
  submitBtn: {
    padding: '10px 20px',
    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    color: 'white',
    transition: 'all 0.2s',
  },
};

export default RejectModal;
