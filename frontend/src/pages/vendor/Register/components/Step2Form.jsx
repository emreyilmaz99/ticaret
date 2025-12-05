import React from 'react';
import { FaStore, FaPhone, FaLock, FaArrowLeft, FaCheckCircle } from 'react-icons/fa';

/**
 * Step 2 - Store Details
 */
const Step2Form = ({ 
  form, 
  updateField,
  onPhoneChange,
  onTaxIdChange,
  acceptTerms,
  setAcceptTerms,
  onBack, 
  isValid,
  isSubmitting,
  styles,
  onFocus,
  onBlur
}) => {
  return (
    <div style={styles.stepContent}>
      <div style={styles.formGroup}>
        <label style={styles.label}>Mağaza / Şirket Adı *</label>
        <div style={styles.inputWrapper}>
          <FaStore style={styles.inputIcon} />
          <input 
            style={styles.input} 
            onFocus={onFocus} 
            onBlur={onBlur}
            value={form.company_name} 
            onChange={(e) => updateField('company_name', e.target.value)} 
            required
            placeholder="Mağaza adınız" 
          />
        </div>
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Telefon Numarası *</label>
        <div style={styles.inputWrapper}>
          <FaPhone style={styles.inputIcon} />
          <input 
            style={styles.input} 
            onFocus={onFocus} 
            onBlur={onBlur}
            value={form.phone} 
            onChange={(e) => onPhoneChange(e.target.value)} 
            maxLength={10}
            required
            placeholder="05xxxxxxxxx"
          />
        </div>
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>
          Vergi Numarası <span style={styles.labelOptional}>(Opsiyonel)</span>
        </label>
        <div style={styles.inputWrapper}>
          <span style={{ ...styles.inputIcon, fontSize: '14px', fontWeight: 'bold' }}>#</span>
          <input 
            style={styles.input} 
            onFocus={onFocus} 
            onBlur={onBlur}
            value={form.tax_id} 
            onChange={(e) => onTaxIdChange(e.target.value)} 
            placeholder="Vergi numaranız"
            maxLength={10}
          />
        </div>
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Şifre</label>
        <div style={styles.inputWrapper}>
          <FaLock style={styles.inputIcon} />
          <input 
            type="password"
            style={styles.input} 
            onFocus={onFocus} 
            onBlur={onBlur}
            value={form.password} 
            onChange={(e) => updateField('password', e.target.value)} 
            required
            placeholder="En az 8 karakter" 
            minLength={8}
          />
        </div>
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Şifre Tekrar</label>
        <div style={styles.inputWrapper}>
          <FaLock style={styles.inputIcon} />
          <input 
            type="password"
            style={styles.input} 
            onFocus={onFocus} 
            onBlur={onBlur}
            value={form.password_confirmation} 
            onChange={(e) => updateField('password_confirmation', e.target.value)} 
            required
            placeholder="Şifrenizi tekrar girin" 
          />
        </div>
      </div>

      <div style={styles.termsBox}>
        <input 
          id="acceptTerms" 
          type="checkbox" 
          checked={acceptTerms} 
          onChange={(e) => setAcceptTerms(e.target.checked)} 
          style={styles.termsCheckbox} 
        />
        <label htmlFor="acceptTerms" style={styles.termsLabel}>
          <span style={styles.termsLink}>Kullanım Şartları</span> ve{' '}
          <span style={styles.termsLink}>Gizlilik Politikası</span>'nı okudum ve kabul ediyorum.
        </label>
      </div>

      <div style={styles.buttonRow}>
        <button 
          type="button" 
          onClick={onBack} 
          style={styles.buttonSecondary}
        >
          <FaArrowLeft />
        </button>
        <button 
          type="submit" 
          disabled={isSubmitting || !isValid} 
          style={{ 
            ...styles.buttonPrimary, 
            flex: 1, 
            ...((isSubmitting || !isValid) ? styles.buttonDisabled : {})
          }}
        >
          {isSubmitting ? 'İşleniyor...' : 'Başvuruyu Tamamla'} <FaCheckCircle />
        </button>
      </div>
    </div>
  );
};

export default Step2Form;
