import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';

const RangeSlider = () => {
  const [value, setValue] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const trackRef = useRef(null);

  const updateValue = useCallback((clientX) => {
    if (trackRef.current) {
      const rect = trackRef.current.getBoundingClientRect();
      const percentage = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
      setValue(Math.round(percentage));
    }
  }, []);

  const handleMouseDown = useCallback((e) => {
    setIsDragging(true);
    updateValue(e.clientX);
  }, [updateValue]);

  const handleMouseMove = useCallback((e) => {
    if (isDragging) {
      updateValue(e.clientX);
    }
  }, [isDragging, updateValue]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleTouchStart = useCallback((e) => {
    setIsDragging(true);
    updateValue(e.touches[0].clientX);
  }, [updateValue]);

  const handleTouchMove = useCallback((e) => {
    if (isDragging) {
      e.preventDefault();
      updateValue(e.touches[0].clientX);
    }
  }, [isDragging, updateValue]);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);

  const gridPattern = {
    light: "data:image/svg+xml,%3csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3e%3cdefs%3e%3cpattern id='grid' width='40' height='40' patternUnits='userSpaceOnUse'%3e%3cpath d='M 40 0 L 0 0 0 40' fill='none' stroke='%23e5e7eb' stroke-width='1'/%3e%3c/pattern%3e%3c/defs%3e%3crect width='100%25' height='100%25' fill='url(%23grid)' /%3e%3c/svg%3e",
    dark: "data:image/svg+xml,%3csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3e%3cdefs%3e%3cpattern id='grid' width='40' height='40' patternUnits='userSpaceOnUse'%3e%3cpath d='M 40 0 L 0 0 0 40' fill='none' stroke='%23374151' stroke-width='1'/%3e%3c/pattern%3e%3c/defs%3e%3crect width='100%25' height='100%25' fill='url(%23grid)' /%3e%3c/svg%3e"
  };

  return (
    <div className={`w-full min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Grid Background */}
      <div 
        className="absolute inset-0 opacity-50"
        style={{
          backgroundImage: `url("${gridPattern[isDarkMode ? 'dark' : 'light']}")`
        }}
      />
      
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-8">
        {/* Theme Toggle */}
        <motion.button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className={`mb-8 px-4 py-2 rounded-lg font-medium transition-colors ${
            isDarkMode 
              ? 'bg-gray-800 text-gray-100 hover:bg-gray-700' 
              : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </motion.button>

        {/* Main Container */}
        <motion.div 
          className={`w-full max-w-md p-8 rounded-2xl border backdrop-blur-sm ${
            isDarkMode 
              ? 'bg-gray-900/80 border-gray-700' 
              : 'bg-white/80 border-gray-200'
          }`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Title */}
          <h2 className={`text-2xl font-bold text-center mb-8 ${
            isDarkMode ? 'text-gray-100' : 'text-gray-900'
          }`}>
            Range Slider
          </h2>

          {/* Value Display */}
          <motion.div 
            className={`text-center mb-6 text-4xl font-bold ${
              isDarkMode ? 'text-gray-100' : 'text-gray-900'
            }`}
            key={value}
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            {value}
          </motion.div>

          {/* Slider Container */}
          <div className="relative mb-6 py-2">
            {/* Track */}
            <div 
              ref={trackRef}
              className={`w-full h-2 rounded-full cursor-pointer ${
                isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
              }`}
              onMouseDown={handleMouseDown}
              onTouchStart={handleTouchStart}
            >
              {/* Progress */}
              <motion.div 
                className={`h-full rounded-full pointer-events-none ${
                  isDarkMode ? 'bg-gray-300' : 'bg-gray-800'
                }`}
                animate={{ width: `${value}%` }}
                transition={{ 
                  duration: isDragging ? 0 : 0.2, 
                  ease: "easeOut" 
                }}
              />
            </div>

            {/* Thumb */}
            <motion.div
              className={`absolute top-1/2 w-6 h-6 rounded-full border-2 shadow-lg cursor-grab active:cursor-grabbing ${
                isDarkMode 
                  ? 'bg-gray-100 border-gray-300' 
                  : 'bg-gray-900 border-gray-800'
              }`}
              style={{ 
                left: `calc(${value}% - 12px)`,
                transform: 'translateY(-50%)'
              }}
              animate={{ 
                scale: isDragging ? 1.2 : 1,
              }}
              transition={{ 
                duration: isDragging ? 0.1 : 0.2,
                ease: "easeOut"
              }}
              whileHover={{ scale: 1.1 }}
              onMouseDown={handleMouseDown}
              onTouchStart={handleTouchStart}
            />
          </div>

          {/* Labels */}
          <div className={`flex justify-between text-sm ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            <span>0</span>
            <span>50</span>
            <span>100</span>
          </div>

          {/* Additional Info */}
          <motion.div 
            className={`mt-6 p-4 rounded-lg text-center ${
              isDarkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700'
            }`}
            animate={{ 
              backgroundColor: isDragging 
                ? (isDarkMode ? '#1f2937' : '#f3f4f6')
                : (isDarkMode ? '#374151' : '#f9fafb')
            }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-sm">
              {isDragging ? 'Adjusting...' : 'Current Value'}
            </div>
            <div className="font-mono text-lg">
              {value}%
            </div>
          </motion.div>
        </motion.div>

        {/* Footer */}
        <motion.p 
          className={`mt-8 text-center text-sm ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          Drag the slider or click anywhere on the track
        </motion.p>
      </div>
    </div>
  );
};

export default RangeSlider;