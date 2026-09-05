import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';

export default function BrightnessSlider() {
  const [brightness, setBrightness] = useState(50);
  const [isDark, setIsDark] = useState(true);
  const [isDragging, setIsDragging] = useState(false);

  return (
    <div className={`w-full min-h-screen transition-colors duration-700 ${isDark ? 'bg-zinc-950' : 'bg-zinc-50'}`}>
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-zinc-900/10 pointer-events-none" />
      
      {/* Grid Background */}
      <div className="absolute inset-0 overflow-hidden">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path 
                d="M 60 0 L 0 0 0 60" 
                fill="none" 
                stroke={isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.04)'} 
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-screen px-8 py-8 overflow-hidden">
        {/* Theme Toggle */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsDark(!isDark)}
          className={`absolute top-6 right-6 p-3 rounded-2xl backdrop-blur-xl border transition-all duration-500 ${
            isDark 
              ? 'bg-white/5 border-white/10 text-white hover:bg-white/10' 
              : 'bg-black/5 border-black/10 text-zinc-900 hover:bg-black/10'
          }`}
        >
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: isDark ? 0 : 180 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </motion.div>
        </motion.button>

        {/* Main Container */}
        <div className="w-full max-w-2xl space-y-12">
          {/* Title Section */}
          <motion.div 
            className="text-center space-y-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className={`text-5xl font-light tracking-tight ${isDark ? 'text-white' : 'text-zinc-900'}`}>
              Brightness
            </h1>
            <motion.p 
              className={`text-2xl font-extralight tabular-nums ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}
              key={brightness}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              {brightness}%
            </motion.p>
          </motion.div>

          {/* Pill Display */}
          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div 
              className={`relative w-32 h-64 rounded-full overflow-hidden shadow-2xl cursor-ns-resize ${
                isDark ? 'shadow-black/50' : 'shadow-zinc-900/20'
              } ${isDragging ? 'scale-105' : ''} transition-transform`}
              onMouseDown={(e) => {
                setIsDragging(true);
                const rect = e.currentTarget.getBoundingClientRect();
                const updateBrightness = (clientY) => {
                  const y = clientY - rect.top;
                  const percentage = Math.max(0, Math.min(100, 100 - (y / rect.height) * 100));
                  setBrightness(Math.round(percentage));
                };
                updateBrightness(e.clientY);
                
                const handleMouseMove = (e) => updateBrightness(e.clientY);
                const handleMouseUp = () => {
                  setIsDragging(false);
                  document.removeEventListener('mousemove', handleMouseMove);
                  document.removeEventListener('mouseup', handleMouseUp);
                };
                
                document.addEventListener('mousemove', handleMouseMove);
                document.addEventListener('mouseup', handleMouseUp);
              }}
              onTouchStart={(e) => {
                setIsDragging(true);
                const rect = e.currentTarget.getBoundingClientRect();
                const updateBrightness = (clientY) => {
                  const y = clientY - rect.top;
                  const percentage = Math.max(0, Math.min(100, 100 - (y / rect.height) * 100));
                  setBrightness(Math.round(percentage));
                };
                updateBrightness(e.touches[0].clientY);
                
                const handleTouchMove = (e) => updateBrightness(e.touches[0].clientY);
                const handleTouchEnd = () => {
                  setIsDragging(false);
                  document.removeEventListener('touchmove', handleTouchMove);
                  document.removeEventListener('touchend', handleTouchEnd);
                };
                
                document.addEventListener('touchmove', handleTouchMove);
                document.addEventListener('touchend', handleTouchEnd);
              }}
            >
              {/* Border */}
              <div className={`absolute inset-0 rounded-full border-2 pointer-events-none ${
                isDark ? 'border-white/10' : 'border-black/10'
              }`} />
              
              {/* Empty State */}
              <motion.div
                className={`absolute inset-0 ${isDark ? 'bg-zinc-800/50' : 'bg-zinc-200/50'} backdrop-blur-sm pointer-events-none`}
                style={{ clipPath: `inset(${brightness}% 0 0 0)` }}
                transition={{ type: "spring", stiffness: 200, damping: 30 }}
              />
              
              {/* Filled State */}
              <motion.div
                className={`absolute inset-0 flex items-center justify-center pointer-events-none ${
                  isDark ? 'bg-white' : 'bg-zinc-900'
                }`}
                style={{ clipPath: `inset(${100 - brightness}% 0 0 0)` }}
                transition={{ type: "spring", stiffness: 200, damping: 30 }}
              >
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 180, 360]
                  }}
                  transition={{ 
                    duration: 8,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                >
                  <Sun 
                    size={40} 
                    className={isDark ? 'text-zinc-900' : 'text-white'}
                    strokeWidth={1.5}
                  />
                </motion.div>
              </motion.div>

              {/* Drag Indicator Line */}
              <motion.div
                className={`absolute left-0 right-0 h-0.5 pointer-events-none ${
                  isDark ? 'bg-white/30' : 'bg-black/30'
                }`}
                style={{ top: `${100 - brightness}%` }}
                animate={{ opacity: isDragging ? 1 : 0 }}
                transition={{ duration: 0.2 }}
              />
            </div>
          </motion.div>

          {/* Slider Section */}
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="flex items-center gap-6 px-4">
              {/* Min Icon */}
              <motion.div 
                className={`p-2 rounded-xl ${isDark ? 'text-zinc-600' : 'text-zinc-400'}`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Sun size={18} strokeWidth={2} />
              </motion.div>

              {/* Slider Track */}
              <div className="flex-1 relative h-3 group">
                {/* Background Track */}
                <div 
                  className={`absolute inset-0 rounded-full transition-all duration-300 ${
                    isDark ? 'bg-white/10' : 'bg-black/10'
                  } group-hover:${isDark ? 'bg-white/15' : 'bg-black/15'}`}
                />
                
                {/* Progress Track */}
                <motion.div
                  className={`absolute left-0 top-0 h-full rounded-full ${
                    isDark ? 'bg-white' : 'bg-zinc-900'
                  }`}
                  style={{ width: `${brightness}%` }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
                
                {/* Input */}
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={brightness}
                  onChange={(e) => setBrightness(Number(e.target.value))}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                
                {/* Thumb */}
                <motion.div
                  className={`absolute top-1/2 -translate-y-1/2 w-8 h-8 rounded-full shadow-xl pointer-events-none ${
                    isDark ? 'bg-white shadow-white/30' : 'bg-zinc-900 shadow-zinc-900/30'
                  }`}
                  style={{ left: `calc(${brightness}% - 16px)` }}
                  whileHover={{ scale: 1.3 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  <div className={`absolute inset-0 rounded-full ${
                    isDark ? 'bg-white/20' : 'bg-black/20'
                  } blur-lg`} />
                </motion.div>
              </div>

              {/* Max Icon */}
              <motion.div 
                className={`p-2 rounded-xl ${isDark ? 'text-white' : 'text-zinc-900'}`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Sun size={28} strokeWidth={2} />
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Text */}
        <motion.p
          className={`absolute bottom-6 text-xs tracking-wider uppercase ${
            isDark ? 'text-zinc-700' : 'text-zinc-400'
          }`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
        >
          Designed with precision
        </motion.p>
      </div>
    </div>
  );
}