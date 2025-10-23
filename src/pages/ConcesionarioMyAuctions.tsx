import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeftIcon, EyeIcon, ClockIcon, TrophyIcon, DollarSignIcon } from '../components/Icons'

interface Auction {
  id: string
  brand: string
  model: string
  year: string
  status: 'En curso' | 'Finalizada'
  currentPrice: number
  basePrice: number
  startDate: Date
  endDate: Date
  winner: {
    username: string
    isTemporary: boolean // true si la subasta está activa, false si ya finalizó
  } | null
  myLastBid?: number // última oferta del concesionario actual
  isLeading?: boolean // si el concesionario actual va ganando
}

// Mock data para las subastas en las que participa el concesionario
const mockParticipatingAuctions: Auction[] = [
  {
    id: '1',
    brand: 'Volkswagen',
    model: 'Golf GTI',
    year: '2019',
    status: 'En curso',
    currentPrice: 22500,
    basePrice: 20000,
    startDate: new Date('2025-10-10T10:00:00'),
    endDate: new Date('2025-10-16T18:00:00'),
    winner: {
      username: 'AutoCenter_BA',
      isTemporary: true
    },
    myLastBid: 22000,
    isLeading: false
  },
  {
    id: '2',
    brand: 'Toyota',
    model: 'Corolla',
    year: '2020',
    status: 'En curso',
    currentPrice: 18500,
    basePrice: 16000,
    startDate: new Date('2025-10-12T09:00:00'),
    endDate: new Date('2025-10-17T17:00:00'),
    winner: {
      username: 'MiConcesionario',
      isTemporary: true
    },
    myLastBid: 18500,
    isLeading: true
  },
  {
    id: '3',
    brand: 'BMW',
    model: '320i',
    year: '2018',
    status: 'Finalizada',
    currentPrice: 28000,
    basePrice: 25000,
    startDate: new Date('2025-10-05T10:00:00'),
    endDate: new Date('2025-10-10T18:00:00'),
    winner: {
      username: 'AutoSur_Premium',
      isTemporary: false
    },
    myLastBid: 27500,
    isLeading: false
  },
  {
    id: '4',
    brand: 'Ford',
    model: 'Focus',
    year: '2021',
    status: 'Finalizada',
    currentPrice: 19800,
    basePrice: 18000,
    startDate: new Date('2025-10-01T11:00:00'),
    endDate: new Date('2025-10-08T16:00:00'),
    winner: {
      username: 'MiConcesionario',
      isTemporary: false
    },
    myLastBid: 19800,
    isLeading: true
  },
  {
    id: '5',
    brand: 'Chevrolet',
    model: 'Cruze',
    year: '2019',
    status: 'En curso',
    currentPrice: 16200,
    basePrice: 15000,
    startDate: new Date('2025-10-14T08:00:00'),
    endDate: new Date('2025-10-19T20:00:00'),
    winner: {
      username: 'AutoPlaza_Norte',
      isTemporary: true
    },
    myLastBid: 15800,
    isLeading: false
  }
]

