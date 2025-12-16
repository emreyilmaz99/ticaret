import apiClient from '@lib/apiClient';

export const getUsers = async (params = {}) => {
  const queryParams = new URLSearchParams();
  
  if (params.page) queryParams.append('page', params.page);
  if (params.per_page) queryParams.append('per_page', params.per_page);
  if (params.search) queryParams.append('search', params.search);
  if (params.is_active !== undefined && params.is_active !== null) {
    queryParams.append('is_active', params.is_active);
  }
  if (params.gender) queryParams.append('gender', params.gender);
  if (params.email_verified !== undefined && params.email_verified !== null) {
    queryParams.append('email_verified', params.email_verified);
  }
  if (params.sort_by) queryParams.append('sort_by', params.sort_by);
  if (params.sort_order) queryParams.append('sort_order', params.sort_order);

  const response = await apiClient.get(`/v1/admin/users?${queryParams.toString()}`);
  return response.data;
};

export const getUser = async (id) => {
  const response = await apiClient.get(`/v1/admin/users/${id}`);
  return response.data;
};

export const updateUser = async (id, data) => {
  const response = await apiClient.put(`/v1/admin/users/${id}`, data);
  return response.data;
};

export const toggleUserStatus = async (id) => {
  const response = await apiClient.put(`/v1/admin/users/${id}/toggle-status`);
  return response.data;
};

export const deleteUser = async (id) => {
  const response = await apiClient.delete(`/v1/admin/users/${id}`);
  return response.data;
};
