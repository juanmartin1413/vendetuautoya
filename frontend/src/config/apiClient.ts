import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { API_CONFIG, getDefaultHeaders } from './api';

/**
 * Centralized HTTP client for all API requests
 * Handles authentication, retries, and error handling
 */
class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      headers: getDefaultHeaders(),
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor - add auth token to all requests
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor - handle common errors
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      (error) => {
        // Handle 401 Unauthorized - redirect to login
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }

        // Handle network errors
        if (error.code === 'NETWORK_ERROR' || error.message === 'Network Error') {
          console.error('Network error - Backend may be down');
        }

        return Promise.reject(error);
      }
    );
  }

  // GET request
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  // POST request
  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  // PUT request
  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.put<T>(url, data, config);
    return response.data;
  }

  // DELETE request
  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }

  // PATCH request
  async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.patch<T>(url, data, config);
    return response.data;
  }

  // File upload (multipart/form-data)
  async uploadFile<T = any>(url: string, formData: FormData, onUploadProgress?: (progressEvent: any) => void): Promise<T> {
    const response = await this.client.post<T>(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress,
    });
    return response.data;
  }

  // File download
  async downloadFile(url: string, filename?: string): Promise<void> {
    const response = await this.client.get(url, {
      responseType: 'blob',
    });

    // Create blob and download
    const blob = new Blob([response.data], { type: response.data.type });
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    
    // Try to get filename from Content-Disposition header
    const contentDisposition = response.headers['content-disposition'];
    if (contentDisposition && !filename) {
      const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
      if (filenameMatch && filenameMatch[1]) {
        filename = filenameMatch[1].replace(/['"]/g, '');
      }
    }
    
    link.download = filename || 'download';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
  }

  // Get the axios instance for advanced usage
  getClient(): AxiosInstance {
    return this.client;
  }

  // Get the base URL
  getBaseUrl(): string {
    return API_CONFIG.BASE_URL;
  }
}

// Create and export a singleton instance
export const apiClient = new ApiClient();