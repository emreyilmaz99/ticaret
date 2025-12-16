// src/pages/user/UserReviews/useUserReviews.js
import { useState, useMemo, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@lib/apiClient';
import { toast } from 'react-hot-toast';

export const useUserReviews = () => {
  const queryClient = useQueryClient();

  // Tab State
  const [activeTab, setActiveTab] = useState('myReviews'); // 'myReviews' | 'pending'

  // Modal State
  const [reviewModal, setReviewModal] = useState({
    isOpen: false,
    orderItemId: null,
    orderId: null,
    product: null,
  });
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    reviewId: null,
  });

  // Form State
  const [formData, setFormData] = useState({
    rating: 0,
    title: '',
    comment: '',
    is_anonymous: false,
    photos: [],
  });
  const [hoveredStar, setHoveredStar] = useState(0);
  const [mediaFiles, setMediaFiles] = useState([]);
  const [mediaPreviews, setMediaPreviews] = useState([]);

  // Fetch user's reviews
  const { 
    data: reviewsData, 
    isLoading: isLoadingReviews 
  } = useQuery({
    queryKey: ['userReviews'],
    queryFn: async () => {
      const response = await apiClient.get('/v1/user/reviews');
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  // Fetch reviewable orders (pending reviews)
  const { 
    data: reviewableData, 
    isLoading: isLoadingReviewable 
  } = useQuery({
    queryKey: ['reviewableOrders'],
    queryFn: async () => {
      const response = await apiClient.get('/v1/user/reviewable-orders');
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  const reviews = reviewsData?.data?.data || [];
  const reviewableOrders = reviewableData?.data || [];

  // Calculate pending items count
  const pendingCount = useMemo(() => {
    return reviewableOrders.reduce((acc, order) => acc + order.reviewable_items.length, 0);
  }, [reviewableOrders]);

  // Stats
  const stats = useMemo(() => {
    const approvedReviews = reviews.filter(r => r.status === 'approved');
    const totalRating = approvedReviews.reduce((sum, r) => sum + r.rating, 0);
    const avgRating = approvedReviews.length > 0 ? (totalRating / approvedReviews.length).toFixed(1) : 0;

    return {
      total: reviews.length,
      approved: reviews.filter(r => r.status === 'approved').length,
      pending: reviews.filter(r => r.status === 'pending').length,
      avgRating,
    };
  }, [reviews]);

  // Create review mutation
  const createReviewMutation = useMutation({
    mutationFn: async ({ orderId, orderItemId, data, files }) => {
      const formData = new FormData();
      formData.append('rating', data.rating);
      formData.append('title', data.title);
      formData.append('comment', data.comment);
      formData.append('is_anonymous', data.is_anonymous ? '1' : '0');
      
      files.forEach((file, index) => {
        formData.append(`photos[${index}]`, file);
      });

      const response = await apiClient.post(
        `/v1/user/orders/${orderId}/items/${orderItemId}/review`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['userReviews']);
      queryClient.invalidateQueries(['reviewableOrders']);
      toast.success('Değerlendirmeniz başarıyla gönderildi!');
      closeReviewModal();
    },
    onError: (error) => {
      console.error('Review submission error:', error.response?.data);
      const errorMsg = error.response?.data?.message || 'Değerlendirme gönderilemedi';
      const errors = error.response?.data?.errors;
      if (errors) {
        Object.values(errors).flat().forEach(msg => toast.error(msg));
      } else {
        toast.error(errorMsg);
      }
    },
  });

  // Delete review mutation
  const deleteReviewMutation = useMutation({
    mutationFn: async (reviewId) => {
      const response = await apiClient.delete(`/v1/user/reviews/${reviewId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['userReviews']);
      toast.success('Değerlendirmeniz silindi');
      setDeleteModal({ isOpen: false, reviewId: null });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Silme işlemi başarısız');
    },
  });

  // Open review modal
  const openReviewModal = useCallback((orderId, orderItemId, product) => {
    setFormData({
      rating: 0,
      title: '',
      comment: '',
      is_anonymous: false,
    });
    setMediaFiles([]);
    setMediaPreviews([]);
    setHoveredStar(0);
    setReviewModal({
      isOpen: true,
      orderId,
      orderItemId,
      product,
    });
  }, []);

  // Close review modal
  const closeReviewModal = useCallback(() => {
    setReviewModal({
      isOpen: false,
      orderItemId: null,
      orderId: null,
      product: null,
    });
    setFormData({
      rating: 0,
      title: '',
      comment: '',
      is_anonymous: false,
    });
    setMediaFiles([]);
    setMediaPreviews([]);
  }, []);

  // Handle file upload
  const handleFileUpload = useCallback((e) => {
    const files = Array.from(e.target.files);
    
    // Limit to 5 files
    const remainingSlots = 5 - mediaFiles.length;
    const filesToAdd = files.slice(0, remainingSlots);

    if (files.length > remainingSlots) {
      toast.error(`En fazla 5 dosya yükleyebilirsiniz. ${remainingSlots} dosya eklendi.`);
    }

    // Validate file types and sizes
    const validFiles = filesToAdd.filter(file => {
      const isImage = file.type.startsWith('image/');
      const maxSize = 5 * 1024 * 1024; // 5MB for images
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      
      if (!isImage || !allowedTypes.includes(file.type)) {
        toast.error(`${file.name}: Sadece JPEG, JPG, PNG ve WebP formatında resim yüklenebilir`);
        return false;
      }
      if (file.size > maxSize) {
        toast.error(`${file.name}: Dosya boyutu en fazla 5MB olabilir`);
        return false;
      }
      return true;
    });

    // Create previews
    const newPreviews = validFiles.map(file => ({
      url: URL.createObjectURL(file),
      type: 'image',
      name: file.name,
    }));

    setMediaFiles(prev => [...prev, ...validFiles]);
    setMediaPreviews(prev => [...prev, ...newPreviews]);
  }, [mediaFiles.length]);

  // Remove media file
  const removeMediaFile = useCallback((index) => {
    URL.revokeObjectURL(mediaPreviews[index]?.url);
    setMediaFiles(prev => prev.filter((_, i) => i !== index));
    setMediaPreviews(prev => prev.filter((_, i) => i !== index));
  }, [mediaPreviews]);

  // Submit review
  const handleSubmitReview = useCallback(async () => {
    if (formData.rating === 0) {
      toast.error('Lütfen bir puan seçin');
      return;
    }
    if (formData.comment.length < 10) {
      toast.error('Yorum en az 10 karakter olmalıdır');
      return;
    }

    await createReviewMutation.mutateAsync({
      orderId: reviewModal.orderId,
      orderItemId: reviewModal.orderItemId,
      data: formData,
      files: mediaFiles,
    });
  }, [formData, mediaFiles, reviewModal, createReviewMutation]);

  // Get rating label
  const getRatingLabel = useCallback((rating) => {
    const labels = {
      1: 'Çok Kötü',
      2: 'Kötü',
      3: 'Orta',
      4: 'İyi',
      5: 'Çok İyi',
    };
    return labels[rating] || '';
  }, []);

  // Get status config
  const getStatusConfig = useCallback((status) => {
    const configs = {
      pending: { label: 'Onay Bekliyor', bg: '#fef3c7', color: '#f59e0b' },
      approved: { label: 'Onaylandı', bg: '#d1fae5', color: '#059669' },
      rejected: { label: 'Reddedildi', bg: '#fee2e2', color: '#ef4444' },
    };
    return configs[status] || configs.pending;
  }, []);

  return {
    // Tab
    activeTab,
    setActiveTab,

    // Data
    reviews,
    reviewableOrders,
    pendingCount,
    stats,
    isLoading: isLoadingReviews || isLoadingReviewable,

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
    mediaFiles,
    mediaPreviews,
    handleFileUpload,
    removeMediaFile,

    // Actions
    handleSubmitReview,
    deleteReviewMutation,

    // Helpers
    getRatingLabel,
    getStatusConfig,
    isSubmitting: createReviewMutation.isPending,
    isDeleting: deleteReviewMutation.isPending,
  };
};
