import axios from 'axios';

// Environment variable veya default URL
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';

/**
 * Merkezi API Client
 * Tüm API istekleri için tek axios instance
 */
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

/**
 * Request Interceptor
 * URL'ye göre otomatik token ekleme
 */
apiClient.interceptors.request.use(
  (config) => {
    const url = config.url || '';
    let token = null;

    // URL pattern'e göre token seç
    if (url.includes('/v1/admin') || url.includes('/admin')) {
      token = localStorage.getItem('admin_token');
    } else if (url.includes('/v1/vendor') || url.includes('/vendor')) {
      token = localStorage.getItem('vendor_token');
    } else if (url.includes('/v1/user') || url.includes('/user') || url.includes('/cart') || url.includes('/favorites')) {
      token = localStorage.getItem('user_token');
    } else {
      // Genel istekler için user token dene, yoksa admin token
      token = localStorage.getItem('user_token') || localStorage.getItem('admin_token');
    }

    // Token varsa Authorization header'ına ekle
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * Global error handling
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // 401 Unauthorized - Token geçersiz veya eksik
    if (error.response?.status === 401) {
      console.error('[API Client] 401 Unauthorized:', {
        url: error.config?.url,
        data: error.response?.data,
        headers: error.config?.headers,
      });
      
      // İsteğe bağlı: Otomatik logout veya refresh token
      // window.location.href = '/login';
    }

    // 403 Forbidden - Yetki yok
    if (error.response?.status === 403) {
      console.error('[API Client] 403 Forbidden:', error.response?.data);
    }

    // 500 Server Error
    if (error.response?.status >= 500) {
      console.error('[API Client] Server Error:', error.response?.data);
    }

    return Promise.reject(error);
  }
);

export default apiClient;
