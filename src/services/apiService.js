// API service for handling all HTTP requests with proper authentication
import axios from 'axios';

// Create axios instance with base configuration
const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
  timeout: 10000, // 10 seconds timeout
});

// Request interceptor to add auth token to all requests
API.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add default headers
    if (!config.headers['Content-Type'] && !(config.data instanceof FormData)) {
      config.headers['Content-Type'] = 'application/json';
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle authentication errors
API.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized responses
    if (error.response?.status === 401) {
      // Clear stored auth data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('location');
      
      // Redirect to login page
      if (window.location.pathname !== '/login' && window.location.pathname !== '/signup') {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

// Auth service functions
export const authService = {
  // Register citizen
  registerCitizen: async (userData) => {
    const response = await API.post('/api/auth/register', userData);
    return response.data;
  },

  // Register authority
  registerAuthority: async (formData) => {
    const response = await API.post('/api/auth/authority/register', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Login
  login: async (credentials) => {
    const response = await API.post('/api/auth/login', credentials);
    
    if (response.data.success) {
      const { token, user, location } = response.data.data;
      
      // Store auth data
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      if (location) {
        localStorage.setItem('location', JSON.stringify(location));
      }
    }
    
    return response.data;
  },

  // Logout
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('location');
    window.location.href = '/login';
  },

  // Get current user
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  // Verify OTP
  verifyOtp: async (email, otp) => {
    const response = await API.post('/api/otp/verify/VERIFY_EMAIL', {
      email,
      otp,
    });
    return response.data;
  },
};

// Complaint service functions
export const complaintService = {
  // Get user's complaints
  getMyComplaints: async () => {
    const response = await API.get('/api/complaints/my');
    return response.data;
  },

  // Submit new complaint
  submitComplaint: async (complaintData) => {
    const response = await API.post('/api/complaints', complaintData);
    return response.data;
  },

  // Get public complaints feed
  getPublicFeed: async (limit = 10) => {
    const response = await API.get(`/api/public-feed?limit=${limit}`);
    return response.data;
  },
};

// KYC service functions
export const kycService = {
  // Submit KYC verification
  submitKyc: async (kycData) => {
    const response = await API.post('/api/kyc/submit', kycData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

// Admin service functions
export const adminService = {
  // Get all complaints
  getAllComplaints: async () => {
    const response = await API.get('/api/admin/complaints');
    return response.data;
  },

  // Get all authorities
  getAllAuthorities: async () => {
    const response = await API.get('/api/admin/authorities');
    return response.data;
  },

  // Get all citizens
  getAllCitizens: async () => {
    const response = await API.get('/api/admin/citizens');
    return response.data;
  },

  // Get KYC requests
  getKycRequests: async () => {
    const response = await API.get('/api/admin/kyc-requests');
    return response.data;
  },
};

// Authority service functions
export const authorityService = {
  // Get complaints for authority
  getAuthorityComplaints: async () => {
    const response = await API.get('/api/authority/complaints');
    return response.data;
  },

  // Update complaint status
  updateComplaintStatus: async (complaintId, status, reply) => {
    const response = await API.put(`/api/authority/complaints/${complaintId}`, {
      status,
      reply,
    });
    return response.data;
  },

  // Get broadcast feed
  getBroadcastFeed: async () => {
    const response = await API.get('/api/authority/broadcasts');
    return response.data;
  },
};

export default API;
