// Tipos para el perfil de usuario
export interface Address {
  id?: number
  street: string
  number: string
  floor?: string
  apartment?: string
  city: string
  province: string
  postalCode?: string
}

export interface Document {
  id: number
  documentType: string
  fileName: string
  contentType: string
  fileSize: number
  uploadedAt: string
  isActive: boolean
}

export interface UserProfile {
  id?: number
  firstName?: string
  lastName?: string
  phone?: string
  documentNumber?: string
  cuit?: string
  businessName?: string
  legalRepresentative?: string
  isProfileComplete: boolean
  isDocumentationComplete: boolean
  isAddressComplete: boolean
  address?: Address
  documents: Document[]
  createdAt?: string
  updatedAt?: string
}

// DTOs para requests
export interface UpdateUserProfileRequest {
  firstName?: string
  lastName?: string
  phone?: string
  documentNumber?: string
  cuit?: string
  businessName?: string
  legalRepresentative?: string
  address?: {
    street: string
    number: string
    floor?: string
    apartment?: string
    city: string
    province: string
    postalCode?: string
  }
}

// Response para el estado de completitud
export interface CompletionStatus {
  isProfileComplete: boolean
  isAddressComplete: boolean
  isDocumentationComplete: boolean
  overallComplete: boolean
  completionPercentage: number
}

// Tipos de documentos permitidos
export type DocumentType = 'DNI' | 'Estatuto' | 'AFIP'

// Response para upload de documentos
export interface DocumentUploadResponse {
  id: number
  documentType: string
  fileName: string
  contentType: string
  fileSize: number
  uploadedAt: string
  isActive: boolean
}