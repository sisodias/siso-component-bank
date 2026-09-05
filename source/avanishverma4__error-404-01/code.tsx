import React from 'react';
import { motion } from 'framer-motion';
import { Home, Compass } from 'lucide-react';

const Error404 = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100
      }
    }
  };

  const numberVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 200,
        damping: 15
      }
    }
  };

  return (
    <div className="w-full min-h-screen relative overflow-hidden transition-colors duration-500 bg-black">
      {/* Orthogonal Grid Background */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path
                d="M 60 0 L 0 0 0 60"
                fill="none"
                stroke="#ffffff"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Animated gradient orbs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl bg-white/5"
        animate={{
          x: [0, 50, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl bg-white/5"
        animate={{
          x: [0, -50, 0],
          y: [0, -30, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center"
        >
          {/* 404 Number */}
          <motion.div
            variants={numberVariants}
            className="relative mb-8"
          >
            <h1
              className="font-black leading-none tracking-tighter text-white"
              style={{
                fontSize: '96px',
                fontFamily: 'system-ui, -apple-system, sans-serif',
                fontWeight: 900,
                WebkitTextStroke: '2px rgba(255,255,255,0.1)',
                textShadow: '0 0 100px rgba(255,255,255,0.2), 0 10px 40px rgba(255,255,255,0.1)'
              }}
            >
              404
            </h1>
            <motion.div
              className="absolute inset-0 font-black leading-none tracking-tighter text-white"
              style={{
                fontSize: '96px',
                fontFamily: 'system-ui, -apple-system, sans-serif',
                fontWeight: 900,
                opacity: 0.08
              }}
              animate={{
                x: [0, 6, 0],
                y: [0, 6, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              404
            </motion.div>
          </motion.div>

          {/* Message */}
          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl mb-1 font-light tracking-wide text-white/70"
          >
            The page you're looking for might have been
          </motion.p>
          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl mb-12 font-light tracking-wide text-white/70"
          >
            moved or doesn't exist.
          </motion.p>

          {/* Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 h-11 rounded-lg px-8 font-medium transition-all duration-300 bg-white text-black hover:bg-neutral-300 cursor-pointer"
            >
              <Home className="w-5 h-5" />
              Go Home
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 h-11 rounded-lg px-8 font-medium transition-all duration-300 border border-white/20 bg-black text-white hover:bg-neutral-600 hover:border-neutral-600 cursor-pointer"
            >
              <Compass className="w-5 h-5" />
              Explore
            </motion.button>
          </motion.div>
        </motion.div>
      </div>

      {/* Decorative Lines */}
      <motion.div
        className="absolute left-0 top-1/2 h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.5, delay: 0.5 }}
      />
    </div>
  );
};

export default Error404;
