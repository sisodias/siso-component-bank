import React from 'react'

const HoverText = () => {
  return (
    <div className='min-h-screen bg-linear-to-br w-screen bg-background flex items-center justify-center p-4'>
      <div className='backdrop-blur-sm bg-background/30 p-8 rounded-2xl shadow-sm hover:shadow-2xl shadow-foreground/50 transition-all duration-500 group hover:shadow-foreground/20 '>
        <h1 className='text-6xl font-light text-foreground hover:text-foreground/80
          tracking-normal group-hover:tracking-widest transition-all duration-500
          border-b-2 border-foreground/15 pb-2 select-none'>
          Hello World
        </h1>
      </div>
    </div>
  )
} 

export default HoverText