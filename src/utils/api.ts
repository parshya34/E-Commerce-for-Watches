import axios from 'axios';
import { API_URL } from '../config/constants';

// Create an axios instance with default config
const api = axios.create({
  baseURL: API_URL,
});

// Constants for storage keys
const STORAGE_KEY_CLIENT = 'client-auth-storage';
const STORAGE_KEY_ADMIN = 'admin-auth-storage';

// Add a request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    // First check if we have a client auth token
    const clientAuthStorage = localStorage.getItem(STORAGE_KEY_CLIENT);
    if (clientAuthStorage) {
      try {
        const { state } = JSON.parse(clientAuthStorage);
        if (state.token) {
          // Add token to Authorization header
          config.headers.Authorization = `Bearer ${state.token}`;
          return config;
        }
      } catch (error) {
        console.error('Error parsing client auth storage:', error);
      }
    }
    
    // If no client token, check for admin token
    const adminAuthStorage = localStorage.getItem(STORAGE_KEY_ADMIN);
    if (adminAuthStorage) {
      try {
        const adminAuth = JSON.parse(adminAuthStorage);
        if (adminAuth.token) {
          // Add admin token to Authorization header
          config.headers.Authorization = `Bearer ${adminAuth.token}`;
          return config;
        }
      } catch (error) {
        console.error('Error parsing admin auth storage:', error);
      }
    }
    
    // Fallback to the old storage key for backward compatibility
    const oldAuthStorage = localStorage.getItem('auth-storage');
    if (oldAuthStorage) {
      try {
        const { state } = JSON.parse(oldAuthStorage);
        if (state.token) {
          // Add token to Authorization header
          config.headers.Authorization = `Bearer ${state.token}`;
        }
      } catch (error) {
        console.error('Error parsing old auth storage:', error);
      }
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
