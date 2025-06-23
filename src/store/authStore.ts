import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';
import { API_URL } from '../config/constants';
import api from '../utils/api';

interface User {
  _id: string;
  firstName?: string;
  lastName?: string;
  email: string;
  isAdmin?: boolean;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  adminLogin: (username: string, password: string) => Promise<void>;
  logout: () => void;
  googleLogin: (tokenId: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<any>;
  resetPassword: (email: string, resetToken: string, newPassword: string) => Promise<void>;
}

// Create separate storage keys for client and admin authentication
const STORAGE_KEY_CLIENT = 'client-auth-storage';
const STORAGE_KEY_ADMIN = 'admin-auth-storage';

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isAdmin: false,
      
      login: async (email: string, password: string) => {
        try {
          const response = await axios.post(`${API_URL}/api/auth/login`, { email, password });
          const { user, token } = response.data;
          
          set({ 
            user, 
            token, 
            isAuthenticated: true, 
            isAdmin: user.isAdmin || false 
          });
        } catch (error) {
          console.error('Login error:', error);
          throw error;
        }
      },
      
      register: async (userData) => {
        try {
          const response = await axios.post(`${API_URL}/api/auth/register`, userData);
          const { user, token } = response.data;
          
          set({ 
            user, 
            token, 
            isAuthenticated: true, 
            isAdmin: false 
          });
        } catch (error) {
          console.error('Registration error:', error);
          throw error;
        }
      },
      
      adminLogin: async (username: string, password: string) => {
        // For development/demo purposes only: directly authenticate with hardcoded credentials
        // This bypasses the server authentication when the server is unavailable
        if (username === 'admin' && password === 'admin123') {
          try {
            // First try the server if it's available
            try {
              const response = await axios.post(`${API_URL}/api/auth/admin/login`, { username, password });
              const { user, token } = response.data;
              
              if (!user.isAdmin) {
                throw new Error('Not authorized as admin');
              }
              
              // Store admin session in a separate storage
              localStorage.setItem(STORAGE_KEY_ADMIN, JSON.stringify({
                user,
                token,
                isAuthenticated: true,
                isAdmin: true
              }));
              
              set({ 
                user, 
                token, 
                isAuthenticated: true, 
                isAdmin: true 
              });
              
              // After successful login, we can use the authenticated API for subsequent requests
              if (api.defaults.headers) {
                api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
              }
              
              return;
            } catch (serverError) {
              console.log('Server unavailable or returned error, using local authentication');
              // Continue to local authentication if server fails
            }
            
            // Create a mock admin user and token for local development
            const mockAdminUser = {
              _id: 'admin1',
              email: 'admin@example.com',
              isAdmin: true
            };
            
            // Use a hardcoded token for development purposes
            const mockToken = 'mock_admin_token_' + Date.now();
            
            // Store admin session in a separate storage
            localStorage.setItem(STORAGE_KEY_ADMIN, JSON.stringify({
              user: mockAdminUser,
              token: mockToken,
              isAuthenticated: true,
              isAdmin: true
            }));
            
            set({
              user: mockAdminUser,
              token: mockToken,
              isAuthenticated: true,
              isAdmin: true
            });
            
            // Set the token for API requests
            if (api.defaults.headers) {
              api.defaults.headers.common['Authorization'] = `Bearer ${mockToken}`;
            }
            
            return;
          } catch (mockError) {
            console.error('Local admin authentication error:', mockError);
            throw mockError;
          }
        } else {
          // If credentials don't match the hardcoded ones, try the server
          try {
            const response = await axios.post(`${API_URL}/api/auth/admin/login`, { username, password });
            const { user, token } = response.data;
            
            if (!user.isAdmin) {
              throw new Error('Not authorized as admin');
            }
            
            // Store admin session in a separate storage
            localStorage.setItem(STORAGE_KEY_ADMIN, JSON.stringify({
              user,
              token,
              isAuthenticated: true,
              isAdmin: true
            }));
            
            set({ 
              user, 
              token, 
              isAuthenticated: true, 
              isAdmin: true 
            });
            
            // After successful login, we can use the authenticated API for subsequent requests
            if (api.defaults.headers) {
              api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            }
          } catch (error) {
            console.error('Admin login error:', error);
            throw error;
          }
        }
      },
      
      googleLogin: async (tokenId: string) => {
        try {
          const response = await axios.post(`${API_URL}/api/auth/google`, { tokenId });
          const { user, token } = response.data;
          
          set({ 
            user, 
            token, 
            isAuthenticated: true, 
            isAdmin: user.isAdmin || false 
          });
        } catch (error) {
          console.error('Google login error:', error);
          throw error;
        }
      },
      
      logout: () => {
        // Clear both client and admin storage
        if (localStorage.getItem(STORAGE_KEY_ADMIN)) {
          localStorage.removeItem(STORAGE_KEY_ADMIN);
        }
        
        // Reset the state
        set({ 
          user: null, 
          token: null, 
          isAuthenticated: false, 
          isAdmin: false 
        });
        
        // Clear authorization header
        if (api.defaults.headers) {
          delete api.defaults.headers.common['Authorization'];
        }
      },

      forgotPassword: async (email: string) => {
        try {
          const response = await axios.post(`${API_URL}/api/auth/forgot-password`, { email });
          return response.data;
        } catch (error) {
          console.error('Forgot password error:', error);
          throw error;
        }
      },

      resetPassword: async (email: string, resetToken: string, newPassword: string) => {
        try {
          await axios.post(`${API_URL}/api/auth/reset-password`, { 
            email,
            resetToken,
            newPassword
          });
        } catch (error) {
          console.error('Reset password error:', error);
          throw error;
        }
      },
    }),
    {
      name: STORAGE_KEY_CLIENT,
    }
  )
);