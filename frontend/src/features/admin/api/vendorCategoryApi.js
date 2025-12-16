import apiClient from '@lib/apiClient';

/**
 * Get vendor's selected categories (read-only for admin)
 */
export const getVendorCategories = async (vendorId) => {
  const response = await apiClient.get(`/v1/admin/vendors/${vendorId}/categories`);
  return response.data;
};
