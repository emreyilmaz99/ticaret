// src/pages/public/Auth/components/InputField.jsx
import React from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { inputFocusStyle, inputBlurStyle, iconFocusColor, iconBlurColor } from '../styles';

/**
 * Reusable input field component with icon
 */
export const InputField = ({
  type = 'text',
  name,
  placeholder,
  value,
  onChange,
  icon: Icon,
  showPasswordToggle = false,
  showPassword,
  onTogglePassword,
  required = false,
  maxLength,
  styles
}) => {
  const handleFocus = (e) => {
    Object.assign(e.target.style, inputFocusStyle);
    if (e.target.previousSibling) {
      e.target.previousSibling.style.color = iconFocusColor;
    }
  };

  const handleBlur = (e) => {
    Object.assign(e.target.style, inputBlurStyle);
    if (e.target.previousSibling) {
      e.target.previousSibling.style.color = iconBlurColor;
    }
  };

  return (
    <div style={styles.inputGroup}>
      <Icon style={styles.inputIcon} />
      <input
        type={showPasswordToggle ? (showPassword ? 'text' : 'password') : type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        style={styles.input}
        required={required}
        maxLength={maxLength}
      />
      {showPasswordToggle && (
        <button
          type="button"
          style={styles.passwordToggle}
          onClick={onTogglePassword}
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </button>
      )}
    </div>
  );
};
