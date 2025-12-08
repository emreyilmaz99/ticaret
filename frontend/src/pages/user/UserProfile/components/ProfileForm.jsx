// src/pages/user/UserProfile/components/ProfileForm.jsx
import React from 'react';
import { FaSave, FaSpinner } from 'react-icons/fa';

export const ProfileForm = ({ form, setForm, onSubmit, isSaving, styles }) => {
  return (
    <form onSubmit={onSubmit}>
      <div style={styles.formGrid}>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Ad Soyad</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({...form, name: e.target.value})}
            style={styles.input}
            placeholder="Adınız Soyadınız"
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Telefon</label>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => setForm({...form, phone: e.target.value})}
            style={styles.input}
            placeholder="5XX XXX XX XX"
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>T.C. Kimlik No</label>
          <input
            type="text"
            value={form.identity_number}
            onChange={(e) => setForm({...form, identity_number: e.target.value})}
            style={styles.input}
            placeholder="11 haneli T.C. No"
            maxLength={11}
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Doğum Tarihi</label>
          <input
            type="date"
            value={form.birth_date}
            onChange={(e) => setForm({...form, birth_date: e.target.value})}
            style={styles.input}
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Cinsiyet</label>
          <select
            value={form.gender}
            onChange={(e) => setForm({...form, gender: e.target.value})}
            style={styles.input}
          >
            <option value="">Seçiniz</option>
            <option value="male">Erkek</option>
            <option value="female">Kadın</option>
            <option value="other">Diğer</option>
          </select>
        </div>
      </div>

      <button 
        type="submit" 
        style={{
          ...styles.button,
          opacity: isSaving ? 0.7 : 1,
          cursor: isSaving ? 'not-allowed' : 'pointer'
        }}
        disabled={isSaving}
      >
        {isSaving ? <FaSpinner className="spin" /> : <FaSave />}
        Değişiklikleri Kaydet
      </button>
    </form>
  );
};
