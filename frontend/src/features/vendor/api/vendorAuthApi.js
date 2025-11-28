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

export const vendorRegister = async (payload) => {
  // payload should be form data or JSON depending on files; here it's JSON for basic fields
  const response = await axios.post('/v1/vendor/register', payload);
  return response.data;
};

// Update vendor profile. If `data` contains File objects (logo/cover), send as FormData.
export const updateVendorProfile = async (data) => {
  let config = {};
  let body = data;

  // detect files
  if (data instanceof FormData) {
    body = data;
    config.headers = { 'Content-Type': 'multipart/form-data' };
  } else if (data.logo || data.cover) {
    const fd = new FormData();
    Object.keys(data).forEach(key => {
      const val = data[key];
      if (val !== undefined && val !== null) {
        fd.append(key, val);
      }
    });
    body = fd;
    config.headers = { 'Content-Type': 'multipart/form-data' };
  }

  const response = await axios.put('/v1/vendor/profile', body, config);
  return response.data;
};

export const createVendorAddress = async (payload) => {
  const response = await axios.post('/v1/vendor/addresses', payload);
  return response.data;
};

export const createVendorBankAccount = async (payload) => {
  const response = await axios.post('/v1/vendor/bank-accounts', payload);
  return response.data;
};
