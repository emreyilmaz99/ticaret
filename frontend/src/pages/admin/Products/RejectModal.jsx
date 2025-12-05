// src/pages/admin/Products/RejectModal.jsx
import React from 'react';
import { FaTimes, FaTimesCircle } from 'react-icons/fa';

/**
 * Ürün reddetme modal bileşeni
 */
const RejectModal = ({
  isOpen,
  productName,
  isBulk,
  rejectionReason,
  onReasonChange,
  onSubmit,
  onClose,
  isSubmitting,
  styles
}) => {
  if (!isOpen) return null;

  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={{ ...styles.modalContent, maxWidth: '500px' }} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #e2e8f0', backgroundColor: '#fef2f2' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#dc2626', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FaTimesCircle /> Ürün Reddi
          </h2>
        </div>
        
        {/* Body */}
        <div style={{ padding: '24px' }}>
          <p style={{ color: '#334155', marginBottom: '16px' }}>
            <strong>{productName}</strong> {isBulk ? '' : 'adlı ürünü'} reddetmek üzeresiniz.
          </p>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#0f172a', marginBottom: '8px' }}>
              Red Sebebi <span style={{ color: '#dc2626' }}>*</span>
            </label>
            <textarea
              value={rejectionReason}
              onChange={(e) => onReasonChange(e.target.value)}
              placeholder="Ürünün neden reddedildiğini açıklayın. Bu mesaj satıcıya gösterilecektir."
              style={{
                width: '100%',
                minHeight: '120px',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                fontSize: '14px',
                resize: 'vertical',
                outline: 'none',
                fontFamily: 'inherit',
                boxSizing: 'border-box'
              }}
            />
            <p style={{ fontSize: '12px', color: '#64748b', marginTop: '8px' }}>
              Örn: Ürün açıklaması yetersiz, görseller düşük kaliteli, fiyat uyumsuzluğu vb.
            </p>
          </div>
        </div>
        
        {/* Footer */}
        <div style={{ padding: '16px 24px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', gap: '12px', backgroundColor: '#f8fafc' }}>
          <button 
            onClick={onClose}
            style={{ ...styles.btn(), padding: '10px 20px' }}
          >
            İptal
          </button>
          <button 
            onClick={onSubmit}
            disabled={isSubmitting}
            style={{ 
              ...styles.btn('danger'), 
              padding: '10px 20px', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px',
              opacity: isSubmitting ? 0.6 : 1
            }}
          >
            <FaTimes /> {isSubmitting ? 'İşleniyor...' : 'Reddet'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RejectModal;
