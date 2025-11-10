import React from 'react'

interface ProgressIndicatorProps {
  percentage: number
  isProfileComplete: boolean
  isAddressComplete: boolean
  isDocumentationComplete: boolean
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  percentage,
  isProfileComplete,
  isAddressComplete,
  isDocumentationComplete
}) => {
  const sections = [
    { name: 'Datos Personales', completed: isProfileComplete },
    { name: 'Dirección', completed: isAddressComplete },
    { name: 'Documentación', completed: isDocumentationComplete }
  ]

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-secondary-900">
          Progreso del Perfil
        </h3>
        <span className="text-2xl font-bold text-primary-600">
          {percentage}%
        </span>
      </div>

      {/* Barra de progreso */}
      <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
        <div
          className="bg-gradient-to-r from-primary-500 to-primary-600 h-3 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Lista de secciones */}
      <div className="space-y-2">
        {sections.map((section, index) => (
          <div key={index} className="flex items-center">
            <div className={`w-5 h-5 rounded-full flex items-center justify-center mr-3 ${
              section.completed 
                ? 'bg-green-500 text-white' 
                : 'bg-gray-300 text-gray-500'
            }`}>
              {section.completed ? (
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                <span className="text-xs">○</span>
              )}
            </div>
            <span className={`text-sm ${
              section.completed 
                ? 'text-gray-900 font-medium' 
                : 'text-gray-600'
            }`}>
              {section.name}
            </span>
          </div>
        ))}
      </div>

      {percentage === 100 && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-medium text-green-800">
              ¡Perfil completado al 100%!
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProgressIndicator