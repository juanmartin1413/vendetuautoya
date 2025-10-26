import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeftIcon, SearchIcon, DollarSignIcon, TrophyIcon } from '../components/Icons'
import AuctionItem from '../components/AuctionItem'

interface SearchFilters {
  brand: string
  model: string
  version: string
  yearFrom: string
  yearTo: string
  minPrice: string
  maxPrice: string
}

// Datos exactos del formulario de nueva subasta
const brandModels = {
  'Audi': ['A1', 'A3', 'Q5'],
  'BMW': ['120i', '220i', 'X1'],
  'Fiat': ['500 Abarth', 'Chronos'],
  'Peugeot': ['208', '3008'],
  'Renault': ['Koleos'],
  'Volkswagen': ['Gol', 'Golf', 'Scirocco']
}

const versions = ['1.6 coupe', '2.0 5 ptas']

// Función para obtener imagen local del vehículo
const getVehicleImage = (brand: string, model: string): string => {
  const brandModelMap: { [key: string]: { [key: string]: string } } = {
    'Audi': {
      'A1': '/images/vehicles/audi-a1/1.webp',
      'A3': '/images/vehicles/audi-a1/1.webp', // Fallback to A1 for A3
      'Q5': '/images/vehicles/audi-a1/1.webp'  // Fallback to A1 for Q5
    },
    'BMW': {
      '120i': '/images/vehicles/bmw-120/1.webp',
      '220i': '/images/vehicles/bmw-220i/1.webp',
      'X1': '/images/vehicles/bmw-120/1.webp'  // Fallback to 120 for X1
    },
    'Fiat': {
      '500 Abarth': '/images/vehicles/fiat-500abarth/1.webp',
      'Chronos': '/images/vehicles/fiat-500abarth/1.webp'  // Fallback
    },
    'Peugeot': {
      '208': '/images/vehicles/peugeot-208/1.webp',
      '3008': '/images/vehicles/peugeot-208/1.webp'  // Fallback
    },
    'Renault': {
      'Koleos': '/images/vehicles/peugeot-208/1.webp'  // Fallback to Peugeot
    },
    'Volkswagen': {
      'Gol': '/images/vehicles/volkswagen-golf/1.webp',  // Fallback to Golf
      'Golf': '/images/vehicles/volkswagen-golf/1.webp',
      'Scirocco': '/images/vehicles/volkswagen-golf/1.webp'  // Fallback to Golf
    }
  }

  const brandImages = brandModelMap[brand]
  if (brandImages && brandImages[model]) {
    return brandImages[model]
  }
  
  // Fallback para marcas/modelos no encontrados
  return '/images/vehicles/volkswagen-golf/1.webp'
}

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
    isTemporary: boolean
  } | null
  myLastBid?: number
  isLeading?: boolean
  image: string // Foto de portada
}

