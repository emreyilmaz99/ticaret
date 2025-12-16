// src/components/modals/CompareModal/AttributeRow.jsx
import React from 'react';

const AttributeRow = React.memo(({ label, value, icon, isLast = false }) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        padding: '12px 0',
        borderBottom: isLast ? 'none' : '1px solid #F3F4F6',
      }}
    >
      <span
        style={{
          fontSize: '12px',
          fontWeight: '600',
          color: '#6B7280',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontFamily: '"Inter", sans-serif',
        }}
      >
        <span>{icon}</span>
        {label}
      </span>
      <span
        style={{
          fontSize: '14px',
          fontWeight: '600',
          color: '#111827',
          textAlign: 'right',
          fontFamily: '"Inter", sans-serif',
        }}
      >
        {value}
      </span>
    </div>
  );
});

AttributeRow.displayName = 'AttributeRow';

export default AttributeRow;
