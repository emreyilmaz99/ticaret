import axios from '../../../lib/axios';

/**
 * Get vendor's selected categories (read-only for admin)
 */
export const getVendorCategories = async (vendorId) => {
  const response = await axios.get(`/v1/admin/vendors/${vendorId}/categories`);
  return response.data;
};
