import axios from '../lib/axios';

/**
 * Get public products with filters
 */
export const getProducts = async (params = {}) => {
  const response = await axios.get('/v1/products', { params });
  return response.data;
};

/**
 * Get featured products
 */
export const getFeaturedProducts = async (limit = 8) => {
  const response = await axios.get('/v1/products/featured', { params: { limit } });
  return response.data;
};

/**
 * Get single product by slug
 */
export const getProduct = async (slug) => {
  const response = await axios.get(`/v1/products/${slug}`);
  return response.data;
};

/**
 * Get all categories
 */
export const getCategories = async () => {
  const response = await axios.get('/v1/categories');
  return response.data;
};

/**
 * Get category tree (hierarchical)
 */
export const getCategoryTree = async () => {
  const response = await axios.get('/v1/categories/tree');
  return response.data;
};

/**
 * Get single category by slug
 */
export const getCategory = async (slug) => {
  const response = await axios.get(`/v1/categories/${slug}`);
  return response.data;
};
