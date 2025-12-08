// src/pages/user/UserAddresses/components/AddressCard.jsx
import React from 'react';
import { FaStar, FaEdit, FaTrash, FaCheckCircle } from 'react-icons/fa';

export const AddressCard = ({ address, onEdit, onDelete, onSetDefault, styles }) => {
  return (
    <div style={{
      ...styles.addressCard,
      ...(address.is_default ? styles.addressCardDefault : {})
    }}>
      {address.is_default && (
        <div style={styles.defaultBadge}>
          <FaCheckCircle size={10} /> Varsayılan
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={styles.labelBadge}>{address.label}</span>
          <span style={{ fontWeight: '600', fontSize: '14px' }}>{address.full_name}</span>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {!address.is_default && (
            <button
              onClick={() => onSetDefault(address.id)}
              style={{...styles.actionButton, backgroundColor: '#f1f5f9', color: '#64748b'}}
              title="Varsayılan Yap"
            >
              <FaStar />
            </button>
          )}
          <button
            onClick={() => onEdit(address)}
            style={{...styles.actionButton, backgroundColor: '#e0f2fe', color: '#0284c7'}}
            title="Düzenle"
          >
            <FaEdit />
          </button>
          <button
            onClick={() => {
              if (window.confirm('Bu adresi silmek istediğinize emin misiniz?')) {
                onDelete(address.id);
              }
            }}
            style={{...styles.actionButton, backgroundColor: '#fee2e2', color: '#ef4444'}}
            title="Sil"
          >
            <FaTrash />
          </button>
        </div>
      </div>

      <div style={{ fontSize: '13px', color: '#475569', lineHeight: '1.6' }}>
        <p style={{ margin: '0 0 4px 0' }}>{address.address_line}</p>
        <p style={{ margin: '0 0 4px 0' }}>
          {address.neighborhood}, {address.district}/{address.city}
        </p>
        <p style={{ margin: '0 0 4px 0' }}>{address.country} {address.postal_code}</p>
        <p style={{ margin: '8px 0 0 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontWeight: '600' }}>Tel:</span> {address.phone}
        </p>
      </div>
    </div>
  );
};
