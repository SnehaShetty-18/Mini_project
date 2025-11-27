import axios from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add a request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    // Check for user or admin token
    const userToken = localStorage.getItem('user_token');
    const adminToken = localStorage.getItem('admin_token');
    const token = userToken || adminToken;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid, remove all auth tokens and redirect to login
      localStorage.removeItem('user_token');
      localStorage.removeItem('admin_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const authAPI = {
  register: (userData: any) => api.post('/auth/register', userData),
  adminRegister: (userData: any) => api.post('/auth/admin-register', userData),
  login: (credentials: any) => api.post('/auth/login', credentials),
  getMe: () => api.get('/auth/me'),
  updateProfile: (userData: any) => api.put('/auth/profile', userData),
  deleteProfile: () => api.delete('/auth/profile')
};

// Complaint endpoints
export const complaintAPI = {
  create: (complaintData: any) => {
    const formData = new FormData();
    Object.keys(complaintData).forEach(key => {
      formData.append(key, complaintData[key]);
    });
    return api.post('/complaints', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  getAll: () => api.get('/complaints'),
  getMyComplaints: () => api.get('/complaints/my-complaints'),
  getFeed: () => api.get('/complaints/feed'),
  getByCity: (city: string) => api.get(`/complaints/city/${city}`),
  getById: (id: string) => api.get(`/complaints/${id}`),
  updateStatus: (id: string, statusData: any) => api.put(`/complaints/${id}/status`, statusData),
  upvote: (id: string) => api.post(`/complaints/${id}/upvote`)
};

// File upload endpoints
export const fileAPI = {
  upload: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }
};

export default api;