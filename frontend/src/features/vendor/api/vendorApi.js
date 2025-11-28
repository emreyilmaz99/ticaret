import axios from '../../../lib/axios';

// Tüm satıcıları getir
export const getVendors = (params) => {
  return axios.get('/v1/admin/vendors', { params });
};

// Tek bir satıcı detayını getir
export const getVendorDetail = (id) => {
  return axios.get(`/v1/admin/vendors/${id}`);
};

// Satıcıyı onayla veya reddet (Status update)
export const updateVendorStatus = (id, status) => {
  return axios.put(`/v1/admin/vendors/${id}/status`, { status });
};

// Satıcı bilgilerini güncelle
export const updateVendor = (id, data) => {
  return axios.put(`/v1/admin/vendors/${id}`, data);
};

// Satıcı sil (Soft delete)
export const deleteVendor = (id) => {
  return axios.delete(`/v1/admin/vendors/${id}`);
};
