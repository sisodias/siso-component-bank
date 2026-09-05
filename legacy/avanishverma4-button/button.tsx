import React, { useState } from 'react';
import { Play, Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';

const Button3D = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  onClick,
  disabled = false,
  className = ''
}) => {
  const [isPressed, setIsPressed] = useState(false);

  const variants = {
    primary: {
      base: 'bg-blue-500 text-white border-blue-600',
      hover: 'hover:bg-blue-600'
    },
    secondary: {
      base: 'bg-gray-500 text-white border-gray-600',
      hover: 'hover:bg-gray-600'
    },
    success: {
      base: 'bg-green-500 text-white border-green-600',
      hover: 'hover:bg-green-600'
    },
    danger: {
      base: 'bg-red-500 text-white border-red-600',
      hover: 'hover:bg-red-600'
    },
    warning: {
      base: 'bg-yellow-500 text-black border-yellow-600',
      hover: 'hover:bg-yellow-600'
    }
  };

  const sizes = {
    sm: 'px-3 py-2 text-xs sm:px-4 sm:py-2 sm:text-sm',
    md: 'px-4 py-2 text-sm sm:px-6 sm:py-3 sm:text-base',
    lg: 'px-6 py-3 text-base sm:px-8 sm:py-4 sm:text-lg'
  };

  const currentVariant = variants[variant];
  const currentSize = sizes[size];

  const handleMouseDown = () => {
    if (!disabled) {
      setIsPressed(true);
    }
  };

  const handleMouseUp = () => {
    setIsPressed(false);
  };

  const handleClick = (e) => {
    if (onClick && !disabled) {
      onClick(e);
    }
  };

  return (
    <motion.button
      className={`
        ${currentVariant.base}
        ${currentVariant.hover}
        font-bold
        rounded-lg
        border-b-4
        ${currentSize}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        focus:outline-none
        focus:ring-4
        focus:ring-blue-300
        select-none
        flex
        items-center
        justify-center
        ${className}
      `}
      initial={{ 
        boxShadow: '0 6px 0 0 #1d4ed8',
        y: 0 
      }}
      whileHover={{ 
        scale: 1.02,
        boxShadow: '0 8px 0 0 #1d4ed8',
        transition: { duration: 0.1 }
      }}
      whileTap={{ 
        scale: 0.98,
        y: 4,
        boxShadow: '0 2px 0 0 #1d4ed8',
        transition: { duration: 0.1 }
      }}
      animate={{
        y: isPressed ? 4 : 0,
        boxShadow: isPressed ? '0 2px 0 0 #1d4ed8' : '0 6px 0 0 #1d4ed8'
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 20
      }}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onClick={handleClick}
      disabled={disabled}
    >
      {children}
    </motion.button>
  );
};

// Demo component
const App = () => {
  const [isDark, setIsDark] = useState(false);

  const handleClick = () => {
    console.log('Button clicked!');
  };

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const theme = {
    light: {
      bg: 'bg-gradient-to-br from-purple-100 to-blue-100',
      text: 'text-gray-800',
      gridColor: '#6366f1',
      gridOpacity: 'opacity-20'
    },
    dark: {
      bg: 'bg-gradient-to-br from-black via-gray-900 to-gray-800',
      text: 'text-gray-100',
      gridColor: '#8b5cf6',
      gridOpacity: 'opacity-30'
    }
  };

  const currentTheme = isDark ? theme.dark : theme.light;

  return (
    <div className={`w-full min-h-screen ${currentTheme.bg} p-4 sm:p-8 relative overflow-hidden transition-all duration-500`}>
      {/* Theme Toggle Button */}
      <motion.button
        onClick={toggleTheme}
        className={`fixed top-4 right-4 p-3 rounded-full ${isDark ? 'bg-gray-800 text-yellow-400' : 'bg-white text-gray-800'} shadow-lg z-20`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </motion.button>

      {/* Orthogonal Grid Background */}
      <div className={`absolute inset-0 ${currentTheme.gridOpacity} transition-opacity duration-500`}>
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke={currentTheme.gridColor} strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>
      
      <div className="flex flex-col items-center justify-center min-h-screen relative z-10">
        <h1 className={`text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-8 ${currentTheme.text} transition-colors duration-500`}>
          3D Button Component Demo
        </h1>
        
        <Button3D variant="primary" onClick={handleClick}>
          <Play className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
          Primary Button
        </Button3D>
      </div>
    </div>
  );
};

export default App;
