import React from 'react';
import { FaUniversity, FaUser, FaCreditCard } from 'react-icons/fa';
import FormField from './FormField';
import { styles } from '../styles';

/**
 * Bank account information section
 */
const BankSection = ({
  form,
  updateField,
  onIbanChange,
  onFocus,
  onBlur
}) => {
  return (
    <>
      <div style={styles.sectionTitle}>
        🏦 Banka Hesap Bilgileri
      </div>

      <FormField
        label="Banka Adı *"
        icon={FaUniversity}
        value={form.bank_name}
        onChange={(e) => updateField('bank_name', e.target.value)}
        placeholder="Örn: Ziraat Bankası, Garanti BBVA"
        required
        onFocus={onFocus}
        onBlur={onBlur}
      />

      <FormField
        label="Hesap Sahibi *"
        icon={FaUser}
        value={form.account_holder}
        onChange={(e) => updateField('account_holder', e.target.value)}
        placeholder="Hesap sahibinin adı soyadı"
        required
        onFocus={onFocus}
        onBlur={onBlur}
      />

      <div style={styles.formGroup}>
        <FormField
          label="IBAN *"
          icon={FaCreditCard}
          value={form.iban}
          onChange={(e) => onIbanChange(e.target.value)}
          placeholder="TR00 0000 0000 0000 0000 0000 00"
          maxLength={26}
          required
          onFocus={onFocus}
          onBlur={onBlur}
        />
        <small style={styles.inputHint}>
          Ödemeleriniz bu hesaba aktarılacaktır. IBAN "TR" ile başlamalıdır.
        </small>
      </div>
    </>
  );
};

export default BankSection;
