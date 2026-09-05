import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Users, Moon, Sun } from 'lucide-react';

const TeamInvitationComponent = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isVisible, setIsVisible] = useState(true);
  const [isAccepted, setIsAccepted] = useState(false);

  const handleAccept = () => {
    setIsAccepted(true);
    setTimeout(() => setIsVisible(false), 1500);
  };

  const handleDecline = () => {
    setIsVisible(false);
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const gridVariants = {
    animate: {
      opacity: [0.3, 0.6, 0.3],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.9
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    },
    exit: { 
      opacity: 0, 
      x: 300,
      scale: 0.8,
      transition: {
        duration: 0.3
      }
    }
  };

  const acceptedVariants = {
    hidden: { scale: 0 },
    visible: { 
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    }
  };

  return (
    <div className={`w-full min-h-screen relative overflow-hidden transition-colors duration-500 ${
      isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      {/* Orthogonal Grid Background */}
      <motion.div 
        variants={gridVariants}
        animate="animate"
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(${isDarkMode ? 'rgba(59, 130, 246, 0.4)' : 'rgba(59, 130, 246, 0.25)'} 2px, transparent 2px),
            linear-gradient(90deg, ${isDarkMode ? 'rgba(59, 130, 246, 0.4)' : 'rgba(59, 130, 246, 0.25)'} 2px, transparent 2px)
          `,
          backgroundSize: '60px 60px'
        }}
      />
      
      {/* Gradient Overlay */}
      <div className={`absolute inset-0 ${
        isDarkMode 
          ? 'bg-gradient-to-br from-gray-900 via-gray-900/90 to-blue-900/20' 
          : 'bg-gradient-to-br from-gray-50 via-gray-50/90 to-blue-50/50'
      }`} />

      {/* Theme Toggle */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleTheme}
        className={`fixed top-6 right-6 z-20 p-3 rounded-full shadow-lg transition-colors duration-300 ${
          isDarkMode 
            ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700' 
            : 'bg-white text-gray-600 hover:bg-gray-100'
        }`}
      >
        {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
      </motion.button>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <AnimatePresence>
          {isVisible && (
            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className={`relative w-full max-w-sm sm:max-w-md mx-auto rounded-2xl shadow-2xl backdrop-blur-sm border transition-colors duration-300 ${
                isDarkMode 
                  ? 'bg-gray-800/80 border-gray-700' 
                  : 'bg-white/90 border-gray-200'
              }`}
            >
              {/* Success Overlay */}
              <AnimatePresence>
                {isAccepted && (
                  <motion.div
                    variants={acceptedVariants}
                    initial="hidden"
                    animate="visible"
                    className="absolute inset-0 bg-green-500/90 rounded-2xl flex items-center justify-center z-20"
                  >
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                      className="text-white"
                    >
                      <Check size={48} />
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="p-4 sm:p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3 min-w-0 flex-1">
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                      className="relative flex-shrink-0"
                    >
                      <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center transition-colors duration-300 ${
                        isDarkMode 
                          ? 'bg-blue-600/20 text-blue-400' 
                          : 'bg-blue-100 text-blue-600'
                      }`}>
                        <Users size={20} className="sm:w-6 sm:h-6" />
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full border-2 border-current" />
                    </motion.div>
                    <div className="min-w-0 flex-1">
                      <h3 className={`font-semibold text-base sm:text-lg transition-colors duration-300 truncate ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        Team Invitation
                      </h3>
                      <p className={`text-xs sm:text-sm transition-colors duration-300 ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        Invited 5 minutes ago
                      </p>
                    </div>
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleDecline}
                    className={`p-1 rounded-full transition-colors duration-300 flex-shrink-0 ml-2 ${
                      isDarkMode 
                        ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-700' 
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <X size={18} className="sm:w-5 sm:h-5" />
                  </motion.button>
                </div>

                {/* Content */}
                <div className="mb-4 sm:mb-6">
                  <p className={`text-sm sm:text-base transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    <span className="font-medium">Awanish Verma</span> invited you to join{' '}
                    <span className={`font-semibold transition-colors duration-300 ${
                      isDarkMode ? 'text-blue-400' : 'text-blue-600'
                    }`}>
                      Design Team
                    </span>
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleDecline}
                    className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-300 ${
                      isDarkMode 
                        ? 'bg-red-900/30 text-red-300 hover:bg-red-900/50 hover:text-red-200 border border-red-700/30' 
                        : 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
                    }`}
                  >
                    Decline
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleAccept}
                    className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl ${
                      isDarkMode
                        ? 'bg-green-600 text-white hover:bg-green-700'
                        : 'bg-green-500 text-white hover:bg-green-600'
                    }`}
                  >
                    Accept
                  </motion.button>
                </div>
              </div>

              {/* Subtle glow effect */}
              <div className={`absolute -inset-1 rounded-2xl opacity-20 blur transition-opacity duration-300 ${
                isDarkMode ? 'bg-blue-500/20' : 'bg-blue-500/10'
              }`} style={{ zIndex: -1 }} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Demo Reset Button */}
        {!isVisible && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => {
              setIsVisible(true);
              setIsAccepted(false);
            }}
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
              isDarkMode 
                ? 'bg-gray-800 text-white hover:bg-gray-700 border border-gray-700' 
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            Show Invitation Again
          </motion.button>
        )}
      </div>
    </div>
  );
};

export default TeamInvitationComponent;
