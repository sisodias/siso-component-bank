import React, { useState } from 'react';
import { Sun, Moon } from 'lucide-react';

const AlertComponent = () => {
  const [isDark, setIsDark] = useState(true);

  const alerts = [
    { type: 'success', message: 'This is a success alert.' },
    { type: 'error', message: 'This is an error alert.' },
    { type: 'warning', message: 'This is a warning alert.' },
    { type: 'info', message: 'This is an info alert.' }
  ];

  const getAlertStyles = (type) => {
    const baseStyles = {
      success: isDark 
        ? { bg: 'bg-green-900/30', text: 'text-green-400', border: 'border-green-700/50' }
        : { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-300' },
      error: isDark 
        ? { bg: 'bg-red-900/30', text: 'text-red-400', border: 'border-red-700/50' }
        : { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-300' },
      warning: isDark 
        ? { bg: 'bg-yellow-900/30', text: 'text-yellow-400', border: 'border-yellow-700/50' }
        : { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-300' },
      info: isDark 
        ? { bg: 'bg-blue-900/30', text: 'text-blue-400', border: 'border-blue-700/50' }
        : { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-300' }
    };
    return baseStyles[type];
  };

  const toggleTheme = () => {
    setIsDark(prev => !prev);
  };

  return (
    <div 
      className={`w-full min-h-screen relative transition-all duration-500 ${
        isDark ? 'bg-gray-900' : 'bg-gray-50'
      }`}
    >
      {/* Grid Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path 
                d="M 40 0 L 0 0 0 40" 
                fill="none" 
                stroke={isDark ? '#374151' : '#d1d5db'} 
                strokeWidth="1" 
                opacity={isDark ? "0.3" : "0.4"} 
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Theme Toggle Button */}
      <div className="absolute top-6 right-6 z-20">
        <button
          onClick={toggleTheme}
          className={`
            p-3 rounded-full transition-all duration-300 
            flex items-center justify-center
            transform hover:scale-105 active:scale-95
            ${isDark 
              ? 'bg-gray-800 hover:bg-gray-700 border border-gray-600 shadow-lg' 
              : 'bg-white hover:bg-gray-50 border border-gray-200 shadow-xl'
            }
          `}
        >
          {isDark ? (
            <Sun size={20} className="text-yellow-400 transition-colors duration-300" />
          ) : (
            <Moon size={20} className="text-gray-700 transition-colors duration-300" />
          )}
        </button>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-8">
        <div className="space-y-6 w-full max-w-md">
          {alerts.map((alert, index) => {
            const styles = getAlertStyles(alert.type);
            return (
              <div
                key={index}
                className={`
                  px-6 py-4 rounded-2xl border backdrop-blur-sm
                  ${styles.bg} ${styles.text} ${styles.border}
                  shadow-lg transition-all duration-300 
                  hover:scale-105 hover:shadow-xl
                  transform
                `}
              >
                <div className="flex items-center space-x-3">
                  <span className="font-semibold capitalize">
                    {alert.type}:
                  </span>
                  <span>{alert.message}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className={`mt-12 text-center transition-colors duration-300 ${
          isDark ? 'text-gray-400' : 'text-gray-500'
        }`}>
          <p className="text-sm">
            Click the {isDark ? 'sun' : 'moon'} icon to switch to {isDark ? 'light' : 'dark'} mode
          </p>
        </div>
      </div>
    </div>
  );
};

export default AlertComponent;
