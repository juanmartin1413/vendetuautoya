import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeftIcon } from '../components/Icons'

interface UserData {
  firstName: string
  lastName: string
  phone: string
  address: {
    street: string
    number: string
    floor: string
    apartment: string
    province: string
  }
}

const MyData = () => {
  const navigate = useNavigate()
  const [userData, setUserData] = useState<UserData>({
    firstName: '',
    lastName: '',
    phone: '',
    address: {
      street: '',
      number: '',
      floor: '',
      apartment: '',
      province: ''
    }
  })

  const [showSuccessMessage, setShowSuccessMessage] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    if (field.startsWith('address.')) {
      const addressField = field.split('.')[1]
      setUserData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }))
    } else {
      setUserData(prev => ({
        ...prev,
        [field]: value
      }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validaciones básicas
    if (!userData.firstName.trim() || !userData.lastName.trim()) {
      alert('Por favor completa nombre y apellido')
      return
    }

    if (!userData.phone.trim()) {
      alert('Por favor completa el teléfono')
      return
    }

    if (!userData.address.street.trim() || !userData.address.number.trim() || !userData.address.province) {
      alert('Por favor completa al menos calle, altura y provincia')
      return
    }

    // Simular guardado
    setShowSuccessMessage(true)
    setTimeout(() => {
      setShowSuccessMessage(false)
      navigate('/dashboard')
    }, 2000)
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
            <h1 className="text-xl font-bold text-secondary-900">Mis Datos</h1>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Propósito de uso */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-secondary-900 mb-6">Propósito de uso</h2>
            
            <div>
              <p className="text-lg font-medium text-secondary-700 mb-4">
                ¿Para qué deseas utilizar la app?
              </p>
              
              <div className="space-y-3">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="sell"
                    name="purpose"
                    value="sell"
                    checked={true}
                    disabled={true}
                    className="h-4 w-4 text-primary-600 border-gray-300 focus:ring-primary-500 disabled:opacity-50"
                  />
                  <label htmlFor="sell" className="ml-3 text-secondary-700">
                    Quiero vender mi vehículo
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="buy"
                    name="purpose"
                    value="buy"
                    checked={false}
                    disabled={true}
                    className="h-4 w-4 text-primary-600 border-gray-300 focus:ring-primary-500 disabled:opacity-50"
                  />
                  <label htmlFor="buy" className="ml-3 text-secondary-700 opacity-50">
                    Quiero comprar vehículos al mejor precio
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Datos personales */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-secondary-900 mb-6">Datos Personales</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nombre */}
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Nombre *
                </label>
                <input
                  type="text"
                  value={userData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  maxLength={40}
                  className="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Ingresa tu nombre"
                  required
                />
                <p className="text-xs text-secondary-500 mt-1">
                  {userData.firstName.length}/40 caracteres
                </p>
              </div>

              {/* Apellido */}
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Apellido *
                </label>
                <input
                  type="text"
                  value={userData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  maxLength={40}
                  className="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Ingresa tu apellido"
                  required
                />
                <p className="text-xs text-secondary-500 mt-1">
                  {userData.lastName.length}/40 caracteres
                </p>
              </div>

              {/* Teléfono */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Teléfono *
                </label>
                <input
                  type="tel"
                  value={userData.phone}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '')
                    if (value.length <= 15) {
                      handleInputChange('phone', value)
                    }
                  }}
                  maxLength={15}
                  className="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Ej: 1123456789"
                  required
                />
                <p className="text-xs text-secondary-500 mt-1">
                  Solo números - {userData.phone.length}/15 caracteres
                </p>
              </div>
            </div>
          </div>

          {/* Domicilio */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-secondary-900 mb-6">Domicilio</h2>
            
            <div className="space-y-6">
              {/* Calle y Altura */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Calle *
                  </label>
                  <input
                    type="text"
                    value={userData.address.street}
                    onChange={(e) => handleInputChange('address.street', e.target.value)}
                    maxLength={30}
                    className="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Ej: Av. Corrientes"
                    required
                  />
                  <p className="text-xs text-secondary-500 mt-1">
                    {userData.address.street.length}/30 caracteres
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Altura *
                  </label>
                  <input
                    type="text"
                    value={userData.address.number}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '')
                      if (value.length <= 6) {
                        handleInputChange('address.number', value)
                      }
                    }}
                    maxLength={6}
                    className="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="1234"
                    required
                  />
                  <p className="text-xs text-secondary-500 mt-1">
                    {userData.address.number.length}/6 caracteres
                  </p>
                </div>
              </div>

              {/* Piso y Departamento */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Piso
                  </label>
                  <input
                    type="text"
                    value={userData.address.floor}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '')
                      if (value.length <= 2) {
                        handleInputChange('address.floor', value)
                      }
                    }}
                    maxLength={2}
                    className="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="12"
                  />
                  <p className="text-xs text-secondary-500 mt-1">
                    Solo números - {userData.address.floor.length}/2 caracteres
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Departamento
                  </label>
                  <input
                    type="text"
                    value={userData.address.apartment}
                    onChange={(e) => {
                      const value = e.target.value.toUpperCase()
                      if (value.length <= 3) {
                        handleInputChange('address.apartment', value)
                      }
                    }}
                    maxLength={3}
                    className="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="A, 1A, etc."
                  />
                  <p className="text-xs text-secondary-500 mt-1">
                    {userData.address.apartment.length}/3 caracteres
                  </p>
                </div>
              </div>

              {/* Provincia */}
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Provincia *
                </label>
                <select
                  value={userData.address.province}
                  onChange={(e) => handleInputChange('address.province', e.target.value)}
                  className="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                >
                  <option value="">Selecciona una provincia</option>
                  <option value="CABA">CABA</option>
                  <option value="Provincia de Bs As">Provincia de Bs As</option>
                </select>
              </div>
            </div>
          </div>

          {/* Botón de guardar */}
          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-8 rounded-lg transition-colors duration-200"
            >
              Guardar Datos
            </button>
          </div>
        </form>
      </div>

      {/* Modal de éxito */}
      {showSuccessMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md mx-4">
            <div className="text-center">
              <div className="text-green-600 text-5xl mb-4">✓</div>
              <h3 className="text-xl font-bold text-secondary-900 mb-2">¡Datos guardados!</h3>
              <p className="text-secondary-600">
                Tus datos han sido actualizados correctamente.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MyData