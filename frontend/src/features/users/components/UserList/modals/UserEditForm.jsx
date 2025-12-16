// src/features/users/components/UserList/modals/UserEditForm.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { FaTimes, FaEdit } from 'react-icons/fa';
import { styles } from '../../../shared/styles';

const UserEditForm = React.memo(({
  editForm,
  onFormChange,
  onSubmit,
  onCancel,
  isUpdating,
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <>
      <div style={styles.modalHeader}>
        <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a', margin: 0 }}>
          Kullanıcı Düzenle
        </h2>
        <button onClick={onCancel} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
          <FaTimes size={20} />
        </button>
      </div>

      <div style={styles.modalBody}>
        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.formLabel}>Ad Soyad</label>
            <input
              type="text"
              value={editForm.name}
              onChange={(e) => onFormChange({ ...editForm, name: e.target.value })}
              style={styles.formInput}
              required
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.formLabel}>Email</label>
            <input
              type="email"
              value={editForm.email}
              onChange={(e) => onFormChange({ ...editForm, email: e.target.value })}
              style={styles.formInput}
              required
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.formLabel}>Telefon</label>
            <input
              type="text"
              value={editForm.phone}
              onChange={(e) => onFormChange({ ...editForm, phone: e.target.value })}
              style={styles.formInput}
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Cinsiyet</label>
              <select
                value={editForm.gender}
                onChange={(e) => onFormChange({ ...editForm, gender: e.target.value })}
                style={styles.formInput}
              >
                <option value="">Belirtilmemiş</option>
                <option value="male">Erkek</option>
                <option value="female">Kadın</option>
                <option value="other">Diğer</option>
              </select>
            </div>
            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Doğum Tarihi</label>
              <input
                type="date"
                value={editForm.birth_date}
                onChange={(e) => onFormChange({ ...editForm, birth_date: e.target.value })}
                style={styles.formInput}
              />
            </div>
          </div>
          <div style={styles.formGroup}>
            <label style={{ ...styles.formLabel, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="checkbox"
                checked={editForm.is_active}
                onChange={(e) => onFormChange({ ...editForm, is_active: e.target.checked })}
                style={{ width: '16px', height: '16px' }}
              />
              Aktif Kullanıcı
            </label>
          </div>
        </form>
      </div>

      <div style={styles.modalFooter}>
        <button onClick={onCancel} style={styles.btn}>
          İptal
        </button>
        <button
          onClick={handleSubmit}
          style={{ ...styles.btn, ...styles.btnPrimary }}
          disabled={isUpdating}
        >
          {isUpdating ? 'Kaydediliyor...' : 'Kaydet'}
        </button>
      </div>
    </>
  );
});

UserEditForm.displayName = 'UserEditForm';

UserEditForm.propTypes = {
  editForm: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string,
    phone: PropTypes.string,
    gender: PropTypes.string,
    birth_date: PropTypes.string,
    is_active: PropTypes.bool,
  }).isRequired,
  onFormChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  isUpdating: PropTypes.bool,
};

export default UserEditForm;
