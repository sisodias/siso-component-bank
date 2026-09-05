import React, { useState, useEffect } from 'react';
import { Moon, Sun, Home, ArrowLeft } from 'lucide-react';

const Error404Page = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check for system preference on mount
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDark(prefersDark);
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  return (
    <div className={`w-full min-h-screen transition-colors duration-300 ${
      isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
    }`}>
      {/* Orthogonal Grid Background */}
      <div className="fixed inset-0 overflow-hidden">
        <svg 
          className="w-full h-full" 
          viewBox="0 0 1000 1000" 
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <pattern 
              id="grid" 
              width="50" 
              height="50" 
              patternUnits="userSpaceOnUse"
            >
              <path 
                d="M 50 0 L 0 0 0 50" 
                fill="none" 
                stroke={isDark ? 'rgba(75, 85, 99, 0.3)' : 'rgba(156, 163, 175, 0.3)'} 
                strokeWidth="1"
              />
            </pattern>
            <pattern 
              id="majorGrid" 
              width="200" 
              height="200" 
              patternUnits="userSpaceOnUse"
            >
              <path 
                d="M 200 0 L 0 0 0 200" 
                fill="none" 
                stroke={isDark ? 'rgba(75, 85, 99, 0.5)' : 'rgba(156, 163, 175, 0.5)'} 
                strokeWidth="2"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          <rect width="100%" height="100%" fill="url(#majorGrid)" />
        </svg>
      </div>

      {/* Theme Toggle Button */}
      <div className="absolute top-6 right-6 z-20">
        <button
          onClick={toggleTheme}
          className={`p-3 rounded-full transition-all duration-300 shadow-lg hover:scale-110 ${
            isDark 
              ? 'bg-gray-800 hover:bg-gray-700 border border-gray-600' 
              : 'bg-white hover:bg-gray-50 border border-gray-200'
          }`}
          aria-label="Toggle theme"
        >
          {isDark ? (
            <Sun className="w-5 h-5 text-yellow-500" />
          ) : (
            <Moon className="w-5 h-5 text-gray-600" />
          )}
        </button>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        <div className="text-center max-w-2xl mx-auto">
          {/* 404 Number */}
          <div className={`text-8xl md:text-9xl font-bold mb-4 tracking-tight ${
            isDark 
              ? 'text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500' 
              : 'text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600'
          }`}>
            404
          </div>

          {/* Error Message */}
          <h1 className={`text-3xl md:text-4xl font-bold mb-4 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Page Not Found
          </h1>

          <p className={`text-lg md:text-xl mb-8 leading-relaxed ${
            isDark ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Oops! The page you're looking for seems to have wandered off into the digital void. 
            Don't worry, even the best explorers sometimes take a wrong turn.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button 
              onClick={() => window.history.back()}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 hover:scale-105 shadow-lg ${
                isDark 
                  ? 'bg-gray-800 hover:bg-gray-700 text-white border border-gray-600' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-900 border border-gray-300'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </button>

            <button 
              onClick={() => window.location.href = '/'}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 hover:scale-105 shadow-lg ${
                isDark 
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white' 
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
              }`}
            >
              <Home className="w-4 h-4" />
              Go Home
            </button>
          </div>

          {/* Decorative Elements */}
          <div className="mt-12 flex justify-center space-x-4">
            <div className={`w-2 h-2 rounded-full animate-pulse ${
              isDark ? 'bg-blue-400' : 'bg-blue-600'
            }`} style={{animationDelay: '0ms'}}></div>
            <div className={`w-2 h-2 rounded-full animate-pulse ${
              isDark ? 'bg-purple-400' : 'bg-purple-600'
            }`} style={{animationDelay: '200ms'}}></div>
            <div className={`w-2 h-2 rounded-full animate-pulse ${
              isDark ? 'bg-blue-400' : 'bg-blue-600'
            }`} style={{animationDelay: '400ms'}}></div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-1/4 left-1/4 w-4 h-4 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 opacity-10 animate-bounce" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-3/4 right-1/4 w-3 h-3 rounded-full bg-gradient-to-r from-purple-400 to-pink-500 opacity-12 animate-bounce" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-1/4 left-1/3 w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 opacity-15 animate-bounce" style={{animationDelay: '0.5s'}}></div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-6 left-0 right-0 text-center z-10">
        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          Lost in cyberspace? It happens to the best of us.
        </p>
      </div>
    </div>
  );
};

export default Error404Page;