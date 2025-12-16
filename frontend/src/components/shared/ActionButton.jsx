// src/components/shared/ActionButton.jsx
import React from 'react';
import { useHoverEffect } from '../../hooks/useHoverEffect';

const baseStyles = {
  normal: {
    backgroundColor: '#f0fdf4',
    border: 'none',
    borderRadius: '8px',
    width: '36px',
    height: '36px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  hover: {
    backgroundColor: '#059669',
    transform: 'scale(1.1)',
  },
  active: {
    backgroundColor: '#ef4444',
    transform: 'scale(1)',
  }
};

const ActionButton = ({ 
  icon: Icon, 
  onClick, 
  active = false, 
  title = '',
  activeColor = '#ef4444',
  normalColor = '#059669',
  size = 15
}) => {
  const hoverStyle = active 
    ? { ...baseStyles.active, backgroundColor: activeColor }
    : { ...baseStyles.hover, backgroundColor: normalColor };

  const hoverProps = useHoverEffect(
    active ? { ...baseStyles.normal, backgroundColor: activeColor + '20' } : baseStyles.normal,
    hoverStyle
  );

  return (
    <button
      onClick={onClick}
      title={title}
      style={active ? { ...baseStyles.normal, backgroundColor: activeColor + '20' } : baseStyles.normal}
      {...hoverProps}
    >
      <Icon size={size} color={active ? activeColor : normalColor} />
    </button>
  );
};

export default React.memo(ActionButton);
