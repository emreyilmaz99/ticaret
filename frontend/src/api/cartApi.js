import apiClient from '@lib/apiClient';

// Session ID'yi localStorage'dan al veya oluştur
const getCartSessionId = () => {
  let sessionId = localStorage.getItem('cartSessionId');
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem('cartSessionId', sessionId);
  }
  return sessionId;
};

// Axios instance'ına session header ekle
// Token varsa Authorization header'ı axios interceptor'ı ekliyor
const cartAxios = () => {
  const sessionId = getCartSessionId();
  const headers = {
    'X-Cart-Session': sessionId,
  };
  
  // User token varsa ekle (authenticated user için sepet sync'i)
  const userToken = localStorage.getItem('user_token');
  if (userToken) {
    headers['Authorization'] = `Bearer ${userToken}`;
  }
  
  return { headers };
};

/**
 * Sepeti getir
 */
export const getCart = async () => {
  const config = cartAxios();
  const response = await apiClient.get('v1/cart', config);
  return response.data;
};

/**
 * Sepete ürün ekle
 */
export const addToCart = async (productId, variantId = null, quantity = 1) => {
  const payload = {
    product_id: String(productId), // Ensure string (UUID)
    quantity: parseInt(quantity),
  };
  
  // Only add variant_id if it's provided
  if (variantId !== null && variantId !== undefined) {
    payload.variant_id = parseInt(variantId);
  }
  
  console.log('Adding to cart with payload:', payload);
  
  const config = cartAxios();
  const response = await apiClient.post('v1/cart/items', payload, config);
  return response.data;
};

/**
 * Sepet öğesi miktarını güncelle
 */
export const updateCartItem = async (itemId, quantity) => {
  const response = await apiClient.put(`/v1/cart/items/${itemId}`, {
    quantity,
  }, cartAxios());
  return response.data;
};

/**
 * Sepetten ürün kaldır
 */
export const removeFromCart = async (itemId) => {
  const response = await apiClient.delete(`/v1/cart/items/${itemId}`, cartAxios());
  return response.data;
};

/**
 * Sepeti temizle
 */
export const clearCart = async () => {
  const response = await apiClient.delete('/v1/cart/clear', cartAxios());
  return response.data;
};

/**
 * Kupon uygula
 */
export const applyCoupon = async (code) => {
  const response = await apiClient.post('/v1/cart/coupon', { code }, cartAxios());
  return response.data;
};

/**
 * Kuponu kaldır
 */
export const removeCoupon = async () => {
  const response = await apiClient.delete('/v1/cart/coupon', cartAxios());
  return response.data;
};

/**
 * Misafir sepetini kullanıcıya aktar (giriş yaptıktan sonra çağrılır)
 */
export const mergeCart = async () => {
  const response = await apiClient.post('/v1/cart/merge', {}, cartAxios());
  // Başarılı merge sonrası session ID'yi temizle
  localStorage.removeItem('cartSessionId');
  return response.data;
};
