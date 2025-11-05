import { useState } from 'react'
import { User, normalizeUserType } from '../types/auth'
import { UserIcon, AuctionIcon, AuctionHammerIcon, SearchIcon, MenuIcon, BellIcon, UsersIcon, FileTextIcon, BarChartIcon, DollarSignIcon } from '../components/Icons'
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
  
  // Normalize user type for consistent comparison
  const userType = normalizeUserType(user.type)

  const handleLogout = () => {
    onLogout()
    navigate('/login')
  }

  const handleNavigateToHome = () => {
    setCurrentView('home')
  }

  // Función para verificar si la membresía está activa
  const isMembershipActive = () => {
    if (userType !== 'Concesionario' || !user.membership) return false
    if (user.membership.status === 'Free') return false
    if (!user.membership.expirationDate) return false
    
    const expirationDate = new Date(user.membership.expirationDate)
    const now = new Date()
    return expirationDate > now
  }

  const getMembershipInfo = () => {
    if (userType !== 'Concesionario' || !user.membership) return null
    
    if (user.membership.status === 'Free') {
      return { status: 'Gratuita', color: 'text-gray-600', bgColor: 'bg-gray-100' }
    }
    
    if (isMembershipActive()) {
      const expirationDate = new Date(user.membership.expirationDate!)
      const formattedDate = expirationDate.toLocaleDateString('es-ES', { 
        day: '2-digit', 
        month: 'short', 
        year: 'numeric' 
      })
      return { 
        status: `Premium hasta ${formattedDate}`, 
        color: 'text-green-600', 
        bgColor: 'bg-green-100' 
      }
    }
    
    return { status: 'Expirada', color: 'text-red-600', bgColor: 'bg-red-100' }
  }

  // Menu items for vendedor (sin cerrar sesión)
  const vendedorMenuItems: MenuItem[] = [
    {
      id: 'mis-datos',
      label: 'Mis datos',
      icon: <UserIcon className="text-primary-500" size={60} />,
      onClick: () => navigate('/my-data')
    },
    {
      id: 'mis-subastas',
      label: 'Mis Subastas',
      icon: <AuctionIcon className="text-primary-500" size={60} />,
      onClick: () => navigate('/my-auctions')
    },
    {
      id: 'subastar-vehiculo',
      label: 'Subastar nuevo vehículo',
      icon: <AuctionHammerIcon className="text-primary-500" size={60} />,
      onClick: () => navigate('/new-auction')
    },
    {
      id: 'notificaciones',
      label: 'Notificaciones',
      icon: <BellIcon className="text-primary-500" size={60} />,
      onClick: () => navigate('/notificaciones')
    }
  ]

  // Menu items for concesionario (sin cerrar sesión)
  const concesionarioMenuItems: MenuItem[] = [
    {
      id: 'mis-datos',
      label: 'Mis datos',
      icon: <UserIcon className="text-primary-500" size={60} />,
      onClick: () => navigate('/concesionario-my-data')
    },
    {
      id: 'mi-membresia',
      label: 'Mi Membresía',
      icon: <DollarSignIcon className="text-yellow-500" size={60} />,
      onClick: () => navigate('/membership')
    },
    {
      id: 'mis-subastas',
      label: 'Mis Subastas',
      icon: <AuctionIcon className="text-primary-500" size={60} />,
      onClick: () => navigate('/concesionario-my-auctions')
    },
    {
      id: 'buscar',
      label: 'Buscar',
      icon: <SearchIcon className="text-primary-500" size={60} />,
      onClick: () => navigate('/concesionario-search')
    },
    {
      id: 'notificaciones',
      label: 'Notificaciones',
      icon: <BellIcon className="text-primary-500" size={60} />,
      onClick: () => navigate('/notificaciones')
    }
  ]

  // Menu items for administrador
  const administradorMenuItems: MenuItem[] = [
    {
      id: 'usuarios',
      label: 'Usuarios',
      icon: <UsersIcon className="text-primary-500" size={60} />,
      onClick: () => navigate('/admin-users')
    },
    {
      id: 'publicaciones',
      label: 'Publicaciones',
      icon: <FileTextIcon className="text-primary-500" size={60} />,
      onClick: () => navigate('/admin-publications')
    },
    {
      id: 'estadisticas',
      label: 'Estadísticas',
      icon: <BarChartIcon className="text-primary-500" size={60} />,
      onClick: () => navigate('/admin-statistics')
    }
  ]

  // Menu items for inversor (solo estadísticas)
  const inversorMenuItems: MenuItem[] = [
    {
      id: 'estadisticas',
      label: 'Estadísticas',
      icon: <BarChartIcon className="text-primary-500" size={60} />,
      onClick: () => navigate('/admin-statistics')
    }
  ]

  const menuItems = userType === 'Vendedor' ? vendedorMenuItems : 
                   userType === 'Concesionario' ? concesionarioMenuItems :
                   userType === 'Administrador' ? administradorMenuItems :
                   inversorMenuItems

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
                {userType === 'Vendedor' 
                  ? 'Gestiona tus vehículos y subastas desde tu panel de control.'
                  : userType === 'Concesionario'
                  ? 'Explora las subastas disponibles y gestiona tus participaciones.'
                  : userType === 'Administrador'
                  ? 'Administra la plataforma y supervisa todas las operaciones.'
                  : 'Accede a estadísticas y métricas de rendimiento de la plataforma.'
                }
              </p>
              
              {/* Indicador de membresía para concesionarios */}
              {userType === 'Concesionario' && getMembershipInfo() && (
                <div className="mt-4">
                  <div className={`inline-flex items-center px-4 py-2 rounded-full ${getMembershipInfo()!.bgColor} border`}>
                    <DollarSignIcon className={`${getMembershipInfo()!.color} mr-2`} size={20} />
                    <span className={`text-sm font-medium ${getMembershipInfo()!.color}`}>
                      Membresía: {getMembershipInfo()!.status}
                    </span>
                    {!isMembershipActive() && (
                      <button
                        onClick={() => navigate('/membership')}
                        className="ml-3 px-3 py-1 bg-primary-600 text-white text-xs rounded-full hover:bg-primary-700 transition-colors"
                      >
                        Actualizar
                      </button>
                    )}
                  </div>
                </div>
              )}
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
              {userType === 'Administrador' ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">47</p>
                    <p className="text-sm text-secondary-600">Total de Usuarios</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">5</p>
                    <p className="text-sm text-secondary-600">Subastas Activas</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <p className="text-2xl font-bold text-purple-600">12</p>
                    <p className="text-sm text-secondary-600">Subastas Finalizadas</p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-primary-50 rounded-lg">
                    <p className="text-2xl font-bold text-primary-600">12</p>
                    <p className="text-sm text-secondary-600">
                      {userType === 'Vendedor' ? 'Vehículos Publicados' : 'Subastas Participando'}
                    </p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">8</p>
                    <p className="text-sm text-secondary-600">
                      {userType === 'Vendedor' ? 'Subastas Activas' : 'Ofertas Realizadas'}
                    </p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">4</p>
                    <p className="text-sm text-secondary-600">
                      {userType === 'Vendedor' ? 'Vehículos Vendidos' : 'Vehículos Ganados'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  )
}

export default Dashboard