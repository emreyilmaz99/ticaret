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
  } else if (url.includes('/v1/user') || url.includes('/v1/cart')) {
    // Cart için de user token kullan (giriş yapmış kullanıcının sepeti için)
    token = localStorage.getItem('user_token');
  } else {
    // Genel istekler için user token kullan
    token = localStorage.getItem('user_token'); 
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response interceptor to log errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error('[Axios] 401 Unauthenticated - Full error:', error.response?.data);
      console.error('[Axios] Request URL:', error.config?.url);
      console.error('[Axios] Request headers:', error.config?.headers);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
