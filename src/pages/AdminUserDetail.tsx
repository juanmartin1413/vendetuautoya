import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeftIcon, UsersIcon, CheckIcon, XIcon, DownloadIcon } from '../components/Icons'

// Tipos
type UserStatus = 'activo' | 'pendiente_informacion' | 'pendiente_validacion' | 'observado'
type UserType = 'vendedor' | 'concesionario'

interface ObservationHistory {
  id: number
  date: string
  time: string
  observation: string
  author: string // 'admin' | 'user'
  authorEmail: string
}

interface UserDetailData {
  id: number
  name: string
  email: string
  type: UserType
  status: UserStatus
  isDeleted: boolean
  createdDate: string
  createdTime: string
  
  // Datos comunes
  phone?: string
  address?: {
    street: string
    number: string
    floor?: string
    apartment?: string
    city: string
    province: string
  }

  // Datos específicos de vendedor
  firstName?: string
  lastName?: string

  // Datos específicos de concesionario
  cuit?: string
  businessName?: string
  estatutoFile?: string
  afipFile?: string

  // Estado de documentación
  documentation?: {
    hasPersonalData: boolean
    hasDocuments: boolean
    hasProofOfAddress: boolean
  }

  observationComment?: string
  lastLogin?: string
  totalAuctions?: number
  activeAuctions?: number
  observationHistory: ObservationHistory[]
}

