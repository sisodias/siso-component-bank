import React from 'react';
import { Play, Users, Gamepad2 } from 'lucide-react';

const AnimatedSwords = () => {
  return (
    <div>
      <div className="flex justify-center rotate-90">
        {/* Katana */}
        <div className="relative w-32">
          <svg viewBox="0 0 200 300" className="w-full h-full">
            {/* Sheath */}
            <rect x="85" y="100" width="30" height="150" rx="5" className="fill-gray-800 stroke-gray-600 stroke-2" />
            
            {/* Blade with animation */}
            <path
              d="M95 50 L105 50 L105 230 L95 230 Z"
              className="fill-gray-200 stroke-white stroke-1"
              style={{
                animation: 'drawSword 4s infinite'
              }}
            />
            
            {/* Handle */}
            <rect x="90" y="230" width="20" height="60" rx="3" className="fill-amber-900 stroke-amber-700 stroke-1" />
          </svg>
        </div>

      </div>

      <style jsx>{`
        @keyframes drawSword {
          0%, 100% {
            transform: translateY(80px);
            opacity: 0;
          }
          20% {
            opacity: 1;
          }
          40%, 60% {
            transform: translateY(0);
            opacity: 1;
          }
          80% {
            opacity: 1;
          }
        }
        
        /* Apply the animation to SVG paths */
        path, rect {
          transform-box: fill-box;
          transform-origin: center;
        }
      `}</style>
    </div>
  );
};

const HeroSection = () => {
  return (
    <div className="min-h-screen w-full relative overflow-hidden font-['Orbitron',_'Exo_2',_'Rajdhani',_sans-serif]">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://ik.imagekit.io/myshlabs/a-breathtaking-ultra-detailed-8k-cyberpu_gGcyVtmASo-iWzHobLU0BQ_iID9UkpgT5awf4pyeXsUbQ%20(1).jpeg?updatedAt=1757153291228')`
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/60"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20"></div>
      </div>

      {/* Glassmorphic Navigation */}
      <nav className="fixed top-5 left-1/2 transform -translate-x-1/2 z-50">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-full px-8 py-3 shadow-2xl">
          <div className="flex items-center space-x-10">
            {/* Modern Logo */}
            <div className="flex items-center space-x-3 cursor-pointer ">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 rounded-lg rotate-12 shadow-lg"></div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-pink-400 to-orange-500 rounded-full shadow-lg"></div>
                <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-gradient-to-br from-yellow-400 to-red-500 rounded-sm rotate-45 shadow-lg"></div>
              </div>
              <span className="text-2xl font-black text-white tracking-wider">NEONQUEST</span>
            </div>
            
            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-6">
              <a href="#" className="text-white/90 hover:text-cyan-400 transition-all duration-300 font-semibold tracking-wide hover:scale-105">Home</a>
              <a href="#" className="text-white/90 hover:text-cyan-400 transition-all duration-300 font-semibold tracking-wide hover:scale-105">Games</a>
              <a href="#" className="text-white/90 hover:text-cyan-400 transition-all duration-300 font-semibold tracking-wide hover:scale-105">Community</a>
              <a href="#" className="text-white/90 hover:text-cyan-400 transition-all duration-300 font-semibold tracking-wide hover:scale-105">Discord</a>
            </div>

            {/* Play Now Button */}
            <button className="bg-gradient-to-r whitespace-nowrap from-blue-600 via-orange-400 to-pink-600 px-5 py-2 rounded-full text-white font-bold tracking-wide hover:shadow-2xl hover:shadow-pink-500/25 transition-all duration-300 transform hover:scale-105">
              PLAY NOW
            </button>
          </div>
        </div>
      </nav>

      {/* Centered Hero Content */}
      <div className="relative z-10 flex items-center mt-4 justify-center min-h-screen px-6">
        <div className="text-center max-w-4xl">
          {/* Swords Badge */}
          <div className="inline-flex items-center justify-center mb-2">
            <AnimatedSwords/>
          </div>

          {/* Main Heading */}
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-white leading-none mb-8 tracking-wider">
            ENTER THE
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent block mt-2">
              NEON
            </span>
            <span className="text-gray-300 text-5xl md:text-7xl lg:text-8xl block mt-2">MULTIVERSE</span>
          </h1>

          {/* Description */}
          <p className="text-lg md:text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed font-light tracking-wide">
            Step into the ultimate cyberpunk battleground where legends are forged and destinies are written in neon light. Join the elite warriors in the most immersive gaming universe ever created.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <button className="group relative overflow-hidden bg-gradient-to-b from-cyan-500/60 via-blue-600/80 to-purple-700 px-10 py-5 rounded-2xl text-white font-black text-xl tracking-wider hover:shadow-2xl hover:shadow-cyan-500/30 transition-all duration-500 transform hover:scale-105 border border-white/20">
              <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center space-x-3">
                <Play className="w-7 h-7 group-hover:scale-110 transition-transform" />
                <span>ENTER NEXUS</span>
              </div>
            </button>
            
            <button className="group relative overflow-hidden bg-gradient-to-b from-white/10 via-white/20 to-white/30 backdrop-blur-sm px-10 py-5 rounded-2xl text-white font-black text-xl tracking-wider hover:shadow-2xl hover:shadow-white/20 transition-all duration-500 transform hover:scale-105 border border-white/30">
              <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center space-x-3">
                <Users className="w-7 h-7 group-hover:scale-110 transition-transform" />
                <span>JOIN GUILD</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-1/4 right-10 hidden lg:block animate-pulse">
        <div className="w-4 h-4 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full shadow-2xl shadow-cyan-400/50"></div>
      </div>
      <div className="absolute top-1/2 right-1/4 hidden lg:block animate-pulse" style={{ animationDelay: '1s' }}>
        <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full shadow-2xl shadow-blue-400/50"></div>
      </div>
      <div className="absolute bottom-1/3 right-1/3 hidden lg:block animate-pulse" style={{ animationDelay: '2s' }}>
        <div className="w-5 h-5 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full shadow-2xl shadow-purple-400/50"></div>
      </div>
      <div className="absolute top-1/3 left-10 hidden lg:block animate-pulse" style={{ animationDelay: '0.5s' }}>
        <div className="w-3 h-3 bg-gradient-to-r from-orange-400 to-red-500 rounded-full shadow-2xl shadow-orange-400/50"></div>
      </div>
    </div>
  );
};

export default HeroSection;