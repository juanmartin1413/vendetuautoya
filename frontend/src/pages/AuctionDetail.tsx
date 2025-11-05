import { useState, useEffect } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { ArrowLeftIcon, ArrowRightIcon, DollarSignIcon, TrophyIcon } from '../components/Icons'
import { useAuth } from '../contexts/AuthContext'
import { normalizeUserType } from '../types/auth'

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
    version: 'GTI 2.0 5 ptas',
    year: '2019',
    description: 'Volkswagen Golf GTI 2019, motor 2.0 TSI automático DSG. Full equipo: cuero, techo panorámico, cámara 360°, park assist, adaptive cruise control, faros full LED. Estado impecable, muy poco uso con 35.000 km reales.',
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
      { id: '1', amount: 20000, bidderEmail: 'concesionario1@email.com', timestamp: new Date('2025-10-20T10:30:00') },
      { id: '2', amount: 21000, bidderEmail: 'MiConcesionario@email.com', timestamp: new Date('2025-10-20T11:15:00') },
      { id: '3', amount: 22000, bidderEmail: 'MiConcesionario@email.com', timestamp: new Date('2025-10-20T14:20:00') },
      { id: '4', amount: 22500, bidderEmail: 'AutoCenter_BA@email.com', timestamp: new Date('2025-10-21T09:45:00') }
    ],
    startDate: new Date('2025-10-20T10:00:00'),
    endDate: new Date('2025-10-30T18:00:00'),
    status: 'En curso'
  },
  '2': {
    id: '2',
    brand: 'Peugeot',
    model: '208',
    version: '1.6 coupe',
    year: '2020',
    description: 'Peugeot 208 1.6 coupe 2020, motor eficiente y económico. Interior moderno con tecnología avanzada. Sistema multimedia con conectividad. Excelente para uso urbano. Segundo dueño, mantenimiento al día.',
    photos: [
      '/images/vehicles/peugeot-208/1.webp',
      '/images/vehicles/peugeot-208/2.webp',
      '/images/vehicles/peugeot-208/3.webp'
    ],
    basePrice: 18000,
    currentPrice: 20500,
    winningBidderEmail: 'MiConcesionario@email.com',
    bids: [
      { id: '1', amount: 18000, bidderEmail: 'concesionario1@email.com', timestamp: new Date('2025-10-21T09:30:00') },
      { id: '2', amount: 19000, bidderEmail: 'AutoSur@email.com', timestamp: new Date('2025-10-21T11:15:00') },
      { id: '3', amount: 20500, bidderEmail: 'MiConcesionario@email.com', timestamp: new Date('2025-10-21T14:20:00') }
    ],
    startDate: new Date('2025-10-21T09:00:00'),
    endDate: new Date('2025-10-28T17:00:00'),
    status: 'En curso'
  },
  '3': {
    id: '3',
    brand: 'BMW',
    model: '220i',
    version: '2.0 5 ptas',
    year: '2018',
    description: 'BMW 220i 2.0 5 ptas 2018, motor turbo potente. Interior deportivo con asientos de cuero. Sistema de navegación profesional y cámara de retroceso. Mantenimiento completo al día en concesionario oficial BMW.',
    photos: [
      '/images/vehicles/bmw-220i/1.webp',
      '/images/vehicles/bmw-220i/2.webp',
      '/images/vehicles/bmw-220i/3.webp'
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
    brand: 'Fiat',
    model: '500',
    version: 'Abarth 1.6 coupe',
    year: '2021',
    description: 'Fiat 500 Abarth 1.6 coupe 2021, motor turbo deportivo. Estado impecable, primer dueño. Todos los services en concesionario oficial. Escape deportivo, llantas deportivas, frenos Brembo, asientos Competizione.',
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
    brand: 'Audi',
    model: 'A1',
    version: '1.6 coupe',
    year: '2019',
    description: 'Audi A1 1.6 coupe 2019, como nuevo, muy pocos kilómetros. Motor 1.6 automático. Full equipo: MMI touch, virtual cockpit, asientos deportivos, llantas de aleación, faros LED, interior premium.',
    photos: [
      '/images/vehicles/audi-a1/1.webp',
      '/images/vehicles/audi-a1/2.webp',
      '/images/vehicles/audi-a1/3.webp',
      '/images/vehicles/audi-a1/4.webp'
    ],
    basePrice: 15000,
    currentPrice: 16200,
    winningBidderEmail: 'AutoPlaza_Norte@email.com',
    bids: [
      { id: '1', amount: 15000, bidderEmail: 'concesionario1@email.com', timestamp: new Date('2025-10-22T08:30:00') },
      { id: '2', amount: 15800, bidderEmail: 'MiConcesionario@email.com', timestamp: new Date('2025-10-22T10:15:00') },
      { id: '3', amount: 16200, bidderEmail: 'AutoPlaza_Norte@email.com', timestamp: new Date('2025-10-22T14:20:00') }
    ],
    startDate: new Date('2025-10-22T08:00:00'),
    endDate: new Date('2025-11-01T20:00:00'),
    status: 'En curso'
  },
  
  // Datos para ConcesionarioSearch
  'search_1': {
    id: 'search_1',
    brand: 'BMW',
    model: '120i',
    version: '2.0 5 ptas',
    year: '2020',
    description: 'BMW 120i en excelentes condiciones. Motor turbo eficiente y potente. Interior deportivo con acabados premium. Sistema de infoentretenimiento BMW. Llantas de aleación deportivas. Service completo al día.',
    photos: [
      '/images/vehicles/bmw-120/1.webp',
      '/images/vehicles/bmw-120/2.webp',
      '/images/vehicles/bmw-120/3.webp',
      '/images/vehicles/bmw-120/4.webp'
    ],
    basePrice: 32000,
    currentPrice: 35000,
    winningBidderEmail: 'AutoSport_Premium@email.com',
    bids: [
      { id: '1', amount: 32000, bidderEmail: 'concesionario1@email.com', timestamp: new Date('2025-10-15T10:30:00') },
      { id: '2', amount: 34000, bidderEmail: 'AutoPlaza@email.com', timestamp: new Date('2025-10-15T11:15:00') },
      { id: '3', amount: 35000, bidderEmail: 'AutoSport_Premium@email.com', timestamp: new Date('2025-10-15T14:20:00') }
    ],
    startDate: new Date('2025-10-15T10:00:00'),
    endDate: new Date('2025-10-25T18:00:00'),
    status: 'En curso'
  },
  'search_2': {
    id: 'search_2',
    brand: 'Audi',
    model: 'A3',
    version: '1.6 coupe',
    year: '2019',
    description: 'Audi A3 premium en estado excepcional. Motor TFSI eficiente. Interior con acabados Audi de alta calidad. Sistema MMI con navegación. Asientos deportivos. Tecnología quattro disponible.',
    photos: [
      '/images/vehicles/audi-a1/1.webp',
      '/images/vehicles/audi-a1/2.webp',
      '/images/vehicles/audi-a1/3.webp'
    ],
    basePrice: 26000,
    currentPrice: 28500,
    winningBidderEmail: 'MiConcesionario@email.com',
    bids: [
      { id: '1', amount: 26000, bidderEmail: 'concesionario1@email.com', timestamp: new Date('2025-10-16T09:30:00') },
      { id: '2', amount: 27500, bidderEmail: 'AutoSur@email.com', timestamp: new Date('2025-10-16T11:15:00') },
      { id: '3', amount: 28500, bidderEmail: 'MiConcesionario@email.com', timestamp: new Date('2025-10-16T14:20:00') }
    ],
    startDate: new Date('2025-10-16T09:00:00'),
    endDate: new Date('2025-10-24T17:00:00'),
    status: 'En curso'
  },
  'search_3': {
    id: 'search_3',
    brand: 'Volkswagen',
    model: 'Golf',
    version: '2.0 5 ptas',
    year: '2021',
    description: 'Volkswagen Golf 2021 prácticamente nuevo. Motor TSI de última generación. Interior moderno con sistema de infoentretenimiento avanzado. Asistentes de conducción. Garantía de fábrica vigente.',
    photos: [
      '/images/vehicles/volkswagen-golf/1.webp',
      '/images/vehicles/volkswagen-golf/2.webp',
      '/images/vehicles/volkswagen-golf/3.webp',
      '/images/vehicles/volkswagen-golf/4.webp'
    ],
    basePrice: 38000,
    currentPrice: 42000,
    winningBidderEmail: 'Premium_Motors@email.com',
    bids: [
      { id: '1', amount: 38000, bidderEmail: 'concesionario1@email.com', timestamp: new Date('2025-10-17T11:30:00') },
      { id: '2', amount: 40000, bidderEmail: 'AutoPlaza@email.com', timestamp: new Date('2025-10-17T14:15:00') },
      { id: '3', amount: 42000, bidderEmail: 'Premium_Motors@email.com', timestamp: new Date('2025-10-17T16:20:00') }
    ],
    startDate: new Date('2025-10-17T11:00:00'),
    endDate: new Date('2025-10-26T16:00:00'),
    status: 'En curso'
  },
  'search_4': {
    id: 'search_4',
    brand: 'BMW',
    model: 'X1',
    version: '1.6 coupe',
    year: '2020',
    description: 'BMW X1 SUV premium en condiciones inmaculadas. Motor turbo eficiente. Tracción xDrive inteligente. Interior espacioso con acabados de lujo. Sistema de navegación profesional BMW. Excelente para familia y ciudad.',
    photos: [
      '/images/vehicles/bmw-120/1.webp',
      '/images/vehicles/bmw-120/2.webp',
      '/images/vehicles/bmw-120/3.webp',
      '/images/vehicles/bmw-120/4.webp'
    ],
    basePrice: 35000,
    currentPrice: 38500,
    winningBidderEmail: 'MiConcesionario@email.com',
    bids: [
      { id: '1', amount: 35000, bidderEmail: 'concesionario1@email.com', timestamp: new Date('2025-10-18T08:30:00') },
      { id: '2', amount: 37000, bidderEmail: 'AutoSur@email.com', timestamp: new Date('2025-10-18T10:15:00') },
      { id: '3', amount: 38500, bidderEmail: 'MiConcesionario@email.com', timestamp: new Date('2025-10-18T14:20:00') }
    ],
    startDate: new Date('2025-10-18T08:00:00'),
    endDate: new Date('2025-10-27T19:00:00'),
    status: 'En curso'
  },
  'search_5': {
    id: 'search_5',
    brand: 'Fiat',
    model: '500 Abarth',
    version: '1.6 coupe',
    year: '2022',
    description: 'Fiat 500 Abarth 2022 como nuevo. Motor turbo de alta performance. Escape deportivo Abarth Record Monza. Interior deportivo con detalles Abarth. Suspensión deportiva. Kit aerodinámico completo.',
    photos: [
      '/images/vehicles/fiat-500abarth/1.webp',
      '/images/vehicles/fiat-500abarth/2.webp',
      '/images/vehicles/fiat-500abarth/3.webp',
      '/images/vehicles/fiat-500abarth/4.webp'
    ],
    basePrice: 29000,
    currentPrice: 31200,
    winningBidderEmail: 'Family_Cars@email.com',
    bids: [
      { id: '1', amount: 29000, bidderEmail: 'concesionario1@email.com', timestamp: new Date('2025-10-19T10:30:00') },
      { id: '2', amount: 30000, bidderEmail: 'MiConcesionario@email.com', timestamp: new Date('2025-10-19T11:15:00') },
      { id: '3', amount: 31200, bidderEmail: 'Family_Cars@email.com', timestamp: new Date('2025-10-19T14:20:00') }
    ],
    startDate: new Date('2025-10-19T10:30:00'),
    endDate: new Date('2025-10-28T15:00:00'),
    status: 'En curso'
  },
  'search_6': {
    id: 'search_6',
    brand: 'Peugeot',
    model: '208',
    version: '2.0 5 ptas',
    year: '2021',
    description: 'Peugeot 208 2021 en estado perfecto. Motor eficiente con tecnología PureTech. Interior moderno con i-Cockpit 3D. Conectividad avanzada con Android Auto y Apple CarPlay. Asistentes de conducción de serie.',
    photos: [
      '/images/vehicles/peugeot-208/1.webp',
      '/images/vehicles/peugeot-208/2.webp',
      '/images/vehicles/peugeot-208/3.webp'
    ],
    basePrice: 24500,
    currentPrice: 26800,
    winningBidderEmail: 'Eco_Motors@email.com',
    bids: [
      { id: '1', amount: 24500, bidderEmail: 'concesionario1@email.com', timestamp: new Date('2025-10-20T12:30:00') },
      { id: '2', amount: 25500, bidderEmail: 'AutoPlaza@email.com', timestamp: new Date('2025-10-20T13:15:00') },
      { id: '3', amount: 26800, bidderEmail: 'Eco_Motors@email.com', timestamp: new Date('2025-10-20T16:20:00') }
    ],
    startDate: new Date('2025-10-20T12:00:00'),
    endDate: new Date('2025-10-29T14:00:00'),
    status: 'En curso'
  },
  // Agregar Ford Mustang para completar consistencia con Admin
  'mustang_1': {
    id: 'mustang_1',
    brand: 'Ford',
    model: 'Mustang',
    version: 'GT',
    year: '2019',
    description: 'Ford Mustang GT 2019, icono americano. Motor V8 5.0 Coyote de 450 HP. Transmisión automática de 10 velocidades. Interior deportivo con asientos Recaro. Sistema SYNC 3 con pantalla de 8". Escape activo con modo Track. Performance Package incluido.',
    photos: [
      '/images/vehicles/ford-mustang/1.webp',
      '/images/vehicles/ford-mustang/2.webp',
      '/images/vehicles/ford-mustang/3.webp',
      '/images/vehicles/ford-mustang/4.webp'
    ],
    basePrice: 45000,
    currentPrice: 48500,
    winningBidderEmail: 'Sports_Cars_Premium@email.com',
    bids: [
      { id: '1', amount: 45000, bidderEmail: 'concesionario1@email.com', timestamp: new Date('2025-10-19T10:30:00') },
      { id: '2', amount: 47000, bidderEmail: 'AutoSport@email.com', timestamp: new Date('2025-10-19T12:15:00') },
      { id: '3', amount: 48500, bidderEmail: 'Sports_Cars_Premium@email.com', timestamp: new Date('2025-10-19T15:20:00') }
    ],
    startDate: new Date('2025-10-19T10:00:00'),
    endDate: new Date('2025-10-25T18:00:00'),
    status: 'En curso'
  }
}

