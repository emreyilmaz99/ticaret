// src/features/users/components/UserList/modals/DeleteConfirmModal.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { FaTimes, FaTrash } from 'react-icons/fa';
import { styles } from '../../../shared/styles';

const DeleteConfirmModal = React.memo(({ user, onConfirm, onCancel, isDeleting }) => {
  if (!user) return null;

  return (
    <div style={styles.modalOverlay} onClick={onCancel}>
      <div style={{ ...styles.modalContent, maxWidth: '400px' }} onClick={(e) => e.stopPropagation()}>
        <div style={{ padding: '24px', textAlign: 'center' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: '#fee2e2',
              color: '#dc2626',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              fontSize: '24px',
            }}
          >
            <FaTrash />
          </div>
          <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>
            Kullanıcıyı Sil
          </h3>
          <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '24px' }}>
            <strong>{user.name}</strong> kullanıcısını silmek istediğinize emin misiniz? Bu işlem geri
            alınamaz.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button onClick={onCancel} style={{ ...styles.btn, flex: 1 }}>
              İptal
            </button>
            <button
              onClick={onConfirm}
              style={{ ...styles.btn, ...styles.btnDanger, flex: 1 }}
              disabled={isDeleting}
            >
              {isDeleting ? 'Siliniyor...' : 'Sil'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

DeleteConfirmModal.displayName = 'DeleteConfirmModal';

DeleteConfirmModal.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }),
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  isDeleting: PropTypes.bool,
};

export default DeleteConfirmModal;
