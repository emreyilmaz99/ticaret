import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:8000/api'; 

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// ÖNEMLİ: Her istekten önce çalışacak kod (Request Interceptor)
api.interceptors.request.use((config) => {
  // URL'e göre doğru token'ı seç
  let token = null;
  
  if (config.url?.includes('/vendor')) {
    // Vendor endpoint'leri için vendor_token kullan
    token = localStorage.getItem('vendor_token');
  } else if (config.url?.includes('/admin')) {
    // Admin endpoint'leri için admin_token kullan
    token = localStorage.getItem('admin_token');
  } else {
    // Diğer endpoint'ler için önce user_token, yoksa admin_token dene
    token = localStorage.getItem('user_token') || localStorage.getItem('admin_token');
  }
  
  // Eğer token varsa, isteğin başlığına (Header) ekle
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;