import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const SplashScreen = () => {
  const navigate = useNavigate()

  useEffect(() => {
    // Navigate to login after 5 seconds
    const timer = setTimeout(() => {
      navigate('/login')
    }, 5000)

    return () => clearTimeout(timer)
  }, [navigate])

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center">
      <div className="text-center">
        {/* Logo */}
        <div className="mb-8 animate-pulse">
          <img 
            src="/logo.svg" 
            alt="VendeTuAutoYa" 
            className="w-72 h-54 mx-auto"
          />
        </div>
        
        {/* Loading indicator */}
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
        </div>
        
        {/* Loading text */}
        <p className="mt-4 text-primary-600 font-medium">
          Cargando...
        </p>
      </div>
    </div>
  )
}

export default SplashScreen