"use client"

import { useEffect, useState } from "react"

export default function CurvedBackground() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="relative w-full h-screen overflow-hidden bg-white from-purple-100 via-purple-200 to-gray-100 dark:bg-black">
      {/* Curved text ticker - outer ring */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-[400px] h-[400px]">
          <div className="absolute inset-0 animate-spin-slow">
            <svg className="w-full h-full" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <path id="circle-path" d="M 200,200 m -150,0 a 150,150 0 1,1 300,0 a 150,150 0 1,1 -300,0" />
              </defs>
              <text className="fill-black dark:fill-white/60 text-sm font-medium tracking-wider">
                <textPath href="#circle-path" startOffset="0%">
                  ★ New Component ★ Curved Text Ticker ★ New Component ★ Curved Text Ticker
                </textPath>
              </text>
            </svg>
          </div>
        </div>
      </div>

      {/* Inner curved text ticker - counter rotation */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-[280px] h-[280px]">
          <div className="absolute inset-0 animate-spin-reverse">
            <svg className="w-full h-full" viewBox="0 0 280 280" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <path id="inner-circle-path" d="M 140,140 m -100,0 a 100,100 0 1,1 200,0 a 100,100 0 1,1 -200,0" />
              </defs>
              <text className="fill-black dark:fill-white text-xs font-light tracking-wide">
                <textPath href="#inner-circle-path" startOffset="0%">
                  Curved Text Ticker ★ New Component ★ Curved Text Ticker ★ New Component ★
                </textPath>
              </text>
            </svg>
          </div>
        </div>
      </div>

      {/* Central content area - you can place your content here */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div className="text-center space-y-4">
          {/* This is where your main content would go */}
          <div className="w-32 h-32 bg-gray-800/5 dark:bg-white/5 rounded-full border border-gray-800/10 dark:border-white/10 flex items-center justify-center">
            <div className="text-gray-700/60 dark:text-white/60 text-sm">Content Area</div>
          </div>
        </div>
      </div>
    </div>
  )
}
