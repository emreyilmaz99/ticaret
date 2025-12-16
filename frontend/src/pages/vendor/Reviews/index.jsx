// src/pages/vendor/Reviews/index.jsx

import React, { useMemo } from 'react';
import { FaStar, FaCommentDots } from 'react-icons/fa';
import { useVendorReviews } from './useVendorReviews';
import { getStyles } from './styles';
import {
  ReviewsHeader,
  ReviewStats,
  RatingSummary,
  ReviewToolbar,
  ReviewCard,
  Lightbox,
} from './components';

const VendorReviewsPage = () => {
  const {
    reviews,
    pagination,
    stats,
    filters,
    activeReplyId,
    replyText,
    lightboxImage,
    reviewsLoading,
    isSubmitting,
    setReplyText,
    handleFilterChange,
    handlePageChange,
    handleStartReply,
    handleCancelReply,
    handleSubmitReply,
    handleDeleteResponse,
    handleOpenLightbox,
    handleCloseLightbox,
  } = useVendorReviews();

  const styles = useMemo(() => getStyles(window.innerWidth <= 768), []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const renderStars = (rating, size = 16) => {
    return (
      <div style={{ display: 'flex', gap: '2px' }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <FaStar
            key={star}
            size={size}
            color={star <= rating ? '#f59e0b' : '#e5e7eb'}
          />
        ))}
      </div>
    );
  };

  const getMediaUrl = (pathOrUrl) => {
    if (!pathOrUrl) return '/placeholder.jpg';
    if (pathOrUrl.startsWith('http')) return pathOrUrl;
    const baseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://127.0.0.1:8000';
    return `${baseUrl}/storage/${pathOrUrl}`;
  };

  if (reviewsLoading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingContainer}>
          <div style={styles.spinner} />
          <p style={{ color: '#64748b' }}>Değerlendirmeler yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <ReviewsHeader styles={styles} />
      <ReviewStats stats={stats} styles={styles} />
      <RatingSummary stats={stats} renderStars={renderStars} styles={styles} />
      <ReviewToolbar filters={filters} handleFilterChange={handleFilterChange} styles={styles} />

      {/* Reviews List */}
      {!reviews || reviews.length === 0 ? (
        <div style={styles.emptyStateContainer}>
          <div style={styles.emptyState}>
            <FaCommentDots style={styles.emptyIcon} />
            <h3 style={styles.emptyTitle}>Henüz değerlendirme yok</h3>
            <p style={styles.emptyText}>
              Ürünleriniz için henüz müşteri değerlendirmesi bulunmuyor.
            </p>
          </div>
        </div>
      ) : (
        <div style={styles.reviewsList}>
          {Array.isArray(reviews) && reviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              renderStars={renderStars}
              formatDate={formatDate}
              getMediaUrl={getMediaUrl}
              activeReplyId={activeReplyId}
              replyText={replyText}
              setReplyText={setReplyText}
              isSubmitting={isSubmitting}
              handleOpenLightbox={handleOpenLightbox}
              handleStartReply={handleStartReply}
              handleCancelReply={handleCancelReply}
              handleSubmitReply={handleSubmitReply}
              handleDeleteResponse={handleDeleteResponse}
              styles={styles}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '24px' }}>
          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              style={{
                padding: '8px 14px',
                border: 'none',
                borderRadius: '8px',
                backgroundColor: pagination.currentPage === page ? '#059669' : '#f1f5f9',
                color: pagination.currentPage === page ? '#fff' : '#64748b',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '14px',
              }}
            >
              {page}
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      <Lightbox lightboxImage={lightboxImage} handleCloseLightbox={handleCloseLightbox} styles={styles} />
    </div>
  );
};

export default VendorReviewsPage;
