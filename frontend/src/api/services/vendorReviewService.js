// src/api/services/vendorReviewService.js

import apiClient from '@lib/apiClient';

export const vendorReviewService = {
  // Get all reviews with filters
  getAllReviews: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await apiClient.get(`/v1/vendor/reviews?${queryString}`);
    return response.data;
  },

  // Get reviews for a specific product
  getProductReviews: async (productId, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await apiClient.get(`/v1/vendor/products/${productId}/reviews?${queryString}`);
    return response.data;
  },

  // Get review stats
  getStats: async () => {
    const response = await apiClient.get('/v1/vendor/review-stats');
    return response.data;
  },

  // Store a response to a review
  storeResponse: async (reviewId, data) => {
    const response = await apiClient.post(`/v1/vendor/reviews/${reviewId}/response`, data);
    return response;
  },

  // Delete a response
  deleteResponse: async (responseId) => {
    const response = await apiClient.delete(`/v1/vendor/review-responses/${responseId}`);
    return response;
  },
};

export default vendorReviewService;
