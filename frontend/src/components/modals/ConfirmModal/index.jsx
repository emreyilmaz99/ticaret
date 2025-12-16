// src/components/modals/ConfirmModal/index.jsx
import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { FiX } from 'react-icons/fi';
import { confirmTypes } from './config';
import { getConfirmModalStyles } from './styles';
import { useHoverEffect } from '../../../hooks/useHoverEffect';
import '../shared/styles/animations.css';

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Emin misiniz?',
  message = 'Bu işlemi gerçekleştirmek istediğinizden emin misiniz?',
  confirmText = 'Evet, Onayla',
  cancelText = 'İptal',
  type = 'danger',
  isLoading = false,
}) => {
  const { isHovered: isCloseBtnHovered, handleMouseEnter: handleCloseBtnEnter, handleMouseLeave: handleCloseBtnLeave } = useHoverEffect();
  const { isHovered: isCancelBtnHovered, handleMouseEnter: handleCancelBtnEnter, handleMouseLeave: handleCancelBtnLeave } = useHoverEffect();
  const { isHovered: isConfirmBtnHovered, handleMouseEnter: handleConfirmBtnEnter, handleMouseLeave: handleConfirmBtnLeave } = useHoverEffect();

  if (!isOpen) return null;

  const config = confirmTypes[type] || confirmTypes.danger;
  const IconComponent = config.icon;
  const styles = getConfirmModalStyles(config);

  const handleOverlayClick = useCallback((e) => {
    if (e.target === e.currentTarget && !isLoading) {
      onClose();
    }
  }, [onClose, isLoading]);

  const handleConfirmClick = useCallback(() => {
    if (!isLoading) {
      onConfirm();
    }
  }, [onConfirm, isLoading]);

  return (
    <div style={styles.overlay} onClick={handleOverlayClick}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <button
            type="button"
            style={{
              ...styles.closeBtn,
              ...(isCloseBtnHovered ? styles.closeBtnHover : {}),
            }}
            onClick={onClose}
            onMouseEnter={handleCloseBtnEnter}
            onMouseLeave={handleCloseBtnLeave}
            disabled={isLoading}
          >
            <FiX size={18} />
          </button>
        </div>
        
        <div style={styles.content}>
          <div style={styles.iconWrapper}>
            <IconComponent size={28} color={config.iconColor} />
          </div>
          
          <h3 style={styles.title}>{title}</h3>
          <p style={styles.message}>{message}</p>
          
          <div style={styles.buttons}>
            <button
              type="button"
              style={{
                ...styles.cancelBtn,
                ...(isCancelBtnHovered ? styles.cancelBtnHover : {}),
              }}
              onClick={onClose}
              onMouseEnter={handleCancelBtnEnter}
              onMouseLeave={handleCancelBtnLeave}
              disabled={isLoading}
            >
              {cancelText}
            </button>
            
            <button
              type="button"
              style={{
                ...styles.confirmBtn(isLoading),
                ...(isConfirmBtnHovered && !isLoading ? styles.confirmBtnHover : {}),
              }}
              onClick={handleConfirmClick}
              onMouseEnter={handleConfirmBtnEnter}
              onMouseLeave={handleConfirmBtnLeave}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span style={styles.spinner} />
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

export default React.memo(ConfirmModal);
