import React, { useState, useRef, useCallback } from 'react'
import { Plane, Bluetooth, Wifi, Moon } from 'lucide-react'

// LiquidGlass Component
function LiquidGlass({
  children,
  className = "",
  style,
  variant = "card",
  intensity = "medium",
  rippleEffect = true,
  stretchOnDrag = true,
  onClick,
  onDragStart,
  onDragEnd,
}) {
  const [isJiggling, setIsJiggling] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const [isPressed, setIsPressed] = useState(false)
  const [wobbleOffset, setWobbleOffset] = useState({ x: 0, y: 0 })
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 })
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [ripples, setRipples] = useState([])
  const elementRef = useRef(null)
  const dragStartPos = useRef({ x: 0, y: 0 })
  const rippleCounter = useRef(0)

  const getVariantClasses = () => {
    const baseClasses = "liquid-glass relative overflow-hidden"
    switch (variant) {
      case "button":
        return `${baseClasses} px-6 py-3 rounded-2xl cursor-pointer select-none`
      case "card":
        return `${baseClasses} p-6 rounded-3xl`
      case "panel":
        return `${baseClasses} p-8 rounded-2xl`
      case "floating":
        return `${baseClasses} p-4 rounded-full shadow-2xl`
      default:
        return baseClasses
    }
  }

  const getIntensityClasses = () => {
    switch (intensity) {
      case "subtle":
        return "backdrop-blur-sm bg-white/5 border-white/10"
      case "strong":
        return "backdrop-blur-3xl bg-white/20 border-white/30"
      default:
        return "backdrop-blur-xl bg-white/10 border-white/20"
    }
  }

  const createRipple = useCallback((e) => {
    if (!rippleEffect || !elementRef.current) return
    const rect = elementRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const newRipple = { id: rippleCounter.current++, x, y }
    setRipples((prev) => [...prev, newRipple])
    setTimeout(() => {
      setRipples((prev) => prev.filter((ripple) => ripple.id !== newRipple.id))
    }, 600)
  }, [rippleEffect])

  const handleMouseDown = useCallback((e) => {
    if (stretchOnDrag) {
      setIsDragging(true)
      dragStartPos.current = { x: e.clientX, y: e.clientY }
      onDragStart?.()
    } else if (variant === "button") {
      setIsPressed(true)
    }
    createRipple(e)
  }, [stretchOnDrag, onDragStart, createRipple, variant])

  const handleMouseMove = useCallback((e) => {
    if (elementRef.current) {
      const rect = elementRef.current.getBoundingClientRect()
      setCursorPos({ x: e.clientX - rect.left, y: e.clientY - rect.top })
    }
    if (!isDragging) return
    const deltaX = e.clientX - dragStartPos.current.x
    const deltaY = e.clientY - dragStartPos.current.y
    setDragOffset({ x: deltaX * 0.1, y: deltaY * 0.1 })
  }, [isDragging])

  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      setIsDragging(false)
      const currentOffset = { ...dragOffset }
      setWobbleOffset(currentOffset)
      setDragOffset({ x: 0, y: 0 })
      onDragEnd?.()
      setIsJiggling(true)
      setTimeout(() => {
        setIsJiggling(false)
        setWobbleOffset({ x: 0, y: 0 })
      }, 1800)
    } else if (variant === "button" && isPressed) {
      setIsPressed(false)
      setWobbleOffset({ x: 0, y: 0 })
      setIsJiggling(true)
      setTimeout(() => setIsJiggling(false), 1800)
    }
  }, [isDragging, dragOffset, onDragEnd, variant, isPressed])

  const handleClick = useCallback((e) => {
    createRipple(e)
    onClick?.()
  }, [onClick, createRipple])

  const transformStyle = isJiggling
    ? { "--wobble-start-x": `${wobbleOffset.x}px`, "--wobble-start-y": `${wobbleOffset.y}px` }
    : {
        transform: `translate(${dragOffset.x}px, ${dragOffset.y}px) ${isDragging ? "scale(1.02)" : ""}`,
        transition: isDragging ? "none" : "transform 0.3s cubic-bezier(0.23, 1, 0.32, 1)",
      }

  return (
    <div
      ref={elementRef}
      className={`${getVariantClasses()} ${getIntensityClasses()} ${isJiggling && variant === "button" ? "liquid-wobble-active" : ""} ${isPressed && variant === "button" ? "liquid-pressed" : ""} ${className}`}
      style={{ ...transformStyle, ...style }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={() => {
        setIsHovering(false)
        setIsPressed(false)
        handleMouseUp()
      }}
      onMouseEnter={() => setIsHovering(true)}
      onClick={handleClick}
    >
      {isHovering && (
        <div
          className="absolute pointer-events-none transition-opacity duration-200"
          style={{
            left: cursorPos.x,
            top: cursorPos.y,
            width: "80px",
            height: "80px",
            background: "radial-gradient(circle, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.05) 50%, transparent 100%)",
            borderRadius: "50%",
            transform: "translate(-50%, -50%)",
            filter: "blur(10px)",
            zIndex: 2,
          }}
        />
      )}
      {ripples.map((ripple) => (
        <div
          key={ripple.id}
          className="absolute pointer-events-none"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: "4px",
            height: "4px",
            borderRadius: "50%",
            background: "rgba(255, 255, 255, 0.4)",
            transform: "translate(-50%, -50%)",
            animation: "liquidRipple 0.6s ease-out forwards",
          }}
        />
      ))}
      <div className="relative z-10">{children}</div>
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none z-5 w-full" />
    </div>
  )
}

