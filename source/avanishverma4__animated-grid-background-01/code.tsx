import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// --- Utilities ---

/**
 * Utility for merging tailwind classes with conflict resolution.
 * Consolidated into App.tsx.
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// --- Components ---

interface TilesProps {
  className?: string;
  rows?: number;
  cols?: number;
  hoverColor?: string;
}

/**
 * Tiles component handles the interactive grid background.
 */
const TilesComponent: React.FC<TilesProps> = ({
  className,
  rows: r,
  cols: c,
  hoverColor = '#3b82f6'
}) => {
  const columns = new Array(r || 30).fill(1);
  const rows = new Array(c || 20).fill(1);

  return (
    <div className={cn('relative z-0 flex w-full h-full justify-center', className)}>
      {columns.map((_, i) => (
        <div
          key={`col-${i}`}
          className="md:w-12 sm:h-12 w-9 h-9 border-l border-neutral-900/50 relative"
        >
          {rows.map((_, j) => (
            <motion.div
              key={`row-${j}`}
              className="md:w-12 sm:h-12 w-9 h-9 border-r border-t border-neutral-900/50 relative"
              initial={{ backgroundColor: "rgba(0, 0, 0, 0)" }}
              whileHover={{
                backgroundColor: hoverColor,
                transition: { 
                  duration: 0.3, 
                  ease: "easeOut" 
                }
              }}
              animate={{ backgroundColor: "rgba(0, 0, 0, 0)" }}
              transition={{
                duration: 1.2,
                ease: [0.22, 1, 0.36, 1]
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

const Tiles = React.memo(TilesComponent);

interface AnimatedGridBackgroundSectionProps {
  children?: React.ReactNode;
  hoverColor?: string;
}

/**
 * Section component that wraps content with the interactive grid.
 * Moved from components/AnimatedGridBackgroundSection.tsx.
 */
const AnimatedGridBackgroundSection: React.FC<AnimatedGridBackgroundSectionProps> = ({ children, hoverColor }) => {
  return (
    <div className="w-full h-full min-h-screen relative overflow-hidden flex items-center justify-center">
      <div className="w-fit h-fit relative z-[2] px-6">
        {children}
      </div>
      <div className="absolute top-0 left-0 h-full w-full pointer-events-auto">
        <Tiles rows={40} cols={30} hoverColor={hoverColor} />
      </div>
    </div>
  );
};

// --- Main Application ---

const COLOR_OPTIONS = [
  { name: 'Blue', hex: '#3b82f6', class: 'bg-blue-500' },
  { name: 'Green', hex: '#22c55e', class: 'bg-green-500' },
  { name: 'Red', hex: '#ef4444', class: 'bg-red-500' },
  { name: 'Yellow', hex: '#eab308', class: 'bg-yellow-500' },
];

export default function App() {
  const [selectedColor, setSelectedColor] = useState(COLOR_OPTIONS[0]);

  return (
    <div className="w-screen min-h-screen bg-black text-white transition-colors duration-500 overflow-hidden relative font-sans">
      <AnimatedGridBackgroundSection hoverColor={selectedColor.hex}>
        <div className="flex flex-col items-center text-center space-y-8 max-w-2xl pointer-events-none">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="pointer-events-auto"
          >
            <h2 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter font-heading leading-tight">
              A Fluid Interactive <br />
              <span 
                style={{ color: selectedColor.hex }} 
                className="transition-colors duration-500 ease-in-out"
              >
                Experience
              </span>
            </h2>
            <p className="text-lg md:text-xl text-neutral-400 font-medium max-w-lg mx-auto leading-relaxed">
              Hover over the background to interact with the grid. Select a theme below to change the visual signature.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="flex gap-4 pointer-events-auto"
          >
            <motion.button
              whileHover={{ 
                scale: 1.05, 
                backgroundColor: selectedColor.hex,
                boxShadow: `0px 0px 25px ${selectedColor.hex}60`
              }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-black px-8 py-3 rounded-full font-bold transition-all duration-300"
            >
              Get Started
            </motion.button>
            <motion.button
              whileHover={{ 
                scale: 1.05, 
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                borderColor: selectedColor.hex
              }}
              whileTap={{ scale: 0.95 }}
              className="border border-neutral-800 px-8 py-3 rounded-full font-bold transition-all duration-300 text-white"
            >
              Documentation
            </motion.button>
          </motion.div>
        </div>
      </AnimatedGridBackgroundSection>

      {/* Color Switcher UI */}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50">
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-neutral-900/80 backdrop-blur-md p-2 rounded-full border border-neutral-800 flex gap-2 shadow-2xl"
        >
          {COLOR_OPTIONS.map((color) => (
            <button
              key={color.name}
              onClick={() => setSelectedColor(color)}
              className="relative p-2 group"
              aria-label={`Select ${color.name} theme`}
            >
              <div 
                className={cn(
                  "w-8 h-8 rounded-full transition-transform duration-200 group-hover:scale-110 shadow-inner",
                  color.class
                )} 
              />
              <AnimatePresence>
                {selectedColor.name === color.name && (
                  <motion.div
                    layoutId="active-pill"
                    className="absolute inset-0 border-2 border-white rounded-full"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </AnimatePresence>
              
              {/* Tooltip */}
              <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-neutral-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                {color.name}
              </span>
            </button>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
