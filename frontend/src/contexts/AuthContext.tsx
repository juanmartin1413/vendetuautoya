import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { User, AuthState } from '../types/auth'

interface AuthContextType extends AuthState {
  login: (user: User, token: string) => void
  logout: () => void
  updateUser: (user: User) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    token: undefined
  })

  // Check for stored authentication on component mount
  useEffect(() => {
    const storedToken = localStorage.getItem('authToken')
    const storedUser = localStorage.getItem('authUser')
    
    if (storedToken && storedUser) {
      try {
        const user = JSON.parse(storedUser)
        setAuthState({
          isAuthenticated: true,
          user,
          token: storedToken
        })
      } catch (error) {
        // Clear invalid stored data
        localStorage.removeItem('authToken')
        localStorage.removeItem('authUser')
      }
    }
  }, [])

  const login = (user: User, token: string) => {
    localStorage.setItem('authToken', token)
    localStorage.setItem('authUser', JSON.stringify(user))
    
    setAuthState({
      isAuthenticated: true,
      user,
      token
    })
  }

  const logout = () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('authUser')
    
    setAuthState({
      isAuthenticated: false,
      user: null,
      token: undefined
    })
  }

  const updateUser = (updatedUser: User) => {
    localStorage.setItem('authUser', JSON.stringify(updatedUser))
    
    setAuthState(prev => ({
      ...prev,
      user: updatedUser
    }))
  }

  return (
    <AuthContext.Provider value={{ ...authState, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}