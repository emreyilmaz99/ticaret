import React from 'react';
import { FaUser, FaStore, FaLink, FaPhone } from 'react-icons/fa';
import FormField from './FormField';
import { styles } from '../styles';

/**
 * Basic information fields section
 */
const BasicInfoSection = ({
  form,
  updateField,
  onCompanyNameChange,
  onSlugChange,
  onPhoneChange,
  onFocus,
  onBlur
}) => {
  return (
    <>
      <FormField
        label="Ad Soyad *"
        icon={FaUser}
        value={form.full_name}
        onChange={(e) => updateField('full_name', e.target.value)}
        placeholder="Ad ve soyadınız"
        required
        onFocus={onFocus}
        onBlur={onBlur}
      />

      <FormField
        label="Şirket / Mağaza Adı *"
        icon={FaStore}
        value={form.company_name}
        onChange={(e) => onCompanyNameChange(e.target.value)}
        placeholder="Resmi şirket adı"
        required
        onFocus={onFocus}
        onBlur={onBlur}
      />

      <div style={styles.formGroup}>
        <FormField
          label="Mağaza URL (Slug) *"
          icon={FaLink}
          value={form.slug}
          onChange={(e) => onSlugChange(e.target.value)}
          placeholder="magaza-adi"
          required
          onFocus={onFocus}
          onBlur={onBlur}
        />
        <small style={styles.inputHint}>
          Site adresiniz: yoursite.com/vendor/{form.slug || 'magaza-adi'}
        </small>
      </div>

      <FormField
        label="Telefon *"
        icon={FaPhone}
        value={form.phone}
        onChange={(e) => onPhoneChange(e.target.value)}
        placeholder="5XX XXX XX XX"
        maxLength={10}
        required
        onFocus={onFocus}
        onBlur={onBlur}
      />
    </>
  );
};

export default BasicInfoSection;
