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
      // '/auth/refresh-token',
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


// Response interceptor to handle errors globally
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    
    // Handle other errors
    if (error.response) {
      const { status, data } = error.response;
      const errorMessage = data?.message || 'An error occurred';
      toast.error(errorMessage);
      
      // Show appropriate error messages based on status code
    //   switch (status) {
    //     case 400:
    //       toast.error(errorMessage || 'Invalid request');
    //       break;
    //     case 401:
    //       // Only show message if not already redirecting
    //       if (window.location.pathname !== '/login') {
    //         toast.error('Your session has expired. Please log in again.');
    //       }
    //       break;
    //     case 403:
    //       toast.error(errorMessage || 'You do not have permission to perform this action');
    //       break;
    //     case 404:
    //       toast.error(errorMessage || 'Resource not found');
    //       break;
    //     case 422:
    //       // Handle validation errors
    //       if (data?.errors) {
    //         Object.values(data.errors).forEach(err => toast.error(err));
    //       } else {
    //         toast.error(errorMessage || 'Validation failed');
    //       }
    //       break;
    //     case 429:
    //       toast.error('Too many requests. Please try again later.');
    //       break;
    //     case 500:
    //       toast.error('Something went wrong..');
    //       console.error('Server Error:', data);
    //       break;
    //     default:
    //       toast.error(errorMessage || 'An unexpected error occurred');
    //   }
    // } 
    
    return Promise.reject(error);
  }
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
