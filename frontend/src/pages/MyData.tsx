import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { ArrowLeftIcon } from '../components/Icons'
import ProgressIndicator from '../components/ProgressIndicator'
import DocumentUpload from '../components/DocumentUpload'
import { ToastContainer } from '../components/ToastContainer'
import { ConfirmModal } from '../components/ConfirmModal'
import { userProfileService } from '../services/userProfileService'
import { UserProfile, UpdateUserProfileRequest, CompletionStatus, DocumentType } from '../types/userProfile'
import { useToast } from '../hooks/useToast'

interface UserData {
  firstName: string
  lastName: string
  phone: string
  documentNumber: string
  address: {
    street: string
    number: string
    floor: string
    apartment: string
    city: string
    province: string
    postalCode: string
  }
}

const MyData = () => {
  const navigate = useNavigate()
  const { user } = useAuth()

  // Si es concesionario, navegar al componente específico
  useEffect(() => {
    if (user?.type === 'Concesionario') {
      navigate('/concesionario-my-data')
    }
  }, [user, navigate])

  // No renderizar nada si es concesionario (se está redirigiendo)
  if (user?.type === 'Concesionario') {
    return null
  }

  const [userData, setUserData] = useState<UserData>({
    firstName: '',
    lastName: '',
    phone: '',
    documentNumber: '',
    address: {
      street: '',
      number: '',
      floor: '',
      apartment: '',
      city: '',
      province: '',
      postalCode: ''
    }
  })

  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [completionStatus, setCompletionStatus] = useState<CompletionStatus | null>(null)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingInitial, setIsLoadingInitial] = useState(true)
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean
    title: string
    message: string
    onConfirm: () => void
  }>({ isOpen: false, title: '', message: '', onConfirm: () => {} })

  // Toast notifications
  const { toasts, removeToast, showSuccess, showError, showWarning } = useToast()

  // Cargar datos del perfil al montar el componente
  useEffect(() => {
    loadUserProfile()
  }, [])

  const loadUserProfile = async () => {
    try {
      setIsLoadingInitial(true)
      const [profile, status] = await Promise.all([
        userProfileService.getUserProfile(),
        userProfileService.getCompletionStatus()
      ])
      
      setUserProfile(profile)
      setCompletionStatus(status)
      
      // Llenar el formulario con los datos existentes
      setUserData({
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        phone: profile.phone || '',
        documentNumber: profile.documentNumber || '',
        address: {
          street: profile.address?.street || '',
          number: profile.address?.number || '',
          floor: profile.address?.floor || '',
          apartment: profile.address?.apartment || '',
          city: profile.address?.city || '',
          province: profile.address?.province || '',
          postalCode: profile.address?.postalCode || ''
        }
      })
    } catch (error) {
      console.error('Error loading user profile:', error)
      showError('Error al cargar los datos del perfil')
    } finally {
      setIsLoadingInitial(false)
    }
  }

  const handleDocumentUpload = async (file: File, documentType: DocumentType) => {
    try {
      setIsLoading(true)
      await userProfileService.uploadDocument(documentType, file)
      await loadUserProfile() // Recargar datos
      showSuccess('Documento subido correctamente')
    } catch (error) {
      console.error('Error uploading document:', error)
      showError('Error al subir el documento')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDocumentDelete = async (documentId: number) => {
    setConfirmModal({
      isOpen: true,
      title: 'Eliminar documento',
      message: '¿Estás seguro de que quieres eliminar este documento? Esta acción no se puede deshacer.',
      onConfirm: () => confirmDeleteDocument(documentId)
    })
  }

  const confirmDeleteDocument = async (documentId: number) => {
    try {
      setIsLoading(true)
      await userProfileService.deleteDocument(documentId)
      await loadUserProfile() // Recargar datos
      showSuccess('Documento eliminado correctamente')
    } catch (error) {
      console.error('Error deleting document:', error)
      showError('Error al eliminar el documento')
    } finally {
      setIsLoading(false)
      setConfirmModal({ isOpen: false, title: '', message: '', onConfirm: () => {} })
    }
  }

  const handleDocumentDownload = async (documentId: number, fileName: string) => {
    try {
      await userProfileService.downloadDocumentWithName(documentId, fileName)
    } catch (error) {
      console.error('Error downloading document:', error)
      showError('Error al descargar el documento')
    }
  }

  const handleInputChange = (field: string, value: string) => {
    if (field.startsWith('address.')) {
      const addressField = field.split('.')[1]
      setUserData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }))
    } else {
      setUserData(prev => ({
        ...prev,
        [field]: value
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validaciones básicas
    if (!userData.firstName.trim() || !userData.lastName.trim()) {
      showWarning('Por favor completa nombre y apellido')
      return
    }

    if (!userData.phone.trim()) {
      showWarning('Por favor completa el teléfono')
      return
    }

    if (!userData.address.street.trim() || !userData.address.number.trim() || !userData.address.city.trim() || !userData.address.province) {
      showWarning('Por favor completa al menos calle, altura, ciudad y provincia')
      return
    }

    try {
      setIsLoading(true)
      
      const updateRequest: UpdateUserProfileRequest = {
        firstName: userData.firstName.trim(),
        lastName: userData.lastName.trim(),
        phone: userData.phone.trim(),
        documentNumber: userData.documentNumber.trim() || undefined,
        address: {
          street: userData.address.street.trim(),
          number: userData.address.number.trim(),
          floor: userData.address.floor.trim() || undefined,
          apartment: userData.address.apartment.trim() || undefined,
          city: userData.address.city.trim(),
          province: userData.address.province,
          postalCode: userData.address.postalCode.trim() || undefined
        }
      }

      await userProfileService.updateUserProfile(updateRequest)
      await loadUserProfile() // Recargar datos para actualizar el progreso

      // Mostrar feedback inmediato
      setShowSuccessMessage(true)
      showSuccess('Datos guardados correctamente')

      // Redirigir al menú principal (dashboard) después de un breve retraso
      setTimeout(() => {
        navigate('/dashboard')
      }, 1500)
      // Ocultar modal si el usuario permanece (fallback)
      setTimeout(() => {
        setShowSuccessMessage(false)
      }, 3000)
    } catch (error) {
      console.error('Error updating profile:', error)
      showError('Error al guardar los datos')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoadingInitial) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-secondary-600">Cargando datos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      {/* Header */}
      <header className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="text-secondary-600 hover:text-primary-600 transition-colors duration-200 mr-4"
            >
              <ArrowLeftIcon size={28} />
            </button>
            <h1 className="text-xl font-bold text-secondary-900">Mis Datos</h1>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Indicador de progreso */}
        {completionStatus && (
          <ProgressIndicator
            percentage={completionStatus.completionPercentage}
            isProfileComplete={completionStatus.isProfileComplete}
            isAddressComplete={completionStatus.isAddressComplete}
            isDocumentationComplete={completionStatus.isDocumentationComplete}
          />
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Datos personales */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-lg font-semibold text-secondary-900 mb-6">Datos Personales</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nombre */}
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-secondary-700 mb-2">
                  Nombre *
                </label>
                <input
                  type="text"
                  id="firstName"
                  value={userData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className="input-field"
                  placeholder="Ej: Juan"
                  required
                />
              </div>

              {/* Apellido */}
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-secondary-700 mb-2">
                  Apellido *
                </label>
                <input
                  type="text"
                  id="lastName"
                  value={userData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className="input-field"
                  placeholder="Ej: Pérez"
                  required
                />
              </div>

              {/* Teléfono */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-secondary-700 mb-2">
                  Teléfono *
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={userData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="input-field"
                  placeholder="Ej: +54 11 1234-5678"
                  required
                />
              </div>

              {/* Número de documento */}
              <div>
                <label htmlFor="documentNumber" className="block text-sm font-medium text-secondary-700 mb-2">
                  Número de DNI
                </label>
                <input
                  type="text"
                  id="documentNumber"
                  value={userData.documentNumber}
                  onChange={(e) => handleInputChange('documentNumber', e.target.value)}
                  className="input-field"
                  placeholder="Ej: 12345678"
                />
              </div>
            </div>
          </div>

          {/* Dirección */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-lg font-semibold text-secondary-900 mb-6">Dirección</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Calle */}
              <div>
                <label htmlFor="street" className="block text-sm font-medium text-secondary-700 mb-2">
                  Calle *
                </label>
                <input
                  type="text"
                  id="street"
                  value={userData.address.street}
                  onChange={(e) => handleInputChange('address.street', e.target.value)}
                  className="input-field"
                  placeholder="Ej: Av. Corrientes"
                  required
                />
              </div>

              {/* Altura */}
              <div>
                <label htmlFor="number" className="block text-sm font-medium text-secondary-700 mb-2">
                  Altura *
                </label>
                <input
                  type="text"
                  id="number"
                  value={userData.address.number}
                  onChange={(e) => handleInputChange('address.number', e.target.value)}
                  className="input-field"
                  placeholder="Ej: 1234"
                  required
                />
              </div>

              {/* Ciudad */}
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-secondary-700 mb-2">
                  Ciudad *
                </label>
                <input
                  type="text"
                  id="city"
                  value={userData.address.city}
                  onChange={(e) => handleInputChange('address.city', e.target.value)}
                  className="input-field"
                  placeholder="Ej: Buenos Aires"
                  required
                />
              </div>

              {/* Código Postal */}
              <div>
                <label htmlFor="postalCode" className="block text-sm font-medium text-secondary-700 mb-2">
                  Código Postal
                </label>
                <input
                  type="text"
                  id="postalCode"
                  value={userData.address.postalCode}
                  onChange={(e) => handleInputChange('address.postalCode', e.target.value)}
                  className="input-field"
                  placeholder="Ej: 1000"
                />
              </div>

              {/* Piso */}
              <div>
                <label htmlFor="floor" className="block text-sm font-medium text-secondary-700 mb-2">
                  Piso
                </label>
                <input
                  type="text"
                  id="floor"
                  value={userData.address.floor}
                  onChange={(e) => handleInputChange('address.floor', e.target.value)}
                  className="input-field"
                  placeholder="Ej: 5"
                />
              </div>

              {/* Departamento */}
              <div>
                <label htmlFor="apartment" className="block text-sm font-medium text-secondary-700 mb-2">
                  Departamento
                </label>
                <input
                  type="text"
                  id="apartment"
                  value={userData.address.apartment}
                  onChange={(e) => handleInputChange('address.apartment', e.target.value)}
                  className="input-field"
                  placeholder="Ej: A"
                />
              </div>

              {/* Provincia */}
              <div className="md:col-span-2">
                <label htmlFor="province" className="block text-sm font-medium text-secondary-700 mb-2">
                  Provincia *
                </label>
                <select
                  id="province"
                  value={userData.address.province}
                  onChange={(e) => handleInputChange('address.province', e.target.value)}
                  className="input-field"
                  required
                >
                  <option value="">Selecciona una provincia</option>
                  <option value="Buenos Aires">Buenos Aires</option>
                  <option value="CABA">Ciudad Autónoma de Buenos Aires</option>
                  <option value="Catamarca">Catamarca</option>
                  <option value="Chaco">Chaco</option>
                  <option value="Chubut">Chubut</option>
                  <option value="Córdoba">Córdoba</option>
                  <option value="Corrientes">Corrientes</option>
                  <option value="Entre Ríos">Entre Ríos</option>
                  <option value="Formosa">Formosa</option>
                  <option value="Jujuy">Jujuy</option>
                  <option value="La Pampa">La Pampa</option>
                  <option value="La Rioja">La Rioja</option>
                  <option value="Mendoza">Mendoza</option>
                  <option value="Misiones">Misiones</option>
                  <option value="Neuquén">Neuquén</option>
                  <option value="Río Negro">Río Negro</option>
                  <option value="Salta">Salta</option>
                  <option value="San Juan">San Juan</option>
                  <option value="San Luis">San Luis</option>
                  <option value="Santa Cruz">Santa Cruz</option>
                  <option value="Santa Fe">Santa Fe</option>
                  <option value="Santiago del Estero">Santiago del Estero</option>
                  <option value="Tierra del Fuego">Tierra del Fuego</option>
                  <option value="Tucumán">Tucumán</option>
                </select>
              </div>
            </div>
          </div>

          {/* Documentación */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-lg font-semibold text-secondary-900 mb-6">Documentación</h2>
            
            <div className="space-y-6">
              <DocumentUpload
                documentType="DNI"
                existingDocument={userProfile?.documents.find(d => d.documentType === 'DNI')}
                onUpload={handleDocumentUpload}
                onDelete={handleDocumentDelete}
                onDownload={handleDocumentDownload}
                isLoading={isLoading}
                label="Documento Nacional de Identidad (DNI)"
                description="Sube una copia de tu DNI en formato PDF. Máximo 10MB."
                onShowWarning={showWarning}
              />
            </div>
          </div>

          {/* Botón de guardar */}
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={isLoading}
              className={`font-bold py-3 px-8 rounded-lg transition-colors duration-200 ${
                isLoading
                  ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                  : 'bg-primary-600 hover:bg-primary-700 text-white'
              }`}
            >
              {isLoading ? 'Guardando...' : 'Guardar Datos'}
            </button>
          </div>
        </form>

        {/* Modal de éxito */}
        {showSuccessMessage && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-md mx-4">
              <div className="text-center">
                <div className="text-green-600 text-5xl mb-4">✓</div>
                <h3 className="text-xl font-bold text-secondary-900 mb-2">¡Datos guardados!</h3>
                <p className="text-secondary-600">
                  Tus datos han sido actualizados correctamente.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Toast Notifications */}
        <ToastContainer toasts={toasts} onRemoveToast={removeToast} />

        {/* Confirm Modal */}
        <ConfirmModal
          isOpen={confirmModal.isOpen}
          title={confirmModal.title}
          message={confirmModal.message}
          confirmText="Eliminar"
          cancelText="Cancelar"
          type="danger"
          onConfirm={confirmModal.onConfirm}
          onCancel={() => setConfirmModal({ isOpen: false, title: '', message: '', onConfirm: () => {} })}
        />
      </div>
    </div>
  )
}

export default MyData