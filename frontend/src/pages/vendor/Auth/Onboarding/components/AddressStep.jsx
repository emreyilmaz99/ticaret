import React from 'react';
import PropTypes from 'prop-types';
import { cities, cityPlateCodes } from '../../../../../data/turkeyData';

const AddressStep = ({ address, setAddress, styles }) => {
  return (
    <div style={styles.formSection}>
      <h4 style={styles.sectionTitle}>Adres Bilgisi</h4>

      <label style={styles.label}>Şehir</label>
      <select
        value={address.city}
        onChange={(e) => {
          const city = e.target.value;
          const postalCode = city && cityPlateCodes[city] ? cityPlateCodes[city] + '000' : '';
          setAddress({ ...address, city: city, postal_code: postalCode });
        }}
        style={styles.select}
      >
        <option value="">Şehir Seçiniz</option>
        {cities.map((city) => (
          <option key={city} value={city}>
            {city}
          </option>
        ))}
      </select>

      <label style={styles.label}>Açık Adres</label>
      <textarea
        value={address.address_line}
        onChange={(e) => setAddress({ ...address, address_line: e.target.value })}
        style={styles.textarea}
        placeholder="Mahalle, sokak, kapı no vb..."
      />

      <label style={styles.label}>Posta Kodu</label>
      <input
        value={address.postal_code}
        onChange={(e) => setAddress({ ...address, postal_code: e.target.value })}
        style={styles.input}
        placeholder="34000"
      />
    </div>
  );
};

AddressStep.propTypes = {
  address: PropTypes.shape({
    label: PropTypes.string,
    country: PropTypes.string,
    city: PropTypes.string,
    address_line: PropTypes.string,
    postal_code: PropTypes.string,
    is_primary: PropTypes.bool,
  }).isRequired,
  setAddress: PropTypes.func.isRequired,
  styles: PropTypes.object.isRequired,
};

export default AddressStep;
