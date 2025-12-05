import React from 'react';
import { FaMapMarkerAlt, FaCity, FaMailBulk } from 'react-icons/fa';
import FormField from './FormField';
import { cities, cityPlateCodes } from '../../../../data/turkeyData';
import { styles } from '../styles';

/**
 * Address information section
 */
const AddressSection = ({
  form,
  updateField,
  onCityChange,
  onFocus,
  onBlur
}) => {
  return (
    <>
      <div style={styles.sectionTitle}>
        📍 Adres Bilgileri
      </div>

      <FormField
        label="Adres *"
        icon={FaMapMarkerAlt}
        value={form.address}
        onChange={(e) => updateField('address', e.target.value)}
        placeholder="Mahalle, cadde, sokak, bina no, daire no"
        required
        onFocus={onFocus}
        onBlur={onBlur}
      />

      <div style={styles.gridTwo}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Şehir *</label>
          <div style={styles.inputWrapper}>
            <FaCity style={styles.inputIcon} />
            <select
              style={styles.input}
              value={form.city}
              onChange={(e) => onCityChange(e.target.value, cityPlateCodes)}
              onFocus={onFocus}
              onBlur={onBlur}
              required
            >
              <option value="">Şehir Seçiniz</option>
              {cities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>
        </div>

        <FormField
          label="İlçe"
          icon={FaCity}
          value={form.district}
          onChange={(e) => updateField('district', e.target.value)}
          placeholder="İlçe adı"
          onFocus={onFocus}
          onBlur={onBlur}
        />
      </div>

      <FormField
        label="Posta Kodu"
        icon={FaMailBulk}
        value={form.postal_code}
        onChange={(e) => updateField('postal_code', e.target.value)}
        placeholder="34000"
        onFocus={onFocus}
        onBlur={onBlur}
      />
    </>
  );
};

export default AddressSection;
