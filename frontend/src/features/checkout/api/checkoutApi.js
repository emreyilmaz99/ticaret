import apiClient from '@lib/apiClient';

/**
 * Checkout başlat - iyzico ödeme formu oluştur
 */
export const initializeCheckout = async (data) => {
  const response = await apiClient.post('/v1/user/checkout/initialize', data);
  return response.data;
};

/**
 * Sipariş durumunu kontrol et
 */
export const getCheckoutStatus = async (orderNumber) => {
  const response = await apiClient.get(`/v1/user/checkout/status/${orderNumber}`);
  return response.data;
};

/**
 * Kullanıcının siparişlerini getir
 */
export const getUserOrders = async (params = {}) => {
  const queryParams = new URLSearchParams();
  if (params.page) queryParams.append('page', params.page);
  if (params.per_page) queryParams.append('per_page', params.per_page);
  
  const response = await apiClient.get(`/v1/user/orders?${queryParams.toString()}`);
  return response.data;
};

/**
 * Sipariş detayını getir
 */
export const getOrder = async (orderNumber) => {
  const response = await apiClient.get(`/v1/user/orders/${orderNumber}`);
  return response.data;
};

/**
 * Siparişi iptal et
 */
export const cancelOrder = async (orderNumber) => {
  const response = await apiClient.post(`/v1/user/orders/${orderNumber}/cancel`);
  return response.data;
};
