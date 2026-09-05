'use client'

import React from 'react'

export default function BlocksLoader() {
  // A 4x4 grid = 16 blocks
  const gridSize = 4;
  const totalBlocks = gridSize * gridSize;

  // Helper to calculate delay based on grid position (diagonal wave)
  const getDelay = (index: number) => {
    const row = Math.floor(index / gridSize);
    const col = index % gridSize;
    // The sum of row + col creates diagonal bands
    // Multiply by a small factor (e.g., 0.1s) for the actual delay time
    return (row + col) * 0.1;
  };

  return (
    <div className='flex flex-col items-center justify-center gap-10 p-12 min-h-[350px] bg-transparent perspective-container'>
      
      {/* Main 3D Grid Container tilted slightly backward */}
      {/* We add a CSS variable scope here for the animation shadows */}
      <div className='relative transform-style-3d tilt-grid theme-scope'>
        
        {/* Background Glow for the grid area */}
        {/* Light: Subtle blue haze | Dark: Deep indigo glow */}
        <div className='absolute inset-0 rounded-full -z-10 blur-[60px] 
                        bg-blue-300/30 dark:bg-indigo-500/20' />

        {/* The Grid of Blocks */}
        <div className='grid grid-cols-4 gap-3 p-4'>
          {[...Array(totalBlocks)].map((_, index) => {
             const delay = getDelay(index);
             return (
              <div
                key={index}
                className='block-item relative w-10 h-10 rounded-lg'
                style={{
                  // Negative delay makes it start already in motion
                  animationDelay: `-${delay}s` 
                }}
              >
                {/* Block Body with Gradient and Shadow */}
                {/* Light: Bright Blue/Indigo | Dark: Deep Blue/Black */}
                <div className='w-full h-full rounded-lg transition-colors duration-300 block-glow
                                bg-gradient-to-r from-blue-500 to-indigo-600 
                                dark:from-blue-900 dark:to-indigo-950
                                shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),_0_4px_10px_rgba(59,130,246,0.3)]
                                dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),_0_4px_10px_rgba(0,0,0,0.5)]' 
                />
                
                {/* Subtle highlight on top edge */}
                <div className='absolute top-0 inset-x-1 h-[2px] rounded-full blur-[1px]
                                bg-white/60 dark:bg-cyan-200/50' />
              </div>
            );
          })}
        </div>
      </div>

      {/* Loading Text */}
      <div className='flex flex-col items-center gap-2 z-10'>
        <h3 className='text-sm font-bold tracking-[0.25em] uppercase animate-pulse
                       text-transparent bg-clip-text 
                       bg-neutral-800 dark:bg-neutral-200'>
          Processing Data
        </h3>
        <div className='flex gap-1'>
             <span className='w-1.5 h-1.5 rounded-full animate-bounce delay-0 bg-blue-600 dark:bg-blue-400'></span>
             <span className='w-1.5 h-1.5 rounded-full animate-bounce delay-100 bg-blue-600 dark:bg-blue-400'></span>
             <span className='w-1.5 h-1.5 rounded-full animate-bounce delay-200 bg-blue-600 dark:bg-blue-400'></span>
        </div>
      </div>

      <style jsx>{`
        .perspective-container {
          perspective: 1000px;
        }

        .transform-style-3d {
          transform-style: preserve-3d;
        }

        .tilt-grid {
            transform: rotateX(30deg) rotateY(0deg);
        }

        /* Define CSS variables for the shadow colors so the keyframes 
           can adapt to light/dark mode automatically. 
        */
        .theme-scope {
            /* Light Mode Shadow: Soft blue drop shadow */
            --wave-shadow: 0 15px 25px rgba(59, 130, 246, 0.4);
            --wave-brightness: 1.1;
        }

        /* Using :global(.dark) allows this to work with Tailwind's 'class' mode */
        :global(.dark) .theme-scope {
            /* Dark Mode Shadow: Bright cyan glow */
            --wave-shadow: 0 15px 25px rgba(34, 211, 238, 0.6);
            --wave-brightness: 1.3;
        }

        @keyframes blockWave {
          0%, 100% {
            transform: translateZ(0px) translateY(0px);
            filter: brightness(1);
          }
          50% {
            transform: translateZ(30px) translateY(-15px);
            /* Use the variables defined above */
            filter: brightness(var(--wave-brightness)) contrast(1.1);
            box-shadow: var(--wave-shadow);
          }
        }

        .block-item {
          animation: blockWave 2s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite;
          will-change: transform, box-shadow, filter;
        }

        .block-glow {
            transition: box-shadow 0.3s ease;
        }
      `}</style>
    </div>
  )
}