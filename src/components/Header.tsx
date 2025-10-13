import React from 'react'

interface HeaderProps {
  title: string
  leftAction?: {
    icon: React.ReactNode
    onClick: () => void
  }
  rightAction?: {
    icon: React.ReactNode
    onClick: () => void
  }
}

const Header = ({ title, leftAction, rightAction }: HeaderProps) => {
  return (
    <header className="bg-white shadow-lg">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-3">
          {leftAction && (
            <button
              onClick={leftAction.onClick}
              className="bg-primary text-white p-2 rounded-full hover:bg-primary/90 transition-colors"
            >
              {leftAction.icon}
            </button>
          )}
          <h1 className="text-xl font-bold text-gray-900">{title}</h1>
        </div>
        
        {rightAction && (
          <button
            onClick={rightAction.onClick}
            className="bg-primary text-white p-2 rounded-full hover:bg-primary/90 transition-colors"
          >
            {rightAction.icon}
          </button>
        )}
      </div>
    </header>
  )
}

export default Header