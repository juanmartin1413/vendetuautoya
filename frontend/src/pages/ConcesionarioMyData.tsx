import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeftIcon } from '../components/Icons'
import ProgressIndicator from '../components/ProgressIndicator'
import DocumentUpload from '../components/DocumentUpload'
import { ToastContainer } from '../components/ToastContainer'
import { ConfirmModal } from '../components/ConfirmModal'
import { userProfileService } from '../services/userProfileService'
import { UserProfile, UpdateUserProfileRequest, CompletionStatus, DocumentType } from '../types/userProfile'
import { useToast } from '../hooks/useToast'

interface ConcesionarioData {
  cuit: string
  businessName: string
  phone: string
  address: {
    street: string
    number: string
    floor: string
    apartment: string
    province: string
  }
}

const ConcesionarioMyData = () => {
  const navigate = useNavigate()
  const [concesionarioData, setConcesionarioData] = useState<ConcesionarioData>({
    cuit: '',
    businessName: '',
    phone: '',
    address: {
      street: '',
      number: '',
      floor: '',
      apartment: '',
      province: ''
    }
  })

  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [completionStatus, setCompletionStatus] = useState<CompletionStatus | null>(null)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [errors, setErrors] = useState<{[key: string]: string}>({})
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

  // Validar formato CUIT argentino
  const validateCUIT = (cuit: string): boolean => {
    // Remover guiones y espacios
    const cleanCuit = cuit.replace(/[-\s]/g, '')
    
    // Verificar que tenga 11 dígitos
    if (!/^\d{11}$/.test(cleanCuit)) {
      return false
    }

    // Algoritmo de validación de CUIT argentino
    const weights = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2]
    let sum = 0

    for (let i = 0; i < 10; i++) {
      sum += parseInt(cleanCuit[i]) * weights[i]
    }

    const remainder = sum % 11
    const checkDigit = remainder < 2 ? remainder : 11 - remainder

    return parseInt(cleanCuit[10]) === checkDigit
  }



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

      // Llenar datos del formulario
      setConcesionarioData({
        cuit: profile.cuit || '',
        businessName: profile.businessName || '',
        phone: profile.phone || '',
        address: {
          street: profile.address?.street || '',
          number: profile.address?.number || '',
          floor: profile.address?.floor || '',
          apartment: profile.address?.apartment || '',
          province: profile.address?.province || ''
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
      
      // Solo recargar el perfil y status de completitud SIN sobrescribir el formulario
      const [profile, status] = await Promise.all([
        userProfileService.getUserProfile(),
        userProfileService.getCompletionStatus()
      ])
      
      setUserProfile(profile)
      setCompletionStatus(status)
      
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
      
      // Solo recargar el perfil y status de completitud SIN sobrescribir el formulario
      const [profile, status] = await Promise.all([
        userProfileService.getUserProfile(),
        userProfileService.getCompletionStatus()
      ])
      
      setUserProfile(profile)
      setCompletionStatus(status)
      
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
      setConcesionarioData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }))
    } else {
      setConcesionarioData(prev => ({
        ...prev,
        [field]: value
      }))
    }

    // Limpiar error del campo
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    const newErrors: {[key: string]: string} = {}

    // Validar CUIT
    if (!concesionarioData.cuit.trim()) {
      newErrors.cuit = 'El CUIT es requerido'
    } else if (!validateCUIT(concesionarioData.cuit)) {
      newErrors.cuit = 'El CUIT no tiene un formato válido'
    }

    // Validar razón social
    if (!concesionarioData.businessName.trim()) {
      newErrors.businessName = 'La razón social es requerida'
    } else if (concesionarioData.businessName.length > 40) {
      newErrors.businessName = 'La razón social no debe superar los 40 caracteres'
    }

    // Validar teléfono
    if (!concesionarioData.phone.trim()) {
      newErrors.phone = 'El teléfono es requerido'
    } else if (!/^\d+$/.test(concesionarioData.phone)) {
      newErrors.phone = 'El teléfono debe contener solo números'
    } else if (concesionarioData.phone.length > 15) {
      newErrors.phone = 'El teléfono no debe superar los 15 caracteres'
    }

    // Validar dirección
    if (!concesionarioData.address.street.trim()) {
      newErrors['address.street'] = 'La calle es requerida'
    } else if (concesionarioData.address.street.length > 30) {
      newErrors['address.street'] = 'La calle no debe superar los 30 caracteres'
    }

    if (!concesionarioData.address.number.trim()) {
      newErrors['address.number'] = 'La altura es requerida'
    } else if (!/^\d+$/.test(concesionarioData.address.number)) {
      newErrors['address.number'] = 'La altura debe ser numérica'
    } else if (concesionarioData.address.number.length > 6) {
      newErrors['address.number'] = 'La altura no debe superar los 6 caracteres'
    }

    if (concesionarioData.address.floor && (!/^\d+$/.test(concesionarioData.address.floor) || concesionarioData.address.floor.length > 2)) {
      newErrors['address.floor'] = 'El piso debe ser numérico y no superar los 2 caracteres'
    }

    if (concesionarioData.address.apartment && concesionarioData.address.apartment.length > 3) {
      newErrors['address.apartment'] = 'El departamento no debe superar los 3 caracteres'
    }

    if (!concesionarioData.address.province) {
      newErrors['address.province'] = 'La provincia es requerida'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      // Mostrar el primer error como warning
      const firstError = Object.values(newErrors)[0]
      showWarning(firstError)
      return
    }

    try {
      setIsLoading(true)
      
      // Preparar datos para el backend - específicos para concesionarios
      const updateRequest: UpdateUserProfileRequest = {
        phone: concesionarioData.phone,
        cuit: concesionarioData.cuit,
        businessName: concesionarioData.businessName,
        address: {
          street: concesionarioData.address.street,
          number: concesionarioData.address.number,
          floor: concesionarioData.address.floor || '',
          apartment: concesionarioData.address.apartment || '',
          city: 'Ciudad', // Campo requerido - se puede mejorar agregando al formulario
          province: concesionarioData.address.province,
          postalCode: '0000' // Campo requerido - se puede mejorar agregando al formulario
        }
      }

      await userProfileService.updateUserProfile(updateRequest)
      await loadUserProfile() // Recargar datos para actualizar el progreso
      
      showSuccess('Datos guardados correctamente')
      
      // Redirigir después de un breve retraso para que el usuario vea la notificación
      setTimeout(() => {
        navigate('/dashboard')
      }, 1500)
    } catch (error) {
      console.error('Error updating profile:', error)
      showError('Error al guardar los datos')
    } finally {
      setIsLoading(false)
    }
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
            <h1 className="text-xl font-bold text-secondary-900">Mis Datos - Concesionario</h1>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoadingInitial ? (
          <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
              <p className="mt-4 text-secondary-600">Cargando datos...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Progress Indicator */}
            {completionStatus && (
              <div className="mb-8">
                <ProgressIndicator 
                  percentage={completionStatus.completionPercentage}
                  isProfileComplete={completionStatus.isProfileComplete}
                  isAddressComplete={completionStatus.isAddressComplete}
                  isDocumentationComplete={completionStatus.isDocumentationComplete}
                />
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
          {/* Información empresarial */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-lg font-semibold text-secondary-900 mb-6">Información Empresarial</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* CUIT */}
              <div>
                <label htmlFor="cuit" className="block text-sm font-medium text-secondary-700 mb-2">
                  CUIT *
                </label>
                <input
                  type="text"
                  id="cuit"
                  value={concesionarioData.cuit}
                  onChange={(e) => {
                    // Solo permitir números y guiones
                    const value = e.target.value.replace(/[^\d-]/g, '')
                    handleInputChange('cuit', value)
                  }}
                  placeholder="20-12345678-9"
                  className={`input-field ${errors.cuit ? 'border-red-500' : ''}`}
                  maxLength={13}
                />
                {errors.cuit && <p className="text-red-500 text-xs mt-1">{errors.cuit}</p>}
              </div>

              {/* Razón Social */}
              <div>
                <label htmlFor="businessName" className="block text-sm font-medium text-secondary-700 mb-2">
                  Razón Social *
                </label>
                <input
                  type="text"
                  id="businessName"
                  value={concesionarioData.businessName}
                  onChange={(e) => handleInputChange('businessName', e.target.value)}
                  placeholder="Concesionario ABC S.A."
                  className={`input-field ${errors.businessName ? 'border-red-500' : ''}`}
                  maxLength={40}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {concesionarioData.businessName.length}/40 caracteres
                </p>
                {errors.businessName && <p className="text-red-500 text-xs mt-1">{errors.businessName}</p>}
              </div>

              {/* Teléfono */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-secondary-700 mb-2">
                  Teléfono *
                </label>
                <input
                  type="text"
                  id="phone"
                  value={concesionarioData.phone}
                  onChange={(e) => {
                    // Solo permitir números
                    const value = e.target.value.replace(/\D/g, '')
                    handleInputChange('phone', value)
                  }}
                  placeholder="1123456789"
                  className={`input-field ${errors.phone ? 'border-red-500' : ''}`}
                  maxLength={15}
                />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
              </div>
            </div>
          </div>

          {/* Domicilio */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-lg font-semibold text-secondary-900 mb-6">Domicilio</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Calle */}
              <div>
                <label htmlFor="street" className="block text-sm font-medium text-secondary-700 mb-2">
                  Calle *
                </label>
                <input
                  type="text"
                  id="street"
                  value={concesionarioData.address.street}
                  onChange={(e) => handleInputChange('address.street', e.target.value)}
                  placeholder="Av. Corrientes"
                  className={`input-field ${errors['address.street'] ? 'border-red-500' : ''}`}
                  maxLength={30}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {concesionarioData.address.street.length}/30 caracteres
                </p>
                {errors['address.street'] && <p className="text-red-500 text-xs mt-1">{errors['address.street']}</p>}
              </div>

              {/* Altura */}
              <div>
                <label htmlFor="number" className="block text-sm font-medium text-secondary-700 mb-2">
                  Altura *
                </label>
                <input
                  type="text"
                  id="number"
                  value={concesionarioData.address.number}
                  onChange={(e) => {
                    // Solo permitir números
                    const value = e.target.value.replace(/\D/g, '')
                    handleInputChange('address.number', value)
                  }}
                  placeholder="1234"
                  className={`input-field ${errors['address.number'] ? 'border-red-500' : ''}`}
                  maxLength={6}
                />
                {errors['address.number'] && <p className="text-red-500 text-xs mt-1">{errors['address.number']}</p>}
              </div>

              {/* Piso */}
              <div>
                <label htmlFor="floor" className="block text-sm font-medium text-secondary-700 mb-2">
                  Piso
                </label>
                <input
                  type="text"
                  id="floor"
                  value={concesionarioData.address.floor}
                  onChange={(e) => {
                    // Solo permitir números
                    const value = e.target.value.replace(/\D/g, '')
                    handleInputChange('address.floor', value)
                  }}
                  placeholder="5"
                  className={`input-field ${errors['address.floor'] ? 'border-red-500' : ''}`}
                  maxLength={2}
                />
                {errors['address.floor'] && <p className="text-red-500 text-xs mt-1">{errors['address.floor']}</p>}
              </div>

              {/* Departamento */}
              <div>
                <label htmlFor="apartment" className="block text-sm font-medium text-secondary-700 mb-2">
                  Departamento
                </label>
                <input
                  type="text"
                  id="apartment"
                  value={concesionarioData.address.apartment}
                  onChange={(e) => handleInputChange('address.apartment', e.target.value)}
                  placeholder="A"
                  className={`input-field ${errors['address.apartment'] ? 'border-red-500' : ''}`}
                  maxLength={3}
                />
                {errors['address.apartment'] && <p className="text-red-500 text-xs mt-1">{errors['address.apartment']}</p>}
              </div>

              {/* Provincia */}
              <div className="md:col-span-2">
                <label htmlFor="province" className="block text-sm font-medium text-secondary-700 mb-2">
                  Provincia *
                </label>
                <select
                  id="province"
                  value={concesionarioData.address.province}
                  onChange={(e) => handleInputChange('address.province', e.target.value)}
                  className={`input-field ${errors['address.province'] ? 'border-red-500' : ''}`}
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
                {errors['address.province'] && <p className="text-red-500 text-xs mt-1">{errors['address.province']}</p>}
              </div>
            </div>
          </div>

          {/* Documentación */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-lg font-semibold text-secondary-900 mb-6">Documentación</h2>
            
            <div className="space-y-6">
              <DocumentUpload
                documentType="Estatuto"
                existingDocument={userProfile?.documents.find(d => d.documentType === 'Estatuto')}
                onUpload={handleDocumentUpload}
                onDelete={handleDocumentDelete}
                onDownload={handleDocumentDownload}
                isLoading={isLoading}
                label="Estatuto Social"
                description="Sube una copia del estatuto social en formato PDF. Máximo 10MB."
                onShowWarning={showWarning}
              />

              <DocumentUpload
                documentType="AFIP"
                existingDocument={userProfile?.documents.find(d => d.documentType === 'AFIP')}
                onUpload={handleDocumentUpload}
                onDelete={handleDocumentDelete}
                onDownload={handleDocumentDownload}
                isLoading={isLoading}
                label="Inscripción AFIP"
                description="Sube una copia de la inscripción AFIP en formato PDF. Máximo 10MB."
                onShowWarning={showWarning}
              />
            </div>
          </div>

          {/* Botón de guardar */}
          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-8 rounded-lg transition-colors duration-200"
            >
              Guardar Datos
            </button>
          </div>
        </form>

        {/* Success Modal */}
        {showSuccessMessage && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                  <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  ¡Datos guardados!
                </h3>
                <p className="text-sm text-gray-500">
                  Tu información empresarial se ha actualizado correctamente.
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
        </>
      )}
      </div>
    </div>
  )
}

export default ConcesionarioMyData