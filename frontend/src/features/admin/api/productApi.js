import apiClient from '@lib/apiClient';

// Get all products with filters
export const getProducts = async (params = {}) => {
  const response = await apiClient.get('/v1/admin/products', { params });
  return response.data;
};

// Get product statistics
export const getProductStatistics = async () => {
  const response = await apiClient.get('/v1/admin/products/statistics');
  return response.data;
};

// Get single product
export const getProduct = async (id) => {
  const response = await apiClient.get(`/v1/admin/products/${id}`);
  return response.data;
};

// Update product status
export const updateProductStatus = async (id, status, rejectionReason = null) => {
  const data = { status };
  if (status === 'rejected' && rejectionReason) {
    data.rejection_reason = rejectionReason;
  }
  const response = await apiClient.put(`/v1/admin/products/${id}/status`, data);
  return response.data;
};

// Bulk update product status
export const bulkUpdateProductStatus = async (productIds, status, rejectionReason = null) => {
  const data = { 
    product_ids: productIds, 
    status 
  };
  if (status === 'rejected' && rejectionReason) {
    data.rejection_reason = rejectionReason;
  }
  const response = await apiClient.post('/v1/admin/products/bulk-status', data);
  return response.data;
};

// Delete product
export const deleteProduct = async (id) => {
  const response = await apiClient.delete(`/v1/admin/products/${id}`);
  return response.data;
};
