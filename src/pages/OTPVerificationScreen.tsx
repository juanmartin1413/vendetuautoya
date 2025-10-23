import { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { ArrowLeftIcon } from '../components/Icons'

const OTPVerificationScreen = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [isLoading, setIsLoading] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [error, setError] = useState('')
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Obtener email del estado de navegación
  const email = location.state?.email || 'tu correo electrónico'

  useEffect(() => {
    // Enfocar el primer input al cargar
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus()
    }
  }, [])

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return // Solo permitir un dígito

    const newOtp = [...otp]
    newOtp[index] = value

    setOtp(newOtp)
    setError('')

    // Auto-avanzar al siguiente input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').slice(0, 6)
    const newOtp = [...otp]
    
    for (let i = 0; i < pastedData.length && i < 6; i++) {
      if (/\d/.test(pastedData[i])) {
        newOtp[i] = pastedData[i]
      }
    }
    
    setOtp(newOtp)
    setError('')

    // Enfocar el siguiente input disponible
    const nextIndex = Math.min(pastedData.length, 5)
    inputRefs.current[nextIndex]?.focus()
  }

  const handleConfirm = async () => {
    const otpCode = otp.join('')
    
    if (otpCode.length !== 6) {
      setError('Por favor ingresa el código completo de 6 dígitos')
      return
    }

    setIsLoading(true)
    setError('')

    // Simular verificación (el código correcto es "123456" para testing)
    setTimeout(() => {
      if (otpCode === '123456') {
        // Verificación exitosa
        setIsVerified(true)
        
        // Después de mostrar el check verde, redirigir al login
        setTimeout(() => {
          navigate('/login', { 
            state: { message: '¡Cuenta verificada exitosamente! Ya puedes iniciar sesión.' }
          })
        }, 2000)
      } else {
        setError('Código incorrecto. Por favor verifica e intenta nuevamente.')
        setIsLoading(false)
      }
    }, 1500)
  }

  const handleResendCode = async () => {
    setIsResending(true)
    setError('')
    
    // Simular reenvío
    setTimeout(() => {
      setIsResending(false)
      // Limpiar inputs
      setOtp(['', '', '', '', '', ''])
      if (inputRefs.current[0]) {
        inputRefs.current[0].focus()
      }
    }, 1000)
  }

  const handleBack = () => {
    navigate('/register')
  }

  if (isVerified) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center animate-fade-in">
          <div className="bg-white rounded-2xl p-8 shadow-xl">
            <div className="animate-scale-in">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-green-600 animate-check" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-secondary-900 mb-2">
                ¡Cuenta verificada!
              </h2>
              <p className="text-secondary-600">
                Tu cuenta ha sido verificada exitosamente. Serás redirigido al login en unos segundos.
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center px-6 animate-fade-in">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <button
            onClick={handleBack}
            className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6 transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Volver
          </button>
          
          <div className="mb-6">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-secondary-900 mb-2">
            Verifica tu correo
          </h2>
          <p className="text-secondary-600 mb-2">
            Te enviamos un código de 6 dígitos a tu correo electrónico
          </p>
          <p className="text-primary-600 font-medium text-sm">
            {email}
          </p>
        </div>

        {/* OTP Form */}
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <div className="space-y-6">
            {/* OTP Inputs */}
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-4 text-center">
                Ingresa el código de verificación
              </label>
              <div className="flex justify-center space-x-3">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    pattern="\d*"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value.replace(/\D/g, ''))}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={index === 0 ? handlePaste : undefined}
                    className={`w-12 h-14 text-center text-xl font-bold border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all ${
                      error ? 'border-red-500 bg-red-50' : 'border-secondary-300'
                    } ${digit ? 'bg-primary-50 border-primary-300' : ''}`}
                    disabled={isLoading || isVerified}
                  />
                ))}
              </div>
              {error && (
                <p className="text-red-500 text-sm mt-3 text-center animate-shake">
                  {error}
                </p>
              )}
            </div>

            {/* Buttons */}
            <div className="space-y-4">
              <button
                onClick={handleConfirm}
                disabled={isLoading || isVerified || otp.join('').length !== 6}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-all ${
                  isLoading || otp.join('').length !== 6
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-primary-600 hover:bg-primary-700 text-white transform hover:scale-105'
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Verificando...
                  </div>
                ) : (
                  'Confirmar'
                )}
              </button>

              <button
                onClick={handleResendCode}
                disabled={isResending || isLoading}
                className="w-full py-3 px-4 border border-primary-600 text-primary-600 rounded-lg font-medium hover:bg-primary-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isResending ? 'Reenviando...' : 'Reenviar código'}
              </button>
            </div>

            {/* Help text */}
            <div className="text-center">
              <p className="text-xs text-secondary-500">
                ¿No recibiste el código? Revisa tu carpeta de spam o{' '}
                <button 
                  onClick={handleResendCode}
                  className="text-primary-600 hover:text-primary-700 font-medium"
                  disabled={isResending || isLoading}
                >
                  solicita uno nuevo
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OTPVerificationScreen