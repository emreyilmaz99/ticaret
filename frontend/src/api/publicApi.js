import apiClient from '@lib/apiClient';

/**
 * Get public products with filters
 */
export const getProducts = async (params = {}) => {
  const response = await apiClient.get('/v1/products', { params });
  return response.data;
};

/**
 * Get featured products
 */
export const getFeaturedProducts = async (limit = 8) => {
  const response = await apiClient.get('/v1/products/featured', { params: { limit } });
  return response.data;
};

/**
 * Get main categories with product counts
 */
export const getMainCategories = async () => {
  const response = await apiClient.get('/v1/products/categories');
  return response.data;
};

/**
 * Get single product by slug
 */
export const getProduct = async (slug) => {
  const response = await apiClient.get(`/v1/products/${slug}`);
  return response.data;
};

/**
 * Get related products by slug
 */
export const getRelatedProducts = async (slug, limit = 4) => {
  const response = await apiClient.get(`/v1/products/${slug}/related`, { params: { limit } });
  return response.data;
};

/**
 * Get all categories (root level only)
 */
export const getCategories = async () => {
  const response = await apiClient.get('/v1/categories?root_only=1');
  return response.data;
};

/**
 * Get category tree (hierarchical)
 */
export const getCategoryTree = async () => {
  const response = await apiClient.get('/v1/categories/tree');
  return response.data;
};

/**
 * Get single category by slug
 */
export const getCategory = async (slug) => {
  const response = await apiClient.get(`/v1/categories/${slug}`);
  return response.data;
};
