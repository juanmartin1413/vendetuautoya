import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import SplashScreen from './pages/SplashScreen'
import LoginScreen from './pages/LoginScreen'
import ProtectedDashboard from './components/ProtectedDashboard'
import NewAuctionForm from './pages/NewAuctionForm'

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
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App