// LiquidButton Component
function LiquidButton({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  style,
  rippleEffect = true,
}) {
  const [isPressed, setIsPressed] = useState(false)

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return 'text-white bg-gradient-to-r from-blue-500/20 to-purple-600/20 border-blue-400/30 hover:from-blue-400/30 hover:to-purple-500/30'
      case 'secondary':
        return 'text-gray-100 bg-white/10 border-white/20 hover:bg-white/15'
      case 'ghost':
        return 'text-white bg-transparent border-white/10 hover:bg-white/5'
      case 'danger':
        return 'text-white bg-gradient-to-r from-red-500/20 to-pink-600/20 border-red-400/30 hover:from-red-400/30 hover:to-pink-500/30'
      default:
        return 'text-white bg-white/10 border-white/20'
    }
  }

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'px-4 py-2 text-sm rounded-xl'
      case 'lg':
        return 'px-8 py-4 text-lg rounded-2xl'
      case 'xl':
        return 'px-10 py-5 text-xl rounded-3xl'
      default:
        return 'px-6 py-3 text-base rounded-2xl'
    }
  }

  const handleClick = useCallback(() => {
    if (disabled) return
    setIsPressed(false)
    onClick?.()
  }, [disabled, onClick])

  return (
    <LiquidGlass
      variant="button"
      intensity="medium"
      rippleEffect={rippleEffect}
      flowOnHover={!disabled}
      stretchOnDrag={!disabled}
      onClick={handleClick}
      className={`${getVariantStyles()} ${getSizeStyles()} ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${isPressed ? 'scale-95' : ''} transition-all duration-150 ease-out font-medium select-none backdrop-blur-3xl ${className}`}
      style={style}
    >
      {children}
    </LiquidGlass>
  )
}

// Main App Component
export default function App1() {
  const [toggleStates, setToggleStates] = useState({
    airplane: false,
    airdrop: false,
    wifi: true,
    dnd: false,
  })

  const buttons = [
    {
      id: 'airplane',
      icon: Plane,
      label: 'Airplane Mode',
      activeBackground: 'linear-gradient(135deg, rgba(249, 115, 22, 0.7) 0%, rgba(234, 88, 12, 0.7) 100%)',
      activeBorder: 'rgba(251, 146, 60, 0.8)',
      active: toggleStates.airplane,
    },
    {
      id: 'airdrop',
      icon: Bluetooth,
      label: 'AirDrop',
      activeBackground: 'linear-gradient(135deg, rgba(59, 130, 246, 0.7) 0%, rgba(37, 99, 235, 0.7) 100%)',
      activeBorder: 'rgba(96, 165, 250, 0.8)',
      active: toggleStates.airdrop,
    },
    {
      id: 'wifi',
      icon: Wifi,
      label: 'Wi-Fi',
      activeBackground: 'linear-gradient(135deg, rgba(59, 130, 246, 0.7) 0%, rgba(37, 99, 235, 0.7) 100%)',
      activeBorder: 'rgba(96, 165, 250, 0.8)',
      active: toggleStates.wifi,
    },
    {
      id: 'dnd',
      icon: Moon,
      label: 'Do Not Disturb',
      activeBackground: 'linear-gradient(135deg, rgba(168, 85, 247, 0.7) 0%, rgba(147, 51, 234, 0.7) 100%)',
      activeBorder: 'rgba(196, 181, 253, 0.8)',
      active: toggleStates.dnd,
    },
  ]

  const handleToggle = (buttonId) => {
    setToggleStates((prev) => ({
      ...prev,
      [buttonId]: !prev[buttonId],
    }))
  }

  return (
    <>
      <style>{`
        @keyframes liquidRipple {
          0% {
            width: 4px;
            height: 4px;
            opacity: 0.6;
          }
          100% {
            width: 100px;
            height: 100px;
            opacity: 0;
          }
        }
      `}</style>
      <div className="min-h-screen flex items-center justify-center p-8 relative overflow-hidden bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 w-full">
        <div
          className="fixed left-0 top-0 right-0 bottom-0 w-full h-full bg-cover bg-center bg-no-repeat z-10"
          style={{ backgroundImage: `url('https://picsum.photos/1920/1080')` }}
        />
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/5 rounded-full blur-3xl animate-pulse" />
          <div
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: '1s' }}
          />
          <div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-blue-400/5 rounded-full blur-2xl animate-pulse"
            style={{ animationDelay: '2s' }}
          />
        </div>
        <LiquidGlass
          variant="panel"
          intensity="medium"
          rippleEffect={false}
          flowOnHover={false}
          stretchOnDrag={false}
          className="relative z-20"
          style={{ padding: '24px', borderRadius: '64px' }}
        >
          <div className="grid grid-cols-2 relative">
            {buttons.map((button) => {
              const IconComponent = button.icon
              const useStroke = button.id === 'wifi' || button.id === 'airdrop'
              return (
                <LiquidButton
                  key={button.id}
                  variant="primary"
                  size="xl"
                  onClick={() => handleToggle(button.id)}
                  rippleEffect={false}
                  className="shadow-2xl w-24 h-24 !p-0 !rounded-full flex items-center justify-center m-2 transition-all duration-300"
                  style={{
                    width: '96px',
                    height: '96px',
                    padding: '0',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '8px',
                    background: button.active ? button.activeBackground : undefined,
                    borderColor: button.active ? button.activeBorder : undefined,
                  }}
                >
                  <IconComponent
                    className="pointer-events-none"
                    size={40}
                    color="white"
                    fill={useStroke ? 'none' : 'white'}
                    strokeWidth={useStroke ? 2 : 0}
                  />
                </LiquidButton>
              )
            })}
          </div>
        </LiquidGlass>
      </div>
    </>
  )
}