import * as React from 'react'
import { LucideIcon } from 'lucide-react'

export type FloatingExpandableCardProps = {
  className?: string
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  icon: LucideIcon
  iconSize?: number
  buttonSize?: number
  expandedWidth?: number
  expandedHeight?: number
  borderRadius?: number
  expandedBorderRadius?: number
  backgroundColor?: string
  shadowIntensity?: 'sm' | 'md' | 'lg'
  animationDuration?: number
  animationDelay?: number
  children: React.ReactNode
  onHoverChange?: (isHovered: boolean) => void
}

export const FloatingExpandableCard: React.FC<FloatingExpandableCardProps> = ({
  className = '',
  position = 'bottom-right',
  icon: Icon,
  iconSize = 20,
  buttonSize = 45,
  expandedWidth = 320,
  expandedHeight = 250,
  borderRadius = 50,
  expandedBorderRadius = 20,
  backgroundColor = 'bg-white/95',
  shadowIntensity = 'md',
  animationDuration = 500,
  animationDelay = 400,
  children,
  onHoverChange,
}) => {
  const [isHovered, setIsHovered] = React.useState(false)

  const handleHoverChange = (hovered: boolean) => {
    setIsHovered(hovered)
    onHoverChange?.(hovered)
  }

  const positionStyles = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4',
  }

  const shadowStyles = {
    sm: {
      collapsed: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
      expanded: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    },
    md: {
      collapsed: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
      expanded: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    },
    lg: {
      collapsed: '0 20px 25px -5px rgb(0 0 0 / 0.15), 0 8px 10px -6px rgb(0 0 0 / 0.15)',
      expanded: '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    },
  }

  const expandOrigin = position.includes('bottom') && position.includes('right')
    ? 'bottom-0 right-0'
    : position.includes('bottom') && position.includes('left')
    ? 'bottom-0 left-0'
    : position.includes('top') && position.includes('right')
    ? 'top-0 right-0'
    : 'top-0 left-0'

  return (
    <div className={`fixed ${positionStyles[position]} z-50 ${className}`}>
      <div
        className="relative"
        onMouseEnter={() => handleHoverChange(true)}
        onMouseLeave={() => handleHoverChange(false)}
      >
        <div
          className={`absolute ${expandOrigin} ${backgroundColor} backdrop-blur-sm shadow-lg border border-gray-200/80 transition-all`}
          style={{
            width: isHovered ? `${expandedWidth}px` : `${buttonSize}px`,
            height: isHovered ? `${expandedHeight}px` : `${buttonSize}px`,
            borderRadius: isHovered ? `${expandedBorderRadius}px` : `${borderRadius}%`,
            boxShadow: isHovered
              ? shadowStyles[shadowIntensity].expanded
              : shadowStyles[shadowIntensity].collapsed,
            transitionDuration: `${animationDuration}ms`,
            transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          <div
            className="absolute overflow-hidden transition-opacity"
            style={{
              top: isHovered ? '0' : `${buttonSize * 0.27}px`,
              left: isHovered ? '10px' : `${buttonSize * 0.27}px`,
              right: isHovered ? '25px' : `${buttonSize * 0.27}px`,
              bottom: isHovered ? '0' : `${buttonSize * 0.27}px`,
              borderRadius: `${expandedBorderRadius}px`,
              opacity: isHovered ? 1 : 0,
              pointerEvents: isHovered ? 'auto' : 'none',
              transitionDuration: '300ms',
              transitionDelay: isHovered ? `${animationDelay}ms` : '0ms',
            }}
          >
            {children}
          </div>
        </div>

        <div
          className="relative z-10 flex items-center justify-center pointer-events-none"
          style={{
            height: `${buttonSize}px`,
            width: `${buttonSize}px`,
          }}
        >
          <Icon
            size={iconSize}
            className={`
              transition-all ease-out
              ${isHovered ? 'text-gray-700 scale-105 rotate-12' : 'text-gray-600'}
            `}
            style={{
              transitionDuration: `${animationDuration}ms`,
            }}
          />
        </div>
      </div>
    </div>
  )
}