import React from 'react';
import { styles } from '../styles';

/**
 * Reusable form field component
 */
const FormField = ({
  label,
  icon: Icon,
  value,
  onChange,
  placeholder,
  required = false,
  maxLength,
  type = 'text',
  onFocus,
  onBlur,
  children
}) => {
  return (
    <div style={styles.formGroup}>
      <label style={styles.label}>{label}</label>
      <div style={styles.inputWrapper}>
        {Icon && <Icon style={styles.inputIcon} />}
        {children ? (
          children
        ) : (
          <input
            type={type}
            style={styles.input}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            maxLength={maxLength}
            onFocus={onFocus}
            onBlur={onBlur}
          />
        )}
      </div>
    </div>
  );
};

export default FormField;
