// src/components/modals/shared/ModalContainer.jsx
import React from 'react';
import { getModalBaseStyles } from './styles/modalBase';

const ModalContainer = React.memo(({ 
  children, 
  width = '100%',
  maxWidth = '1100px',
  isMobile = false,
  onClick 
}) => {
  const styles = getModalBaseStyles(isMobile);

  return (
    <div
      style={{
        ...styles.container,
        width,
        maxWidth: isMobile ? '100%' : maxWidth,
      }}
      onClick={onClick}
    >
      {children}
    </div>
  );
});

ModalContainer.displayName = 'ModalContainer';

export default ModalContainer;
