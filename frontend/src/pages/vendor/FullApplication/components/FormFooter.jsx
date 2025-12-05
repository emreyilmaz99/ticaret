import React from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import { styles } from '../styles';

/**
 * Form footer with warning, terms and submit button
 */
const FormFooter = ({ 
  acceptTerms, 
  setAcceptTerms, 
  isFormValid, 
  isSubmitting 
}) => {
  return (
    <>
      {/* Bilgilendirme Kutusu */}
      <div style={styles.warningBox}>
        <div style={styles.warningText}>
          <strong>⚠️ Önemli:</strong> Girdiğiniz bilgiler ödeme sistemine (iyzico) kaydedilecektir. 
          Lütfen TC Kimlik, Vergi Numarası ve IBAN bilgilerinizin doğruluğundan emin olun.
        </div>
      </div>

      {/* Terms Checkbox */}
      <div style={styles.termsBox}>
        <input
          id="acceptTerms"
          type="checkbox"
          checked={acceptTerms}
          onChange={(e) => setAcceptTerms(e.target.checked)}
          style={styles.termsCheckbox}
        />
        <label htmlFor="acceptTerms" style={styles.termsLabel}>
          Tüm bilgilerin doğruluğunu kabul ediyorum ve{' '}
          <span style={styles.termsLink}>Satıcı Sözleşmesi</span>'ni okudum.
        </label>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting || !isFormValid}
        style={{
          ...styles.buttonPrimary,
          opacity: (isSubmitting || !isFormValid) ? 0.7 : 1,
          cursor: (isSubmitting || !isFormValid) ? 'not-allowed' : 'pointer'
        }}
      >
        {isSubmitting ? 'Gönderiliyor...' : 'Başvuruyu Tamamla'} <FaCheckCircle />
      </button>
    </>
  );
};

export default FormFooter;
