import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeftIcon, XIcon } from '../components/Icons'

interface FormData {
  brand: string
  model: string
  version: string
  year: string
  description: string
  photos: File[]
  documents: {
    [key: string]: File | null
  }
}

const brandModels = {
  'Audi': ['A1', 'A3', 'Q5'],
  'BMW': ['120i', '220i', 'X1'],
  'Fiat': ['500 Abarth', 'Chronos'],
  'Peugeot': ['208', '3008'],
  'Renault': ['Koleos'],
  'Volkswagen': ['Gol', 'Golf', 'Scirocco']
}

const versions = ['1.6 coupe', '2.0 5 ptas']

const requiredDocuments = [
  'Documento del titular',
  'Libre de deuda de patentes',
  'Libre de deuda de infracciones (13i)',
  'Verificacion policial',
  'VTV',
  '08 certificado'
]

const NewAuctionForm = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState<FormData>({
    brand: '',
    model: '',
    version: '',
    year: '',
    description: '',
    photos: [],
    documents: {}
  })
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  // Generar años desde 1990 hasta 2025
  const years = Array.from({ length: 2025 - 1990 + 1 }, (_, i) => (2025 - i).toString())

  const handleBrandChange = (brand: string) => {
    setFormData(prev => ({
      ...prev,
      brand,
      model: '' // Reset model when brand changes
    }))
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const imageFiles = files.filter(file => file.type.startsWith('image/'))
    
    if (formData.photos.length + imageFiles.length > 15) {
      alert('Solo puedes subir un máximo de 15 fotos')
      return
    }

    setFormData(prev => ({
      ...prev,
      photos: [...prev.photos, ...imageFiles]
    }))
  }

  const removePhoto = (index: number) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }))
  }

  const handleDocumentUpload = (documentType: string, file: File) => {
    setFormData(prev => ({
      ...prev,
      documents: {
        ...prev.documents,
        [documentType]: file
      }
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validar que todos los campos estén completos
    if (!formData.brand || !formData.model || !formData.version || !formData.year || !formData.description.trim()) {
      alert('Por favor completa todos los campos del vehículo incluyendo la descripción')
      return
    }

    if (formData.photos.length === 0) {
      alert('Por favor agrega al menos una foto del vehículo')
      return
    }

    // Validar que todos los documentos estén cargados
    const missingDocs = requiredDocuments.filter(doc => !formData.documents[doc])
    if (missingDocs.length > 0) {
      alert(`Faltan los siguientes documentos: ${missingDocs.join(', ')}`)
      return
    }

    setShowSuccessModal(true)
  }

  const handleSuccessConfirm = () => {
    setShowSuccessModal(false)
    navigate('/dashboard')
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
            <h1 className="text-xl font-bold text-secondary-900">Subastar nuevo vehículo</h1>
          </div>
        </div>
      </header>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Información del Vehículo */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-secondary-900 mb-6">Información del Vehículo</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Marca */}
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Marca *
                </label>
                <select
                  value={formData.brand}
                  onChange={(e) => handleBrandChange(e.target.value)}
                  className="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                >
                  <option value="">Selecciona una marca</option>
                  {Object.keys(brandModels).map(brand => (
                    <option key={brand} value={brand}>{brand}</option>
                  ))}
                </select>
              </div>

              {/* Modelo */}
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Modelo *
                </label>
                <select
                  value={formData.model}
                  onChange={(e) => setFormData(prev => ({ ...prev, model: e.target.value }))}
                  className="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                  disabled={!formData.brand}
                >
                  <option value="">Selecciona un modelo</option>
                  {formData.brand && brandModels[formData.brand as keyof typeof brandModels]?.map(model => (
                    <option key={model} value={model}>{model}</option>
                  ))}
                </select>
              </div>

              {/* Versión */}
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Versión *
                </label>
                <select
                  value={formData.version}
                  onChange={(e) => setFormData(prev => ({ ...prev, version: e.target.value }))}
                  className="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                >
                  <option value="">Selecciona una versión</option>
                  {versions.map(version => (
                    <option key={version} value={version}>{version}</option>
                  ))}
                </select>
              </div>

              {/* Año */}
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Año *
                </label>
                <select
                  value={formData.year}
                  onChange={(e) => setFormData(prev => ({ ...prev, year: e.target.value }))}
                  className="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                >
                  <option value="">Selecciona un año</option>
                  {years.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Descripción */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Descripción del Vehículo *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe las características, condiciones y detalles importantes del vehículo. Ejemplo: Unidad en excelentes condiciones. Primer dueño. Todos los service en concesionario oficial, comprobable. Cubiertas recién cambiadas."
                rows={15}
                className="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-vertical"
                required
              />
              <p className="text-sm text-secondary-500 mt-1">
                Describe detalladamente las características y condiciones del vehículo
              </p>
            </div>
          </div>

          {/* Fotos */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-secondary-900 mb-6">Fotos del Vehículo</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Agregar fotos (máximo 15) *
              </label>
              <div className="relative">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  id="photo-upload"
                />
                <label
                  htmlFor="photo-upload"
                  className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-primary-300 rounded-lg bg-primary-50 hover:bg-primary-100 cursor-pointer transition-colors duration-200"
                >
                  <div className="text-center">
                    <svg className="w-8 h-8 text-primary-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span className="text-primary-600 font-medium">Elegir fotos</span>
                    <p className="text-sm text-secondary-500 mt-1">Arrastra archivos aquí o haz clic para seleccionar</p>
                  </div>
                </label>
              </div>
              <p className="text-sm text-secondary-500 mt-2">
                Fotos actuales: {formData.photos.length}/15
              </p>
            </div>

            {/* Carousel de fotos */}
            {formData.photos.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {formData.photos.map((photo, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(photo)}
                      alt={`Foto ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removePhoto(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                    >
                      <XIcon size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Documentación */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-secondary-900 mb-6">Documentación Requerida</h2>
            
            <div className="space-y-4">
              {requiredDocuments.map(documentType => (
                <div key={documentType}>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    {documentType} *
                  </label>
                  <div className="flex items-center space-x-3">
                    <div className="relative flex-1">
                      <input
                        type="file"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            handleDocumentUpload(documentType, file)
                          }
                        }}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        id={`doc-${documentType.replace(/\s+/g, '-').toLowerCase()}`}
                        required
                      />
                      <label
                        htmlFor={`doc-${documentType.replace(/\s+/g, '-').toLowerCase()}`}
                        className="flex items-center justify-between w-full px-4 py-3 border border-secondary-300 rounded-lg bg-white hover:bg-secondary-50 cursor-pointer transition-colors duration-200 focus-within:ring-2 focus-within:ring-primary-500 focus-within:border-transparent"
                      >
                        <div className="flex items-center">
                          <svg className="w-5 h-5 text-secondary-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                          </svg>
                          <span className="text-secondary-600">
                            {formData.documents[documentType] 
                              ? formData.documents[documentType]?.name 
                              : 'Seleccionar archivo'
                            }
                          </span>
                        </div>
                        <div className="bg-primary-500 text-white px-3 py-1 rounded text-sm font-medium">
                          Buscar
                        </div>
                      </label>
                    </div>
                    {formData.documents[documentType] && (
                      <div className="flex items-center text-green-600">
                        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-sm font-medium">Cargado</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Botón de confirmación */}
          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-8 rounded-lg transition-colors duration-200"
            >
              Confirmar Subasta
            </button>
          </div>
        </form>
      </div>

      {/* Modal de éxito */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md mx-4">
            <h3 className="text-xl font-bold text-secondary-900 mb-4">¡Felicitaciones!</h3>
            <p className="text-secondary-600 mb-6">
              Su vehículo ha sido ingresado al sistema. Validaremos los datos ingresados y nos contactaremos para confirmar la subasta.
            </p>
            <button
              onClick={handleSuccessConfirm}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200"
            >
              Aceptar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default NewAuctionForm