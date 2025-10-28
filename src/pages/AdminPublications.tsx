import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeftIcon, FileTextIcon, EyeIcon } from '../components/Icons'

// Tipos de estado de publicación
type PublicationStatus = 'pendiente_revision' | 'rechazada' | 'confirmada' | 'en_curso' | 'finalizada'

interface PublicationData {
  id: number
  createdDate: string
  createdTime: string
  userEmail: string
  brand: string
  model: string
  version: string
  year: number
  status: PublicationStatus
  observationComment?: string
  startDate?: string
  endDate?: string
  isDeleted: boolean
}

interface FilterState {
  dateFrom: string
  dateTo: string
  userEmail: string
  brand: string
  model: string
  version: string
  year: string
  status: string // 'all' + los estados
}

const AdminPublications = () => {
  const navigate = useNavigate()
  
  // Estado de filtros
  const [filters, setFilters] = useState<FilterState>({
    dateFrom: '',
    dateTo: '',
    userEmail: '',
    brand: '',
    model: '',
    version: '',
    year: '',
    status: 'all'
  })

  // Estado para mostrar/ocultar filtros avanzados
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)

  // Mock data de publicaciones
  const mockPublications: PublicationData[] = [
    {
      id: 1,
      createdDate: '2024-03-20',
      createdTime: '14:30',
      userEmail: 'juan.perez@email.com',
      brand: 'Volkswagen',
      model: 'Golf',
      version: 'GTI 2.0 5 ptas',
      year: 2019,
      status: 'en_curso',
      startDate: '2024-03-20',
      endDate: '2024-03-25',
      isDeleted: false
    },
    {
      id: 2,
      createdDate: '2024-03-19',
      createdTime: '10:15',
      userEmail: 'maria.gonzalez@email.com',
      brand: 'Peugeot',
      model: '208',
      version: '1.6 coupe',
      year: 2020,
      status: 'pendiente_revision',
      isDeleted: false
    },
    {
      id: 3,
      createdDate: '2024-03-18',
      createdTime: '16:45',
      userEmail: 'carlos@autocenter.com',
      brand: 'BMW',
      model: '220i',
      version: '2.0 5 ptas',
      year: 2018,
      status: 'rechazada',
      observationComment: 'Documentación no legible, subir documentos con mejor calidad de imagen.',
      isDeleted: false
    },
    {
      id: 4,
      createdDate: '2024-03-17',
      createdTime: '11:20',
      userEmail: 'info@autoplaza.com',
      brand: 'Fiat',
      model: '500',
      version: 'Abarth 1.6 coupe',
      year: 2021,
      status: 'confirmada',
      startDate: '2024-03-25',
      endDate: '2024-03-30',
      isDeleted: false
    },
    {
      id: 5,
      createdDate: '2024-03-16',
      createdTime: '09:30',
      userEmail: 'ana.rodriguez@email.com',
      brand: 'Audi',
      model: 'A1',
      version: '1.6 coupe',
      year: 2019,
      status: 'finalizada',
      startDate: '2024-03-10',
      endDate: '2024-03-15',
      isDeleted: false
    }
  ]

  // Opciones para los selectores (mismo formato que módulo Buscar)
  const brands = [
    'Audi', 'BMW', 'Fiat', 'Ford', 'Peugeot', 'Volkswagen'
  ]

  const modelsByBrand: { [key: string]: string[] } = {
    'Audi': ['A1'],
    'BMW': ['220i'],
    'Fiat': ['500'],
    'Peugeot': ['208'],
    'Volkswagen': ['Golf']
  }

  const versionsByModel: { [key: string]: string[] } = {
    'A1': ['1.6 coupe'],
    '220i': ['2.0 5 ptas'],
    '500': ['Abarth 1.6 coupe'],
    '208': ['1.6 coupe'],
    'Golf': ['GTI 2.0 5 ptas']
  }

  const years = Array.from({ length: 15 }, (_, i) => 2024 - i)

  // Función para filtrar publicaciones
  const getFilteredPublications = () => {
    return mockPublications.filter(publication => {
      // Excluir eliminadas y finalizadas por defecto (a menos que se especifique en filtro)
      if (filters.status === 'all' && (publication.isDeleted || publication.status === 'finalizada')) {
        return false
      }

      // Filtro por email de usuario
      if (filters.userEmail && !publication.userEmail.toLowerCase().includes(filters.userEmail.toLowerCase())) {
        return false
      }

      // Filtro por marca
      if (filters.brand && publication.brand !== filters.brand) {
        return false
      }

      // Filtro por modelo
      if (filters.model && publication.model !== filters.model) {
        return false
      }

      // Filtro por versión
      if (filters.version && publication.version !== filters.version) {
        return false
      }

      // Filtro por año
      if (filters.year && publication.year.toString() !== filters.year) {
        return false
      }

      // Filtro por estado
      if (filters.status !== 'all' && publication.status !== filters.status) {
        return false
      }

      // Filtro por fecha desde
      if (filters.dateFrom) {
        const publicationDateTime = new Date(`${publication.createdDate}T${publication.createdTime}`)
        const filterDateTime = new Date(filters.dateFrom)
        if (publicationDateTime < filterDateTime) {
          return false
        }
      }

      // Filtro por fecha hasta
      if (filters.dateTo) {
        const publicationDateTime = new Date(`${publication.createdDate}T${publication.createdTime}`)
        const filterDateTime = new Date(filters.dateTo)
        if (publicationDateTime > filterDateTime) {
          return false
        }
      }

      return true
    }).sort((a, b) => {
      // Ordenar por fecha de creación decreciente
      const dateA = new Date(`${a.createdDate}T${a.createdTime}`)
      const dateB = new Date(`${b.createdDate}T${b.createdTime}`)
      return dateB.getTime() - dateA.getTime()
    })
  }

  const filteredPublications = getFilteredPublications()

  const getStatusColor = (status: PublicationStatus) => {
    switch (status) {
      case 'pendiente_revision': return 'bg-yellow-100 text-yellow-800'
      case 'rechazada': return 'bg-red-100 text-red-800'
      case 'confirmada': return 'bg-blue-100 text-blue-800'
      case 'en_curso': return 'bg-green-100 text-green-800'
      case 'finalizada': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: PublicationStatus) => {
    switch (status) {
      case 'pendiente_revision': return 'Pendiente de revisión'
      case 'rechazada': return 'Rechazada'
      case 'confirmada': return 'Confirmada'
      case 'en_curso': return 'En curso'
      case 'finalizada': return 'Finalizada'
      default: return status
    }
  }

  const resetFilters = () => {
    setFilters({
      dateFrom: '',
      dateTo: '',
      userEmail: '',
      brand: '',
      model: '',
      version: '',
      year: '',
      status: 'all'
    })
  }

  const handleFilterChange = (field: keyof FilterState, value: string) => {
    setFilters(prev => {
      const newFilters = { ...prev, [field]: value }
      
      // Limpiar campos dependientes cuando cambie la marca o modelo
      if (field === 'brand') {
        newFilters.model = ''
        newFilters.version = ''
      } else if (field === 'model') {
        newFilters.version = ''
      }
      
      return newFilters
    })
  }

  const handleViewPublication = (id: number) => {
    navigate(`/admin-publication-detail/${id}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow"
            >
              <ArrowLeftIcon className="w-5 h-5 text-secondary-600" />
            </button>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary-100">
                <FileTextIcon className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-secondary-900">Administración de Publicaciones</h1>
                <p className="text-secondary-600">Gestiona todas las publicaciones del sistema</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-lg shadow-sm border border-secondary-200 mb-6">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-secondary-900">Filtros de búsqueda</h2>
              <button
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className="text-primary-600 hover:text-primary-700 font-medium transition-colors"
              >
                {showAdvancedFilters ? 'Ocultar filtros avanzados' : 'Mostrar filtros avanzados'}
              </button>
            </div>

            {/* Filtros básicos */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Email de usuario
                </label>
                <input
                  type="email"
                  value={filters.userEmail}
                  onChange={(e) => handleFilterChange('userEmail', e.target.value)}
                  placeholder="usuario@email.com"
                  className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Estado
                </label>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="all">Todos los estados</option>
                  <option value="pendiente_revision">Pendiente de revisión</option>
                  <option value="rechazada">Rechazada</option>
                  <option value="confirmada">Confirmada</option>
                  <option value="en_curso">En curso</option>
                  <option value="finalizada">Finalizada</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Fecha desde
                </label>
                <input
                  type="datetime-local"
                  value={filters.dateFrom}
                  onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                  className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Fecha hasta
                </label>
                <input
                  type="datetime-local"
                  value={filters.dateTo}
                  onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                  className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>

            {/* Filtros avanzados */}
            {showAdvancedFilters && (
              <div className="border-t border-secondary-200 pt-4">
                <h3 className="text-md font-medium text-secondary-900 mb-3">Información del vehículo</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Marca
                    </label>
                    <select
                      value={filters.brand}
                      onChange={(e) => handleFilterChange('brand', e.target.value)}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="">Todas las marcas</option>
                      {brands.map(brand => (
                        <option key={brand} value={brand}>{brand}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Modelo
                    </label>
                    <select
                      value={filters.model}
                      onChange={(e) => handleFilterChange('model', e.target.value)}
                      disabled={!filters.brand}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-secondary-50"
                    >
                      <option value="">Todos los modelos</option>
                      {filters.brand && modelsByBrand[filters.brand]?.map(model => (
                        <option key={model} value={model}>{model}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Versión
                    </label>
                    <select
                      value={filters.version}
                      onChange={(e) => handleFilterChange('version', e.target.value)}
                      disabled={!filters.model}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-secondary-50"
                    >
                      <option value="">Todas las versiones</option>
                      {filters.model && versionsByModel[filters.model]?.map(version => (
                        <option key={version} value={version}>{version}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Año
                    </label>
                    <select
                      value={filters.year}
                      onChange={(e) => handleFilterChange('year', e.target.value)}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="">Todos los años</option>
                      {years.map(year => (
                        <option key={year} value={year.toString()}>{year}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Botones de acción */}
            <div className="flex justify-between items-center mt-4">
              <p className="text-sm text-secondary-600">
                Mostrando {filteredPublications.length} publicaciones
              </p>
              <button
                onClick={resetFilters}
                className="px-4 py-2 text-secondary-600 hover:text-secondary-800 font-medium transition-colors"
              >
                Limpiar filtros
              </button>
            </div>
          </div>
        </div>

        {/* Tabla de publicaciones */}
        <div className="bg-white rounded-lg shadow-sm border border-secondary-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-secondary-200">
              <thead className="bg-secondary-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Fecha creación
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Usuario
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Marca
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Modelo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Versión
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Año
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-secondary-200">
                {filteredPublications.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-secondary-500">
                      <FileTextIcon className="w-12 h-12 mx-auto mb-4 text-secondary-300" />
                      <p className="text-lg font-medium">No se encontraron publicaciones</p>
                      <p className="text-sm">Intenta ajustar los filtros de búsqueda</p>
                    </td>
                  </tr>
                ) : (
                  filteredPublications.map((publication) => (
                    <tr key={publication.id} className="hover:bg-secondary-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-900">
                        <div>
                          <div className="font-medium">{publication.createdDate}</div>
                          <div className="text-secondary-500">{publication.createdTime}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-900">
                        {publication.userEmail}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-900">
                        {publication.brand}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-900">
                        {publication.model}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-900">
                        {publication.version}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-900">
                        {publication.year}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(publication.status)}`}>
                          {getStatusText(publication.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleViewPublication(publication.id)}
                          className="flex items-center gap-1 text-primary-600 hover:text-primary-900 transition-colors"
                        >
                          <EyeIcon className="w-4 h-4" />
                          Ver
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminPublications