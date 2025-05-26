import axios from 'axios';

//const API_URL = 'http://localhost:8000/v1/';
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.8:8000/v1/';//THAY IP CUA Máy ở đây!!!


// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',

  },
});

// Add request interceptor to normalize URLs
api.interceptors.request.use(
  (config) => {
    // Remove trailing slash to avoid redirect
    if (config.url?.endsWith('/')) {
      config.url = config.url.slice(0, -1);
    }
    return config;
  },
  (error) => Promise.reject(error)
);


// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle common errors (401, 403, etc.)
    if (error.response?.status === 401) {
      // Handle unauthorized (redirect to login)
    }
    return Promise.reject(error);
  }
);

export default api; 