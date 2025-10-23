import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeftIcon, ArrowRightIcon, DollarSignIcon, TrophyIcon } from '../components/Icons'
import { useAuth } from '../contexts/AuthContext'

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
    model: 'Golf GTI',
    version: '2.0 Turbo 5 ptas',
    year: '2019',
    description: 'Volkswagen Golf GTI en excelentes condiciones. Motor turbo de alto rendimiento. Interior deportivo con asientos Recaro. Sistema de navegación y cámara de retroceso. Mantenimiento completo al día en concesionario oficial.',
    photos: [
      '/images/vehicles/volkswagen-golf/1.webp',
      '/images/vehicles/volkswagen-golf/2.webp',
      '/images/vehicles/volkswagen-golf/3.webp',
      '/images/vehicles/volkswagen-golf/4.webp'
    ],
    basePrice: 20000,
    currentPrice: 22500,
    winningBidderEmail: 'AutoCenter_BA@email.com',
    bids: [
      { id: '1', amount: 20000, bidderEmail: 'concesionario1@email.com', timestamp: new Date('2025-10-10T10:30:00') },
      { id: '2', amount: 21000, bidderEmail: 'MiConcesionario@email.com', timestamp: new Date('2025-10-10T11:15:00') },
      { id: '3', amount: 22000, bidderEmail: 'MiConcesionario@email.com', timestamp: new Date('2025-10-10T14:20:00') },
      { id: '4', amount: 22500, bidderEmail: 'AutoCenter_BA@email.com', timestamp: new Date('2025-10-11T09:45:00') }
    ],
    startDate: new Date('2025-10-10T10:00:00'),
    endDate: new Date('2025-10-16T18:00:00'),
    status: 'En curso'
  },
  '2': {
    id: '2',
    brand: 'Toyota',
    model: 'Corolla',
    version: '1.8 XEI CVT',
    year: '2020',
    description: 'Toyota Corolla XEI CVT en estado impecable. Transmisión automática CVT. Aire acondicionado automático. Sistema multimedia con pantalla táctil. Cámara de retroceso. Único dueño, service completo.',
    photos: [
      '/images/vehicles/bmw-120/1.webp',
      '/images/vehicles/bmw-120/2.webp',
      '/images/vehicles/bmw-120/3.webp',
      '/images/vehicles/bmw-120/4.webp'
    ],
    basePrice: 16000,
    currentPrice: 18500,
    winningBidderEmail: 'MiConcesionario@email.com',
    bids: [
      { id: '1', amount: 16000, bidderEmail: 'concesionario1@email.com', timestamp: new Date('2025-10-12T09:30:00') },
      { id: '2', amount: 17000, bidderEmail: 'AutoSur@email.com', timestamp: new Date('2025-10-12T11:15:00') },
      { id: '3', amount: 18500, bidderEmail: 'MiConcesionario@email.com', timestamp: new Date('2025-10-12T14:20:00') }
    ],
    startDate: new Date('2025-10-12T09:00:00'),
    endDate: new Date('2025-10-17T17:00:00'),
    status: 'En curso'
  },
  '3': {
    id: '3',
    brand: 'BMW',
    model: '320i',
    version: '2.0 Sport',
    year: '2018',
    description: 'BMW 320i Sport en estado impecable. Motor turbo de 2.0 litros. Interior de cuero negro. Sistema de navegación profesional. Llantas deportivas BMW originales. Mantenimiento premium completo.',
    photos: [
      '/images/vehicles/bmw-120/1.webp',
      '/images/vehicles/bmw-120/2.webp',
      '/images/vehicles/bmw-120/3.webp',
      '/images/vehicles/bmw-120/4.webp'
    ],
    basePrice: 25000,
    currentPrice: 28000,
    winningBidderEmail: 'AutoSur_Premium@email.com',
    bids: [
      { id: '1', amount: 25000, bidderEmail: 'concesionario1@email.com', timestamp: new Date('2025-10-05T10:30:00') },
      { id: '2', amount: 26000, bidderEmail: 'MiConcesionario@email.com', timestamp: new Date('2025-10-05T12:15:00') },
      { id: '3', amount: 27500, bidderEmail: 'MiConcesionario@email.com', timestamp: new Date('2025-10-05T15:20:00') },
      { id: '4', amount: 28000, bidderEmail: 'AutoSur_Premium@email.com', timestamp: new Date('2025-10-06T09:45:00') }
    ],
    startDate: new Date('2025-10-05T10:00:00'),
    endDate: new Date('2025-10-10T18:00:00'),
    status: 'Finalizada'
  },
  '4': {
    id: '4',
    brand: 'Ford',
    model: 'Focus',
    version: '2.0 Titanium',
    year: '2021',
    description: 'Ford Focus Titanium 2021 como nuevo. Motor EcoBoost turbo. Interior premium con asientos de cuero. Sistema SYNC 3 con Apple CarPlay. Sensores de estacionamiento. Garantía de fábrica vigente.',
    photos: [
      '/images/vehicles/fiat-500abarth/1.webp',
      '/images/vehicles/fiat-500abarth/2.webp',
      '/images/vehicles/fiat-500abarth/3.webp',
      '/images/vehicles/fiat-500abarth/4.webp'
    ],
    basePrice: 18000,
    currentPrice: 19800,
    winningBidderEmail: 'MiConcesionario@email.com',
    bids: [
      { id: '1', amount: 18000, bidderEmail: 'concesionario1@email.com', timestamp: new Date('2025-10-01T11:30:00') },
      { id: '2', amount: 19000, bidderEmail: 'AutoNorte@email.com', timestamp: new Date('2025-10-01T14:15:00') },
      { id: '3', amount: 19800, bidderEmail: 'MiConcesionario@email.com', timestamp: new Date('2025-10-02T16:20:00') }
    ],
    startDate: new Date('2025-10-01T11:00:00'),
    endDate: new Date('2025-10-08T16:00:00'),
    status: 'Finalizada'
  },
  '5': {
    id: '5',
    brand: 'Chevrolet',
    model: 'Cruze',
    version: '1.4T LTZ',
    year: '2019',
    description: 'Chevrolet Cruze LTZ con motor turbo. Transmisión automática de 6 velocidades. Interior premium con cuero. OnStar con WiFi integrado. Cámara de retroceso y sensores. Excelente estado general.',
    photos: [
      '/images/vehicles/volkswagen-golf/1.webp',
      '/images/vehicles/volkswagen-golf/2.webp',
      '/images/vehicles/volkswagen-golf/3.webp',
      '/images/vehicles/volkswagen-golf/4.webp'
    ],
    basePrice: 15000,
    currentPrice: 16200,
    winningBidderEmail: 'AutoPlaza_Norte@email.com',
    bids: [
      { id: '1', amount: 15000, bidderEmail: 'concesionario1@email.com', timestamp: new Date('2025-10-14T08:30:00') },
      { id: '2', amount: 15800, bidderEmail: 'MiConcesionario@email.com', timestamp: new Date('2025-10-14T10:15:00') },
      { id: '3', amount: 16200, bidderEmail: 'AutoPlaza_Norte@email.com', timestamp: new Date('2025-10-14T14:20:00') }
    ],
    startDate: new Date('2025-10-14T08:00:00'),
    endDate: new Date('2025-10-19T20:00:00'),
    status: 'En curso'
  }
}

