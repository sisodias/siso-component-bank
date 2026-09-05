import React, { useState, useEffect } from 'react';
import { Lightbulb } from 'lucide-react';

export function HeroSection() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 w-full to-gray-900 relative overflow-hidden">
      {/* Animated Background */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(34, 197, 94, 0.3) 0%, transparent 50%)`
        }}
      />
      
      {/* Floating Particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-lime-300 rounded-full opacity-60 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      {/* Logo */}
      <div className="absolute top-8 left-8 md:left-16 z-20">
        <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-lime-300 via-green-300 to-emerald-300 bg-clip-text text-transparent">
          Mysh ai
        </div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex justify-center items-center pt-8 hidden sm:flex">
        <div className="backdrop-blur-md bg-gray-800/30 border border-gray-700/50 rounded-full px-8 py-3 shadow-xl">
          <div className="flex space-x-6">
            {['services', 'portfolio', 'about', 'blog', 'contact'].map((item) => (
              <button
                key={item}
                className="text-gray-300 hover:text-lime-300 transition-all duration-300 text-sm font-medium tracking-wide hover:scale-105 px-3 py-1 rounded-full hover:bg-white/10"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-8 text-center">
        <div className="mb-16">
          <h1 className="text-6xl md:text-7xl lg:text-8xl text-white mb-6 tracking-tight leading-none">
            <span className="block">Ready to create</span>
            <span className="block bg-gradient-to-r from-lime-300 via-green-300 to-emerald-300 bg-clip-text text-transparent">
              something amazing?
            </span>
          </h1>
        </div>

        {/* Search Bar */}
        <div className="relative mb-20 group">
          <div className="absolute -inset-1 bg-gradient-to-r from-lime-400 to-emerald-400 rounded-full blur opacity-30 group-hover:opacity-50 transition duration-300" />
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder="describe your vision..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="w-96 md:w-[500px] px-8 py-5 bg-gray-800/80 backdrop-blur-sm text-white placeholder-gray-400 rounded-full border border-gray-700/50 focus:outline-none focus:border-lime-400/50 focus:bg-gray-800/90 transition-all duration-300 text-lg"
            />
            <button className="absolute right-2 p-3 bg-gradient-to-r from-lime-300 to-emerald-400 rounded-full hover:from-lime-200 hover:to-emerald-300 transition-all duration-300 hover:scale-110 group">
              <Lightbulb className="w-6 h-6 text-gray-900" />
            </button>
          </div>
        </div>

        {/* 3D Planet */}
        <div className="relative">
          {/* Main Planet */}
          <div className="w-96 h-96 md:w-[500px] md:h-[500px] relative">
            {/* Complete Bottom Fade Mask - More Aggressive */}
            <div 
              className="absolute inset-0 z-20 rounded-full pointer-events-none"
              style={{ 
                background: 'linear-gradient(to top, rgb(17, 24, 39) 0%, rgba(17, 24, 39, 0.9) 20%, rgba(17, 24, 39, 0.7) 35%, rgba(17, 24, 39, 0.4) 50%, rgba(17, 24, 39, 0.2) 65%, transparent 80%)' 
              }} 
            />
            
            {/* Planet Body */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gray-800 via-gray-900 to-black border border-gray-700/30 shadow-2xl">
              {/* Surface Details */}
              <div className="absolute inset-4 rounded-full bg-gradient-to-br from-gray-700/20 via-transparent to-gray-900/40" />
              <div className="absolute inset-8 rounded-full bg-gradient-to-tl from-gray-600/10 via-transparent to-transparent" />
              
              {/* Terrain Features */}
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="absolute bg-gray-700/20 rounded-full blur-sm"
                  style={{
                    width: `${20 + Math.random() * 40}px`,
                    height: `${10 + Math.random() * 20}px`,
                    left: `${10 + Math.random() * 70}%`,
                    top: `${10 + Math.random() * 70}%`,
                    transform: `rotate(${Math.random() * 360}deg)`
                  }}
                />
              ))}
            </div>

            {/* Light Neon Green Glow */}
            <div className="absolute -inset-8 rounded-full bg-gradient-to-r from-lime-300/20 via-green-300/30 to-emerald-300/20 blur-xl animate-pulse" />
            <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-lime-300/30 via-green-300/40 to-emerald-300/30 blur-lg" />
            
            {/* Crown/Spikes */}
            <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
              <div className="flex items-end justify-center space-x-1">
                {[...Array(7)].map((_, i) => (
                  <div
                    key={i}
                    className={`bg-gradient-to-t from-lime-300 to-emerald-200 transform origin-bottom transition-all duration-1000 delay-${i * 100}`}
                    style={{
                      width: '3px',
                      height: i === 3 ? '48px' : i === 2 || i === 4 ? '36px' : i === 1 || i === 5 ? '24px' : '12px',
                      filter: 'drop-shadow(0 0 6px rgba(132, 204, 22, 0.8))',
                      animation: `spike-glow 2s infinite ease-in-out ${i * 0.1}s`
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Energy Rings */}
            <div className="absolute inset-0 rounded-full border-2 border-lime-300/40 animate-spin" style={{ animationDuration: '20s' }} />
            <div className="absolute inset-4 rounded-full border border-green-300/30 animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }} />
            <div className="absolute inset-8 rounded-full border border-lime-200/20 animate-spin" style={{ animationDuration: '25s' }} />
          </div>

          {/* Orbiting Elements */}
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="absolute w-3 h-3 bg-lime-300 rounded-full shadow-lg"
              style={{
                animation: `orbit 8s linear infinite`,
                animationDelay: `${i * 2.67}s`,
                filter: 'drop-shadow(0 0 4px rgba(132, 204, 22, 0.8))'
              }}
            />
          ))}
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes spike-glow {
          0%, 100% { 
            filter: drop-shadow(0 0 6px rgba(132, 204, 22, 0.8));
            transform: scaleY(1);
          }
          50% { 
            filter: drop-shadow(0 0 12px rgba(132, 204, 22, 1));
            transform: scaleY(1.1);
          }
        }

        @keyframes orbit {
          from {
            transform: rotate(0deg) translateX(280px) rotate(0deg);
          }
          to {
            transform: rotate(360deg) translateX(280px) rotate(-360deg);
          }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </div>
  );
}