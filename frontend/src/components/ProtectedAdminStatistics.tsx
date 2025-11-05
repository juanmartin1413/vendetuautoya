import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { normalizeUserType } from '../types/auth'
import AdminStatistics from '../pages/AdminStatistics'

const ProtectedAdminStatistics = () => {
  const { isAuthenticated, user } = useAuth()

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />
  }

  // Permitir acceso solo a administradores e inversores
  const userType = normalizeUserType(user.type)
  if (userType !== 'Administrador' && userType !== 'Inversor') {
    return <Navigate to="/dashboard" replace />
  }

  return <AdminStatistics />
}

export default ProtectedAdminStatistics