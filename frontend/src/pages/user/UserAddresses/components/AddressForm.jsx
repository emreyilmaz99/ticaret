// src/pages/user/UserAddresses/components/AddressForm.jsx
import React from 'react';
import { FaTimes, FaUser, FaPhone, FaCity, FaHome } from 'react-icons/fa';
import { cityPlateCodes } from '../../../../data/turkeyData';

const TURKEY_CITIES = [
  'Adana', 'Adıyaman', 'Afyonkarahisar', 'Ağrı', 'Aksaray', 'Amasya', 'Ankara', 'Antalya', 'Ardahan', 'Artvin',
  'Aydın', 'Balıkesir', 'Bartın', 'Batman', 'Bayburt', 'Bilecik', 'Bingöl', 'Bitlis', 'Bolu', 'Burdur',
  'Bursa', 'Çanakkale', 'Çankırı', 'Çorum', 'Denizli', 'Diyarbakır', 'Düzce', 'Edirne', 'Elazığ', 'Erzincan',
  'Erzurum', 'Eskişehir', 'Gaziantep', 'Giresun', 'Gümüşhane', 'Hakkari', 'Hatay', 'Iğdır', 'Isparta', 'İstanbul',
  'İzmir', 'Kahramanmaraş', 'Karabük', 'Karaman', 'Kars', 'Kastamonu', 'Kayseri', 'Kırıkkale', 'Kırklareli', 'Kırşehir',
  'Kilis', 'Kocaeli', 'Konya', 'Kütahya', 'Malatya', 'Manisa', 'Mardin', 'Mersin', 'Muğla', 'Muş',
  'Nevşehir', 'Niğde', 'Ordu', 'Osmaniye', 'Rize', 'Sakarya', 'Samsun', 'Siirt', 'Sinop', 'Sivas',
  'Şanlıurfa', 'Şırnak', 'Tekirdağ', 'Tokat', 'Trabzon', 'Tunceli', 'Uşak', 'Van', 'Yalova', 'Yozgat', 'Zonguldak'
];

const ADDRESS_LABELS = ['Ev', 'İş', 'Aile', 'Diğer'];

export const AddressForm = ({ form, setForm, onSubmit, onCancel, editingId, styles }) => {
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
            <label style={styles.label}>Telefon</label>
            <div style={styles.inputWrapper}>
              <FaPhone style={styles.inputIcon} />
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({...form, phone: e.target.value})}
                style={styles.input}
                placeholder="5XX XXX XX XX"
                required
              />
            </div>
          </div>
        </div>

        <div style={styles.grid}>
          <div>
            <label style={styles.label}>İl</label>
            <div style={styles.inputWrapper}>
              <FaCity style={styles.inputIcon} />
              <select
                value={form.city}
                onChange={(e) => setForm({...form, city: e.target.value})}
                style={styles.input}
                required
              >
                <option value="">Seçiniz</option>
                {TURKEY_CITIES.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label style={styles.label}>İlçe</label>
            <div style={styles.inputWrapper}>
              <FaHome style={styles.inputIcon} />
              <input
                type="text"
                value={form.district}
                onChange={(e) => setForm({...form, district: e.target.value})}
                style={styles.input}
                placeholder="İlçe"
                required
              />
            </div>
          </div>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={styles.label}>Mahalle / Semt</label>
          <input
            type="text"
            value={form.neighborhood}
            onChange={(e) => setForm({...form, neighborhood: e.target.value})}
            style={{...styles.input, paddingLeft: '12px'}}
            placeholder="Mahalle"
            required
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={styles.label}>Adres Detayı</label>
          <textarea
            value={form.address_line}
            onChange={(e) => setForm({...form, address_line: e.target.value})}
            style={{...styles.input, paddingLeft: '12px', minHeight: '80px', resize: 'vertical'}}
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
            style={{...styles.input, paddingLeft: '12px'}}
            placeholder="34000"
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={form.is_default}
              onChange={(e) => setForm({...form, is_default: e.target.checked})}
            />
            <span style={{ fontSize: '14px', color: '#475569' }}>Varsayılan adres olarak ayarla</span>
          </label>
        </div>

        <button type="submit" style={styles.submitButton}>
          {editingId ? 'Güncelle' : 'Kaydet'}
        </button>
      </form>
    </div>
  );
};
