import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';

export default function CardStack() {
  const initialCards = [
    {
      id: 1,
      src: "https://images.unsplash.com/photo-1559333086-b0a56225a93c?w=500&h=300&fit=crop",
      alt: "Card 1"
    },
    {
      id: 2,
      src: "https://images.unsplash.com/photo-1618983159565-e82991854c47?w=500&h=300&fit=crop",
      alt: "Card 2"
    },
    {
      id: 3,
      src: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&h=300&fit=crop",
      alt: "Card 3"
    },
    {
      id: 4,
      src: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=500&h=300&fit=crop",
      alt: "Card 4"
    },
    {
      id: 5,
      src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=300&fit=crop",
      alt: "Card 5"
    }
  ];

  const [cards, setCards] = useState(initialCards);

  const [isDark, setIsDark] = useState(true);

  const moveToEnd = (index) => {
    setCards(prev => [...prev.slice(index + 1), prev[index]]);
  };

  // Configuration
  const offset = 10;
  const scaleStep = 0.06;
  const dimStep = 0.15;
  const stiff = 170;
  const damp = 26;
  const borderRadius = 12;

  const spring = {
    type: 'spring',
    stiffness: stiff,
    damping: damp
  };

  // Theme configuration
  const theme = {
    dark: {
      bg: 'bg-black',
      text: 'text-white',
      textSecondary: 'text-gray-400',
      toggleBg: 'bg-gray-900 hover:bg-gray-800',
      toggleBorder: 'border-gray-800',
      infoBox: 'bg-gray-900/50 border-gray-800',
      shadowCard: '0 20px 40px rgba(0, 0, 0, 0.6)',
      shadowCardBack: '0 10px 20px rgba(0, 0, 0, 0.3)',
      cardBorder: 'border-2 border-gray-700'
    },
    light: {
      bg: 'bg-gradient-to-br from-blue-50 via-white to-gray-50',
      text: 'text-gray-900',
      textSecondary: 'text-gray-600',
      toggleBg: 'bg-gray-200 hover:bg-gray-300',
      toggleBorder: 'border-gray-300',
      infoBox: 'bg-white/50 border-gray-200',
      shadowCard: '0 20px 40px rgba(0, 0, 0, 0.1)',
      shadowCardBack: '0 10px 20px rgba(0, 0, 0, 0.05)',
      cardBorder: 'border-2 border-gray-300'
    }
  };

  const currentTheme = isDark ? theme.dark : theme.light;

  return (
    <div className={`w-full h-screen flex items-center justify-center ${currentTheme.bg} transition-all duration-300 relative overflow-hidden`}>
      {/* Orthogonal Grid Background */}
      <svg 
        className="absolute inset-0 w-full h-full opacity-10 transition-opacity duration-300"
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
              stroke={isDark ? '#ffffff' : '#000000'} 
              strokeWidth="0.5"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Theme Toggle Button */}
      <motion.button
        onClick={() => setIsDark(!isDark)}
        className={`absolute top-8 right-8 p-3 rounded-full ${currentTheme.toggleBg} border ${currentTheme.toggleBorder} transition-colors duration-200 z-20`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isDark ? (
          <Sun className="w-6 h-6 text-yellow-400" />
        ) : (
          <Moon className="w-6 h-6 text-gray-700" />
        )}
      </motion.button>

      {/* Card Stack Container */}
      <div className="relative w-80 aspect-video overflow-visible z-10">
        <ul className="relative w-full h-full m-0 p-0">
          {cards.map(({ id, src, alt }, i) => {
            const isFront = i === 0;
            const brightness = Math.max(0.3, 1 - i * dimStep);
            const baseZ = cards.length - i;

            return (
              <motion.li
                key={id}
                className={`absolute w-full h-full list-none overflow-hidden ${currentTheme.cardBorder}`}
                style={{
                  borderRadius: `${borderRadius}px`,
                  cursor: isFront ? 'grab' : 'auto',
                  touchAction: 'none',
                  boxShadow: isFront
                    ? currentTheme.shadowCard
                    : currentTheme.shadowCardBack
                }}
                animate={{
                  top: `${i * -offset}%`,
                  scale: 1 - i * scaleStep,
                  filter: `brightness(${brightness})`,
                  zIndex: baseZ
                }}
                transition={spring}
                drag={isFront ? 'y' : false}
                dragConstraints={{ top: 0, bottom: 0 }}
                dragMomentum={false}
                onDragEnd={() => moveToEnd(i)}
                whileDrag={
                  isFront
                    ? {
                        zIndex: cards.length,
                        cursor: 'grabbing',
                        scale: 1 - i * scaleStep + 0.05,
                        rotate: 2
                      }
                    : {}
                }
              >
                <img
                  src={src}
                  alt={alt}
                  className="w-full h-full object-cover pointer-events-none display-block"
                  draggable={false}
                />
              </motion.li>
            );
          })}
        </ul>
      </div>

      {/* Info Text */}
      <div className={`absolute bottom-8 left-8 right-8 text-center px-6 py-4 rounded-lg border ${currentTheme.infoBox} backdrop-blur-sm transition-all duration-300 z-20`}>
        <p className={`${currentTheme.text} text-sm font-medium`}>
          Drag the top card upward to reveal the next one
        </p>
        <p className={`${currentTheme.textSecondary} text-xs mt-1`}>
          {isDark ? '🌙 Dark Mode' : '☀️ Light Mode'}
        </p>
      </div>
    </div>
  );
}