import axios from '../../../lib/axios';

export const getUnits = async () => {
  const res = await axios.get('/v1/units');
  return res.data;
};
