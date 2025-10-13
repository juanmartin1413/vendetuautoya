import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeftIcon, ArrowRightIcon } from '../components/Icons'

interface Bid {
  id: string
  amount: number
  bidderEmail: string
  timestamp: Date
}

interface AuctionDetail {
  id: string
  brand: string
  model: string
  version: string
  year: string
  description: string
  photos: string[]
  basePrice: number
  currentPrice: number
  winningBidderEmail: string
  bids: Bid[]
  startDate: Date
  endDate: Date
  status: 'En curso' | 'Finalizada'
}

// Mock data para diferentes subastas
const mockAuctionDetails: { [key: string]: AuctionDetail } = {
  '1': {
    id: '1',
    brand: 'Volkswagen',
    model: 'Golf',
    version: '2.0 5 ptas',
    year: '2018',
    description: 'Unidad en excelentes condiciones. Primer dueño. Todos los service en concesionario oficial, comprobable. Cubiertas recién cambiadas. Interior de cuero en perfecto estado. Sistema de navegación y cámara de retroceso incluidos.',
    photos: [
      '/images/vehicles/volkswagen-golf/1.webp',
      '/images/vehicles/volkswagen-golf/2.webp',
      '/images/vehicles/volkswagen-golf/3.webp',
      '/images/vehicles/volkswagen-golf/4.webp'
    ],
    basePrice: 15000,
    currentPrice: 18500,
    winningBidderEmail: 'comprador@email.com',
    bids: [
      { id: '1', amount: 15000, bidderEmail: 'comprador1@email.com', timestamp: new Date('2025-10-10T10:30:00') },
      { id: '2', amount: 16000, bidderEmail: 'comprador2@email.com', timestamp: new Date('2025-10-10T11:15:00') },
      { id: '3', amount: 17000, bidderEmail: 'comprador@email.com', timestamp: new Date('2025-10-10T14:20:00') },
      { id: '4', amount: 18500, bidderEmail: 'comprador@email.com', timestamp: new Date('2025-10-11T09:45:00') }
    ],
    startDate: new Date('2025-10-10T10:00:00'),
    endDate: new Date('2025-10-15T18:00:00'),
    status: 'En curso'
  },
  '2': {
    id: '2',
    brand: 'BMW',
    model: '120i',
    version: '1.6 coupe',
    year: '2020',
    description: 'BMW 120i en estado impecable. Segundo dueño. Mantenimiento completo al día. Interior deportivo con asientos de cuero negro. Sistema de sonido premium. Llantas deportivas originales BMW.',
    photos: [
      '/images/vehicles/bmw-120/1.webp',
      '/images/vehicles/bmw-120/2.webp',
      '/images/vehicles/bmw-120/3.webp',
      '/images/vehicles/bmw-120/4.webp'
    ],
    basePrice: 25000,
    currentPrice: 25000,
    winningBidderEmail: '',
    bids: [],
    startDate: new Date('2025-10-20T09:00:00'),
    endDate: new Date('2025-10-25T17:00:00'),
    status: 'Finalizada'
  },
  '4': {
    id: '4',
    brand: 'Fiat',
    model: '500 Abarth',
    version: '1.6 coupe',
    year: '2017',
    description: 'Fiat 500 Abarth deportivo único. Excelente performance y estilo italiano. Motor turbo en perfecto estado. Pintura original sin rayones. Interior deportivo con detalles Abarth. Escape deportivo original.',
    photos: [
      '/images/vehicles/fiat-500abarth/1.webp',
      '/images/vehicles/fiat-500abarth/2.webp',
      '/images/vehicles/fiat-500abarth/3.webp',
      '/images/vehicles/fiat-500abarth/4.webp'
    ],
    basePrice: 12000,
    currentPrice: 14500,
    winningBidderEmail: 'ganador@email.com',
    bids: [
      { id: '1', amount: 12000, bidderEmail: 'postor1@email.com', timestamp: new Date('2025-10-01T10:30:00') },
      { id: '2', amount: 13000, bidderEmail: 'postor2@email.com', timestamp: new Date('2025-10-01T14:15:00') },
      { id: '3', amount: 14500, bidderEmail: 'ganador@email.com', timestamp: new Date('2025-10-02T16:20:00') }
    ],
    startDate: new Date('2025-10-01T10:00:00'),
    endDate: new Date('2025-10-05T18:00:00'),
    status: 'Finalizada'
  }
}

