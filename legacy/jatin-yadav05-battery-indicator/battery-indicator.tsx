import { cn } from "../_utils/cn"
import type { CSSProperties, SVGProps } from 'react'

export interface BatteryProps extends Omit<SVGProps<SVGSVGElement>, 'className'> {
  level: number
  size?: number | string
  isCharging?: boolean
  showPercentage?: boolean
  showBolt?: boolean
  theme?: 'default' | 'minimal' | 'neon' | 'glass'
  colorScheme?: 'auto' | 'success' | 'warning' | 'danger' | 'info' | { [key: number]: string }
  animation?: {
    duration?: number
    delay?: number
    chargingPulse?: boolean
    lowBatteryPulse?: boolean
  }
  className?: 
    | string 
    | {
        containerClassName?: string
        batteryClassName?: string
        fillClassName?: string
        terminalClassName?: string
        textClassName?: string
        boltClassName?: string
      }
}

/**
 * Renders a battery indicator with customizable themes, animations, and charging states.
 * @param level - Battery level as a percentage (0-100)
 * @param size - Width and height of the battery. Defaults to 100px
 * @param isCharging - Whether the battery is currently charging
 * @param showPercentage - Show percentage text inside battery
 * @param showBolt - Show lightning bolt when charging
 * @param theme - Visual theme for the battery
 * @param colorScheme - Color scheme based on battery level or fixed color
 * @param animation - Animation settings for transitions and effects
 * @param className - Class names for different parts of the battery
 */
