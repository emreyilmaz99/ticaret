import axios from '../../../lib/axios';

export const vendorLogin = async (credentials) => {
  const response = await axios.post('/v1/vendor/login', credentials);
  return response.data;
};

export const vendorLogout = async () => {
  const response = await axios.post('/v1/vendor/logout');
  return response.data;
};

export const getVendorProfile = async () => {
  const response = await axios.get('/v1/vendor/me');
  return response.data;
};
