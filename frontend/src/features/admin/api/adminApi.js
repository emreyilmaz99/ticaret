import axios from '../../../lib/axios';

export const getAdmins = async (params) => {
  const response = await axios.get('/v1/admin/admins', { params });
  return response.data;
};

export const getAdmin = async (id) => {
  const response = await axios.get(`/v1/admin/admins/${id}`);
  return response.data;
};

export const createAdmin = async (data) => {
  const response = await axios.post('/v1/admin/admins', data);
  return response.data;
};

export const updateAdmin = async (id, data) => {
  const response = await axios.put(`/v1/admin/admins/${id}`, data);
  return response.data;
};

export const deleteAdmin = async (id) => {
  const response = await axios.delete(`/v1/admin/admins/${id}`);
  return response.data;
};
