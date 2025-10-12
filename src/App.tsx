import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import SplashScreen from './pages/SplashScreen'
import LoginScreen from './pages/LoginScreen'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<SplashScreen />} />
          <Route path="/login" element={<LoginScreen />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App