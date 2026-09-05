import React, { useState } from 'react';
import { motion } from 'framer-motion';

// Pricing sub-components
const Heading = ({ children, className = '' }) => (
  <h3 className={`font-['Space_Grotesk'] text-2xl font-bold uppercase tracking-wider mb-4 ${className}`}>
    {children}
  </h3>
);

const Paragraph = ({ children, className = '' }) => (
  <p className={`font-['Space_Grotesk'] text-sm opacity-90 leading-relaxed ${className}`}>
    {children}
  </p>
);

const Price = ({ children, className = '' }) => (
  <div className={`font-['Space_Grotesk'] text-5xl font-bold my-6 ${className}`}>
    {children}
  </div>
);

const PricingWrapper = ({ 
  children, 
  contactHref = '/', 
  type = 'crosses', 
  className = '' 
}) => {
  const getCrosses = () => {
    const crosses = [];
    const positions = [
      { x: 20, y: 20 },
      { x: 80, y: 30 },
      { x: 15, y: 70 },
      { x: 85, y: 65 },
      { x: 70, y: 20 },
      { x: 60, y: 75 },
    ];

    for (let i = 0; i < positions.length; i++) {
      const duration = 3 + Math.random() * 3; // Random duration between 3-6s
      const delay = Math.random() * 2; // Random delay 0-2s
      
      crosses.push(
        <motion.div
          key={i}
          className="absolute text-black select-none pointer-events-none"
          style={{
            fontSize: `${Math.random() * 100 + 40}px`,
            left: `${positions[i].x}%`,
            top: `${positions[i].y}%`,
          }}
          initial={{ opacity: 0.3, rotate: 0 }}
          animate={{ 
            opacity: [0.3, 0.5, 0.3],
            rotate: 360,
          }}
          transition={{
            duration: duration,
            repeat: Infinity,
            ease: "linear",
            delay: delay,
            opacity: {
              duration: duration / 2,
              repeat: Infinity,
              ease: "easeInOut",
            }
          }}
        >
          ×
        </motion.div>
      );
    }
    return crosses;
  };

  return (
    <motion.div 
      className={`relative rounded-2xl p-10 text-white overflow-hidden group ${className}`}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.05 }}
    >
      {/* Background pattern */}
      {type === 'crosses' && (
        <div className="absolute inset-0">
          {getCrosses()}
        </div>
      )}
      
      {/* Gradient overlay on hover */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/0 to-white/10"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
        
        {/* Contact button */}
        <motion.a
          href={contactHref}
          className="inline-block mt-8 px-8 py-3 bg-white text-indigo-600 font-semibold rounded-full"
          whileHover={{ scale: 1.05, boxShadow: "0 10px 40px rgba(0,0,0,0.2)" }}
          whileTap={{ scale: 0.95 }}
        >
          Get Started
        </motion.a>
      </div>
    </motion.div>
  );
};

// Main Example Component
export default function Example2() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const lightBg = `
    linear-gradient(0deg, rgba(100,100,100,0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(100,100,100,0.1) 1px, transparent 1px),
    linear-gradient(to bottom right, rgb(248 250 252), rgb(226 232 240))
  `;

  const darkBg = `
    linear-gradient(0deg, rgba(255,255,255,0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px),
    linear-gradient(to bottom right, rgb(15 23 42), rgb(30 41 59))
  `;

  return (
    <>
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap');`}
      </style>
      <div className={`min-h-screen w-full flex items-center justify-center font-['Space_Grotesk'] p-4 relative transition-colors duration-300 ${isDarkMode ? 'bg-slate-900' : 'bg-slate-100'}`}
      style={{
        backgroundImage: isDarkMode ? darkBg : lightBg,
        backgroundSize: '50px 50px, 50px 50px, 100% 100%',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Dark Mode Toggle Button */}
      <motion.button
        onClick={() => setIsDarkMode(!isDarkMode)}
        className={`absolute top-4 right-4 p-3 rounded-full transition-colors ${isDarkMode ? 'bg-slate-800 text-yellow-400 hover:bg-slate-700' : 'bg-white text-slate-700 hover:bg-slate-100'} shadow-lg`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        {isDarkMode ? '☀️' : '🌙'}
      </motion.button>

      <PricingWrapper 
        contactHref="/" 
        type="crosses" 
        className="max-w-md w-full shadow-2xl bg-indigo-500"
      >
        <Heading>website</Heading>
        <Price>
          $5000/mo
        </Price>
        <Paragraph>
          Special Web Site for you made with Next.js, TailwindCSS and FramerMotion.
        </Paragraph>
      </PricingWrapper>
    </div>
    </>
  );
}
