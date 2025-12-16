import React from 'react';
import PropTypes from 'prop-types';

const BankAccountStep = ({ bank, setBank, styles }) => {
  return (
    <div style={styles.formSection}>
      <h4 style={styles.sectionTitle}>Banka Hesabı</h4>

      <label style={styles.label}>Banka Adı</label>
      <input
        value={bank.bank_name}
        onChange={(e) => setBank({ ...bank, bank_name: e.target.value })}
        style={styles.input}
        placeholder="Örn: Ziraat Bankası"
      />

      <label style={styles.label}>Hesap Sahibi</label>
      <input
        value={bank.account_holder}
        onChange={(e) => setBank({ ...bank, account_holder: e.target.value })}
        style={styles.input}
        placeholder="Ad Soyad veya Şirket Ünvanı"
      />

      <label style={styles.label}>IBAN</label>
      <input
        value={bank.iban}
        onChange={(e) => setBank({ ...bank, iban: e.target.value })}
        style={styles.input}
        placeholder="TRXX XXXX XXXX XXXX XXXX XXXX XX"
      />
    </div>
  );
};

BankAccountStep.propTypes = {
  bank: PropTypes.shape({
    bank_name: PropTypes.string,
    account_holder: PropTypes.string,
    iban: PropTypes.string,
    currency: PropTypes.string,
    is_primary: PropTypes.bool,
  }).isRequired,
  setBank: PropTypes.func.isRequired,
  styles: PropTypes.object.isRequired,
};

export default BankAccountStep;
