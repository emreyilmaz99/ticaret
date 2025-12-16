// src/pages/public/VendorStore/components/ReviewsSection.jsx
import React from 'react';
import { FaStar, FaUser, FaThumbsUp, FaSpinner } from 'react-icons/fa';

const ReviewsSection = ({
  reviews,
  isLoading,
  summary,
  sortBy,
  setSortBy,
  selectedRating,
  setSelectedRating,
  isMobile,
}) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <FaStar
        key={i}
        style={{
          color: i < rating ? '#f59e0b' : '#e2e8f0',
          fontSize: '14px',
        }}
      />
    ));
  };

  return (
    <div style={styles.container}>
      {/* Summary Card */}
      <div style={styles.summaryCard}>
        <div style={styles.summaryLeft}>
          <div style={styles.avgRating}>
            <span style={styles.avgValue}>{parseFloat(summary.average_rating || 0).toFixed(1)}</span>
            <div style={styles.avgStars}>
              {renderStars(Math.round(summary.average_rating))}
            </div>
            <span style={styles.totalReviews}>{summary.total_reviews} değerlendirme</span>
          </div>
        </div>

        <div style={styles.summaryRight}>
          <div style={styles.distribution}>
            {[5, 4, 3, 2, 1].map(star => {
              const count = summary.distribution[star] || 0;
              const percentage = summary.total_reviews > 0 
                ? (count / summary.total_reviews) * 100 
                : 0;
              
              return (
                <button
                  key={star}
                  onClick={() => setSelectedRating(selectedRating === star ? null : star)}
                  style={{
                    ...styles.distRow,
                    ...(selectedRating === star ? styles.distRowActive : {}),
                  }}
                >
                  <span style={styles.distStars}>
                    {star} <FaStar style={styles.distStarIcon} />
                  </span>
                  <div style={styles.distBar}>
                    <div 
                      style={{
                        ...styles.distBarFill,
                        width: `${percentage}%`,
                      }}
                    />
                  </div>
                  <span style={styles.distCount}>{count}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Filters & Sort */}
      <div style={styles.toolbar}>
        <div style={styles.filterChips}>
          <button
            onClick={() => setSelectedRating(null)}
            style={{
              ...styles.chip,
              ...(selectedRating === null ? styles.chipActive : {}),
            }}
          >
            Tümü
          </button>
          {[5, 4, 3, 2, 1].map(star => (
            <button
              key={star}
              onClick={() => setSelectedRating(selectedRating === star ? null : star)}
              style={{
                ...styles.chip,
                ...(selectedRating === star ? styles.chipActive : {}),
              }}
            >
              {star} ★
            </button>
          ))}
        </div>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          style={styles.sortSelect}
        >
          <option value="newest">En Yeni</option>
          <option value="oldest">En Eski</option>
          <option value="highest">En Yüksek Puan</option>
          <option value="lowest">En Düşük Puan</option>
        </select>
      </div>

      {/* Reviews List */}
      {isLoading ? (
        <div style={styles.loading}>
          <FaSpinner style={styles.spinner} />
          <span>Değerlendirmeler yükleniyor...</span>
        </div>
      ) : reviews.length === 0 ? (
        <div style={styles.empty}>
          <div style={styles.emptyIcon}>💬</div>
          <h3 style={styles.emptyTitle}>Henüz değerlendirme yok</h3>
          <p style={styles.emptyText}>Bu satıcı için henüz değerlendirme yapılmamış.</p>
        </div>
      ) : (
        <div style={styles.reviewsList}>
          {reviews.map(review => (
            <div key={review.id} style={styles.reviewCard}>
              <div style={styles.reviewHeader}>
                <div style={styles.reviewerInfo}>
                  <div style={styles.avatar}>
                    {review.user?.avatar ? (
                      <img src={review.user.avatar} alt="" style={styles.avatarImg} />
                    ) : (
                      <FaUser style={styles.avatarIcon} />
                    )}
                  </div>
                  <div>
                    <div style={styles.reviewerName}>
                      {review.user?.name || 'Anonim Kullanıcı'}
                    </div>
                    <div style={styles.reviewDate}>{formatDate(review.created_at)}</div>
                  </div>
                </div>
                <div style={styles.reviewRating}>
                  {renderStars(review.rating)}
                </div>
              </div>

              {/* Product Info */}
              {review.product && (
                <div style={styles.productInfo}>
                  <span style={styles.productLabel}>Ürün:</span>
                  <span style={styles.productName}>{review.product.name}</span>
                </div>
              )}

              {/* Review Content */}
              {review.title && (
                <h4 style={styles.reviewTitle}>{review.title}</h4>
              )}
              {review.comment && (
                <p style={styles.reviewComment}>{review.comment}</p>
              )}

              {/* Review Images */}
              {review.images && review.images.length > 0 && (
                <div style={styles.reviewImages}>
                  {review.images.map((img, idx) => (
                    <img key={idx} src={img} alt="" style={styles.reviewImage} />
                  ))}
                </div>
              )}

              {/* Helpful */}
              <div style={styles.reviewFooter}>
                <button style={styles.helpfulBtn}>
                  <FaThumbsUp size={12} />
                  <span>Faydalı ({review.helpful_count || 0})</span>
                </button>

                {/* Vendor Response */}
                {review.vendor_response && (
                  <div style={styles.vendorResponse}>
                    <div style={styles.responseHeader}>
                      <span style={styles.responseLabel}>Satıcı Yanıtı</span>
                      <span style={styles.responseDate}>
                        {formatDate(review.vendor_response.created_at)}
                      </span>
                    </div>
                    <p style={styles.responseText}>{review.vendor_response.response}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    flex: 1,
    maxWidth: '900px',
    margin: '0 auto',
  },
  summaryCard: {
    display: 'flex',
    gap: '40px',
    backgroundColor: '#fff',
    padding: '32px',
    borderRadius: '16px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    marginBottom: '24px',
  },
  summaryLeft: {
    display: 'flex',
    alignItems: 'center',
  },
  avgRating: {
    textAlign: 'center',
  },
  avgValue: {
    fontSize: '56px',
    fontWeight: '800',
    color: '#1e293b',
    lineHeight: 1,
  },
  avgStars: {
    display: 'flex',
    justifyContent: 'center',
    gap: '4px',
    marginTop: '8px',
  },
  totalReviews: {
    display: 'block',
    marginTop: '8px',
    fontSize: '14px',
    color: '#64748b',
  },
  summaryRight: {
    flex: 1,
  },
  distribution: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  distRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '6px 12px',
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  distRowActive: {
    backgroundColor: '#ecfdf5',
  },
  distStars: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    width: '40px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#475569',
  },
  distStarIcon: {
    color: '#f59e0b',
    fontSize: '12px',
  },
  distBar: {
    flex: 1,
    height: '8px',
    backgroundColor: '#e2e8f0',
    borderRadius: '4px',
    overflow: 'hidden',
  },
  distBarFill: {
    height: '100%',
    backgroundColor: '#f59e0b',
    borderRadius: '4px',
    transition: 'width 0.3s ease',
  },
  distCount: {
    width: '40px',
    textAlign: 'right',
    fontSize: '13px',
    color: '#64748b',
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '20px',
    flexWrap: 'wrap',
    gap: '12px',
  },
  filterChips: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
  },
  chip: {
    padding: '8px 16px',
    backgroundColor: '#fff',
    border: '1px solid #e2e8f0',
    borderRadius: '20px',
    fontSize: '13px',
    fontWeight: '500',
    color: '#475569',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  chipActive: {
    backgroundColor: '#059669',
    borderColor: '#059669',
    color: '#fff',
  },
  sortSelect: {
    padding: '10px 16px',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#1e293b',
    backgroundColor: '#fff',
    cursor: 'pointer',
    outline: 'none',
  },
  loading: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '60px 20px',
    color: '#64748b',
    gap: '12px',
  },
  spinner: {
    fontSize: '24px',
    color: '#059669',
    animation: 'spin 1s linear infinite',
  },
  empty: {
    textAlign: 'center',
    padding: '60px 20px',
  },
  emptyIcon: {
    fontSize: '48px',
    marginBottom: '12px',
  },
  emptyTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#1e293b',
    margin: '0 0 8px 0',
  },
  emptyText: {
    fontSize: '14px',
    color: '#64748b',
    margin: 0,
  },
  reviewsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  reviewCard: {
    backgroundColor: '#fff',
    padding: '24px',
    borderRadius: '16px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
  },
  reviewHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: '16px',
  },
  reviewerInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  avatar: {
    width: '44px',
    height: '44px',
    borderRadius: '50%',
    backgroundColor: '#f1f5f9',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  avatarIcon: {
    color: '#94a3b8',
    fontSize: '18px',
  },
  reviewerName: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#1e293b',
  },
  reviewDate: {
    fontSize: '13px',
    color: '#94a3b8',
  },
  reviewRating: {
    display: 'flex',
    gap: '2px',
  },
  productInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 14px',
    backgroundColor: '#f8fafc',
    borderRadius: '8px',
    marginBottom: '16px',
    fontSize: '13px',
  },
  productLabel: {
    color: '#64748b',
  },
  productName: {
    color: '#1e293b',
    fontWeight: '500',
  },
  reviewTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1e293b',
    margin: '0 0 8px 0',
  },
  reviewComment: {
    fontSize: '14px',
    color: '#475569',
    lineHeight: '1.6',
    margin: 0,
  },
  reviewImages: {
    display: 'flex',
    gap: '8px',
    marginTop: '16px',
    flexWrap: 'wrap',
  },
  reviewImage: {
    width: '80px',
    height: '80px',
    objectFit: 'cover',
    borderRadius: '8px',
    cursor: 'pointer',
  },
  reviewFooter: {
    marginTop: '16px',
    paddingTop: '16px',
    borderTop: '1px solid #f1f5f9',
  },
  helpfulBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 14px',
    backgroundColor: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '13px',
    color: '#475569',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  vendorResponse: {
    marginTop: '16px',
    padding: '16px',
    backgroundColor: '#f0fdf4',
    borderRadius: '12px',
    borderLeft: '3px solid #059669',
  },
  responseHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '8px',
  },
  responseLabel: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#059669',
  },
  responseDate: {
    fontSize: '12px',
    color: '#64748b',
  },
  responseText: {
    fontSize: '14px',
    color: '#1e293b',
    lineHeight: '1.6',
    margin: 0,
  },
};

export default ReviewsSection;