// Mock data para subastas disponibles (diferentes a las que ya participa)
const mockAvailableAuctions: Auction[] = [
  {
    id: 'search_1',
    brand: 'BMW',
    model: '120i',
    version: '2.0 5 ptas',
    year: '2020',
    status: 'En curso',
    currentPrice: 35000,
    basePrice: 32000,
    startDate: new Date('2025-10-15T10:00:00'),
    endDate: new Date('2025-10-25T18:00:00'),
    winner: {
      username: 'AutoSport_Premium',
      isTemporary: true
    },
    image: getVehicleImage('BMW', '120i'), // BMW
    // Sin myLastBid - el concesionario no ha participado
  },
  {
    id: 'search_2',
    brand: 'Audi',
    model: 'A3',
    version: '1.6 coupe',
    year: '2019',
    status: 'En curso',
    currentPrice: 28500,
    basePrice: 26000,
    startDate: new Date('2025-10-16T09:00:00'),
    endDate: new Date('2025-10-24T17:00:00'),
    winner: {
      username: 'MiConcesionario',
      isTemporary: true
    },
    myLastBid: 28500,
    isLeading: true,
    image: getVehicleImage('Audi', 'A3'), // Audi A3
  },
  {
    id: 'search_3',
    brand: 'Volkswagen',
    model: 'Golf',
    version: '2.0 5 ptas',
    year: '2021',
    status: 'En curso',
    currentPrice: 42000,
    basePrice: 38000,
    startDate: new Date('2025-10-17T11:00:00'),
    endDate: new Date('2025-10-26T16:00:00'),
    winner: {
      username: 'Premium_Motors',
      isTemporary: true
    },
    image: getVehicleImage('Volkswagen', 'Golf'), // VW Golf
    // Sin myLastBid - el concesionario no ha participado
  },
  {
    id: 'search_4',
    brand: 'BMW',
    model: 'X1',
    version: '1.6 coupe',
    year: '2020',
    status: 'En curso',
    currentPrice: 38500,
    basePrice: 35000,
    startDate: new Date('2025-10-18T08:00:00'),
    endDate: new Date('2025-10-27T19:00:00'),
    winner: {
      username: 'MiConcesionario',
      isTemporary: true
    },
    myLastBid: 38500,
    isLeading: true,
    image: getVehicleImage('BMW', 'X1'), // BMW X1
  },
  {
    id: 'search_5',
    brand: 'Fiat',
    model: '500 Abarth',
    version: '1.6 coupe',
    year: '2022',
    status: 'En curso',
    currentPrice: 31200,
    basePrice: 29000,
    startDate: new Date('2025-10-19T10:30:00'),
    endDate: new Date('2025-10-28T15:00:00'),
    winner: {
      username: 'Family_Cars',
      isTemporary: true
    },
    myLastBid: 30000,
    isLeading: false,
    image: getVehicleImage('Fiat', '500 Abarth'), // Fiat 500 Abarth
  },
  {
    id: 'search_6',
    brand: 'Peugeot',
    model: '208',
    version: '2.0 5 ptas',
    year: '2021',
    status: 'En curso',
    currentPrice: 26800,
    basePrice: 24500,
    startDate: new Date('2025-10-20T12:00:00'),
    endDate: new Date('2025-10-29T14:00:00'),
    winner: {
      username: 'Eco_Motors',
      isTemporary: true
    },
    image: getVehicleImage('Peugeot', '208'), // Peugeot 208
    // Sin myLastBid - el concesionario no ha participado
  }
]

