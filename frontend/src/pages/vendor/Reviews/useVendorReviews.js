// src/pages/vendor/Reviews/useVendorReviews.js

import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { vendorReviewService } from '../../../api/services/vendorReviewService';
import { toast } from 'react-hot-toast';

export const useVendorReviews = () => {
  const queryClient = useQueryClient();
  
  // Filters
  const [filters, setFilters] = useState({
    search: '',
    rating: '',
    hasResponse: '', // 'responded' | 'pending' | ''
    productId: '',
    sortBy: 'newest',
    page: 1,
    perPage: 10,
  });

  // Active reply
  const [activeReplyId, setActiveReplyId] = useState(null);
  const [replyText, setReplyText] = useState('');
  
  // Lightbox
  const [lightboxImage, setLightboxImage] = useState(null);

  // Build query params
  const buildQueryParams = useCallback(() => {
    const params = {
      page: filters.page,
      per_page: filters.perPage,
      sort_by: filters.sortBy,
    };
    
    if (filters.search) params.search = filters.search;
    if (filters.rating) params.rating = filters.rating;
    if (filters.hasResponse === 'responded') params.has_response = '1';
    if (filters.hasResponse === 'pending') params.has_response = '0';
    if (filters.productId) params.product_id = filters.productId;
    
    return params;
  }, [filters]);

  // Reviews Query
  const {
    data: reviewsData,
    isLoading: reviewsLoading,
    isFetching: reviewsFetching,
    error: reviewsError,
    refetch: refetchReviews,
  } = useQuery({
    queryKey: ['vendorReviews', buildQueryParams()],
    queryFn: async () => {
      const response = await vendorReviewService.getAllReviews(buildQueryParams());
      console.log('Vendor Reviews API Response:', response);
      console.log('Response data:', response.data);
      return response;
    },
    staleTime: 30000,
    keepPreviousData: true, // Keep previous data while fetching new data
  });

  // Stats Query
  const { data: statsData } = useQuery({
    queryKey: ['vendorReviewStats'],
    queryFn: () => vendorReviewService.getStats(),
    staleTime: 60000,
  });

  // Store Response Mutation
  const storeResponseMutation = useMutation({
    mutationFn: ({ reviewId, response_text }) => 
      vendorReviewService.storeResponse(reviewId, { response_text }),
    onSuccess: () => {
      toast.success('Yanıtınız başarıyla gönderildi');
      queryClient.invalidateQueries(['vendorReviews']);
      queryClient.invalidateQueries(['vendorReviewStats']);
      setActiveReplyId(null);
      setReplyText('');
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Yanıt gönderilirken hata oluştu');
    },
  });

  // Delete Response Mutation
  const deleteResponseMutation = useMutation({
    mutationFn: (responseId) => vendorReviewService.deleteResponse(responseId),
    onSuccess: () => {
      toast.success('Yanıt başarıyla silindi');
      queryClient.invalidateQueries(['vendorReviews']);
      queryClient.invalidateQueries(['vendorReviewStats']);
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Yanıt silinirken hata oluştu');
    },
  });

  // Handlers
  const handleFilterChange = useCallback((key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  }, []);

  const handlePageChange = useCallback((page) => {
    setFilters(prev => ({ ...prev, page }));
  }, []);

  const handleStartReply = useCallback((reviewId) => {
    setActiveReplyId(reviewId);
    setReplyText('');
  }, []);

  const handleCancelReply = useCallback(() => {
    setActiveReplyId(null);
    setReplyText('');
  }, []);

  const handleSubmitReply = useCallback((reviewId) => {
    if (!replyText.trim()) {
      toast.error('Lütfen bir yanıt yazın');
      return;
    }
    storeResponseMutation.mutate({ reviewId, response_text: replyText.trim() });
  }, [replyText, storeResponseMutation]);

  const handleDeleteResponse = useCallback((responseId) => {
    if (window.confirm('Bu yanıtı silmek istediğinizden emin misiniz?')) {
      deleteResponseMutation.mutate(responseId);
    }
  }, [deleteResponseMutation]);

  const handleOpenLightbox = useCallback((imageUrl) => {
    setLightboxImage(imageUrl);
  }, []);

  const handleCloseLightbox = useCallback(() => {
    setLightboxImage(null);
  }, []);

  // Computed values
  const reviews = Array.isArray(reviewsData?.data?.data) 
    ? reviewsData.data.data 
    : [];
  
  const pagination = {
    currentPage: reviewsData?.data?.current_page || 1,
    totalPages: reviewsData?.data?.last_page || 1,
    total: reviewsData?.data?.total || 0,
    perPage: reviewsData?.data?.per_page || 10,
  };

  const stats = statsData?.data || {
    total_reviews: 0,
    average_rating: 0,
    total_responses: 0,
    pending_responses: 0,
    with_media: 0,
    rating_breakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
  };

  // Only show initial loading, not on filter changes
  const isInitialLoading = reviewsLoading && !reviewsData;

  return {
    // Data
    reviews,
    pagination,
    stats,
    
    // States
    filters,
    activeReplyId,
    replyText,
    lightboxImage,
    
    // Loading
    reviewsLoading: isInitialLoading, // Only true on first load
    reviewsFetching, // True when background fetching
    reviewsError,
    isSubmitting: storeResponseMutation.isPending,
    isDeleting: deleteResponseMutation.isPending,
    
    // Setters
    setReplyText,
    
    // Handlers
    handleFilterChange,
    handlePageChange,
    handleStartReply,
    handleCancelReply,
    handleSubmitReply,
    handleDeleteResponse,
    handleOpenLightbox,
    handleCloseLightbox,
    refetchReviews,
  };
};
