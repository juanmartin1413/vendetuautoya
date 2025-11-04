import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
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
  const { user } = useAuth()

  // Si es concesionario, navegar al componente específico
  useEffect(() => {
    if (user?.type === 'concesionario') {
      navigate('/concesionario-my-data')
    }
  }, [user, navigate])

  // No renderizar nada si es concesionario (se está redirigiendo)
  if (user?.type === 'concesionario') {
    return null
  }

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
          {/* Datos personales */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-lg font-semibold text-secondary-900 mb-6">Datos Personales</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nombre */}
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-secondary-700 mb-2">
                  Nombre *
                </label>
                <input
                  type="text"
                  id="firstName"
                  value={userData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className="input-field"
                  placeholder="Ej: Juan"
                  required
                />
              </div>

              {/* Apellido */}
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-secondary-700 mb-2">
                  Apellido *
                </label>
                <input
                  type="text"
                  id="lastName"
                  value={userData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className="input-field"
                  placeholder="Ej: Pérez"
                  required
                />
              </div>

              {/* Teléfono */}
              <div className="md:col-span-2">
                <label htmlFor="phone" className="block text-sm font-medium text-secondary-700 mb-2">
                  Teléfono *
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={userData.phone}
                  onChange={(e) => {
                    // Limitar a 20 caracteres
                    if (e.target.value.length <= 20) {
                      handleInputChange('phone', e.target.value)
                    }
                  }}
                  className="input-field"
                  placeholder="Ej: +54 9 11 1234-5678"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  {userData.phone.length}/20 caracteres
                </p>
              </div>
            </div>
          </div>

          {/* Dirección */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-lg font-semibold text-secondary-900 mb-6">Dirección</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Calle */}
              <div>
                <label htmlFor="street" className="block text-sm font-medium text-secondary-700 mb-2">
                  Calle *
                </label>
                <input
                  type="text"
                  id="street"
                  value={userData.address.street}
                  onChange={(e) => handleInputChange('address.street', e.target.value)}
                  className="input-field"
                  placeholder="Ej: Av. Corrientes"
                  required
                />
              </div>

              {/* Altura */}
              <div>
                <label htmlFor="number" className="block text-sm font-medium text-secondary-700 mb-2">
                  Altura *
                </label>
                <input
                  type="text"
                  id="number"
                  value={userData.address.number}
                  onChange={(e) => handleInputChange('address.number', e.target.value)}
                  className="input-field"
                  placeholder="Ej: 1234"
                  required
                />
              </div>

              {/* Piso */}
              <div>
                <label htmlFor="floor" className="block text-sm font-medium text-secondary-700 mb-2">
                  Piso
                </label>
                <input
                  type="text"
                  id="floor"
                  value={userData.address.floor}
                  onChange={(e) => handleInputChange('address.floor', e.target.value)}
                  className="input-field"
                  placeholder="Ej: 5"
                />
              </div>

              {/* Departamento */}
              <div>
                <label htmlFor="apartment" className="block text-sm font-medium text-secondary-700 mb-2">
                  Departamento
                </label>
                <input
                  type="text"
                  id="apartment"
                  value={userData.address.apartment}
                  onChange={(e) => handleInputChange('address.apartment', e.target.value)}
                  className="input-field"
                  placeholder="Ej: A"
                />
              </div>

              {/* Provincia */}
              <div className="md:col-span-2">
                <label htmlFor="province" className="block text-sm font-medium text-secondary-700 mb-2">
                  Provincia *
                </label>
                <select
                  id="province"
                  value={userData.address.province}
                  onChange={(e) => handleInputChange('address.province', e.target.value)}
                  className="input-field"
                  required
                >
                  <option value="">Selecciona una provincia</option>
                  <option value="Buenos Aires">Buenos Aires</option>
                  <option value="CABA">Ciudad Autónoma de Buenos Aires</option>
                  <option value="Catamarca">Catamarca</option>
                  <option value="Chaco">Chaco</option>
                  <option value="Chubut">Chubut</option>
                  <option value="Córdoba">Córdoba</option>
                  <option value="Corrientes">Corrientes</option>
                  <option value="Entre Ríos">Entre Ríos</option>
                  <option value="Formosa">Formosa</option>
                  <option value="Jujuy">Jujuy</option>
                  <option value="La Pampa">La Pampa</option>
                  <option value="La Rioja">La Rioja</option>
                  <option value="Mendoza">Mendoza</option>
                  <option value="Misiones">Misiones</option>
                  <option value="Neuquén">Neuquén</option>
                  <option value="Río Negro">Río Negro</option>
                  <option value="Salta">Salta</option>
                  <option value="San Juan">San Juan</option>
                  <option value="San Luis">San Luis</option>
                  <option value="Santa Cruz">Santa Cruz</option>
                  <option value="Santa Fe">Santa Fe</option>
                  <option value="Santiago del Estero">Santiago del Estero</option>
                  <option value="Tierra del Fuego">Tierra del Fuego</option>
                  <option value="Tucumán">Tucumán</option>
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
    </div>
  )
}

export default MyData