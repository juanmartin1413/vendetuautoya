import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import SplashScreen from './pages/SplashScreen'
import LoginScreen from './pages/LoginScreen'
import RegisterScreen from './pages/RegisterScreen'
import OTPVerificationScreen from './pages/OTPVerificationScreen'
import ProtectedDashboard from './components/ProtectedDashboard'
import NewAuctionForm from './pages/NewAuctionForm'
import MyAuctions from './pages/MyAuctions'
import ConcesionarioMyAuctions from './pages/ConcesionarioMyAuctions'
import ConcesionarioSearch from './pages/ConcesionarioSearch'
import AuctionDetail from './pages/AuctionDetail'
import MyData from './pages/MyData'
import ConcesionarioMyData from './pages/ConcesionarioMyData'
import ProtectedMembershipPage from './pages/ProtectedMembershipPage'
import Notifications from './pages/Notifications'
import AdminUsers from './pages/AdminUsers'
import AdminPublications from './pages/AdminPublications'
import ProtectedAdminStatistics from './components/ProtectedAdminStatistics'
import AdminUserDetail from './pages/AdminUserDetail'
import AdminPublicationDetail from './pages/AdminPublicationDetail'

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/" element={<SplashScreen />} />
            <Route path="/login" element={<LoginScreen />} />
            <Route path="/register" element={<RegisterScreen />} />
            <Route path="/verify-otp" element={<OTPVerificationScreen />} />
            <Route path="/dashboard" element={<ProtectedDashboard />} />
            <Route path="/new-auction" element={<NewAuctionForm />} />
            <Route path="/my-auctions" element={<MyAuctions />} />
            <Route path="/concesionario-my-auctions" element={<ConcesionarioMyAuctions />} />
            <Route path="/concesionario-search" element={<ConcesionarioSearch />} />
            <Route path="/auction-detail/:id" element={<AuctionDetail />} />
            <Route path="/my-data" element={<MyData />} />
            <Route path="/concesionario-my-data" element={<ConcesionarioMyData />} />
            <Route path="/membership" element={<ProtectedMembershipPage />} />
            <Route path="/notificaciones" element={<Notifications />} />
            <Route path="/admin-users" element={<AdminUsers />} />
            <Route path="/admin-user-detail/:id" element={<AdminUserDetail />} />
            <Route path="/admin-publications" element={<AdminPublications />} />
            <Route path="/admin-publication-detail/:id" element={<AdminPublicationDetail />} />
            <Route path="/admin-statistics" element={<ProtectedAdminStatistics />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App