const AdminUserDetail = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [user, setUser] = useState<UserDetailData | null>(null)
  const [showObservationModal, setShowObservationModal] = useState(false)
  const [observationText, setObservationText] = useState('')

  // Mock data - en producción vendría del backend
  useEffect(() => {
    if (id) {
      // Simular llamada a API
      const getUserData = (userId: string) => {
        switch (userId) {
          case '1':
            return {
              id: 1,
              name: 'Juan Pérez',
              email: 'juan.perez@email.com',
              type: 'vendedor' as UserType,
              status: 'activo' as UserStatus,
              isDeleted: false,
              createdDate: '2024-01-15',
              createdTime: '14:30',
              firstName: 'Juan',
              lastName: 'Pérez',
              phone: '+54 11 1234-5678',
              address: {
                street: 'Av. Corrientes',
                number: '1234',
                floor: '5',
                apartment: 'A',
                city: 'Buenos Aires',
                province: 'Buenos Aires'
              },
              documentation: {
                hasPersonalData: true,
                hasDocuments: true,
                hasProofOfAddress: true
              },
              lastLogin: '2024-03-20 10:30',
              totalAuctions: 5,
              activeAuctions: 2,
              observationHistory: []
            }

          case '2':
            return {
              id: 2,
              name: 'AutoPlaza SA',
              email: 'info@autoplaza.com',
              type: 'concesionario' as UserType,
              status: 'activo' as UserStatus,
              isDeleted: false,
              createdDate: '2024-02-20',
              createdTime: '09:15',
              cuit: '30-12345678-9',
              businessName: 'AutoPlaza SA',
              estatutoFile: 'estatuto_social.pdf',
              afipFile: 'constancia_afip.pdf',
              phone: '+54 11 5678-9012',
              address: {
                street: 'Av. Libertador',
                number: '5678',
                floor: '10',
                apartment: '',
                city: 'Buenos Aires',
                province: 'Buenos Aires'
              },
              documentation: {
                hasPersonalData: true,
                hasDocuments: true,
                hasProofOfAddress: true
              },
              lastLogin: '2024-03-19 16:45',
              totalAuctions: 15,
              activeAuctions: 8,
              observationHistory: []
            }

          case '3':
            return {
              id: 3,
              name: 'María González',
              email: 'maria.gonzalez@email.com',
              type: 'vendedor' as UserType,
              status: 'pendiente_informacion' as UserStatus,
              isDeleted: false,
              createdDate: '2024-03-10',
              createdTime: '16:45',
              firstName: 'María',
              lastName: 'González',
              phone: '+54 11 3456-7890',
              address: {
                street: 'San Martín',
                number: '890',
                floor: '',
                apartment: '',
                city: 'Córdoba',
                province: 'Córdoba'
              },
              documentation: {
                hasPersonalData: false,
                hasDocuments: false,
                hasProofOfAddress: false
              },
              lastLogin: '2024-03-18 14:20',
              totalAuctions: 0,
              activeAuctions: 0,
              observationHistory: []
            }

          case '4':
            return {
              id: 4,
              name: 'Carlos Auto Center',
              email: 'carlos@autocenter.com',
              type: 'concesionario' as UserType,
              status: 'pendiente_validacion' as UserStatus,
              isDeleted: false,
              createdDate: '2024-03-08',
              createdTime: '11:20',
              cuit: '30-87654321-0',
              businessName: 'Carlos Auto Center',
              estatutoFile: 'estatuto_social.pdf',
              afipFile: 'constancia_afip.pdf',
              phone: '+54 11 7890-1234',
              address: {
                street: 'Rivadavia',
                number: '2345',
                floor: '2',
                apartment: 'B',
                city: 'Rosario',
                province: 'Santa Fe'
              },
              documentation: {
                hasPersonalData: true,
                hasDocuments: true,
                hasProofOfAddress: true
              },
              lastLogin: '2024-03-15 09:30',
              totalAuctions: 3,
              activeAuctions: 1,
              observationHistory: [{
                id: 1,
                date: '2024-03-12',
                time: '09:15',
                observation: 'Documentación completada, pendiente de revisión administrativa',
                author: 'user',
                authorEmail: 'carlos@autocenter.com'
              }]
            }

          case '5':
            return {
              id: 5,
              name: 'Ana Rodríguez',
              email: 'ana.rodriguez@email.com',
              type: 'vendedor' as UserType,
              status: 'observado' as UserStatus,
              isDeleted: false,
              createdDate: '2024-03-12',
              createdTime: '13:10',
              firstName: 'Ana',
              lastName: 'Rodríguez',
              phone: '+54 11 2468-1357',
              address: {
                street: 'Belgrano',
                number: '1567',
                floor: '3',
                apartment: 'C',
                city: 'La Plata',
                province: 'Buenos Aires'
              },
              documentation: {
                hasPersonalData: true,
                hasDocuments: false,
                hasProofOfAddress: true
              },
              observationComment: 'Documentación de identificación no clara, por favor proporcionar imagen de mejor calidad',
              lastLogin: '2024-03-17 11:45',
              totalAuctions: 2,
              activeAuctions: 0,
              observationHistory: [
                {
                  id: 1,
                  date: '2024-03-13',
                  time: '16:45',
                  observation: 'Documentación de identificación no clara, por favor proporcionar imagen de mejor calidad',
                  author: 'admin',
                  authorEmail: 'administrador@vendetuautoya.com'
                },
                {
                  id: 2,
                  date: '2024-03-14',
                  time: '10:30',
                  observation: 'Se envió solicitud de nueva documentación por email',
                  author: 'admin',
                  authorEmail: 'administrador@vendetuautoya.com'
                }
              ]
            }

          case '6':
            return {
              id: 6,
              name: 'Luis Motors',
              email: 'luis@luismotors.com',
              type: 'concesionario' as UserType,
              status: 'activo' as UserStatus,
              isDeleted: true,
              createdDate: '2024-01-20',
              createdTime: '10:00',
              cuit: '30-11111111-1',
              businessName: 'Luis Motors',
              estatutoFile: 'estatuto_social.pdf',
              afipFile: 'constancia_afip.pdf',
              phone: '+54 11 1111-2222',
              address: {
                street: 'Mitre',
                number: '111',
                floor: '',
                apartment: '',
                city: 'Mendoza',
                province: 'Mendoza'
              },
              documentation: {
                hasPersonalData: true,
                hasDocuments: true,
                hasProofOfAddress: true
              },
              lastLogin: '2024-01-25 15:20',
              totalAuctions: 8,
              activeAuctions: 0,
              observationHistory: []
            }

          case '7':
            return {
              id: 7,
              name: 'Sofia López',
              email: 'sofia.lopez@email.com',
              type: 'vendedor' as UserType,
              status: 'pendiente_informacion' as UserStatus,
              isDeleted: false,
              createdDate: '2024-03-14',
              createdTime: '15:30',
              firstName: 'Sofia',
              lastName: 'López',
              phone: '+54 11 9999-8888',
              address: {
                street: 'Sarmiento',
                number: '777',
                floor: '1',
                apartment: 'A',
                city: 'Tucumán',
                province: 'Tucumán'
              },
              documentation: {
                hasPersonalData: true,
                hasDocuments: false,
                hasProofOfAddress: false
              },
              lastLogin: '2024-03-16 13:15',
              totalAuctions: 1,
              activeAuctions: 1,
              observationHistory: []
            }

          default:
            return null
        }
      }

      const mockUserDetail = getUserData(id)
      if (mockUserDetail) {
        setUser(mockUserDetail)
      }
    }
  }, [id])

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-secondary-600">Cargando información del usuario...</p>
        </div>
      </div>
    )
  }

  const getStatusColor = (status: UserStatus) => {
    switch (status) {
      case 'activo': return 'bg-green-100 text-green-800'
      case 'pendiente_informacion': return 'bg-yellow-100 text-yellow-800'
      case 'pendiente_validacion': return 'bg-blue-100 text-blue-800'
      case 'observado': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: UserStatus) => {
    switch (status) {
      case 'activo': return 'Activo'
      case 'pendiente_informacion': return 'Pendiente de información'
      case 'pendiente_validacion': return 'Pendiente de validación'
      case 'observado': return 'Observado'
      default: return status
    }
  }

  const handleApproveUser = () => {
    console.log('Aprobar usuario:', user.id)
    // TODO: Implementar lógica de aprobación
    const newObservation: ObservationHistory = {
      id: user.observationHistory.length + 1,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }),
      observation: 'Usuario aprobado por el administrador',
      author: 'admin',
      authorEmail: 'administrador@vendetuautoya.com'
    }
    setUser({ 
      ...user, 
      status: 'activo',
      observationHistory: [...user.observationHistory, newObservation]
    })
  }

  const handleRejectUser = () => {
    setShowObservationModal(true)
  }

  const handleSubmitObservation = () => {
    console.log('Observación enviada:', observationText)
    // TODO: Implementar lógica de observación
    const newObservation: ObservationHistory = {
      id: user.observationHistory.length + 1,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }),
      observation: observationText,
      author: 'admin',
      authorEmail: 'administrador@vendetuautoya.com'
    }
    setUser({ 
      ...user, 
      status: 'observado', 
      observationComment: observationText,
      observationHistory: [...user.observationHistory, newObservation]
    })
    setShowObservationModal(false)
    setObservationText('')
  }

  const handleDeleteUser = () => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este usuario? Esta acción aplicará una baja lógica.')) {
      console.log('Eliminar usuario:', user.id)
      // TODO: Implementar lógica de eliminación
      const newObservation: ObservationHistory = {
        id: user.observationHistory.length + 1,
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }),
        observation: 'Usuario eliminado del sistema (baja lógica)',
        author: 'admin',
        authorEmail: 'administrador@vendetuautoya.com'
      }
      setUser({ 
        ...user, 
        isDeleted: true,
        observationHistory: [...user.observationHistory, newObservation]
      })
    }
  }

  const handleDownloadFile = (fileName: string) => {
    console.log('Descargar archivo:', fileName)
    // TODO: Implementar descarga real del archivo
    alert(`Descargando archivo: ${fileName}`)
  }

  const getAuthorLabel = (_author: string, email: string) => {
    return email
  }

  const showApprovalButtons = user.type === 'concesionario' && user.status === 'pendiente_validacion'

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      {/* Header */}
      <header className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/admin-users')}
                className="text-secondary-600 hover:text-primary-600 transition-colors duration-200 mr-4"
              >
                <ArrowLeftIcon size={28} />
              </button>
              <div className="flex items-center">
                <UsersIcon className="text-primary-600 mr-3" size={32} />
                <div>
                  <h1 className="text-2xl font-bold text-secondary-900">
                    Detalle de Usuario
                  </h1>
                  <p className="text-sm text-secondary-600">
                    {user.type.charAt(0).toUpperCase() + user.type.slice(1)} - ID: {user.id}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Indicador del perfil */}
            <div className="flex items-center space-x-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(user.status)}`}>
                {getStatusText(user.status)}
              </span>
              {user.isDeleted && (
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                  Eliminado
                </span>
              )}
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 border border-orange-200">
                Vista Administrador
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Formulario Principal */}
          <div className="lg:col-span-3">
            {/* Formulario según tipo de usuario */}
            {user.type === 'vendedor' ? (
              // Formulario de Vendedor (réplica de MyData.tsx)
              <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                <h2 className="text-lg font-semibold text-secondary-900 mb-6">
                  Información Personal - Vendedor
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Nombre
                    </label>
                    <input
                      type="text"
                      value={user.firstName || ''}
                      readOnly
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg bg-gray-50 text-secondary-600 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Apellido
                    </label>
                    <input
                      type="text"
                      value={user.lastName || ''}
                      readOnly
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg bg-gray-50 text-secondary-600 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={user.email}
                      readOnly
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg bg-gray-50 text-secondary-600 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      value={user.phone || ''}
                      readOnly
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg bg-gray-50 text-secondary-600 cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Dirección */}
                <div className="mt-6">
                  <h3 className="text-md font-medium text-secondary-900 mb-4">Dirección</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Calle
                      </label>
                      <input
                        type="text"
                        value={user.address?.street || ''}
                        readOnly
                        className="w-full px-3 py-2 border border-secondary-300 rounded-lg bg-gray-50 text-secondary-600 cursor-not-allowed"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Número
                      </label>
                      <input
                        type="text"
                        value={user.address?.number || ''}
                        readOnly
                        className="w-full px-3 py-2 border border-secondary-300 rounded-lg bg-gray-50 text-secondary-600 cursor-not-allowed"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Piso (opcional)
                      </label>
                      <input
                        type="text"
                        value={user.address?.floor || ''}
                        readOnly
                        className="w-full px-3 py-2 border border-secondary-300 rounded-lg bg-gray-50 text-secondary-600 cursor-not-allowed"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Departamento (opcional)
                      </label>
                      <input
                        type="text"
                        value={user.address?.apartment || ''}
                        readOnly
                        className="w-full px-3 py-2 border border-secondary-300 rounded-lg bg-gray-50 text-secondary-600 cursor-not-allowed"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Provincia
                      </label>
                      <input
                        type="text"
                        value={user.address?.province || ''}
                        readOnly
                        className="w-full px-3 py-2 border border-secondary-300 rounded-lg bg-gray-50 text-secondary-600 cursor-not-allowed"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // Formulario de Concesionario (réplica de ConcesionarioMyData.tsx)
              <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                <h2 className="text-lg font-semibold text-secondary-900 mb-6">
                  Información Empresarial - Concesionario
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      CUIT
                    </label>
                    <input
                      type="text"
                      value={user.cuit || ''}
                      readOnly
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg bg-gray-50 text-secondary-600 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Razón Social
                    </label>
                    <input
                      type="text"
                      value={user.businessName || ''}
                      readOnly
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg bg-gray-50 text-secondary-600 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={user.email}
                      readOnly
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg bg-gray-50 text-secondary-600 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      value={user.phone || ''}
                      readOnly
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg bg-gray-50 text-secondary-600 cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Dirección */}
                <div className="mt-6">
                  <h3 className="text-md font-medium text-secondary-900 mb-4">Dirección</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Calle
                      </label>
                      <input
                        type="text"
                        value={user.address?.street || ''}
                        readOnly
                        className="w-full px-3 py-2 border border-secondary-300 rounded-lg bg-gray-50 text-secondary-600 cursor-not-allowed"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Número
                      </label>
                      <input
                        type="text"
                        value={user.address?.number || ''}
                        readOnly
                        className="w-full px-3 py-2 border border-secondary-300 rounded-lg bg-gray-50 text-secondary-600 cursor-not-allowed"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Piso (opcional)
                      </label>
                      <input
                        type="text"
                        value={user.address?.floor || ''}
                        readOnly
                        className="w-full px-3 py-2 border border-secondary-300 rounded-lg bg-gray-50 text-secondary-600 cursor-not-allowed"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Departamento (opcional)
                      </label>
                      <input
                        type="text"
                        value={user.address?.apartment || ''}
                        readOnly
                        className="w-full px-3 py-2 border border-secondary-300 rounded-lg bg-gray-50 text-secondary-600 cursor-not-allowed"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Provincia
                      </label>
                      <input
                        type="text"
                        value={user.address?.province || ''}
                        readOnly
                        className="w-full px-3 py-2 border border-secondary-300 rounded-lg bg-gray-50 text-secondary-600 cursor-not-allowed"
                      />
                    </div>
                  </div>
                </div>

                {/* Archivos adjuntos */}
                <div className="mt-6">
                  <h3 className="text-md font-medium text-secondary-900 mb-4">Documentos adjuntos</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Estatuto Social
                      </label>
                      {user.estatutoFile ? (
                        <div className="flex items-center justify-between p-3 border border-secondary-300 rounded-lg bg-gray-50">
                          <span className="text-sm text-secondary-600">{user.estatutoFile}</span>
                          <button
                            onClick={() => handleDownloadFile(user.estatutoFile!)}
                            className="text-primary-600 hover:text-primary-700 flex items-center"
                          >
                            <DownloadIcon size={16} className="mr-1" />
                            Descargar
                          </button>
                        </div>
                      ) : (
                        <div className="p-3 border border-secondary-300 rounded-lg bg-gray-50">
                          <span className="text-sm text-secondary-400">No se ha subido archivo</span>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Constancia AFIP
                      </label>
                      {user.afipFile ? (
                        <div className="flex items-center justify-between p-3 border border-secondary-300 rounded-lg bg-gray-50">
                          <span className="text-sm text-secondary-600">{user.afipFile}</span>
                          <button
                            onClick={() => handleDownloadFile(user.afipFile!)}
                            className="text-primary-600 hover:text-primary-700 flex items-center"
                          >
                            <DownloadIcon size={16} className="mr-1" />
                            Descargar
                          </button>
                        </div>
                      ) : (
                        <div className="p-3 border border-secondary-300 rounded-lg bg-gray-50">
                          <span className="text-sm text-secondary-400">No se ha subido archivo</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Historial de Observaciones */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-lg font-semibold text-secondary-900 mb-4">
                Historial de Observaciones
              </h2>
              {user.observationHistory.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-secondary-200">
                    <thead className="bg-secondary-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                          Fecha y Hora
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                          Observación
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                          Usuario
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-secondary-200">
                      {user.observationHistory.map((observation) => (
                        <tr key={observation.id} className="hover:bg-secondary-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-900">
                            {observation.date} {observation.time}
                          </td>
                          <td className="px-6 py-4 text-sm text-secondary-900 max-w-md">
                            {observation.observation}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-600">
                            {getAuthorLabel(observation.author, observation.authorEmail)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-secondary-500 text-center py-4">
                  Sin observaciones
                </p>
              )}
            </div>
          </div>

          {/* Panel de Acciones */}
          <div className="lg:col-span-1">
            {/* Información del usuario */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <h2 className="text-lg font-semibold text-secondary-900 mb-4">
                Información General
              </h2>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="font-medium text-secondary-700">Fecha de registro:</span>
                  <p className="text-secondary-900">{user.createdDate} a las {user.createdTime}</p>
                </div>
                <div>
                  <span className="font-medium text-secondary-700">Último acceso:</span>
                  <p className="text-secondary-900">{user.lastLogin || 'Nunca'}</p>
                </div>
                <div>
                  <span className="font-medium text-secondary-700">Total subastas:</span>
                  <p className="text-secondary-900">{user.totalAuctions}</p>
                </div>
                <div>
                  <span className="font-medium text-secondary-700">Subastas activas:</span>
                  <p className="text-secondary-900">{user.activeAuctions}</p>
                </div>
              </div>
            </div>

            {/* Acciones */}
            {!user.isDeleted && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-lg font-semibold text-secondary-900 mb-4">
                  Acciones
                </h2>
                <div className="space-y-3">
                  {showApprovalButtons && (
                    <>
                      <button
                        onClick={handleApproveUser}
                        className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                      >
                        <CheckIcon className="mr-2" size={16} />
                        Aprobar Usuario
                      </button>
                      <button
                        onClick={handleRejectUser}
                        className="w-full flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
                      >
                        <XIcon className="mr-2" size={16} />
                        Rechazar con Observación
                      </button>
                    </>
                  )}

                  <button
                    onClick={handleDeleteUser}
                    className="w-full flex items-center justify-center px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors duration-200"
                  >
                    <XIcon className="mr-2" size={16} />
                    Eliminar Usuario
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modal de Observación */}
      {showObservationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-secondary-900 mb-4">
              Rechazar con Observación
            </h3>
            <p className="text-sm text-secondary-600 mb-4">
              Describe las observaciones para que el usuario pueda corregir la información:
            </p>
            <textarea
              value={observationText}
              onChange={(e) => setObservationText(e.target.value)}
              placeholder="Ejemplo: La documentación de identificación no es clara, por favor proporcionar imágenes de mejor calidad..."
              className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent h-32 resize-none"
            />
            <div className="flex justify-end space-x-3 mt-4">
              <button
                onClick={() => {
                  setShowObservationModal(false)
                  setObservationText('')
                }}
                className="px-4 py-2 border border-secondary-300 text-secondary-700 rounded-lg hover:bg-secondary-50 transition-colors duration-200"
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmitObservation}
                disabled={!observationText.trim()}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                Rechazar Usuario
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminUserDetail