import apiClient from '@lib/apiClient';

export const getAdmins = async (params) => {
  const response = await apiClient.get('/v1/admin/admins', { params });
  return response.data;
};

export const getAdmin = async (id) => {
  const response = await apiClient.get(`/v1/admin/admins/${id}`);
  return response.data;
};

export const createAdmin = async (data) => {
  const response = await apiClient.post('/v1/admin/admins', data);
  return response.data;
};

export const updateAdmin = async (id, data) => {
  const response = await apiClient.put(`/v1/admin/admins/${id}`, data);
  return response.data;
};

export const deleteAdmin = async (id) => {
  const response = await apiClient.delete(`/v1/admin/admins/${id}`);
  return response.data;
};
