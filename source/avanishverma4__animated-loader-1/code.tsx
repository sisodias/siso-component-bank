import React, { useState } from 'react';

const Loader = () => {
  const [isDark, setIsDark] = useState(true);

  return (
    <div className={`w-full min-h-screen flex items-center justify-center relative overflow-hidden transition-colors duration-300 ${isDark ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <div className={`absolute inset-0 bg-grid ${isDark ? 'opacity-20' : 'opacity-10'}`}></div>
      
      <button
        onClick={() => setIsDark(!isDark)}
        className={`absolute top-6 right-6 z-20 p-3 rounded-full transition-all duration-300 ${
          isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-200'
        } shadow-lg`}
      >
        {isDark ? (
          <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        ) : (
          <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        )}
      </button>

      <div className="relative w-24 h-24 rotate-45 z-10">
        {[...Array(7)].map((_, i) => (
          <div
            key={i}
            className={`absolute top-0 left-0 w-7 h-7 m-0.5 animate-square ${
              isDark ? 'bg-white' : 'bg-gray-900'
            }`}
            style={{
              animationDelay: `${-1.4285714286 * i}s`
            }}
          />
        ))}
      </div>

      <style>{`
        .bg-grid {
          background-image: 
            linear-gradient(${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'} 1px, transparent 1px),
            linear-gradient(90deg, ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'} 1px, transparent 1px);
          background-size: 50px 50px;
        }
        
        @keyframes square-animation {
          0% {
            left: 0;
            top: 0;
          }
          10.5% {
            left: 0;
            top: 0;
          }
          12.5% {
            left: 32px;
            top: 0;
          }
          23% {
            left: 32px;
            top: 0;
          }
          25% {
            left: 64px;
            top: 0;
          }
          35.5% {
            left: 64px;
            top: 0;
          }
          37.5% {
            left: 64px;
            top: 32px;
          }
          48% {
            left: 64px;
            top: 32px;
          }
          50% {
            left: 32px;
            top: 32px;
          }
          60.5% {
            left: 32px;
            top: 32px;
          }
          62.5% {
            left: 32px;
            top: 64px;
          }
          73% {
            left: 32px;
            top: 64px;
          }
          75% {
            left: 0;
            top: 64px;
          }
          85.5% {
            left: 0;
            top: 64px;
          }
          87.5% {
            left: 0;
            top: 32px;
          }
          98% {
            left: 0;
            top: 32px;
          }
          100% {
            left: 0;
            top: 0;
          }
        }
        
        .animate-square {
          animation: square-animation 10s ease-in-out infinite both;
        }
      `}</style>
    </div>
  );
};

export default Loader;