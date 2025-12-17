import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeftIcon, UsersIcon, SearchIcon } from '../components/Icons'
import { adminService } from '../services/adminService'
import { ToastContainer } from '../components/ToastContainer'
import { useToast } from '../hooks/useToast'

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
  const { toasts, removeToast, showError, showSuccess } = useToast()
  
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
  
  // Estado para usuarios y carga
  const [users, setUsers] = useState<UserData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  // Estado para paginación
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 10,
    totalCount: 0,
    totalPages: 0
  })

  // Estado para modal de confirmación de eliminación
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    show: boolean
    userId: number | null
    userEmail: string
  }>({
    show: false,
    userId: null,
    userEmail: ''
  })

  // Cargar usuarios al montar el componente
  useEffect(() => {
    loadUsers()
  }, [pagination.currentPage, pagination.pageSize])

  const loadUsers = async () => {
    try {
      setIsLoading(true)
      
      // Preparar request con filtros y paginación
      const filterRequest = {
        email: filters.email || undefined,
        userType: filters.profileType !== 'all' ? mapUserTypeToNumber(filters.profileType) : undefined,
        status: filters.status !== 'all' ? mapStatusToNumber(filters.status) : undefined,
        dateFrom: filters.dateFrom || undefined,
        dateTo: filters.dateTo || undefined,
        includeDeleted: filters.includeDeleted,
        page: pagination.currentPage,
        pageSize: pagination.pageSize,
        sortBy: 'CreatedAt',
        sortOrder: 'desc'
      }
      
      const response = await adminService.getUsersWithFilters(filterRequest)
      
      // Transformar los datos del backend al formato del componente
      const transformedUsers: UserData[] = response.items.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        type: mapUserType(user.type),
        status: mapStatus(user.status),
        isDeleted: user.isDeleted,
        createdDate: new Date(user.createdAt).toISOString().split('T')[0],
        createdTime: new Date(user.createdAt).toLocaleTimeString('es-ES', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        observationComment: user.observationComment
      }))
      
      setUsers(transformedUsers)
      setPagination(prev => ({
        ...prev,
        totalCount: response.totalCount,
        totalPages: response.totalPages
      }))
    } catch (error) {
      console.error('Error loading users:', error)
      showError('Error al cargar los usuarios')
    } finally {
      setIsLoading(false)
    }
  }

  // Función para mapear tipos de usuario del backend al frontend
  const mapUserType = (backendType: any): UserType => {
    // Manejar si viene como número o como string
    if (typeof backendType === 'number') {
      switch (backendType) {
        case 1: return 'vendedor'
        case 2: return 'concesionario'
        default: return 'vendedor'
      }
    }
    
    // Si es string
    if (typeof backendType === 'string') {
      const normalized = backendType.toLowerCase()
      if (normalized === 'vendedor') return 'vendedor'
      if (normalized === 'concesionario') return 'concesionario'
    }
    
    return 'vendedor' // Default
  }

  // Función para mapear tipos de usuario del frontend al número del backend
  const mapUserTypeToNumber = (frontendType: string): number => {
    switch (frontendType) {
      case 'vendedor': return 1
      case 'concesionario': return 2
      default: return 0
    }
  }

  // Función para mapear status del frontend al número del backend
  const mapStatusToNumber = (frontendStatus: string): number => {
    switch (frontendStatus) {
      case 'activo': return 1
      case 'pendiente_validacion': return 2
      case 'pendiente_informacion': return 3
      case 'observado': return 4
      default: return 1
    }
  }

  // Función para mapear status del backend (enum) al frontend
  const mapStatus = (backendStatus: any): UserStatus => {
    // Manejar si viene como número o como string del enum
    if (typeof backendStatus === 'number') {
      switch (backendStatus) {
        case 1: return 'activo'
        case 2: return 'pendiente_validacion'
        case 3: return 'pendiente_informacion'
        case 4: return 'observado'
        default: return 'activo'
      }
    }
    
    // Si es string del enum
    if (typeof backendStatus === 'string') {
      const normalized = backendStatus.toLowerCase()
      if (normalized === 'activo') return 'activo'
      if (normalized === 'pendientedevalidacion' || normalized === 'pendiente_validacion') return 'pendiente_validacion'
      if (normalized === 'pendientedeinformacion' || normalized === 'pendiente_informacion') return 'pendiente_informacion'
      if (normalized === 'observado') return 'observado'
    }
    
    return 'activo' // Default
  }

  // Los usuarios ya vienen filtrados del backend
  const filteredUsers = users

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
    setPagination(prev => ({ ...prev, currentPage: 1 }))
  }

  // Función para cambiar de página
  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, currentPage: newPage }))
  }

  // Función para buscar (recargar datos)
  const handleSearch = () => {
    setPagination(prev => ({ ...prev, currentPage: 1 }))
    loadUsers()
  }

  // Función para ver detalle del usuario
  const viewUserDetail = (userId: number) => {
    navigate(`/admin-user-detail/${userId}`)
  }

  // Función para abrir modal de confirmación de eliminación
  const openDeleteConfirmation = (userId: number, userEmail: string) => {
    setDeleteConfirmation({
      show: true,
      userId,
      userEmail
    })
  }

  // Función para cancelar eliminación
  const cancelDelete = () => {
    setDeleteConfirmation({
      show: false,
      userId: null,
      userEmail: ''
    })
  }

  // Función para confirmar eliminación
  const confirmDelete = async () => {
    if (!deleteConfirmation.userId) return

    try {
      await adminService.deleteUser(deleteConfirmation.userId)
      
      // Cerrar modal
      cancelDelete()
      
      // Recargar usuarios
      await loadUsers()
      
      // Mostrar mensaje de éxito
      showSuccess('Usuario eliminado exitosamente')
    } catch (error) {
      console.error('Error deleting user:', error)
      showError('Error al eliminar el usuario')
    }
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
        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
              <p className="mt-4 text-secondary-600">Cargando usuarios...</p>
            </div>
          </div>
        )}
        
        {!isLoading && (
          <>
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
            <button 
              onClick={handleSearch}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200 flex items-center"
            >
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
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => viewUserDetail(user.id)}
                          className="text-primary-600 hover:text-primary-900 transition-colors duration-200"
                        >
                          Ver
                        </button>
                        {!user.isDeleted && (
                          <button
                            onClick={() => openDeleteConfirmation(user.id, user.email)}
                            className="text-red-600 hover:text-red-900 transition-colors duration-200"
                          >
                            Eliminar
                          </button>
                        )}
                      </div>
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

        {/* Paginación */}
        {filteredUsers.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-4 mt-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-secondary-600">
                Mostrando {((pagination.currentPage - 1) * pagination.pageSize) + 1} - {Math.min(pagination.currentPage * pagination.pageSize, pagination.totalCount)} de {pagination.totalCount} usuarios
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1}
                  className={`px-3 py-1 rounded-lg ${
                    pagination.currentPage === 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-primary-100 text-primary-700 hover:bg-primary-200'
                  }`}
                >
                  Anterior
                </button>
                
                {/* Páginas */}
                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                  let pageNumber
                  if (pagination.totalPages <= 5) {
                    pageNumber = i + 1
                  } else if (pagination.currentPage <= 3) {
                    pageNumber = i + 1
                  } else if (pagination.currentPage >= pagination.totalPages - 2) {
                    pageNumber = pagination.totalPages - 4 + i
                  } else {
                    pageNumber = pagination.currentPage - 2 + i
                  }
                  
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => handlePageChange(pageNumber)}
                      className={`px-3 py-1 rounded-lg ${
                        pagination.currentPage === pageNumber
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {pageNumber}
                    </button>
                  )
                })}
                
                <button
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={pagination.currentPage === pagination.totalPages}
                  className={`px-3 py-1 rounded-lg ${
                    pagination.currentPage === pagination.totalPages
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-primary-100 text-primary-700 hover:bg-primary-200'
                  }`}
                >
                  Siguiente
                </button>
              </div>
            </div>
          </div>
        )}
        </>
        )}
      </main>

      {/* Modal de Confirmación de Eliminación */}
      {deleteConfirmation.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-secondary-900 mb-4">
                Confirmar Eliminación
              </h3>
              <p className="text-secondary-600 mb-6">
                ¿Está seguro que desea eliminar el usuario <span className="font-semibold">{deleteConfirmation.userEmail}</span>?
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={cancelDelete}
                  className="px-4 py-2 border border-secondary-300 text-secondary-700 rounded-lg hover:bg-secondary-50 transition-colors duration-200"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onRemoveToast={removeToast} />
    </div>
  )
}

export default AdminUsers