// src/pages/user/UserAddresses/components/AddressForm.jsx
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { FaTimes, FaUser, FaPhone, FaCity, FaHome, FaIdCard, FaSearch, FaChevronDown } from 'react-icons/fa';
import { cities, getDistricts } from '../../../../data/turkeyData';

const ADDRESS_LABELS = ['Ev', 'İş', 'Diğer'];

// Arama destekli dropdown bileşeni
const SearchableSelect = ({ 
  label, 
  value, 
  options, 
  onChange, 
  placeholder, 
  icon: Icon, 
  styles, 
  disabled = false 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = useMemo(() => {
    if (!searchTerm) return options;
    const search = searchTerm.toLowerCase();
    return options.filter(option => option.toLowerCase().includes(search));
  }, [options, searchTerm]);

  const handleSelect = (option) => {
    onChange(option);
    setIsOpen(false);
    setSearchTerm('');
  };

  const dropdownStyles = {
    wrapper: {
      position: 'relative',
    },
    selectBox: {
      display: 'flex',
      alignItems: 'center',
      padding: '14px 16px',
      borderRadius: '12px',
      border: '1px solid #e2e8f0',
      backgroundColor: disabled ? '#f1f5f9' : '#f8fafc',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.6 : 1,
      gap: '12px',
    },
    icon: {
      color: '#94a3b8',
      fontSize: '14px',
      flexShrink: 0,
    },
    value: {
      flex: 1,
      fontSize: '14px',
      fontWeight: '500',
      color: value ? '#1e293b' : '#94a3b8',
    },
    chevron: {
      color: '#94a3b8',
      fontSize: '12px',
      transform: isOpen ? 'rotate(180deg)' : 'rotate(0)',
      transition: 'transform 0.2s ease',
    },
    dropdown: {
      position: 'absolute',
      top: 'calc(100% + 4px)',
      left: 0,
      right: 0,
      backgroundColor: 'white',
      borderRadius: '12px',
      border: '1px solid #e2e8f0',
      boxShadow: '0 10px 40px rgba(0,0,0,0.12)',
      zIndex: 100,
      overflow: 'hidden',
    },
    searchBox: {
      display: 'flex',
      alignItems: 'center',
      padding: '12px 16px',
      borderBottom: '1px solid #f1f5f9',
      gap: '10px',
    },
    searchInput: {
      flex: 1,
      border: 'none',
      outline: 'none',
      fontSize: '14px',
      backgroundColor: 'transparent',
      color: '#1e293b',
    },
    optionsList: {
      maxHeight: '200px',
      overflowY: 'auto',
    },
    option: {
      padding: '12px 16px',
      fontSize: '14px',
      cursor: 'pointer',
      transition: 'background-color 0.15s ease',
    },
    noResults: {
      padding: '16px',
      textAlign: 'center',
      color: '#94a3b8',
      fontSize: '14px',
    },
  };

  return (
    <div style={dropdownStyles.wrapper} ref={wrapperRef}>
      <label style={styles.label}>{label}</label>
      <div style={dropdownStyles.selectBox} onClick={() => !disabled && setIsOpen(!isOpen)}>
        {Icon && <Icon style={dropdownStyles.icon} />}
        <span style={dropdownStyles.value}>{value || placeholder}</span>
        <FaChevronDown style={dropdownStyles.chevron} />
      </div>
      
      {isOpen && (
        <div style={dropdownStyles.dropdown}>
          <div style={dropdownStyles.searchBox}>
            <FaSearch style={dropdownStyles.icon} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Ara..."
              style={dropdownStyles.searchInput}
              autoFocus
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          
          <div style={dropdownStyles.optionsList}>
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <div
                  key={option}
                  style={{
                    ...dropdownStyles.option,
                    backgroundColor: option === value ? '#ecfdf5' : 'transparent',
                    color: option === value ? '#059669' : '#334155',
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelect(option);
                  }}
                  onMouseEnter={(e) => {
                    if (option !== value) e.target.style.backgroundColor = '#f8fafc';
                  }}
                  onMouseLeave={(e) => {
                    if (option !== value) e.target.style.backgroundColor = 'transparent';
                  }}
                >
                  {option}
                </div>
              ))
            ) : (
              <div style={dropdownStyles.noResults}>Sonuç bulunamadı</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export const AddressForm = ({ form, setForm, onSubmit, onCancel, editingId, styles }) => {
  // İlçe listesi - seçilen ile göre değişir
  const districtOptions = useMemo(() => {
    return form.city ? getDistricts(form.city) : [];
  }, [form.city]);

  const handlePhoneChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 0 && value[0] !== '0') {
      value = '0' + value;
    }
    if (value.length > 11) {
      value = value.slice(0, 11);
    }
    setForm({ ...form, phone: value });
  };

  const handleIdentityChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 11) {
      setForm({ ...form, identity_number: value });
    }
  };

  const handleCityChange = (city) => {
    setForm({ ...form, city, district: '' }); // İl değişince ilçeyi sıfırla
  };

  const handleDistrictChange = (district) => {
    setForm({ ...form, district });
  };

  return (
    <div style={styles.formCard}>
      <div style={styles.formHeader}>
        <h3 style={styles.formTitle}>
          {editingId ? 'Adresi Düzenle' : 'Yeni Adres Ekle'}
        </h3>
        <button onClick={onCancel} style={styles.closeButton}>
          <FaTimes />
        </button>
      </div>

      <form onSubmit={onSubmit}>
        <div style={styles.labelSelector}>
          {ADDRESS_LABELS.map(label => (
            <div
              key={label}
              onClick={() => setForm({...form, label})}
              style={{
                ...styles.labelOption,
                ...(form.label === label ? styles.labelOptionActive : {})
              }}
            >
              {label}
            </div>
          ))}
        </div>

        <div style={styles.grid}>
          <div>
            <label style={styles.label}>Ad Soyad</label>
            <div style={styles.inputWrapper}>
              <FaUser style={styles.inputIcon} />
              <input
                type="text"
                value={form.full_name}
                onChange={(e) => setForm({...form, full_name: e.target.value})}
                style={styles.input}
                placeholder="Adınız Soyadınız"
                required
              />
            </div>
          </div>
          <div>
            <label style={styles.label}>TC Kimlik No</label>
            <div style={styles.inputWrapper}>
              <FaIdCard style={styles.inputIcon} />
              <input
                type="text"
                value={form.identity_number || ''}
                onChange={handleIdentityChange}
                style={styles.input}
                placeholder="11 Haneli TC Kimlik No"
                maxLength={11}
                required
              />
            </div>
          </div>
        </div>

        <div style={styles.grid}>
          <div>
            <label style={styles.label}>Telefon</label>
            <div style={styles.inputWrapper}>
              <FaPhone style={styles.inputIcon} />
              <input
                type="tel"
                value={form.phone}
                onChange={handlePhoneChange}
                style={styles.input}
                placeholder="05XX XXX XX XX"
                maxLength={11}
                required
              />
            </div>
          </div>
          <SearchableSelect
            label="İl"
            value={form.city}
            options={cities}
            onChange={handleCityChange}
            placeholder="İl seçiniz"
            icon={FaCity}
            styles={styles}
          />
        </div>

        <div style={styles.grid}>
          <SearchableSelect
            label="İlçe"
            value={form.district}
            options={districtOptions}
            onChange={handleDistrictChange}
            placeholder={form.city ? "İlçe seçiniz" : "Önce il seçin"}
            icon={FaHome}
            styles={styles}
            disabled={!form.city}
          />
          <div>
            <label style={styles.label}>Mahalle / Semt</label>
            <input
              type="text"
              value={form.neighborhood}
              onChange={(e) => setForm({...form, neighborhood: e.target.value})}
              style={{...styles.input, paddingLeft: '16px'}}
              placeholder="Mahalle"
              required
            />
          </div>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={styles.label}>Adres Detayı</label>
          <textarea
            value={form.address_line}
            onChange={(e) => setForm({...form, address_line: e.target.value})}
            style={{...styles.input, paddingLeft: '16px', minHeight: '80px', resize: 'vertical'}}
            placeholder="Cadde, sokak, bina no, daire no..."
            required
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={styles.label}>Posta Kodu</label>
          <input
            type="text"
            value={form.postal_code}
            onChange={(e) => setForm({...form, postal_code: e.target.value})}
            style={{...styles.input, paddingLeft: '16px'}}
            placeholder="34000"
          />
        </div>

        <div style={styles.checkboxContainer}>
          <label style={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={form.is_default}
              onChange={(e) => setForm({...form, is_default: e.target.checked})}
              style={styles.checkbox}
            />
            <span>Varsayılan adres olarak ayarla</span>
          </label>
        </div>

        <button type="submit" style={styles.submitButton}>
          {editingId ? 'Güncelle' : 'Kaydet'}
        </button>
      </form>
    </div>
  );
};
