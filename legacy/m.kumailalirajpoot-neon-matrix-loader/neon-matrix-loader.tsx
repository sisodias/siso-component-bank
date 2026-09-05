'use client'

import React from 'react'

export  function NeonMatrixLoader() {
  return (
    <div className='flex flex-col items-center justify-center gap-6 p-8'>
      {/* Main loader container */}
      <div className='relative w-10 h-10'>
        {/* Animated squares grid */}
        <div className='grid grid-cols-3 gap-2 w-full h-full'>
          {[...Array(9)].map((_, index) => (
            <div
              key={index}
              className='square-item relative'
              style={{
                animationDelay: `${index * 0.1}s`
              }}
            >
              <div className='w-full h-full rounded-md bg-gradient-to-br from-cyan-500 via-blue-500 to-indigo-500 shadow-lg shadow-blue-500/50' />
            </div>
          ))}
        </div>

        {/* Center glow effect */}
        <div className='absolute inset-0 flex items-center justify-center pointer-events-none'>
          <div className='w-16 h-16 bg-blue-500/30 rounded-full blur-xl animate-pulse' />
        </div>
      </div>

      {/* Loading text */}
      <div className='flex flex-col items-center gap-2'>
        <p className='text-sm font-semibold bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 bg-clip-text text-transparent animate-pulse'>
          Loading
        </p>
        <div className='flex gap-1'>
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className='w-1.5 h-1.5 rounded-full bg-blue-500'
              style={{
                animation: 'bounce 2s infinite ease-in-out',
                animationDelay: `${i * 0.2}s`
              }}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes rotateSquare {
          0%, 100% {
            transform: perspective(400px) rotateY(0deg) rotateX(0deg);
          }
          25% {
            transform: perspective(400px) rotateY(180deg) rotateX(0deg);
          }
          50% {
            transform: perspective(400px) rotateY(180deg) rotateX(180deg);
          }
          75% {
            transform: perspective(400px) rotateY(0deg) rotateX(180deg);
          }
        }

        @keyframes bounce {
          0%, 80%, 100% {
            transform: scale(0);
            opacity: 0.5;
          }
          40% {
            transform: scale(1);
            opacity: 1;
          }
        }

        .square-item {
          animation: rotateSquare 3.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite;
          transform-style: preserve-3d;
        }

        .square-item:nth-child(1) { animation-delay: 0s; }
        .square-item:nth-child(2) { animation-delay: 0.1s; }
        .square-item:nth-child(3) { animation-delay: 0.2s; }
        .square-item:nth-child(4) { animation-delay: 0.1s; }
        .square-item:nth-child(5) { animation-delay: 0.2s; }
        .square-item:nth-child(6) { animation-delay: 0.3s; }
        .square-item:nth-child(7) { animation-delay: 0.2s; }
        .square-item:nth-child(8) { animation-delay: 0.3s; }
        .square-item:nth-child(9) { animation-delay: 0.4s; }
      `}</style>
    </div>
  )
}
