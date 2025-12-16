// src/components/modals/AddressModal/components/AddressFormFields.jsx
import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import FormField from './FormField';
import { cities, getDistricts, getNeighborhoods } from '../../../../data/turkeyData';
import { styles } from '../styles';

const AddressFormFields = React.memo(({
  formData,
  onFieldChange,
  onCityChange,
  onDistrictChange,
  formatPhone,
  formatIdentityNumber,
}) => {
  const districts = useMemo(
    () => (formData.city ? getDistricts(formData.city) : []),
    [formData.city]
  );

  const neighborhoods = useMemo(
    () => (formData.district ? getNeighborhoods(formData.city, formData.district) : []),
    [formData.city, formData.district]
  );

  return (
    <div style={styles.formSection}>
      <div style={styles.formGrid}>
        <FormField
          label="Ad Soyad"
          value={formData.fullName}
          onChange={(val) => onFieldChange('fullName', val)}
          placeholder="Adınız ve Soyadınız"
          required
        />
        
        <FormField
          label="Telefon"
          type="tel"
          value={formData.phone}
          onChange={(val) => onFieldChange('phone', formatPhone(val))}
          placeholder="5XX XXX XX XX"
          required
        />
      </div>

      <div style={{ marginTop: '16px' }}>
        <FormField
          label="TC Kimlik No"
          value={formData.identityNumber}
          onChange={(val) => onFieldChange('identityNumber', formatIdentityNumber(val))}
          placeholder="11 haneli TC Kimlik Numarası"
          required
        />
      </div>

      <div style={{ ...styles.formGrid, marginTop: '16px' }}>
        <FormField
          label="İl"
          type="select"
          value={formData.city}
          onChange={onCityChange}
          options={cities}
          required
        />
        
        <FormField
          label="İlçe"
          type="select"
          value={formData.district}
          onChange={onDistrictChange}
          options={districts}
          disabled={!formData.city}
          required
        />
        
        <FormField
          label="Mahalle"
          type="select"
          value={formData.neighborhood}
          onChange={(val) => onFieldChange('neighborhood', val)}
          options={neighborhoods}
          disabled={!formData.district}
          required
        />
      </div>

      <div style={{ ...styles.formGrid, marginTop: '16px' }}>
        <FormField
          label="Posta Kodu"
          value={formData.postalCode}
          onChange={(val) => onFieldChange('postalCode', val)}
          placeholder="34000"
        />
        
        <FormField
          label="Adres Etiketi"
          value={formData.addressLabel}
          onChange={(val) => onFieldChange('addressLabel', val)}
          placeholder="Ev, İş, vb."
          required
        />
      </div>

      <div style={{ marginTop: '16px' }}>
        <FormField
          label="Açık Adres"
          type="textarea"
          value={formData.addressLine}
          onChange={(val) => onFieldChange('addressLine', val)}
          placeholder="Cadde, sokak, bina no, daire no vb."
          required
        />
      </div>
    </div>
  );
});

AddressFormFields.displayName = 'AddressFormFields';

AddressFormFields.propTypes = {
  formData: PropTypes.shape({
    fullName: PropTypes.string.isRequired,
    phone: PropTypes.string.isRequired,
    identityNumber: PropTypes.string.isRequired,
    city: PropTypes.string.isRequired,
    district: PropTypes.string.isRequired,
    neighborhood: PropTypes.string.isRequired,
    postalCode: PropTypes.string.isRequired,
    addressLine: PropTypes.string.isRequired,
    addressLabel: PropTypes.string.isRequired,
  }).isRequired,
  onFieldChange: PropTypes.func.isRequired,
  onCityChange: PropTypes.func.isRequired,
  onDistrictChange: PropTypes.func.isRequired,
  formatPhone: PropTypes.func.isRequired,
  formatIdentityNumber: PropTypes.func.isRequired,
};

export default AddressFormFields;
