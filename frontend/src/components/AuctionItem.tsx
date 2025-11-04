import { EyeIcon, ClockIcon, TrophyIcon, DollarSignIcon } from './Icons'

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
  image: string
}

interface AuctionItemProps {
  auction: Auction
  onViewDetails: (auctionId: string) => void
  onPlaceBid: (auction: Auction) => void
  isUpdated?: boolean
  showUpdatedBadge?: boolean
}

const AuctionItem = ({ 
  auction, 
  onViewDetails, 
  onPlaceBid, 
  isUpdated = false, 
  showUpdatedBadge = false 
}: AuctionItemProps) => {
  
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
    
    const totalDuration = 7 * 24 * 60 * 60 * 1000
    const elapsed = totalDuration - diff
    const percentage = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100))
    
    const isUrgent = diff < 24 * 60 * 60 * 1000
    
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
    return 'bg-gray-100 text-gray-800 border-gray-200'
  }

  const remainingTime = getRemainingTime(auction.endDate)

  return (
    <div 
      className={`bg-white border border-secondary-200 rounded-lg p-6 hover:shadow-lg transition-all duration-200 ${
        isUpdated 
          ? 'ring-2 ring-green-500 ring-opacity-50 bg-green-50' 
          : ''
      }`}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Foto del Vehículo - 2 columnas */}
        <div className="lg:col-span-2">
          <div className="relative">
            <img
              src={auction.image}
              alt={`${auction.brand} ${auction.model}`}
              className="w-full h-24 object-cover rounded-lg shadow-md"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=400&h=300&fit=crop&crop=center'
              }}
            />
            <div className="absolute top-2 right-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(auction.status, auction.isLeading)}`}>
                {auction.status}
              </span>
            </div>
          </div>
        </div>

        {/* Información del Vehículo - 3 columnas */}
        <div className="lg:col-span-3">
          <h3 className="text-xl font-bold text-secondary-900 mb-1">
            {auction.brand} {auction.model}
          </h3>
          <p className="text-lg text-secondary-600 mb-1">
            {auction.version} - {auction.year}
          </p>
          
          {auction.isLeading && showUpdatedBadge && isUpdated && (
            <span className="mt-2 inline-block px-2 py-1 bg-green-600 text-white text-xs rounded-full animate-pulse">
              ¡Actualizado!
            </span>
          )}

          {/* Tiempo restante */}
          {auction.status === 'En curso' ? (
            <div className="mt-2 space-y-2">
              <div className="flex items-center text-sm text-secondary-600">
                <ClockIcon size={16} className="mr-1" />
                <span>Tiempo restante: {remainingTime.text}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    remainingTime.isUrgent 
                      ? 'bg-red-500' 
                      : 'bg-blue-500'
                  }`}
                  style={{ width: `${100 - remainingTime.percentage}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="mt-2">
              <div className="flex items-center text-sm text-secondary-600">
                <ClockIcon size={16} className="mr-1" />
                <span>Tiempo restante: {remainingTime.text}</span>
              </div>
            </div>
          )}
        </div>

        {/* Precios y Fechas/Ganador - 4 columnas con grid alineado */}
        <div className="lg:col-span-4 grid grid-cols-2 gap-4">
          {/* Columna de Precios */}
          <div className="space-y-3">
            <div className="h-[60px] flex flex-col justify-start">
              <span className="text-sm font-medium text-secondary-600 block">Precio actual:</span>
              <span className="text-xl font-bold text-primary-600">{formatPrice(auction.currentPrice)}</span>
              {auction.currentPrice > auction.basePrice && (
                <span className="text-xs text-green-600">+US$ {(auction.currentPrice - auction.basePrice).toLocaleString()}</span>
              )}
            </div>
            
            <div className="h-[60px] flex flex-col justify-start">
              <span className="text-sm font-medium text-secondary-600 block">Precio base:</span>
              <span className="text-lg text-secondary-800">{formatPrice(auction.basePrice)}</span>
            </div>

            <div className="h-[60px] flex flex-col justify-start">
              <span className="text-sm font-medium text-secondary-600 block">Mi última oferta:</span>
              {auction.myLastBid ? (
                <span className={`text-lg font-semibold ${auction.isLeading ? 'text-green-600' : 'text-orange-600'}`}>
                  {formatPrice(auction.myLastBid)}
                  {auction.myLastBid > auction.basePrice && (
                    <span className="text-xs block">
                      {auction.isLeading ? 'Superado' : 'Superado'}
                    </span>
                  )}
                </span>
              ) : (
                <span className="text-lg text-secondary-400">-</span>
              )}
            </div>
          </div>

          {/* Columna de Fechas y Ganador */}
          <div className="space-y-3">
            <div className="h-[60px] flex flex-col justify-start">
              <span className="text-sm font-medium text-secondary-600 block">Inicio:</span>
              <span className="text-sm text-secondary-800">{formatDate(auction.startDate)}</span>
            </div>
            
            <div className="h-[60px] flex flex-col justify-start">
              <span className="text-sm font-medium text-secondary-600 block">Fin:</span>
              <span className="text-sm text-secondary-800">{formatDate(auction.endDate)}</span>
            </div>
            
            <div className="h-[60px] flex flex-col justify-start">
              <span className="text-sm font-medium text-secondary-600 block">Ganador:</span>
              {auction.winner ? (
                <div className="flex items-center space-x-1">
                  <TrophyIcon 
                    size={14} 
                    className={auction.isLeading ? 'text-yellow-500' : 'text-secondary-400'} 
                  />
                  <span className={`text-xs font-medium ${
                    auction.isLeading ? 'text-green-600' : 'text-secondary-700'
                  }`}>
                    {auction.isLeading ? 'Tú' : auction.winner.username}
                  </span>
                </div>
              ) : (
                <span className="text-xs text-secondary-500 italic">Sin ofertas</span>
              )}
            </div>
          </div>
        </div>

        {/* Acciones - 3 columnas (más espacio hacia la derecha) */}
        <div className="lg:col-span-3 flex flex-col space-y-2 pl-4">
          <button
            onClick={() => onViewDetails(auction.id)}
            className="flex items-center justify-center space-x-2 bg-secondary-600 hover:bg-secondary-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
          >
            <EyeIcon size={16} />
            <span>Ver detalles</span>
          </button>
          
          {auction.status === 'En curso' && (
            <button
              onClick={() => onPlaceBid(auction)}
              className={`flex items-center justify-center space-x-2 font-medium py-2 px-4 rounded-lg transition-colors duration-200 ${
                auction.isLeading
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-primary-600 hover:bg-primary-700 text-white'
              }`}
            >
              <DollarSignIcon size={16} />
              <span>{auction.isLeading ? 'Mejorar oferta' : 'Pujar'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default AuctionItem