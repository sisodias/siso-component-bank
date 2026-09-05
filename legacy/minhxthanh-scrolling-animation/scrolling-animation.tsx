"use client"

import { useEffect, useState } from "react"

export function HomePage() {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const animationProgress = Math.min(scrollY / 500, 1)
  const expandRadius = animationProgress * 300

  return (
    <div className="min-h-[200vh] bg-[#ffffff] dark:bg-black">
      <div className="h-screen flex items-center justify-center p-8 sticky top-0">
        <div className="relative">
          <div
            className={`w-[600px] h-[600px] rounded-full flex items-center justify-center transition-all duration-500 ${
              scrollY > 300 ? "border-2 border-[#e9e9e9] dark:border-gray-700" : ""
            }`}
          >
            <div
              className={`w-[500px] h-[500px] rounded-full flex items-center justify-center relative transition-all duration-500 ${
                scrollY > 100 ? "border-2 border-blue-100 dark:border-blue-800" : ""
              }`}
            >
              <div className="w-[400px] h-[400px] rounded-full bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 dark:from-purple-600 dark:via-pink-600 dark:to-red-600 p-0.5 flex items-center justify-center relative">
                <div className="w-full h-full rounded-full bg-[#ffffff] dark:bg-black flex items-center justify-center relative">
                  <div
                    className="absolute w-24 h-24 rounded-2xl overflow-hidden border-4 border-white dark:border-gray-800 shadow-lg transition-transform duration-300 ease-out z-0"
                    style={{
                      transform: `translate(${expandRadius * Math.cos(0)}px, ${expandRadius * Math.sin(0)}px)`,
                    }}
                  >
                    <img
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0"
                      alt="Profile 1"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div
                    className="absolute w-24 h-24 rounded-2xl overflow-hidden border-4 border-white dark:border-gray-800 shadow-lg transition-transform duration-300 ease-out z-0"
                    style={{
                      transform: `translate(${expandRadius * Math.cos(Math.PI / 4)}px, ${expandRadius * Math.sin(Math.PI / 4)}px)`,
                    }}
                  >
                    <img
                      src="https://images.unsplash.com/photo-1610652492500-ded49ceeb378?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0"
                      alt="Profile 2"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div
                    className="absolute w-24 h-24 rounded-2xl overflow-hidden border-4 border-white dark:border-gray-800 shadow-lg transition-transform duration-300 ease-out z-0"
                    style={{
                      transform: `translate(${expandRadius * Math.cos(Math.PI / 2)}px, ${expandRadius * Math.sin(Math.PI / 2)}px)`,
                    }}
                  >
                    <img
                      src="https://images.unsplash.com/photo-1619365734050-cb5e64a42d43?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0"
                      alt="Profile 3"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div
                    className="absolute w-24 h-24 rounded-2xl overflow-hidden border-4 border-white dark:border-gray-800 shadow-lg transition-transform duration-300 ease-out z-0"
                    style={{
                      transform: `translate(${expandRadius * Math.cos((3 * Math.PI) / 4)}px, ${expandRadius * Math.sin((3 * Math.PI) / 4)}px)`,
                    }}
                  >
                    <img
                      src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0"
                      alt="Profile 4"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div
                    className="absolute w-24 h-24 rounded-2xl overflow-hidden border-4 border-white dark:border-gray-800 shadow-lg transition-transform duration-300 ease-out z-0"
                    style={{
                      transform: `translate(${expandRadius * Math.cos(Math.PI)}px, ${expandRadius * Math.sin(Math.PI)}px)`,
                    }}
                  >
                    <img
                      src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0"
                      alt="Profile 5"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div
                    className="absolute w-24 h-24 rounded-2xl overflow-hidden border-4 border-white dark:border-gray-800 shadow-lg transition-transform duration-300 ease-out z-0"
                    style={{
                      transform: `translate(${expandRadius * Math.cos((5 * Math.PI) / 4)}px, ${expandRadius * Math.sin((5 * Math.PI) / 4)}px)`,
                    }}
                  >
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0"
                      alt="Profile 6"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div
                    className="absolute w-24 h-24 rounded-2xl overflow-hidden border-4 border-white dark:border-gray-800 shadow-lg transition-transform duration-300 ease-out z-0"
                    style={{
                      transform: `translate(${expandRadius * Math.cos((3 * Math.PI) / 2)}px, ${expandRadius * Math.sin((3 * Math.PI) / 2)}px)`,
                    }}
                  >
                    <img
                      src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0"
                      alt="Profile 7"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div
                    className="absolute w-24 h-24 rounded-2xl overflow-hidden border-4 border-white dark:border-gray-800 shadow-lg transition-transform duration-300 ease-out z-0"
                    style={{
                      transform: `translate(${expandRadius * Math.cos((7 * Math.PI) / 4)}px, ${expandRadius * Math.sin((7 * Math.PI) / 4)}px)`,
                    }}
                  >
                    <img
                      src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0"
                      alt="Profile 8"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div
                    className={`flex flex-col items-center justify-center relative z-20 transition-opacity duration-500 ${
                      scrollY > 250 ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    <h1 className="text-4xl font-bold text-gray-800 dark:text-white text-center mb-2">Empowering</h1>
                    <h1 className="text-4xl font-bold text-gray-800 dark:text-white text-center mb-4">Every User</h1>

                    <p className="text-gray-500 dark:text-gray-400 text-center max-w-xs">
                      From entrepreneurs to educators, Gen AI provides tools to simplify work.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
