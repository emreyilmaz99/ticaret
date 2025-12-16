import apiClient from '../lib/apiClient';

/**
 * Ürün arama servisi
 */
export const searchProducts = async (query) => {
  try {
    const response = await apiClient.get('/v1/search', {
      params: { q: query }
    });
    return response.data;
  } catch (error) {
    console.error('Arama hatası:', error);
    throw error;
  }
};

export default {
  searchProducts
};