const ConcesionarioSearch = () => {
  const navigate = useNavigate()
  const [filters, setFilters] = useState<SearchFilters>({
    brand: '',
    model: '',
    version: '',
    yearFrom: '',
    yearTo: '',
    minPrice: '',
    maxPrice: ''
  })
  
  const [searchResults, setSearchResults] = useState<Auction[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  
  // Estados para el modal de ofertas (reutilizando la lógica)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedAuction, setSelectedAuction] = useState<Auction | null>(null)
  const [bidAmount, setBidAmount] = useState('')
  const [isSubmittingBid, setIsSubmittingBid] = useState(false)
  const [bidError, setBidError] = useState('')
  const [bidSuccess, setBidSuccess] = useState('')
  
  // Estado para resaltar items actualizados y toast
  const [updatedAuctionId, setUpdatedAuctionId] = useState<string | null>(null)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')

  // Generar años desde 1990 hasta 2025
  const years = Array.from({ length: 2025 - 1990 + 1 }, (_, i) => (2025 - i).toString())

  const handleBrandChange = (brand: string) => {
    setFilters(prev => ({
      ...prev,
      brand,
      model: '' // Reset model when brand changes
    }))
  }

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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  const handleFilterChange = (field: keyof SearchFilters, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }))
  }

  const handleSearch = async () => {
    setIsSearching(true)
    setHasSearched(true)
    
    // Simular API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Filtrar resultados basado en los criterios
    let results = mockAvailableAuctions.filter(auction => {
      const matchBrand = !filters.brand || auction.brand.toLowerCase().includes(filters.brand.toLowerCase())
      const matchModel = !filters.model || auction.model.toLowerCase().includes(filters.model.toLowerCase())
      const matchVersion = !filters.version || auction.version.toLowerCase().includes(filters.version.toLowerCase())
      
      const auctionYear = parseInt(auction.year)
      const matchYearFrom = !filters.yearFrom || auctionYear >= parseInt(filters.yearFrom)
      const matchYearTo = !filters.yearTo || auctionYear <= parseInt(filters.yearTo)
      
      const matchMinPrice = !filters.minPrice || auction.currentPrice >= parseFloat(filters.minPrice)
      const matchMaxPrice = !filters.maxPrice || auction.currentPrice <= parseFloat(filters.maxPrice)
      
      return matchBrand && matchModel && matchVersion && matchYearFrom && matchYearTo && matchMinPrice && matchMaxPrice
    })
    
    setSearchResults(results)
    setIsSearching(false)
  }

  const handleClearFilters = () => {
    setFilters({
      brand: '',
      model: '',
      version: '',
      yearFrom: '',
      yearTo: '',
      minPrice: '',
      maxPrice: ''
    })
    setSearchResults([])
    setHasSearched(false)
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
  
  const updateAuctionInList = (auctionId: string, updates: Partial<Auction>) => {
    setSearchResults(prevResults => 
      prevResults.map(auction => 
        auction.id === auctionId 
          ? { ...auction, ...updates }
          : auction
      )
    )
    
    setUpdatedAuctionId(auctionId)
    setTimeout(() => setUpdatedAuctionId(null), 3000)
  }
  
  const showToastNotification = (message: string) => {
    setToastMessage(message)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 4000)
  }
  
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
    
    setBidError('')
    setIsSubmittingBid(true)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const updatedAuctionData = {
        currentPrice: bidValue,
        winner: {
          username: 'MiConcesionario',
          isTemporary: true
        },
        myLastBid: bidValue,
        isLeading: true
      }
      
      updateAuctionInList(selectedAuction.id, updatedAuctionData)
      setSelectedAuction(prev => prev ? { ...prev, ...updatedAuctionData } : null)
      
      setBidSuccess('¡Oferta realizada con éxito! Ahora estás liderando la subasta.')
      setBidAmount('')
      
      showToastNotification(`¡Oferta de ${formatPrice(bidValue)} realizada con éxito en ${selectedAuction.brand} ${selectedAuction.model}!`)
      
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
              <div className="flex items-center space-x-2">
                <SearchIcon className="text-primary-600" size={24} />
                <h1 className="text-xl font-bold text-secondary-900">Buscar Subastas</h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Formulario de Filtros */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-lg font-bold text-secondary-900 mb-6">Filtros de Búsqueda</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Marca */}
            <div>
              <label htmlFor="brand" className="block text-sm font-medium text-secondary-700 mb-2">
                Marca
              </label>
              <select
                id="brand"
                value={filters.brand}
                onChange={(e) => handleBrandChange(e.target.value)}
                className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
              >
                <option value="">Todas las marcas</option>
                {Object.keys(brandModels).map(brand => (
                  <option key={brand} value={brand}>{brand}</option>
                ))}
              </select>
            </div>

            {/* Modelo */}
            <div>
              <label htmlFor="model" className="block text-sm font-medium text-secondary-700 mb-2">
                Modelo
              </label>
              <select
                id="model"
                value={filters.model}
                onChange={(e) => handleFilterChange('model', e.target.value)}
                className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                disabled={!filters.brand}
              >
                <option value="">Todos los modelos</option>
                {filters.brand && brandModels[filters.brand as keyof typeof brandModels]?.map(model => (
                  <option key={model} value={model}>{model}</option>
                ))}
              </select>
            </div>

            {/* Versión */}
            <div>
              <label htmlFor="version" className="block text-sm font-medium text-secondary-700 mb-2">
                Versión
              </label>
              <select
                id="version"
                value={filters.version}
                onChange={(e) => handleFilterChange('version', e.target.value)}
                className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
              >
                <option value="">Todas las versiones</option>
                {versions.map(version => (
                  <option key={version} value={version}>{version}</option>
                ))}
              </select>
            </div>

            {/* Año Desde */}
            <div>
              <label htmlFor="yearFrom" className="block text-sm font-medium text-secondary-700 mb-2">
                Año Desde
              </label>
              <select
                id="yearFrom"
                value={filters.yearFrom}
                onChange={(e) => handleFilterChange('yearFrom', e.target.value)}
                className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
              >
                <option value="">Cualquier año</option>
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>

            {/* Año Hasta */}
            <div>
              <label htmlFor="yearTo" className="block text-sm font-medium text-secondary-700 mb-2">
                Año Hasta
              </label>
              <select
                id="yearTo"
                value={filters.yearTo}
                onChange={(e) => handleFilterChange('yearTo', e.target.value)}
                className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
              >
                <option value="">Cualquier año</option>
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>

            {/* Precio Mínimo */}
            <div>
              <label htmlFor="minPrice" className="block text-sm font-medium text-secondary-700 mb-2">
                Precio Mínimo (USD)
              </label>
              <input
                type="number"
                id="minPrice"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                placeholder="10000"
                min="0"
                step="1000"
                className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
              />
            </div>

            {/* Precio Máximo */}
            <div>
              <label htmlFor="maxPrice" className="block text-sm font-medium text-secondary-700 mb-2">
                Precio Máximo (USD)
              </label>
              <input
                type="number"
                id="maxPrice"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                placeholder="100000"
                min="0"
                step="1000"
                className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
              />
            </div>
          </div>

          {/* Botones de Acción */}
          <div className="flex space-x-4">
            <button
              onClick={handleSearch}
              disabled={isSearching}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                isSearching
                  ? 'bg-secondary-300 text-secondary-500 cursor-not-allowed'
                  : 'bg-primary-600 hover:bg-primary-700 text-white shadow-lg hover:shadow-xl'
              }`}
            >
              {isSearching ? (
                <>
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Buscando...</span>
                </>
              ) : (
                <>
                  <SearchIcon size={20} />
                  <span>Buscar</span>
                </>
              )}
            </button>
            
            <button
              onClick={handleClearFilters}
              className="px-6 py-3 border border-secondary-300 text-secondary-700 font-medium rounded-lg hover:bg-secondary-50 transition-colors duration-200"
            >
              Limpiar Filtros
            </button>
          </div>
        </div>

        {/* Resultados de Búsqueda */}
        {hasSearched && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-secondary-900">
                Resultados de Búsqueda
              </h2>
              <span className="text-sm text-secondary-600">
                {searchResults.length} {searchResults.length === 1 ? 'resultado encontrado' : 'resultados encontrados'}
              </span>
            </div>

            {searchResults.length > 0 ? (
              <div className="space-y-6">
                {searchResults.map((auction) => (
                  <AuctionItem
                    key={auction.id}
                    auction={auction}
                    onViewDetails={handleViewAuction}
                    onPlaceBid={handlePlaceBid}
                    isUpdated={updatedAuctionId === auction.id}
                    showUpdatedBadge={true}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-secondary-400 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-secondary-900 mb-2">No se encontraron resultados</h3>
                <p className="text-secondary-600 mb-4">
                  Intenta ajustar los filtros de búsqueda para encontrar más resultados.
                </p>
                <button
                  onClick={handleClearFilters}
                  className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  Limpiar filtros y ver todas las subastas
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal de Ofertas (reutilizado) */}
      {isModalOpen && selectedAuction && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              handleCloseModal()
            }
          }}
        >
          <div 
            className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-screen overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
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
                        setBidError('')
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

export default ConcesionarioSearch