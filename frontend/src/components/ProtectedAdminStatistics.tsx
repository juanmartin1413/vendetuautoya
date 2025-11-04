import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import AdminStatistics from '../pages/AdminStatistics'

const ProtectedAdminStatistics = () => {
  const { isAuthenticated, user } = useAuth()

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />
  }

  // Permitir acceso solo a administradores e inversores
  if (user.type !== 'administrador' && user.type !== 'inversor') {
    return <Navigate to="/dashboard" replace />
  }

  return <AdminStatistics />
}

export default ProtectedAdminStatistics