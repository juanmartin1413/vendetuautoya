import { apiClient } from '../config/apiClient';
import { API_ENDPOINTS } from '../config/api';
import { UserProfile, UpdateUserProfileRequest, CompletionStatus, DocumentType } from '../types/userProfile';

class UserProfileService {
  async getUserProfile(): Promise<UserProfile> {
    try {
      const data = await apiClient.get<UserProfile>(API_ENDPOINTS.USER_PROFILE.GET);
      return data;
    } catch (error: any) {
      const errorMessage = error.response?.data || error.message || 'Error al cargar los datos del perfil';
      throw new Error(errorMessage);
    }
  }

  async updateUserProfile(profileData: UpdateUserProfileRequest): Promise<UserProfile> {
    try {
      const data = await apiClient.put<UserProfile>(API_ENDPOINTS.USER_PROFILE.UPDATE, profileData);
      return data;
    } catch (error: any) {
      const errorMessage = error.response?.data || error.message || 'Error al actualizar el perfil';
      throw new Error(errorMessage);
    }
  }

  async getCompletionStatus(): Promise<CompletionStatus> {
    try {
      const data = await apiClient.get<CompletionStatus>(API_ENDPOINTS.USER_PROFILE.COMPLETION_STATUS);
      return data;
    } catch (error: any) {
      const errorMessage = error.response?.data || error.message || 'Error al cargar el estado del perfil';
      throw new Error(errorMessage);
    }
  }

  async uploadDocument(documentType: DocumentType, file: File): Promise<any> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('documentType', documentType); // Corregido: era 'type'
      
      const data = await apiClient.uploadFile(API_ENDPOINTS.USER_PROFILE.DOCUMENTS.UPLOAD, formData);
      return data;
    } catch (error: any) {
      const errorMessage = error.response?.data || error.message || 'Error al subir el documento';
      throw new Error(errorMessage);
    }
  }

  async deleteDocument(documentId: number): Promise<void> {
    try {
      await apiClient.delete(API_ENDPOINTS.USER_PROFILE.DOCUMENTS.DELETE(documentId));
    } catch (error: any) {
      const errorMessage = error.response?.data || error.message || 'Error al eliminar el documento';
      throw new Error(errorMessage);
    }
  }

  async downloadDocumentWithName(documentId: number, fileName: string): Promise<void> {
    try {
      await apiClient.downloadFile(API_ENDPOINTS.USER_PROFILE.DOCUMENTS.DOWNLOAD(documentId), fileName);
    } catch (error: any) {
      const errorMessage = error.response?.data || error.message || 'Error al descargar el documento';
      throw new Error(errorMessage);
    }
  }
}

export const userProfileService = new UserProfileService();
