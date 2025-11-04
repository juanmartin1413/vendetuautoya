import { useNavigate } from 'react-router-dom'
import { ArrowLeftIcon, EyeIcon } from '../components/Icons'

interface Auction {
  id: string
  brand: string
  model: string
  year: string
  status: 'En revision' | 'Confirmada' | 'Rechazada' | 'En curso' | 'Finalizada'
  basePrice?: number
  startDate: Date
  endDate: Date
  photos: string[]
}

// Mock data para las subastas
const mockAuctions: Auction[] = [
  {
    id: '1',
    brand: 'Volkswagen',
    model: 'Golf',
    year: '2018',
    status: 'En curso',
    basePrice: 15000,
    startDate: new Date('2025-10-10T10:00:00'),
    endDate: new Date('2025-10-15T18:00:00'),
    photos: [
      '/images/vehicles/volkswagen-golf/1.webp',
      '/images/vehicles/volkswagen-golf/2.webp',
      '/images/vehicles/volkswagen-golf/3.webp',
      '/images/vehicles/volkswagen-golf/4.webp'
    ]
  },
  {
    id: '2',
    brand: 'BMW',
    model: '120i',
    year: '2020',
    status: 'Confirmada',
    basePrice: 25000,
    startDate: new Date('2025-10-20T09:00:00'),
    endDate: new Date('2025-10-25T17:00:00'),
    photos: [
      '/images/vehicles/bmw-120/1.webp',
      '/images/vehicles/bmw-120/2.webp',
      '/images/vehicles/bmw-120/3.webp',
      '/images/vehicles/bmw-120/4.webp'
    ]
  },
  {
    id: '3',
    brand: 'Audi',
    model: 'A3',
    year: '2019',
    status: 'En revision',
    startDate: new Date('2025-10-18T10:00:00'),
    endDate: new Date('2025-10-23T18:00:00'),
    photos: ['/images/vehicles/volkswagen-golf/1.webp']
  },
  {
    id: '4',
    brand: 'Fiat',
    model: '500 Abarth',
    year: '2017',
    status: 'Finalizada',
    basePrice: 12000,
    startDate: new Date('2025-10-01T10:00:00'),
    endDate: new Date('2025-10-05T18:00:00'),
    photos: [
      '/images/vehicles/fiat-500abarth/1.webp',
      '/images/vehicles/fiat-500abarth/2.webp',
      '/images/vehicles/fiat-500abarth/3.webp',
      '/images/vehicles/fiat-500abarth/4.webp'
    ]
  },
  {
    id: '5',
    brand: 'Peugeot',
    model: '208',
    year: '2016',
    status: 'Rechazada',
    startDate: new Date('2025-10-12T10:00:00'),
    endDate: new Date('2025-10-17T18:00:00'),
    photos: ['/images/vehicles/volkswagen-golf/2.webp']
  }
]

const MyAuctions = () => {
  const navigate = useNavigate()

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'En revision':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'Confirmada':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'Rechazada':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'En curso':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'Finalizada':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  const canViewAuction = (status: string) => {
    return status !== 'En revision' && status !== 'Rechazada'
  }

  const handleViewAuction = (auctionId: string) => {
    navigate(`/auction-detail/${auctionId}`)
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
            <h1 className="text-xl font-bold text-secondary-900">Mis Subastas</h1>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {mockAuctions.map((auction) => (
            <div key={auction.id} className="bg-white rounded-lg shadow-lg p-6">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-center">
                {/* Información del Vehículo */}
                <div className="lg:col-span-2">
                  <h3 className="text-xl font-bold text-secondary-900 mb-2">
                    {auction.brand} {auction.model} {auction.year}
                  </h3>
                  <div className="flex items-center mb-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(auction.status)}`}>
                      {auction.status}
                    </span>
                  </div>
                  
                  {/* Precio de base (solo para ciertos estados) */}
                  {auction.basePrice && ['Confirmada', 'En curso', 'Finalizada'].includes(auction.status) && (
                    <div className="mb-2">
                      <span className="text-sm font-medium text-secondary-600">Precio de base: </span>
                      <span className="text-lg font-bold text-primary-600">{formatPrice(auction.basePrice)}</span>
                    </div>
                  )}
                </div>

                {/* Fechas */}
                <div className="space-y-2">
                  <div>
                    <span className="text-sm font-medium text-secondary-600 block">Fecha inicio:</span>
                    <span className="text-sm text-secondary-800">{formatDate(auction.startDate)}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-secondary-600 block">Fecha fin:</span>
                    <span className="text-sm text-secondary-800">{formatDate(auction.endDate)}</span>
                  </div>
                </div>

                {/* Botón de acción */}
                <div className="flex justify-center lg:justify-end">
                  {canViewAuction(auction.status) ? (
                    <button
                      onClick={() => handleViewAuction(auction.id)}
                      className="flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                    >
                      <EyeIcon size={20} />
                      <span>Ver</span>
                    </button>
                  ) : (
                    <div className="text-secondary-400 text-sm italic">
                      {auction.status === 'En revision' ? 'Pendiente de aprobación' : 'Subasta rechazada'}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {mockAuctions.length === 0 && (
            <div className="bg-white rounded-lg shadow-lg p-12 text-center">
              <div className="text-secondary-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-secondary-900 mb-2">No tienes subastas aún</h3>
              <p className="text-secondary-600 mb-6">
                Comienza subastando tu primer vehículo para verlo aparecer aquí.
              </p>
              <button
                onClick={() => navigate('/new-auction')}
                className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200"
              >
                Subastar Vehículo
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MyAuctions