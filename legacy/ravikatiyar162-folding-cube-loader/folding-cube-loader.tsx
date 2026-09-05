import React, { useState, useEffect } from 'react';

/**
 * A responsive "folding cube" loading indicator.
 * It consists of four squares that fold and unfold in a sequence.
 * Adapts to different screen sizes and theme modes.
 */
const LoadingIndicator = ({ isDark = true, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  return (
    <div className={`${sizeClasses[size]} relative transform rotate-45 transition-all duration-300`}>
      <div className={`cube-face float-left w-1/2 h-1/2 relative transform scale-110 ${isDark ? 'cube-face-dark' : 'cube-face-light'}`}></div>
      <div className={`cube-face float-left w-1/2 h-1/2 relative transform scale-110 origin-top-right rotate-90 ${isDark ? 'cube-face-dark' : 'cube-face-light'}`}></div>
      <div className={`cube-face float-left w-1/2 h-1/2 relative transform scale-110 origin-bottom-left -rotate-90 ${isDark ? 'cube-face-dark' : 'cube-face-light'}`}></div>
      <div className={`cube-face float-left w-1/2 h-1/2 relative transform scale-110 origin-bottom-right rotate-180 ${isDark ? 'cube-face-dark' : 'cube-face-light'}`}></div>
    </div>
  );
};

// Theme toggle component
const ThemeToggle = ({ isDark, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className={`
        relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-blue-500
        ${isDark ? 'bg-blue-600' : 'bg-gray-300'}
      `}
      role="switch"
      aria-checked={isDark}
      aria-label="Toggle theme"
    >
      <span
        className={`
          inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 shadow-lg
          ${isDark ? 'translate-x-6' : 'translate-x-1'}
        `}
      />
      <span className="sr-only">
        {isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      </span>
    </button>
  );
};

// Size selector component
const SizeSelector = ({ currentSize, onSizeChange, isDark }) => {
  const sizes = [
    { value: 'sm', label: 'Small' },
    { value: 'md', label: 'Medium' },
    { value: 'lg', label: 'Large' },
    { value: 'xl', label: 'Extra Large' }
  ];

  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {sizes.map((size) => (
        <button
          key={size.value}
          onClick={() => onSizeChange(size.value)}
          className={`
            px-3 py-1 text-xs font-medium rounded-full transition-all duration-200 border
            ${currentSize === size.value 
              ? (isDark 
                  ? 'bg-blue-600 text-white border-blue-600' 
                  : 'bg-blue-100 text-blue-700 border-blue-300')
              : (isDark 
                  ? 'bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600' 
                  : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200')
            }
          `}
        >
          {size.label}
        </button>
      ))}
    </div>
  );
};

// A utility component to inject the styles into the document head
const StyleInjector = () => {
  useEffect(() => {
    const styles = `
      /* Dark theme cube faces */
      .cube-face-dark::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #3b82f6, #1d4ed8);
        animation: fold-cube 2.4s infinite linear both;
        transform-origin: 100% 100%;
        border-radius: 2px;
        box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
      }

      /* Light theme cube faces */
      .cube-face-light::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #f59e0b, #d97706);
        animation: fold-cube 2.4s infinite linear both;
        transform-origin: 100% 100%;
        border-radius: 2px;
        box-shadow: 0 2px 8px rgba(245, 158, 11, 0.3);
      }

      /* Animation delays for sequential folding */
      .cube-face:nth-child(2)::before {
        animation-delay: 0.3s;
      }
      .cube-face:nth-child(4)::before {
        animation-delay: 0.6s;
      }
      .cube-face:nth-child(3)::before {
        animation-delay: 0.9s;
      }

      /* Folding animation keyframes */
      @keyframes fold-cube {
        0%, 10% {
          transform: perspective(140px) rotateX(-180deg);
          opacity: 0;
        }
        25%, 75% {
          transform: perspective(140px) rotateX(0deg);
          opacity: 1;
        }
        90%, 100% {
          transform: perspective(140px) rotateY(180deg);
          opacity: 0;
        }
      }

      /* Responsive adjustments */
      @media (max-width: 640px) {
        .cube-face::before {
          border-radius: 1px;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .cube-face::before {
          animation-duration: 4.8s;
        }
      }
    `;
    
    const styleElement = document.createElement('style');
    styleElement.innerHTML = styles;
    document.head.appendChild(styleElement);
    
    return () => {
      if (document.head.contains(styleElement)) {
        document.head.removeChild(styleElement);
      }
    };
  }, []);
  
  return null;
};

// Main App component
function App() {
  const [isDark, setIsDark] = useState(true);
  const [size, setSize] = useState('md');

  // Responsive size adjustment based on screen size
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) { // sm
        setSize(prev => prev === 'xl' ? 'lg' : prev);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  return (
    <>
      <StyleInjector />
      <div 
        className={`
          min-h-screen w-full flex flex-col items-center justify-center p-4 transition-colors duration-500
          ${isDark 
            ? 'bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800' 
            : 'bg-gradient-to-br from-blue-50 via-white to-orange-50'
          }
        `}
      >
        {/* Header */}
        <div className={`text-center mb-8 ${isDark ? 'text-white' : 'text-gray-800'}`}>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
            Folding Cube Loader
          </h1>
          <p className={`text-sm sm:text-base ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Responsive design with theme switching
          </p>
        </div>

        {/* Loading indicator container */}
        <div className={`
          p-8 sm:p-12 md:p-16 rounded-2xl mb-8 transition-all duration-500
          ${isDark 
            ? 'bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 shadow-2xl shadow-blue-500/10' 
            : 'bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-2xl shadow-orange-500/10'
          }
        `}>
          <LoadingIndicator isDark={isDark} size={size} />
        </div>

        {/* Controls */}
        <div className="space-y-6 w-full max-w-md">
          {/* Theme Toggle */}
          <div className="flex items-center justify-center space-x-4">
            <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              ☀️ Light
            </span>
            <ThemeToggle isDark={isDark} onToggle={toggleTheme} />
            <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              🌙 Dark
            </span>
          </div>

          {/* Size Selector */}
          <div className="text-center">
            <label className={`block text-sm font-medium mb-3 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              Size Selection
            </label>
            <SizeSelector 
              currentSize={size} 
              onSizeChange={setSize} 
              isDark={isDark} 
            />
          </div>
        </div>

        {/* Footer */}
        <div className={`mt-12 text-center text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
          <p>Responsive • Accessible • Smooth Animations</p>
        </div>
      </div>
    </>
  );
}

export default App;