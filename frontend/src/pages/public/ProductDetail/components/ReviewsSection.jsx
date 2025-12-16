// src/pages/public/ProductDetail/components/ReviewsSection.jsx
import React, { useState, useRef, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { 
  FaStar, FaThumbsUp, FaThumbsDown, FaCamera, FaVideo, FaPlay,
  FaUserCircle, FaCheckCircle, FaFilter, FaSortAmountDown,
  FaPen, FaTimes, FaImage, FaUserSecret, FaPaperPlane,
  FaChevronDown, FaChevronUp, FaStore
} from 'react-icons/fa';
import { useAuth } from '../../../../context/AuthContext';
import apiClient from '@lib/apiClient';
import { toast } from 'react-hot-toast';

const ReviewsSection = ({ productId, productName, styles: parentStyles }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const fileInputRef = useRef(null);

  // Local state
  const [showWriteReview, setShowWriteReview] = useState(false);
  const [ratingFilter, setRatingFilter] = useState(null);
  const [sortBy, setSortBy] = useState('recent');
  const [expandedReview, setExpandedReview] = useState(null);
  const [lightboxImage, setLightboxImage] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    rating: 0,
    title: '',
    comment: '',
    is_anonymous: false,
  });
  const [hoveredStar, setHoveredStar] = useState(0);
  const [mediaFiles, setMediaFiles] = useState([]);
  const [mediaPreviews, setMediaPreviews] = useState([]);

  // Fetch reviews
  const { data: reviewsData, isLoading } = useQuery({
    queryKey: ['productReviews', productId, ratingFilter, sortBy],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (ratingFilter) params.append('rating', ratingFilter);
      params.append('sort_by', sortBy);
      params.append('per_page', '50');
      
      const response = await apiClient.get(`/v1/products/${productId}/reviews?${params}`);
      return response.data;
    },
    enabled: !!productId,
  });

  // Fetch summary
  const { data: summaryData } = useQuery({
    queryKey: ['productReviewSummary', productId],
    queryFn: async () => {
      const response = await apiClient.get(`/v1/products/${productId}/review-summary`);
      return response.data;
    },
    enabled: !!productId,
  });

  // Check if user can review this product (must have purchased and delivered)
  const { data: canReviewData } = useQuery({
    queryKey: ['canReview', productId],
    queryFn: async () => {
      const response = await apiClient.get('/v1/user/reviewable-orders');
      const orders = response.data?.data || [];
      // Check if any reviewable item matches this product
      for (const order of orders) {
        const item = order.reviewable_items.find(item => item.product_id === parseInt(productId));
        if (item) {
          return { 
            canReview: true, 
            orderId: order.order_id, 
            orderItemId: item.order_item_id 
          };
        }
      }
      return { canReview: false };
    },
    enabled: !!user && !!productId,
  });

  // Helpful vote mutation
  const helpfulMutation = useMutation({
    mutationFn: async ({ reviewId, isHelpful }) => {
      const response = await apiClient.post(`/v1/reviews/${reviewId}/helpful`, { is_helpful: isHelpful });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['productReviews', productId]);
    },
  });

  // Submit review mutation
  const submitReviewMutation = useMutation({
    mutationFn: async ({ orderId, orderItemId, data, files }) => {
      const formDataObj = new FormData();
      formDataObj.append('rating', data.rating);
      formDataObj.append('title', data.title);
      formDataObj.append('comment', data.comment);
      formDataObj.append('is_anonymous', data.is_anonymous ? '1' : '0');
      
      files.forEach((file, index) => {
        formDataObj.append(`photos[${index}]`, file);
      });

      const response = await apiClient.post(
        `/v1/orders/${orderId}/items/${orderItemId}/review`,
        formDataObj,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['productReviews', productId]);
      queryClient.invalidateQueries(['productReviewSummary', productId]);
      queryClient.invalidateQueries(['canReview', productId]);
      toast.success('Değerlendirmeniz başarıyla gönderildi! Onay bekliyor.');
      resetForm();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Değerlendirme gönderilemedi');
    },
  });

  const reviews = reviewsData?.data?.data || [];
  const summary = summaryData?.data || { total_reviews: 0, average_rating: 0, rating_breakdown: {} };
  const canReview = canReviewData?.canReview || false;

  // Debug logging
  React.useEffect(() => {
    if (reviewsData) {
      console.log('Reviews API Response:', reviewsData);
      console.log('Extracted reviews:', reviews);
      console.log('Reviews count:', reviews.length);
    }
  }, [reviewsData, reviews]);

  // Calculate rating percentages
  const ratingPercentages = useMemo(() => {
    const total = summary.total_reviews || 1;
    const percentages = {};
    for (let i = 5; i >= 1; i--) {
      const count = summary.rating_breakdown?.[i] || 0;
      percentages[i] = Math.round((count / total) * 100);
    }
    return percentages;
  }, [summary]);

  // Helpers
  const getRatingLabel = (rating) => {
    const labels = { 1: 'Çok Kötü', 2: 'Kötü', 3: 'Orta', 4: 'İyi', 5: 'Mükemmel' };
    return labels[rating] || '';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const remainingSlots = 5 - mediaFiles.length;
    const filesToAdd = files.slice(0, remainingSlots);

    if (files.length > remainingSlots) {
      toast.error(`En fazla 5 dosya yükleyebilirsiniz.`);
    }

    const validFiles = filesToAdd.filter(file => {
      const isImage = file.type.startsWith('image/');
      const isVideo = file.type.startsWith('video/');
      const maxSize = isVideo ? 50 * 1024 * 1024 : 10 * 1024 * 1024;
      
      if (!isImage && !isVideo) {
        toast.error(`${file.name}: Sadece resim ve video dosyaları yüklenebilir`);
        return false;
      }
      if (file.size > maxSize) {
        toast.error(`${file.name}: Dosya boyutu çok büyük`);
        return false;
      }
      return true;
    });

    const newPreviews = validFiles.map(file => ({
      url: URL.createObjectURL(file),
      type: file.type.startsWith('video/') ? 'video' : 'image',
      name: file.name,
    }));

    setMediaFiles(prev => [...prev, ...validFiles]);
    setMediaPreviews(prev => [...prev, ...newPreviews]);
  };

  const removeMediaFile = (index) => {
    URL.revokeObjectURL(mediaPreviews[index]?.url);
    setMediaFiles(prev => prev.filter((_, i) => i !== index));
    setMediaPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    setFormData({ rating: 0, title: '', comment: '', is_anonymous: false });
    setMediaFiles([]);
    setMediaPreviews([]);
    setHoveredStar(0);
    setShowWriteReview(false);
  };

  const handleSubmit = async () => {
    if (formData.rating === 0) {
      toast.error('Lütfen bir puan seçin');
      return;
    }
    if (formData.comment.length < 10) {
      toast.error('Yorum en az 10 karakter olmalıdır');
      return;
    }

    await submitReviewMutation.mutateAsync({
      orderId: canReviewData.orderId,
      orderItemId: canReviewData.orderItemId,
      data: formData,
      files: mediaFiles,
    });
  };

  // Styles
  const styles = {
    container: {
      padding: '0',
    },
    summarySection: {
      display: 'flex',
      gap: '40px',
      marginBottom: '32px',
      padding: '24px',
      backgroundColor: '#f8fafc',
      borderRadius: '16px',
      flexWrap: 'wrap',
    },
    averageRating: {
      textAlign: 'center',
      minWidth: '140px',
    },
    averageNumber: {
      fontSize: '48px',
      fontWeight: '800',
      color: '#0f172a',
      lineHeight: 1,
    },
    averageStars: {
      display: 'flex',
      justifyContent: 'center',
      gap: '4px',
      margin: '12px 0 8px',
    },
    totalReviews: {
      fontSize: '14px',
      color: '#64748b',
    },
    ratingBars: {
      flex: 1,
      minWidth: '200px',
    },
    ratingBar: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '8px',
      cursor: 'pointer',
      padding: '4px 8px',
      borderRadius: '6px',
      transition: 'background-color 0.2s',
    },
    ratingLabel: {
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      width: '60px',
      fontSize: '14px',
      color: '#374151',
    },
    barContainer: {
      flex: 1,
      height: '10px',
      backgroundColor: '#e5e7eb',
      borderRadius: '5px',
      overflow: 'hidden',
    },
    barFill: (percentage) => ({
      height: '100%',
      width: `${percentage}%`,
      backgroundColor: '#f59e0b',
      borderRadius: '5px',
      transition: 'width 0.3s ease',
    }),
    ratingCount: {
      fontSize: '13px',
      color: '#64748b',
      width: '30px',
      textAlign: 'right',
    },
    writeReviewSection: {
      marginBottom: '24px',
    },
    writeReviewBtn: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '12px 24px',
      fontSize: '14px',
      fontWeight: '600',
      color: '#fff',
      backgroundColor: '#059669',
      border: 'none',
      borderRadius: '10px',
      cursor: 'pointer',
      transition: 'all 0.2s',
    },
    writeReviewForm: {
      backgroundColor: '#fff',
      borderRadius: '16px',
      padding: '24px',
      border: '1px solid #e2e8f0',
      marginTop: '16px',
    },
    formHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px',
    },
    formTitle: {
      fontSize: '18px',
      fontWeight: '700',
      color: '#0f172a',
      margin: 0,
    },
    closeBtn: {
      background: 'none',
      border: 'none',
      fontSize: '20px',
      color: '#64748b',
      cursor: 'pointer',
    },
    formGroup: {
      marginBottom: '20px',
    },
    formLabel: {
      display: 'block',
      fontSize: '14px',
      fontWeight: '600',
      color: '#374151',
      marginBottom: '8px',
    },
    starRating: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    starButton: {
      background: 'none',
      border: 'none',
      padding: '4px',
      cursor: 'pointer',
      transition: 'transform 0.15s',
    },
    ratingText: {
      marginLeft: '12px',
      fontSize: '14px',
      fontWeight: '600',
      color: '#64748b',
    },
    input: {
      width: '100%',
      padding: '12px 16px',
      fontSize: '14px',
      border: '1px solid #e2e8f0',
      borderRadius: '10px',
      outline: 'none',
      boxSizing: 'border-box',
    },
    textarea: {
      width: '100%',
      padding: '12px 16px',
      fontSize: '14px',
      border: '1px solid #e2e8f0',
      borderRadius: '10px',
      outline: 'none',
      resize: 'vertical',
      minHeight: '120px',
      fontFamily: 'inherit',
      boxSizing: 'border-box',
    },
    charCount: {
      textAlign: 'right',
      fontSize: '12px',
      color: '#9ca3af',
      marginTop: '4px',
    },
    mediaUploadGrid: {
      display: 'flex',
      gap: '12px',
      flexWrap: 'wrap',
    },
    mediaUploadBox: {
      width: '80px',
      height: '80px',
      borderRadius: '10px',
      border: '2px dashed #d1d5db',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      backgroundColor: '#fafafa',
      transition: 'all 0.2s',
    },
    mediaPreviewItem: {
      width: '80px',
      height: '80px',
      borderRadius: '10px',
      position: 'relative',
      overflow: 'hidden',
      border: '2px solid #e2e8f0',
    },
    mediaPreviewImage: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
    },
    mediaRemoveBtn: {
      position: 'absolute',
      top: '4px',
      right: '4px',
      width: '20px',
      height: '20px',
      borderRadius: '50%',
      backgroundColor: 'rgba(239, 68, 68, 0.9)',
      color: '#fff',
      border: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      fontSize: '12px',
    },
    anonymousOption: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      padding: '12px 16px',
      backgroundColor: '#f8fafc',
      borderRadius: '10px',
      cursor: 'pointer',
    },
    formActions: {
      display: 'flex',
      gap: '12px',
      justifyContent: 'flex-end',
      marginTop: '20px',
    },
    cancelBtn: {
      padding: '12px 24px',
      fontSize: '14px',
      fontWeight: '600',
      color: '#64748b',
      backgroundColor: '#f1f5f9',
      border: 'none',
      borderRadius: '10px',
      cursor: 'pointer',
    },
    submitBtn: {
      padding: '12px 24px',
      fontSize: '14px',
      fontWeight: '600',
      color: '#fff',
      backgroundColor: '#059669',
      border: 'none',
      borderRadius: '10px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    toolbarSection: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px',
      flexWrap: 'wrap',
      gap: '12px',
    },
    filterBtns: {
      display: 'flex',
      gap: '8px',
      flexWrap: 'wrap',
    },
    filterBtn: (isActive) => ({
      padding: '8px 16px',
      fontSize: '13px',
      fontWeight: '600',
      color: isActive ? '#fff' : '#64748b',
      backgroundColor: isActive ? '#059669' : '#f1f5f9',
      border: 'none',
      borderRadius: '20px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      transition: 'all 0.2s',
    }),
    sortSelect: {
      padding: '8px 16px',
      fontSize: '13px',
      fontWeight: '600',
      color: '#64748b',
      backgroundColor: '#f1f5f9',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      outline: 'none',
    },
    reviewsList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
    },
    reviewCard: {
      backgroundColor: '#fff',
      borderRadius: '16px',
      padding: '20px',
      border: '1px solid #e5e7eb',
    },
    reviewHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '12px',
    },
    reviewUser: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    },
    reviewAvatar: {
      width: '44px',
      height: '44px',
      borderRadius: '50%',
      backgroundColor: '#f1f5f9',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#94a3b8',
      fontSize: '20px',
    },
    reviewUserInfo: {
      display: 'flex',
      flexDirection: 'column',
      gap: '4px',
    },
    reviewUserName: {
      fontSize: '15px',
      fontWeight: '600',
      color: '#0f172a',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
    },
    verifiedBadge: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
      fontSize: '11px',
      color: '#059669',
      backgroundColor: '#d1fae5',
      padding: '2px 8px',
      borderRadius: '10px',
    },
    reviewDate: {
      fontSize: '13px',
      color: '#64748b',
    },
    reviewStars: {
      display: 'flex',
      gap: '2px',
    },
    reviewContent: {
      marginBottom: '16px',
    },
    reviewTitle: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#0f172a',
      marginBottom: '8px',
    },
    reviewComment: {
      fontSize: '14px',
      color: '#475569',
      lineHeight: '1.7',
    },
    reviewMediaGrid: {
      display: 'flex',
      gap: '8px',
      flexWrap: 'wrap',
      marginBottom: '16px',
    },
    reviewMediaItem: {
      width: '100px',
      height: '100px',
      borderRadius: '10px',
      overflow: 'hidden',
      cursor: 'pointer',
      border: '2px solid #e5e7eb',
      position: 'relative',
      transition: 'transform 0.2s',
    },
    reviewMediaImage: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
    },
    vendorResponse: {
      backgroundColor: '#f0fdf4',
      borderRadius: '12px',
      padding: '16px',
      marginTop: '12px',
      border: '1px solid #bbf7d0',
    },
    vendorResponseHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      marginBottom: '8px',
    },
    vendorResponseTitle: {
      fontSize: '13px',
      fontWeight: '600',
      color: '#166534',
    },
    vendorResponseText: {
      fontSize: '14px',
      color: '#15803d',
      lineHeight: '1.6',
    },
    reviewFooter: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: '12px',
      borderTop: '1px solid #f1f5f9',
    },
    helpfulBtns: {
      display: 'flex',
      gap: '12px',
    },
    helpfulBtn: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      padding: '6px 12px',
      fontSize: '13px',
      color: '#64748b',
      backgroundColor: '#f8fafc',
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'all 0.2s',
    },
    emptyState: {
      textAlign: 'center',
      padding: '60px 20px',
    },
    emptyIcon: {
      fontSize: '48px',
      color: '#cbd5e1',
      marginBottom: '16px',
    },
    emptyTitle: {
      fontSize: '18px',
      fontWeight: '700',
      color: '#0f172a',
      marginBottom: '8px',
    },
    emptyText: {
      fontSize: '14px',
      color: '#64748b',
      marginBottom: '20px',
    },
    loginPrompt: {
      textAlign: 'center',
      padding: '16px',
      backgroundColor: '#fef3c7',
      borderRadius: '10px',
      marginBottom: '20px',
    },
    loginLink: {
      color: '#059669',
      fontWeight: '600',
      textDecoration: 'none',
    },
    lightbox: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000,
      padding: '20px',
    },
    lightboxImage: {
      maxWidth: '90%',
      maxHeight: '90%',
      objectFit: 'contain',
      borderRadius: '8px',
    },
    lightboxClose: {
      position: 'absolute',
      top: '20px',
      right: '20px',
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      backgroundColor: 'rgba(255,255,255,0.2)',
      color: '#fff',
      border: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      fontSize: '20px',
    },
  };

  // Reviews with photos/videos filter
  const hasMediaFilter = reviews.filter(r => r.media && r.media.length > 0);

  return (
    <div style={styles.container}>
      {/* Summary Section */}
      <div style={styles.summarySection}>
        <div style={styles.averageRating}>
          <div style={styles.averageNumber}>{parseFloat(summary.average_rating || 0).toFixed(1)}</div>
          <div style={styles.averageStars}>
            {[1, 2, 3, 4, 5].map((star) => (
              <FaStar
                key={star}
                size={18}
                color={star <= Math.floor(summary.average_rating || 0) ? '#f59e0b' : '#e5e7eb'}
              />
            ))}
          </div>
          <div style={styles.totalReviews}>{summary.total_reviews || 0} değerlendirme</div>
        </div>

        <div style={styles.ratingBars}>
          {[5, 4, 3, 2, 1].map((rating) => (
            <div
              key={rating}
              style={{
                ...styles.ratingBar,
                backgroundColor: ratingFilter === rating ? '#f0fdf4' : 'transparent',
              }}
              onClick={() => setRatingFilter(ratingFilter === rating ? null : rating)}
            >
              <div style={styles.ratingLabel}>
                <FaStar size={12} color="#f59e0b" />
                <span>{rating}</span>
              </div>
              <div style={styles.barContainer}>
                <div style={styles.barFill(ratingPercentages[rating])} />
              </div>
              <span style={styles.ratingCount}>
                {summary.rating_breakdown?.[rating] || 0}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Write Review Section */}
      <div style={styles.writeReviewSection}>
        {!user ? (
          <div style={styles.loginPrompt}>
            <p style={{ margin: 0, color: '#92400e', fontSize: '14px' }}>
              Değerlendirme yapmak için{' '}
              <Link to="/login" style={styles.loginLink}>giriş yapın</Link>
            </p>
          </div>
        ) : canReview ? (
          !showWriteReview ? (
            <button style={styles.writeReviewBtn} onClick={() => setShowWriteReview(true)}>
              <FaPen /> Değerlendirme Yaz
            </button>
          ) : (
            <div style={styles.writeReviewForm}>
              <div style={styles.formHeader}>
                <h3 style={styles.formTitle}>Ürünü Değerlendir</h3>
                <button style={styles.closeBtn} onClick={resetForm}>
                  <FaTimes />
                </button>
              </div>

              {/* Rating */}
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Puanınız *</label>
                <div style={styles.starRating}>
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
                        <FaStar size={28} color={isActive ? '#f59e0b' : '#e5e7eb'} />
                      </button>
                    );
                  })}
                  {(hoveredStar || formData.rating) > 0 && (
                    <span style={styles.ratingText}>
                      {getRatingLabel(hoveredStar || formData.rating)}
                    </span>
                  )}
                </div>
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
              </div>

              {/* Comment */}
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Yorumunuz *</label>
                <textarea
                  value={formData.comment}
                  onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
                  placeholder="Ürün hakkındaki deneyiminizi paylaşın..."
                  maxLength={1000}
                  style={styles.textarea}
                />
                <div style={styles.charCount}>{formData.comment.length}/1000</div>
              </div>

              {/* Media Upload */}
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>
                  <FaCamera style={{ marginRight: '6px' }} />
                  Fotoğraf / Video Ekle
                </label>
                <p style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '12px' }}>
                  En fazla 5 adet dosya ekleyebilirsiniz
                </p>
                <div style={styles.mediaUploadGrid}>
                  {mediaPreviews.map((preview, index) => (
                    <div key={index} style={styles.mediaPreviewItem}>
                      {preview.type === 'video' ? (
                        <video src={preview.url} style={styles.mediaPreviewImage} />
                      ) : (
                        <img src={preview.url} alt="" style={styles.mediaPreviewImage} />
                      )}
                      <button
                        type="button"
                        style={styles.mediaRemoveBtn}
                        onClick={() => removeMediaFile(index)}
                      >
                        <FaTimes />
                      </button>
                    </div>
                  ))}
                  {mediaPreviews.length < 5 && (
                    <div
                      style={styles.mediaUploadBox}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <FaCamera size={20} color="#9ca3af" />
                      <span style={{ fontSize: '11px', color: '#9ca3af', marginTop: '4px' }}>Ekle</span>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,video/*"
                    multiple
                    onChange={handleFileUpload}
                    style={{ display: 'none' }}
                  />
                </div>
              </div>

              {/* Anonymous */}
              <label style={styles.anonymousOption}>
                <input
                  type="checkbox"
                  checked={formData.is_anonymous}
                  onChange={(e) => setFormData(prev => ({ ...prev, is_anonymous: e.target.checked }))}
                  style={{ width: '18px', height: '18px', accentColor: '#059669' }}
                />
                <div>
                  <div style={{ fontSize: '14px', color: '#374151' }}>
                    <FaUserSecret style={{ marginRight: '6px' }} />
                    Anonim olarak değerlendir
                  </div>
                  <div style={{ fontSize: '12px', color: '#9ca3af' }}>
                    İsminiz diğer kullanıcılara gösterilmez
                  </div>
                </div>
              </label>

              {/* Actions */}
              <div style={styles.formActions}>
                <button style={styles.cancelBtn} onClick={resetForm}>
                  Vazgeç
                </button>
                <button
                  style={{
                    ...styles.submitBtn,
                    opacity: submitReviewMutation.isPending || formData.rating === 0 ? 0.6 : 1,
                    cursor: submitReviewMutation.isPending || formData.rating === 0 ? 'not-allowed' : 'pointer',
                  }}
                  onClick={handleSubmit}
                  disabled={submitReviewMutation.isPending || formData.rating === 0}
                >
                  {submitReviewMutation.isPending ? 'Gönderiliyor...' : (
                    <>
                      <FaPaperPlane /> Gönder
                    </>
                  )}
                </button>
              </div>
            </div>
          )
        ) : (
          <div style={{ ...styles.loginPrompt, backgroundColor: '#f1f5f9' }}>
            <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>
              Bu ürünü değerlendirmek için önce satın alıp teslim almanız gerekiyor.
            </p>
          </div>
        )}
      </div>

      {/* Toolbar */}
      {reviews.length > 0 && (
        <div style={styles.toolbarSection}>
          <div style={styles.filterBtns}>
            <button
              style={styles.filterBtn(ratingFilter === null)}
              onClick={() => setRatingFilter(null)}
            >
              Tümü ({summary.total_reviews})
            </button>
            <button
              style={styles.filterBtn(ratingFilter === 'media')}
              onClick={() => setRatingFilter(ratingFilter === 'media' ? null : 'media')}
            >
              <FaImage /> Fotoğraflı
            </button>
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={styles.sortSelect}
          >
            <option value="recent">En Yeni</option>
            <option value="helpful">En Faydalı</option>
            <option value="highest">En Yüksek Puan</option>
            <option value="lowest">En Düşük Puan</option>
          </select>
        </div>
      )}

      {/* Reviews List */}
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
          Değerlendirmeler yükleniyor...
        </div>
      ) : reviews.length === 0 ? (
        <div style={styles.emptyState}>
          <FaStar style={styles.emptyIcon} />
          <h3 style={styles.emptyTitle}>Henüz değerlendirme yapılmamış</h3>
          <p style={styles.emptyText}>İlk değerlendiren siz olun!</p>
        </div>
      ) : (
        <div style={styles.reviewsList}>
          {reviews
            .filter(review => ratingFilter === 'media' ? (review.media && review.media.length > 0) : true)
            .map((review) => (
            <div key={review.id} style={styles.reviewCard}>
              {/* Header */}
              <div style={styles.reviewHeader}>
                <div style={styles.reviewUser}>
                  <div style={styles.reviewAvatar}>
                    {review.user?.avatar ? (
                      <img 
                        src={review.user.avatar} 
                        alt="" 
                        style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} 
                      />
                    ) : (
                      <FaUserCircle />
                    )}
                  </div>
                  <div style={styles.reviewUserInfo}>
                    <div style={styles.reviewUserName}>
                      {review.is_anonymous ? 'Anonim Kullanıcı' : (review.user?.name || 'Kullanıcı')}
                      {review.is_verified_purchase && (
                        <span style={styles.verifiedBadge}>
                          <FaCheckCircle size={10} /> Doğrulanmış
                        </span>
                      )}
                    </div>
                    <div style={styles.reviewDate}>{formatDate(review.created_at)}</div>
                  </div>
                </div>
                <div style={styles.reviewStars}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar
                      key={star}
                      size={14}
                      color={star <= review.rating ? '#f59e0b' : '#e5e7eb'}
                    />
                  ))}
                  <span style={{ marginLeft: '6px', fontSize: '13px', fontWeight: '600', color: '#1e293b' }}>
                    {parseFloat(review.rating || 0).toFixed(1)}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div style={styles.reviewContent}>
                {review.title && (
                  <div style={styles.reviewTitle}>{review.title}</div>
                )}
                <p style={styles.reviewComment}>{review.comment}</p>
              </div>

              {/* Media */}
              {review.media && review.media.length > 0 && (
                <div style={styles.reviewMediaGrid}>
                  {review.media.map((media, index) => (
                    <div
                      key={index}
                      style={styles.reviewMediaItem}
                      onClick={() => setLightboxImage(media.url || media.path)}
                    >
                      {media.type === 'video' ? (
                        <>
                          <video src={media.url || media.path} style={styles.reviewMediaImage} />
                          <div style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            color: '#fff',
                            fontSize: '24px',
                          }}>
                            <FaPlay />
                          </div>
                        </>
                      ) : (
                        <img 
                          src={media.url || media.path} 
                          alt="" 
                          style={styles.reviewMediaImage}
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                      )}
                    </div>
                  ))}
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

              {/* Footer */}
              <div style={styles.reviewFooter}>
                <div style={styles.helpfulBtns}>
                  <button
                    style={styles.helpfulBtn}
                    onClick={() => user && helpfulMutation.mutate({ reviewId: review.id, isHelpful: true })}
                  >
                    <FaThumbsUp size={12} />
                    Faydalı ({review.helpful_count || 0})
                  </button>
                  <button
                    style={styles.helpfulBtn}
                    onClick={() => user && helpfulMutation.mutate({ reviewId: review.id, isHelpful: false })}
                  >
                    <FaThumbsDown size={12} />
                    ({review.unhelpful_count || 0})
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightboxImage && (
        <div style={styles.lightbox} onClick={() => setLightboxImage(null)}>
          <img src={lightboxImage} alt="" style={styles.lightboxImage} />
          <button style={styles.lightboxClose} onClick={() => setLightboxImage(null)}>
            <FaTimes />
          </button>
        </div>
      )}
    </div>
  );
};

export default ReviewsSection;
