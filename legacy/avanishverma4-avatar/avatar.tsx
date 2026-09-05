import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';

const AvatarComponent = () => {
  const [isDark, setIsDark] = useState(false);

  // Sample avatar data
  const avatars = [
    {
      id: 1,
      name: "John Doe",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face",
      alt: "John Doe"
    },
    {
      id: 2,
      name: "Jane Smith",
      image: "https://plus.unsplash.com/premium_photo-1664392134807-c9c7aca42671?q=80&w=878&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      alt: "Jane Smith"
    },
    {
      id: 3,
      name: "Mike Johnson",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
      alt: "Mike Johnson"
    },
    {
      id: 4,
      name: "Sarah Wilson",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face",
      alt: "Sarah Wilson"
    },
    {
      id: 5,
      name: "David Brown",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face",
      alt: "David Brown"
    }
  ];

  const additionalCount = 3; // +3 additional avatars

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const avatarVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    },
    hover: {
      scale: 1.1,
      y: -2,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    }
  };

  const GridBackground = () => (
    <div className="absolute inset-0 overflow-hidden">
      <svg
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
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
              stroke={isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
    </div>
  );

  return (
    <div className={`w-full min-h-screen transition-colors duration-500 ${
      isDark 
        ? 'bg-gray-900 text-white' 
        : 'bg-gray-50 text-gray-900'
    }`}>
      <GridBackground />
      
      {/* Theme Toggle */}
      <div className="absolute top-6 right-6 z-20">
        <motion.button
          onClick={() => setIsDark(!isDark)}
          className={`p-3 rounded-full transition-colors duration-300 ${
            isDark 
              ? 'bg-gray-800 hover:bg-gray-700 text-yellow-400' 
              : 'bg-white hover:bg-gray-100 text-gray-600 shadow-lg'
          }`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </motion.button>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-8">
        <motion.div
          className={`p-8 rounded-2xl backdrop-blur-sm border transition-all duration-500 ${
            isDark 
              ? 'bg-gray-800/50 border-gray-700 shadow-2xl' 
              : 'bg-white/70 border-gray-200 shadow-2xl'
          }`}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          whileHover={{ y: -5 }}
        >


          {/* Avatar Group */}
          <motion.div 
            className="flex items-center justify-center space-x-2"
            variants={containerVariants}
          >
            {avatars.map((avatar, index) => (
              <motion.div
                key={avatar.id}
                variants={avatarVariants}
                whileHover="hover"
                className={`relative ${
                  index > 0 ? '-ml-3' : ''
                } transition-all duration-200`}
                style={{ zIndex: avatars.length - index }}
              >
                <div className={`w-12 h-12 rounded-full border-3 overflow-hidden transition-all duration-200 ${
                  isDark 
                    ? 'border-gray-700 shadow-lg' 
                    : 'border-white shadow-md'
                }`}>
                  <img
                    src={avatar.image}
                    alt={avatar.alt}
                    className="w-full h-full object-cover"
                  />
                </div>
              </motion.div>
            ))}
            
            {/* Additional Count Badge */}
            <motion.div
              variants={avatarVariants}
              whileHover="hover"
              className={`w-12 h-12 rounded-full border-3 flex items-center justify-center text-sm font-semibold -ml-3 transition-all duration-200 ${
                isDark 
                  ? 'bg-gray-700 border-gray-600 text-gray-300' 
                  : 'bg-gray-100 border-white text-gray-600 shadow-md'
              }`}
              style={{ zIndex: 1 }}
            >
              +{additionalCount}
            </motion.div>
          </motion.div>


        </motion.div>
      </div>


    </div>
  );
};

export default AvatarComponent;