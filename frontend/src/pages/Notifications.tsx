import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeftIcon, BellIcon, CheckCircleIcon, ClockIcon, DollarSignIcon } from '../components/Icons'

interface Notification {
  id: number
  type: 'confirmation' | 'auction_start' | 'offer' | 'auction_end' | 'document_request' | 'bidding_update'
  title: string
  description: string
  date: string
  time: string
  isRead: boolean
  vehicle?: string
  amount?: string
}

const Notifications = () => {
  const navigate = useNavigate()
  
  const [notifications] = useState<Notification[]>([
    {
      id: 1,
      type: 'offer',
      title: 'Nueva oferta recibida',
      description: 'Has recibido una oferta por tu Volkswagen Golf GTI de $18.500 USD',
      date: '12/10/2025',
      time: '14:30',
      isRead: false,
      vehicle: 'Volkswagen Golf GTI',
      amount: '$18.500 USD'
    },
    {
      id: 2,
      type: 'auction_start',
      title: 'Subasta iniciada',
      description: 'La subasta por tu BMW 320i ha comenzado. Los usuarios ya pueden realizar ofertas.',
      date: '11/10/2025',
      time: '09:00',
      isRead: false,
      vehicle: 'BMW 320i'
    },
    {
      id: 3,
      type: 'bidding_update',
      title: 'Nueva puja realizada',
      description: 'Tu Audi A4 ha recibido una nueva puja de $22.000 USD. Actual mejor oferta.',
      date: '10/10/2025',
      time: '16:45',
      isRead: true,
      vehicle: 'Audi A4',
      amount: '$22.000 USD'
    },
    {
      id: 4,
      type: 'confirmation',
      title: 'Publicación confirmada',
      description: 'Tu publicación por un Mercedes-Benz C200 ya se encuentra confirmada y será visible para compradores.',
      date: '09/10/2025',
      time: '11:20',
      isRead: true,
      vehicle: 'Mercedes-Benz C200'
    },
    {
      id: 5,
      type: 'document_request',
      title: 'Documentación requerida',
      description: 'Se ha solicitado documentación adicional para tu Ford Focus. Revisa los requisitos en tu publicación.',
      date: '08/10/2025',
      time: '13:15',
      isRead: true,
      vehicle: 'Ford Focus'
    },
    {
      id: 6,
      type: 'auction_end',
      title: 'Subasta finalizada',
      description: 'La subasta por tu Toyota Corolla ha finalizado. Mejor oferta: $16.800 USD.',
      date: '07/10/2025',
      time: '18:00',
      isRead: true,
      vehicle: 'Toyota Corolla',
      amount: '$16.800 USD'
    },
    {
      id: 7,
      type: 'offer',
      title: 'Oferta directa recibida',
      description: 'Has recibido una oferta directa por tu Chevrolet Cruze de $14.200 USD',
      date: '06/10/2025',
      time: '20:30',
      isRead: true,
      vehicle: 'Chevrolet Cruze',
      amount: '$14.200 USD'
    },
    {
      id: 8,
      type: 'confirmation',
      title: 'Documentos aprobados',
      description: 'Los documentos de tu Nissan Sentra han sido aprobados. Tu vehículo estará disponible para subasta.',
      date: '05/10/2025',
      time: '10:45',
      isRead: true,
      vehicle: 'Nissan Sentra'
    }
  ])

  const getNotificationIcon = (type: string, isRead: boolean) => {
    const iconClass = `w-6 h-6 ${isRead ? 'text-gray-400' : 'text-primary'}`
    
    switch (type) {
      case 'offer':
        return <DollarSignIcon className={iconClass} />
      case 'auction_start':
      case 'auction_end':
        return <ClockIcon className={iconClass} />
      case 'confirmation':
      case 'document_request':
        return <CheckCircleIcon className={iconClass} />
      case 'bidding_update':
        return <BellIcon className={iconClass} />
      default:
        return <BellIcon className={iconClass} />
    }
  }

  const getNotificationBorderColor = (type: string, isRead: boolean) => {
    if (isRead) return 'border-gray-200'
    
    switch (type) {
      case 'offer':
        return 'border-green-300'
      case 'auction_start':
        return 'border-blue-300'
      case 'auction_end':
        return 'border-red-300'
      case 'confirmation':
        return 'border-primary'
      case 'document_request':
        return 'border-yellow-300'
      case 'bidding_update':
        return 'border-purple-300'
      default:
        return 'border-gray-300'
    }
  }

  const unreadCount = notifications.filter(n => !n.isRead).length

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-lg">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-primary text-white p-2 rounded-full hover:bg-primary/90 transition-colors"
            >
              <ArrowLeftIcon className="w-6 h-6 text-white" />
            </button>
            <h1 className="text-xl font-bold text-gray-900">Notificaciones</h1>
          </div>
        </div>
      </header>
      
      <div className="p-4">
        {/* Contador de notificaciones no leídas */}
        {unreadCount > 0 && (
          <div className="mb-4 bg-primary text-white p-3 rounded-lg">
            <p className="text-sm font-medium">
              Tienes {unreadCount} notificación{unreadCount !== 1 ? 'es' : ''} sin leer
            </p>
          </div>
        )}

        {/* Lista de notificaciones */}
        <div className="space-y-3">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`bg-white rounded-lg p-4 border-l-4 ${getNotificationBorderColor(notification.type, notification.isRead)} ${
                !notification.isRead ? 'shadow-md' : 'shadow-sm'
              }`}
            >
              <div className="flex items-start space-x-3">
                {/* Icono */}
                <div className="flex-shrink-0 mt-1">
                  {getNotificationIcon(notification.type, notification.isRead)}
                </div>
                
                {/* Contenido */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className={`text-sm font-medium ${!notification.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                        {notification.title}
                        {!notification.isRead && (
                          <span className="ml-2 inline-block w-2 h-2 bg-primary rounded-full"></span>
                        )}
                      </h3>
                      <p className={`mt-1 text-sm ${!notification.isRead ? 'text-gray-800' : 'text-gray-600'}`}>
                        {notification.description}
                      </p>
                      
                      {/* Información adicional */}
                      {(notification.vehicle || notification.amount) && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {notification.vehicle && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              🚗 {notification.vehicle}
                            </span>
                          )}
                          {notification.amount && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              💰 {notification.amount}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Fecha y hora */}
                  <div className="mt-3 flex items-center space-x-2 text-xs text-gray-500">
                    <span>📅 {notification.date}</span>
                    <span>•</span>
                    <span>🕐 {notification.time}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mensaje si no hay notificaciones */}
        {notifications.length === 0 && (
          <div className="text-center py-12">
            <BellIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No hay notificaciones
            </h3>
            <p className="text-gray-500">
              Cuando tengas notificaciones sobre tus vehículos, aparecerán aquí.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Notifications