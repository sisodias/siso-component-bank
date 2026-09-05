'use client'
import React, { useState } from 'react'

export default function BorderButton() {
  const [isHovered, setIsHovered] = useState(false)
  const [isPressed, setIsPressed] = useState(false)

  return (
    <div className='h-screen w-full flex justify-center items-center bg-gradient-to-br from-black/90 to-black'>
      <button 
        className='group relative border-2 flex justify-center items-center gap-3 border-white/70 rounded-full w-[9.3rem] h-12 
                   transition-all duration-500 ease-out hover:border-white hover:shadow-lg hover:shadow-white/20 
                   hover:scale-105 active:scale-95 overflow-hidden backdrop-blur-sm
                   before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent 
                   before:via-white/5 before:to-transparent before:translate-x-[-100%] 
                   hover:before:translate-x-[100%] before:transition-transform before:duration-700'
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false)
          setIsPressed(false)
        }}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
      >
        {/* Subtle glow effect */}
        <div className='absolute inset-0 rounded-full bg-gradient-to-r from-amber-200/0 via-amber-200/10 to-amber-200/0 
                        opacity-0 group-hover:opacity-100 transition-opacity duration-500'></div>
        
        {/* Text */}
        <span className='text-white font-medium tracking-wide text-sm transition-all duration-300 
                         group-hover:text-amber-50 relative z-10'>
          Get Started
        </span>
        
        {/* Animated dot */}
        <span className={`relative z-10 w-4 h-4 bg-amber-200 rounded-full transition-all duration-500 ease-out
                         ${isHovered ? 'bg-amber-300 shadow-lg shadow-amber-300/50 scale-110' : ''}
                         ${isPressed ? 'scale-90' : ''}
                         before:absolute before:inset-0 before:bg-amber-400 before:rounded-full 
                         before:animate-pulse before:opacity-0 group-hover:before:opacity-30`}>
          {/* Ripple effect */}
          <div className='absolute inset-0 rounded-full bg-amber-200 animate-ping opacity-0 group-hover:opacity-75'
               style={{ animationDuration: '2s' }}></div>
        </span>
        
        {/* Hover state border animation */}
        <div className='absolute inset-0 rounded-full border-2 border-amber-200/0 
                        group-hover:border-amber-200/30 transition-all duration-500 
                        animate-pulse opacity-0 group-hover:opacity-100'></div>
      </button>
    </div>
  )
}