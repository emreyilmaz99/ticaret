// src/pages/admin/Applications/components/RejectModal.jsx
import React from 'react';
import { FaTimes } from 'react-icons/fa';
import { styles } from '../styles';

/**
 * Başvuru reddetme modalı
 */
const RejectModal = ({
  isOpen,
  vendor,
  reason,
  onReasonChange,
  onClose,
  onSubmit,
  isSubmitting,
  minLength = 10
}) => {
  if (!isOpen || !vendor) return null;

  const isValid = reason.length >= minLength;

  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
        <div style={{
          ...styles.modalHeader, 
          background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)'
        }}>
          <h2 style={{margin: 0, fontSize: '20px', fontWeight: '700', color: '#374151'}}>
            ⚠️ Başvuruyu Reddet
          </h2>
          <button 
            onClick={onClose} 
            style={{
              background: 'white', 
              border: 'none', 
              cursor: 'pointer', 
              padding: '8px', 
              borderRadius: '8px',
              color: '#374151'
            }}
          >
            <FaTimes size={18} />
          </button>
        </div>
        
        <div style={styles.modalBody}>
          <p style={{
            marginBottom: '16px', 
            fontSize: '14px', 
            color: '#6b7280', 
            lineHeight: '1.5'
          }}>
            <strong>{vendor.full_name || vendor.owner}</strong> için red nedenini giriniz.
          </p>
          <textarea 
            style={{
              ...styles.textarea,
              borderColor: reason.length > 0 && !isValid ? '#6b7280' : '#e5e7eb'
            }}
            value={reason}
            onChange={(e) => onReasonChange(e.target.value)}
            placeholder="Örn: Belgeleriniz eksik veya hatalı..."
          />
          <div style={{
            textAlign: 'right', 
            fontSize: '12px', 
            marginTop: '8px', 
            color: !isValid ? '#6b7280' : '#059669',
            fontWeight: '500'
          }}>
            {reason.length} / 1000 (Min {minLength})
          </div>
        </div>
        
        <div style={styles.modalFooter}>
          <button 
            onClick={onClose} 
            style={{
              padding: '12px 24px', 
              borderRadius: '10px', 
              border: '2px solid #e5e7eb', 
              background: 'white', 
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '14px',
              color: '#6b7280'
            }}
          >
            İptal
          </button>
          <button 
            onClick={onSubmit}
            disabled={!isValid || isSubmitting}
            style={{
              padding: '12px 24px', 
              borderRadius: '10px', 
              border: 'none', 
              background: !isValid 
                ? '#9ca3af' 
                : 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)', 
              color: 'white', 
              cursor: !isValid ? 'not-allowed' : 'pointer',
              fontWeight: '600',
              fontSize: '14px',
              boxShadow: isValid ? '0 4px 12px rgba(107, 114, 128, 0.3)' : 'none'
            }}
          >
            {isSubmitting ? 'Reddediliyor...' : 'Reddet'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RejectModal;
