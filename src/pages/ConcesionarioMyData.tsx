import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeftIcon, XIcon } from '../components/Icons'

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
  estatutoFile: File | null
  afipFile: File | null
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
    },
    estatutoFile: null,
    afipFile: null
  })

  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [errors, setErrors] = useState<{[key: string]: string}>({})

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

  // Validar archivo PDF y tamaño
  const validateFile = (file: File | null, fieldName: string): string => {
    if (!file) {
      return `El archivo ${fieldName} es requerido`
    }

    if (file.type !== 'application/pdf') {
      return `El archivo ${fieldName} debe ser un PDF`
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB
      return `El archivo ${fieldName} no debe superar los 10MB`
    }

    return ''
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

  const handleFileChange = (field: 'estatutoFile' | 'afipFile', file: File | null) => {
    setConcesionarioData(prev => ({
      ...prev,
      [field]: file
    }))

    // Limpiar error del campo
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const handleFileRemove = (field: 'estatutoFile' | 'afipFile') => {
    setConcesionarioData(prev => ({
      ...prev,
      [field]: null
    }))

    // Limpiar el input de archivo
    const fileInput = document.getElementById(field === 'estatutoFile' ? 'estatuto' : 'afip') as HTMLInputElement
    if (fileInput) {
      fileInput.value = ''
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

  const handleSubmit = (e: React.FormEvent) => {
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

    // Validar archivos
    const estatutoError = validateFile(concesionarioData.estatutoFile, 'Estatuto')
    if (estatutoError) {
      newErrors.estatutoFile = estatutoError
    }

    const afipError = validateFile(concesionarioData.afipFile, 'Inscripción AFIP')
    if (afipError) {
      newErrors.afipFile = afipError
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    // Simular guardado
    console.log('Datos del concesionario:', concesionarioData)
    setShowSuccessMessage(true)
    setTimeout(() => {
      setShowSuccessMessage(false)
      navigate('/dashboard')
    }, 2000)
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
                  <option value="CABA">CABA</option>
                  <option value="Provincia de Bs As">Provincia de Bs As</option>
                </select>
                {errors['address.province'] && <p className="text-red-500 text-xs mt-1">{errors['address.province']}</p>}
              </div>
            </div>
          </div>

          {/* Documentación */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-lg font-semibold text-secondary-900 mb-6">Documentación</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Estatuto */}
              <div>
                <label htmlFor="estatuto" className="block text-sm font-medium text-secondary-700 mb-2">
                  Estatuto * (PDF, máx. 10MB)
                </label>
                <input
                  type="file"
                  id="estatuto"
                  accept=".pdf"
                  onChange={(e) => handleFileChange('estatutoFile', e.target.files?.[0] || null)}
                  className={`input-field file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 ${errors.estatutoFile ? 'border-red-500' : ''}`}
                />
                {concesionarioData.estatutoFile && (
                  <div className="mt-2 flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                      </svg>
                      <span className="text-sm text-green-800 font-medium">
                        {concesionarioData.estatutoFile.name}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleFileRemove('estatutoFile')}
                      className="text-red-500 hover:text-red-700 hover:bg-red-100 rounded-full p-1 transition-colors"
                      title="Eliminar archivo"
                    >
                      <XIcon className="w-4 h-4" />
                    </button>
                  </div>
                )}
                {errors.estatutoFile && <p className="text-red-500 text-xs mt-1">{errors.estatutoFile}</p>}
              </div>

              {/* Inscripción AFIP */}
              <div>
                <label htmlFor="afip" className="block text-sm font-medium text-secondary-700 mb-2">
                  Inscripción AFIP * (PDF, máx. 10MB)
                </label>
                <input
                  type="file"
                  id="afip"
                  accept=".pdf"
                  onChange={(e) => handleFileChange('afipFile', e.target.files?.[0] || null)}
                  className={`input-field file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 ${errors.afipFile ? 'border-red-500' : ''}`}
                />
                {concesionarioData.afipFile && (
                  <div className="mt-2 flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                      </svg>
                      <span className="text-sm text-green-800 font-medium">
                        {concesionarioData.afipFile.name}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleFileRemove('afipFile')}
                      className="text-red-500 hover:text-red-700 hover:bg-red-100 rounded-full p-1 transition-colors"
                      title="Eliminar archivo"
                    >
                      <XIcon className="w-4 h-4" />
                    </button>
                  </div>
                )}
                {errors.afipFile && <p className="text-red-500 text-xs mt-1">{errors.afipFile}</p>}
              </div>
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
      </div>
    </div>
  )
}

export default ConcesionarioMyData