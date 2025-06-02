import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../lib/api';
import { setAuthToken, removeAuthToken, getAuthToken } from '../utils/auth';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Sign up a new user
  const register = async (email, password, name) => {
    try {
      const response = await api.post('/auth/register', { 
        email, 
        password,
        firstName: name.split(' ')[0],
        lastName: name.split(' ').slice(1).join(' ') || ''
      });
      
      // Auto-login after registration if needed
      const loginResponse = await api.post('/auth/login', { email, password });
      const { token, user } = loginResponse.data;
      
      // Store token and user data
      setAuthToken(token);
      setCurrentUser(user);
      
      // Set default authorization header
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      toast.success('Account created successfully! Please check your email to verify your account.');
      return user;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  // Sign in an existing user
  const login = async (email, password) => {
    try {
      const response = await api.post('/users/login', { 
        email, 
        password 
      });
      
      // The response should contain a message and data with token and userDto
      const { message, data } = response.data;
      const { token, userDto: user } = data;
      
      if (!token || !user) {
        throw new Error('Invalid response from server');
      }
      
      // Store token and user data
      setAuthToken(token);
      setCurrentUser(user);
      
      // Set default authorization header
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      toast.success(message || 'Signed in successfully!');
      return user;
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.message || 'Login failed. Please check your credentials.';
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Sign out the current user
  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear user data and token
      removeAuthToken();
      delete api.defaults.headers.common['Authorization'];
      setCurrentUser(null);
      toast.success('Signed out successfully!');
      navigate('/login');
    }
  };

  // Send password reset email
  const resetPassword = async (email) => {
    try {
      await api.post('/auth/forgot-password', { email });
      toast.success('Password reset link sent to your email');
      return true;
    } catch (error) {
      console.error('Password reset error:', error);
      toast.error(error.response?.data?.message || 'Failed to send reset email');
      throw error;
    }
  };

  // Confirm password reset with token
  const confirmPasswordReset = async (token, newPassword) => {
    try {
      await api.post('/auth/reset-password', { token, newPassword });
      toast.success('Password has been reset successfully');
      return true;
    } catch (error) {
      console.error('Password reset confirmation error:', error);
      toast.error(error.response?.data?.message || 'Failed to reset password');
      throw error;
    }
  };

  // Verify email with token
  const verifyEmail = async (token) => {
    try {
      await api.post('/auth/verify-email', { token });
      toast.success('Email verified successfully');
      return true;
    } catch (error) {
      console.error('Email verification error:', error);
      toast.error(error.response?.data?.message || 'Failed to verify email');
      throw error;
    }
  };

  // Check if user is authenticated
  const checkAuth = useCallback(async () => {
    try {
      const response = await api.get('/users/profile');
      setCurrentUser(response.data);
      return true;
    } catch (error) {
      setCurrentUser(null);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Check if user is logged in on initial load
  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      // Set the authorization header for all requests
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Fetch current user data
      const fetchCurrentUser = async () => {
        try {
          const response = await api.get('/users/profile');
          setCurrentUser(response.data);
        } catch (error) {
          console.error('Failed to fetch user data:', error);
          // If token is invalid, clear it
          removeAuthToken();
          delete api.defaults.headers.common['Authorization'];
        } finally {
          setLoading(false);
        }
      };
      
      fetchCurrentUser();
    } else {
      setLoading(false);
    }
  }, []);

  // Add refresh token logic
  useEffect(() => {
    const refreshToken = async () => {
      try {
        const response = await api.post('/auth/refresh-token');
        const { token } = response.data;
        setAuthToken(token);
      } catch (error) {
        console.error('Failed to refresh token:', error);
        logout();
      }
    };
    
    // Set up token refresh interval (e.g., every 15 minutes)
    const interval = setInterval(refreshToken, 15 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [logout]);

  // Update user data in context
  const updateUser = (userData) => {
    setCurrentUser(prev => ({
      ...prev,
      ...userData
    }));
  };

  const value = {
    currentUser,
    loading,
    register,
    login,
    logout,
    resetPassword,
    confirmPasswordReset,
    verifyEmail,
    updateUser,
    isAuthenticated: !!currentUser,
    checkAuth
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};

export default AuthContext;
