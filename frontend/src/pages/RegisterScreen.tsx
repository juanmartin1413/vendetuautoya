import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeftIcon } from '../components/Icons'
import { authService } from '../services/authService'
import { RegisterRequest, UserType } from '../types/auth'
import { useToast } from '../hooks/useToast'
import { ToastContainer } from '../components/ToastContainer'

interface RegisterFormData {
  name: string
  email: string
  purpose: 'vendedor' | 'concesionario' | ''
  password: string
  confirmPassword: string
}

const RegisterScreen = () => {
  const navigate = useNavigate()
  const { toasts, removeToast, showSuccess, showError } = useToast()
  
  const [formData, setFormData] = useState<RegisterFormData>({
    name: '',
    email: '',
    purpose: '',
    password: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState<{[key: string]: string}>({})
  const [isLoading, setIsLoading] = useState(false)
  const [fadeOut, setFadeOut] = useState(false)
  const [emailExistsError, setEmailExistsError] = useState(false)

  // Validar email
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleInputChange = (field: keyof RegisterFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))

    // Limpiar error del campo
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }

    // Limpiar error de email existente cuando el usuario cambie el email
    if (field === 'email' && emailExistsError) {
      setEmailExistsError(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    const newErrors: {[key: string]: string} = {}

    // Validar nombre
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido'
    }

    // Validar email
    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido'
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Ingresa un email válido'
    }

    // Validar propósito
    if (!formData.purpose) {
      newErrors.purpose = 'Selecciona para qué deseas utilizar la app'
    }

    // Validar contraseña
    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida'
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres'
    }

    // Validar confirmación de contraseña
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirma tu contraseña'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsLoading(true)

    try {
      // Mapear el tipo de usuario según las respuestas:
      // "Quiero vender mi vehículo" -> UserType = 1 (Vendedor)
      // "Quiero comprar vehículos al mejor precio" -> UserType = 2 (Concesionario)
      const userType: UserType = formData.purpose === 'vendedor' ? 1 : 2
      
      const registerRequest: RegisterRequest = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        type: userType
      }

      console.log('RegisterRequest being sent:', registerRequest)

      await authService.register(registerRequest)
      
      showSuccess('¡Cuenta creada exitosamente!')
      
      // Iniciar fade-out
      setFadeOut(true)
      
      // Después del fade-out, navegar a OTP
      setTimeout(() => {
        navigate('/verify-otp', { 
          state: { 
            email: formData.email,
            userType: formData.purpose,
            message: 'Cuenta creada exitosamente. Verifica tu email para continuar.'
          }
        })
      }, 1000)

    } catch (error: any) {
      console.error('Error en registro:', error)
      console.log('Error completo:', JSON.stringify(error, null, 2))
      
      // Extraer el mensaje de error del backend de forma más directa
      let errorMessage = 'No se pudo crear la cuenta. Por favor intenta nuevamente.'
      
      // Intentar diferentes formas de extraer el mensaje
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      } else if (error.response?.data?.title) {
        errorMessage = error.response.data.title
      } else if (error.response?.data && typeof error.response.data === 'string') {
        errorMessage = error.response.data
      } else if (error.response?.status === 400 && error.response?.statusText) {
        errorMessage = error.response.statusText
      } else if (error.response?.status === 500) {
        errorMessage = 'Hubo un problema en el servidor. Por favor intenta nuevamente en unos minutos.'
      } else if (error.code === 'NETWORK_ERROR' || error.message === 'Network Error') {
        errorMessage = 'No se puede conectar con el servidor. Verifica tu conexión a internet.'
      }
      
      console.log('Error message extracted:', errorMessage)
      
      // Verificar si es un error de email duplicado de manera más amplia
      const errorStr = errorMessage.toLowerCase()
      const isEmailDuplicate = (
        errorStr.includes('email') || 
        errorStr.includes('correo')
      ) && (
        errorStr.includes('registrado') || 
        errorStr.includes('existe') ||
        errorStr.includes('already') ||
        errorStr.includes('duplicate') ||
        errorStr.includes('duplicado') ||
        errorStr.includes('taken') ||
        errorStr.includes('use')
      )
      
      // También verificar si el error 400 viene de un email duplicado
      // Solo considerar 400 como email duplicado si el mensaje menciona email/correo
      const is400EmailError = error.response?.status === 400 && (
        errorStr.includes('email') || errorStr.includes('correo') || errorStr.includes('registrado')
      )
      
      if (error.isEmailDuplicate || isEmailDuplicate || is400EmailError) {
        console.log('Email duplicate error detected, setting emailExistsError to true')
        setEmailExistsError(true)
        // No mostrar toast para este error, mostraremos el mensaje inline
      } else {
        console.log('Showing regular error toast:', errorMessage)
        // Para otros errores, mostrar toast normal
        showError(errorMessage)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleBackToLogin = () => {
    navigate('/login')
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center px-6 transition-opacity duration-200 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}>
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <button
            onClick={handleBackToLogin}
            className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-4 transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Volver al login
          </button>
          
          <img 
            src="/logo.svg" 
            alt="VendeTuAutoYa" 
            className="mx-auto w-32 h-auto mb-6"
          />
          <h2 className="text-3xl font-bold text-secondary-900">
            Crear cuenta
          </h2>
          <p className="mt-2 text-secondary-600">
            Únete a VendeTuAutoYa y comienza a comprar o vender vehículos
          </p>
        </div>

        {/* Register Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Nombre completo */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-secondary-700 mb-2">
                Nombre completo *
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${
                  errors.name ? 'border-red-500' : 'border-secondary-300'
                }`}
                placeholder="Tu nombre completo"
                disabled={isLoading}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-secondary-700 mb-2">
                Email *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${
                  errors.email ? 'border-red-500' : 'border-secondary-300'
                }`}
                placeholder="tu@email.com"
                disabled={isLoading}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            {/* Purpose Selection */}
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-3">
                ¿Para qué deseas utilizar la app? *
              </label>
              <div className="space-y-3">
                <label className="flex items-start p-3 border border-secondary-200 rounded-lg cursor-pointer hover:bg-primary-50 transition-colors">
                  <input
                    type="radio"
                    name="purpose"
                    value="vendedor"
                    checked={formData.purpose === 'vendedor'}
                    onChange={(e) => handleInputChange('purpose', e.target.value as 'vendedor' | 'concesionario')}
                    className="text-primary-600 mt-1 mr-3 focus:ring-primary-500"
                    disabled={isLoading}
                  />
                  <div>
                    <span className="text-secondary-900 font-medium">
                      Quiero vender mi vehículo
                    </span>
                    <p className="text-sm text-secondary-600 mt-1">
                      Ideal para personas que quieren vender su auto particular
                    </p>
                  </div>
                </label>
                <label className="flex items-start p-3 border border-secondary-200 rounded-lg cursor-pointer hover:bg-primary-50 transition-colors">
                  <input
                    type="radio"
                    name="purpose"
                    value="concesionario"
                    checked={formData.purpose === 'concesionario'}
                    onChange={(e) => handleInputChange('purpose', e.target.value as 'vendedor' | 'concesionario')}
                    className="text-primary-600 mt-1 mr-3 focus:ring-primary-500"
                    disabled={isLoading}
                  />
                  <div>
                    <span className="text-secondary-900 font-medium">
                      Quiero comprar vehículos al mejor precio
                    </span>
                    <p className="text-sm text-secondary-600 mt-1">
                      Para concesionarios y agencieros profesionales
                    </p>
                  </div>
                </label>
              </div>
              {errors.purpose && <p className="text-red-500 text-sm mt-1">{errors.purpose}</p>}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-secondary-700 mb-2">
                Contraseña *
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${
                  errors.password ? 'border-red-500' : 'border-secondary-300'
                }`}
                placeholder="Mínimo 6 caracteres"
                disabled={isLoading}
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-secondary-700 mb-2">
                Confirmar contraseña *
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${
                  errors.confirmPassword ? 'border-red-500' : 'border-secondary-300'
                }`}
                placeholder="Repite tu contraseña"
                disabled={isLoading}
              />
              {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
            </div>
          </div>

          {/* Email exists error message */}
          {emailExistsError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center" role="alert" aria-live="assertive">
              <div className="flex items-center justify-center mb-2">
                <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span className="text-red-800 font-medium">Este email ya está registrado</span>
              </div>
              <p className="text-red-700 text-sm mb-3">
                Ya existe una cuenta con <strong>{formData.email}</strong>
              </p>
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => navigate('/login', { 
                    state: { 
                      email: formData.email,
                      message: 'Ingresa tu contraseña para acceder a tu cuenta'
                    }
                  })}
                  className="btn-primary w-full flex items-center justify-center"
                >
                  Iniciar sesión con esta cuenta
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEmailExistsError(false)
                    setFormData(prev => ({ ...prev, email: '' }))
                  }}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Usar un email diferente
                </button>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`btn-primary w-full ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creando cuenta...
                </div>
              ) : (
                'Crear cuenta'
              )}
            </button>
          </div>

          {/* Terms */}
          <div className="text-center">
            <p className="text-xs text-secondary-500">
              Al registrarte, aceptas nuestros{' '}
              <a href="#" className="text-primary-600 hover:text-primary-700">
                Términos y Condiciones
              </a>{' '}
              y{' '}
              <a href="#" className="text-primary-600 hover:text-primary-700">
                Política de Privacidad
              </a>
            </p>
          </div>
        </form>
      </div>
      
      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onRemoveToast={removeToast} />
    </div>
  )
}

export default RegisterScreen