import api from './api.js';
import { ENDPOINTS } from '../config/api.js';

// Register user
export const register = async (userData) => {
  try {
    const response = await api.post(ENDPOINTS.AUTH.REGISTER, userData);
    
    if (response.data && response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));
      
      // Dispatch events to notify components of auth change
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new Event('authChange'));
    }
    return response.data;
  } catch (error) {
    console.error('Registration error:', error);
    throw error.response?.data?.msg || 'Registration failed';
  }
};

// Login user
export const login = async (credentials) => {
  try {
    const response = await api.post(ENDPOINTS.AUTH.LOGIN, credentials);
    if (response.data && response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));
      
      // Dispatch events to notify components of auth change
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new Event('authChange'));
    }
    return response.data;
  } catch (error) {
    throw error.response?.data?.msg || 'Login failed';
  }
};

// Get current user profile
export const getCurrentUser = async () => {
  try {
    const response = await api.get(ENDPOINTS.AUTH.CURRENT);
    return response.data;
  } catch (error) {
    throw error.response?.data?.msg || 'Failed to get user profile';
  }
};

// Get stored user from localStorage
export const getStoredUser = () => {
  try {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    console.error('Error parsing user from localStorage:', error);
    return null;
  }
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return localStorage.getItem('token') !== null;
};

// Logout user
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  
  // Dispatch events to notify components of auth change
  window.dispatchEvent(new Event('storage'));
  window.dispatchEvent(new Event('authChange'));
};