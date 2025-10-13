import { useState } from 'react'
import { User } from '../types/auth'
import { UserIcon, AuctionIcon, CarPlusIcon, SearchIcon, MenuIcon, BellIcon } from '../components/Icons'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'

interface DashboardProps {
  user: User
  onLogout: () => void
}

interface MenuItem {
  id: string
  label: string
  icon: React.ReactNode
  onClick: () => void
}

const Dashboard = ({ user, onLogout }: DashboardProps) => {
  const navigate = useNavigate()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [currentView, setCurrentView] = useState<'home' | 'profile'>('home')

  const handleLogout = () => {
    onLogout()
    navigate('/login')
  }

  const handleNavigateToHome = () => {
    setCurrentView('home')
  }

  // Menu items for vendedor (sin cerrar sesión)
  const vendedorMenuItems: MenuItem[] = [
    {
      id: 'mis-datos',
      label: 'Mis datos',
      icon: <UserIcon className="text-primary-500" size={60} />,
      onClick: () => console.log('Mis datos clicked')
    },
    {
      id: 'mis-subastas',
      label: 'Mis Subastas',
      icon: <AuctionIcon className="text-primary-500" size={60} />,
      onClick: () => console.log('Mis Subastas clicked')
    },
    {
      id: 'subastar-vehiculo',
      label: 'Subastar nuevo vehículo',
      icon: <CarPlusIcon className="text-primary-500" size={60} />,
      onClick: () => navigate('/new-auction')
    },
    {
      id: 'notificaciones',
      label: 'Notificaciones',
      icon: <BellIcon className="text-primary-500" size={60} />,
      onClick: () => console.log('Notificaciones clicked')
    }
  ]

  // Menu items for concesionario (sin cerrar sesión)
  const concesionarioMenuItems: MenuItem[] = [
    {
      id: 'mis-datos',
      label: 'Mis datos',
      icon: <UserIcon className="text-primary-500" size={60} />,
      onClick: () => console.log('Mis datos clicked')
    },
    {
      id: 'mis-subastas',
      label: 'Mis Subastas',
      icon: <AuctionIcon className="text-primary-500" size={60} />,
      onClick: () => console.log('Mis Subastas clicked')
    },
    {
      id: 'buscar',
      label: 'Buscar',
      icon: <SearchIcon className="text-primary-500" size={60} />,
      onClick: () => console.log('Buscar clicked')
    },
    {
      id: 'notificaciones',
      label: 'Notificaciones',
      icon: <BellIcon className="text-primary-500" size={60} />,
      onClick: () => console.log('Notificaciones clicked')
    }
  ]

  const menuItems = user.type === 'vendedor' ? vendedorMenuItems : concesionarioMenuItems

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        user={user}
        onLogout={handleLogout}
        onNavigateToHome={handleNavigateToHome}
      />

      {/* Header */}
      <header className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            {/* Hamburger Menu */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="text-secondary-600 hover:text-primary-600 transition-colors duration-200"
            >
              <MenuIcon size={28} />
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'home' && (
          <>
            {/* Welcome message */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-secondary-900 mb-2">
                ¡Bienvenido, {user.name}!
              </h1>
              <p className="text-secondary-600">
                {user.type === 'vendedor' 
                  ? 'Gestiona tus vehículos y subastas desde tu panel de control.'
                  : 'Explora las subastas disponibles y gestiona tus participaciones.'
                }
              </p>
            </div>

            {/* Menu grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={item.onClick}
                  className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl hover:scale-105 transition-all duration-200 border border-secondary-100 hover:border-primary-200 hover:bg-primary-50"
                >
                  <div className="flex flex-col items-center text-center space-y-3">
                    <div className="p-3 bg-gray-50 rounded-full">
                      {item.icon}
                    </div>
                    <h3 className="font-semibold text-sm text-secondary-800">
                      {item.label}
                    </h3>
                  </div>
                </button>
              ))}
            </div>

            {/* Stats or additional content based on user type */}
            <div className="mt-12 bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-secondary-900 mb-4">
                Panel de Control
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-primary-50 rounded-lg">
                  <p className="text-2xl font-bold text-primary-600">12</p>
                  <p className="text-sm text-secondary-600">
                    {user.type === 'vendedor' ? 'Vehículos Publicados' : 'Subastas Participando'}
                  </p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">8</p>
                  <p className="text-sm text-secondary-600">
                    {user.type === 'vendedor' ? 'Subastas Activas' : 'Ofertas Realizadas'}
                  </p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">4</p>
                  <p className="text-sm text-secondary-600">
                    {user.type === 'vendedor' ? 'Vehículos Vendidos' : 'Vehículos Ganados'}
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  )
}

export default Dashboard