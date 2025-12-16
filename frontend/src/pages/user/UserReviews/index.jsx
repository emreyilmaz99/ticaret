// src/pages/user/UserReviews/index.jsx
import React from 'react';
import { 
  FaStar, FaClipboardList, FaClock, FaCheckCircle, 
  FaCommentAlt, FaShoppingBag 
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import ConfirmModal from '../../../components/modals/ConfirmModal';

import { getStyles } from './styles';
import { useUserReviews } from './useUserReviews';
import { 
  ReviewModal, 
  ReviewCard, 
  PendingReviewCard
} from './components';

const UserReviews = () => {
  const styles = getStyles();

  const {
    // Tab
    activeTab,
    setActiveTab,

    // Data
    reviews,
    reviewableOrders,
    pendingCount,
    stats,
    isLoading,

    // Review Modal
    reviewModal,
    openReviewModal,
    closeReviewModal,

    // Delete Modal
    deleteModal,
    setDeleteModal,

    // Form
    formData,
    setFormData,
    hoveredStar,
    setHoveredStar,
    mediaPreviews,
    handleFileUpload,
    removeMediaFile,

    // Actions
    handleSubmitReview,
    deleteReviewMutation,

    // Helpers
    getRatingLabel,
    getStatusConfig,
    isSubmitting,
    isDeleting,
  } = useUserReviews();

  // Loading State
  if (isLoading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p style={{ color: '#64748b', margin: 0 }}>Değerlendirmeler yükleniyor...</p>
        <style>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h2 style={styles.headerTitle}>Değerlendirmelerim</h2>
          <p style={styles.headerSubtitle}>
            Aldığınız ürünleri değerlendirin ve diğer kullanıcılara yardımcı olun
          </p>
        </div>
      </div>

      {/* Stats Row */}
      <div style={styles.statsRow}>
        <div style={styles.statCard}>
          <div style={styles.statValue}>{stats.total}</div>
          <div style={styles.statLabel}>Toplam Yorum</div>
        </div>
        <div style={styles.statCard}>
          <div style={{ ...styles.statValue, color: '#059669' }}>{stats.approved}</div>
          <div style={styles.statLabel}>Onaylanan</div>
        </div>
        <div style={styles.statCard}>
          <div style={{ ...styles.statValue, color: '#f59e0b' }}>{stats.pending}</div>
          <div style={styles.statLabel}>Bekleyen</div>
        </div>
        <div style={styles.statCard}>
          <div style={{ ...styles.statValue, color: '#f59e0b' }}>
            <FaStar style={{ marginRight: '4px' }} />
            {stats.avgRating}
          </div>
          <div style={styles.statLabel}>Ort. Puan</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={styles.tabs}>
        <button
          style={activeTab === 'myReviews' ? styles.tabActive : styles.tab}
          onClick={() => setActiveTab('myReviews')}
        >
          <FaCommentAlt />
          Yorumlarım
          <span style={activeTab === 'myReviews' ? styles.tabBadge : styles.tabBadgeInactive}>
            {stats.total}
          </span>
        </button>
        <button
          style={activeTab === 'pending' ? styles.tabActive : styles.tab}
          onClick={() => setActiveTab('pending')}
        >
          <FaClock />
          Bekleyen
          {pendingCount > 0 && (
            <span style={activeTab === 'pending' ? styles.tabBadge : styles.tabBadgeInactive}>
              {pendingCount}
            </span>
          )}
        </button>
      </div>

      {/* Content */}
      {activeTab === 'pending' ? (
        // Pending Reviews Tab
        <>
          {pendingCount > 0 ? (
            <div style={styles.pendingSection}>
              <h3 style={styles.pendingSectionTitle}>
                <FaClipboardList />
                Değerlendirme Bekleyen Ürünler ({pendingCount})
              </h3>
              
              <div style={styles.pendingGrid}>
                {reviewableOrders.map((order) =>
                  order.reviewable_items.map((item) => (
                    <PendingReviewCard
                      key={`${order.order_id}-${item.order_item_id}`}
                      item={item}
                      orderNumber={order.order_number}
                      orderId={order.order_id}
                      onReview={openReviewModal}
                      styles={styles}
                    />
                  ))
                )}
              </div>
            </div>
          ) : (
            <div style={styles.emptyState}>
              <FaCheckCircle style={styles.emptyIcon} />
              <h3 style={styles.emptyTitle}>Tüm ürünleri değerlendirdiniz!</h3>
              <p style={styles.emptyText}>
                Şu anda değerlendirme bekleyen ürününüz yok.
              </p>
              <Link to="/" style={{ textDecoration: 'none' }}>
                <button style={styles.emptyBtn}>
                  <FaShoppingBag style={{ marginRight: '8px' }} />
                  Alışverişe Devam Et
                </button>
              </Link>
            </div>
          )}
        </>
      ) : (
        // My Reviews Tab
        <>
          {reviews.length > 0 ? (
            <div style={styles.reviewsList}>
              {reviews.map((review) => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  onDelete={(id) => setDeleteModal({ isOpen: true, reviewId: id })}
                  getStatusConfig={getStatusConfig}
                  styles={styles}
                />
              ))}
            </div>
          ) : (
            <div style={styles.emptyState}>
              <FaCommentAlt style={styles.emptyIcon} />
              <h3 style={styles.emptyTitle}>Henüz değerlendirme yapmadınız</h3>
              <p style={styles.emptyText}>
                Satın aldığınız ürünleri değerlendirerek diğer kullanıcılara yardımcı olun.
              </p>
              {pendingCount > 0 && (
                <button 
                  style={styles.emptyBtn}
                  onClick={() => setActiveTab('pending')}
                >
                  {pendingCount} Ürünü Değerlendir
                </button>
              )}
            </div>
          )}
        </>
      )}

      {/* Review Modal */}
      <ReviewModal
        isOpen={reviewModal.isOpen}
        product={reviewModal.product}
        formData={formData}
        setFormData={setFormData}
        hoveredStar={hoveredStar}
        setHoveredStar={setHoveredStar}
        mediaPreviews={mediaPreviews}
        handleFileUpload={handleFileUpload}
        removeMediaFile={removeMediaFile}
        onClose={closeReviewModal}
        onSubmit={handleSubmitReview}
        isSubmitting={isSubmitting}
        getRatingLabel={getRatingLabel}
        styles={styles}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, reviewId: null })}
        onConfirm={() => deleteReviewMutation.mutate(deleteModal.reviewId)}
        title="Değerlendirmeyi Sil"
        message="Bu değerlendirmeyi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz."
        confirmText={isDeleting ? 'Siliniyor...' : 'Evet, Sil'}
        cancelText="Vazgeç"
        type="danger"
        isLoading={isDeleting}
      />
    </div>
  );
};

export default UserReviews;
