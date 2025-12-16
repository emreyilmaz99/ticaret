import apiClient from '@lib/apiClient';

// Tüm satıcıları getir
export const getVendors = (params) => {
  return apiClient.get('/v1/admin/vendors', { params });
};

// Tek bir satıcı detayını getir
export const getVendorDetail = (id) => {
  return apiClient.get(`/v1/admin/vendors/${id}`);
};

// Satıcıyı onayla veya reddet (Status update)
export const updateVendorStatus = (id, status, extraData = {}) => {
  return apiClient.put(`/v1/admin/vendors/${id}/status`, { status, ...extraData });
};

// Satıcı bilgilerini güncelle
export const updateVendor = (id, data) => {
  return apiClient.put(`/v1/admin/vendors/${id}`, data);
};

// Satıcı sil (Soft delete)
export const deleteVendor = (id) => {
  return apiClient.delete(`/v1/admin/vendors/${id}`);
};
