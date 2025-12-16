// src/pages/admin/Applications/shared/components/DetailField.jsx
import React from 'react';
import PropTypes from 'prop-types';

/**
 * Atomic component for displaying a detail field (label + value)
 */
const DetailField = React.memo(({ label, value, icon, style = {} }) => {
  return (
    <div style={{ marginBottom: '16px', ...style }}>
      <label
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '12px',
          fontWeight: '600',
          color: '#6b7280',
          marginBottom: '6px',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
        }}
      >
        {icon && <span>{icon}</span>}
        {label}
      </label>
      <div
        style={{
          fontSize: '15px',
          color: '#111827',
          fontWeight: '600',
          padding: '10px 14px',
          background: '#f9fafb',
          borderRadius: '10px',
          border: '1px solid #e5e7eb',
          wordBreak: 'break-word',
        }}
      >
        {value || '-'}
      </div>
    </div>
  );
});

DetailField.displayName = 'DetailField';

DetailField.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.node,
  icon: PropTypes.node,
  style: PropTypes.object,
};

export default DetailField;
