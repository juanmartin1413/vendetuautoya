import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import SplashScreen from './pages/SplashScreen'
import LoginScreen from './pages/LoginScreen'
import ProtectedDashboard from './components/ProtectedDashboard'
import NewAuctionForm from './pages/NewAuctionForm'
import MyAuctions from './pages/MyAuctions'
import AuctionDetail from './pages/AuctionDetail'
import MyData from './pages/MyData'
import Notifications from './pages/Notifications'

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/" element={<SplashScreen />} />
            <Route path="/login" element={<LoginScreen />} />
            <Route path="/dashboard" element={<ProtectedDashboard />} />
            <Route path="/new-auction" element={<NewAuctionForm />} />
            <Route path="/my-auctions" element={<MyAuctions />} />
            <Route path="/auction-detail/:id" element={<AuctionDetail />} />
            <Route path="/my-data" element={<MyData />} />
            <Route path="/notificaciones" element={<Notifications />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App