import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeftIcon, ArrowRightIcon, FileTextIcon, CheckIcon, XIcon, EyeIcon, DownloadIcon } from '../components/Icons'

// Tipos
type PublicationStatus = 'pendiente_revision' | 'rechazada' | 'confirmada' | 'en_curso' | 'finalizada'

interface ObservationHistory {
  id: number
  date: string
  time: string
  observation: string
  author: string // 'admin' | 'user'
  authorEmail: string
}

interface PublicationDetailData {
  id: number
  createdDate: string
  createdTime: string
  userEmail: string
  brand: string
  model: string
  version: string
  year: number
  description: string
  status: PublicationStatus
  observationComment?: string
  startDate?: string
  endDate?: string
  isDeleted: boolean
  
  // Documentos y fotos
  photos: string[]
  documents: {
    [key: string]: string | undefined
  }
  
  observationHistory: ObservationHistory[]
}

const AdminPublicationDetail = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [publication, setPublication] = useState<PublicationDetailData | null>(null)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [observationText, setObservationText] = useState('')
  const [scheduledDate, setScheduledDate] = useState('')
  const [basePrice, setBasePrice] = useState('')
  
  // Estados para el lightbox de fotos
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [lightboxPhotoIndex, setLightboxPhotoIndex] = useState(0)
  
  const [errors, setErrors] = useState<{
    scheduledDate?: string
    basePrice?: string
    observationText?: string
  }>({})

  // Lista de documentos requeridos
  const requiredDocuments = [
    'Documento del titular',
    'Libre de deuda de patentes',
    'Libre de deuda de infracciones (13i)',
    'Verificacion policial',
    'VTV',
    '08 certificado'
  ]

  // Mock data
  useEffect(() => {
    if (id) {
      const getPublicationData = (pubId: string) => {
        switch (pubId) {
          case '1':
            return {
              id: 1,
              createdDate: '2024-03-20',
              createdTime: '14:30',
              userEmail: 'juan.perez@email.com',
              brand: 'Volkswagen',
              model: 'Golf',
              version: 'GTI 2.0 5 ptas',
              year: 2019,
              description: 'Volkswagen Golf GTI 2019, motor 2.0 TSI automático DSG. Full equipo: cuero, techo panorámico, cámara 360°, park assist, adaptive cruise control, faros full LED. Estado impecable, muy poco uso con 35.000 km reales.',
              status: 'en_curso' as PublicationStatus,
              startDate: '2024-03-20',
              endDate: '2024-03-25',
              isDeleted: false,
              photos: [
                '/images/vehicles/volkswagen-golf/1.webp',
                '/images/vehicles/volkswagen-golf/2.webp',
                '/images/vehicles/volkswagen-golf/3.webp',
                '/images/vehicles/volkswagen-golf/4.webp'
              ],
              documents: {
                'Documento del titular': 'documento_titular.pdf',
                'Libre de deuda de patentes': 'libre_deuda_patentes.pdf',
                'Libre de deuda de infracciones (13i)': 'libre_deuda_infracciones.pdf',
                'Verificacion policial': 'verificacion_policial.pdf',
                'VTV': 'vtv.pdf',
                '08 certificado': 'certificado_08.pdf'
              },
              observationHistory: []
            }

          case '2':
            return {
              id: 2,
              createdDate: '2024-03-19',
              createdTime: '10:15',
              userEmail: 'maria.gonzalez@email.com',
              brand: 'Peugeot',
              model: '208',
              version: '1.6 coupe',
              year: 2020,
              description: 'Peugeot 208 1.6 coupe 2020, motor eficiente y económico. Interior moderno con tecnología avanzada. Sistema multimedia con conectividad. Excelente para uso urbano. Segundo dueño, mantenimiento al día.',
              status: 'pendiente_revision' as PublicationStatus,
              isDeleted: false,
              photos: [
                '/images/vehicles/peugeot-208/1.webp',
                '/images/vehicles/peugeot-208/2.webp',
                '/images/vehicles/peugeot-208/3.webp'
              ],
              documents: {
                'Documento del titular': 'documento_titular.pdf',
                'Libre de deuda de patentes': 'libre_deuda_patentes.pdf',
                'Libre de deuda de infracciones (13i)': 'libre_deuda_infracciones.pdf',
                'Verificacion policial': 'verificacion_policial.pdf',
                'VTV': 'vtv.pdf',
                '08 certificado': 'certificado_08.pdf'
              },
              observationHistory: []
            }

          case '3':
            return {
              id: 3,
              createdDate: '2024-03-18',
              createdTime: '16:45',
              userEmail: 'carlos@autocenter.com',
              brand: 'BMW',
              model: '220i',
              version: '2.0 5 ptas',
              year: 2018,
              description: 'BMW 220i 2.0 5 ptas 2018, motor turbo potente. Interior deportivo con asientos de cuero. Sistema de navegación profesional y cámara de retroceso. Mantenimiento completo al día en concesionario oficial BMW.',
              status: 'rechazada' as PublicationStatus,
              observationComment: 'Documentación no legible, subir documentos con mejor calidad de imagen.',
              isDeleted: false,
              photos: [
                '/images/vehicles/bmw-220i/1.webp',
                '/images/vehicles/bmw-220i/2.webp',
                '/images/vehicles/bmw-220i/3.webp'
              ],
              documents: {
                'Documento del titular': 'documento_titular.pdf',
                'Libre de deuda de patentes': 'libre_deuda_patentes.pdf',
                'Libre de deuda de infracciones (13i)': 'libre_deuda_infracciones.pdf',
                'Verificacion policial': 'verificacion_policial.pdf',
                'VTV': 'vtv.pdf',
                '08 certificado': 'certificado_08.pdf'
              },
              observationHistory: [
                {
                  id: 1,
                  date: '2024-03-19',
                  time: '09:30',
                  observation: 'Documentación no legible, subir documentos con mejor calidad de imagen.',
                  author: 'admin',
                  authorEmail: 'administrador@vendetuautoya.com'
                }
              ]
            }

          case '4':
            return {
              id: 4,
              createdDate: '2024-03-17',
              createdTime: '11:20',
              userEmail: 'info@autoplaza.com',
              brand: 'Fiat',
              model: '500',
              version: 'Abarth 1.6 coupe',
              year: 2021,
              description: 'Fiat 500 Abarth 1.6 coupe 2021, motor turbo deportivo. Estado impecable, primer dueño. Todos los services en concesionario oficial. Escape deportivo, llantas deportivas, frenos Brembo, asientos Competizione.',
              status: 'confirmada' as PublicationStatus,
              startDate: '2024-03-25',
              endDate: '2024-03-30',
              isDeleted: false,
              photos: [
                '/images/vehicles/fiat-500abarth/1.webp',
                '/images/vehicles/fiat-500abarth/2.webp',
                '/images/vehicles/fiat-500abarth/3.webp'
              ],
              documents: {
                'Documento del titular': 'documento_titular.pdf',
                'Libre de deuda de patentes': 'libre_deuda_patentes.pdf',
                'Libre de deuda de infracciones (13i)': 'libre_deuda_infracciones.pdf',
                'Verificacion policial': 'verificacion_policial.pdf',
                'VTV': 'vtv.pdf',
                '08 certificado': 'certificado_08.pdf'
              },
              observationHistory: [{
                id: 1,
                date: '2024-03-18',
                time: '09:15',
                observation: 'Documentación completada, pendiente de revisión administrativa',
                author: 'user',
                authorEmail: 'carlos@autocenter.com'
              }]
            }

          case '5':
            return {
              id: 5,
              createdDate: '2024-03-16',
              createdTime: '09:30',
              userEmail: 'ana.rodriguez@email.com',
              brand: 'Audi',
              model: 'A1',
              version: '1.6 coupe',
              year: 2019,
              description: 'Audi A1 1.6 coupe 2019, como nuevo, muy pocos kilómetros. Motor 1.6 automático. Full equipo: MMI touch, virtual cockpit, asientos deportivos, llantas de aleación, faros LED, interior premium.',
              status: 'finalizada' as PublicationStatus,
              startDate: '2024-03-10',
              endDate: '2024-03-15',
              isDeleted: false,
              photos: [
                '/images/vehicles/audi-a1/1.webp',
                '/images/vehicles/audi-a1/2.webp',
                '/images/vehicles/audi-a1/3.webp',
                '/images/vehicles/audi-a1/4.webp'
              ],
              documents: {
                'Documento del titular': 'documento_titular.pdf',
                'Libre de deuda de patentes': 'libre_deuda_patentes.pdf',
                'Libre de deuda de infracciones (13i)': 'libre_deuda_infracciones.pdf',
                'Verificacion policial': 'verificacion_policial.pdf',
                'VTV': 'vtv.pdf',
                '08 certificado': 'certificado_08.pdf'
              },
              observationHistory: []
            }

          case '6':
            return {
              id: 6,
              createdDate: '2024-03-15',
              createdTime: '13:45',
              userEmail: 'sofia.lopez@email.com',
              brand: 'BMW',
              model: '220i',
              version: 'Coupe',
              year: 2021,
              description: 'BMW 220i Coupe 2021, deportivo elegante. Motor 2.0 turbo automático. Cuero, techo solar, navegador, asientos deportivos, modo Sport+, llantas deportivas.',
              status: 'confirmada' as PublicationStatus,
              startDate: '2024-03-22',
              endDate: '2024-03-27',
              isDeleted: false,
              photos: [
                '/images/vehicles/bmw-220i/1.webp',
                '/images/vehicles/bmw-220i/2.webp',
                '/images/vehicles/bmw-220i/3.webp',
                '/images/vehicles/bmw-220i/4.webp'
              ],
              documents: {
                'Documento del titular': 'documento_titular.pdf',
                'Libre de deuda de patentes': 'libre_deuda_patentes.pdf',
                'Libre de deuda de infracciones (13i)': 'libre_deuda_infracciones.pdf',
                'Verificacion policial': 'verificacion_policial.pdf',
                'VTV': 'vtv.pdf',
                '08 certificado': 'certificado_08.pdf'
              },
              observationHistory: []
            }

          case '7':
            return {
              id: 7,
              createdDate: '2024-03-14',
              createdTime: '15:10',
              userEmail: 'luis@luismotors.com',
              brand: 'Fiat',
              model: '500 Abarth',
              version: 'Competizione',
              year: 2018,
              description: 'Fiat 500 Abarth Competizione 2018, deportivo compacto. Motor 1.4 T-Jet turbo manual. Kit deportivo completo, escape deportivo, asientos Recaro, volante deportivo.',
              status: 'finalizada' as PublicationStatus,
              startDate: '2024-03-05',
              endDate: '2024-03-12',
              isDeleted: true,
              photos: [
                '/images/vehicles/fiat-500abarth/1.webp',
                '/images/vehicles/fiat-500abarth/2.webp',
                '/images/vehicles/fiat-500abarth/3.webp'
              ],
              documents: {
                'Documento del titular': 'documento_titular.pdf',
                'Libre de deuda de patentes': 'libre_deuda_patentes.pdf',
                'Libre de deuda de infracciones (13i)': 'libre_deuda_infracciones.pdf',
                'Verificacion policial': 'verificacion_policial.pdf',
                'VTV': 'vtv.pdf',
                '08 certificado': 'certificado_08.pdf'
              },
              observationHistory: []
            }

          default:
            return null
        }
      }

      const data = getPublicationData(id)
      if (data) {
        setPublication(data)
      }
    }
  }, [id])

  // useEffect para manejar teclas del lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeLightbox()
      } else if (e.key === 'ArrowLeft') {
        prevLightboxPhoto()
      } else if (e.key === 'ArrowRight') {
        nextLightboxPhoto()
      }
    }

    if (isLightboxOpen) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isLightboxOpen])

  if (!publication) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-secondary-600">Cargando información de la publicación...</p>
        </div>
      </div>
    )
  }

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

  const handleConfirmPublication = () => {
    const newErrors: { scheduledDate?: string; basePrice?: string } = {}

    // Validar fecha programada
    if (!scheduledDate) {
      newErrors.scheduledDate = 'La fecha programada de inicio es obligatoria'
    }

    // Validar precio base
    if (!basePrice || parseFloat(basePrice) <= 0) {
      newErrors.basePrice = 'El precio de base debe ser mayor a 0'
    }

    // Si hay errores, mostrarlos y no continuar
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    // Limpiar errores si todo está correcto
    setErrors({})

    console.log('Confirmar publicación:', publication.id)
    console.log('Fecha programada:', scheduledDate)
    console.log('Precio de base:', basePrice)
    console.log('Observación:', observationText)

    const newObservation: ObservationHistory = {
      id: publication.observationHistory.length + 1,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }),
      observation: observationText || `Publicación confirmada por el administrador. Precio base: $${parseFloat(basePrice).toLocaleString()}`,
      author: 'admin',
      authorEmail: 'administrador@vendetuautoya.com'
    }

    setPublication({ 
      ...publication, 
      status: 'confirmada',
      startDate: scheduledDate,
      observationHistory: [...publication.observationHistory, newObservation]
    })
    
    setShowConfirmModal(false)
    setObservationText('')
    setScheduledDate('')
    setBasePrice('')
    setErrors({})
  }

  const handleRejectPublication = () => {
    if (!observationText.trim()) {
      setErrors({ observationText: 'El motivo del rechazo es obligatorio' })
      return
    }

    // Limpiar errores
    setErrors({})

    console.log('Rechazar publicación:', publication.id)
    console.log('Observación:', observationText)

    const newObservation: ObservationHistory = {
      id: publication.observationHistory.length + 1,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }),
      observation: observationText,
      author: 'admin',
      authorEmail: 'administrador@vendetuautoya.com'
    }

    setPublication({ 
      ...publication, 
      status: 'rechazada',
      observationComment: observationText,
      observationHistory: [...publication.observationHistory, newObservation]
    })
    
    setShowRejectModal(false)
    setObservationText('')
    setErrors({})
  }

  const handlePreview = () => {
    // Navegar al detalle de la publicación como preview desde el panel de admin
    // Pasar state con el ID de la publicación para que el botón "Atrás" regrese aquí
    navigate(`/auction-detail/${publication.id}`, { 
      state: { 
        from: 'admin-detail', 
        adminPublicationId: publication.id 
      } 
    })
  }

  const handleDownloadDocument = (documentType: string, fileName: string) => {
    console.log('Descargar documento:', documentType, fileName)
    // TODO: Implementar descarga real
    alert(`Descargando: ${fileName}`)
  }

  // Funciones del lightbox
  const openLightbox = (index: number) => {
    setLightboxPhotoIndex(index)
    setIsLightboxOpen(true)
  }

  const closeLightbox = () => {
    setIsLightboxOpen(false)
  }

  const prevLightboxPhoto = () => {
    setLightboxPhotoIndex((prev) => 
      prev === 0 ? (publication?.photos.length || 1) - 1 : prev - 1
    )
  }

  const nextLightboxPhoto = () => {
    setLightboxPhotoIndex((prev) => 
      prev === (publication?.photos.length || 1) - 1 ? 0 : prev + 1
    )
  }

  const getAuthorLabel = (observation: ObservationHistory) => {
    return observation.authorEmail
  }

  const canChangeStatus = publication.status === 'pendiente_revision'

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => navigate('/admin-publications')}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow"
            >
              <ArrowLeftIcon className="w-5 h-5 text-secondary-600" />
            </button>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary-100">
                <FileTextIcon className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-secondary-900">Detalle de Publicación</h1>
                <p className="text-secondary-600">Revisión y validación de información</p>
              </div>
            </div>
          </div>

          {/* Info básica y estado */}
          <div className="bg-white rounded-lg shadow-sm border border-secondary-200 p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm font-medium text-secondary-500">Usuario</p>
                <p className="text-secondary-900">{publication.userEmail}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-secondary-500">Fecha de creación</p>
                <p className="text-secondary-900">{publication.createdDate} {publication.createdTime}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-secondary-500">Estado actual</p>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(publication.status)}`}>
                  {getStatusText(publication.status)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Información del Vehículo */}
          <div className="bg-white rounded-lg shadow-sm border border-secondary-200 p-6">
            <h2 className="text-xl font-bold text-secondary-900 mb-6">Información del Vehículo</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">Marca</label>
                <div className="w-full px-3 py-2 border border-secondary-300 rounded-lg bg-secondary-50 text-secondary-900">
                  {publication.brand}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">Modelo</label>
                <div className="w-full px-3 py-2 border border-secondary-300 rounded-lg bg-secondary-50 text-secondary-900">
                  {publication.model}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">Versión</label>
                <div className="w-full px-3 py-2 border border-secondary-300 rounded-lg bg-secondary-50 text-secondary-900">
                  {publication.version}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">Año</label>
                <div className="w-full px-3 py-2 border border-secondary-300 rounded-lg bg-secondary-50 text-secondary-900">
                  {publication.year}
                </div>
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-secondary-700 mb-2">Descripción del Vehículo</label>
              <div className="w-full px-3 py-2 border border-secondary-300 rounded-lg bg-secondary-50 text-secondary-900 min-h-[120px]">
                {publication.description}
              </div>
            </div>
          </div>

          {/* Fotos del Vehículo */}
          <div className="bg-white rounded-lg shadow-sm border border-secondary-200 p-6">
            <h2 className="text-xl font-bold text-secondary-900 mb-6">Fotos del Vehículo</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {publication.photos.map((photo, index) => (
                <div key={index} className="relative">
                  <img
                    src={photo}
                    alt={`Foto ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg border border-secondary-200 cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => openLightbox(index)}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = `https://via.placeholder.com/150x100/e5e7eb/9ca3af?text=Foto+${index + 1}`
                    }}
                  />
                </div>
              ))}
            </div>
            
            <p className="text-sm text-secondary-500 mt-4">
              Total de fotos: {publication.photos.length}
            </p>
          </div>

          {/* Documentación */}
          <div className="bg-white rounded-lg shadow-sm border border-secondary-200 p-6">
            <h2 className="text-xl font-bold text-secondary-900 mb-6">Documentación Requerida</h2>
            
            <div className="space-y-4">
              {requiredDocuments.map(documentType => (
                <div key={documentType} className="flex items-center justify-between p-3 border border-secondary-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                      publication.documents[documentType] 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-red-100 text-red-600'
                    }`}>
                      {publication.documents[documentType] ? (
                        <CheckIcon className="w-3 h-3" />
                      ) : (
                        <XIcon className="w-3 h-3" />
                      )}
                    </div>
                    <span className="text-secondary-900 font-medium">{documentType}</span>
                    {publication.documents[documentType] && (
                      <span className="text-sm text-secondary-500">
                        ({publication.documents[documentType]})
                      </span>
                    )}
                  </div>
                  
                  {publication.documents[documentType] && (
                    <button
                      onClick={() => handleDownloadDocument(documentType, publication.documents[documentType]!)}
                      className="flex items-center gap-1 text-primary-600 hover:text-primary-800 transition-colors"
                    >
                      <DownloadIcon className="w-4 h-4" />
                      <span className="text-sm">Descargar</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
            
            <div className="mt-4 p-3 bg-secondary-50 rounded-lg">
              <p className="text-sm text-secondary-600">
                Documentos cargados: {Object.keys(publication.documents).length}/{requiredDocuments.length}
              </p>
            </div>
          </div>

          {/* Historial de Observaciones */}
          <div className="bg-white rounded-lg shadow-sm border border-secondary-200 p-6">
            <h2 className="text-xl font-bold text-secondary-900 mb-6">Historial de Observaciones</h2>
            
            {publication.observationHistory.length === 0 ? (
              <p className="text-secondary-500 text-center py-8">Sin observaciones</p>
            ) : (
              <div className="space-y-4">
                {publication.observationHistory.map((observation) => (
                  <div key={observation.id} className="border border-secondary-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="text-sm text-secondary-500">
                        <span className="font-medium">{getAuthorLabel(observation)}</span>
                      </div>
                      <div className="text-sm text-secondary-500">
                        {observation.date} {observation.time}
                      </div>
                    </div>
                    <p className="text-secondary-900">{observation.observation}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Acciones del Administrador */}
          <div className="bg-white rounded-lg shadow-sm border border-secondary-200 p-6">
            <h2 className="text-xl font-bold text-secondary-900 mb-6">Acciones del Administrador</h2>
            
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Botones de cambio de estado */}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirmModal(true)}
                  disabled={!canChangeStatus}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    canChangeStatus
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <CheckIcon className="w-4 h-4" />
                  Confirmar Subasta
                </button>

                <button
                  onClick={() => setShowRejectModal(true)}
                  disabled={!canChangeStatus}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    canChangeStatus
                      ? 'bg-red-600 hover:bg-red-700 text-white'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <XIcon className="w-4 h-4" />
                  Rechazar
                </button>
              </div>

              {/* Botón de previsualización */}
              <button
                onClick={handlePreview}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                <EyeIcon className="w-4 h-4" />
                Previsualizar
              </button>
            </div>

            {!canChangeStatus && (
              <p className="text-sm text-secondary-500 mt-3">
                El estado actual no permite cambios de estado por un administrador
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Modal Confirmar Subasta */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-bold text-secondary-900 mb-4">Confirmar Subasta</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Fecha programada de inicio *
                </label>
                <input
                  type="datetime-local"
                  value={scheduledDate}
                  onChange={(e) => {
                    setScheduledDate(e.target.value)
                    // Limpiar error cuando el usuario empiece a escribir
                    if (errors.scheduledDate) {
                      setErrors(prev => ({ ...prev, scheduledDate: undefined }))
                    }
                  }}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                    errors.scheduledDate 
                      ? 'border-red-500 bg-red-50' 
                      : 'border-secondary-300'
                  }`}
                  required
                />
                {errors.scheduledDate && (
                  <p className="text-red-600 text-sm mt-1">{errors.scheduledDate}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Precio de base *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-500">$</span>
                  <input
                    type="number"
                    value={basePrice}
                    onChange={(e) => {
                      setBasePrice(e.target.value)
                      // Limpiar error cuando el usuario empiece a escribir
                      if (errors.basePrice) {
                        setErrors(prev => ({ ...prev, basePrice: undefined }))
                      }
                    }}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    className={`w-full pl-8 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                      errors.basePrice 
                        ? 'border-red-500 bg-red-50' 
                        : 'border-secondary-300'
                    }`}
                    required
                  />
                </div>
                {errors.basePrice && (
                  <p className="text-red-600 text-sm mt-1">{errors.basePrice}</p>
                )}
                <p className="text-sm text-secondary-500 mt-1">
                  Valor con el cual iniciará la subasta
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Observación (opcional)
                </label>
                <textarea
                  value={observationText}
                  onChange={(e) => setObservationText(e.target.value)}
                  placeholder="Comentario adicional sobre la confirmación..."
                  rows={3}
                  className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleConfirmPublication}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
              >
                Confirmar
              </button>
              <button
                onClick={() => {
                  setShowConfirmModal(false)
                  setObservationText('')
                  setScheduledDate('')
                  setBasePrice('')
                  setErrors({})
                }}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg font-medium transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Rechazar */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-bold text-secondary-900 mb-4">Rechazar Publicación</h3>
            
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Motivo del rechazo *
              </label>
              <textarea
                value={observationText}
                onChange={(e) => {
                  setObservationText(e.target.value)
                  // Limpiar error cuando el usuario empiece a escribir
                  if (errors.observationText) {
                    setErrors(prev => ({ ...prev, observationText: undefined }))
                  }
                }}
                placeholder="Explique el motivo del rechazo y qué información debe corregir el usuario..."
                rows={4}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                  errors.observationText 
                    ? 'border-red-500 bg-red-50' 
                    : 'border-secondary-300'
                }`}
                required
              />
              {errors.observationText && (
                <p className="text-red-600 text-sm mt-1">{errors.observationText}</p>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleRejectPublication}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
              >
                Rechazar
              </button>
              <button
                onClick={() => {
                  setShowRejectModal(false)
                  setObservationText('')
                  setErrors({})
                }}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg font-medium transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Lightbox Modal */}
      {isLightboxOpen && publication && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"
          onClick={closeLightbox}
        >
          <div className="relative max-w-full max-h-full p-4">
            {/* Botón cerrar */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
            >
              <XIcon className="w-8 h-8" />
            </button>

            {/* Navegación anterior */}
            {publication.photos.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  prevLightboxPhoto()
                }}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors z-10"
              >
                <ArrowLeftIcon className="w-8 h-8" />
              </button>
            )}

            {/* Imagen principal */}
            <img
              src={publication.photos[lightboxPhotoIndex]}
              alt={`${publication.brand} ${publication.model} - Foto ${lightboxPhotoIndex + 1}`}
              className="max-w-full max-h-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />

            {/* Navegación siguiente */}
            {publication.photos.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  nextLightboxPhoto()
                }}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors z-10"
              >
                <ArrowRightIcon className="w-8 h-8" />
              </button>
            )}

            {/* Indicador de foto actual */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-3 py-2 rounded">
              {lightboxPhotoIndex + 1} / {publication.photos.length}
            </div>

            {/* Miniaturas en el lightbox */}
            {publication.photos.length > 1 && (
              <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 flex space-x-2 max-w-full overflow-x-auto px-4">
                {publication.photos.map((photo: string, index: number) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation()
                      setLightboxPhotoIndex(index)
                    }}
                    className={`flex-shrink-0 w-12 h-12 rounded border-2 overflow-hidden transition-all duration-200 ${
                      index === lightboxPhotoIndex ? 'border-white' : 'border-gray-400 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={photo}
                      alt={`Miniatura ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminPublicationDetail