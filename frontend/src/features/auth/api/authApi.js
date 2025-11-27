import axios from '../../../lib/axios';

export const loginAdmin = (credentials) => {
  return axios.post('/v1/admin/login', credentials);
};

export const getAdminProfile = () => {
  return axios.get('/v1/admin/me');
};
