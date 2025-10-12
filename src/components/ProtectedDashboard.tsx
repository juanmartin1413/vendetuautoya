import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Dashboard from '../pages/Dashboard'

const ProtectedDashboard = () => {
  const { isAuthenticated, user, logout } = useAuth()

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />
  }

  return <Dashboard user={user} onLogout={logout} />
}

export default ProtectedDashboard