// src/components/modals/shared/ModalOverlay.jsx
import React, { useEffect, useCallback } from 'react';
import './styles/animations.css';

const ModalOverlay = React.memo(({ isOpen, onClose, children, closeOnClickOutside = true }) => {
  const handleEscKey = useCallback((e) => {
    if (e.key === 'Escape' && onClose) {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'hidden';
      return () => {
        document.removeEventListener('keydown', handleEscKey);
        document.body.style.overflow = 'unset';
      };
    }
  }, [isOpen, handleEscKey]);

  if (!isOpen) return null;

  const handleOverlayClick = useCallback((e) => {
    if (closeOnClickOutside && e.target === e.currentTarget && onClose) {
      onClose();
    }
  }, [closeOnClickOutside, onClose]);

  return (
    <div onClick={handleOverlayClick}>
      {children}
    </div>
  );
});

ModalOverlay.displayName = 'ModalOverlay';

export default ModalOverlay;
