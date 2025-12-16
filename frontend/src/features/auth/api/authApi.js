import apiClient from '@lib/apiClient';

export const loginAdmin = (credentials) => {
  return apiClient.post('/v1/admin/login', credentials);
};

export const getAdminProfile = () => {
  return apiClient.get('/v1/admin/me');
};
