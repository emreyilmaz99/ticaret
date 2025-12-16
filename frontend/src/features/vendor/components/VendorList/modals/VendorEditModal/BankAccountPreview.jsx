// src/features/vendor/components/VendorList/modals/VendorEditModal/BankAccountPreview.jsx
import React from 'react';
import PropTypes from 'prop-types';

const BankAccountPreview = React.memo(({ bankAccounts }) => {
  if (!bankAccounts || bankAccounts.length === 0) {
    return <div style={{ color: '#64748b' }}>Banka hesabı bulunmuyor</div>;
  }

  return (
    <div>
      {bankAccounts.map((account, idx) => (
        <div
          key={idx}
          style={{
            padding: '10px',
            border: '1px solid #e6eef8',
            borderRadius: '8px',
            marginBottom: '8px',
          }}
        >
          <div style={{ fontWeight: '600' }}>
            {account.bank_name || 'Banka'}
            {account.is_primary && ' (Varsayılan)'}
          </div>
          <div style={{ fontSize: '13px', color: '#475569' }}>
            {account.iban || account.account_number || ''}
          </div>
        </div>
      ))}
    </div>
  );
});

BankAccountPreview.displayName = 'BankAccountPreview';

BankAccountPreview.propTypes = {
  bankAccounts: PropTypes.arrayOf(
    PropTypes.shape({
      bank_name: PropTypes.string,
      iban: PropTypes.string,
      account_number: PropTypes.string,
      is_primary: PropTypes.bool,
    })
  ),
};

export default BankAccountPreview;
