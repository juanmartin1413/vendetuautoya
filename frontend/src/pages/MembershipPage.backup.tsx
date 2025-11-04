import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { User } from '../types/auth'
import { ArrowLeftIcon, UserIcon, CheckIcon, DollarSignIcon } from '../components/Icons'

// Declarar MercadoPago globalmente
declare global {
  interface Window {
    MercadoPago: any;
  }
}

interface MembershipPageProps {
  user: User
  onUpdateUser: (updatedUser: User) => void
}

interface MembershipPlan {
  id: 'monthly' | 'annual'
  name: string
  price: number
  duration: string
  savings?: string
  features: string[]
}

const MembershipPage = ({ user, onUpdateUser }: MembershipPageProps) => {
  const navigate = useNavigate()
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'annual'>('monthly')
  const [isProcessing, setIsProcessing] = useState(false)

  // Inicializar MercadoPago
  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://sdk.mercadopago.com/js/v2'
    script.async = true
    script.onload = () => {
      if (window.MercadoPago) {
        // Clave pública de prueba de MercadoPago
        // En producción, usar la clave pública real
        window.MercadoPago.setPublishableKey('TEST-d0cc4ba1-8a4e-4d14-b580-d46e6a03b026')
      }
    }
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  const membershipPlans: MembershipPlan[] = [
    {
      id: 'monthly',
      name: 'Premium Mensual',
      price: 20000,
      duration: '30 días',
      features: [
        'Participar en todas las subastas',
        'Realizar ofertas ilimitadas',
        'Acceso a historial completo',
        'Notificaciones prioritarias',
        'Soporte técnico'
      ]
    },
    {
      id: 'annual',
      name: 'Premium Anual',
      price: 220000,
      duration: '365 días',
      savings: 'Ahorra $20.000',
      features: [
        'Todos los beneficios del plan mensual',
        'Descuento del 8.3%',
        'Sin preocupaciones por 12 meses',
        'Renovación automática opcional',
        'Soporte premium'
      ]
    }
  ]

  const currentPlan = membershipPlans.find(plan => plan.id === selectedPlan)!

  const isPremiumActive = () => {
    if (!user.membership || user.membership.status === 'free') return false
    if (!user.membership.expirationDate) return false
    
    const expirationDate = new Date(user.membership.expirationDate)
    const now = new Date()
    return expirationDate > now
  }

  const getExpirationDate = () => {
    if (!user.membership?.expirationDate) return null
    return new Date(user.membership.expirationDate).toLocaleDateString('es-ES')
  }

  const handleMercadoPagoPayment = async () => {
    setIsProcessing(true)

    try {
      // Datos para crear la preferencia de MercadoPago
      const preferenceData = {
        items: [
          {
            title: `Membresía Premium ${selectedPlan === 'monthly' ? 'Mensual' : 'Anual'} - VendeTuAutoYa`,
            description: `Acceso completo a todas las subastas por ${selectedPlan === 'monthly' ? '30 días' : '365 días'}`,
            quantity: 1,
            currency_id: 'ARS',
            unit_price: currentPlan.price
          }
        ],
        payer: {
          name: user.name,
          email: user.email
        },
        back_urls: {
          success: `${window.location.origin}/membership?payment=success&plan=${selectedPlan}`,
          failure: `${window.location.origin}/membership?payment=failure&plan=${selectedPlan}`,
          pending: `${window.location.origin}/membership?payment=pending&plan=${selectedPlan}`
        },
        auto_return: 'approved',
        external_reference: `${user.email}-${selectedPlan}-${Date.now()}`,
        statement_descriptor: 'VendeTuAutoYa',
        expires: true,
        expiration_date_from: new Date().toISOString(),
        expiration_date_to: new Date(Date.now() + 30 * 60 * 1000).toISOString() // 30 minutos
      }

      console.log('Creando preferencia de MercadoPago:', preferenceData)

      // En una implementación real, aquí harías un POST a tu backend
      // Por ahora, vamos a crear una preferencia de demo con MercadoPago Sandbox
      
      // Simular respuesta del backend con ID de preferencia
      const mockPreferenceId = `test-preference-${Date.now()}`
      
      // URL de MercadoPago Checkout con la preferencia
      const checkoutUrl = `https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=${mockPreferenceId}`
      
      console.log('Redirigiendo a MercadoPago:', checkoutUrl)
      
      // ⚠️ IMPORTANTE: Para demo, vamos a simular la redirección
      // En producción real, simplemente harías: window.location.href = checkoutUrl
      
      // Mostrar información de la redirección antes de proceder
      const shouldRedirect = confirm(
        `� Redirección a MercadoPago\n\n` +
        `Se abrirá MercadoPago con:\n` +
        `• Producto: ${preferenceData.items[0].title}\n` +
        `• Precio: $${currentPlan.price.toLocaleString()} ARS\n` +
        `• Email: ${user.email}\n\n` +
        `URLs de retorno configuradas:\n` +
        `• Éxito: ${preferenceData.back_urls.success}\n` +
        `• Error: ${preferenceData.back_urls.failure}\n\n` +
        `¿Proceder con la redirección?`
      )

      if (shouldRedirect) {
        // REDIRECCIÓN REAL A MERCADOPAGO
        // Para demo con redirección real, descomenta la siguiente línea:
        // window.location.href = checkoutUrl
        
        // Para pruebas, vamos a usar el entorno de testing de MercadoPago
        const testCheckoutUrl = `https://sandbox.mercadopago.com.ar/checkout/v1/redirect?pref_id=${mockPreferenceId}`
        
        console.log('Redirigiendo a MercadoPago Sandbox:', testCheckoutUrl)
        
        // Preguntamos si quiere hacer redirección real o simulada
        const useRealRedirect = confirm(
          '🔄 Tipo de Demo\n\n' +
          'Elige el tipo de demostración:\n\n' +
          '• OK: Redirección real a MercadoPago (puede mostrar error)\n' +
          '• Cancel: Simulación completa del flujo\n\n' +
          '¿Usar redirección real a MercadoPago?'
        )
        
        if (useRealRedirect) {
          // REDIRECCIÓN REAL - Esto llevará a MercadoPago real
          alert('⚠️ Redirigiendo a MercadoPago real...\nPuede mostrar error por ID de preferencia inválido.')
          setTimeout(() => {
            window.location.href = testCheckoutUrl
          }, 1000)
        } else {
          // SIMULACIÓN COMPLETA - Para demo funcional
          alert('🔄 Simulando flujo completo de MercadoPago...')
          setTimeout(() => {
            window.location.href = preferenceData.back_urls.success
          }, 3000)
        }
      } else {
        setIsProcessing(false)
      }

    } catch (error) {
      console.error('Error al crear preferencia de MercadoPago:', error)
      alert('Error al conectar con MercadoPago. Verifica tu conexión e intenta nuevamente.')
      setIsProcessing(false)
    }
  }

  const handlePaymentSuccess = () => {
    // Calcular nueva fecha de expiración
    const now = new Date()
    const expirationDate = new Date(now)
    
    if (selectedPlan === 'monthly') {
      expirationDate.setMonth(expirationDate.getMonth() + 1)
    } else {
      expirationDate.setFullYear(expirationDate.getFullYear() + 1)
    }

    // Actualizar usuario con nueva membresía
    const updatedUser: User = {
      ...user,
      membership: {
        status: selectedPlan === 'monthly' ? 'premium_monthly' : 'premium_annual',
        expirationDate: expirationDate.toISOString(),
        lastPaymentDate: now.toISOString(),
        autoRenew: true
      }
    }

    onUpdateUser(updatedUser)
    setIsProcessing(false)
    
    alert(`🎉 ¡Felicitaciones! Su pago ha sido completado exitosamente.\n\n✅ Su membresía ${currentPlan.name} está ahora activa hasta el ${expirationDate.toLocaleDateString('es-ES')}.\n\n🚀 Ya puede disfrutar de todos los beneficios premium y realizar ofertas en las subastas.`)
  }

  // Verificar parámetros de URL para manejar respuesta de MercadoPago
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const paymentStatus = urlParams.get('payment')
    const plan = urlParams.get('plan')

    if (paymentStatus === 'success' && plan) {
      setSelectedPlan(plan as 'monthly' | 'annual')
      handlePaymentSuccess()
      // Limpiar URL
      window.history.replaceState({}, '', '/membership')
    } else if (paymentStatus === 'failure') {
      alert('El pago fue rechazado. Intenta nuevamente.')
      setIsProcessing(false)
      window.history.replaceState({}, '', '/membership')
    } else if (paymentStatus === 'pending') {
      alert('Tu pago está siendo procesado. Te notificaremos cuando se confirme.')
      setIsProcessing(false)
      window.history.replaceState({}, '', '/membership')
    }
  }, [])

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
                <UserIcon className="text-yellow-600 mr-3" size={32} />
                <h1 className="text-2xl font-bold text-secondary-900">
                  Mi Membresía
                </h1>
              </div>
            </div>
            
            {/* Estado actual */}
            <div className="flex items-center">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                isPremiumActive() 
                  ? 'bg-green-100 text-green-800 border border-green-200'
                  : 'bg-gray-100 text-gray-800 border border-gray-200'
              }`}>
                {isPremiumActive() ? 'Premium Activo' : 'Membresía Gratuita'}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Estado actual de membresía */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-secondary-900 mb-4">
            Estado Actual de tu Membresía
          </h2>
          
          {isPremiumActive() ? (
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center mb-2">
                  <UserIcon className="text-yellow-500 mr-2" size={24} />
                  <span className="text-lg font-semibold text-green-600">
                    Premium {user.membership?.status === 'premium_monthly' ? 'Mensual' : 'Anual'}
                  </span>
                </div>
                <p className="text-secondary-600">
                  Vence el: <span className="font-medium">{getExpirationDate()}</span>
                </p>
                <p className="text-sm text-secondary-500 mt-1">
                  Puedes participar en todas las subastas
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600 mb-1">Activa</div>
                <div className="text-sm text-secondary-600">
                  Renovación automática: {user.membership?.autoRenew ? 'Sí' : 'No'}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center mb-2">
                  <span className="text-lg font-semibold text-gray-600">
                    Membresía Gratuita
                  </span>
                </div>
                <p className="text-secondary-600">
                  Puedes ver subastas pero no realizar ofertas
                </p>
                <p className="text-sm text-orange-600 mt-1">
                  ⚠️ Actualiza a Premium para participar en subastas
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-600 mb-1">Gratuita</div>
                <div className="text-sm text-secondary-600">
                  Funcionalidad limitada
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Planes de membresía */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-secondary-900 mb-6">
            {isPremiumActive() ? 'Renovar o Cambiar Plan' : 'Obtener Membresía Premium'}
          </h2>

          {/* Selector de plan */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {membershipPlans.map((plan) => (
              <div
                key={plan.id}
                className={`border-2 rounded-lg p-6 cursor-pointer transition-all duration-200 ${
                  selectedPlan === plan.id
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-secondary-200 hover:border-primary-300'
                }`}
                onClick={() => setSelectedPlan(plan.id)}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-secondary-900">
                    {plan.name}
                  </h3>
                  {selectedPlan === plan.id && (
                    <CheckIcon className="text-primary-600" size={24} />
                  )}
                </div>
                
                <div className="text-3xl font-bold text-primary-600 mb-2">
                  ${plan.price.toLocaleString()}
                </div>
                
                <div className="text-secondary-600 mb-4">
                  Por {plan.duration}
                  {plan.savings && (
                    <span className="ml-2 text-green-600 font-medium">
                      ({plan.savings})
                    </span>
                  )}
                </div>

                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm text-secondary-700">
                      <CheckIcon className="text-green-500 mr-2" size={16} />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Botón de pago */}
          <div className="text-center">
            <button
              onClick={handleMercadoPagoPayment}
              disabled={isProcessing}
              className="inline-flex items-center px-8 py-3 bg-primary-600 text-white text-lg font-semibold rounded-lg hover:bg-primary-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                  Procesando...
                </>
              ) : (
                <>
                  <DollarSignIcon className="mr-3" size={24} />
                  Pagar ${currentPlan.price.toLocaleString()} con MercadoPago
                </>
              )}
            </button>
            
            <p className="text-sm text-secondary-600 mt-4 text-center">
              🔒 Pago seguro procesado por MercadoPago
            </p>
            <p className="text-xs text-secondary-500 mt-2 text-center">
              Demo funcional con simulación de pago exitoso
            </p>
            
            {/* Información adicional de la demo */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="text-sm font-semibold text-blue-800 mb-2">
                🚀 Demo de Integración MercadoPago
              </h4>
              <ul className="text-xs text-blue-700 space-y-1">
                <li>• <strong>Opción 1:</strong> Redirección real a MercadoPago (puede mostrar error sin backend)</li>
                <li>• <strong>Opción 2:</strong> Simulación completa del flujo de pago</li>
                <li>• URLs de retorno configuradas correctamente</li>
                <li>• Estructura de datos completa para producción</li>
              </ul>
              <div className="mt-3 p-2 bg-green-100 rounded border border-green-300">
                <p className="text-xs text-green-800">
                  <strong>✅ Producción:</strong> Se enviarían estos datos al backend para crear una preferencia real en MercadoPago, luego se redirigiría automáticamente al checkout.
                </p>
              </div>
              <div className="mt-2 p-2 bg-yellow-100 rounded border border-yellow-300">
                <p className="text-xs text-yellow-800">
                  <strong>⚠️ Demo:</strong> Puedes elegir ver la redirección real (mostrará error por ID inválido) o la simulación completa funcional.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default MembershipPage