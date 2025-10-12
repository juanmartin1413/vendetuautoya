import { User } from '../types/auth'
import { HomeIcon, LogoutIcon, CloseIcon } from './Icons'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  user: User
  onLogout: () => void
  onNavigateToHome: () => void
}

const Sidebar = ({ isOpen, onClose, user, onLogout, onNavigateToHome }: SidebarProps) => {
  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Header with logo */}
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-6">
          <div className="flex items-center justify-between mb-4">
            <img 
              src="/logo_barra.svg" 
              alt="VendeTuAutoYa" 
              className="w-36 h-28"
            />
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors duration-200"
            >
              <CloseIcon size={24} />
            </button>
          </div>
          
          {/* User info */}
          <div className="text-white">
            <p className="font-semibold text-lg">{user.name}</p>
            <p className="text-primary-100 text-sm capitalize">
              {user.type === 'vendedor' ? 'Vendedor' : 'Concesionario'}
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6">
          <div className="space-y-2">
            {/* Inicio */}
            <button
              onClick={() => {
                onNavigateToHome()
                onClose()
              }}
              className="w-full flex items-center px-4 py-3 text-left text-secondary-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-200 group"
            >
              <HomeIcon className="mr-3 group-hover:text-primary-600" size={20} />
              <span className="font-medium">Inicio</span>
            </button>

            {/* Cerrar sesión */}
            <button
              onClick={() => {
                onLogout()
                onClose()
              }}
              className="w-full flex items-center px-4 py-3 text-left text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200 group"
            >
              <LogoutIcon className="mr-3 group-hover:text-red-700" size={20} />
              <span className="font-medium">Cerrar sesión</span>
            </button>
          </div>
        </nav>

        {/* Footer with version */}
        <div className="border-t border-secondary-200 p-4">
          <p className="text-center text-xs text-secondary-500">
            Versión 1.0.0
          </p>
        </div>
      </div>
    </>
  )
}

export default Sidebar