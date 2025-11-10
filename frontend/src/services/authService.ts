import { LoginRequest, RegisterRequest, AuthResponse } from '../types/auth';
import { apiClient } from '../config/apiClient';
import { API_ENDPOINTS } from '../config/api';

class AuthService {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const data = await apiClient.post<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, credentials);
      
      // Store token and user data with consistent keys
      if (data.token) {
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('authUser', JSON.stringify(data.user));
        // Also store with legacy keys for backwards compatibility
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      
      return data;
    } catch (error: any) {
      const errorMessage = error.response?.data || error.message || 'Error en el login';
      throw new Error(errorMessage);
    }
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    try {
      const data = await apiClient.post<AuthResponse>(API_ENDPOINTS.AUTH.REGISTER, userData);
      
      // Store token and user data with consistent keys
      if (data.token) {
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('authUser', JSON.stringify(data.user));
        // Also store with legacy keys for backwards compatibility
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      
      return data;
    } catch (error: any) {
      const errorMessage = error.response?.data || error.message || 'Error en el registro';
      throw new Error(errorMessage);
    }
  }

  async logout(): Promise<void> {
    // Clear all auth data
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  getCurrentUser(): any {
    try {
      const user = localStorage.getItem('authUser') || localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  }

  getToken(): string | null {
    return localStorage.getItem('authToken') || localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    const user = this.getCurrentUser();
    return !!(token && user);
  }

  getUserType(): string | null {
    const user = this.getCurrentUser();
    return user?.userType || null;
  }

  async refreshToken(): Promise<string | null> {
    try {
      const data = await apiClient.post<{ token: string }>(API_ENDPOINTS.AUTH.REFRESH);
      if (data.token) {
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('token', data.token); // Legacy key
        return data.token;
      }
      return null;
    } catch (error) {
      this.logout();
      return null;
    }
  }
}

export const authService = new AuthService();