// src/pages/user/UserReviews/components/ReviewCard.jsx
import React from 'react';
import { 
  FaStar, FaThumbsUp, FaThumbsDown, FaTrash, FaImage, 
  FaStore, FaCalendarAlt, FaCheckCircle, FaClock, FaTimesCircle
} from 'react-icons/fa';

const ReviewCard = ({ review, onDelete, getStatusConfig, styles }) => {
  const statusConfig = getStatusConfig(review.status);

  const renderStars = (rating) => {
    return (
      <div style={styles.reviewRating}>
        {[1, 2, 3, 4, 5].map((star) => (
          <FaStar
            key={star}
            size={14}
            color={star <= rating ? '#f59e0b' : '#e5e7eb'}
          />
        ))}
      </div>
    );
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <FaCheckCircle size={12} />;
      case 'rejected':
        return <FaTimesCircle size={12} />;
      default:
        return <FaClock size={12} />;
    }
  };

  return (
    <div style={styles.reviewCard}>
      {/* Header */}
      <div style={styles.reviewCardHeader}>
        <div style={styles.reviewProductSection}>
          <img
            src={
              review.product?.photos?.[0]?.path
                ? `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/storage/${review.product.photos[0].path}`
                : 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23f1f5f9" width="200" height="200"/%3E%3Ctext fill="%2394a3b8" font-family="Arial" font-size="14" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EGörsel Yok%3C/text%3E%3C/svg%3E'
            }
            alt={review.product?.name}
            style={styles.reviewProductImage}
            onError={(e) => { e.target.onerror = null; e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23f1f5f9" width="200" height="200"/%3E%3Ctext fill="%2394a3b8" font-family="Arial" font-size="14" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EGörsel Yok%3C/text%3E%3C/svg%3E'; }}
          />
          <div style={styles.reviewProductInfo}>
            <div style={styles.reviewProductName}>
              {review.product?.name || 'Ürün'}
            </div>
            <div style={styles.reviewMeta}>
              {renderStars(review.rating)}
              <span style={{ margin: '0 4px' }}>•</span>
              <FaCalendarAlt size={11} />
              {new Date(review.created_at).toLocaleDateString('tr-TR')}
            </div>
          </div>
        </div>

        <span
          style={{
            ...styles.reviewStatusBadge,
            backgroundColor: statusConfig.bg,
            color: statusConfig.color,
          }}
        >
          {getStatusIcon(review.status)}
          {statusConfig.label}
        </span>
      </div>

      {/* Content */}
      <div style={styles.reviewContent}>
        {review.title && (
          <div style={styles.reviewTitle}>{review.title}</div>
        )}
        <p style={styles.reviewComment}>
          {review.comment || 'Yorum içeriği yok.'}
        </p>
      </div>

      {/* Media */}
      {review.media && review.media.length > 0 && (
        <div style={styles.reviewMediaGrid}>
          {review.media.slice(0, 4).map((media, index) => {
            const mediaUrl = media.url || media.path;
            const fullUrl = mediaUrl
              ? (mediaUrl.startsWith('http') 
                  ? mediaUrl 
                  : `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/storage/${mediaUrl}`)
              : 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23f1f5f9" width="200" height="200"/%3E%3Ctext fill="%2394a3b8" font-family="Arial" font-size="14" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EGörsel Yok%3C/text%3E%3C/svg%3E';
            
            return (
              <div key={index} style={styles.reviewMediaItem}>
                {media.type === 'video' ? (
                  <video src={fullUrl} style={styles.reviewMediaVideo} />
                ) : (
                  <img 
                    src={fullUrl}
                    alt="" 
                    style={styles.reviewMediaImage}
                    onError={(e) => { 
                      e.target.onerror = null;
                      e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23f1f5f9" width="200" height="200"/%3E%3Ctext fill="%2394a3b8" font-family="Arial" font-size="14" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EGörsel Hatası%3C/text%3E%3C/svg%3E';
                    }}
                  />
                )}
              </div>
            );
          })}
          {review.media.length > 4 && (
            <div style={{
              ...styles.reviewMediaItem,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#f1f5f9',
              cursor: 'pointer',
            }}>
              <span style={{ fontSize: '14px', fontWeight: '600', color: '#64748b' }}>
                +{review.media.length - 4}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Vendor Response */}
      {review.response && (
        <div style={styles.vendorResponse}>
          <div style={styles.vendorResponseHeader}>
            <FaStore size={14} color="#166534" />
            <span style={styles.vendorResponseTitle}>
              Satıcı Yanıtı
            </span>
          </div>
          <p style={styles.vendorResponseText}>{review.response.response}</p>
        </div>
      )}

      {/* Rejection Reason */}
      {review.status === 'rejected' && review.rejection_reason && (
        <div style={{
          ...styles.vendorResponse,
          backgroundColor: '#fef2f2',
          borderColor: '#fecaca',
        }}>
          <div style={styles.vendorResponseHeader}>
            <FaTimesCircle size={14} color="#dc2626" />
            <span style={{ ...styles.vendorResponseTitle, color: '#dc2626' }}>
              Ret Nedeni
            </span>
          </div>
          <p style={{ ...styles.vendorResponseText, color: '#dc2626' }}>
            {review.rejection_reason}
          </p>
        </div>
      )}

      {/* Footer */}
      <div style={styles.reviewFooter}>
        <div style={styles.reviewStats}>
          <span style={styles.reviewStatItem}>
            <FaThumbsUp size={12} color="#10b981" />
            {review.helpful_count || 0} Faydalı
          </span>
          <span style={styles.reviewStatItem}>
            <FaThumbsDown size={12} color="#ef4444" />
            {review.unhelpful_count || 0}
          </span>
          {review.media && review.media.length > 0 && (
            <span style={styles.reviewStatItem}>
              <FaImage size={12} />
              {review.media.length} Görsel
            </span>
          )}
        </div>

        <div style={styles.reviewActions}>
          {review.status !== 'approved' && !review.deleted_at && (
            <button
              style={styles.reviewDeleteBtn}
              onClick={() => onDelete(review.id)}
            >
              <FaTrash size={12} /> Sil
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
