import apiClient from '@lib/apiClient';

/**
 * Register a new user
 */
export const registerUser = async (data) => {
  const response = await apiClient.post('/v1/user/register', data);
  return response.data;
};

/**
 * Login user
 */
export const loginUser = async (email, password) => {
  const response = await apiClient.post('/v1/user/login', { email, password });
  return response.data;
};

/**
 * Logout user
 */
export const logoutUser = async () => {
  const response = await apiClient.post('/v1/user/logout');
  return response.data;
};

/**
 * Get current user info
 */
export const getUserMe = async () => {
  const response = await apiClient.get('/v1/user/me');
  return response.data;
};

/**
 * Get user profile
 */
export const getUserProfile = async () => {
  const response = await apiClient.get('/v1/user/profile');
  return response.data;
};

/**
 * Update user profile
 */
export const updateUserProfile = async (data) => {
  const response = await apiClient.put('/v1/user/profile', data);
  return response.data;
};

/**
 * Update user password
 */
export const updateUserPassword = async (data) => {
  const response = await apiClient.put('/v1/user/password', data);
  return response.data;
};

/**
 * Upload user avatar
 */
export const uploadUserAvatar = async (file) => {
  const formData = new FormData();
  formData.append('avatar', file);
  const response = await apiClient.post('/v1/user/avatar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

/**
 * Delete user avatar
 */
export const deleteUserAvatar = async () => {
  const response = await apiClient.delete('/v1/user/avatar');
  return response.data;
};
