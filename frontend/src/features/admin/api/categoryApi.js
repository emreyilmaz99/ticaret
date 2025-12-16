import apiClient from '@lib/apiClient';

// Get all categories
export const getCategories = async (params = {}) => {
  const response = await apiClient.get('/v1/admin/categories', { params });
  return response.data;
};

// Get category tree (hierarchical)
export const getCategoryTree = async () => {
  const response = await apiClient.get('/v1/admin/categories/tree');
  return response.data;
};

// Get category statistics
export const getCategoryStatistics = async () => {
  const response = await apiClient.get('/v1/admin/categories/statistics');
  return response.data;
};

// Get single category
export const getCategory = async (id) => {
  const response = await apiClient.get(`/v1/admin/categories/${id}`);
  return response.data;
};

// Create category
export const createCategory = async (data) => {
  const response = await apiClient.post('/v1/admin/categories', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Update category
export const updateCategory = async (id, data) => {
  // For FormData with PUT, we need to use POST with _method
  if (data instanceof FormData) {
    data.append('_method', 'PUT');
    const response = await apiClient.post(`/v1/admin/categories/${id}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
  const response = await apiClient.put(`/v1/admin/categories/${id}`, data);
  return response.data;
};

// Delete category
export const deleteCategory = async (id) => {
  const response = await apiClient.delete(`/v1/admin/categories/${id}`);
  return response.data;
};

// Bulk update category status
export const bulkUpdateCategoryStatus = async (ids, isActive) => {
  const response = await apiClient.post('/v1/admin/categories/bulk-status', {
    ids,
    is_active: isActive
  });
  return response.data;
};

// Update category order
export const updateCategoryOrder = async (categories) => {
  const response = await apiClient.post('/v1/admin/categories/update-order', { categories });
  return response.data;
};
