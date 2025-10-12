export type UserType = 'vendedor' | 'concesionario'

export interface User {
  email: string
  password: string
  type: UserType
  name: string
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
    name: 'Concesionario Demo'
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