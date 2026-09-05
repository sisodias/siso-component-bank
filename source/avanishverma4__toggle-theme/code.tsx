import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';

const ModernToggle = () => {
  const [isDark, setIsDark] = useState(true);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  return (
    <div className={`min-h-screen w-full transition-colors duration-500 ${
      isDark ? 'bg-gray-950' : 'bg-gray-50'
    } relative overflow-hidden flex items-center justify-center`}>
      
      {/* Orthogonal Grid Background */}
      <div className="absolute inset-0 pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="grid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke={isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 flex flex-col items-center gap-8">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h1 className={`text-4xl font-bold mb-2 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Theme Toggle
          </h1>
          <p className={`text-sm ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Modern UI Component with Framer Motion
          </p>
        </motion.div>

        {/* Toggle Component */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative"
        >
          {/* Toggle Container */}
          <motion.button
            onClick={toggleTheme}
            className={`relative w-20 h-10 rounded-full p-1 cursor-pointer transition-colors duration-500 ${
              isDark
                ? 'bg-gray-800 shadow-lg shadow-gray-900/50'
                : 'bg-white shadow-lg shadow-gray-300/50'
            } border ${
              isDark ? 'border-gray-700' : 'border-gray-200'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Animated Toggle Ball */}
            <motion.div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                isDark
                  ? 'bg-gradient-to-br from-indigo-500 to-purple-600'
                  : 'bg-gradient-to-br from-amber-400 to-orange-500'
              } shadow-lg`}
              layout
              animate={{
                x: isDark ? 0 : 40,
              }}
              transition={{
                type: 'spring',
                stiffness: 500,
                damping: 30,
              }}
            >
              <motion.div
                initial={false}
                animate={{ rotate: isDark ? 0 : 180 }}
                transition={{ duration: 0.5 }}
              >
                {isDark ? (
                  <Moon className="w-4 h-4 text-white" />
                ) : (
                  <Sun className="w-4 h-4 text-white" />
                )}
              </motion.div>
            </motion.div>
          </motion.button>

          {/* Glow Effect */}
          <motion.div
            className={`absolute inset-0 rounded-full blur-xl -z-10 ${
              isDark
                ? 'bg-gradient-to-br from-indigo-500/20 to-purple-600/20'
                : 'bg-gradient-to-br from-amber-400/20 to-orange-500/20'
            }`}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </motion.div>

        {/* Current Theme Display */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8"
        >
          <div className={`px-6 py-3 rounded-xl border backdrop-blur-sm flex items-center gap-3 ${
            isDark
              ? 'bg-gray-900/50 border-gray-800 text-white'
              : 'bg-white/50 border-gray-200 text-gray-900'
          }`}>
            <p className={`text-xs font-medium ${
              isDark ? 'text-gray-400' : 'text-gray-500'
            }`}>
              Current Theme:
            </p>
            <p className="text-sm font-bold">
              {isDark ? 'Dark Mode' : 'Light Mode'}
            </p>
          </div>
        </motion.div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className={`text-center text-xs mt-4 ${
            isDark ? 'text-gray-500' : 'text-gray-400'
          }`}
        >
          <p>Click the toggle to switch themes</p>
        </motion.div>
      </div>

      {/* Floating Particles */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className={`absolute w-1 h-1 rounded-full ${
            isDark ? 'bg-gray-700' : 'bg-gray-300'
          }`}
          style={{
            left: `${20 + i * 15}%`,
            top: `${30 + i * 10}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 3 + i,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.2,
          }}
        />
      ))}
    </div>
  );
};

export default ModernToggle;