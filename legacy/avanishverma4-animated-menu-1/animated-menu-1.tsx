import React, { useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { Menu, X, Home, User, Briefcase, Mail, Sun, Moon, ChevronLeft } from 'lucide-react';

export default function AnimatedMenuComponent() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const dragX = useMotionValue(0);
  const dragOpacity = useTransform(dragX, [-200, 0], [0, 1]);

  const menuItems = [
    { icon: Home, label: 'Home', href: '#home' },
    { icon: User, label: 'About', href: '#about' },
    { icon: Briefcase, label: 'Services', href: '#services' },
    { icon: Mail, label: 'Contact', href: '#contact' },
  ];

  const handleDragEnd = (event, info) => {
    if (info.offset.x < -100) {
      setIsOpen(false);
    }
    dragX.set(0);
  };

  const menuVariants = {
    closed: {
      x: '-100%',
      transition: {
        type: 'spring',
        stiffness: 200,
        damping: 30,
        mass: 0.8,
      },
    },
    open: {
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 200,
        damping: 30,
        mass: 0.8,
      },
    },
  };

  const itemVariants = {
    closed: { x: -50, opacity: 0 },
    open: (i) => ({
      x: 0,
      opacity: 1,
      transition: {
        delay: 0.1 + i * 0.08,
        type: 'spring',
        stiffness: 250,
        damping: 25,
      },
    }),
  };

  const overlayVariants = {
    closed: { 
      opacity: 0,
      transition: {
        duration: 0.3,
      },
    },
    open: { 
      opacity: 1,
      transition: {
        duration: 0.4,
      },
    },
  };

  return (
    <div className={`w-full min-h-screen transition-colors duration-300 ${
      isDark ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      {/* Orthogonal Grid Background */}
      <div className="fixed inset-0 pointer-events-none">
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

      {/* Header */}
      <header className="relative z-20 px-6 py-4 flex items-center justify-between">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className={`p-2 rounded-lg transition-colors ${
            isDark
              ? 'bg-gray-800 text-white hover:bg-gray-700'
              : 'bg-white text-gray-900 hover:bg-gray-100'
          } shadow-lg`}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </motion.button>

        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`text-2xl font-bold ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}
        >
          Menu Demo
        </motion.h1>

        <motion.button
          whileHover={{ scale: 1.1, rotate: 180 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsDark(!isDark)}
          className={`p-2 rounded-lg transition-colors ${
            isDark
              ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700'
              : 'bg-white text-gray-900 hover:bg-gray-100'
          } shadow-lg`}
        >
          {isDark ? <Sun size={24} /> : <Moon size={24} />}
        </motion.button>
      </header>

      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={overlayVariants}
            initial="closed"
            animate="open"
            exit="closed"
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black bg-opacity-50 z-30"
          />
        )}
      </AnimatePresence>

      {/* Side Menu */}
      <motion.nav
        variants={menuVariants}
        initial="closed"
        animate={isOpen ? 'open' : 'closed'}
        drag="x"
        dragConstraints={{ left: -320, right: 0 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
        style={{ x: dragX }}
        className={`fixed top-0 left-0 h-full w-80 z-40 shadow-2xl ${
          isDark ? 'bg-gray-800' : 'bg-white'
        }`}
      >
        {/* Close Button */}
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(false)}
          className={`absolute top-6 right-6 p-2 rounded-full transition-colors ${
            isDark
              ? 'bg-gray-700 text-white hover:bg-gray-600'
              : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
          }`}
        >
          <X size={24} />
        </motion.button>

        {/* Drag Indicator */}
        <motion.div
          style={{ opacity: dragOpacity }}
          className="absolute top-1/2 right-4 -translate-y-1/2 pointer-events-none"
        >
          <ChevronLeft 
            size={32} 
            className={`${isDark ? 'text-gray-600' : 'text-gray-400'}`}
          />
        </motion.div>

        <div className="p-8 pt-20">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, type: 'spring', stiffness: 200 }}
            className="mb-12"
          >
            <h2
              className={`text-3xl font-bold ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}
            >
              Navigation
            </h2>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: 80 }}
              transition={{ delay: 0.3, duration: 0.6, ease: 'easeOut' }}
              className={`h-1 mt-2 rounded ${
                isDark ? 'bg-blue-500' : 'bg-blue-600'
              }`}
            />
          </motion.div>

          <ul className="space-y-4">
            {menuItems.map((item, i) => (
              <motion.li
                key={item.label}
                custom={i}
                variants={itemVariants}
                initial="closed"
                animate={isOpen ? 'open' : 'closed'}
              >
                <a
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center space-x-4 p-4 rounded-lg transition-all ${
                    isDark
                      ? 'hover:bg-gray-700 text-gray-200'
                      : 'hover:bg-gray-100 text-gray-800'
                  } group`}
                >
                  <motion.div
                    whileHover={{ scale: 1.15, rotate: 8 }}
                    whileTap={{ scale: 0.95 }}
                    className={`p-2 rounded-lg ${
                      isDark ? 'bg-gray-700' : 'bg-gray-200'
                    } group-hover:bg-blue-500 group-hover:text-white transition-all duration-300`}
                  >
                    <item.icon size={24} />
                  </motion.div>
                  <span className="text-lg font-medium">{item.label}</span>
                </a>
              </motion.li>
            ))}
          </ul>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className={`absolute bottom-8 left-8 right-8 p-4 rounded-lg ${
              isDark ? 'bg-gray-700' : 'bg-gray-100'
            }`}
          >
            <p
              className={`text-sm ${
                isDark ? 'text-gray-300' : 'text-gray-600'
              }`}
            >
              💡 Drag left to close
            </p>
          </motion.div>
        </div>
      </motion.nav>

      {/* Main Content */}
      <main className="relative z-10 px-6 py-12 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className={`p-8 rounded-2xl shadow-xl ${
            isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
          }`}
        >
          <h2 className="text-3xl font-bold mb-4">
            Welcome to the Animated Menu
          </h2>
          <p className={`text-lg mb-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Click the menu button in the top-left corner to open the animated
            navigation menu. Toggle between light and dark modes using the theme
            button in the top-right corner.
          </p>
          <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            The background features an orthogonal grid pattern that adapts to the
            current theme. You can also drag the menu left to close it!
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className={`mt-8 p-8 rounded-2xl shadow-xl ${
            isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
          }`}
        >
          <h3 className="text-2xl font-bold mb-4">Features</h3>
          <ul className={`space-y-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            <li>• Cinematic spring-based animations</li>
            <li>• Drag to close functionality</li>
            <li>• Staggered menu item animations</li>
            <li>• Close button with rotating animation</li>
            <li>• Responsive design for all screen sizes</li>
            <li>• Light and dark mode support</li>
            <li>• Orthogonal grid background</li>
            <li>• Interactive hover effects</li>
          </ul>
        </motion.div>
      </main>
    </div>
  );
}