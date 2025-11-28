import axios from '../../../lib/axios';

// Vendor: listele
export const getVendorProducts = async (params = {}) => {
  const res = await axios.get('/v1/vendor/products', { params });
  return res.data;
};

// Vendor: oluştur
export const createVendorProduct = async (payload) => {
  // payload may contain files -> FormData
  let body = payload;
  let config = {};
  if (payload instanceof FormData) {
    body = payload;
    config.headers = { 'Content-Type': 'multipart/form-data' };
  }
  const res = await axios.post('/v1/vendor/products', body, config);
  return res.data;
};

// Vendor: güncelle
export const updateVendorProduct = async (id, payload) => {
  let body = payload;
  let config = {};
  if (payload instanceof FormData) {
    body = payload;
    config.headers = { 'Content-Type': 'multipart/form-data' };
  }
  const res = await axios.put(`/v1/vendor/products/${id}`, body, config);
  return res.data;
};

// Vendor: sil
export const deleteVendorProduct = async (id) => {
  const res = await axios.delete(`/v1/vendor/products/${id}`);
  return res.data;
};
