import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeftIcon, UsersIcon, CheckIcon, XIcon } from '../components/Icons'
import { adminService, AdminUserData, UpdateUserStatusRequest } from '../services/adminService'
import { useToast } from '../hooks/useToast'
import { ToastContainer } from '../components/ToastContainer'

const AdminUserDetail = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const { toasts, removeToast, showError, showSuccess } = useToast()
  
  const [user, setUser] = useState<AdminUserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [observationText, setObservationText] = useState('')

  useEffect(() => {
    if (id) {
      loadUserData()
    }
  }, [id])

  const loadUserData = async () => {
    try {
      setIsLoading(true)
      const userData = await adminService.getUserById(parseInt(id!))
      setUser(userData)
    } catch (error) {
      console.error('Error loading user:', error)
      showError('Error al cargar los datos del usuario')
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'activo':
        return 'bg-green-100 text-green-800'
      case 'pendientedevalidacion':
      case 'pendiente_validacion':
        return 'bg-yellow-100 text-yellow-800'
      case 'pendientedeinformacion':
      case 'pendiente_informacion':
        return 'bg-blue-100 text-blue-800'
      case 'observado':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case 'activo':
        return 'Activo'
      case 'pendientedevalidacion':
      case 'pendiente_validacion':
        return 'Pendiente de Validación'
      case 'pendientedeinformacion':
      case 'pendiente_informacion':
        return 'Pendiente de Información'
      case 'observado':
        return 'Observado'
      default:
        return status
    }
  }

  const handleConfirmUser = async () => {
    if (!user) return

    try {
      const statusRequest: UpdateUserStatusRequest = {
        status: 'Activo'
      }
      await adminService.updateUserStatus(user.id, statusRequest)
      showSuccess('Usuario confirmado exitosamente')
      setShowConfirmModal(false)
      await loadUserData()
    } catch (error) {
      console.error('Error confirming user:', error)
      showError('Error al confirmar el usuario')
    }
  }

  const handleRejectUser = async () => {
    if (!user || !observationText.trim()) {
      showError('Debe ingresar una observación')
      return
    }

    try {
      const statusRequest: UpdateUserStatusRequest = {
        status: 'Observado',
        observation: observationText
      }
      await adminService.updateUserStatus(user.id, statusRequest)
      showSuccess('Usuario rechazado exitosamente')
      setShowRejectModal(false)
      setObservationText('')
      await loadUserData()
    } catch (error) {
      console.error('Error rejecting user:', error)
      showError('Error al rechazar el usuario')
    }
  }

  const openConfirmModal = () => {
    setShowConfirmModal(true)
  }

  const openRejectModal = () => {
    setShowRejectModal(true)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-secondary-600">Cargando datos del usuario...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <UsersIcon size={64} className="text-secondary-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-secondary-900 mb-2">Usuario no encontrado</h2>
          <button
            onClick={() => navigate('/admin-users')}
            className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200"
          >
            Volver al listado
          </button>
        </div>
      </div>
    )
  }

  const isPendingValidation = user.status.toLowerCase() === 'pendientedevalidacion' || user.status.toLowerCase() === 'pendiente_validacion'
  
  const getUserTypeString = () => {
    if (typeof user.type === 'string') return user.type
    switch(user.type) {
      case 1: return 'Vendedor'
      case 2: return 'Concesionario'
      case 3: return 'Administrador'
      case 4: return 'Inversor'
      default: return 'Desconocido'
    }
  }
  
  const userTypeString = getUserTypeString()
  const isConcesionario = userTypeString === 'Concesionario'

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
                  <p className="text-sm text-secondary-600">{user.email}</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                {getStatusText(user.status)}
              </span>
              {user.isDeleted && (
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  Eliminado
                </span>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Columna Izquierda - Información del Usuario */}
          <div className="lg:col-span-2 space-y-6">
            {/* Información Básica */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-lg font-semibold text-secondary-900 mb-4">Información Básica</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">Email</label>
                  <p className="text-secondary-900">{user.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">Tipo de Usuario</label>
                  <p className="text-secondary-900">{userTypeString}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">Fecha de Registro</label>
                  <p className="text-secondary-900">{new Date(user.createdAt).toLocaleDateString('es-ES')}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">Email Verificado</label>
                  <p className={`text-sm font-medium ${user.isEmailVerified ? 'text-green-600' : 'text-red-600'}`}>
                    {user.isEmailVerified ? 'Sí' : 'No'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">Última Actualización</label>
                  <p className="text-secondary-900">{new Date(user.updatedAt).toLocaleDateString('es-ES')}</p>
                </div>
              </div>

              <hr className="my-4" />
              <h3 className="text-md font-semibold text-secondary-900 mb-3">Datos Personales</h3>
              
              {user.userProfile ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {isConcesionario ? (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-1">CUIT</label>
                        <p className="text-secondary-900">{user.userProfile.cuit || 'No especificado'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-1">Razón Social</label>
                        <p className="text-secondary-900">{user.userProfile.businessName || 'No especificado'}</p>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-secondary-700 mb-1">Representante Legal</label>
                        <p className="text-secondary-900">{user.userProfile.legalRepresentative || 'No especificado'}</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-1">Nombre</label>
                        <p className="text-secondary-900">{user.userProfile.firstName || 'No especificado'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-1">Apellido</label>
                        <p className="text-secondary-900">{user.userProfile.lastName || 'No especificado'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-1">DNI</label>
                        <p className="text-secondary-900">{user.userProfile.documentNumber || 'No especificado'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-1">Teléfono</label>
                        <p className="text-secondary-900">{user.userProfile.phone || 'No especificado'}</p>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-800">
                    ⚠️ El usuario aún no ha completado su perfil personal.
                  </p>
                </div>
              )}
            </div>

            {/* Domicilio */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-lg font-semibold text-secondary-900 mb-4">Dirección</h2>
              {user.userProfile?.address ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1">Calle</label>
                    <p className="text-secondary-900">{user.userProfile.address.street}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1">Altura</label>
                    <p className="text-secondary-900">{user.userProfile.address.number}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1">Ciudad</label>
                    <p className="text-secondary-900">{user.userProfile.address.city}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1">Código Postal</label>
                    <p className="text-secondary-900">{user.userProfile.address.postalCode || 'No especificado'}</p>
                  </div>
                  {user.userProfile.address.floor && (
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-1">Piso</label>
                      <p className="text-secondary-900">{user.userProfile.address.floor}</p>
                    </div>
                  )}
                  {user.userProfile.address.apartment && (
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-1">Departamento</label>
                      <p className="text-secondary-900">{user.userProfile.address.apartment}</p>
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1">Provincia</label>
                    <p className="text-secondary-900">{user.userProfile.address.province}</p>
                  </div>
                </div>
              ) : (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-800">
                    ⚠️ El usuario aún no ha registrado su dirección.
                  </p>
                </div>
              )}
            </div>

            {/* Documentación */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-lg font-semibold text-secondary-900 mb-4">Documentación</h2>
              {user.userProfile && user.userProfile.documents.length > 0 ? (
                <div className="space-y-4">
                  {user.userProfile.documents.map((doc) => (
                    <div key={doc.id} className="border border-secondary-200 rounded-lg p-4 hover:bg-secondary-50 transition-colors duration-200">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0">
                            <svg className="w-10 h-10 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div>
                            <h3 className="text-sm font-semibold text-secondary-900">{doc.documentType}</h3>
                            <p className="text-sm text-secondary-600 mt-1">{doc.fileName}</p>
                            <p className="text-xs text-secondary-500 mt-1">
                              {(doc.fileSize / 1024).toFixed(2)} KB • Subido el {new Date(doc.uploadedAt).toLocaleString('es-ES')}
                            </p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={async () => {
                              try {
                                await adminService.downloadUserDocument(user.id, doc.id, doc.fileName);
                              } catch (error) {
                                console.error('Error descargando documento:', error);
                                showError('Error al descargar el documento');
                              }
                            }}
                            className="text-primary-600 hover:text-primary-800 text-sm font-medium hover:underline"
                          >
                            Descargar
                          </button>
                        </div>
                      </div>
                      {doc.isActive ? (
                        <span className="inline-block mt-2 px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">
                          ✓ Subido
                        </span>
                      ) : (
                        <span className="inline-block mt-2 px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded">
                          Inactivo
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-800">
                    ⚠️ El usuario aún no ha subido ningún documento.
                  </p>
                </div>
              )}
            </div>

            {/* Observación Actual */}
            {user.observationComment && (
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
                <div className="flex">
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">Observación Actual</h3>
                    <div className="mt-2 text-sm text-yellow-700">
                      <p>{user.observationComment}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Columna Derecha - Historial y Acciones */}
          <div className="space-y-6">
            {/* Historial de Observaciones */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-lg font-semibold text-secondary-900 mb-4">Historial de Observaciones</h2>
              
              <div className="space-y-4">
                {user.observations && user.observations.length > 0 ? (
                  user.observations.map((obs) => (
                    <div key={obs.id} className="border-l-2 border-secondary-300 pl-4 pb-4">
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-xs text-secondary-500">
                          {new Date(obs.createdAt).toLocaleString('es-ES')}
                        </span>
                      </div>
                      <p className="text-sm text-secondary-700 mb-1">{obs.observation}</p>
                      <span className="text-xs text-secondary-500">Por: {obs.authorEmail}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-secondary-500">No hay observaciones registradas</p>
                )}
              </div>
            </div>

            {/* Acciones del Administrador */}
            {!user.isDeleted && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-lg font-semibold text-secondary-900 mb-4">Acciones</h2>
                
                <div className="space-y-3">
                  {isPendingValidation && (
                    <>
                      <button
                        onClick={openConfirmModal}
                        className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                      >
                        <CheckIcon className="mr-2" size={18} />
                        Confirmar Usuario
                      </button>
                      
                      <button
                        onClick={openRejectModal}
                        className="w-full flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
                      >
                        <XIcon className="mr-2" size={18} />
                        Rechazar
                      </button>
                    </>
                  )}
                  
                  <button
                    onClick={() => {
                      if (confirm(`¿Está seguro que desea eliminar el usuario ${user.email}?`)) {
                        adminService.deleteUser(user.id)
                          .then(() => {
                            showSuccess('Usuario eliminado exitosamente')
                            navigate('/admin-users')
                          })
                          .catch(() => showError('Error al eliminar el usuario'))
                      }
                    }}
                    className="w-full flex items-center justify-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
                  >
                    <XIcon className="mr-2" size={18} />
                    Eliminar Usuario
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modal de Confirmación */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
            <h3 className="text-lg font-semibold text-secondary-900 mb-4">
              Confirmar Usuario
            </h3>
            <p className="text-secondary-600 mb-6">
              ¿Está seguro que desea confirmar al usuario <span className="font-semibold">{user.email}</span>? 
              El usuario quedará en estado "Activo".
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 border border-secondary-300 text-secondary-700 rounded-lg hover:bg-secondary-50 transition-colors duration-200"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmUser}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Rechazo */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
            <h3 className="text-lg font-semibold text-secondary-900 mb-4">
              Rechazar Usuario
            </h3>
            <p className="text-secondary-600 mb-4">
              Por favor, ingrese el motivo del rechazo:
            </p>
            <textarea
              value={observationText}
              onChange={(e) => setObservationText(e.target.value)}
              className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent mb-4"
              rows={4}
              placeholder="Descripción del motivo..."
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowRejectModal(false)
                  setObservationText('')
                }}
                className="px-4 py-2 border border-secondary-300 text-secondary-700 rounded-lg hover:bg-secondary-50 transition-colors duration-200"
              >
                Cancelar
              </button>
              <button
                onClick={handleRejectUser}
                disabled={!observationText.trim()}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Rechazar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onRemoveToast={removeToast} />
    </div>
  )
}

export default AdminUserDetail
