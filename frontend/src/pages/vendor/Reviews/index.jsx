// src/pages/vendor/Reviews/index.jsx

import React, { useMemo } from 'react';
import { 
  FaStar, 
  FaSearch, 
  FaReply, 
  FaTrash, 
  FaTimes, 
  FaCommentDots,
  FaCheckCircle,
  FaUser,
  FaThumbsUp,
  FaImages,
  FaStore,
  FaPlay
} from 'react-icons/fa';
import { useVendorReviews } from './useVendorReviews';
import { getStyles } from './styles';

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

  const getMediaUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    return `${import.meta.env.VITE_API_URL?.replace('/api', '')}/storage/${path}`;
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
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.titleGroup}>
          <h1 style={styles.title}>Değerlendirmeler</h1>
          <p style={styles.subtitle}>
            Müşteri yorumlarını görüntüleyin ve yanıtlayın
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statValue}>{stats.total_reviews || 0}</div>
          <div style={styles.statLabel}>Toplam Yorum</div>
        </div>
        <div style={styles.statCard}>
          <div style={{ ...styles.statValue, color: '#f59e0b' }}>
            <FaStar size={20} />
            {stats.average_rating?.toFixed(1) || '0.0'}
          </div>
          <div style={styles.statLabel}>Ortalama Puan</div>
        </div>
        <div style={styles.statCard}>
          <div style={{ ...styles.statValue, color: '#059669' }}>{stats.total_responses || 0}</div>
          <div style={styles.statLabel}>Yanıtlanan</div>
        </div>
        <div style={styles.statCard}>
          <div style={{ ...styles.statValue, color: '#dc2626' }}>{stats.pending_responses || 0}</div>
          <div style={styles.statLabel}>Yanıt Bekleyen</div>
        </div>
        <div style={styles.statCard}>
          <div style={{ ...styles.statValue, color: '#8b5cf6' }}>
            <FaImages size={18} />
            {stats.with_media || 0}
          </div>
          <div style={styles.statLabel}>Medya İçeren</div>
        </div>
      </div>

      {/* Rating Summary */}
      {stats.total_reviews > 0 && (
        <div style={styles.ratingSummary}>
          <div style={styles.ratingOverview}>
            <div style={styles.ratingNumber}>
              {stats.average_rating?.toFixed(1) || '0.0'}
            </div>
            <div style={styles.ratingStars}>
              {renderStars(Math.round(stats.average_rating || 0), 20)}
            </div>
            <div style={styles.ratingTotal}>
              {stats.total_reviews} değerlendirme
            </div>
          </div>
          <div style={styles.ratingBars}>
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = stats.rating_breakdown?.[rating] || 0;
              const percentage = stats.total_reviews > 0 
                ? (count / stats.total_reviews) * 100 
                : 0;
              return (
                <div key={rating} style={styles.ratingBarRow}>
                  <div style={styles.ratingBarLabel}>
                    {rating} <FaStar size={12} color="#f59e0b" />
                  </div>
                  <div style={styles.ratingBarBg}>
                    <div style={styles.ratingBarFill(percentage)} />
                  </div>
                  <div style={styles.ratingBarCount}>{count}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div style={styles.toolbar}>
        <div style={styles.toolbarLeft}>
          <div style={styles.searchWrapper}>
            <FaSearch style={styles.searchIcon} />
            <input
              type="text"
              placeholder="Yorumlarda ara..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              style={styles.searchInput}
            />
          </div>
          <select
            value={filters.rating}
            onChange={(e) => handleFilterChange('rating', e.target.value)}
            style={styles.filterSelect}
          >
            <option value="">Tüm Puanlar</option>
            <option value="5">5 Yıldız</option>
            <option value="4">4 Yıldız</option>
            <option value="3">3 Yıldız</option>
            <option value="2">2 Yıldız</option>
            <option value="1">1 Yıldız</option>
          </select>
          <select
            value={filters.sortBy}
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            style={styles.filterSelect}
          >
            <option value="newest">En Yeni</option>
            <option value="oldest">En Eski</option>
            <option value="highest_rating">En Yüksek Puan</option>
            <option value="lowest_rating">En Düşük Puan</option>
          </select>
        </div>
        <div style={styles.filterBtns}>
          <button
            style={styles.filterBtn(filters.hasResponse === '')}
            onClick={() => handleFilterChange('hasResponse', '')}
          >
            Tümü
          </button>
          <button
            style={styles.filterBtn(filters.hasResponse === 'pending')}
            onClick={() => handleFilterChange('hasResponse', 'pending')}
          >
            Yanıt Bekleyen
          </button>
          <button
            style={styles.filterBtn(filters.hasResponse === 'responded')}
            onClick={() => handleFilterChange('hasResponse', 'responded')}
          >
            Yanıtlanan
          </button>
        </div>
      </div>

      {/* Reviews List */}
      {reviews.length === 0 ? (
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
          {reviews.map((review) => (
            <div key={review.id} style={styles.reviewCard}>
              {/* Review Header */}
              <div style={styles.reviewHeader}>
                <div style={styles.reviewUserSection}>
                  <div style={styles.reviewAvatar}>
                    {review.user?.profile_photo ? (
                      <img 
                        src={getMediaUrl(review.user.profile_photo)} 
                        alt={review.user.name}
                        style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                      />
                    ) : (
                      <FaUser />
                    )}
                  </div>
                  <div style={styles.reviewUserInfo}>
                    <div style={styles.reviewUserName}>
                      {review.user?.name || 'Anonim'}
                      {review.is_verified_purchase && (
                        <span style={styles.verifiedBadge}>
                          <FaCheckCircle size={10} /> Doğrulanmış
                        </span>
                      )}
                    </div>
                    <div style={styles.reviewDate}>{formatDate(review.created_at)}</div>
                  </div>
                </div>
                <div style={styles.reviewRatingSection}>
                  {renderStars(review.rating)}
                </div>
              </div>

              {/* Product Info */}
              <div style={styles.reviewProduct}>
                <img
                  src={getMediaUrl(review.product?.main_photo) || '/placeholder.jpg'}
                  alt={review.product?.name}
                  style={styles.reviewProductImage}
                />
                <div style={styles.reviewProductInfo}>
                  <div style={styles.reviewProductName}>{review.product?.name}</div>
                  <div style={styles.reviewProductMeta}>
                    <FaStore size={10} /> Ürün ID: {review.product_id}
                  </div>
                </div>
              </div>

              {/* Review Content */}
              <div style={styles.reviewContent}>
                {review.title && (
                  <h4 style={styles.reviewTitle}>{review.title}</h4>
                )}
                <p style={styles.reviewComment}>{review.comment}</p>
              </div>

              {/* Media Gallery */}
              {review.media && review.media.length > 0 && (
                <div style={styles.reviewMediaGrid}>
                  {review.media.map((media, idx) => (
                    <div
                      key={idx}
                      style={styles.reviewMediaItem}
                      onClick={() => handleOpenLightbox(getMediaUrl(media.path || media.url))}
                    >
                      {(media.type === 'video' || media.media_type === 'video') ? (
                        <div style={{ position: 'relative', width: '100%', height: '100%', backgroundColor: '#1f2937', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <FaPlay size={24} color="#fff" />
                        </div>
                      ) : (
                        <img
                          src={getMediaUrl(media.path || media.url)}
                          alt={`Review media ${idx + 1}`}
                          style={styles.reviewMediaImage}
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Review Stats */}
              <div style={styles.reviewStats}>
                <div style={styles.reviewStatItem}>
                  <FaThumbsUp size={12} />
                  {review.helpful_count || 0} kişi faydalı buldu
                </div>
              </div>

              {/* Vendor Response */}
              {review.response && (
                <div style={styles.responseSection}>
                  <div style={styles.responseHeader}>
                    <span style={styles.responseTitle}>
                      <FaStore size={12} /> Yanıtınız
                    </span>
                    <span style={styles.responseDate}>
                      {formatDate(review.response.created_at)}
                    </span>
                  </div>
                  <p style={styles.responseText}>{review.response.response}</p>
                  <button
                    style={styles.responseDeleteBtn}
                    onClick={() => handleDeleteResponse(review.response.id)}
                  >
                    <FaTrash size={10} /> Yanıtı Sil
                  </button>
                </div>
              )}

              {/* Reply Form */}
              {!review.response && activeReplyId !== review.id && (
                <button
                  style={styles.actionBtn}
                  onClick={() => handleStartReply(review.id)}
                >
                  <FaReply size={12} /> Yanıtla
                </button>
              )}

              {activeReplyId === review.id && (
                <div style={styles.replyForm}>
                  <div style={styles.replyFormTitle}>
                    <FaReply size={12} /> Yanıtınızı yazın
                  </div>
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Müşteriye yanıtınızı yazın..."
                    style={styles.replyTextarea}
                    maxLength={1000}
                  />
                  <div style={styles.replyCharCount}>
                    {replyText.length}/1000
                  </div>
                  <div style={styles.replyActions}>
                    <button
                      style={styles.cancelBtn}
                      onClick={handleCancelReply}
                    >
                      İptal
                    </button>
                    <button
                      style={styles.replyBtn}
                      onClick={() => handleSubmitReply(review.id)}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Gönderiliyor...' : 'Yanıtla'}
                    </button>
                  </div>
                </div>
              )}
            </div>
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
      {lightboxImage && (
        <div style={styles.lightbox} onClick={handleCloseLightbox}>
          <button style={styles.lightboxClose} onClick={handleCloseLightbox}>
            <FaTimes />
          </button>
          <img
            src={lightboxImage}
            alt="Review media"
            style={styles.lightboxImage}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};

export default VendorReviewsPage;