const AuctionDetail = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState('')
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [lightboxPhotoIndex, setLightboxPhotoIndex] = useState(0)
  
  // Estados para ofertas (solo concesionarios)
  const [bidAmount, setBidAmount] = useState('')
  const [isSubmittingBid, setIsSubmittingBid] = useState(false)
  const [bidError, setBidError] = useState('')
  const [bidSuccess, setBidSuccess] = useState('')
  
  // Estado local de la subasta (para simular actualizaciones en tiempo real)
  const [auctionData, setAuctionData] = useState<AuctionDetail | null>(null)

  // Obtener subasta por ID, usar la primera por defecto
  const auction = auctionData || mockAuctionDetails[id || '1'] || mockAuctionDetails['1']
  
  // Inicializar datos de la subasta
  useEffect(() => {
    const initialAuction = mockAuctionDetails[id || '1'] || mockAuctionDetails['1']
    setAuctionData(initialAuction)
  }, [id])

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

  // Funciones para manejar ofertas
  const handleBidSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user || user.type !== 'concesionario') {
      setBidError('Solo los concesionarios pueden hacer ofertas')
      return
    }
    
    if (auction.status !== 'En curso') {
      setBidError('Solo se puede ofertar en subastas activas')
      return
    }
    
    const bidValue = parseFloat(bidAmount)
    
    if (isNaN(bidValue) || bidValue <= 0) {
      setBidError('Ingresa un precio válido')
      return
    }
    
    if (bidValue <= auction.currentPrice) {
      setBidError('El precio de la oferta no puede ser menor al precio actual')
      return
    }
    
    // Limpiar errores previos
    setBidError('')
    setIsSubmittingBid(true)
    
    try {
      // Simular API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Crear nueva oferta
      const newBid: Bid = {
        id: Date.now().toString(),
        amount: bidValue,
        bidderEmail: user.email || 'concesionario@example.com',
        timestamp: new Date()
      }
      
      // Actualizar datos de la subasta
      if (auctionData) {
        const updatedAuction = {
          ...auctionData,
          currentPrice: bidValue,
          winningBidderEmail: user.email || 'concesionario@example.com',
          bids: [...auctionData.bids, newBid].sort((a, b) => b.amount - a.amount)
        }
        setAuctionData(updatedAuction)
      }
      
      setBidSuccess('¡Oferta realizada con éxito! Ahora estás liderando la subasta.')
      setBidAmount('')
      
      // Limpiar mensaje de éxito después de 3 segundos
      setTimeout(() => setBidSuccess(''), 3000)
      
    } catch (error) {
      setBidError('Error al realizar la oferta. Intenta nuevamente.')
    } finally {
      setIsSubmittingBid(false)
    }
  }
  
  const isUserWinning = () => {
    return user?.email === auction.winningBidderEmail
  }
  
  // Función para determinar la ruta de regreso según el tipo de usuario
  const getBackRoute = () => {
    if (!user) return '/dashboard'
    
    return user.type === 'concesionario' 
      ? '/concesionario-my-auctions' 
      : '/my-auctions'
  }
  
  const handleGoBack = () => {
    navigate(getBackRoute())
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
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center">
              <button
                onClick={handleGoBack}
                className="text-secondary-600 hover:text-primary-600 transition-colors duration-200 mr-4"
                title={`Volver a ${user?.type === 'concesionario' ? 'Mis Subastas (Concesionario)' : 'Mis Subastas (Vendedor)'}`}
              >
                <ArrowLeftIcon size={28} />
              </button>
              
              <div className="flex flex-col">
                <h1 className="text-xl font-bold text-secondary-900">
                  {auction.brand} {auction.model} {auction.year}
                </h1>
                
                {/* Breadcrumb de navegación */}
                {user && (
                  <div className="flex items-center text-sm text-secondary-600 mt-1">
                    <span>Dashboard</span>
                    <span className="mx-2">→</span>
                    <button 
                      onClick={handleGoBack}
                      className="hover:text-primary-600 transition-colors duration-200"
                    >
                      {user.type === 'concesionario' ? 'Mis Subastas (Concesionario)' : 'Mis Subastas (Vendedor)'}
                    </button>
                    <span className="mx-2">→</span>
                    <span className="text-secondary-800 font-medium">Detalle</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Indicador del tipo de perfil */}
            {user && (
              <div className="flex items-center">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  user.type === 'concesionario' 
                    ? 'bg-blue-100 text-blue-800 border border-blue-200'
                    : 'bg-green-100 text-green-800 border border-green-200'
                }`}>
                  {user.type === 'concesionario' ? 'Vista Concesionario' : 'Vista Vendedor'}
                </span>
              </div>
            )}
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

            {/* Sección de Ofertas para Concesionarios */}
            {user && user.type === 'concesionario' && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center mb-4">
                  <DollarSignIcon className="text-primary-600 mr-2" size={24} />
                  <h2 className="text-2xl font-bold text-secondary-900">Realizar Oferta</h2>
                  {isUserWinning() && auction.status === 'En curso' && (
                    <div className="ml-auto flex items-center text-green-600">
                      <TrophyIcon size={20} className="mr-1" />
                      <span className="text-sm font-medium">Estás liderando</span>
                    </div>
                  )}
                </div>

                {auction.status === 'En curso' ? (
                  <form onSubmit={handleBidSubmit} className="space-y-4">
                    {/* Información del precio actual */}
                    <div className="bg-secondary-50 rounded-lg p-4 mb-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-secondary-600">Precio actual:</span>
                        <span className="text-2xl font-bold text-primary-600">{formatPrice(auction.currentPrice)}</span>
                      </div>
                      {auction.winningBidderEmail && (
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-sm text-secondary-600">Ganador actual:</span>
                          <span className="text-sm font-medium text-secondary-800">
                            {isUserWinning() ? 'Tú' : auction.winningBidderEmail}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Campo de entrada para la oferta */}
                    <div>
                      <label htmlFor="bidAmount" className="block text-sm font-medium text-secondary-700 mb-2">
                        Tu oferta (debe ser mayor a {formatPrice(auction.currentPrice)})
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-500">$</span>
                        <input
                          type="number"
                          id="bidAmount"
                          value={bidAmount}
                          onChange={(e) => {
                            setBidAmount(e.target.value)
                            setBidError('') // Limpiar error al escribir
                          }}
                          placeholder={`Mínimo ${auction.currentPrice + 1}`}
                          min={auction.currentPrice + 1}
                          step="1"
                          className={`w-full pl-8 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors ${
                            bidError ? 'border-red-300 bg-red-50' : 'border-secondary-300'
                          }`}
                          disabled={isSubmittingBid}
                        />
                      </div>
                    </div>

                    {/* Mensajes de error y éxito */}
                    {bidError && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <div className="flex items-center">
                          <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-red-700 text-sm">{bidError}</span>
                        </div>
                      </div>
                    )}

                    {bidSuccess && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                        <div className="flex items-center">
                          <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-green-700 text-sm">{bidSuccess}</span>
                        </div>
                      </div>
                    )}

                    {/* Botón de envío */}
                    <button
                      type="submit"
                      disabled={isSubmittingBid || !bidAmount || parseFloat(bidAmount) <= auction.currentPrice}
                      className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                        isSubmittingBid || !bidAmount || parseFloat(bidAmount) <= auction.currentPrice
                          ? 'bg-secondary-300 text-secondary-500 cursor-not-allowed'
                          : isUserWinning()
                          ? 'bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl'
                          : 'bg-primary-600 hover:bg-primary-700 text-white shadow-lg hover:shadow-xl'
                      }`}
                    >
                      {isSubmittingBid ? (
                        <div className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Procesando oferta...
                        </div>
                      ) : isUserWinning() ? (
                        'Mejorar mi oferta'
                      ) : (
                        'Realizar oferta'
                      )}
                    </button>
                  </form>
                ) : (
                  <div className="text-center py-8">
                    <div className="bg-gray-50 rounded-lg p-6">
                      <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Subasta Finalizada</h3>
                      <p className="text-gray-600">
                        Esta subasta ha finalizado. Ya no es posible realizar ofertas.
                      </p>
                      {auction.winningBidderEmail && (
                        <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
                          <p className="text-sm text-yellow-800">
                            <span className="font-medium">Ganador:</span> {isUserWinning() ? 'Tú' : auction.winningBidderEmail}
                          </p>
                          <p className="text-sm text-yellow-800">
                            <span className="font-medium">Precio final:</span> {formatPrice(auction.currentPrice)}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

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