// src/components/modals/shared/ModalCloseButton.jsx
import React from 'react';
import { FaTimes } from 'react-icons/fa';
import { useHoverEffect } from '../../../hooks/useHoverEffect';
import { modalColors } from './styles/colors';

const ModalCloseButton = React.memo(({ onClick, position = 'header' }) => {
  const { isHovered, handleMouseEnter, handleMouseLeave } = useHoverEffect();

  const baseStyle = {
    width: position === 'absolute' ? '40px' : '32px',
    height: position === 'absolute' ? '40px' : '32px',
    borderRadius: '50%',
    backgroundColor: isHovered ? modalColors.lightGray : modalColors.white,
    border: position === 'absolute' ? 'none' : `1px solid ${modalColors.borderLight}`,
    color: modalColors.mediumText,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontSize: position === 'absolute' ? '18px' : '16px',
    transform: isHovered ? 'scale(1.1)' : 'scale(1)',
    boxShadow: position === 'absolute' ? '0 2px 8px rgba(0,0,0,0.1)' : 'none',
  };

  const absolutePositionStyle = position === 'absolute' ? {
    position: 'absolute',
    top: '20px',
    right: '20px',
    zIndex: 10,
  } : {};

  return (
    <button
      onClick={onClick}
      style={{ ...baseStyle, ...absolutePositionStyle }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      aria-label="Kapat"
    >
      <FaTimes />
    </button>
  );
});

ModalCloseButton.displayName = 'ModalCloseButton';

export default ModalCloseButton;