const AuctionDetail = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState('')
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [lightboxPhotoIndex, setLightboxPhotoIndex] = useState(0)

  // Obtener subasta por ID, usar la primera por defecto
  const auction = mockAuctionDetails[id || '1'] || mockAuctionDetails['1']

  useEffect(() => {
    if (auction.status === 'En curso') {
      const timer = setInterval(() => {
        const now = new Date()
        const endTime = new Date(auction.endDate)
        const difference = endTime.getTime() - now.getTime()

        if (difference > 0) {
          const days = Math.floor(difference / (1000 * 60 * 60 * 24))
          const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
          const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
          const seconds = Math.floor((difference % (1000 * 60)) / 1000)

          setTimeRemaining(`${days}d ${hours}h ${minutes}m ${seconds}s`)
        } else {
          setTimeRemaining('Subasta finalizada')
          clearInterval(timer)
        }
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [auction.endDate, auction.status])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const nextPhoto = () => {
    setCurrentPhotoIndex((prev) => 
      prev === auction.photos.length - 1 ? 0 : prev + 1
    )
  }

  const prevPhoto = () => {
    setCurrentPhotoIndex((prev) => 
      prev === 0 ? auction.photos.length - 1 : prev - 1
    )
  }

  const openLightbox = (index: number) => {
    setLightboxPhotoIndex(index)
    setIsLightboxOpen(true)
  }

  const closeLightbox = () => {
    setIsLightboxOpen(false)
  }

  const prevLightboxPhoto = () => {
    setLightboxPhotoIndex((prev) => 
      prev === 0 ? auction.photos.length - 1 : prev - 1
    )
  }

  const nextLightboxPhoto = () => {
    setLightboxPhotoIndex((prev) => 
      prev === auction.photos.length - 1 ? 0 : prev + 1
    )
  }

  // Cerrar lightbox con tecla Escape
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeLightbox()
      } else if (event.key === 'ArrowLeft') {
        prevLightboxPhoto()
      } else if (event.key === 'ArrowRight') {
        nextLightboxPhoto()
      }
    }

    if (isLightboxOpen) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden' // Prevenir scroll del body
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [isLightboxOpen])

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      {/* Header */}
      <header className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <button
              onClick={() => navigate('/my-auctions')}
              className="text-secondary-600 hover:text-primary-600 transition-colors duration-200 mr-4"
            >
              <ArrowLeftIcon size={28} />
            </button>
            <h1 className="text-xl font-bold text-secondary-900">
              {auction.brand} {auction.model} {auction.year}
            </h1>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Galería de Fotos */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-secondary-900 mb-4">Fotos del Vehículo</h2>
            
            {/* Foto principal */}
            <div className="relative mb-4">
              <img
                src={auction.photos[currentPhotoIndex]}
                alt={`${auction.brand} ${auction.model} - Foto ${currentPhotoIndex + 1}`}
                className="w-full h-64 md:h-80 object-cover rounded-lg cursor-pointer transition-transform duration-200 hover:scale-105"
                onClick={() => openLightbox(currentPhotoIndex)}
              />
              
              {/* Controles de navegación */}
              {auction.photos.length > 1 && (
                <>
                  <button
                    onClick={prevPhoto}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 transition-all duration-200"
                  >
                    <ArrowLeftIcon size={20} />
                  </button>
                  <button
                    onClick={nextPhoto}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 transition-all duration-200"
                  >
                    <ArrowRightIcon size={20} />
                  </button>
                </>
              )}
              
              {/* Indicador de foto actual */}
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                {currentPhotoIndex + 1} / {auction.photos.length}
              </div>
            </div>

            {/* Miniaturas */}
            {auction.photos.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {auction.photos.map((photo: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => {
                      setCurrentPhotoIndex(index)
                      openLightbox(index)
                    }}
                    className={`flex-shrink-0 w-16 h-16 rounded border-2 overflow-hidden transition-transform duration-200 hover:scale-105 ${
                      index === currentPhotoIndex ? 'border-primary-500' : 'border-gray-200'
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

          {/* Información del Vehículo */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-secondary-900 mb-6">Información del Vehículo</h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium text-secondary-600">Marca:</span>
                  <div className="text-lg font-semibold text-secondary-800">{auction.brand}</div>
                </div>
                <div>
                  <span className="text-sm font-medium text-secondary-600">Modelo:</span>
                  <div className="text-lg font-semibold text-secondary-800">{auction.model}</div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium text-secondary-600">Versión:</span>
                  <div className="text-lg font-semibold text-secondary-800">{auction.version}</div>
                </div>
                <div>
                  <span className="text-sm font-medium text-secondary-600">Año:</span>
                  <div className="text-lg font-semibold text-secondary-800">{auction.year}</div>
                </div>
              </div>
              
              <div className="pt-4 border-t border-secondary-200">
                <span className="text-sm font-medium text-secondary-600 block mb-2">Descripción:</span>
                <div className="text-secondary-800 leading-relaxed whitespace-pre-line bg-secondary-50 p-4 rounded-lg">
                  {auction.description}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          {/* Información de la Subasta */}
          <div className="space-y-6">
            {/* Estado y Contador */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-secondary-900">Estado de la Subasta</h2>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  auction.status === 'En curso' 
                    ? 'bg-green-100 text-green-800 border border-green-200' 
                    : 'bg-gray-100 text-gray-800 border border-gray-200'
                }`}>
                  {auction.status}
                </span>
              </div>
              
              {auction.status === 'En curso' && (
                <div className="bg-primary-50 rounded-lg p-4 mb-4">
                  <h3 className="text-lg font-semibold text-primary-800 mb-2">Tiempo restante:</h3>
                  <div className="text-2xl font-bold text-primary-600">{timeRemaining}</div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-secondary-600">Inicio:</span>
                  <div className="text-secondary-800">{formatDate(auction.startDate)}</div>
                </div>
                <div>
                  <span className="font-medium text-secondary-600">Fin:</span>
                  <div className="text-secondary-800">{formatDate(auction.endDate)}</div>
                </div>
              </div>
            </div>

            {/* Precios */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-secondary-900 mb-4">Información de Precios</h2>
              
              <div className="space-y-4">
                <div>
                  <span className="text-sm font-medium text-secondary-600">Precio de base:</span>
                  <div className="text-lg font-bold text-secondary-800">{formatPrice(auction.basePrice)}</div>
                </div>
                
                <div>
                  <span className="text-sm font-medium text-secondary-600">Precio actual:</span>
                  <div className="text-2xl font-bold text-primary-600">{formatPrice(auction.currentPrice)}</div>
                  {auction.winningBidderEmail && (
                    <div className="text-sm text-secondary-500 mt-1">
                      Oferta de: {auction.winningBidderEmail}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Historial de Ofertas */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-secondary-900 mb-4">Historial de Ofertas</h2>
              
              {auction.bids.length > 0 ? (
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {auction.bids.map((bid: Bid) => (
                    <div key={bid.id} className="flex justify-between items-center py-2 px-3 bg-secondary-50 rounded">
                      <div>
                        <div className="font-semibold text-secondary-800">{formatPrice(bid.amount)}</div>
                        <div className="text-sm text-secondary-600">{bid.bidderEmail}</div>
                      </div>
                      <div className="text-sm text-secondary-500">
                        {formatDate(bid.timestamp)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-secondary-500">
                  <p>Aún no hay ofertas para esta subasta</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {isLightboxOpen && (
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
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Navegación anterior */}
            {auction.photos.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  prevLightboxPhoto()
                }}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors z-10"
              >
                <ArrowLeftIcon size={32} />
              </button>
            )}

            {/* Imagen principal */}
            <img
              src={auction.photos[lightboxPhotoIndex]}
              alt={`${auction.brand} ${auction.model} - Foto ${lightboxPhotoIndex + 1}`}
              className="max-w-full max-h-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />

            {/* Navegación siguiente */}
            {auction.photos.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  nextLightboxPhoto()
                }}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors z-10"
              >
                <ArrowRightIcon size={32} />
              </button>
            )}

            {/* Indicador de foto actual */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-3 py-2 rounded">
              {lightboxPhotoIndex + 1} / {auction.photos.length}
            </div>

            {/* Miniaturas en el lightbox */}
            {auction.photos.length > 1 && (
              <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 flex space-x-2 max-w-full overflow-x-auto px-4">
                {auction.photos.map((photo: string, index: number) => (
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

export default AuctionDetail