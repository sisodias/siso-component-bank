import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, MotionConfig } from 'framer-motion';
import { ChevronDown, Shirt, Briefcase, Smartphone, Home, Layers, Sparkles } from 'lucide-react';

/**
 * Utility function to merge CSS class names
 * Filters out falsy values and joins the remaining classes
 * @param {...(string|boolean|undefined)} classes - Class names to merge
 * @returns {string} Merged class names
 */
function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

/**
 * Custom hook to detect clicks outside a referenced element
 * Useful for closing dropdowns, modals, and other overlay components
 * @param {React.RefObject} ref - Reference to the element to monitor
 * @param {Function} handler - Callback function to execute when clicking outside
 */
function useClickAway(ref, handler) {
  useEffect(() => {
    const listener = (event) => {
      // Do nothing if clicking ref's element or descendent elements
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      handler(event);
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
}

/**
 * Category data structure
 * Each category has an id, label, icon component, and color theme
 */
const categories = [
  { id: 'all', label: 'All Categories', icon: Layers, color: '#A06CD5' },
  { id: 'lifestyle', label: 'Lifestyle', icon: Shirt, color: '#FF6B6B' },
  { id: 'desk', label: 'Desk Setup', icon: Briefcase, color: '#4ECDC4' },
  { id: 'tech', label: 'Technology', icon: Smartphone, color: '#45B7D1' },
  { id: 'home', label: 'Home & Living', icon: Home, color: '#F9C74F' },
];

/**
 * Animated icon wrapper component
 * Provides scaling, rotation, and glow effects on hover
 * @param {Object} props
 * @param {React.ElementType} props.icon - Lucide icon component
 * @param {boolean} props.isHovered - Whether the icon is currently hovered
 * @param {string} props.color - Hex color for the icon and glow effect
 */
const IconWrapper = ({ icon: Icon, isHovered, color }) => (
  <motion.div 
    className="w-5 h-5 mr-3 relative flex items-center justify-center" 
    initial={false} 
    animate={isHovered ? { scale: 1.15, rotate: 5 } : { scale: 1, rotate: 0 }}
    transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
  >
    <Icon className="w-5 h-5" style={{ color }} strokeWidth={2} />
    {/* Glow effect that appears on hover */}
    {isHovered && (
      <motion.div
        className="absolute inset-0 blur-md"
        style={{ backgroundColor: color, opacity: 0.3 }}
        initial={{ scale: 0 }}
        animate={{ scale: 1.5 }}
        transition={{ duration: 0.3 }}
      />
    )}
  </motion.div>
);

/**
 * Framer Motion animation variants for the dropdown container
 * Implements staggered children animation for a cascading effect
 */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: 'beforeChildren',
      staggerChildren: 0.08, // 80ms delay between each child animation
    },
  },
};

/**
 * Framer Motion animation variants for individual dropdown items
 * Items slide in from the left with a fade effect
 */
const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.1, 0.25, 1], // Custom easing curve for smooth motion
    },
  },
};

/**
 * Premium Fluid Dropdown Component
 * 
 * A luxurious dropdown menu with:
 * - Smooth spring-based animations
 * - Animated hover highlights that slide between items
 * - Icon glow effects on hover
 * - Orthogonal grid background with ambient lighting
 * - Click-away and keyboard (Escape) support
 * 
 * @component
 */
