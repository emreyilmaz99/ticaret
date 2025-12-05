// src/pages/vendor/Settings/components/GeneralTab.jsx
import React from 'react';
import { FaUser, FaStore, FaPhone, FaIdCard, FaEnvelope, FaImage, FaCamera, FaTimes, FaSave, FaSpinner } from 'react-icons/fa';
import { styles } from '../styles';

const GeneralTab = ({
  vendor,
  form,
  setForm,
  logoPreview,
  handleLogoChange,
  removeLogo,
  onSubmit,
  isSaving
}) => {
  return (
    <form onSubmit={onSubmit}>
      <div style={styles.card}>
        {/* Logo Upload */}
        <div style={styles.logoSection}>
          <label style={styles.label}>Mağaza Logosu</label>
          <div style={styles.logoWrapper}>
            <div style={styles.logoPreview}>
              {logoPreview ? (
                <img src={logoPreview} alt="Logo" style={styles.logoImage} />
              ) : (
                <FaImage size={24} />
              )}
            </div>
            <div>
              <label style={styles.uploadBtn}>
                <FaCamera /> Logo Yükle
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleLogoChange} 
                  style={{ display: 'none' }} 
                />
              </label>
              {logoPreview && (
                <button type="button" onClick={removeLogo} style={styles.removeBtn}>
                  <FaTimes /> Kaldır
                </button>
              )}
              <p style={styles.helpText}>Önerilen boyut: 400x400px. Max: 2MB</p>
            </div>
          </div>
        </div>

        {/* Name & Company */}
        <div style={styles.formGrid}>
          <div>
            <label style={styles.label}>Yetkili Ad Soyad</label>
            <div style={{ position: 'relative' }}>
              <FaUser style={styles.inputIcon} />
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                style={styles.input}
                placeholder="Ad Soyad"
              />
            </div>
          </div>
          <div>
            <label style={styles.label}>Mağaza / Şirket Adı</label>
            <div style={{ position: 'relative' }}>
              <FaStore style={styles.inputIcon} />
              <input
                type="text"
                value={form.company_name}
                onChange={(e) => setForm({ ...form, company_name: e.target.value })}
                style={styles.input}
                placeholder="Şirket Adı"
              />
            </div>
          </div>
        </div>

        {/* Phone & Tax ID */}
        <div style={styles.formGrid}>
          <div>
            <label style={styles.label}>Telefon</label>
            <div style={{ position: 'relative' }}>
              <FaPhone style={styles.inputIcon} />
              <input
                type="text"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                maxLength={10}
                style={styles.input}
                placeholder="5XX XXX XX XX"
              />
            </div>
          </div>
          <div>
            <label style={styles.label}>Vergi Numarası</label>
            <div style={{ position: 'relative' }}>
              <FaIdCard style={styles.inputIcon} />
              <input
                type="text"
                value={form.tax_id}
                onChange={(e) => setForm({ ...form, tax_id: e.target.value })}
                style={styles.input}
                placeholder="Vergi No"
              />
            </div>
          </div>
        </div>

        {/* Email (disabled) */}
        <div style={{ marginBottom: '24px' }}>
          <label style={styles.label}>E-posta Adresi</label>
          <div style={{ position: 'relative' }}>
            <FaEnvelope style={styles.inputIcon} />
            <input
              type="email"
              value={vendor?.email || ''}
              disabled
              style={{ ...styles.input, ...styles.inputDisabled }}
            />
          </div>
          <p style={styles.helpText}>E-posta adresi değiştirilemez.</p>
        </div>

        {/* Submit */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            type="submit"
            disabled={isSaving}
            style={{
              ...styles.submitBtn,
              ...(isSaving ? styles.submitBtnDisabled : {})
            }}
          >
            {isSaving ? <FaSpinner className="spin" /> : <FaSave />}
            {isSaving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
          </button>
        </div>
      </div>
    </form>
  );
};

export default GeneralTab;
