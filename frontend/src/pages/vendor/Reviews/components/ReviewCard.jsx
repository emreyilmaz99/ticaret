import React from 'react';
import PropTypes from 'prop-types';
import { FaUser, FaCheckCircle, FaStore } from 'react-icons/fa';
import ReviewMedia from './ReviewMedia';
import VendorResponse from './VendorResponse';
import ReplyForm from './ReplyForm';

const ReviewCard = ({
  review,
  renderStars,
  formatDate,
  getMediaUrl,
  activeReplyId,
  replyText,
  setReplyText,
  isSubmitting,
  handleOpenLightbox,
  handleStartReply,
  handleCancelReply,
  handleSubmitReply,
  handleDeleteResponse,
  styles,
}) => {
  return (
    <div style={styles.reviewCard}>
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
      {review.product && (
        <div style={styles.reviewProduct}>
          <img
            src={review.product.image || review.product.main_photo || '/placeholder.jpg'}
            alt={review.product?.name || 'Ürün'}
            style={styles.reviewProductImage}
            onError={(e) => { e.target.src = '/placeholder.jpg'; }}
          />
          <div style={styles.reviewProductInfo}>
            <div style={styles.reviewProductName}>{review.product?.name}</div>
            <div style={styles.reviewProductMeta}>
              <FaStore size={10} /> Ürün ID: {review.product_id}
            </div>
          </div>
        </div>
      )}

      {/* Review Content */}
      <div style={styles.reviewContent}>
        {review.title && (
          <h4 style={styles.reviewTitle}>{review.title}</h4>
        )}
        <p style={styles.reviewComment}>{review.comment}</p>
      </div>

      {/* Media Gallery */}
      {review.media && review.media.length > 0 && (
        <ReviewMedia 
          media={review.media} 
          getMediaUrl={getMediaUrl}
          handleOpenLightbox={handleOpenLightbox}
          styles={styles}
        />
      )}

      {/* Review Stats */}
      <div style={styles.reviewStats}>
        <div style={styles.reviewStatItem}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"/></svg>
          {review.helpful_count || 0} kişi faydalı buldu
        </div>
      </div>

      {/* Vendor Response */}
      {review.response && (
        <VendorResponse 
          response={review.response}
          formatDate={formatDate}
          handleDeleteResponse={handleDeleteResponse}
          styles={styles}
        />
      )}

      {/* Reply Form */}
      {!review.response && activeReplyId !== review.id && (
        <button
          style={styles.actionBtn}
          onClick={() => handleStartReply(review.id)}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M10 9V5l-7 7 7 7v-4.1c5 0 8.5 1.6 11 5.1-1-5-4-10-11-11z"/></svg> Yanıtla
        </button>
      )}

      {activeReplyId === review.id && (
        <ReplyForm 
          replyText={replyText}
          setReplyText={setReplyText}
          isSubmitting={isSubmitting}
          handleCancelReply={handleCancelReply}
          handleSubmitReply={() => handleSubmitReply(review.id)}
          styles={styles}
        />
      )}
    </div>
  );
};

ReviewCard.propTypes = {
  review: PropTypes.object.isRequired,
  renderStars: PropTypes.func.isRequired,
  formatDate: PropTypes.func.isRequired,
  getMediaUrl: PropTypes.func.isRequired,
  activeReplyId: PropTypes.number,
  replyText: PropTypes.string.isRequired,
  setReplyText: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
  handleOpenLightbox: PropTypes.func.isRequired,
  handleStartReply: PropTypes.func.isRequired,
  handleCancelReply: PropTypes.func.isRequired,
  handleSubmitReply: PropTypes.func.isRequired,
  handleDeleteResponse: PropTypes.func.isRequired,
  styles: PropTypes.object.isRequired,
};

export default ReviewCard;
