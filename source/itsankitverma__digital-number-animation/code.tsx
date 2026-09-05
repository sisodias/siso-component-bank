import React, { useState, useEffect } from 'react'

interface DigitalNumberViewProps {
  value: number
  duration?: number
  className?: string
  prefix?: string
  suffix?: string
  decimalPlaces?: number
  variant?: 'blue' | 'purple' | 'emerald' | 'amber' | 'cyan' | 'rose'
}

export const DigitalNumberView = ({
  value,
  duration = 2000,
  className = '',
  prefix = '',
  suffix = '',
  decimalPlaces = 0,
  variant = 'blue',
}) => {
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    const startTime = Date.now()
    const startValue = 0
    const endValue = value

    const animate = () => {
      const currentTime = Date.now()
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      const currentValue = startValue + (endValue - startValue) * easeOutQuart

      setDisplayValue(currentValue)

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        setDisplayValue(endValue)
      }
    }

    animate()
  }, [value, duration])

  const formatNumber = (num: number): string => {
    return num.toFixed(decimalPlaces)
  }

  const getVariantStyles = () => {
    const variants = {
      blue: 'bg-gradient-to-r from-blue-100 to-indigo-200 border-blue-300',
      purple: 'bg-gradient-to-r from-purple-100 to-pink-200 border-purple-300',
      emerald: 'bg-gradient-to-r from-emerald-100 to-teal-200 border-emerald-300',
      amber: 'bg-gradient-to-r from-amber-100 to-orange-200 border-amber-300',
      cyan: 'bg-gradient-to-r from-cyan-100 to-blue-200 border-cyan-300',
      rose: 'bg-gradient-to-r from-rose-100 to-red-200 border-rose-300',
    }
    return variants[variant]
  }

  return (
    <div
      className={`font-mono text-4xl font-bold tracking-wider text-center rounded-lg p-4 border ${getVariantStyles()} ${className}`}
    >
      <span className="inline-block">
        <span className="text-gray-600">{prefix}</span>
        <span className="text-gray-900">
          {formatNumber(displayValue)}
        </span>
        <span className="text-gray-600">{suffix}</span>
      </span>
    </div>
  );
};
