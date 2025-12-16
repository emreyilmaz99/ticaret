// src/components/modals/AddressModal/components/FormField.jsx
import React from 'react';
import PropTypes from 'prop-types';

const fieldStyles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  
  label: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#333',
  },
  
  required: {
    color: '#f44336',
    marginLeft: '4px',
  },
  
  input: {
    padding: '10px 12px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '14px',
    transition: 'border-color 0.2s ease',
    outline: 'none',
  },
  
  select: {
    padding: '10px 12px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '14px',
    backgroundColor: '#fff',
    cursor: 'pointer',
    outline: 'none',
  },
  
  textarea: {
    padding: '10px 12px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '14px',
    resize: 'vertical',
    minHeight: '80px',
    fontFamily: 'inherit',
    outline: 'none',
  },
};

const FormField = React.memo(({
  label,
  type = 'text',
  value,
  onChange,
  options,
  placeholder,
  required = false,
  disabled = false,
}) => {
  const handleChange = (e) => {
    onChange(e.target.value);
  };

  const renderInput = () => {
    if (type === 'select') {
      return (
        <select
          style={fieldStyles.select}
          value={value}
          onChange={handleChange}
          disabled={disabled}
        >
          <option value="">Seçiniz</option>
          {options?.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      );
    }

    if (type === 'textarea') {
      return (
        <textarea
          style={fieldStyles.textarea}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
        />
      );
    }

    return (
      <input
        style={fieldStyles.input}
        type={type}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
      />
    );
  };

  return (
    <div style={fieldStyles.container}>
      <label style={fieldStyles.label}>
        {label}
        {required && <span style={fieldStyles.required}>*</span>}
      </label>
      {renderInput()}
    </div>
  );
});

FormField.displayName = 'FormField';

FormField.propTypes = {
  label: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['text', 'tel', 'select', 'textarea']),
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(PropTypes.string),
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
};

export default FormField;
