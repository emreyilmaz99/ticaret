// src/pages/admin/Reviews/ReviewDetailModal.jsx
import React from 'react';
import { 
  FaTimes, FaStar, FaUser, FaBox, FaStore, 
  FaCalendarAlt, FaCheck, FaCheckCircle
} from 'react-icons/fa';

const ReviewDetailModal = ({ review, onClose, onApprove, onReject, styles }) => {
  if (!review) return null;

  const renderStars = (rating) => {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <FaStar
            key={star}
            size={18}
            color={star <= rating ? '#f59e0b' : '#e5e7eb'}
          />
        ))}
        <span style={{ marginLeft: '8px', fontSize: '16px', fontWeight: '700', color: '#374151' }}>
          {rating}/5
        </span>
      </div>
    );
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: { bg: '#fef3c7', color: '#f59e0b' },
      approved: { bg: '#d1fae5', color: '#10b981' },
      rejected: { bg: '#fee2e2', color: '#ef4444' },
    };
    return colors[status] || colors.pending;
  };

  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={styles.modalHeader}>
          <h2 style={styles.modalTitle}>Yorum Detayı #{review.id}</h2>
          <button style={styles.modalCloseBtn} onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        {/* Body */}
        <div style={styles.modalBody}>
          {/* User & Product Info */}
          <div style={styles.detailSection}>
            <h3 style={styles.detailSectionTitle}>Genel Bilgiler</h3>
            
            <div style={styles.detailRow}>
              <span style={styles.detailLabel}>
                <FaUser style={{ marginRight: '8px' }} /> Kullanıcı
              </span>
              <span style={styles.detailValue}>
                {review.is_anonymous ? 'Anonim Kullanıcı' : review.user?.name || 'Bilinmiyor'}
                {review.user?.email && !review.is_anonymous && (
                  <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: '400' }}>
                    {review.user.email}
                  </div>
                )}
              </span>
            </div>

            <div style={styles.detailRow}>
              <span style={styles.detailLabel}>
                <FaBox style={{ marginRight: '8px' }} /> Ürün
              </span>
              <span style={styles.detailValue}>
                {review.product?.name || '-'}
              </span>
            </div>

            <div style={styles.detailRow}>
              <span style={styles.detailLabel}>
                <FaStore style={{ marginRight: '8px' }} /> Satıcı
              </span>
              <span style={styles.detailValue}>
                {review.product?.vendor?.name || review.product?.vendor?.company_name || '-'}
              </span>
            </div>

            <div style={styles.detailRow}>
              <span style={styles.detailLabel}>
                <FaCalendarAlt style={{ marginRight: '8px' }} /> Tarih
              </span>
              <span style={styles.detailValue}>
                {new Date(review.created_at).toLocaleDateString('tr-TR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>

            <div style={styles.detailRow}>
              <span style={styles.detailLabel}>Puan</span>
              <span style={styles.detailValue}>{renderStars(review.rating)}</span>
            </div>

            <div style={styles.detailRow}>
              <span style={styles.detailLabel}>Durum</span>
              <span style={{
                ...styles.statusBadge,
                backgroundColor: getStatusColor(review.status).bg,
                color: getStatusColor(review.status).color,
              }}>
                {review.status === 'pending' && 'Beklemede'}
                {review.status === 'approved' && 'Onaylandı'}
                {review.status === 'rejected' && 'Reddedildi'}
              </span>
            </div>

            {review.is_verified_purchase && (
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>
                  <FaCheckCircle style={{ marginRight: '8px', color: '#10b981' }} /> Doğrulanmış Satın Alma
                </span>
                <span style={{ ...styles.detailValue, color: '#10b981' }}>Evet</span>
              </div>
            )}
          </div>

          {/* Review Content */}
          <div style={styles.detailSection}>
            <h3 style={styles.detailSectionTitle}>Yorum İçeriği</h3>
            <div style={styles.reviewContent}>
              {review.title && (
                <h4 style={styles.reviewTitle}>{review.title}</h4>
              )}
              <p style={styles.reviewComment}>
                {review.comment || 'Yorum içeriği yok.'}
              </p>
            </div>
          </div>

          {/* Media */}
          {review.media && review.media.length > 0 && (
            <div style={styles.detailSection}>
              <h3 style={styles.detailSectionTitle}>Görseller ({review.media.length})</h3>
              <div style={styles.mediaGrid}>
                {review.media.map((media, index) => (
                  <div key={index} style={styles.mediaItem}>
                    <img
                      src={media.url || media.path}
                      alt={`Review media ${index + 1}`}
                      style={styles.mediaImage}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Rejection Reason */}
          {review.status === 'rejected' && review.rejection_reason && (
            <div style={{ ...styles.detailSection, backgroundColor: '#fef2f2', borderColor: '#fecaca' }}>
              <h3 style={{ ...styles.detailSectionTitle, color: '#991b1b' }}>Ret Nedeni</h3>
              <p style={{ fontSize: '14px', color: '#991b1b', lineHeight: '1.6' }}>
                {review.rejection_reason}
              </p>
            </div>
          )}

          {/* Vendor Response */}
          {review.response && (
            <div style={{ ...styles.detailSection, backgroundColor: '#ecfdf5', borderColor: '#a7f3d0' }}>
              <h3 style={{ ...styles.detailSectionTitle, color: '#065f46' }}>Satıcı Yanıtı</h3>
              <p style={{ fontSize: '14px', color: '#065f46', lineHeight: '1.6' }}>
                {review.response.response}
              </p>
              <div style={{ fontSize: '12px', color: '#047857', marginTop: '8px' }}>
                {new Date(review.response.created_at).toLocaleDateString('tr-TR')} - {review.response.vendor?.name}
              </div>
            </div>
          )}

          {/* Stats */}
          <div style={styles.detailSection}>
            <h3 style={styles.detailSectionTitle}>İstatistikler</h3>
            <div style={{ display: 'flex', gap: '24px' }}>
              <div>
                <div style={{ fontSize: '24px', fontWeight: '700', color: '#10b981' }}>
                  {review.helpful_count || 0}
                </div>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>Faydalı</div>
              </div>
              <div>
                <div style={{ fontSize: '24px', fontWeight: '700', color: '#ef4444' }}>
                  {review.unhelpful_count || 0}
                </div>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>Faydasız</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={styles.modalFooter}>
          <button style={styles.modalCancelBtn} onClick={onClose}>
            Kapat
          </button>
          {review.status !== 'approved' && (
            <button style={styles.modalApproveBtn} onClick={onApprove}>
              <FaCheck /> Onayla
            </button>
          )}
          {review.status !== 'rejected' && (
            <button style={styles.modalRejectBtn} onClick={onReject}>
              <FaTimes /> Reddet
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewDetailModal;
