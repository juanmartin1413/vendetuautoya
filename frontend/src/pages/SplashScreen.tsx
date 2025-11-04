import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const SplashScreen = () => {
  const navigate = useNavigate()

  useEffect(() => {
    // Navigate to login after 10 seconds
    const timer = setTimeout(() => {
      navigate('/login')
    }, 10000)

    return () => clearTimeout(timer)
  }, [navigate])

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary-50 via-rose-50 to-primary-100">
      {/* Decorative blurred circles */}
      <div className="pointer-events-none absolute -top-24 -left-24 w-72 h-72 bg-primary-200/40 rounded-full blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 w-80 h-80 bg-primary-300/30 rounded-full blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 -right-10 w-56 h-56 bg-primary-100/50 rounded-full blur-2xl" />
      
      <div className="text-center relative z-10">
        {/* Animated Logo (SVG with money rain) */}
        <div className="mb-8 drop-shadow-xl">
          <img
            src="/logo_money_rain.svg"
            alt="VendeTuAutoYa Animated"
            className="w-[340px] max-w-[80vw] mx-auto select-none"
          />
        </div>

        {/* Loading indicator */}
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary-300 border-t-primary-500"></div>
        </div>

        {/* Loading text */}
        <p className="mt-4 text-primary-600 font-medium tracking-wide">
          Cargando...
        </p>
      </div>

      {/* CSS fallback rain (only if SVG script fails) */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)]">
        {/* We create a few pseudo money notes via divs; hidden by default if SVG anim works */}
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="absolute top-[-10%] w-10 h-5 bg-gradient-to-br from-green-400 to-green-500 rounded-sm shadow-sm opacity-0 animate-[fall-linear_infinite]"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${(i * 0.45).toFixed(2)}s`,
              animationDuration: `${(6 + Math.random() * 5).toFixed(2)}s`,
            }}
          >
            <div className="w-full h-full flex items-center justify-center text-white text-xs font-bold">$</div>
          </div>
        ))}
      </div>
      <style>{`
        @keyframes fall-linear_infinite {
          0% { transform: translateY(-10%) rotate(0deg); opacity:0; }
          10% { opacity:0.9; }
          90% { opacity:0.9; }
          100% { transform: translateY(120vh) rotate(25deg); opacity:0; }
        }
      `}</style>
    </div>
  )
}

export default SplashScreen