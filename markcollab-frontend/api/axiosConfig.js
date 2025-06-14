// src/api/axiosConfig.js
import axios from 'axios';

// ATENÇÃO: Troque pela URL da sua API de produção antes do deploy.
const API_URL = 'https://fastapi-markcollabia.onrender.com/api';

const apiClient = axios.create({
  baseURL: API_URL,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;