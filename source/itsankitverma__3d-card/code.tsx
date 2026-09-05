import React, { useState } from 'react';

export default function RefinedGlassCard() {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isDark, setIsDark] = useState(false);

  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 30;
    const rotateY = (centerX - x) / 30;
    
    setRotation({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 });
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-6 w-full transition-colors duration-500 $bg-gray-900`}>
      {/* Dark Mode Toggle */}
      <button
        onClick={() => setIsDark(!isDark)}
        className={`fixed top-6 right-6 p-3 rounded-full shadow-lg transition-all duration-300 ${
          isDark ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700' : 'bg-white text-gray-800 hover:bg-gray-50'
        } border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}
      >
        {isDark ? (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
          </svg>
        )}
      </button>

      <div 
        className="relative"
        style={{ perspective: '1500px' }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div 
          className={`w-96 backdrop-blur-xl rounded-3xl border-2 overflow-hidden transition-all duration-700 ease-out ${
            isDark 
              ? 'bg-gray-800/90 border-gray-700' 
              : 'bg-gray-50/90 border-gray-200'
          }`}
          style={{
            transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
            boxShadow: isDark 
              ? '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 12px 24px -8px rgba(0, 0, 0, 0.3), inset 0 1px 0 0 rgba(255, 255, 255, 0.1)'
              : '0 25px 50px -12px rgba(0, 0, 0, 0.12), 0 12px 24px -8px rgba(0, 0, 0, 0.08), inset 0 1px 0 0 rgba(255, 255, 255, 0.8)'
          }}
        >
          {/* Card Image Section */}
          <div className="relative h-56 overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=800&q=80" 
              alt="Mountain landscape at sunset"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-transparent"></div>
            
            {/* Image overlay label */}
            <div className={`absolute top-4 left-4 px-3 py-1.5 backdrop-blur-md rounded-full border shadow-sm ${
              isDark 
                ? 'bg-gray-800/90 border-gray-700' 
                : 'bg-white/90 border-gray-200'
            }`}>
              <span className={`text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Photography</span>
            </div>
          </div>

          {/* Card Content */}
          <div className="p-6">
            <div className="flex items-start justify-between mb-3">
              <h3 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Mountain Serenity
              </h3>
              <div className={`flex items-center gap-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-sm font-medium">4.8</span>
              </div>
            </div>
            
            <p className={`text-sm leading-relaxed mb-5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Discover breathtaking views of majestic mountain ranges bathed in golden hour light. This stunning landscape captures the raw beauty of nature's grandeur and tranquil solitude.
            </p>

            {/* Details Grid */}
            <div className="grid grid-cols-3 gap-3 mb-5">
              <div className={`backdrop-blur-sm rounded-xl p-3 border shadow-sm ${
                isDark 
                  ? 'bg-gray-700/60 border-gray-600' 
                  : 'bg-white/60 border-gray-200'
              }`}>
                <div className={`text-xs mb-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Location</div>
                <div className={`text-sm font-semibold ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>Alps</div>
              </div>
              <div className={`backdrop-blur-sm rounded-xl p-3 border shadow-sm ${
                isDark 
                  ? 'bg-gray-700/60 border-gray-600' 
                  : 'bg-white/60 border-gray-200'
              }`}>
                <div className={`text-xs mb-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Season</div>
                <div className={`text-sm font-semibold ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>Autumn</div>
              </div>
              <div className={`backdrop-blur-sm rounded-xl p-3 border shadow-sm ${
                isDark 
                  ? 'bg-gray-700/60 border-gray-600' 
                  : 'bg-white/60 border-gray-200'
              }`}>
                <div className={`text-xs mb-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Views</div>
                <div className={`text-sm font-semibold ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>12.5k</div>
              </div>
            </div>

            {/* Action Button */}
            <div className={`flex items-center justify-between pt-4 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="flex items-center gap-2">
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80" 
                  alt="Ankit"
                  className={`w-8 h-8 rounded-full border shadow-sm object-cover ${isDark ? 'border-gray-600' : 'border-gray-300'}`}
                />
                <div>
                  <div className={`text-xs font-medium ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>Ankit</div>
                  <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Photographer</div>
                </div>
              </div>
              <button className={`px-4 py-2 text-sm text-white rounded-lg shadow-sm transition-all ${
                isDark 
                  ? 'bg-gray-700 hover:bg-gray-600' 
                  : 'bg-gray-800 hover:bg-gray-900'
              }`}>
                View More
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}