function Battery({
  level,
  size = 100,
  isCharging = false,
  showPercentage = true,
  showBolt = true,
  theme = 'default',
  colorScheme = 'auto',
  animation = {
    duration: 800,
    delay: 0,
    chargingPulse: true,
    lowBatteryPulse: true
  },
  className,
  ...props
}: BatteryProps) {
  const clampedLevel = Math.max(0, Math.min(100, level))
  const batteryWidth = 60
  const batteryHeight = 30
  const terminalWidth = 4
  const terminalHeight = 12
  const cornerRadius = 4
  const fillPadding = 2

  const getBatteryColor = () => {
    if (colorScheme === 'auto') {
      if (isCharging) return '#10b981' // Green when charging
      if (clampedLevel <= 15) return '#ef4444' // Red for low battery
      if (clampedLevel <= 30) return '#f59e0b' // Amber for medium-low
      if (clampedLevel <= 60) return '#3b82f6' // Blue for medium
      return '#10b981' // Green for high
    }
    
    if (typeof colorScheme === 'string') {
      const colors = {
        success: '#10b981',
        warning: '#f59e0b', 
        danger: '#ef4444',
        info: '#3b82f6'
      }
      return colors[colorScheme as keyof typeof colors] || colorScheme
    }
    
    if (typeof colorScheme === 'object') {
      const keys = Object.keys(colorScheme).sort((a, b) => Number(a) - Number(b))
      for (let i = 0; i < keys.length; i++) {
        const currentKey = Number(keys[i])
        const nextKey = Number(keys[i + 1])
        if (clampedLevel >= currentKey && (clampedLevel < nextKey || !nextKey)) {
          return colorScheme[currentKey]
        }
      }
    }
    
    return '#10b981'
  }

  const getStrokeColor = () => {
    if (theme === 'neon') return getBatteryColor()
    return 'currentColor' // This will adapt to light/dark mode
  }

  const getTerminalColor = () => {
    if (theme === 'neon') return getBatteryColor()
    return 'currentColor' // This will adapt to light/dark mode
  }

  const getTextColor = () => {
    if (theme === 'glass' || theme === 'neon') return '#ffffff'
    return clampedLevel > 50 ? '#ffffff' : 'currentColor'
  }

  const getFillWidth = () => {
    const maxFillWidth = batteryWidth - (fillPadding * 2)
    return (clampedLevel / 100) * maxFillWidth
  }

  const getThemeStyles = () => {
    const baseStyles = {
      transition: `all ${animation.duration}ms ease ${animation.delay}ms`
    }

    switch (theme) {
      case 'minimal':
        return {
          ...baseStyles,
          filter: 'none',
          strokeWidth: 1.5
        }
      case 'neon':
        return {
          ...baseStyles,
          filter: `drop-shadow(0 0 8px ${getBatteryColor()}40)`,
          strokeWidth: 2
        }
      case 'glass':
        return {
          ...baseStyles,
          filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.1))',
          strokeWidth: 1
        }
      default:
        return {
          ...baseStyles,
          filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.2))',
          strokeWidth: 1.5
        }
    }
  }

  const shouldPulse = () => {
    return (isCharging && animation.chargingPulse) || 
           (clampedLevel <= 15 && !isCharging && animation.lowBatteryPulse)
  }

  const getPulseKeyframes = () => {
    if (isCharging) {
      return `
        @keyframes chargePulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.05); }
        }
      `
    }
    return `
      @keyframes lowBatteryPulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.4; }
      }
    `
  }

  const containerStyles: CSSProperties = {
    ...getThemeStyles(),
    ...(shouldPulse() && {
      animation: isCharging ? 'chargePulse 2s infinite' : 'lowBatteryPulse 1.5s infinite'
    })
  }

  return (
    <>
      <style>{getPulseKeyframes()}</style>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${batteryWidth + terminalWidth + 4} ${batteryHeight + 4}`}
        className={cn('', typeof className === 'string' ? className : className?.containerClassName)}
        style={containerStyles}
        {...props}
      >
        {/* Battery Body */}
        <rect
          x={2}
          y={2}
          width={batteryWidth}
          height={batteryHeight}
          rx={cornerRadius}
          ry={cornerRadius}
          fill={theme === 'glass' ? 'rgba(255,255,255,0.1)' : 'transparent'}
          stroke={getStrokeColor()}
          strokeWidth={getThemeStyles().strokeWidth}
          className={cn('text-gray-400 dark:text-gray-500', typeof className === 'object' && className?.batteryClassName)}
        />
        
        {/* Battery Terminal */}
        <rect
          x={batteryWidth + 2}
          y={(batteryHeight - terminalHeight) / 2 + 2}
          width={terminalWidth}
          height={terminalHeight}
          rx={2}
          ry={2}
          fill={getTerminalColor()}
          className={cn('text-gray-400 dark:text-gray-500', typeof className === 'object' && className?.terminalClassName)}
        />
        
        {/* Battery Fill */}
        {clampedLevel > 0 && (
          <rect
            x={2 + fillPadding}
            y={2 + fillPadding}
            width={getFillWidth()}
            height={batteryHeight - (fillPadding * 2)}
            rx={cornerRadius - 1}
            ry={cornerRadius - 1}
            fill={getBatteryColor()}
            className={cn('', typeof className === 'object' && className?.fillClassName)}
            style={{
              transition: `width ${animation.duration}ms ease ${animation.delay}ms`,
              ...(theme === 'glass' && {
                background: `linear-gradient(135deg, ${getBatteryColor()}80, ${getBatteryColor()})`
              })
            }}
          />
        )}
        
        {/* Charging Bolt */}
        {isCharging && showBolt && (
          <g className={cn('', typeof className === 'object' && className?.boltClassName)}>
            <path
              d={`M${batteryWidth/2 - 3} ${batteryHeight/2 - 6} L${batteryWidth/2 + 1} ${batteryHeight/2 - 2} L${batteryWidth/2 - 1} ${batteryHeight/2 - 2} L${batteryWidth/2 + 3} ${batteryHeight/2 + 6} L${batteryWidth/2 - 1} ${batteryHeight/2 + 2} L${batteryWidth/2 + 1} ${batteryHeight/2 + 2} Z`}
              fill={theme === 'glass' || theme === 'neon' ? '#ffffff' : 'currentColor'}
              className="text-gray-900 dark:text-white"
              style={{
                animation: 'chargePulse 1s infinite',
                transformOrigin: 'center'
              }}
            />
          </g>
        )}
        
        {/* Percentage Text */}
        {showPercentage && !isCharging && (
          <text
            x={batteryWidth / 2 + 2}
            y={batteryHeight / 2 + 2}
            textAnchor="middle"
            dominantBaseline="middle"
            fill={getTextColor()}
            fontSize={theme === 'minimal' ? '8' : '10'}
            fontWeight="600"
            className={cn('text-gray-900 dark:text-white', typeof className === 'object' && className?.textClassName)}
          >
            {Math.round(clampedLevel)}
          </text>
        )}
      </svg>
    </>
  )
}

export { Battery }
