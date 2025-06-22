// src/services/apiClient.ts
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'navo-api.onrender.com/api/v1/', // The base URL for all API calls
  headers: {
    'Content-Type': 'application/json',
  },
});

// This will automatically add the login token to every request in the future
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;