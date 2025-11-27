import api, { authAPI } from './api';

// User authentication
export const userAuth = {
  register: async (userData: { name: string; email: string; password: string }) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  login: async (credentials: { email: string; password: string }) => {
    try {
      const response = await api.post('/auth/login', credentials);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('user_token');
  },

  getCurrentUser: () => {
    const token = localStorage.getItem('user_token');
    if (token) {
      // In a real app, you would decode the JWT token to get user info
      return { id: 1, name: 'User' };
    }
    return null;
  },

  getMe: async () => {
    try {
      const response = await authAPI.getMe();
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateProfile: async (userData: { name: string; email: string }) => {
    try {
      const response = await authAPI.updateProfile(userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteProfile: async () => {
    try {
      const response = await authAPI.deleteProfile();
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

// Admin authentication
export const adminAuth = {
  register: async (userData: { 
    name: string; 
    email: string; 
    password: string; 
    municipal_office: string; 
    region: string 
  }) => {
    try {
      const response = await api.post('/auth/admin/register', userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  login: async (credentials: { email: string; password: string }) => {
    try {
      const response = await api.post('/auth/admin/login', credentials);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('admin_token');
  },

  getCurrentAdmin: () => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      // In a real app, you would decode the JWT token to get admin info
      return { id: 1, name: 'Admin', region: 'City Center' };
    }
    return null;
  }
};

// Auth helpers
export const isAuthenticated = () => {
  return !!localStorage.getItem('user_token') || !!localStorage.getItem('admin_token');
};

export const isUser = () => {
  return !!localStorage.getItem('user_token');
};

export const isAdmin = () => {
  return !!localStorage.getItem('admin_token');
};

export const getAuthToken = () => {
  return localStorage.getItem('user_token') || localStorage.getItem('admin_token');
};

export const getUserType = () => {
  if (localStorage.getItem('user_token')) return 'user';
  if (localStorage.getItem('admin_token')) return 'admin';
  return null;
};