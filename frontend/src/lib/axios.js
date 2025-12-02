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
    console.log('[Axios] Vendor request to:', url);
    console.log('[Axios] Token from localStorage:', token ? token.substring(0, 20) + '...' : 'NULL');
    console.log('[Axios] All localStorage keys:', Object.keys(localStorage));
  } else if (url.includes('/v1/admin')) {
    token = localStorage.getItem('admin_token');
  } else {
    // Müşteri veya genel istekler için
    token = localStorage.getItem('token'); 
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('[Axios] Authorization header set');
  } else {
    console.warn('[Axios] No token found for request!');
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
