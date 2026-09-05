import React, { useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { motion } from 'framer-motion';

const ModernNav = () => {
  const [isDark, setIsDark] = useState(true);
  const [activeTab, setActiveTab] = useState('Home');

  const tabs = ['Home', 'About', 'Projects', 'Resume'];

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-950' : 'bg-gray-50'} transition-colors duration-300 relative overflow-hidden`}>
      {/* Orthogonal Grid Background */}
      <div className="absolute inset-0 pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
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

      {/* Content Container */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-8">
        <div className="w-full max-w-4xl space-y-8">
          {/* Navigation Bar */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className={`relative ${
              isDark 
                ? 'bg-gray-900/80 border-gray-800' 
                : 'bg-white/80 border-gray-200'
            } backdrop-blur-xl rounded-full px-8 py-4 border shadow-2xl`}
          >
            <div className="flex items-center justify-between">
              {/* Navigation Items */}
              <div className="flex items-center gap-2 relative">
                {tabs.map((tab) => (
                  <motion.button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`relative px-6 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                      activeTab === tab
                        ? isDark
                          ? 'text-white'
                          : 'text-gray-900'
                        : isDark
                        ? 'text-gray-400 hover:text-gray-200'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {activeTab === tab && (
                      <motion.div
                        layoutId="activeTab"
                        className={`absolute inset-0 ${
                          isDark
                            ? 'bg-gradient-to-r from-blue-600 to-purple-600'
                            : 'bg-gradient-to-r from-blue-500 to-purple-500'
                        } rounded-full`}
                        transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <span className="relative z-10">{tab}</span>
                  </motion.button>
                ))}
              </div>

              {/* Theme Toggle */}
              <motion.button
                onClick={() => setIsDark(!isDark)}
                className={`p-3 rounded-full ${
                  isDark
                    ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                } transition-colors duration-200`}
                whileHover={{ scale: 1.1, rotate: 180 }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
              </motion.button>
            </div>
          </motion.div>

          {/* Content Area */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className={`${
              isDark
                ? 'bg-gray-900/60 border-gray-800'
                : 'bg-white/60 border-gray-200'
            } backdrop-blur-xl rounded-3xl p-12 border shadow-2xl`}
          >
            <h1
              className={`text-5xl font-bold mb-4 bg-gradient-to-r ${
                isDark
                  ? 'from-blue-400 to-purple-400'
                  : 'from-blue-600 to-purple-600'
              } bg-clip-text text-transparent`}
            >
              {activeTab}
            </h1>
            <p
              className={`text-lg ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              Welcome to the {activeTab} section. This is a modern, animated navigation
              component with an orthogonal grid background and smooth theme transitions.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ModernNav;