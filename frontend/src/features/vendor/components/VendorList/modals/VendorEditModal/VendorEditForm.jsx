// src/features/vendor/components/VendorList/modals/VendorEditModal/VendorEditForm.jsx
import React from 'react';
import PropTypes from 'prop-types';
import AddressPreview from './AddressPreview';
import BankAccountPreview from './BankAccountPreview';
import { formStyles } from './styles';

const VendorEditForm = React.memo(({ formData, onFieldChange, onSubmit, isSubmitting }) => {
  const updateField = (field, value) => {
    onFieldChange(field, value);
  };

  return (
    <form onSubmit={onSubmit}>
      <div style={formStyles.grid}>
        <div>
          <label style={formStyles.label}>Mağaza Adı</label>
          <input
            value={formData.name}
            onChange={(e) => updateField('name', e.target.value)}
            style={formStyles.input}
          />
        </div>
        <div>
          <label style={formStyles.label}>E-posta</label>
          <input
            value={formData.email}
            onChange={(e) => updateField('email', e.target.value)}
            style={formStyles.input}
          />
        </div>
        <div>
          <label style={formStyles.label}>Telefon</label>
          <input
            value={formData.phone}
            onChange={(e) => updateField('phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
            maxLength={10}
            style={formStyles.input}
          />
        </div>
        <div>
          <label style={formStyles.label}>
            Komisyon (%) - {formData.commission_plan_name}
          </label>
          <input
            type="number"
            value={formData.commission_rate}
            readOnly
            disabled
            style={formStyles.inputDisabled}
          />
          <small style={formStyles.helpText}>
            Komisyon oranı, atanmış komisyon planından gelmektedir.
          </small>
        </div>
        <div style={formStyles.fullWidth}>
          <label style={formStyles.label}>Durum</label>
          <select
            value={formData.status}
            onChange={(e) => updateField('status', e.target.value)}
            style={formStyles.input}
          >
            <option value="pre_pending">Ön Başvuru - Beklemede</option>
            <option value="pre_approved">Ön Başvuru - Onaylandı</option>
            <option value="pre_rejected">Ön Başvuru - Reddedildi</option>
            <option value="pending">Onay Bekliyor</option>
            <option value="active">Aktif</option>
            <option value="inactive">Pasif</option>
            <option value="banned">Yasaklı</option>
          </select>
        </div>
      </div>

      {/* Addresses Preview */}
      <div style={{ marginTop: '18px' }}>
        <h4 style={{ margin: '8px 0', fontSize: '14px' }}>Adresler</h4>
        <AddressPreview addresses={formData.addresses} />
      </div>

      {/* Bank accounts Preview */}
      <div style={{ marginTop: '12px' }}>
        <h4 style={{ margin: '8px 0', fontSize: '14px' }}>Banka Hesapları</h4>
        <BankAccountPreview bankAccounts={formData.bank_accounts} />
      </div>
    </form>
  );
});

VendorEditForm.displayName = 'VendorEditForm';

VendorEditForm.propTypes = {
  formData: PropTypes.shape({
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    phone: PropTypes.string.isRequired,
    commission_rate: PropTypes.number,
    commission_plan_name: PropTypes.string,
    status: PropTypes.string.isRequired,
    addresses: PropTypes.array,
    bank_accounts: PropTypes.array,
  }).isRequired,
  onFieldChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool,
};

export default VendorEditForm;