export default function Component() {
  // State management
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useClickAway(dropdownRef, () => setIsOpen(false));

  /**
   * Handle keyboard events
   * Closes dropdown when Escape key is pressed
   */
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <MotionConfig reducedMotion="user">
      {/* Main container with black background and grid overlay */}
      <div className="min-h-screen w-full bg-black flex items-start justify-center pt-24 p-8 relative overflow-hidden">
        
        {/* Orthogonal Grid Background */}
        <div className="absolute inset-0 opacity-20">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              {/* Grid pattern - 60px squares */}
              <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(148, 163, 184, 0.3)" strokeWidth="1"/>
              </pattern>
              {/* Gradient overlay for visual depth */}
              <linearGradient id="gridGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#A06CD5" stopOpacity="0.1"/>
                <stop offset="50%" stopColor="#4ECDC4" stopOpacity="0.1"/>
                <stop offset="100%" stopColor="#FF6B6B" stopOpacity="0.1"/>
              </linearGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
            <rect width="100%" height="100%" fill="url(#gridGradient)" />
          </svg>
        </div>

        {/* Ambient Glow Effects - Pulsing orbs for atmospheric lighting */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

        {/* Main Dropdown Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md relative z-10"
          ref={dropdownRef}
        >
          {/* Title Section */}
          <motion.div 
            className="mb-6 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-200 via-slate-100 to-slate-300 bg-clip-text text-transparent mb-2">
              Select Collection
            </h2>
            <p className="text-slate-400 text-sm">Choose from our curated categories</p>
          </motion.div>

          {/* Dropdown Trigger Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={cn(
              'w-full justify-between bg-gradient-to-br from-slate-900/90 to-slate-800/90 text-slate-300',
              'hover:from-slate-800/90 hover:to-slate-700/90 hover:text-slate-100',
              'border-2 border-slate-700/50 hover:border-slate-600/50',
              'backdrop-blur-xl shadow-2xl hover:shadow-purple-500/20',
              'transition-all duration-300 ease-out',
              'h-14 px-5 rounded-lg',
              'inline-flex items-center',
              'focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:ring-offset-2 focus:ring-offset-slate-950',
              // Active state when dropdown is open
              isOpen && 'from-slate-800/90 to-slate-700/90 text-slate-100 border-purple-500/50 shadow-purple-500/30'
            )}
            aria-expanded={isOpen}
            aria-haspopup="true"
          >
            {/* Selected category display */}
            <span className="flex items-center font-medium">
              <IconWrapper 
                icon={selectedCategory.icon} 
                isHovered={false} 
                color={selectedCategory.color} 
              />
              {selectedCategory.label}
            </span>
            
            {/* Animated chevron - rotates 180° when open */}
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
              className="flex items-center justify-center w-5 h-5"
            >
              <ChevronDown className="w-5 h-5" strokeWidth={2.5} />
            </motion.div>
          </button>

          {/* Dropdown Menu - Only rendered when open */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10, height: 0 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  height: 'auto',
                  transition: {
                    type: 'spring',
                    stiffness: 400,
                    damping: 28,
                    mass: 0.8,
                  },
                }}
                exit={{
                  opacity: 0,
                  y: -10,
                  height: 0,
                  transition: {
                    duration: 0.2,
                  },
                }}
                className="absolute left-0 right-0 top-full mt-3 z-50"
                onKeyDown={handleKeyDown}
              >
                <motion.div
                  className="w-full rounded-lg border-2 border-slate-700/50 bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl p-2 shadow-2xl"
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.2 }}
                  style={{ transformOrigin: 'top' }}
                >
                  <motion.div 
                    className="py-1 relative" 
                    variants={containerVariants} 
                    initial="hidden" 
                    animate="visible"
                  >
                    {/* Animated Hover Highlight - Slides smoothly between items */}
                    <AnimatePresence>
                      {(hoveredCategory || selectedCategory.id) && (
                        <motion.div
                          layoutId="hover-highlight"
                          className="absolute inset-x-2 bg-gradient-to-r from-slate-800/80 to-slate-700/80 rounded-md shadow-lg"
                          initial={false}
                          animate={{
                            // Calculate Y position based on item index
                            // 52px per item + 12px separator after first item
                            y: categories.findIndex((c) => (hoveredCategory || selectedCategory.id) === c.id) * 52 +
                              (categories.findIndex((c) => (hoveredCategory || selectedCategory.id) === c.id) > 0 ? 12 : 0),
                            height: 48,
                          }}
                          transition={{
                            type: 'spring',
                            stiffness: 300, // Moderate spring tension
                            damping: 30,    // Smooth, controlled motion
                            mass: 0.8,      // Lighter feel for quicker response
                          }}
                        />
                      )}
                    </AnimatePresence>
                    
                    {/* Category Items */}
                    {categories.map((category, index) => (
                      <React.Fragment key={category.id}>
                        {/* Divider after first item (separates "All" from specific categories) */}
                        {index === 1 && (
                          <motion.div 
                            className="mx-4 my-3 border-t border-slate-700/50" 
                            variants={itemVariants} 
                          />
                        )}
                        
                        {/* Individual Category Button */}
                        <motion.button
                          onClick={() => {
                            setSelectedCategory(category);
                            setIsOpen(false);
                          }}
                          onHoverStart={() => setHoveredCategory(category.id)}
                          onHoverEnd={() => setHoveredCategory(null)}
                          className={cn(
                            'relative flex w-full items-center px-4 py-3 text-sm font-medium rounded-md',
                            'transition-all duration-200',
                            'focus:outline-none focus:ring-2 focus:ring-purple-500/50',
                            // Highlight text color when selected or hovered
                            selectedCategory.id === category.id || hoveredCategory === category.id
                              ? 'text-slate-100'
                              : 'text-slate-400',
                          )}
                          whileTap={{ scale: 0.97 }} // Slight press effect
                          variants={itemVariants}
                        >
                          {/* Category Icon with hover effects */}
                          <IconWrapper
                            icon={category.icon}
                            isHovered={hoveredCategory === category.id}
                            color={category.color}
                          />
                          {category.label}
                          
                          {/* Selected indicator - colored dot */}
                          {selectedCategory.id === category.id && (
                            <motion.div
                              layoutId="check"
                              className="ml-auto w-2 h-2 rounded-full"
                              style={{ backgroundColor: category.color }}
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                            />
                          )}
                        </motion.button>
                      </React.Fragment>
                    ))}
                  </motion.div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Footer Credits */}
        <motion.div 
          className="absolute bottom-8 text-slate-600 text-xs"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          Fluid Dropdown Component • Premium Design
        </motion.div>
      </div>
    </MotionConfig>
  );
}