// src/pages/admin/Reviews/useReviewsPage.js
import { useState, useCallback, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@lib/apiClient';
import { useToast } from '../../../components/common/Toast';

export const useReviewsPage = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [ratingFilter, setRatingFilter] = useState('');

  // Selection
  const [selectedReviews, setSelectedReviews] = useState([]);

  // Modals
  const [viewReview, setViewReview] = useState(null);
  const [rejectModal, setRejectModal] = useState({ isOpen: false, reviewId: null, isBulk: false });
  const [rejectionReason, setRejectionReason] = useState('');

  // Fetch reviews
  const { data: reviewsData, isLoading } = useQuery({
    queryKey: ['adminReviews', statusFilter, ratingFilter, searchTerm],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (statusFilter) params.append('status', statusFilter);
      if (ratingFilter) params.append('rating', ratingFilter);
      if (searchTerm) params.append('search', searchTerm);
      params.append('per_page', '100');

      const response = await apiClient.get(`/v1/admin/reviews?${params}`);
      return response.data;
    },
  });

  // Fetch stats
  const { data: statsData, isLoading: isLoadingStats } = useQuery({
    queryKey: ['adminReviewStats'],
    queryFn: async () => {
      const response = await apiClient.get('/v1/admin/reviews/stats');
      return response.data;
    },
  });

  const reviews = reviewsData?.data?.data || [];
  const stats = statsData?.data || { pending: 0, approved: 0, rejected: 0, total: 0 };

  // Approve mutation
  const approveMutation = useMutation({
    mutationFn: async (reviewId) => {
      const response = await apiClient.post(`/v1/admin/reviews/${reviewId}/approve`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['adminReviews']);
      queryClient.invalidateQueries(['adminReviewStats']);
      toast.success('Yorum başarıyla onaylandı');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Yorum onaylanamadı');
    },
  });

  // Reject mutation
  const rejectMutation = useMutation({
    mutationFn: async ({ reviewId, reason }) => {
      const response = await apiClient.post(`/v1/admin/reviews/${reviewId}/reject`, {
        rejection_reason: reason,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['adminReviews']);
      queryClient.invalidateQueries(['adminReviewStats']);
      toast.success('Yorum reddedildi');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Yorum reddedilemedi');
    },
  });

  // Bulk approve mutation
  const bulkApproveMutation = useMutation({
    mutationFn: async (reviewIds) => {
      const response = await apiClient.post('/v1/admin/reviews/bulk-approve', {
        review_ids: reviewIds,
      });
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(['adminReviews']);
      queryClient.invalidateQueries(['adminReviewStats']);
      setSelectedReviews([]);
      toast.success(`${variables.length} yorum başarıyla onaylandı`);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Yorumlar onaylanamadı');
    },
  });

  // Bulk reject mutation
  const bulkRejectMutation = useMutation({
    mutationFn: async ({ reviewIds, reason }) => {
      const response = await apiClient.post('/v1/admin/reviews/bulk-reject', {
        review_ids: reviewIds,
        rejection_reason: reason,
      });
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(['adminReviews']);
      queryClient.invalidateQueries(['adminReviewStats']);
      setSelectedReviews([]);
      toast.success(`${variables.reviewIds.length} yorum reddedildi`);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Yorumlar reddedilemedi');
    },
  });

  // Selection handlers
  const toggleSelectAll = useCallback(() => {
    if (selectedReviews.length === reviews.length) {
      setSelectedReviews([]);
    } else {
      setSelectedReviews(reviews.map((r) => r.id));
    }
  }, [reviews, selectedReviews]);

  const toggleSelect = useCallback((reviewId) => {
    setSelectedReviews((prev) =>
      prev.includes(reviewId)
        ? prev.filter((id) => id !== reviewId)
        : [...prev, reviewId]
    );
  }, []);

  // Action handlers
  const handleApprove = useCallback(async (reviewId) => {
    await approveMutation.mutateAsync(reviewId);
  }, [approveMutation]);

  const handleReject = useCallback(async (reviewId, reason) => {
    await rejectMutation.mutateAsync({ reviewId, reason });
  }, [rejectMutation]);

  const handleBulkApprove = useCallback(async () => {
    if (selectedReviews.length === 0) return;
    await bulkApproveMutation.mutateAsync(selectedReviews);
  }, [selectedReviews, bulkApproveMutation]);

  const handleBulkReject = useCallback(async (reason) => {
    if (selectedReviews.length === 0) return;
    await bulkRejectMutation.mutateAsync({ reviewIds: selectedReviews, reason });
  }, [selectedReviews, bulkRejectMutation]);

  const handleRejectSubmit = useCallback(async () => {
    if (!rejectionReason.trim()) {
      toast.warning('Lütfen ret nedeni girin');
      return;
    }

    if (rejectModal.isBulk) {
      await handleBulkReject(rejectionReason);
    } else {
      await handleReject(rejectModal.reviewId, rejectionReason);
    }

    setRejectModal({ isOpen: false, reviewId: null, isBulk: false });
    setRejectionReason('');
  }, [rejectModal, rejectionReason, handleReject, handleBulkReject, toast]);

  return {
    // Data
    reviews,
    stats,
    isLoading,
    isLoadingStats,

    // Filters
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    ratingFilter,
    setRatingFilter,

    // Selection
    selectedReviews,
    toggleSelectAll,
    toggleSelect,

    // Actions
    handleApprove,
    handleReject,
    handleBulkApprove,
    handleBulkReject,

    // Modals
    viewReview,
    setViewReview,
    rejectModal,
    setRejectModal,
    rejectionReason,
    setRejectionReason,
    handleRejectSubmit,

    // Mutations
    isApproving: approveMutation.isPending,
    isRejecting: rejectMutation.isPending || bulkRejectMutation.isPending,
  };
};
