import React from 'react';
import { FaIdCard, FaUserTie, FaFileInvoice, FaBuilding } from 'react-icons/fa';
import FormField from './FormField';
import { styles } from '../styles';

/**
 * Dynamic fields based on merchant type
 */
const MerchantTypeFields = ({
  merchantType,
  form,
  updateField,
  onIdentityChange,
  onTaxIdChange,
  onFocus,
  onBlur
}) => {
  if (!merchantType) return null;

  const isPersonal = merchantType === 'personal';
  const isPrivateCompany = merchantType === 'private_company';
  const isLimitedCompany = merchantType === 'limited_company';

  return (
    <>
      <div style={styles.sectionTitle}>
        📋 {isPersonal ? 'Kişisel Bilgiler' : 'Şirket Bilgileri'}
      </div>

      {/* TC Kimlik - Personal ve Private Company için zorunlu */}
      {(isPersonal || isPrivateCompany) && (
        <FormField
          label="TC Kimlik Numarası *"
          icon={FaIdCard}
          value={form.identity_number}
          onChange={(e) => onIdentityChange(e.target.value)}
          placeholder="11 haneli TC Kimlik No"
          maxLength={11}
          required
          onFocus={onFocus}
          onBlur={onBlur}
        />
      )}

      {/* İletişim Kişisi - Sadece Personal için zorunlu */}
      {isPersonal && (
        <div style={styles.gridTwo}>
          <FormField
            label="İletişim Kişisi Adı *"
            icon={FaUserTie}
            value={form.contact_name}
            onChange={(e) => updateField('contact_name', e.target.value)}
            placeholder="Ad"
            required
            onFocus={onFocus}
            onBlur={onBlur}
          />
          <FormField
            label="İletişim Kişisi Soyadı *"
            icon={FaUserTie}
            value={form.contact_surname}
            onChange={(e) => updateField('contact_surname', e.target.value)}
            placeholder="Soyad"
            required
            onFocus={onFocus}
            onBlur={onBlur}
          />
        </div>
      )}

      {/* Vergi Numarası - Sadece Limited için zorunlu */}
      {isLimitedCompany && (
        <FormField
          label="Vergi Numarası *"
          icon={FaFileInvoice}
          value={form.tax_id}
          onChange={(e) => onTaxIdChange(e.target.value)}
          placeholder="10 haneli Vergi No"
          maxLength={10}
          required
          onFocus={onFocus}
          onBlur={onBlur}
        />
      )}

      {/* Vergi Dairesi ve Yasal Ünvan - Private ve Limited için zorunlu */}
      {(isPrivateCompany || isLimitedCompany) && (
        <>
          <FormField
            label="Vergi Dairesi *"
            icon={FaBuilding}
            value={form.tax_office}
            onChange={(e) => updateField('tax_office', e.target.value)}
            placeholder="Örn: Kadıköy Vergi Dairesi"
            required
            onFocus={onFocus}
            onBlur={onBlur}
          />
          <FormField
            label="Yasal Şirket Ünvanı *"
            icon={FaBuilding}
            value={form.legal_company_title}
            onChange={(e) => updateField('legal_company_title', e.target.value)}
            placeholder="Ticaret sicilindeki tam ünvan"
            required
            onFocus={onFocus}
            onBlur={onBlur}
          />
        </>
      )}
    </>
  );
};

export default MerchantTypeFields;
