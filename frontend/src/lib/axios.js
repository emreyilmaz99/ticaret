import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:8000/api'; 

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

axiosInstance.interceptors.request.use((config) => {
  const url = config.url || '';
  let token = null;

  // URL'ye göre doğru token'ı seç
  if (url.includes('/v1/vendor')) {
    token = localStorage.getItem('vendor_token');
  } else if (url.includes('/v1/admin')) {
    token = localStorage.getItem('admin_token');
  } else {
    // Müşteri veya genel istekler için
    token = localStorage.getItem('token'); 
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default axiosInstance;
