import { useState } from 'react'

const LoginScreen = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement login logic
    console.log('Login attempt:', { email, password })
  }

  const handleForgotPassword = () => {
    // TODO: Implement forgot password logic
    console.log('Forgot password clicked')
  }

  const handleRegister = () => {
    // TODO: Implement register navigation
    console.log('Register clicked')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center px-6">
      <div className="max-w-md w-full space-y-8">
        {/* Logo */}
        <div className="text-center">
          <img 
            src="/logo.svg" 
            alt="VendeTuAutoYa" 
            className="w-60 h-45 mx-auto mb-4"
          />
          <h2 className="text-3xl font-bold text-secondary-900 mb-2">
            ¡Bienvenido!
          </h2>
          <p className="text-secondary-600">
            Inicia sesión para continuar
          </p>
        </div>

        {/* Login Form */}
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-secondary-700 mb-2">
                Correo electrónico
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="input-field"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-secondary-700 mb-2">
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="input-field"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {/* Login Button */}
          <div>
            <button
              type="submit"
              className="btn-primary w-full"
            >
              Iniciar Sesión
            </button>
          </div>

          {/* Forgot Password Link */}
          <div className="text-center">
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-primary-600 hover:text-primary-700 text-sm font-medium transition-colors duration-200"
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-secondary-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gradient-to-br from-primary-50 to-secondary-50 text-secondary-500">
                ¿No tienes cuenta?
              </span>
            </div>
          </div>

          {/* Register Button */}
          <div>
            <button
              type="button"
              onClick={handleRegister}
              className="btn-secondary w-full"
            >
              Registrarse
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default LoginScreen