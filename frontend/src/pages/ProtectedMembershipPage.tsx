import { useAuth } from '../contexts/AuthContext'
import { Navigate } from 'react-router-dom'
import MembershipPage from './MembershipPage'
import { normalizeUserType } from '../types/auth'

const ProtectedMembershipPage = () => {
  const { user, updateUser } = useAuth()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (normalizeUserType(user.type) !== 'Concesionario') {
    return <Navigate to="/dashboard" replace />
  }

  return <MembershipPage user={user} onUpdateUser={updateUser} />
}

export default ProtectedMembershipPage