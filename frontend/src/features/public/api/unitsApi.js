import apiClient from '@lib/apiClient';

export const getUnits = async () => {
  const res = await apiClient.get('/v1/units');
  return res.data;
};
