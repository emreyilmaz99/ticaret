// src/pages/user/UserProfile/components/PasswordForm.jsx
import React from 'react';
import { FaSave, FaSpinner } from 'react-icons/fa';

export const PasswordForm = ({ form, setForm, onSubmit, isSaving, styles }) => {
  return (
    <form onSubmit={onSubmit}>
      <div style={{...styles.formGrid, gridTemplateColumns: '1fr'}}>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Mevcut Şifre</label>
          <input
            type="password"
            value={form.current_password}
            onChange={(e) => setForm({...form, current_password: e.target.value})}
            style={styles.input}
            placeholder="Mevcut şifrenizi giriniz"
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Yeni Şifre</label>
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm({...form, password: e.target.value})}
            style={styles.input}
            placeholder="Yeni şifrenizi giriniz (min. 8 karakter)"
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Yeni Şifre (Tekrar)</label>
          <input
            type="password"
            value={form.password_confirmation}
            onChange={(e) => setForm({...form, password_confirmation: e.target.value})}
            style={styles.input}
            placeholder="Yeni şifrenizi tekrar giriniz"
          />
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
        Şifreyi Güncelle
      </button>
    </form>
  );
};
