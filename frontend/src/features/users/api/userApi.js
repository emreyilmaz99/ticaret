import axios from '../../../lib/axios';

export const getUsers = async (page = 1) => {
  const response = await axios.get(`/admin/users?page=${page}`);
  return response.data;
};

export const getUser = async (id) => {
  const response = await axios.get(`/admin/users/${id}`);
  return response.data;
};

export const updateUser = async (id, data) => {
  const response = await axios.put(`/admin/users/${id}`, data);
  return response.data;
};

export const deleteUser = async (id) => {
  const response = await axios.delete(`/admin/users/${id}`);
  return response.data;
};
