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
  // 1. Tarayıcı hafızasından token'ı al
  const token = localStorage.getItem('admin_token');
  
  // 2. Eğer token varsa, isteğin başlığına (Header) ekle
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;