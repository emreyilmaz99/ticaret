import axios from '../../../lib/axios';

export const getVendorCategories = async () => {
  const res = await axios.get('/v1/vendor/categories');
  return res.data;
};

export const createVendorCategory = async (payload) => {
  const res = await axios.post('/v1/vendor/categories', payload);
  return res.data;
};

export const deleteVendorCategory = async (id) => {
  const res = await axios.delete(`/v1/vendor/categories/${id}`);
  return res.data;
};
