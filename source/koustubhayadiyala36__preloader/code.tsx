import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Components ---

/**
 * The geometric 'F' Logo component.
 * We pass a color prop so we can render the "background" (dim) version
 * and the "foreground" (lit) version.
 */
const GeometricLogo = ({ color = "white", className = "" }) => (
  <svg 
    viewBox="0 0 100 100" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    style={{ width: '120px', height: '120px' }} // Fixed size for consistency
  >
    {/* This shape mimics the geometric 'F' or abstract symbol from the video */}
    <path 
      d="M20 20 H50 L80 50 L50 50 L20 80 V20 Z" 
      fill={color} 
    />
    <path 
      d="M55 20 H85 L85 50 L55 20 Z" 
      fill={color} 
      fillOpacity="0.9"
    />
  </svg>
);

/**
 * The Preloader Component.
 * It handles the overlay and the logo reveal animation.
 */
const Preloader = ({ onComplete }) => {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#050505]"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
      onAnimationComplete={() => {
        // Optional: Trigger logic after exit is done
      }}
    >
      <div className="relative">
        {/* 1. The Background (Dim/Dark Grey) Logo */}
        <GeometricLogo color="#333333" />

        {/* 2. The Foreground (White) Logo with Reveal Animation */}
        <motion.div
          className="absolute inset-0 overflow-hidden"
          initial={{ clipPath: "inset(100% 0 0 0)" }} // Start completely clipped from bottom
          animate={{ 
            clipPath: "inset(0% 0 0 0)", // Reveal to full
            transition: { 
              duration: 1.5, 
              ease: [0.77, 0, 0.175, 1], // Custom cubic-bezier for that sharp "rise" feel
              delay: 0.5 
            } 
          }}
          onAnimationComplete={() => {
            // Wait a moment after logo fills, then trigger the exit of the whole screen
            setTimeout(onComplete, 800);
          }}
        >
          <GeometricLogo color="#ffffff" />
        </motion.div>
      </div>
    </motion.div>
  );
};

/**
 * Main Application Component
 */
export function Component() {
  const [loading, setLoading] = useState(true);

  // Restart animation handler for demo purposes
  const handleReplay = () => {
    setLoading(true);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-white selection:text-black">
      
      {/* Preloader Overlay */}
      <AnimatePresence mode="wait">
        {loading && (
          <Preloader key="preloader" onComplete={() => setLoading(false)} />
        )}
      </AnimatePresence>

      {/* Main Content (Revealed after preloader) */}
      <main className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: loading ? 0 : 1, y: loading ? 20 : 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="max-w-lg"
        >
          <h1 className="text-5xl md:text-7xl font-bold italic tracking-tighter mb-6">
            LOGO PRELOADER
          </h1>
          
          <p className="text-gray-400 text-lg md:text-xl leading-relaxed mb-12">
            This component reveals your brand's logo with a clean entrance animation, 
            holds momentarily, and fades out.
          </p>

          <button 
            onClick={handleReplay}
            className="px-6 py-3 rounded-full border border-gray-700 hover:bg-white hover:text-black hover:border-white transition-all duration-300 text-sm font-medium tracking-wide uppercase"
          >
            Replay Animation
          </button>
        </motion.div>

      </main>

      {/* Global styles for the custom font feel */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');
        
        body {
          font-family: 'Inter', sans-serif;
        }
      `}} />
    </div>
  );
}