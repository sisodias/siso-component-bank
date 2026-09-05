import React, { useState } from 'react';
import { Lightbulb } from 'lucide-react';

export function HeroSection() {
  const [idea, setIdea] = useState('');

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Navigation */}
      <nav className="flex justify-between items-center p-6 text-white relative z-10">
        <div className="flex items-center space-x-6">
          <span className="text-lg">›</span>
          <span className="text-lg">»</span>
          <span className="hover:text-purple-300 cursor-pointer">Explore</span>
          <span className="hover:text-purple-300 cursor-pointer">Resources</span>
        </div>
        <div className="flex items-center space-x-6">
          <span className="hover:text-purple-300 cursor-pointer">Contact</span>
          <div className="w-8 h-8 rounded-full border border-white flex items-center justify-center">
            <span className="text-sm">C</span>
            <span className="text-xs ml-1">0</span>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center min-h-[80vh] px-6 relative z-10">
        <h1 className="text-6xl md:text-7xl lg:text-8xl font-light text-white text-center mb-16 leading-tight">
          What should<br />
          we build today?
        </h1>
        
        {/* Input Container */}
        <div className="relative">
          {/* Glowing background effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 via-pink-500/30 to-purple-500/30 rounded-full blur-xl scale-110"></div>
          
          {/* Input field */}
          <div className="relative bg-gradient-to-r from-purple-800/40 to-purple-900/40 backdrop-blur-sm border border-purple-400/30 rounded-full p-1">
            <div className="flex items-center">
              <input
                type="text"
                placeholder="Enter your idea..."
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                className="flex-1 bg-transparent text-white placeholder-purple-300/70 px-6 py-4 text-lg focus:outline-none w-96"
              />
              <button className="bg-purple-600/60 hover:bg-purple-600/80 transition-colors rounded-full p-4 mr-2 backdrop-blur-sm">
                <Lightbulb className="w-6 h-6 text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Abstract flowing shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Main purple flowing shape */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/4">
          <svg width="800" height="600" viewBox="0 0 800 600" className="opacity-80">
            <defs>
              <radialGradient id="purpleGradient" cx="50%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.8"/>
                <stop offset="50%" stopColor="#a855f7" stopOpacity="0.6"/>
                <stop offset="100%" stopColor="#3730a3" stopOpacity="0.4"/>
              </radialGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
                <feMerge> 
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            <path
              d="M200 400 Q350 200 500 350 Q650 500 400 550 Q150 500 200 400"
              fill="url(#purpleGradient)"
              filter="url(#glow)"
              className="animate-pulse"
            />
          </svg>
        </div>

        {/* Secondary flowing lines */}
        <div className="absolute top-1/2 right-0 transform translate-x-1/4 -translate-y-1/2">
          <svg width="400" height="400" viewBox="0 0 400 400" className="opacity-40">
            <defs>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.6"/>
                <stop offset="100%" stopColor="#3730a3" stopOpacity="0.2"/>
              </linearGradient>
            </defs>
            <path
              d="M50 200 Q200 50 350 200 Q200 350 50 200"
              stroke="url(#lineGradient)"
              strokeWidth="2"
              fill="none"
              className="animate-pulse"
              style={{animationDelay: '1s'}}
            />
            <circle cx="200" cy="100" r="3" fill="#8b5cf6" className="animate-pulse" style={{animationDelay: '2s'}}/>
          </svg>
        </div>

        {/* Additional ambient shapes */}
        <div className="absolute top-1/4 left-0 transform -translate-x-1/2">
          <div className="w-64 h-64 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '3s'}}></div>
        </div>

        <div className="absolute bottom-1/4 right-1/4">
          <div className="w-32 h-32 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-full blur-2xl animate-pulse" style={{animationDelay: '4s'}}></div>
        </div>
      </div>

      {/* Subtle grid overlay */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      ></div>
    </div>
  );
}