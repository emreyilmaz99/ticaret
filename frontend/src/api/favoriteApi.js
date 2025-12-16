import apiClient from '@lib/apiClient';

/**
 * Kullanıcının favorilerini getir
 */
export const getFavorites = async (page = 1) => {
  const response = await apiClient.get('/v1/user/favorites', {
    params: { page },
  });
  return response.data;
};

/**
 * Ürünü favorilere ekle
 */
export const addToFavorites = async (productId) => {
  const response = await apiClient.post('/v1/user/favorites', {
    product_id: productId,
  });
  return response.data;
};

/**
 * Ürünü favorilerden kaldır
 */
export const removeFromFavorites = async (productId) => {
  const response = await apiClient.delete(`/v1/user/favorites/${productId}`);
  return response.data;
};

/**
 * Favori durumunu toggle et (ekle/kaldır)
 */
export const toggleFavorite = async (productId) => {
  const response = await apiClient.post('/v1/user/favorites/toggle', {
    product_id: productId,
  });
  return response.data;
};

/**
 * Belirli ürünlerin favori durumlarını kontrol et
 */
export const checkFavorites = async (productIds) => {
  const response = await apiClient.post('/v1/user/favorites/check', {
    product_ids: productIds,
  });
  return response.data;
};

/**
 * Tüm favorileri temizle
 */
export const clearFavorites = async () => {
  const response = await apiClient.delete('/v1/user/favorites/clear');
  return response.data;
};

/**
 * Favori sayısını getir
 */
export const getFavoriteCount = async () => {
  const response = await apiClient.get('/v1/user/favorites/count');
  return response.data;
};
