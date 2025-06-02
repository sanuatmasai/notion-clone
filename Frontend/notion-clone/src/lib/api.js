import axios from 'axios';
import { toast } from 'react-hot-toast';
import { getAuthToken } from '../utils/auth';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true, // Important for sending cookies with cross-origin requests
  timeout: 10000, // 10 seconds timeout
});

// Request interceptor to add auth token to requests
api.interceptors.request.use(
  (config) => {
    console.log('Request interceptor - URL:', config.url);
    
    // Skip adding auth header for login/register requests
    const isAuthRequest = [
      '/auth/login', 
      '/auth/register', 
      '/auth/refresh-token',
      '/users/login',
      '/users/register'
    ].some(path => config.url.endsWith(path));
    
    console.log('Is auth request:', isAuthRequest);
    
    if (!isAuthRequest) {
      const token = localStorage.getItem('token');
      console.log('Token from storage:', token ? 'Token exists' : 'No token found');
      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log('Added Authorization header to request');
      } else {
        console.warn('No auth token found for protected route:', config.url);
        throw new Error('Authentication token not found');
      }
    }
    
    console.log('Request headers:', JSON.stringify(config.headers, null, 2));
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If the error is 401 and we haven't tried to refresh the token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Try to refresh the token
        const response = await axios.post(`${BASE_URL}/auth/refresh-token`, {}, {
          withCredentials: true,
        });
        
        const { token } = response.data;
        if (token) {
          // Update the token in storage and retry the original request
          localStorage.setItem('token', token);
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // If refresh token fails, log out the user
        console.error('Failed to refresh token:', refreshError);
        if (window.location.pathname !== '/login') {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }
    
    // Handle other errors
    if (error.response) {
      // Server responded with a status code outside 2xx
      const { status, data } = error.response;
      
      if (status === 403) {
        toast.error('You do not have permission to perform this action');
      } else if (status === 404) {
        toast.error('The requested resource was not found');
      } else if (status >= 500) {
        toast.error('A server error occurred. Please try again later.');
      } else if (data?.message) {
        toast.error(data.message);
      } else {
        toast.error('An unexpected error occurred');
      }
    } else if (error.request) {
      // Request was made but no response was received
      toast.error('No response from server. Please check your connection.');
    } else {
      // Something happened in setting up the request
      console.error('Request error:', error.message);
      toast.error('Error setting up the request');
    }
    
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors globally
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Handle token expiration (401) - try to refresh token
    if (error.response?.status === 401 && !originalRequest._retry && originalRequest.url !== '/auth/refresh-token') {
      originalRequest._retry = true;
      
      try {
        // Try to refresh the token
        const refreshResponse = await axios.post(`${BASE_URL}/auth/refresh-token`, {}, {
          withCredentials: true, // Important for httpOnly cookies
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          }
        });
        
        const { token } = refreshResponse.data;
        localStorage.setItem('token', token);
        
        // Update the Authorization header
        originalRequest.headers.Authorization = `Bearer ${token}`;
        
        // Retry the original request
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails, redirect to login
        localStorage.removeItem('token');
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }
    
    // Handle other errors
    if (error.response) {
      const { status, data } = error.response;
      const errorMessage = data?.message || 'An error occurred';
      
      // Show appropriate error messages based on status code
      switch (status) {
        case 400:
          toast.error(errorMessage || 'Invalid request');
          break;
        case 401:
          // Only show message if not already redirecting
          if (window.location.pathname !== '/login') {
            toast.error('Your session has expired. Please log in again.');
          }
          break;
        case 403:
          toast.error(errorMessage || 'You do not have permission to perform this action');
          break;
        case 404:
          toast.error(errorMessage || 'Resource not found');
          break;
        case 422:
          // Handle validation errors
          if (data?.errors) {
            Object.values(data.errors).forEach(err => toast.error(err));
          } else {
            toast.error(errorMessage || 'Validation failed');
          }
          break;
        case 429:
          toast.error('Too many requests. Please try again later.');
          break;
        case 500:
          toast.error('Server error. Please try again later.');
          console.error('Server Error:', data);
          break;
        default:
          toast.error(errorMessage || 'An unexpected error occurred');
      }
    } else if (error.request) {
      // The request was made but no response was received
      toast.error('No response from server. Please check your connection.');
      console.error('Request Error:', error.request);
    } else {
      // Something happened in setting up the request
      console.error('Error:', error.message);
      toast.error('An error occurred while setting up the request');
    }
    
    return Promise.reject(error);
  }
);

// Helper function to handle file uploads
export const uploadFile = async (file, onUploadProgress) => {
  const formData = new FormData();
  formData.append('file', file);
  
  return api.post('/files/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress,
  });
};

// Helper function to handle paginated responses
export const getPaginatedData = async (endpoint, params = {}) => {
  const response = await api.get(endpoint, { params });
  return {
    data: response.data.data || [],
    meta: response.data.meta || {},
  };
};

export default api;
