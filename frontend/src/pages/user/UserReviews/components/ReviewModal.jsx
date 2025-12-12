// src/pages/user/UserReviews/components/ReviewModal.jsx
import React, { useRef } from 'react';
import { 
  FaTimes, FaStar, FaCamera, FaVideo, FaPlay, 
  FaTrash, FaUserSecret, FaPaperPlane 
} from 'react-icons/fa';

const ReviewModal = ({
  isOpen,
  product,
  formData,
  setFormData,
  hoveredStar,
  setHoveredStar,
  mediaPreviews,
  handleFileUpload,
  removeMediaFile,
  onClose,
  onSubmit,
  isSubmitting,
  getRatingLabel,
  styles,
}) => {
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const renderStars = () => {
    return (
      <div>
        <div style={styles.starRatingContainer}>
          {[1, 2, 3, 4, 5].map((star) => {
            const isActive = star <= (hoveredStar || formData.rating);
            return (
              <button
                key={star}
                type="button"
                style={{
                  ...styles.starButton,
                  transform: hoveredStar === star ? 'scale(1.2)' : 'scale(1)',
                }}
                onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                onMouseEnter={() => setHoveredStar(star)}
                onMouseLeave={() => setHoveredStar(0)}
              >
                <FaStar 
                  size={32} 
                  color={isActive ? '#f59e0b' : '#e5e7eb'} 
                />
              </button>
            );
          })}
          {(hoveredStar || formData.rating) > 0 && (
            <span style={styles.ratingText}>
              {getRatingLabel(hoveredStar || formData.rating)}
            </span>
          )}
        </div>
        <div style={styles.ratingLabels}>
          <span>Çok Kötü</span>
          <span>Çok İyi</span>
        </div>
      </div>
    );
  };

  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={styles.modalHeader}>
          <h2 style={styles.modalTitle}>Ürünü Değerlendir</h2>
          <button style={styles.modalCloseBtn} onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        {/* Body */}
        <div style={styles.modalBody}>
          {/* Product Preview */}
          {product && (
            <div style={styles.productPreview}>
              <img
                src={
                  product.product_image 
                    ? `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/storage/${product.product_image}`
                    : 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23f1f5f9" width="200" height="200"/%3E%3Ctext fill="%2394a3b8" font-family="Arial" font-size="14" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EGörsel Yok%3C/text%3E%3C/svg%3E'
                }
                alt={product.product_name}
                style={styles.productPreviewImage}
                onError={(e) => { 
                  e.target.onerror = null;
                  e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23f1f5f9" width="200" height="200"/%3E%3Ctext fill="%2394a3b8" font-family="Arial" font-size="14" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EGörsel Yok%3C/text%3E%3C/svg%3E'; 
                }}
              />
              <div style={styles.productPreviewInfo}>
                <div style={styles.productPreviewName}>{product.product_name}</div>
                <div style={styles.productPreviewMeta}>Sipariş No: #{product.order_number}</div>
              </div>
            </div>
          )}

          {/* Rating */}
          <div style={styles.formGroup}>
            <label style={styles.formLabel}>
              Puanınız <span style={styles.formLabelRequired}>*</span>
            </label>
            {renderStars()}
          </div>

          {/* Title */}
          <div style={styles.formGroup}>
            <label style={styles.formLabel}>Başlık</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Değerlendirmenize kısa bir başlık ekleyin..."
              maxLength={100}
              style={styles.input}
            />
            <div style={styles.charCount}>{formData.title.length}/100</div>
          </div>

          {/* Comment */}
          <div style={styles.formGroup}>
            <label style={styles.formLabel}>
              Yorumunuz <span style={styles.formLabelRequired}>*</span>
            </label>
            <textarea
              value={formData.comment}
              onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
              placeholder="Ürün hakkındaki deneyiminizi paylaşın. Diğer kullanıcılara yardımcı olacak detaylar ekleyin..."
              maxLength={1000}
              style={styles.textarea}
            />
            <div style={styles.charCount}>{formData.comment.length}/1000</div>
          </div>

          {/* Media Upload */}
          <div style={styles.mediaUploadSection}>
            <div style={styles.mediaUploadTitle}>
              <FaCamera /> Fotoğraf / Video Ekle
            </div>
            <div style={styles.mediaUploadHint}>
              En fazla 5 adet fotoğraf veya video ekleyebilirsiniz. (Resim: max 10MB, Video: max 50MB)
            </div>
            
            <div style={styles.mediaUploadGrid}>
              {/* Previews */}
              {mediaPreviews.map((preview, index) => (
                <div key={index} style={styles.mediaPreviewItem}>
                  {preview.type === 'video' ? (
                    <>
                      <video src={preview.url} style={styles.mediaPreviewVideo} />
                      <div style={styles.videoPlayIcon}>
                        <FaPlay />
                      </div>
                    </>
                  ) : (
                    <img src={preview.url} alt="" style={styles.mediaPreviewImage} />
                  )}
                  <button
                    type="button"
                    style={styles.mediaPreviewRemove}
                    onClick={() => removeMediaFile(index)}
                  >
                    <FaTimes size={12} />
                  </button>
                </div>
              ))}

              {/* Upload Button */}
              {mediaPreviews.length < 5 && (
                <div
                  style={styles.mediaUploadBox}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div style={styles.mediaUploadIcon}>
                    <FaCamera />
                  </div>
                  <span style={styles.mediaUploadText}>Ekle</span>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                multiple
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />
            </div>
          </div>

          {/* Anonymous Option */}
          <label style={styles.anonymousOption}>
            <input
              type="checkbox"
              checked={formData.is_anonymous}
              onChange={(e) => setFormData(prev => ({ ...prev, is_anonymous: e.target.checked }))}
              style={styles.checkbox}
            />
            <div>
              <div style={styles.anonymousLabel}>
                <FaUserSecret style={{ marginRight: '6px' }} />
                Anonim olarak değerlendir
              </div>
              <div style={styles.anonymousHint}>
                İsminiz diğer kullanıcılara gösterilmez
              </div>
            </div>
          </label>
        </div>

        {/* Footer */}
        <div style={styles.modalFooter}>
          <button 
            style={styles.secondaryBtn} 
            onClick={onClose}
            disabled={isSubmitting}
          >
            Vazgeç
          </button>
          <button
            style={{
              ...styles.primaryBtn,
              ...(isSubmitting || formData.rating === 0 ? styles.disabledBtn : {}),
            }}
            onClick={onSubmit}
            disabled={isSubmitting || formData.rating === 0}
          >
            {isSubmitting ? (
              <>Gönderiliyor...</>
            ) : (
              <>
                <FaPaperPlane /> Değerlendirmeyi Gönder
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;
