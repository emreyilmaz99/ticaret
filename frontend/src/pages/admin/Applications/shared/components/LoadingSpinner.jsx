// src/pages/admin/Applications/shared/components/LoadingSpinner.jsx
import React from 'react';
import PropTypes from 'prop-types';

/**
 * Atomic component for loading spinner
 */
const LoadingSpinner = React.memo(({ size = 40, message = 'Yükleniyor...', style = {} }) => {
  return (
    <div
      style={{
        textAlign: 'center',
        padding: '60px 20px',
        ...style,
      }}
    >
      <div
        style={{
          margin: '0 auto 12px',
          width: `${size}px`,
          height: `${size}px`,
          border: '4px solid #e5e7eb',
          borderTopColor: '#059669',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
        }}
      />
      {message && (
        <div
          style={{
            fontSize: '14px',
            color: '#6b7280',
          }}
        >
          {message}
        </div>
      )}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
});

LoadingSpinner.displayName = 'LoadingSpinner';

LoadingSpinner.propTypes = {
  size: PropTypes.number,
  message: PropTypes.string,
  style: PropTypes.object,
};

export default LoadingSpinner;
