// src/components/modals/shared/ModalHeader.jsx
import React from 'react';
import ModalCloseButton from './ModalCloseButton';
import { modalColors } from './styles/colors';

const ModalHeader = React.memo(({ title, icon, onClose, isMobile = false }) => {
  return (
    <div
      style={{
        padding: '24px',
        borderBottom: `1px solid ${modalColors.border}`,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: modalColors.lightGray,
      }}
    >
      <div
        style={{
          fontSize: isMobile ? '18px' : '20px',
          fontWeight: '700',
          color: modalColors.darkText,
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontFamily: '"Inter", sans-serif',
        }}
      >
        {icon && (
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: modalColors.primaryLight,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: modalColors.primary,
              fontSize: '16px',
            }}
          >
            {icon}
          </div>
        )}
        {title}
      </div>
      <ModalCloseButton onClick={onClose} position="header" />
    </div>
  );
});

ModalHeader.displayName = 'ModalHeader';

export default ModalHeader;
