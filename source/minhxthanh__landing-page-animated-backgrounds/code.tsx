"use client"

import { useState, useEffect } from "react"
import { Menu, X } from "lucide-react"

export function MindfulLanding() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    // Load VANTA.js scripts
    const loadVanta = async () => {
      if (typeof window !== "undefined") {
        // Load Three.js
        const threeScript = document.createElement("script")
        threeScript.src = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js"
        document.head.appendChild(threeScript)

        threeScript.onload = () => {
          // Load VANTA.js
          const vantaScript = document.createElement("script")
          vantaScript.src = "https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.fog.min.js"
          document.head.appendChild(vantaScript)

          vantaScript.onload = () => {
            // Initialize VANTA effect
            if (window.VANTA) {
              window.VANTA.FOG({
                el: "#bg-animation",
                mouseControls: true,
                touchControls: true,
                gyroControls: false,
                minHeight: 200.0,
                minWidth: 200.0,
                highlightColor: 0xd4a7f0,
                midtoneColor: 0x63c5b7,
                lowlightColor: 0x568bfa,
                blurFactor: 0.73,
                speed: 2.1,
                zoom: 0.5,
              })
            }
          }
        }
      }
    }

    loadVanta()
  }, [])

  return (
    <div className="bg-[#F8F8F7] font-sans min-h-screen">
      <div id="bg-animation" className="relative overflow-hidden min-h-screen">
        {/* Wave backgrounds */}
        <div className="absolute inset-x-0 bottom-0 h-64 -z-10 opacity-70">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <path
              fill="#A78BFA"
              fillOpacity="0.1"
              d="M0,128L48,144C96,160,192,192,288,186.7C384,181,480,139,576,138.7C672,139,768,181,864,181.3C960,181,1056,139,1152,133.3C1248,128,1344,160,1392,176L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            />
          </svg>
        </div>
        <div className="absolute inset-x-0 top-0 h-64 -z-10 opacity-70">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <path
              fill="#A78BFA"
              fillOpacity="0.05"
              d="M0,224L60,229.3C120,235,240,245,360,229.3C480,213,600,171,720,170.7C840,171,960,213,1080,218.7C1200,224,1320,192,1380,176L1440,160L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"
            />
          </svg>
        </div>

        {/* Navbar */}
        <nav className="container mx-auto px-6 py-6 relative z-10">
          <div className="flex items-center justify-between animate-fade-in">
            <div className="text-2xl font-semibold text-gray-800">
              mindful<span className="text-[#A78BFA]">.</span>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-600 focus:outline-none"
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>

            {/* Desktop menu */}
            <div className="hidden md:flex space-x-8">
              <a href="#" className="text-gray-600 hover:text-[#A78BFA] transition-colors">
                Features
              </a>
              <a href="#" className="text-gray-600 hover:text-[#A78BFA] transition-colors">
                Pricing
              </a>
              <a href="#" className="text-gray-600 hover:text-[#A78BFA] transition-colors">
                Resources
              </a>
              <a href="#" className="text-gray-600 hover:text-[#A78BFA] transition-colors">
                About
              </a>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <a href="#" className="text-gray-600 hover:text-[#A78BFA] transition-colors">
                Login
              </a>
              <a
                href="#"
                className="px-4 py-2 text-sm text-[#A78BFA] border border-[#A78BFA] rounded-full hover:bg-[#A78BFA] hover:text-white transition-colors"
              >
                Sign Up
              </a>
            </div>
          </div>

          {/* Mobile menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden pt-4 pb-2 animate-fade-in">
              <div className="flex flex-col space-y-3 px-2 bg-white/80 backdrop-blur-sm rounded-lg p-4">
                <a href="#" className="text-gray-600 hover:text-[#A78BFA] transition-colors py-2">
                  Features
                </a>
                <a href="#" className="text-gray-600 hover:text-[#A78BFA] transition-colors py-2">
                  Pricing
                </a>
                <a href="#" className="text-gray-600 hover:text-[#A78BFA] transition-colors py-2">
                  Resources
                </a>
                <a href="#" className="text-gray-600 hover:text-[#A78BFA] transition-colors py-2">
                  About
                </a>
                <a href="#" className="text-gray-600 hover:text-[#A78BFA] transition-colors py-2">
                  Login
                </a>
                <a
                  href="#"
                  className="text-center px-4 py-2 text-sm text-[#A78BFA] border border-[#A78BFA] rounded-full hover:bg-[#A78BFA] hover:text-white transition-colors"
                >
                  Sign Up
                </a>
              </div>
            </div>
          )}
        </nav>

        {/* Hero Section */}
        <section className="container mx-auto px-6 py-12 md:py-24 flex items-center justify-center min-h-[70vh] relative z-10">
          <div className="max-w-3xl text-center relative z-10">
            {/* Decorative elements */}
            <div className="absolute top-1/4 -left-20 w-40 h-40 bg-[#A78BFA]/10 rounded-full blur-xl -z-10"></div>
            <div className="absolute bottom-1/3 right-0 w-32 h-32 bg-[#A78BFA]/15 rounded-full blur-lg -z-10"></div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 leading-tight mb-6 animate-fade-in-up animation-delay-300">
              Find <span className="text-[#A78BFA] animate-blur-reveal">Calm</span> in the Chaos
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-10 leading-relaxed max-w-2xl mx-auto animate-fade-in-up animation-delay-600">
              Take back control of your mental well-being with guided meditations, daily check-ins, and science-backed
              tools for a calmer mind.
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-12 animate-fade-in-up animation-delay-900">
              <a
                href="#"
                className="inline-block px-8 py-4 text-white font-medium bg-[#A78BFA] rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 backdrop-blur-sm bg-opacity-90"
              >
                Start Your Journey
              </a>
              <a
                href="#"
                className="inline-block px-8 py-4 text-gray-700 font-medium border border-[#E5E7EB] rounded-full hover:border-[#A78BFA] hover:text-[#A78BFA] transition-colors"
              >
                Learn More
              </a>
            </div>
            <div className="flex items-center justify-center space-x-6 animate-fade-in-up animation-delay-1200">
              <div className="flex -space-x-2">
                <img
                  className="w-10 h-10 rounded-full border-2 border-white"
                  src="https://images.unsplash.com/photo-1754951661102-341dfb58bd26?w=40&h=40&fit=crop&crop=face"
                  alt="User"
                />
                <img
                  className="w-10 h-10 rounded-full border-2 border-white"
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face"
                  alt="User"
                />
                <img
                  className="w-10 h-10 rounded-full border-2 border-white"
                  src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face"
                  alt="User"
                />
              </div>
              <p className="text-sm text-gray-600">
                Join <span className="font-medium text-[#A78BFA]">10,000+</span> people finding peace
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
