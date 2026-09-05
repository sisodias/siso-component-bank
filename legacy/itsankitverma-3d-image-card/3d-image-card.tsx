import React, { useState } from 'react';

const GlassCard = ({ 
  title = "Premium Feature", 
  description = "Experience the next level of innovation with our advanced technology solutions designed for modern applications.",
  imageUrl = "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=300&fit=crop&crop=center",
  defaultDarkMode = false,
  onModeChange = (isDark) => console.log('Mode changed:', isDark ? 'Dark' : 'Light')
}) => {
  const [isDarkMode, setIsDarkMode] = useState(defaultDarkMode);

  const handleModeToggle = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    onModeChange(newMode);
  };

  return (
    <div className={`flex items-center justify-center min-h-screen p-8 transition-colors duration-500 w-full ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-black' 
        : 'bg-gradient-to-br from-blue-50 via-indigo-100 to-purple-100'
    }`}>
      <div 
        className="relative w-80 h-96 transform transition-all duration-500 hover:scale-105"
        style={{
          transformStyle: 'preserve-3d',
          perspective: '1000px'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.05) rotateY(8deg) rotateX(5deg)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1) rotateY(0deg) rotateX(0deg)';
        }}
      >
        {/* Main Card */}
        <div 
          className={`relative w-full h-full rounded-2xl backdrop-blur-lg border-2 shadow-2xl transition-all duration-500 ${
            isDarkMode
              ? 'bg-black/25 border-white/20 shadow-black/60'
              : 'bg-white/90 border-white shadow-gray-400/40'
          }`}
          style={{
            backdropFilter: 'blur(20px)',
            boxShadow: isDarkMode
              ? '0 25px 50px -12px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
              : '0 25px 50px -12px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.3)'
          }}
        >          
          {/* Content Container */}
          <div className="relative z-10 p-6 h-full flex flex-col">
            {/* Header with Switch */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1 pr-4">
                <h2 className={`text-xl font-bold mb-2 leading-tight transition-colors duration-500 ${
                  isDarkMode ? 'text-white' : 'text-gray-800'
                }`}>
                  {title}
                </h2>
                <p className={`text-sm leading-relaxed transition-colors duration-500 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {description}
                </p>
              </div>
              
              {/* Toggle Switch */}
              <div className="flex-shrink-0">
                <button
                  onClick={handleModeToggle}
                  className={`relative w-12 h-6 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    isDarkMode 
                      ? 'bg-blue-600 focus:ring-blue-500' 
                      : 'bg-gray-300 focus:ring-gray-400'
                  }`}
                >
                  <div
                    className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-all duration-300 flex items-center justify-center ${
                      isDarkMode ? 'left-6.5' : 'left-0.5'
                    }`}
                  >
                    {isDarkMode ? (
                      <svg className="w-3 h-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>
                      </svg>
                    ) : (
                      <svg className="w-3 h-3 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd"></path>
                      </svg>
                    )}
                  </div>
                </button>
              </div>
            </div>

            {/* Image Container */}
            <div className="flex-1 flex items-center justify-center mb-4">
              <div 
                className={`relative w-full h-40 rounded-xl overflow-hidden transition-all duration-500 ${
                  isDarkMode 
                    ? 'bg-gray-800/30 border-gray-600/20' 
                    : 'bg-white/20 border-white/30'
                } border`}
                style={{
                  backdropFilter: 'blur(10px)'
                }}
              >
                <img 
                  src={imageUrl} 
                  alt="Card content"
                  className={`w-full h-full object-cover transition-all duration-500 ${
                    isDarkMode ? 'opacity-90' : 'opacity-100'
                  }`}
                />
                {/* Subtle Image Overlay */}
                <div 
                  className={`absolute inset-0 transition-all duration-500 ${
                    isDarkMode 
                      ? 'bg-black/10' 
                      : 'bg-white/5'
                  }`}
                />
              </div>
            </div>

            {/* Mode Indicator */}
            <div className="flex items-center justify-center">
              <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-full backdrop-blur-sm transition-all duration-500 ${
                isDarkMode 
                  ? 'bg-gray-800/40 border border-gray-600/30' 
                  : 'bg-white/40 border border-white/50'
              }`}>
                <div 
                  className={`w-2 h-2 rounded-full transition-all duration-500 ${
                    isDarkMode ? 'bg-blue-400' : 'bg-amber-400'
                  }`}
                />
                <span className={`text-xs font-medium transition-colors duration-500 ${
                  isDarkMode ? 'text-gray-200' : 'text-gray-700'
                }`}>
                  {isDarkMode ? 'Dark Mode' : 'Light Mode'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced 3D Shadow */}
        <div 
          className={`absolute inset-0 rounded-2xl transform transition-all duration-500 -z-10 ${
            isDarkMode ? 'bg-black/40' : 'bg-gray-500/30'
          }`}
          style={{
            transform: 'translateZ(-20px) translateY(8px) translateX(4px) rotateY(2deg)',
            filter: 'blur(8px)'
          }}
        />
        
        {/* Secondary Shadow Layer */}
        <div 
          className={`absolute inset-0 rounded-2xl transform transition-all duration-500 -z-20 ${
            isDarkMode ? 'bg-black/20' : 'bg-gray-400/20'
          }`}
          style={{
            transform: 'translateZ(-40px) translateY(15px) translateX(8px) rotateY(4deg)',
            filter: 'blur(15px)'
          }}
        />
      </div>
    </div>
  );
};

export default GlassCard;