const AuctionDetail = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const location = useLocation()
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
    
    if (!user || normalizeUserType(user.type) !== 'Concesionario') {
      setBidError('Solo los concesionarios pueden hacer ofertas')
      return
    }

    // Verificar estado de membresía para concesionarios
    if (normalizeUserType(user.type) === 'Concesionario') {
      const membershipStatus = user.membership?.status
      const hasActiveMembership = membershipStatus === 'premium_monthly' || membershipStatus === 'premium_annual'
      
      if (!hasActiveMembership) {
        setBidError('Necesitas una membresía premium activa para realizar ofertas. Ve a tu dashboard para activar tu membresía.')
        return
      }
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
  
  // Función inteligente para determinar la ruta de regreso según el contexto de navegación
  const getBackRoute = () => {
    if (!user) return '/dashboard'
    
    const userType = normalizeUserType(user.type)
    
    // Si el usuario actual es administrador, determinar ruta específica
    if (userType === 'Administrador') {
      // Si viene del detalle de una publicación específica, regresar allí
      if (location.state?.from === 'admin-detail' && location.state?.adminPublicationId) {
        return `/admin-publication-detail/${location.state.adminPublicationId}`
      }
      // Si viene del listado general o acceso directo, ir al listado
      return '/admin-publications'
    }
    
    // Detectar si se viene del panel de administrador mediante:
    // 1. El state pasado en la navegación (desde handlePreview en AdminPublicationDetail)
    // 2. El document referrer para casos donde se navega desde admin-publication-detail
    const fromAdminState = location.state?.from === 'admin' || location.state?.from === 'admin-detail'
    const fromAdminReferrer = typeof window !== 'undefined' && 
                             window.document.referrer.includes('/admin-publication-detail/')
    
    if (fromAdminState || fromAdminReferrer) {
      // Si tenemos el ID específico de la publicación admin, regresar allí
      if (location.state?.adminPublicationId) {
        return `/admin-publication-detail/${location.state.adminPublicationId}`
      }
      // Si no, regresar al listado general
      return '/admin-publications'
    }
    
    // Lógica original para vendedores y concesionarios
    return normalizeUserType(user.type) === 'Concesionario' 
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
                      {normalizeUserType(user.type) === 'Concesionario' ? 'Mis Subastas (Concesionario)' : 'Mis Subastas (Vendedor)'}
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
                  normalizeUserType(user.type) === 'Concesionario' 
                    ? 'bg-blue-100 text-blue-800 border border-blue-200'
                    : normalizeUserType(user.type) === 'Administrador'
                    ? 'bg-orange-100 text-orange-800 border border-orange-200'
                    : 'bg-green-100 text-green-800 border border-green-200'
                }`}>
                  {normalizeUserType(user.type) === 'Concesionario' ? 'Vista Concesionario' : 
                   normalizeUserType(user.type) === 'Administrador' ? 'Vista Administrador' : 
                   'Vista Vendedor'}
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
            {user && normalizeUserType(user.type) === 'Concesionario' && (
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

                {/* Verificación de membresía */}
                {user.membership?.status === 'free' && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                    <div className="flex items-start">
                      <svg className="w-5 h-5 text-yellow-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-yellow-800 mb-1">
                          Membresía Premium Requerida
                        </h3>
                        <p className="text-sm text-yellow-700 mb-3">
                          Para realizar ofertas en las subastas necesitas activar tu membresía premium. Obtén acceso ilimitado a todas las funcionalidades.
                        </p>
                        <button
                          onClick={() => navigate('/dashboard')}
                          className="bg-yellow-600 hover:bg-yellow-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                        >
                          Activar Membresía Premium
                        </button>
                      </div>
                    </div>
                  </div>
                )}

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
                      disabled={
                        isSubmittingBid || 
                        !bidAmount || 
                        parseFloat(bidAmount) <= auction.currentPrice ||
                        user.membership?.status === 'free'
                      }
                      className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                        isSubmittingBid || 
                        !bidAmount || 
                        parseFloat(bidAmount) <= auction.currentPrice ||
                        user.membership?.status === 'free'
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
                      ) : user.membership?.status === 'free' ? (
                        'Membresía Premium Requerida'
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