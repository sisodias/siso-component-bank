"use client"

import { Dithering } from "@paper-design/shaders-react"
import { useState } from "react"

export default function ResumePage() {
  const [isDarkMode, setIsDarkMode] = useState(true)

  return (
    <div className="relative min-h-screen overflow-hidden flex">
      <div
        className={`w-1/2 p-8 font-mono relative z-10 ${isDarkMode ? "bg-black text-white" : "bg-white text-black"}`}
      >
        {/* Theme toggle button in top right of left panel */}
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className={`absolute top-8 right-8 p-2 rounded-full transition-colors ${
            isDarkMode ? "hover:bg-white/10" : "hover:bg-black/10"
          }`}
          aria-label="Toggle theme"
        >
          {isDarkMode ? (
            // Sun icon for light mode
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="5" />
              <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
            </svg>
          ) : (
            // Moon icon for dark mode
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          )}
        </button>

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-lg font-normal mb-8">Jessi.cv</h1>
          <div className="mb-8">
            <h2 className="text-lg font-normal">JESSI REDACTED</h2>
            <h3 className="text-lg font-normal">DESIGNER</h3>
          </div>
        </div>

        {/* Experience Section */}
        <div className="mb-12 space-y-1">
          <div className="flex">
            <span className="w-20">Company</span>
            <span className="mx-2">Intern</span>
            <span className="mx-4">2022 → ....</span>
          </div>
          <div className="flex">
            <span className="w-20">Company</span>
            <span className="mx-2">Intern</span>
            <span className="mx-4">2019 → 2021</span>
          </div>
          <div className="flex">
            <span className="w-20">Company</span>
            <span className="mx-2">Intern</span>
            <span className="mx-4">2016 → 2019</span>
          </div>
          <div className="flex">
            <span className="w-20">MISC</span>
            <span className="mx-4">2012 → 2016</span>
          </div>
        </div>

        {/* Footer Links Section */}
        <div className="absolute bottom-8 left-8">
          <div className="flex space-x-4 text-lg font-mono">
            <span>Links</span>
            <span>Twitter</span>
            <span>Email</span>
            <span>Blog</span>
          </div>
        </div>
      </div>

      <div className="w-1/2 relative">
        <Dithering
          style={{ height: "100%", width: "100%" }}
          colorBack={isDarkMode ? "hsl(0, 0%, 0%)" : "hsl(0, 0%, 95%)"}
          colorFront={isDarkMode ? "hsl(320, 100%, 70%)" : "hsl(220, 100%, 70%)"}
          shape="cat"
          type="4x4"
          pxSize={3}
          offsetX={0}
          offsetY={0}
          scale={0.8}
          rotation={0}
          speed={0.1}
        />
      </div>
    </div>
  )
}
