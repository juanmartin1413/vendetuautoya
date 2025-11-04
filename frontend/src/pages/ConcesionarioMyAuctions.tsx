import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeftIcon, DollarSignIcon, TrophyIcon, ClockIcon } from '../components/Icons'
import AuctionItem from '../components/AuctionItem'

interface Auction {
  id: string
  brand: string
  model: string
  version: string
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
  image: string // foto de portada del vehículo
}

// Función para obtener la imagen del vehículo basado en marca y modelo
const getVehicleImage = (brand: string, model: string): string => {
  const vehicleMap: { [key: string]: string } = {
    // Audi
    'Audi-A1': '/images/vehicles/audi-a1/1.webp',
    'Audi-A3': '/images/vehicles/audi-a1/1.webp', // Usamos A1 como fallback para A3
    'Audi-Q5': '/images/vehicles/audi-a1/1.webp', // Usamos A1 como fallback para Q5
    
    // BMW
    'BMW-120i': '/images/vehicles/bmw-120/1.webp',
    'BMW-220i': '/images/vehicles/bmw-220i/1.webp',
    'BMW-X1': '/images/vehicles/bmw-120/1.webp', // Usamos 120 como fallback para X1
    
    // Fiat
    'Fiat-500 Abarth': '/images/vehicles/fiat-500abarth/1.webp',
    'Fiat-Chronos': '/images/vehicles/fiat-500abarth/1.webp', // Usamos 500 Abarth como fallback
    
    // Peugeot
    'Peugeot-208': '/images/vehicles/peugeot-208/1.webp',
    'Peugeot-3008': '/images/vehicles/peugeot-208/1.webp', // Usamos 208 como fallback para 3008
    
    // Renault
    'Renault-Koleos': '/images/vehicles/peugeot-208/1.webp', // Usamos Peugeot como fallback
    
    // Volkswagen
    'Volkswagen-Gol': '/images/vehicles/volkswagen-golf/1.webp', // Usamos Golf como fallback para Gol
    'Volkswagen-Golf': '/images/vehicles/volkswagen-golf/1.webp',
    'Volkswagen-Scirocco': '/images/vehicles/volkswagen-golf/1.webp', // Usamos Golf como fallback
    
    // Ford (aunque no está en las carpetas, agregamos fallback)
    'Ford-Mustang': '/images/vehicles/ford-mustang/1.webp'
  }
  
  const key = `${brand}-${model}`
  return vehicleMap[key] || '/images/vehicles/audi-a1/1.webp' // Fallback por defecto
}

// Mock data para las subastas en las que participa el concesionario
const mockParticipatingAuctions: Auction[] = [
  {
    id: '1',
    brand: 'Volkswagen',
    model: 'Golf',
    version: '2.0 5 ptas',
    year: '2019',
    status: 'En curso',
    currentPrice: 22500,
    basePrice: 20000,
    startDate: new Date('2025-10-20T10:00:00'),
    endDate: new Date('2025-10-30T18:00:00'),
    winner: {
      username: 'AutoCenter_BA',
      isTemporary: true
    },
    myLastBid: 22000,
    isLeading: false,
    image: getVehicleImage('Volkswagen', 'Golf')
  },
  {
    id: '2',
    brand: 'Peugeot',
    model: '208',
    version: '1.6 coupe',
    year: '2020',
    status: 'En curso',
    currentPrice: 20500,
    basePrice: 18000,
    startDate: new Date('2025-10-21T09:00:00'),
    endDate: new Date('2025-10-28T17:00:00'),
    winner: {
      username: 'MiConcesionario',
      isTemporary: true
    },
    myLastBid: 20500,
    isLeading: true,
    image: getVehicleImage('Peugeot', '208')
  },
  {
    id: '3',
    brand: 'BMW',
    model: '220i',
    version: '2.0 5 ptas',
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
    isLeading: false,
    image: getVehicleImage('BMW', '220i')
  },
  {
    id: '4',
    brand: 'Fiat',
    model: '500 Abarth',
    version: '1.6 coupe',
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
    isLeading: true,
    image: getVehicleImage('Fiat', '500 Abarth')
  },
  {
    id: '5',
    brand: 'Audi',
    model: 'A1',
    version: '1.6 coupe',
    year: '2019',
    status: 'En curso',
    currentPrice: 16200,
    basePrice: 15000,
    startDate: new Date('2025-10-22T08:00:00'),
    endDate: new Date('2025-11-01T20:00:00'),
    winner: {
      username: 'AutoPlaza_Norte',
      isTemporary: true
    },
    myLastBid: 15800,
    isLeading: false,
    image: getVehicleImage('Audi', 'A1')
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
            <AuctionItem
              key={auction.id}
              auction={auction}
              onViewDetails={handleViewAuction}
              onPlaceBid={handlePlaceBid}
              isUpdated={updatedAuctionId === auction.id}
              showUpdatedBadge={true}
            />
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