// src/components/ConfirmModal.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { FiAlertTriangle, FiX, FiTrash2, FiCheck } from 'react-icons/fi';

/**
 * Onay Modal Bileşeni
 * Silme, onaylama gibi işlemler için özelleştirilmiş modal
 */
const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Emin misiniz?',
  message = 'Bu işlemi gerçekleştirmek istediğinizden emin misiniz?',
  confirmText = 'Evet, Onayla',
  cancelText = 'İptal',
  type = 'danger', // 'danger' | 'warning' | 'success'
  isLoading = false,
}) => {
  if (!isOpen) return null;

  const colors = {
    danger: {
      icon: '#dc2626',
      iconBg: '#fee2e2',
      button: '#dc2626',
      buttonHover: '#b91c1c',
    },
    warning: {
      icon: '#f59e0b',
      iconBg: '#fef3c7',
      button: '#f59e0b',
      buttonHover: '#d97706',
    },
    success: {
      icon: '#059669',
      iconBg: '#ecfdf5',
      button: '#059669',
      buttonHover: '#047857',
    },
  };

  const color = colors[type] || colors.danger;

  const styles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000,
      backdropFilter: 'blur(4px)',
      animation: 'fadeIn 0.2s ease',
    },
    modal: {
      backgroundColor: 'white',
      borderRadius: '20px',
      width: '90%',
      maxWidth: '400px',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      overflow: 'hidden',
      animation: 'slideUp 0.3s ease',
    },
    header: {
      display: 'flex',
      justifyContent: 'flex-end',
      padding: '12px 16px 0',
    },
    closeBtn: {
      width: '32px',
      height: '32px',
      borderRadius: '50%',
      border: 'none',
      backgroundColor: '#f1f5f9',
      color: '#64748b',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.2s',
    },
    content: {
      padding: '0 32px 32px',
      textAlign: 'center',
    },
    iconWrapper: {
      width: '64px',
      height: '64px',
      borderRadius: '50%',
      backgroundColor: color.iconBg,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 20px',
    },
    title: {
      fontSize: '20px',
      fontWeight: '700',
      color: '#1e293b',
      marginBottom: '12px',
    },
    message: {
      fontSize: '15px',
      color: '#64748b',
      lineHeight: '1.6',
      marginBottom: '28px',
    },
    buttons: {
      display: 'flex',
      gap: '12px',
      justifyContent: 'center',
    },
    cancelBtn: {
      flex: 1,
      padding: '14px 24px',
      borderRadius: '12px',
      border: '1px solid #e2e8f0',
      backgroundColor: 'white',
      color: '#475569',
      fontSize: '15px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s',
    },
    confirmBtn: {
      flex: 1,
      padding: '14px 24px',
      borderRadius: '12px',
      border: 'none',
      backgroundColor: color.button,
      color: 'white',
      fontSize: '15px',
      fontWeight: '600',
      cursor: isLoading ? 'not-allowed' : 'pointer',
      transition: 'all 0.2s',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      opacity: isLoading ? 0.7 : 1,
    },
  };

  const IconComponent = type === 'danger' ? FiTrash2 : type === 'success' ? FiCheck : FiAlertTriangle;

  return (
    <>
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes slideUp {
            from { 
              opacity: 0;
              transform: translateY(20px) scale(0.95);
            }
            to { 
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
        `}
      </style>
      <div style={styles.overlay} onClick={onClose}>
        <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
          <div style={styles.header}>
            <button
              type="button"
              style={styles.closeBtn}
              onClick={onClose}
            >
              <FiX size={18} />
            </button>
          </div>
          <div style={styles.content}>
            <div style={styles.iconWrapper}>
              <IconComponent size={28} color={color.icon} />
            </div>
            <h3 style={styles.title}>{title}</h3>
            <p style={styles.message}>{message}</p>
            <div style={styles.buttons}>
              <button
                type="button"
                style={styles.cancelBtn}
                onClick={onClose}
                disabled={isLoading}
              >
                {cancelText}
              </button>
              <button
                type="button"
                style={styles.confirmBtn}
                onClick={onConfirm}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span style={{
                      width: '16px',
                      height: '16px',
                      border: '2px solid rgba(255,255,255,0.3)',
                      borderTopColor: 'white',
                      borderRadius: '50%',
                      animation: 'spin 0.8s linear infinite',
                    }} />
                    İşleniyor...
                  </>
                ) : (
                  confirmText
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      <style>
        {`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </>
  );
};

ConfirmModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  title: PropTypes.string,
  message: PropTypes.string,
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,
  type: PropTypes.oneOf(['danger', 'warning', 'success']),
  isLoading: PropTypes.bool,
};

export default ConfirmModal;
