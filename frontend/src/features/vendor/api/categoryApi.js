import apiClient from '@lib/apiClient';

// Get all public categories (admin managed)
export const getVendorCategories = async () => {
  const res = await apiClient.get('/v1/categories');
  return res.data;
};

// Get category tree (hierarchical) - public
export const getVendorCategoryTree = async () => {
  const res = await apiClient.get('/v1/categories/tree');
  return res.data;
};

// Get vendor's selected categories
export const getMySelectedCategories = async () => {
  const res = await apiClient.get('/v1/vendor/my-categories');
  return res.data;
};

// Get vendor's categories for product creation (selected + all children)
export const getMyCategoriesForProducts = async () => {
  const res = await apiClient.get('/v1/vendor/my-categories/for-products');
  return res.data;
};

// Update vendor's selected categories
export const updateMyCategories = async (categoryIds) => {
  const res = await apiClient.put('/v1/vendor/my-categories', {
    category_ids: categoryIds
  });
  return res.data;
};

// Backward compatibility alias
export const getMyAllowedCategories = getMySelectedCategories;
