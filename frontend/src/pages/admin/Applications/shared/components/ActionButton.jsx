// src/pages/admin/Applications/shared/components/ActionButton.jsx
import React from 'react';
import PropTypes from 'prop-types';

/**
 * Atomic component for action buttons with icons
 */
const ActionButton = React.memo(({ 
  icon, 
  onClick, 
  title, 
  variant = 'default',
  disabled = false,
  style = {} 
}) => {
  const variants = {
    default: {
      background: 'white',
      color: '#6b7280',
      border: '1px solid #e2e8f0',
    },
    view: {
      background: '#dbeafe',
      color: '#1e40af',
      border: '1px solid #bfdbfe',
    },
    approve: {
      background: '#dcfce7',
      color: '#16a34a',
      border: '1px solid #bbf7d0',
    },
    reject: {
      background: '#fee2e2',
      color: '#dc2626',
      border: '1px solid #fecaca',
    },
    category: {
      background: '#fef3c7',
      color: '#ca8a04',
      border: '1px solid #fde68a',
    },
  };

  const buttonStyle = {
    padding: '8px',
    borderRadius: '6px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: disabled ? 0.5 : 1,
    ...variants[variant],
    ...style,
  };

  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      disabled={disabled}
      style={buttonStyle}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.currentTarget.style.transform = 'scale(1.05)';
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
      }}
    >
      {icon}
    </button>
  );
});

ActionButton.displayName = 'ActionButton';

ActionButton.propTypes = {
  icon: PropTypes.node.isRequired,
  onClick: PropTypes.func.isRequired,
  title: PropTypes.string,
  variant: PropTypes.oneOf(['default', 'view', 'approve', 'reject', 'category']),
  disabled: PropTypes.bool,
  style: PropTypes.object,
};

export default ActionButton;
