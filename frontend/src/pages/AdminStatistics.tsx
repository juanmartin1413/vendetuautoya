import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { ArrowLeftIcon, BarChartIcon, UsersIcon, FileTextIcon, DollarSignIcon, DownloadIcon } from '../components/Icons'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

const AdminStatistics = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const reportRef = useRef<HTMLDivElement>(null)
  
  // Configurar fechas por defecto (último mes)
  const today = new Date()
  const lastMonth = new Date(today)
  lastMonth.setMonth(today.getMonth() - 1)
  
  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0]
  }
  
  // Función para formatear fecha desde string sin desfasaje de zona horaria
  const formatDateFromString = (dateString: string) => {
    const [year, month, day] = dateString.split('-')
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
    return date.toLocaleDateString('es-ES', { 
      day: '2-digit', 
      month: 'long', 
      year: 'numeric' 
    })
  }
  
  const [dateFrom, setDateFrom] = useState(formatDate(lastMonth))
  const [dateTo, setDateTo] = useState(formatDate(today))
  const [isSearching, setIsSearching] = useState(false)
  const [isExporting, setIsExporting] = useState(false)

  // Mock data de estadísticas orientado a inversores
  const mockStatsDefault = {
    totalUsers: 1247,
    activeMembers: 342,
    newUsersThisMonth: 83,
    activeAuctions: 67,
    membershipRevenue: 68400, // $200 x 342 miembros activos
    commissionRevenue: 79120, // comisiones de subastas
    totalRevenue: 147520, // membresías + comisiones
    topBrands: [
      { name: 'Toyota', count: 89, percentage: 21 },
      { name: 'Ford', count: 76, percentage: 18 },
      { name: 'Chevrolet', count: 65, percentage: 15 },
      { name: 'Honda', count: 54, percentage: 13 },
      { name: 'Nissan', count: 47, percentage: 11 },
      { name: 'Volkswagen', count: 43, percentage: 10 },
      { name: 'Otros', count: 51, percentage: 12 }
    ],
    monthlyGrowth: [
      { month: 'Ene', newUsers: 45, auctionsCompleted: 23, totalRevenue: 12300 },
      { month: 'Feb', newUsers: 52, auctionsCompleted: 31, totalRevenue: 15200 },
      { month: 'Mar', newUsers: 83, auctionsCompleted: 45, totalRevenue: 18900 },
      { month: 'Abr', newUsers: 67, auctionsCompleted: 38, totalRevenue: 16800 },
      { month: 'May', newUsers: 74, auctionsCompleted: 42, totalRevenue: 19500 }
    ],
    revenueByType: [
      { type: 'Membresías', amount: 68400, percentage: 46.4 },
      { type: 'Comisiones', amount: 79120, percentage: 53.6 }
    ]
  }

  // Mock data expandido para cuando se busque un período más amplio
  const mockStatsExpanded = {
    totalUsers: 2847,
    activeMembers: 758,
    newUsersThisMonth: 245,
    activeAuctions: 134,
    membershipRevenue: 151600, // $200 x 758 miembros activos
    commissionRevenue: 198420, // comisiones de subastas ampliadas
    totalRevenue: 350020, // membresías + comisiones ampliadas
    topBrands: [
      { name: 'Toyota', count: 214, percentage: 23 },
      { name: 'Ford', count: 189, percentage: 20 },
      { name: 'Chevrolet', count: 167, percentage: 18 },
      { name: 'Honda', count: 143, percentage: 15 },
      { name: 'Nissan', count: 98, percentage: 10 },
      { name: 'Volkswagen', count: 87, percentage: 9 },
      { name: 'Otros', count: 47, percentage: 5 }
    ],
    monthlyGrowth: [
      { month: 'Jun', newUsers: 89, auctionsCompleted: 67, totalRevenue: 28900 },
      { month: 'Jul', newUsers: 112, auctionsCompleted: 78, totalRevenue: 34200 },
      { month: 'Ago', newUsers: 134, auctionsCompleted: 89, totalRevenue: 41500 },
      { month: 'Sep', newUsers: 145, auctionsCompleted: 92, totalRevenue: 39800 },
      { month: 'Oct', newUsers: 167, auctionsCompleted: 108, totalRevenue: 45600 }
    ],
    revenueByType: [
      { type: 'Membresías', amount: 151600, percentage: 43.3 },
      { type: 'Comisiones', amount: 198420, percentage: 56.7 }
    ]
  }

  const [currentStats, setCurrentStats] = useState(mockStatsDefault)

  const handleSearch = () => {
    setIsSearching(true)
    // Simular un delay de búsqueda
    setTimeout(() => {
      setCurrentStats(mockStatsExpanded)
      setIsSearching(false)
    }, 1000)
  }

  const handleExportPDF = async () => {
    if (!reportRef.current) return
    
    setIsExporting(true)
    
    try {
      // Configurar opciones para html2canvas
      const canvas = await html2canvas(reportRef.current, {
        scale: 2, // Mayor calidad
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#f8fafc', // Color de fondo
        width: reportRef.current.scrollWidth,
        height: reportRef.current.scrollHeight,
      })

      const imgData = canvas.toDataURL('image/png')
      
      // Crear PDF
      const pdf = new jsPDF('p', 'mm', 'a4')
      const pdfWidth = 210 // A4 width in mm
      const pdfHeight = 297 // A4 height in mm
      
      const imgWidth = pdfWidth - 20 // Margin
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      
      let heightLeft = imgHeight
      let position = 10 // Top margin
      
      // Agregar imagen del contenido (ya incluye el encabezado estilizado)
      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight)
      heightLeft -= (pdfHeight - position)
      
      // Agregar páginas adicionales si es necesario
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight + 10
        pdf.addPage()
        pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight)
        heightLeft -= pdfHeight
      }
      
      // Descargar el PDF
      const fileName = `reporte-estadisticas-${dateFrom}-${dateTo}.pdf`
      pdf.save(fileName)
      
    } catch (error) {
      console.error('Error al generar PDF:', error)
      alert('Error al generar el reporte PDF')
    } finally {
      setIsExporting(false)
    }
  }

  const StatCard = ({ title, value, icon, color, subtitle }: {
    title: string
    value: string | number
    icon: React.ReactNode
    color: string
    subtitle?: string
  }) => (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex flex-col items-center text-center">
        <div className={`p-3 rounded-full ${color} mb-4`}>
          {icon}
        </div>
        <div className="w-full">
          <p className="text-sm font-medium text-secondary-500 mb-1">{title}</p>
          <p className="text-2xl font-bold text-secondary-900">{value}</p>
          {subtitle && (
            <p className="text-sm text-secondary-600 mt-1">{subtitle}</p>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      {/* Header */}
      <header className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/dashboard')}
                className="text-secondary-600 hover:text-primary-600 transition-colors duration-200 mr-4"
              >
                <ArrowLeftIcon size={28} />
              </button>
              <div className="flex items-center">
                <BarChartIcon className="text-primary-600 mr-3" size={32} />
                <h1 className="text-2xl font-bold text-secondary-900">
                  Estadísticas del Sistema
                </h1>
              </div>
            </div>
            
            {/* Indicador del perfil */}
            <div className="flex items-center">
              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                user?.type === 'inversor' 
                  ? 'bg-green-100 text-green-800 border-green-200' 
                  : 'bg-orange-100 text-orange-800 border-orange-200'
              }`}>
                {user?.type === 'inversor' ? 'Vista Inversor' : 'Vista Administrador'}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Date Range Selector - Fuera del contenido exportable */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <h2 className="text-lg font-semibold text-secondary-900">
              Panel de Control
            </h2>
            <div className="flex flex-col md:flex-row gap-4 items-end">
              <div className="flex gap-4">
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-secondary-700 mb-1">
                    Fecha desde
                  </label>
                  <input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-secondary-700 mb-1">
                    Fecha hasta
                  </label>
                  <input
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                  />
                </div>
              </div>
              <button
                onClick={handleSearch}
                disabled={isSearching}
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 h-10"
              >
                {isSearching ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Buscando...
                  </>
                ) : (
                  'Buscar'
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Contenido exportable - Comienza después del Panel de Control */}
        <div ref={reportRef}>
          {/* Encabezado del reporte con período destacado */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg shadow-lg p-6 mb-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-2">Reporte de Estadísticas</h1>
              <h2 className="text-xl font-semibold mb-3">VendeTuAutoYa</h2>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 inline-block">
                <p className="text-lg font-medium mb-1">Período del Reporte</p>
                <p className="text-2xl font-bold">
                  {formatDateFromString(dateFrom)}
                  {' '}<span className="text-primary-100">al</span>{' '}
                  {formatDateFromString(dateTo)}
                </p>
                <p className="text-sm text-primary-100 mt-2">
                  Generado el {new Date().toLocaleDateString('es-ES', { 
                    day: '2-digit', 
                    month: 'long', 
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
          <StatCard
            title="Total Usuarios"
            value={currentStats.totalUsers.toLocaleString()}
            subtitle={`+${currentStats.newUsersThisMonth} nuevos`}
            icon={<UsersIcon className="text-white" size={24} />}
            color="bg-blue-500"
          />
          <StatCard
            title="Usuarios con Membresía"
            value={currentStats.activeMembers.toLocaleString()}
            subtitle="Activas"
            icon={<UsersIcon className="text-white" size={24} />}
            color="bg-green-500"
          />
          <StatCard
            title="Subastas Activas"
            value={currentStats.activeAuctions.toLocaleString()}
            subtitle="En proceso"
            icon={<FileTextIcon className="text-white" size={24} />}
            color="bg-orange-500"
          />
          <StatCard
            title="Ingresos por Membresías"
            value={`$${currentStats.membershipRevenue.toLocaleString()}`}
            subtitle="Período seleccionado"
            icon={<DollarSignIcon className="text-white" size={24} />}
            color="bg-purple-500"
          />
          <StatCard
            title="Ingresos por Comisiones"
            value={`$${currentStats.commissionRevenue.toLocaleString()}`}
            subtitle="Subastas"
            icon={<DollarSignIcon className="text-white" size={24} />}
            color="bg-indigo-500"
          />
          <StatCard
            title="Total Ingresos"
            value={`$${currentStats.totalRevenue.toLocaleString()}`}
            subtitle="Membresías + Comisiones"
            icon={<BarChartIcon className="text-white" size={24} />}
            color="bg-red-500"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Top Brands */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-secondary-900 mb-4">
              Marcas Más Populares
            </h3>
            <div className="space-y-4">
              {currentStats.topBrands.map((brand) => (
                <div key={brand.name} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-secondary-700 w-24">
                      {brand.name}
                    </span>
                    <div className="ml-4 flex-1 bg-secondary-200 rounded-full h-2">
                      <div
                        className="bg-primary-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${brand.percentage}%` }}
                      />
                    </div>
                  </div>
                  <div className="ml-4 text-right">
                    <span className="text-sm font-medium text-secondary-900">
                      {brand.count}
                    </span>
                    <span className="text-xs text-secondary-500 ml-2">
                      ({brand.percentage}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Revenue Distribution Chart */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-secondary-900 mb-4">
              Distribución de Ingresos
            </h3>
            <div className="flex items-center justify-center mb-4">
              <div className="relative w-48 h-48">
                <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke="#e5e7eb"
                    strokeWidth="8"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke="#3b82f6"
                    strokeWidth="8"
                    strokeDasharray={`${currentStats.revenueByType[0].percentage * 2.51} 251.2`}
                    strokeLinecap="round"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke="#10b981"
                    strokeWidth="8"
                    strokeDasharray={`${currentStats.revenueByType[1].percentage * 2.51} 251.2`}
                    strokeDashoffset={`-${currentStats.revenueByType[0].percentage * 2.51}`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-secondary-900">
                      ${currentStats.totalRevenue.toLocaleString()}
                    </div>
                    <div className="text-sm text-secondary-600">Total</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              {currentStats.revenueByType.map((item, index) => (
                <div key={item.type} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div 
                      className={`w-3 h-3 rounded-full mr-2 ${index === 0 ? 'bg-blue-500' : 'bg-green-500'}`}
                    />
                    <span className="text-sm text-secondary-700">{item.type}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-secondary-900">
                      ${item.amount.toLocaleString()}
                    </div>
                    <div className="text-xs text-secondary-500">
                      {item.percentage.toFixed(1)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Monthly Growth Chart */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-secondary-900 mb-6">
            Crecimiento Mensual
          </h3>
          
          {/* Bar Chart */}
          <div className="mb-6">
            <div className="flex items-end justify-between h-64 bg-gray-50 rounded-lg p-4">
              {currentStats.monthlyGrowth.map((month) => {
                const maxRevenue = Math.max(...currentStats.monthlyGrowth.map(m => m.totalRevenue))
                const barHeight = (month.totalRevenue / maxRevenue) * 200
                
                return (
                  <div key={month.month} className="flex flex-col items-center">
                    <div className="flex flex-col items-center mb-2">
                      <div 
                        className="w-12 bg-gradient-to-t from-primary-600 to-primary-400 rounded-t-md relative group cursor-pointer"
                        style={{ height: `${barHeight}px` }}
                      >
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          ${month.totalRevenue.toLocaleString()}
                        </div>
                      </div>
                      <div className="text-xs font-medium text-secondary-600 mt-2">
                        {month.month}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Detailed Data */}
          <div className="space-y-4">
            {currentStats.monthlyGrowth.map((month) => (
              <div key={month.month} className="border-b border-secondary-100 pb-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-secondary-700">
                    {month.month}
                  </span>
                  <span className="text-sm font-medium text-secondary-900">
                    ${month.totalRevenue.toLocaleString()}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4 text-xs text-secondary-600">
                  <div>Usuarios nuevos: +{month.newUsers}</div>
                  <div>Subastas realizadas: +{month.auctionsCompleted}</div>
                  <div>Total ingresos: ${month.totalRevenue.toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        </div> {/* Fin del contenido exportable */}

        {/* Quick Actions - Fuera del contenido exportable */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">
            Acciones Rápidas
          </h3>
          <div className="flex justify-center">
            <button 
              onClick={handleExportPDF}
              disabled={isExporting}
              className="flex items-center justify-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isExporting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  <span className="font-medium">Generando PDF...</span>
                </>
              ) : (
                <>
                  <DownloadIcon className="mr-2" size={20} />
                  <span className="font-medium">Exportar Reporte</span>
                </>
              )}
            </button>
          </div>
          <p className="text-center text-sm text-secondary-600 mt-2">
            Descargar un PDF con toda la información mostrada en pantalla
          </p>
        </div>
      </main>
    </div>
  )
}

export default AdminStatistics