import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check } from 'lucide-react';

/**
 * OrthogonalGrid Component
 * Creates an animated background grid pattern with orthogonal lines
 * @param {string} className - Additional CSS classes
 */
const OrthogonalGrid = ({ className = '' }) => {
  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {/* Vertical lines */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={`v-${i}`}
            className="absolute top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-yellow-500/15 to-transparent"
            style={{ left: `${(i / 20) * 100}%` }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.1,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
      
      {/* Horizontal lines */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={`h-${i}`}
            className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-yellow-500/15 to-transparent"
            style={{ top: `${(i / 20) * 100}%` }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.1,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 via-transparent to-yellow-600/5" />
    </div>
  );
};

/**
 * CopyButton Component
 * Interactive button with copy-to-clipboard functionality
 * Features smooth animations and visual feedback
 * 
 * @param {string} textToCopy - The text content to copy to clipboard
 * @param {string} className - Additional CSS classes
 */
const CopyButton = ({ textToCopy, className = '' }) => {
  const [isCopied, setIsCopied] = useState(false);

  /**
   * Handles the copy operation
   * Copies text to clipboard and triggers success animation
   */
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setIsCopied(true);
      
      // Reset copied state after 2 seconds
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <motion.button
      onClick={handleCopy}
      className={`relative group px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black rounded-sm font-medium shadow-lg overflow-hidden ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      {/* Shimmer effect on hover */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        initial={{ x: '-100%' }}
        whileHover={{ x: '100%' }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      />

      {/* Button content with icon transition */}
      <span className="relative flex items-center gap-2">
        <AnimatePresence mode="wait">
          {isCopied ? (
            <motion.span
              key="check"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Check className="w-5 h-5" />
            </motion.span>
          ) : (
            <motion.span
              key="copy"
              initial={{ scale: 0, rotate: 180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: -180 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Copy className="w-5 h-5" />
            </motion.span>
          )}
        </AnimatePresence>
        
        <AnimatePresence mode="wait">
          <motion.span
            key={isCopied ? 'copied' : 'copy'}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {isCopied ? 'Copied!' : 'Copy to Clipboard'}
          </motion.span>
        </AnimatePresence>
      </span>

      {/* Ripple effect on click */}
      <AnimatePresence>
        {isCopied && (
          <motion.div
            className="absolute inset-0 bg-white/30 rounded-sm"
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 2, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          />
        )}
      </AnimatePresence>
    </motion.button>
  );
};

/**
 * CopyToClipboard Main Component
 * Complete copy-to-clipboard interface with animated background
 * Showcases the text content and copy functionality
 */
const CopyToClipboard = () => {
  // User's custom text - edit this to change what gets copied
  const [userText, setUserText] = useState("Hello! This is a beautiful copy-to-clipboard component built with React, Framer Motion, and Tailwind CSS. 🚀");

  return (
    <div className="relative min-h-screen w-full bg-black flex items-center justify-center p-8 overflow-hidden">
      {/* Animated orthogonal grid background */}
      <OrthogonalGrid />

      {/* Main content card */}
      <motion.div
        className="relative z-10 max-w-2xl w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Content card with glassmorphism effect */}
        <div className="bg-white/10 backdrop-blur-xl rounded-sm shadow-2xl border border-white/20 p-8 space-y-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold text-white mb-2">
              Copy to Clipboard
            </h1>
            <p className="text-slate-300">
              Click the button below to copy the text to your clipboard
            </p>
          </motion.div>

          {/* Text display area */}
          <motion.div
            className="bg-slate-800/50 rounded-sm p-6 border border-slate-700/50"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <textarea
              value={userText}
              onChange={(e) => setUserText(e.target.value)}
              className="w-full bg-transparent text-slate-200 leading-relaxed font-mono text-sm border-none outline-none resize-none min-h-[100px] placeholder-slate-500"
              placeholder="Enter your text here to copy..."
            />
          </motion.div>

          {/* Copy button */}
          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <CopyButton textToCopy={userText} />
          </motion.div>

          {/* Additional info */}
          <motion.div
            className="text-center text-slate-400 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            Built with React, Framer Motion & Tailwind CSS
          </motion.div>
        </div>
      </motion.div>

      {/* Floating particles for extra visual appeal */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-yellow-400/20 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: i * 0.5,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

export default CopyToClipboard;