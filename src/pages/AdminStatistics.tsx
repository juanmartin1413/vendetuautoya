import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeftIcon, BarChartIcon, UsersIcon, FileTextIcon, DollarSignIcon } from '../components/Icons'

const AdminStatistics = () => {
  const navigate = useNavigate()
  const [period, setPeriod] = useState('month')

  // Mock data de estadísticas - posteriormente se conectará al backend
  const mockStats = {
    totalUsers: 1247,
    newUsersThisMonth: 83,
    totalPublications: 425,
    activeAuctions: 67,
    totalRevenue: 147520,
    averageAuctionPrice: 35000,
    topCategories: [
      { name: 'Sedán', count: 145, percentage: 34 },
      { name: 'SUV', count: 98, percentage: 23 },
      { name: 'Hatchback', count: 87, percentage: 20 },
      { name: 'Deportivo', count: 52, percentage: 12 },
      { name: 'Pickup', count: 43, percentage: 11 }
    ],
    monthlyGrowth: [
      { month: 'Ene', users: 45, publications: 23, revenue: 12300 },
      { month: 'Feb', users: 52, publications: 31, revenue: 15200 },
      { month: 'Mar', users: 83, publications: 45, revenue: 18900 },
      { month: 'Abr', users: 67, publications: 38, revenue: 16800 },
      { month: 'May', users: 74, publications: 42, revenue: 19500 }
    ]
  }

  const StatCard = ({ title, value, icon, color, subtitle }: {
    title: string
    value: string | number
    icon: React.ReactNode
    color: string
    subtitle?: string
  }) => (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-secondary-500 mb-1">{title}</p>
          <p className="text-2xl font-bold text-secondary-900">{value}</p>
          {subtitle && (
            <p className="text-sm text-secondary-600 mt-1">{subtitle}</p>
          )}
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          {icon}
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
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 border border-orange-200">
                Vista Administrador
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Period Selector */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-secondary-900">
              Panel de Control
            </h2>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="week">Esta semana</option>
              <option value="month">Este mes</option>
              <option value="quarter">Este trimestre</option>
              <option value="year">Este año</option>
            </select>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Usuarios"
            value={mockStats.totalUsers.toLocaleString()}
            subtitle={`+${mockStats.newUsersThisMonth} este mes`}
            icon={<UsersIcon className="text-white" size={24} />}
            color="bg-blue-500"
          />
          <StatCard
            title="Publicaciones"
            value={mockStats.totalPublications.toLocaleString()}
            subtitle={`${mockStats.activeAuctions} subastas activas`}
            icon={<FileTextIcon className="text-white" size={24} />}
            color="bg-green-500"
          />
          <StatCard
            title="Ingresos Totales"
            value={`$${mockStats.totalRevenue.toLocaleString()}`}
            subtitle="En comisiones"
            icon={<DollarSignIcon className="text-white" size={24} />}
            color="bg-yellow-500"
          />
          <StatCard
            title="Precio Promedio"
            value={`$${mockStats.averageAuctionPrice.toLocaleString()}`}
            subtitle="Por subasta"
            icon={<BarChartIcon className="text-white" size={24} />}
            color="bg-purple-500"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Categories */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-secondary-900 mb-4">
              Categorías Más Populares
            </h3>
            <div className="space-y-4">
              {mockStats.topCategories.map((category) => (
                <div key={category.name} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-secondary-700 w-20">
                      {category.name}
                    </span>
                    <div className="ml-4 flex-1 bg-secondary-200 rounded-full h-2">
                      <div
                        className="bg-primary-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${category.percentage}%` }}
                      />
                    </div>
                  </div>
                  <div className="ml-4 text-right">
                    <span className="text-sm font-medium text-secondary-900">
                      {category.count}
                    </span>
                    <span className="text-xs text-secondary-500 ml-2">
                      ({category.percentage}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Monthly Growth */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-secondary-900 mb-4">
              Crecimiento Mensual
            </h3>
            <div className="space-y-4">
              {mockStats.monthlyGrowth.map((month) => (
                <div key={month.month} className="border-b border-secondary-100 pb-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-secondary-700">
                      {month.month}
                    </span>
                    <span className="text-sm font-medium text-secondary-900">
                      ${month.revenue.toLocaleString()}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-xs text-secondary-600">
                    <div>Usuarios: +{month.users}</div>
                    <div>Publicaciones: +{month.publications}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">
            Acciones Rápidas
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => navigate('/admin-users')}
              className="p-4 border-2 border-secondary-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all duration-200 text-left"
            >
              <UsersIcon className="text-primary-600 mb-2" size={24} />
              <h4 className="font-medium text-secondary-900">Gestionar Usuarios</h4>
              <p className="text-sm text-secondary-600">Ver y administrar usuarios registrados</p>
            </button>
            
            <button
              onClick={() => navigate('/admin-publications')}
              className="p-4 border-2 border-secondary-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all duration-200 text-left"
            >
              <FileTextIcon className="text-primary-600 mb-2" size={24} />
              <h4 className="font-medium text-secondary-900">Revisar Publicaciones</h4>
              <p className="text-sm text-secondary-600">Aprobar o rechazar publicaciones</p>
            </button>
            
            <button className="p-4 border-2 border-secondary-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all duration-200 text-left">
              <BarChartIcon className="text-primary-600 mb-2" size={24} />
              <h4 className="font-medium text-secondary-900">Exportar Reportes</h4>
              <p className="text-sm text-secondary-600">Generar reportes detallados</p>
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default AdminStatistics