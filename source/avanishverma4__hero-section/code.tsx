import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Moon, Sun, Sparkles, ArrowRight } from 'lucide-react';

const HeroSection = () => {
  const [isDark, setIsDark] = useState(true);

  const toggleTheme = () => setIsDark(!isDark);

  return (
    <div className={`w-full min-h-screen relative overflow-hidden transition-colors duration-500 ${
      isDark ? 'bg-gray-950' : 'bg-gray-50'
    }`}>
      {/* Orthogonal Grid Background */}
      <div className="absolute inset-0 overflow-hidden">
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="grid"
              width="60"
              height="60"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 60 0 L 0 0 0 60"
                fill="none"
                stroke={isDark ? 'rgba(59, 130, 246, 0.15)' : 'rgba(59, 130, 246, 0.1)'}
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
        
        {/* Gradient Overlay */}
        <div className={`absolute inset-0 ${
          isDark 
            ? 'bg-gradient-to-b from-transparent via-gray-950/50 to-gray-950'
            : 'bg-gradient-to-b from-transparent via-gray-50/50 to-gray-50'
        }`} />
      </div>

      {/* Theme Toggle */}
      <motion.button
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        onClick={toggleTheme}
        className={`absolute top-8 right-8 z-20 p-3 rounded-full transition-all duration-300 ${
          isDark 
            ? 'bg-gray-800 hover:bg-gray-700 text-yellow-400' 
            : 'bg-white hover:bg-gray-100 text-gray-900 shadow-lg'
        }`}
      >
        {isDark ? <Sun size={20} /> : <Moon size={20} />}
      </motion.button>

      {/* Hero Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center">
        {/* Announcement Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 ${
            isDark 
              ? 'bg-gray-800/50 border border-gray-700 backdrop-blur-sm' 
              : 'bg-white/80 border border-gray-200 backdrop-blur-sm shadow-lg'
          }`}
        >
          <Sparkles size={16} className="text-blue-600" />
          <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            Exciting announcement 🎉
          </span>
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className={`text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}
        >
          A landing page template
          <br />
          <span className="bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent">
            that works for you
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className={`text-lg md:text-xl max-w-3xl mb-12 ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}
        >
          Build beautiful landing pages for your startups, clients, and side projects,
          <br />
          without having to think about design.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <motion.button
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 20px 40px rgba(37, 99, 235, 0.4)"
            }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-lg shadow-blue-500/30"
          >
            Try it free
            <motion.span
              initial={{ x: 0 }}
              whileHover={{ x: 5 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <ArrowRight size={18} />
            </motion.span>
          </motion.button>
          
          <motion.button
            whileHover={{ 
              scale: 1.02,
              y: -2,
              transition: { duration: 0.2 }
            }}
            whileTap={{ scale: 0.98 }}
            className={`px-8 py-4 font-medium rounded-lg transition-all ${
              isDark 
                ? 'bg-gray-800/50 hover:bg-gray-800 text-white border border-gray-700' 
                : 'bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 shadow-md'
            }`}
          >
            Learn more
          </motion.button>
        </motion.div>

        {/* Floating Elements */}
        <motion.div
          animate={{ 
            y: [0, -20, 0],
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ 
            y: [0, 20, 0],
          }}
          transition={{ 
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
          className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl"
        />
      </div>
    </div>
  );
};

export default HeroSection;