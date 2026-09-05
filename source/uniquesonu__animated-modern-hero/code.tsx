"use client"

import { useEffect, useState } from "react"

export default function AnimatedModernHero() {
  const [mounted, setMounted] = useState(false)
  const [activeMetric, setActiveMetric] = useState(0)

  useEffect(() => {
    setMounted(true)
    const interval = setInterval(() => {
      setActiveMetric((prev) => (prev + 1) % 2)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  if (!mounted) return null

  return (
    <section className="relative min-h-screen w-full bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        {/* Large animated geometric shapes */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full transform translate-x-48 -translate-y-48 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-purple-500/20 to-pink-500/20 rounded-full transform -translate-x-40 translate-y-40 animate-pulse delay-1000"></div>

        {/* Animated grid pattern */}
        <div className="absolute inset-0 opacity-[0.05] animate-pulse">
          <div
            className="h-full w-full"
            style={{
              backgroundImage: `
                linear-gradient(rgba(59, 130, 246, 0.3) 1px, transparent 1px),
                linear-gradient(90deg, rgba(59, 130, 246, 0.3) 1px, transparent 1px)
              `,
              backgroundSize: "40px 40px",
              animation: "gridMove 20s linear infinite",
            }}
          ></div>
        </div>

        {/* Enhanced floating elements */}
        <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-blue-400/50 rounded-full animate-bounce delay-1000 shadow-lg shadow-blue-400/25"></div>
        <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-purple-400/50 rounded-full animate-bounce delay-500 shadow-lg shadow-purple-400/25"></div>
        <div className="absolute bottom-1/3 left-1/3 w-2 h-2 bg-indigo-400/50 rounded-full animate-bounce delay-700 shadow-lg shadow-indigo-400/25"></div>
        <div className="absolute top-1/2 left-1/6 w-1 h-1 bg-cyan-400/60 rounded-full animate-ping delay-300"></div>
        <div className="absolute bottom-1/4 right-1/6 w-1 h-1 bg-pink-400/60 rounded-full animate-ping delay-1500"></div>

        {/* Animated light rays */}
        <div className="absolute top-0 left-1/2 w-px h-32 bg-gradient-to-b from-blue-400/50 to-transparent transform -translate-x-1/2 animate-pulse delay-500"></div>
        <div className="absolute bottom-0 right-1/3 w-px h-24 bg-gradient-to-t from-purple-400/50 to-transparent animate-pulse delay-1000"></div>
      </div>

      {/* Main content with entrance animation */}
      <div className="relative z-10 container mx-auto px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-screen">
          {/* Left column - Content with staggered animations */}
          <div className="space-y-8 animate-fadeInLeft">
            {/* Status badge with enhanced animation */}
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-sm hover:bg-emerald-500/20 transition-all duration-500 animate-slideInDown">
              <div className="w-2 h-2 bg-emerald-400 rounded-full mr-2 animate-pulse shadow-lg shadow-emerald-400/50"></div>
              <span className="text-emerald-300 text-sm font-medium">Now Available Worldwide</span>
            </div>

            {/* Main headline with typewriter effect */}
            <div className="space-y-4 animate-slideInUp delay-200">
              <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight">
                <span className="inline-block animate-fadeIn">Build Better</span>
                <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent animate-gradient-x bg-300% animate-fadeIn delay-300">
                  SaaS Products
                </span>
                <span className="block animate-fadeIn delay-500">Faster</span>
              </h1>
            </div>

            {/* Subheadline with fade in */}
            <p className="text-xl lg:text-2xl text-gray-300 leading-relaxed max-w-lg animate-fadeIn delay-700">
              The all-in-one platform that helps you ship, scale, and succeed with your SaaS business in record time.
            </p>

            {/* Enhanced CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4 animate-slideInUp delay-900">
              <button className="group relative px-8 py-4 bg-white text-gray-900 rounded-xl font-semibold transition-all duration-500 hover:bg-gray-100 hover:scale-105 hover:shadow-2xl hover:shadow-white/20 transform-gpu">
                <span className="relative z-10 transition-all duration-300 group-hover:scale-105">
                  Get Started Free
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
              </button>

              <button className="group flex items-center justify-center px-8 py-4 border-2 border-gray-600 text-gray-300 rounded-xl font-semibold hover:border-blue-400 hover:bg-blue-400/10 hover:text-blue-300 transition-all duration-500 backdrop-blur-sm transform-gpu hover:scale-105">
                <svg
                  className="w-5 h-5 mr-2 transition-transform duration-300 group-hover:scale-110"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="transition-all duration-300 group-hover:translate-x-1">Watch Demo</span>
              </button>
            </div>

            {/* Animated stats */}
            <div className="flex flex-wrap gap-8 pt-8 border-t border-gray-700 animate-fadeIn delay-1100">
              <div className="group cursor-pointer">
                <div className="text-3xl font-bold text-white transition-all duration-300 group-hover:text-blue-400 group-hover:scale-110">
                  10k+
                </div>
                <div className="text-sm text-gray-400 transition-colors duration-300 group-hover:text-blue-300">
                  Active Users
                </div>
              </div>
              <div className="group cursor-pointer">
                <div className="text-3xl font-bold text-white transition-all duration-300 group-hover:text-emerald-400 group-hover:scale-110">
                  99.9%
                </div>
                <div className="text-sm text-gray-400 transition-colors duration-300 group-hover:text-emerald-300">
                  Uptime
                </div>
              </div>
              <div className="group cursor-pointer">
                <div className="text-3xl font-bold text-white transition-all duration-300 group-hover:text-purple-400 group-hover:scale-110">
                  24/7
                </div>
                <div className="text-sm text-gray-400 transition-colors duration-300 group-hover:text-purple-300">
                  Support
                </div>
              </div>
            </div>
          </div>

          {/* Right column - Enhanced Visual with animations */}
          <div className="relative animate-fadeInRight">
            {/* Main visual container with enhanced styling */}
            <div className="relative bg-gradient-to-br from-gray-800/80 to-gray-900/80 rounded-3xl p-8 shadow-2xl border border-gray-700/50 backdrop-blur-xl hover:shadow-blue-500/10 transition-all duration-700 hover:scale-[1.02] transform-gpu">
              {/* Enhanced mock dashboard */}
              <div className="bg-gray-900/90 rounded-2xl shadow-2xl overflow-hidden border border-gray-700/50 backdrop-blur-sm">
                {/* Header with animation */}
                <div className="bg-gray-800/90 px-6 py-4 border-b border-gray-700/50 backdrop-blur-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-lg shadow-red-500/50"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse delay-200 shadow-lg shadow-yellow-500/50"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse delay-400 shadow-lg shadow-green-500/50"></div>
                    </div>
                    <div className="text-sm text-gray-400 animate-fadeIn delay-1000">Dashboard</div>
                  </div>
                </div>

                {/* Content with enhanced animations */}
                <div className="p-6 space-y-6">
                  {/* Animated metrics cards */}
                  <div className="grid grid-cols-2 gap-4">
                    <div
                      className={`bg-blue-500/10 border border-blue-500/20 p-4 rounded-lg backdrop-blur-sm transition-all duration-500 hover:bg-blue-500/20 hover:scale-105 transform-gpu ${activeMetric === 0 ? "ring-2 ring-blue-400/50 shadow-lg shadow-blue-400/25" : ""}`}
                    >
                      <div className="text-2xl font-bold text-blue-400 animate-countUp">$24.5k</div>
                      <div className="text-sm text-blue-300/70">Revenue</div>
                    </div>
                    <div
                      className={`bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-lg backdrop-blur-sm transition-all duration-500 hover:bg-emerald-500/20 hover:scale-105 transform-gpu ${activeMetric === 1 ? "ring-2 ring-emerald-400/50 shadow-lg shadow-emerald-400/25" : ""}`}
                    >
                      <div className="text-2xl font-bold text-emerald-400 animate-countUp">+12%</div>
                      <div className="text-sm text-emerald-300/70">Growth</div>
                    </div>
                  </div>

                  {/* Animated chart */}
                  <div className="bg-gray-800/50 rounded-lg p-4 h-32 flex items-end justify-between border border-gray-700/50 backdrop-blur-sm">
                    <div
                      className="w-4 bg-blue-500/60 rounded-t transition-all duration-1000 hover:bg-blue-400 animate-growUp"
                      style={{ height: "60%", animationDelay: "0ms" }}
                    ></div>
                    <div
                      className="w-4 bg-blue-500/70 rounded-t transition-all duration-1000 hover:bg-blue-400 animate-growUp"
                      style={{ height: "80%", animationDelay: "200ms" }}
                    ></div>
                    <div
                      className="w-4 bg-blue-500/50 rounded-t transition-all duration-1000 hover:bg-blue-400 animate-growUp"
                      style={{ height: "40%", animationDelay: "400ms" }}
                    ></div>
                    <div
                      className="w-4 bg-blue-500/90 rounded-t transition-all duration-1000 hover:bg-blue-400 animate-growUp"
                      style={{ height: "90%", animationDelay: "600ms" }}
                    ></div>
                    <div
                      className="w-4 bg-blue-500/80 rounded-t transition-all duration-1000 hover:bg-blue-400 animate-growUp"
                      style={{ height: "70%", animationDelay: "800ms" }}
                    ></div>
                    <div
                      className="w-4 bg-blue-500 rounded-t transition-all duration-1000 hover:bg-blue-400 animate-growUp"
                      style={{ height: "100%", animationDelay: "1000ms" }}
                    ></div>
                  </div>

                  {/* Animated list items */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg border border-gray-700/50 backdrop-blur-sm hover:bg-gray-700/50 transition-all duration-300 animate-slideInLeft delay-1200">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-purple-500/20 border border-purple-500/30 rounded-full flex items-center justify-center animate-pulse">
                          <div className="w-4 h-4 bg-purple-400 rounded-full shadow-lg shadow-purple-400/50"></div>
                        </div>
                        <span className="text-sm font-medium text-gray-300">New user signup</span>
                      </div>
                      <span className="text-xs text-gray-500 animate-fadeIn delay-1400">2m ago</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg border border-gray-700/50 backdrop-blur-sm hover:bg-gray-700/50 transition-all duration-300 animate-slideInLeft delay-1400">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-emerald-500/20 border border-emerald-500/30 rounded-full flex items-center justify-center animate-pulse delay-500">
                          <div className="w-4 h-4 bg-emerald-400 rounded-full shadow-lg shadow-emerald-400/50"></div>
                        </div>
                        <span className="text-sm font-medium text-gray-300">Payment received</span>
                      </div>
                      <span className="text-xs text-gray-500 animate-fadeIn delay-1600">5m ago</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced floating elements with better animations */}
            <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl shadow-2xl flex items-center justify-center transform rotate-12 animate-float hover:scale-110 transition-transform duration-300 cursor-pointer">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>

            <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-xl shadow-2xl flex items-center justify-center transform -rotate-12 animate-float delay-1000 hover:scale-110 transition-transform duration-300 cursor-pointer">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            {/* Enhanced glow effects */}
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-3xl blur-2xl -z-10 animate-pulse"></div>
            <div className="absolute -inset-8 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-3xl blur-3xl -z-20 animate-pulse delay-1000"></div>
          </div>
        </div>
      </div>

      {/* Custom CSS animations */}
      <style jsx>{`
        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeInRight {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(12deg);
          }
          50% {
            transform: translateY(-10px) rotate(12deg);
          }
        }

        @keyframes growUp {
          from {
            height: 0;
          }
          to {
            height: var(--final-height);
          }
        }

        @keyframes gradient-x {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes gridMove {
          0% {
            transform: translate(0, 0);
          }
          100% {
            transform: translate(40px, 40px);
          }
        }

        .animate-fadeInLeft {
          animation: fadeInLeft 0.8s ease-out forwards;
        }

        .animate-fadeInRight {
          animation: fadeInRight 0.8s ease-out forwards;
        }

        .animate-slideInDown {
          animation: slideInDown 0.6s ease-out forwards;
        }

        .animate-slideInUp {
          animation: slideInUp 0.6s ease-out forwards;
        }

        .animate-slideInLeft {
          animation: slideInLeft 0.6s ease-out forwards;
        }

        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out forwards;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-growUp {
          animation: growUp 1.5s ease-out forwards;
        }

        .animate-gradient-x {
          animation: gradient-x 3s ease infinite;
        }

        .bg-300% {
          background-size: 300% 300%;
        }

        .delay-200 {
          animation-delay: 200ms;
        }

        .delay-300 {
          animation-delay: 300ms;
        }

        .delay-500 {
          animation-delay: 500ms;
        }

        .delay-700 {
          animation-delay: 700ms;
        }

        .delay-900 {
          animation-delay: 900ms;
        }

        .delay-1100 {
          animation-delay: 1100ms;
        }

        .delay-1200 {
          animation-delay: 1200ms;
        }

        .delay-1400 {
          animation-delay: 1400ms;
        }

        .delay-1600 {
          animation-delay: 1600ms;
        }
      `}</style>
    </section>
  )
}
