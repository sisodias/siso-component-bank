import React, { useState } from 'react';
import { Moon, Sun, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

const NetflixProfileSelector = () => {
  const [isDark, setIsDark] = useState(true);

  const profiles = [
    {
      name: 'Awanish',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop',
      color: 'from-gray-400 to-gray-500'
    },
    {
      name: 'Ankit',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop',
      color: 'from-pink-300 to-pink-400'
    },
    {
      name: 'Kids',
      image: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=300&h=300&fit=crop',
      color: 'from-amber-600 to-amber-700'
    }
  ];

  return (
    <div className={`w-full min-h-screen transition-colors duration-300 ${isDark ? 'bg-black' : 'bg-white'}`}>
      {/* Orthogonal Grid Background */}
      <div className="fixed inset-0 pointer-events-none">
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

      {/* Theme Toggle */}
      <motion.button
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        onClick={() => setIsDark(!isDark)}
        className={`fixed top-6 right-6 z-50 p-3 rounded-full ${
          isDark ? 'bg-white/10 hover:bg-white/20' : 'bg-black/10 hover:bg-black/20'
        } backdrop-blur-sm transition-colors`}
      >
        {isDark ? (
          <Sun className="w-5 h-5 text-yellow-400" />
        ) : (
          <Moon className="w-5 h-5 text-slate-700" />
        )}
      </motion.button>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-6">
        <div className="text-center">
          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`text-5xl md:text-6xl font-medium mb-16 ${
              isDark ? 'text-white' : 'text-black'
            }`}
          >
            Who's watching?
          </motion.h1>

          {/* Profile Grid */}
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8 max-w-4xl mx-auto">
            {profiles.map((profile, index) => (
              <motion.div
                key={profile.name}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="flex flex-col items-center gap-4 cursor-pointer group"
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative"
                >
                  <div className={`w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 transition-all duration-300 ${
                    isDark 
                      ? 'border-transparent group-hover:border-white' 
                      : 'border-transparent group-hover:border-black'
                  }`}>
                    <div className={`w-full h-full bg-gradient-to-br ${profile.color} flex items-center justify-center text-white text-4xl font-bold`}>
                      {profile.name.charAt(0)}
                    </div>
                  </div>
                </motion.div>
                <span className={`text-lg md:text-xl font-medium transition-colors ${
                  isDark 
                    ? 'text-gray-400 group-hover:text-white' 
                    : 'text-gray-600 group-hover:text-black'
                }`}>
                  {profile.name}
                </span>
              </motion.div>
            ))}

            {/* Add Profile Button */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col items-center gap-4 cursor-pointer group"
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="relative"
              >
                <div className={`w-32 h-32 md:w-40 md:h-40 rounded-full border-4 transition-all duration-300 flex items-center justify-center ${
                  isDark 
                    ? 'bg-white/10 border-transparent group-hover:bg-white/20 group-hover:border-white' 
                    : 'bg-black/10 border-transparent group-hover:bg-black/20 group-hover:border-black'
                }`}>
                  <Plus className={`w-12 h-12 transition-colors ${
                    isDark ? 'text-gray-500 group-hover:text-white' : 'text-gray-400 group-hover:text-black'
                  }`} />
                </div>
              </motion.div>
              <span className={`text-lg md:text-xl font-medium transition-colors ${
                isDark 
                  ? 'text-gray-400 group-hover:text-white' 
                  : 'text-gray-600 group-hover:text-black'
              }`}>
                Add
              </span>
            </motion.div>
          </div>

          {/* Manage Profiles Button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className={`mt-16 px-8 py-3 text-lg font-medium border-2 transition-all duration-300 ${
              isDark
                ? 'text-gray-400 border-gray-600 hover:text-white hover:border-white'
                : 'text-gray-600 border-gray-300 hover:text-black hover:border-black'
            }`}
          >
            Manage Profiles
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default NetflixProfileSelector;
