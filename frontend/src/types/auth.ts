export type UserType = 'vendedor' | 'concesionario' | 'administrador' | 'inversor'
export type MembershipStatus = 'free' | 'premium_monthly' | 'premium_annual'

export interface MembershipInfo {
  status: MembershipStatus
  expirationDate: string | null // ISO string
  lastPaymentDate: string | null
  autoRenew: boolean
}

export interface User {
  email: string
  password: string
  type: UserType
  name: string
  membership?: MembershipInfo // Solo para concesionarios
}

export interface AuthState {
  isAuthenticated: boolean
  user: User | null
}

// Mock users for authentication
export const mockUsers: User[] = [
  {
    email: 'vendedor@vendetuautoya.com',
    password: '123456',
    type: 'vendedor',
    name: 'Vendedor Demo'
  },
  {
    email: 'concesionario@vendetuautoya.com',
    password: '123456',
    type: 'concesionario',
    name: 'Concesionario Demo',
    membership: {
      status: 'free',
      expirationDate: null,
      lastPaymentDate: null,
      autoRenew: false
    }
  },
  {
    email: 'administrador@vendetuautoya.com',
    password: '123456',
    type: 'administrador',
    name: 'Administrador Sistema'
  },
  {
    email: 'inversor@vendetuautoya.com',
    password: '123456',
    type: 'inversor',
    name: 'Inversor Demo'
  }
]

// Authentication functions
export const authenticateUser = (email: string, password: string): User | null => {
  const user = mockUsers.find(u => u.email === email && u.password === password)
  return user || null
}

export const getUserByEmail = (email: string): User | null => {
  return mockUsers.find(u => u.email === email) || null
}