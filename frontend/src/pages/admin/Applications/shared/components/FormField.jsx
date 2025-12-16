// src/pages/admin/Applications/shared/components/FormField.jsx
import React from 'react';
import PropTypes from 'prop-types';

/**
 * Atomic component for form input fields
 */
const FormField = React.memo(({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  required = false,
  error,
  disabled = false,
  rows,
  style = {},
}) => {
  const inputStyle = {
    width: '100%',
    padding: '10px 14px',
    fontSize: '14px',
    border: error ? '1px solid #ef4444' : '1px solid #e5e7eb',
    borderRadius: '8px',
    outline: 'none',
    transition: 'border-color 0.2s',
    backgroundColor: disabled ? '#f9fafb' : 'white',
    color: disabled ? '#6b7280' : '#111827',
    cursor: disabled ? 'not-allowed' : 'text',
  };

  return (
    <div style={{ marginBottom: '16px', ...style }}>
      {label && (
        <label
          style={{
            display: 'block',
            fontSize: '13px',
            fontWeight: '600',
            color: '#374151',
            marginBottom: '6px',
          }}
        >
          {label}
          {required && <span style={{ color: '#ef4444', marginLeft: '4px' }}>*</span>}
        </label>
      )}
      {type === 'textarea' ? (
        <textarea
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          rows={rows || 4}
          style={{
            ...inputStyle,
            resize: 'vertical',
            fontFamily: 'inherit',
          }}
        />
      ) : type === 'select' ? (
        <select
          value={value}
          onChange={onChange}
          disabled={disabled}
          style={inputStyle}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {/* Children will be <option> elements */}
        </select>
      ) : (
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          style={inputStyle}
        />
      )}
      {error && (
        <div
          style={{
            fontSize: '12px',
            color: '#ef4444',
            marginTop: '4px',
          }}
        >
          {error}
        </div>
      )}
    </div>
  );
});

FormField.displayName = 'FormField';

FormField.propTypes = {
  label: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired,
  type: PropTypes.oneOf(['text', 'email', 'password', 'number', 'tel', 'textarea', 'select']),
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  error: PropTypes.string,
  disabled: PropTypes.bool,
  rows: PropTypes.number,
  style: PropTypes.object,
};

export default FormField;
