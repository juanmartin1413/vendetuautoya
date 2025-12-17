import { apiClient } from '../config/apiClient';

export interface UserObservation {
  id: number;
  observation: string;
  authorEmail: string;
  createdAt: string;
}

export interface AddressData {
  id: number;
  street: string;
  number: string;
  floor?: string;
  apartment?: string;
  city: string;
  province: string;
  postalCode?: string;
}

export interface DocumentData {
  id: number;
  documentType: string;
  fileName: string;
  contentType: string;
  fileSize: number;
  uploadedAt: string;
  isActive: boolean;
}

export interface UserProfileData {
  id: number;
  firstName?: string;
  lastName?: string;
  phone?: string;
  documentNumber?: string;
  cuit?: string;
  businessName?: string;
  legalRepresentative?: string;
  isProfileComplete: boolean;
  isDocumentationComplete: boolean;
  isAddressComplete: boolean;
  createdAt: string;
  updatedAt: string;
  address?: AddressData;
  documents: DocumentData[];
}

export interface AdminUserData {
  id: number;
  name: string;
  email: string;
  type: 'Vendedor' | 'Concesionario' | 'Administrador' | 'Inversor' | number;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
  deletedAt?: string;
  status: 'Activo' | 'PendienteDeValidacion' | 'PendienteDeInformacion' | 'Observado'; // Enum from backend
  observationComment?: string;
  observations?: UserObservation[];
  userProfile?: UserProfileData;
}

export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface UserFilterRequest {
  email?: string;
  userType?: number; // null = todos
  status?: number; // Enum value: 1=Activo, 2=PendienteDeValidacion, 3=PendienteDeInformacion, 4=Observado
  dateFrom?: string;
  dateTo?: string;
  includeDeleted?: boolean;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: string;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  type?: number;
}

export interface UpdateMembershipRequest {
  status: string;
  expirationDate?: string;
}

export interface AddObservationRequest {
  observation: string;
}

export interface UpdateUserStatusRequest {
  status: string;
  observation?: string;
}

class AdminService {
  /**
   * Obtener todos los usuarios (solo administradores)
   */
  async getAllUsers(): Promise<AdminUserData[]> {
    try {
      const users = await apiClient.get<AdminUserData[]>('/users');
      return users;
    } catch (error) {
      console.error('Error fetching all users:', error);
      throw error;
    }
  }

  /**
   * Obtener usuarios con filtros y paginación (nuevo endpoint)
   */
  async getUsersWithFilters(filter: UserFilterRequest): Promise<PaginatedResponse<AdminUserData>> {
    try {
      const response = await apiClient.post<PaginatedResponse<AdminUserData>>(
        '/users/filter',
        filter
      );
      return response;
    } catch (error) {
      console.error('Error fetching users with filters:', error);
      throw error;
    }
  }

  /**
   * Obtener un usuario por ID
   */
  async getUserById(userId: number): Promise<AdminUserData> {
    try {
      const user = await apiClient.get<AdminUserData>(`/users/${userId}`);
      return user;
    } catch (error) {
      console.error(`Error fetching user ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Obtener usuarios por tipo
   */
  async getUsersByType(userType: number): Promise<AdminUserData[]> {
    try {
      const users = await apiClient.get<AdminUserData[]>(`/users/by-type/${userType}`);
      return users;
    } catch (error) {
      console.error(`Error fetching users by type ${userType}:`, error);
      throw error;
    }
  }

  /**
   * Actualizar información de un usuario
   */
  async updateUser(userId: number, data: UpdateUserRequest): Promise<AdminUserData> {
    try {
      const updatedUser = await apiClient.put<AdminUserData>(`/users/${userId}`, data);
      return updatedUser;
    } catch (error) {
      console.error(`Error updating user ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Eliminar un usuario (soft delete)
   */
  async deleteUser(userId: number): Promise<void> {
    try {
      await apiClient.delete(`/users/${userId}`);
    } catch (error) {
      console.error(`Error deleting user ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Actualizar membresía de un usuario concesionario
   */
  async updateMembership(userId: number, data: UpdateMembershipRequest): Promise<AdminUserData> {
    try {
      const updatedUser = await apiClient.post<AdminUserData>(
        `/users/${userId}/membership`,
        data
      );
      return updatedUser;
    } catch (error) {
      console.error(`Error updating membership for user ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Agregar observación a un usuario
   */
  async addObservation(userId: number, observation: string): Promise<AdminUserData> {
    try {
      const updatedUser = await apiClient.post<AdminUserData>(
        `/users/${userId}/observations`,
        { observation }
      );
      return updatedUser;
    } catch (error) {
      console.error(`Error adding observation to user ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Actualizar el estado de un usuario
   */
  async updateUserStatus(userId: number, data: UpdateUserStatusRequest): Promise<AdminUserData> {
    try {
      const updatedUser = await apiClient.put<AdminUserData>(
        `/users/${userId}/status`,
        data
      );
      return updatedUser;
    } catch (error) {
      console.error(`Error updating status for user ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Obtener el historial de observaciones de un usuario
   */
  async getUserObservations(userId: number): Promise<UserObservation[]> {
    try {
      const observations = await apiClient.get<UserObservation[]>(`/users/${userId}/observations`);
      return observations;
    } catch (error) {
      console.error(`Error fetching observations for user ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Descargar documento de un usuario (con autenticación)
   */
  async downloadUserDocument(userId: number, documentId: number, fileName: string): Promise<void> {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No hay token de autenticación');
      }

      const response = await fetch(`${apiClient.getBaseUrl()}/users/${userId}/documents/${documentId}/download`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Error al descargar documento: ${response.statusText}`);
      }

      // Crear blob y descargar
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error(`Error downloading document ${documentId} for user ${userId}:`, error);
      throw error;
    }
  }
}

export const adminService = new AdminService();
