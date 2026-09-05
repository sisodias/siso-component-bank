'use client'

import React from "react"

export function HoloMatrixEnvironment({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative w-full h-screen flex justify-center items-center bg-slate-950 overflow-hidden">

      <div className="absolute inset-0 bg-grid-pattern opacity-20" />

      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-purple-500/10" />
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-slate-950" />

      <div className="absolute top-0 left-0 w-64 h-64 opacity-30">
        <svg viewBox="0 0 200 200" className="w-full h-full">

          <path
            d="M 0 0 Q 100 0 200 100 L 200 0 Z"
            fill="url(#cornerGradient1)"
            className="animate-pulse-slow"
          />
          <circle cx="200" cy="100" r="3" fill="cyan" className="animate-ping-slow" />
          <circle cx="150" cy="50" r="2" fill="blue" className="animate-ping-slow" style={{animationDelay: '0.5s'}} />
          <circle cx="100" cy="25" r="2" fill="indigo" className="animate-ping-slow" style={{animationDelay: '1s'}} />

          <path
            d="M 10 10 L 50 10 L 30 40 Z"
            stroke="cyan"
            strokeWidth="0.5"
            fill="none"
            className="animate-pulse-slow"
          />
          <rect x="60" y="10" width="20" height="20" stroke="blue" strokeWidth="0.5" fill="none" opacity="0.6" />
          <circle cx="110" cy="20" r="8" stroke="indigo" strokeWidth="0.5" fill="none" opacity="0.6" />
          
          <defs>
            <linearGradient id="cornerGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="cyan" stopOpacity="0.3" />
              <stop offset="50%" stopColor="blue" stopOpacity="0.2" />
              <stop offset="100%" stopColor="indigo" stopOpacity="0.1" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="absolute top-0 right-0 w-64 h-64 opacity-30 transform scale-x-[-1]">
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <path
            d="M 0 0 Q 100 0 200 100 L 200 0 Z"
            fill="url(#cornerGradient2)"
            className="animate-pulse-slow"
            style={{animationDelay: '0.3s'}}
          />
          <circle cx="200" cy="100" r="3" fill="purple" className="animate-ping-slow" />
          <circle cx="150" cy="50" r="2" fill="fuchsia" className="animate-ping-slow" style={{animationDelay: '0.7s'}} />

          <line x1="20" y1="20" x2="80" y2="20" stroke="purple" strokeWidth="0.5" opacity="0.6" />
          <line x1="20" y1="30" x2="60" y2="30" stroke="fuchsia" strokeWidth="0.5" opacity="0.4" />
          <line x1="20" y1="40" x2="70" y2="40" stroke="violet" strokeWidth="0.5" opacity="0.5" />
          
          <defs>
            <linearGradient id="cornerGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="purple" stopOpacity="0.3" />
              <stop offset="50%" stopColor="fuchsia" stopOpacity="0.2" />
              <stop offset="100%" stopColor="violet" stopOpacity="0.1" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="absolute bottom-0 left-0 w-64 h-64 opacity-30 transform scale-y-[-1]">
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <path
            d="M 0 0 Q 100 0 200 100 L 200 0 Z"
            fill="url(#cornerGradient3)"
            className="animate-pulse-slow"
            style={{animationDelay: '0.6s'}}
          />
          
          <polygon
            points="50,20 65,28 65,44 50,52 35,44 35,28"
            stroke="emerald"
            strokeWidth="0.5"
            fill="none"
            opacity="0.6"
          />
          <polygon
            points="90,35 100,41 100,53 90,59 80,53 80,41"
            stroke="teal"
            strokeWidth="0.5"
            fill="none"
            opacity="0.5"
          />
          
          <circle cx="200" cy="100" r="3" fill="emerald" className="animate-ping-slow" />
          <circle cx="160" cy="60" r="2" fill="teal" className="animate-ping-slow" style={{animationDelay: '0.4s'}} />
          
          <defs>
            <linearGradient id="cornerGradient3" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="emerald" stopOpacity="0.3" />
              <stop offset="50%" stopColor="teal" stopOpacity="0.2" />
              <stop offset="100%" stopColor="cyan" stopOpacity="0.1" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="absolute bottom-0 right-0 w-64 h-64 opacity-30 transform scale-[-1]">
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <path
            d="M 0 0 Q 100 0 200 100 L 200 0 Z"
            fill="url(#cornerGradient4)"
            className="animate-pulse-slow"
            style={{animationDelay: '0.9s'}}
          />
            
          <path
            d="M 50 15 L 55 30 L 70 30 L 58 40 L 63 55 L 50 45 L 37 55 L 42 40 L 30 30 L 45 30 Z"
            stroke="rose"
            strokeWidth="0.5"
            fill="none"
            opacity="0.6"
          />
          
          <circle cx="200" cy="100" r="3" fill="rose" className="animate-ping-slow" />
          <circle cx="170" cy="70" r="2" fill="pink" className="animate-ping-slow" style={{animationDelay: '0.2s'}} />
          <circle cx="130" cy="40" r="2" fill="red" className="animate-ping-slow" style={{animationDelay: '0.8s'}} />
          
          <defs>
            <linearGradient id="cornerGradient4" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rose" stopOpacity="0.3" />
              <stop offset="50%" stopColor="pink" stopOpacity="0.2" />
              <stop offset="100%" stopColor="red" stopOpacity="0.1" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        .bg-grid-pattern {
          background-image: 
            linear-gradient(to right, rgba(100, 116, 139, 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(100, 116, 139, 0.1) 1px, transparent 1px);
          background-size: 40px 40px;
        }

        .bg-gradient-radial {
          background: radial-gradient(circle at center, transparent 0%, rgba(2, 6, 23, 0.8) 100%);
        }

        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.6;
          }
        }

        @keyframes ping-slow {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.5);
            opacity: 0.5;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        .animate-pulse-slow {
          animation: pulse-slow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        .animate-ping-slow {
          animation: ping-slow 3s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
      `}</style>
    </div>
  );
}
