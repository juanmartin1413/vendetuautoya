import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeftIcon, UsersIcon, SearchIcon } from '../components/Icons'

// Tipos de estado de usuario
type UserStatus = 'activo' | 'pendiente_informacion' | 'pendiente_validacion' | 'observado'
type UserType = 'vendedor' | 'concesionario'

interface UserData {
  id: number
  name: string
  email: string
  type: UserType
  status: UserStatus
  isDeleted: boolean
  createdDate: string
  createdTime: string
  observationComment?: string
}

interface FilterState {
  email: string
  profileType: string // 'all', 'vendedor', 'concesionario'
  dateFrom: string
  dateTo: string
  status: string // 'all' + los estados
  includeDeleted: boolean
}

const AdminUsers = () => {
  const navigate = useNavigate()
  
  // Estado de filtros
  const [filters, setFilters] = useState<FilterState>({
    email: '',
    profileType: 'all',
    dateFrom: '',
    dateTo: '',
    status: 'all',
    includeDeleted: false
  })

  // Estado para mostrar/ocultar filtros avanzados
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)

  // Mock data de usuarios más completo
  const mockUsers: UserData[] = [
    {
      id: 1,
      name: 'Juan Pérez',
      email: 'juan.perez@email.com',
      type: 'vendedor',
      status: 'activo',
      isDeleted: false,
      createdDate: '2024-01-15',
      createdTime: '14:30'
    },
    {
      id: 2,
      name: 'AutoPlaza SA',
      email: 'info@autoplaza.com',
      type: 'concesionario',
      status: 'activo',
      isDeleted: false,
      createdDate: '2024-02-20',
      createdTime: '09:15'
    },
    {
      id: 3,
      name: 'María González',
      email: 'maria.gonzalez@email.com',
      type: 'vendedor',
      status: 'pendiente_informacion',
      isDeleted: false,
      createdDate: '2024-03-10',
      createdTime: '16:45'
    },
    {
      id: 4,
      name: 'Carlos Auto Center',
      email: 'carlos@autocenter.com',
      type: 'concesionario',
      status: 'pendiente_validacion',
      isDeleted: false,
      createdDate: '2024-03-08',
      createdTime: '11:20'
    },
    {
      id: 5,
      name: 'Ana Rodríguez',
      email: 'ana.rodriguez@email.com',
      type: 'vendedor',
      status: 'observado',
      isDeleted: false,
      createdDate: '2024-03-12',
      createdTime: '13:10',
      observationComment: 'Documentación de identificación no clara, por favor proporcionar imagen de mejor calidad'
    },
    {
      id: 6,
      name: 'Luis Motors',
      email: 'luis@luismotors.com',
      type: 'concesionario',
      status: 'activo',
      isDeleted: true,
      createdDate: '2024-01-20',
      createdTime: '10:00'
    },
    {
      id: 7,
      name: 'Sofia López',
      email: 'sofia.lopez@email.com',
      type: 'vendedor',
      status: 'pendiente_informacion',
      isDeleted: false,
      createdDate: '2024-03-14',
      createdTime: '15:30'
    }
  ]

  // Función para filtrar usuarios
  const getFilteredUsers = () => {
    return mockUsers.filter(user => {
      // Filtro por email
      if (filters.email && !user.email.toLowerCase().includes(filters.email.toLowerCase())) {
        return false
      }

      // Filtro por tipo de perfil
      if (filters.profileType !== 'all' && user.type !== filters.profileType) {
        return false
      }

      // Filtro por estado
      if (filters.status !== 'all' && user.status !== filters.status) {
        return false
      }

      // Filtro por fecha desde
      if (filters.dateFrom && user.createdDate < filters.dateFrom) {
        return false
      }

      // Filtro por fecha hasta
      if (filters.dateTo && user.createdDate > filters.dateTo) {
        return false
      }

      // Filtro para incluir eliminados
      if (!filters.includeDeleted && user.isDeleted) {
        return false
      }

      return true
    })
  }

  const filteredUsers = getFilteredUsers()

  // Función para obtener el color del estado
  const getStatusColor = (status: UserStatus) => {
    switch (status) {
      case 'activo': return 'bg-green-100 text-green-800'
      case 'pendiente_informacion': return 'bg-yellow-100 text-yellow-800'
      case 'pendiente_validacion': return 'bg-blue-100 text-blue-800'
      case 'observado': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // Función para obtener el texto del estado
  const getStatusText = (status: UserStatus) => {
    switch (status) {
      case 'activo': return 'Activo'
      case 'pendiente_informacion': return 'Pendiente de información'
      case 'pendiente_validacion': return 'Pendiente de validación'
      case 'observado': return 'Observado'
      default: return status
    }
  }

  // Función para obtener el color del tipo
  const getTypeColor = (type: UserType) => {
    switch (type) {
      case 'vendedor': return 'bg-blue-100 text-blue-800'
      case 'concesionario': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // Función para limpiar filtros
  const clearFilters = () => {
    setFilters({
      email: '',
      profileType: 'all',
      dateFrom: '',
      dateTo: '',
      status: 'all',
      includeDeleted: false
    })
  }

  // Función para ver detalle del usuario
  const viewUserDetail = (userId: number) => {
    navigate(`/admin-user-detail/${userId}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      {/* Header */}
      <header className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/dashboard')}
                className="text-secondary-600 hover:text-primary-600 transition-colors duration-200 mr-4"
              >
                <ArrowLeftIcon size={28} />
              </button>
              <div className="flex items-center">
                <UsersIcon className="text-primary-600 mr-3" size={32} />
                <h1 className="text-2xl font-bold text-secondary-900">
                  Administración de Usuarios
                </h1>
              </div>
            </div>
            
            {/* Indicador del perfil */}
            <div className="flex items-center">
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 border border-orange-200">
                Vista Administrador
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filtros */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-secondary-900">
              Filtros de búsqueda
            </h2>
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="text-primary-600 hover:text-primary-700 font-medium text-sm"
            >
              {showAdvancedFilters ? 'Ocultar filtros avanzados' : 'Mostrar filtros avanzados'}
            </button>
          </div>

          {/* Filtros básicos */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Email
              </label>
              <input
                type="email"
                placeholder="Buscar por email..."
                value={filters.email}
                onChange={(e) => setFilters({...filters, email: e.target.value})}
                className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Tipo de perfil
              </label>
              <select
                value={filters.profileType}
                onChange={(e) => setFilters({...filters, profileType: e.target.value})}
                className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">Todos los tipos</option>
                <option value="vendedor">Vendedor</option>
                <option value="concesionario">Concesionario</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Estado
              </label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({...filters, status: e.target.value})}
                className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">Todos los estados</option>
                <option value="activo">Activo</option>
                <option value="pendiente_informacion">Pendiente de información</option>
                <option value="pendiente_validacion">Pendiente de validación</option>
                <option value="observado">Observado</option>
              </select>
            </div>
          </div>

          {/* Filtros avanzados */}
          {showAdvancedFilters && (
            <div className="border-t border-secondary-200 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Fecha creación desde
                  </label>
                  <input
                    type="date"
                    value={filters.dateFrom}
                    onChange={(e) => setFilters({...filters, dateFrom: e.target.value})}
                    className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Fecha creación hasta
                  </label>
                  <input
                    type="date"
                    value={filters.dateTo}
                    onChange={(e) => setFilters({...filters, dateTo: e.target.value})}
                    className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div className="flex items-end">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.includeDeleted}
                      onChange={(e) => setFilters({...filters, includeDeleted: e.target.checked})}
                      className="rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-2 text-sm text-secondary-700">
                      Incluir eliminados
                    </span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Botones de acción */}
          <div className="flex justify-end space-x-4 mt-4">
            <button
              onClick={clearFilters}
              className="px-4 py-2 border border-secondary-300 text-secondary-700 rounded-lg hover:bg-secondary-50 transition-colors duration-200"
            >
              Limpiar filtros
            </button>
            <button className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200 flex items-center">
              <SearchIcon className="mr-2" size={16} />
              Buscar
            </button>
          </div>
        </div>

        {/* Tabla de usuarios */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-4 bg-secondary-50 border-b border-secondary-200">
            <h2 className="text-lg font-semibold text-secondary-900">
              Usuarios ({filteredUsers.length})
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-secondary-200">
              <thead className="bg-secondary-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Fecha Creación
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Usuario
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Tipo Perfil
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Eliminado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-secondary-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className={`hover:bg-secondary-50 transition-colors duration-200 ${user.isDeleted ? 'opacity-60' : ''}`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-secondary-900">{user.createdDate}</div>
                      <div className="text-sm text-secondary-500">{user.createdTime}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-secondary-900">{user.name}</div>
                        <div className="text-sm text-secondary-500">{user.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(user.type)}`}>
                        {user.type.charAt(0).toUpperCase() + user.type.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.status)}`}>
                        {getStatusText(user.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-medium ${user.isDeleted ? 'text-red-600' : 'text-green-600'}`}>
                        {user.isDeleted ? 'Sí' : 'No'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => viewUserDetail(user.id)}
                        className="text-primary-600 hover:text-primary-900"
                      >
                        Ver
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Empty State */}
        {filteredUsers.length === 0 && (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center mt-6">
            <UsersIcon className="text-secondary-400 mx-auto mb-4" size={64} />
            <h3 className="text-lg font-medium text-secondary-900 mb-2">
              No se encontraron usuarios
            </h3>
            <p className="text-secondary-500">
              Intenta ajustar tus criterios de búsqueda
            </p>
          </div>
        )}
      </main>
    </div>
  )
}

export default AdminUsers