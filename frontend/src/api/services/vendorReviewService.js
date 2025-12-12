// src/api/services/vendorReviewService.js

import axios from '../../lib/axios';

export const vendorReviewService = {
  // Get all reviews with filters
  getAllReviews: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await axios.get(`/v1/vendor/reviews?${queryString}`);
    return response;
  },

  // Get reviews for a specific product
  getProductReviews: async (productId, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await axios.get(`/v1/vendor/products/${productId}/reviews?${queryString}`);
    return response;
  },

  // Get review stats
  getStats: async () => {
    const response = await axios.get('/v1/vendor/review-stats');
    return response;
  },

  // Store a response to a review
  storeResponse: async (reviewId, data) => {
    const response = await axios.post(`/v1/vendor/reviews/${reviewId}/response`, data);
    return response;
  },

  // Delete a response
  deleteResponse: async (responseId) => {
    const response = await axios.delete(`/v1/vendor/review-responses/${responseId}`);
    return response;
  },
};

export default vendorReviewService;
