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

export interface LoginResponse {
  token: string
  user: User
}

// API Configuration
const API_BASE_URL = 'https://localhost:7001/api'

// Helper function to normalize user type
export const normalizeUserType = (type: UserType): 'Vendedor' | 'Concesionario' | 'Administrador' | 'Inversor' => {
  if (type === 1 || type === 'Vendedor') return 'Vendedor'
  if (type === 2 || type === 'Concesionario') return 'Concesionario'
  if (type === 3 || type === 'Administrador') return 'Administrador'
  if (type === 4 || type === 'Inversor') return 'Inversor'
  return 'Vendedor' // fallback
}

// Authentication functions using backend API
export const authenticateUser = async (email: string, password: string): Promise<{ user: User; token: string } | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })

    if (!response.ok) {
      return null
    }

    const data: LoginResponse = await response.json()
    return { user: data.user, token: data.token }
  } catch (error) {
    console.error('Error authenticating user:', error)
    return null
  }
}

export const getUserByEmail = async (email: string): Promise<User | null> => {
  try {
    const token = localStorage.getItem('authToken')
    if (!token) return null

    const response = await fetch(`${API_BASE_URL}/users/email/${email}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      return null
    }

    const user: User = await response.json()
    return user
  } catch (error) {
    console.error('Error fetching user by email:', error)
    return null
  }
}