// src/pages/admin/Reviews/RejectReviewModal.jsx
import React, { useState } from 'react';
import { FaTimes, FaExclamationTriangle } from 'react-icons/fa';

const RejectReviewModal = ({ review, onClose, onConfirm, isLoading, styles }) => {
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!reason.trim()) {
      setError('Lütfen bir ret nedeni yazınız.');
      return;
    }
    if (reason.length < 10) {
      setError('Ret nedeni en az 10 karakter olmalıdır.');
      return;
    }
    onConfirm(reason);
  };

  if (!review) return null;

  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div 
        style={{ 
          ...styles.modalContent, 
          maxWidth: '500px',
          maxHeight: '400px'
        }} 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ 
          ...styles.modalHeader, 
          backgroundColor: '#fef2f2', 
          borderBottom: '1px solid #fecaca' 
        }}>
          <h2 style={{ ...styles.modalTitle, color: '#991b1b' }}>
            <FaExclamationTriangle style={{ marginRight: '8px' }} />
            Yorumu Reddet
          </h2>
          <button style={styles.modalCloseBtn} onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        {/* Body */}
        <div style={styles.modalBody}>
          <div style={{ marginBottom: '16px' }}>
            <p style={{ fontSize: '14px', color: '#374151', marginBottom: '12px' }}>
              <strong>Yorum #{review.id}</strong> reddedilecek. Lütfen ret nedenini yazınız:
            </p>
            
            {review.comment && (
              <div style={{
                padding: '12px',
                backgroundColor: '#f9fafb',
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
                marginBottom: '16px'
              }}>
                <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>
                  Yorum içeriği:
                </div>
                <div style={{ 
                  fontSize: '14px', 
                  color: '#374151',
                  maxHeight: '80px',
                  overflow: 'auto'
                }}>
                  {review.comment.length > 200 
                    ? review.comment.substring(0, 200) + '...' 
                    : review.comment
                  }
                </div>
              </div>
            )}
          </div>

          <div style={{ marginBottom: '8px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '6px'
            }}>
              Ret Nedeni <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                setError('');
              }}
              placeholder="Bu yorum neden reddediliyor? (örn: uygunsuz içerik, spam vb.)"
              style={{
                width: '100%',
                minHeight: '120px',
                padding: '12px',
                fontSize: '14px',
                border: error ? '1px solid #ef4444' : '1px solid #d1d5db',
                borderRadius: '8px',
                resize: 'vertical',
                fontFamily: 'inherit',
                outline: 'none',
                transition: 'border-color 0.2s',
                boxSizing: 'border-box',
              }}
              onFocus={(e) => {
                if (!error) e.target.style.borderColor = '#6366f1';
              }}
              onBlur={(e) => {
                if (!error) e.target.style.borderColor = '#d1d5db';
              }}
              disabled={isLoading}
            />
            {error && (
              <p style={{ 
                fontSize: '12px', 
                color: '#ef4444', 
                marginTop: '4px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <FaExclamationTriangle size={12} /> {error}
              </p>
            )}
            <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>
              {reason.length}/500 karakter
            </p>
          </div>

          {/* Quick Reasons */}
          <div style={{ marginTop: '16px' }}>
            <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>
              Hızlı seçim:
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {[
                'Uygunsuz içerik',
                'Spam / Reklam',
                'Sahte değerlendirme',
                'Hakaret içerikli',
                'Ürünle ilgisiz',
              ].map((quickReason) => (
                <button
                  key={quickReason}
                  type="button"
                  onClick={() => setReason(quickReason)}
                  style={{
                    padding: '6px 12px',
                    fontSize: '12px',
                    backgroundColor: reason === quickReason ? '#6366f1' : '#f3f4f6',
                    color: reason === quickReason ? '#fff' : '#4b5563',
                    border: 'none',
                    borderRadius: '16px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  disabled={isLoading}
                >
                  {quickReason}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={styles.modalFooter}>
          <button 
            style={styles.modalCancelBtn} 
            onClick={onClose}
            disabled={isLoading}
          >
            İptal
          </button>
          <button 
            style={{
              ...styles.modalRejectBtn,
              opacity: isLoading ? 0.7 : 1,
              cursor: isLoading ? 'not-allowed' : 'pointer',
            }}
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? 'İşleniyor...' : 'Yorumu Reddet'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RejectReviewModal;