const ConcesionarioMyAuctions = () => {
  const navigate = useNavigate()
  const [filter, setFilter] = useState<'all' | 'active' | 'finished'>('all')
  
  // Estado mutable para las subastas
  const [auctions, setAuctions] = useState<Auction[]>(mockParticipatingAuctions)
  
  // Estado para resaltar items actualizados
  const [updatedAuctionId, setUpdatedAuctionId] = useState<string | null>(null)
  
  // Estado para toast notifications
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  
  // Estados para el modal de ofertas
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedAuction, setSelectedAuction] = useState<Auction | null>(null)
  const [bidAmount, setBidAmount] = useState('')
  const [isSubmittingBid, setIsSubmittingBid] = useState(false)
  const [bidError, setBidError] = useState('')
  const [bidSuccess, setBidSuccess] = useState('')

  // Manejar tecla Escape para cerrar modal
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isModalOpen) {
        handleCloseModal()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isModalOpen])

  const filteredAuctions = auctions.filter(auction => {
    if (filter === 'active') return auction.status === 'En curso'
    if (filter === 'finished') return auction.status === 'Finalizada'
    return true
  })

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  const getRemainingTime = (endDate: Date) => {
    const now = new Date()
    const diff = endDate.getTime() - now.getTime()
    
    if (diff <= 0) return { text: 'Finalizada', percentage: 100, isUrgent: false }
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    
    // Calcular porcentaje basado en una duración estimada de 7 días
    const totalDuration = 7 * 24 * 60 * 60 * 1000 // 7 días en ms
    const elapsed = totalDuration - diff
    const percentage = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100))
    
    const isUrgent = diff < 24 * 60 * 60 * 1000 // menos de 24 horas
    
    let text = ''
    if (days > 0) text = `${days}d ${hours}h`
    else if (hours > 0) text = `${hours}h ${minutes}m`
    else text = `${minutes}m`
    
    return { text, percentage, isUrgent }
  }

  const getStatusColor = (status: string, isLeading?: boolean) => {
    if (status === 'En curso') {
      return isLeading 
        ? 'bg-green-100 text-green-800 border-green-200' 
        : 'bg-blue-100 text-blue-800 border-blue-200'
    }
    if (status === 'Finalizada') {
      return isLeading 
        ? 'bg-green-100 text-green-800 border-green-200' 
        : 'bg-gray-100 text-gray-800 border-gray-200'
    }
    return 'bg-gray-100 text-gray-800 border-gray-200'
  }

  const getWinnerStatus = (auction: Auction) => {
    if (!auction.winner) return ''
    
    if (auction.isLeading) {
      return auction.status === 'En curso' 
        ? '🥇 Liderando' 
        : '🏆 Ganador'
    }
    
    return auction.winner.isTemporary 
      ? `🏃‍♂️ ${auction.winner.username}` 
      : `🏆 ${auction.winner.username}`
  }

  const handleViewAuction = (auctionId: string) => {
    navigate(`/auction-detail/${auctionId}`)
  }

  const handlePlaceBid = (auction: Auction) => {
    setSelectedAuction(auction)
    setBidAmount('')
    setBidError('')
    setBidSuccess('')
    setIsModalOpen(true)
  }
  
  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedAuction(null)
    setBidAmount('')
    setBidError('')
    setBidSuccess('')
  }
  
  // Función para actualizar una subasta específica en la lista
  const updateAuctionInList = (auctionId: string, updates: Partial<Auction>) => {
    setAuctions(prevAuctions => 
      prevAuctions.map(auction => 
        auction.id === auctionId 
          ? { ...auction, ...updates }
          : auction
      )
    )
    
    // Resaltar el item actualizado
    setUpdatedAuctionId(auctionId)
    setTimeout(() => setUpdatedAuctionId(null), 3000) // Quitar highlight después de 3 segundos
  }
  
  // Función para mostrar toast notification
  const showToastNotification = (message: string) => {
    setToastMessage(message)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 4000) // Ocultar después de 4 segundos
  }
  
  // Función para manejar el envío de ofertas
  const handleBidSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedAuction) return
    
    if (selectedAuction.status !== 'En curso') {
      setBidError('Solo se puede ofertar en subastas activas')
      return
    }
    
    const bidValue = parseFloat(bidAmount)
    
    if (isNaN(bidValue) || bidValue <= 0) {
      setBidError('Ingresa un precio válido')
      return
    }
    
    if (bidValue <= selectedAuction.currentPrice) {
      setBidError('El precio de la oferta no puede ser menor al precio actual')
      return
    }
    
    // Limpiar errores previos
    setBidError('')
    setIsSubmittingBid(true)
    
    try {
      // Simular API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Actualizar la subasta en la lista en tiempo real
      const updatedAuctionData = {
        currentPrice: bidValue,
        winner: {
          username: 'MiConcesionario',
          isTemporary: true
        },
        myLastBid: bidValue,
        isLeading: true
      }
      
      // Actualizar en la lista
      updateAuctionInList(selectedAuction.id, updatedAuctionData)
      
      // También actualizar la subasta seleccionada para el modal
      setSelectedAuction(prev => prev ? { ...prev, ...updatedAuctionData } : null)
      
      setBidSuccess('¡Oferta realizada con éxito! Ahora estás liderando la subasta.')
      setBidAmount('')
      
      // Mostrar toast notification
      showToastNotification(`¡Oferta de ${formatPrice(bidValue)} realizada con éxito en ${selectedAuction.brand} ${selectedAuction.model}!`)
      
      // Cerrar modal después de 2 segundos
      setTimeout(() => {
        handleCloseModal()
      }, 2000)
      
    } catch (error) {
      setBidError('Error al realizar la oferta. Intenta nuevamente.')
    } finally {
      setIsSubmittingBid(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="text-secondary-600 hover:text-secondary-800 transition-colors duration-200"
              >
                <ArrowLeftIcon size={24} />
              </button>
              <h1 className="text-xl font-bold text-secondary-900">Mis Subastas</h1>
            </div>
            
            {/* Filtros */}
            <div className="flex space-x-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  filter === 'all'
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-secondary-600 hover:bg-secondary-50 border border-secondary-200'
                }`}
              >
                Todas ({auctions.length})
              </button>
              <button
                onClick={() => setFilter('active')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  filter === 'active'
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-secondary-600 hover:bg-secondary-50 border border-secondary-200'
                }`}
              >
                Activas ({auctions.filter(a => a.status === 'En curso').length})
              </button>
              <button
                onClick={() => setFilter('finished')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  filter === 'finished'
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-secondary-600 hover:bg-secondary-50 border border-secondary-200'
                }`}
              >
                Finalizadas ({auctions.filter(a => a.status === 'Finalizada').length})
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-secondary-600">Total Participando</p>
                <p className="text-2xl font-bold text-secondary-900">{auctions.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100">
                <ClockIcon className="text-green-600" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-secondary-600">Activas</p>
                <p className="text-2xl font-bold text-secondary-900">
                  {auctions.filter(a => a.status === 'En curso').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100">
                <TrophyIcon className="text-yellow-600" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-secondary-600">Liderando</p>
                <p className="text-2xl font-bold text-secondary-900">
                  {auctions.filter(a => a.isLeading && a.status === 'En curso').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-secondary-600">Ganadas</p>
                <p className="text-2xl font-bold text-secondary-900">
                  {auctions.filter(a => a.isLeading && a.status === 'Finalizada').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {filteredAuctions.map((auction) => (
            <div 
              key={auction.id} 
              className={`bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all duration-200 ${
                updatedAuctionId === auction.id 
                  ? 'ring-2 ring-green-500 ring-opacity-50 bg-green-50' 
                  : ''
              }`}
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                {/* Información del Vehículo - 3 columnas */}
                <div className="lg:col-span-3">
                  <h3 className="text-xl font-bold text-secondary-900 mb-2">
                    {auction.brand} {auction.model}
                  </h3>
                  <p className="text-lg text-secondary-600 mb-3">Año {auction.year}</p>
                  
                  <div className="flex items-center mb-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(auction.status, auction.isLeading)}`}>
                      {auction.status} {auction.isLeading && (auction.status === 'En curso' ? '· Liderando' : '· Ganaste')}
                    </span>
                    {updatedAuctionId === auction.id && auction.isLeading && (
                      <span className="ml-2 px-2 py-1 bg-green-600 text-white text-xs rounded-full animate-pulse">
                        ¡Actualizado!
                      </span>
                    )}
                  </div>

                  {/* Tiempo restante para subastas activas */}
                  {auction.status === 'En curso' && (
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-secondary-600">
                        <ClockIcon size={16} className="mr-1" />
                        <span>Tiempo restante: {getRemainingTime(auction.endDate).text}</span>
                      </div>
                      {/* Barra de progreso */}
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${
                            getRemainingTime(auction.endDate).isUrgent 
                              ? 'bg-red-500' 
                              : 'bg-blue-500'
                          }`}
                          style={{ width: `${100 - getRemainingTime(auction.endDate).percentage}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Precios - 3 columnas */}
                <div className="lg:col-span-3 space-y-3">
                  <div>
                    <span className="text-sm font-medium text-secondary-600 block">Precio actual:</span>
                    <span className="text-2xl font-bold text-primary-600">{formatPrice(auction.currentPrice)}</span>
                    {auction.myLastBid && auction.currentPrice > auction.myLastBid && (
                      <span className="ml-2 text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
                        +{formatPrice(auction.currentPrice - auction.myLastBid)} desde tu oferta
                      </span>
                    )}
                  </div>
                  
                  <div>
                    <span className="text-sm font-medium text-secondary-600 block">Precio base:</span>
                    <span className="text-lg text-secondary-800">{formatPrice(auction.basePrice)}</span>
                  </div>

                  {auction.myLastBid && (
                    <div>
                      <span className="text-sm font-medium text-secondary-600 block">Mi última oferta:</span>
                      <div className="flex items-center space-x-2">
                        <span className={`text-lg font-semibold ${auction.isLeading ? 'text-green-600' : 'text-orange-600'}`}>
                          {formatPrice(auction.myLastBid)}
                        </span>
                        {!auction.isLeading && auction.status === 'En curso' && (
                          <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full animate-pulse">
                            Superado
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Fechas - 2 columnas */}
                <div className="lg:col-span-2 space-y-3">
                  <div>
                    <span className="text-sm font-medium text-secondary-600 block">Inicio:</span>
                    <span className="text-sm text-secondary-800">{formatDate(auction.startDate)}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-secondary-600 block">Fin:</span>
                    <span className="text-sm text-secondary-800">{formatDate(auction.endDate)}</span>
                  </div>
                </div>

                {/* Ganador - 2 columnas */}
                <div className="lg:col-span-2">
                  <span className="text-sm font-medium text-secondary-600 block mb-1">Ganador:</span>
                  {auction.winner ? (
                    <div className="flex items-center space-x-2">
                      <TrophyIcon 
                        size={16} 
                        className={auction.isLeading ? 'text-yellow-500' : 'text-secondary-400'} 
                      />
                      <span className={`text-sm font-medium ${
                        auction.isLeading ? 'text-green-600' : 'text-secondary-700'
                      }`}>
                        {getWinnerStatus(auction)}
                      </span>
                    </div>
                  ) : (
                    <span className="text-sm text-secondary-500 italic">Sin ofertas</span>
                  )}
                  
                  {auction.status === 'En curso' && auction.winner?.isTemporary && (
                    <p className="text-xs text-secondary-500 mt-1">
                      {auction.isLeading ? 'Mantén tu liderazgo' : 'Temporal'}
                    </p>
                  )}
                </div>

                {/* Acciones - 2 columnas */}
                <div className="lg:col-span-2 flex flex-col space-y-2">
                  <button
                    onClick={() => handleViewAuction(auction.id)}
                    className="flex items-center justify-center space-x-2 bg-secondary-600 hover:bg-secondary-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                  >
                    <EyeIcon size={18} />
                    <span>Ver detalles</span>
                  </button>
                  
                  {auction.status === 'En curso' && (
                    <button
                      onClick={() => handlePlaceBid(auction)}
                      className={`flex items-center justify-center space-x-2 font-medium py-2 px-4 rounded-lg transition-colors duration-200 ${
                        auction.isLeading
                          ? 'bg-green-600 hover:bg-green-700 text-white'
                          : 'bg-primary-600 hover:bg-primary-700 text-white'
                      }`}
                    >
                      <DollarSignIcon size={18} />
                      <span>{auction.isLeading ? 'Mejorar oferta' : 'Pujar'}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {filteredAuctions.length === 0 && (
            <div className="bg-white rounded-lg shadow-lg p-12 text-center">
              <div className="text-secondary-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-secondary-900 mb-2">
                {filter === 'all' && 'No estás participando en ninguna subasta'}
                {filter === 'active' && 'No tienes subastas activas'}
                {filter === 'finished' && 'No tienes subastas finalizadas'}
              </h3>
              <p className="text-secondary-600 mb-6">
                {filter === 'all' && 'Explora las subastas disponibles y comienza a pujar en los vehículos que te interesen.'}
                {filter === 'active' && 'Busca subastas activas para participar y encontrar tu próximo vehículo.'}
                {filter === 'finished' && 'Aún no has participado en subastas que hayan finalizado.'}
              </p>
              <button
                onClick={() => navigate('/dashboard')}
                className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200"
              >
                Explorar Subastas
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Modal de Ofertas */}
      {isModalOpen && selectedAuction && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={(e) => {
            // Cerrar modal si se hace clic en el overlay
            if (e.target === e.currentTarget) {
              handleCloseModal()
            }
          }}
        >
          <div 
            className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-screen overflow-y-auto"
            onClick={(e) => e.stopPropagation()} // Prevenir que el clic en el modal cierre el overlay
          >
            {/* Header del Modal */}
            <div className="flex items-center justify-between p-6 border-b border-secondary-200">
              <div className="flex items-center">
                <DollarSignIcon className="text-primary-600 mr-3" size={24} />
                <div>
                  <h2 className="text-xl font-bold text-secondary-900">Realizar Oferta</h2>
                  <p className="text-sm text-secondary-600">
                    {selectedAuction.brand} {selectedAuction.model} {selectedAuction.year}
                  </p>
                </div>
              </div>
              <button
                onClick={handleCloseModal}
                className="text-secondary-400 hover:text-secondary-600 transition-colors duration-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Contenido del Modal */}
            <div className="p-6">
              {selectedAuction.isLeading && (
                <div className="mb-4 flex items-center text-green-600 bg-green-50 p-3 rounded-lg">
                  <TrophyIcon size={20} className="mr-2" />
                  <span className="text-sm font-medium">Estás liderando esta subasta</span>
                </div>
              )}

              {/* Información del precio actual */}
              <div className="bg-secondary-50 rounded-lg p-4 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-secondary-600">Precio actual:</span>
                  <span className="text-2xl font-bold text-primary-600">{formatPrice(selectedAuction.currentPrice)}</span>
                </div>
                {selectedAuction.winner && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-secondary-600">Ganador actual:</span>
                    <span className="text-sm font-medium text-secondary-800">
                      {selectedAuction.isLeading ? 'Tú' : selectedAuction.winner.username}
                    </span>
                  </div>
                )}
              </div>

              {/* Formulario de oferta */}
              <form onSubmit={handleBidSubmit} className="space-y-4">
                <div>
                  <label htmlFor="bidAmount" className="block text-sm font-medium text-secondary-700 mb-2">
                    Tu oferta (debe ser mayor a {formatPrice(selectedAuction.currentPrice)})
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
                      placeholder={`Mínimo ${selectedAuction.currentPrice + 1}`}
                      min={selectedAuction.currentPrice + 1}
                      step="1"
                      className={`w-full pl-8 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors ${
                        bidError ? 'border-red-300 bg-red-50' : 'border-secondary-300'
                      }`}
                      disabled={isSubmittingBid}
                      autoFocus
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

                {/* Botones de acción */}
                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="flex-1 py-3 px-4 border border-secondary-300 text-secondary-700 font-medium rounded-lg hover:bg-secondary-50 transition-colors duration-200"
                    disabled={isSubmittingBid}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingBid || !bidAmount || parseFloat(bidAmount) <= selectedAuction.currentPrice}
                    className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                      isSubmittingBid || !bidAmount || parseFloat(bidAmount) <= selectedAuction.currentPrice
                        ? 'bg-secondary-300 text-secondary-500 cursor-not-allowed'
                        : selectedAuction.isLeading
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
                        Procesando...
                      </div>
                    ) : selectedAuction.isLeading ? (
                      'Mejorar mi oferta'
                    ) : (
                      'Realizar oferta'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in-right">
          <div className="bg-green-600 text-white px-6 py-4 rounded-lg shadow-lg max-w-sm">
            <div className="flex items-center">
              <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="font-medium">¡Oferta exitosa!</p>
                <p className="text-sm opacity-90">{toastMessage}</p>
              </div>
              <button
                onClick={() => setShowToast(false)}
                className="ml-4 text-white hover:text-gray-200 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ConcesionarioMyAuctions