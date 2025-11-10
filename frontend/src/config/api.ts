/**
 * API Configuration
 * Centralized configuration for all backend API calls
 */

// Environment-based API configuration
const getApiBaseUrl = (): string => {
  // Use environment variable if available, otherwise fall back to environment-based logic
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }

  // Check if we're in development, staging, or production
  const environment = import.meta.env.MODE || 'development';
  
  switch (environment) {
    case 'development':
      return 'https://localhost:7001/api';
    case 'staging':
      return 'https://staging-api.vendetuautoya.com/api';
    case 'production':
      return 'https://api.vendetuautoya.com/api';
    default:
      return 'https://localhost:7001/api';
  }
};

// Export the configuration
export const API_CONFIG = {
  BASE_URL: getApiBaseUrl(),
  TIMEOUT: 30000, // 30 seconds timeout
  RETRY_ATTEMPTS: 3,
} as const;

// Export individual endpoints for better organization
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh',
  },
  USER_PROFILE: {
    GET: '/userprofile',
    UPDATE: '/userprofile',
    COMPLETION_STATUS: '/userprofile/completion-status',
    DOCUMENTS: {
      UPLOAD: '/userprofile/documents',
      DELETE: (id: number) => `/userprofile/documents/${id}`,
      DOWNLOAD: (id: number) => `/userprofile/documents/${id}/download`,
    },
  },
  AUCTIONS: {
    LIST: '/auctions',
    CREATE: '/auctions',
    GET: (id: number) => `/auctions/${id}`,
    UPDATE: (id: number) => `/auctions/${id}`,
    DELETE: (id: number) => `/auctions/${id}`,
  },
  // Add more endpoints as needed
} as const;

// Utility function to build full URL
export const buildApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Default headers for API requests
export const getDefaultHeaders = (): Record<string, string> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // Add authorization header if token exists
  const token = localStorage.getItem('token');
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

// Default headers for multipart/form-data requests
export const getMultipartHeaders = (): Record<string, string> => {
  const headers: Record<string, string> = {};

  // Add authorization header if token exists
  const token = localStorage.getItem('token');
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  // Don't set Content-Type for multipart, let the browser set it
  return headers;
};