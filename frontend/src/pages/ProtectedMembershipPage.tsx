import { useAuth } from '../contexts/AuthContext'
import { Navigate } from 'react-router-dom'
import MembershipPage from './MembershipPage'

const ProtectedMembershipPage = () => {
  const { user, updateUser } = useAuth()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (user.type !== 'concesionario') {
    return <Navigate to="/dashboard" replace />
  }

  return <MembershipPage user={user} onUpdateUser={updateUser} />
}

export default ProtectedMembershipPage