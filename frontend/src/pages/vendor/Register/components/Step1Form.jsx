import React from 'react';
import { FaUser, FaEnvelope, FaArrowRight } from 'react-icons/fa';

/**
 * Step 1 - Account Information
 */
const Step1Form = ({ 
  form, 
  updateField, 
  onNext, 
  isValid, 
  styles,
  onFocus,
  onBlur
}) => {
  return (
    <div style={styles.stepContent}>
      <div style={styles.formGroup}>
        <label style={styles.label}>Ad Soyad</label>
        <div style={styles.inputWrapper}>
          <FaUser style={styles.inputIcon} />
          <input 
            style={styles.input} 
            onFocus={onFocus} 
            onBlur={onBlur}
            value={form.full_name} 
            onChange={(e) => updateField('full_name', e.target.value)} 
            required 
            placeholder="Ad ve soyadınız" 
          />
        </div>
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>E-posta Adresi</label>
        <div style={styles.inputWrapper}>
          <FaEnvelope style={styles.inputIcon} />
          <input 
            type="email"
            style={styles.input} 
            onFocus={onFocus} 
            onBlur={onBlur}
            value={form.email} 
            onChange={(e) => updateField('email', e.target.value)} 
            required 
            placeholder="ornek@sirket.com" 
          />
        </div>
      </div>

      <button 
        type="button" 
        onClick={onNext} 
        disabled={!isValid}
        style={{ 
          ...styles.buttonPrimary, 
          ...(isValid ? {} : styles.buttonDisabled) 
        }}
      >
        Devam Et <FaArrowRight />
      </button>
    </div>
  );
};

export default Step1Form;
