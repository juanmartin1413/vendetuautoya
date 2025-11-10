export type UserType = 'Vendedor' | 'Concesionario' | 'Administrador' | 'Inversor' | 1 | 2 | 3 | 4
export type MembershipStatus = 'Free' | 'PremiumMonthly' | 'PremiumAnnual'

export interface MembershipInfo {
  status: MembershipStatus
  expirationDate: string | null // ISO string
  lastPaymentDate: string | null
  autoRenew: boolean
}

export interface User {
  id: number
  email: string
  name: string
  phone?: string
  type: UserType
  membership?: MembershipInfo
  createdAt: string
  updatedAt: string
}

export interface AuthState {
  isAuthenticated: boolean
  user: User | null
  token?: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  name: string
  type: UserType
}

export interface AuthResponse {
  token: string
  user: User
}

export interface LoginResponse {
  token: string
  user: User
}

// Helper function to normalize user type
export const normalizeUserType = (type: UserType): 'Vendedor' | 'Concesionario' | 'Administrador' | 'Inversor' => {
  if (type === 1 || type === 'Vendedor') return 'Vendedor'
  if (type === 2 || type === 'Concesionario') return 'Concesionario'
  if (type === 3 || type === 'Administrador') return 'Administrador'
  if (type === 4 || type === 'Inversor') return 'Inversor'
  return 'Vendedor' // fallback
}

// Note: Authentication functions have been moved to services/authService.ts
// Use authService.login() and related methods instead