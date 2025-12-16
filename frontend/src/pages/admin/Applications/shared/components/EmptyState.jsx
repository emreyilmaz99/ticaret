// src/pages/admin/Applications/shared/components/EmptyState.jsx
import React from 'react';
import PropTypes from 'prop-types';

/**
 * Atomic component for empty state display
 */
const EmptyState = React.memo(({ 
  icon = '📋', 
  title, 
  description, 
  action,
  style = {} 
}) => {
  return (
    <div
      style={{
        textAlign: 'center',
        padding: '60px 20px',
        color: '#6b7280',
        ...style,
      }}
    >
      <div
        style={{
          fontSize: '48px',
          marginBottom: '16px',
          opacity: 0.5,
        }}
      >
        {icon}
      </div>
      {title && (
        <div
          style={{
            fontSize: '16px',
            fontWeight: '600',
            color: '#111827',
            marginBottom: '8px',
          }}
        >
          {title}
        </div>
      )}
      {description && (
        <div
          style={{
            fontSize: '14px',
            color: '#9ca3af',
            marginBottom: '16px',
          }}
        >
          {description}
        </div>
      )}
      {action && <div>{action}</div>}
    </div>
  );
});

EmptyState.displayName = 'EmptyState';

EmptyState.propTypes = {
  icon: PropTypes.node,
  title: PropTypes.string,
  description: PropTypes.string,
  action: PropTypes.node,
  style: PropTypes.object,
};

export default EmptyState;
