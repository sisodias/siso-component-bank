"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ChevronLeft, Plus } from "lucide-react";

export interface Card {
  id: string;
  title: string;
  status: "completed" | "updates-found" | "syncing";
}

interface AnimatedCardStatusListProps {
  title?: string;
  cards?: Card[];
  onSynchronize?: (cardId: string) => void;
  onAddCard?: () => void;
  onBack?: () => void;
  className?: string;
}

const defaultCards: Card[] = [
  { id: "1", title: "Import products from your store", status: "completed" },
  { id: "2", title: "Unique selling points", status: "completed" },
  { id: "3", title: "Primary customers", status: "completed" },
  { id: "4", title: "Common words & phrases", status: "updates-found" },
  { id: "5", title: "Company overview and offer details", status: "syncing" },
];

export function AnimatedCardStatusList({
  title = "Fundamentals",
  cards: initialCards = defaultCards,
  onSynchronize,
  onAddCard,
  onBack,
  className = ""
}: AnimatedCardStatusListProps = {}) {
  const [cards, setCards] = useState<Card[]>(initialCards);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [activeDashIndex, setActiveDashIndex] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  // Cycle through dash indices every 100ms
  useEffect(() => {
    if (shouldReduceMotion) return;
    
    const interval = setInterval(() => {
      setActiveDashIndex(prev => (prev + 1) % 8);
    }, 100);
    
    return () => clearInterval(interval);
  }, [shouldReduceMotion]);

  const handleSynchronize = (cardId: string) => {
    // Call external handler if provided
    if (onSynchronize) {
      onSynchronize(cardId);
    }

    // Update internal state
    setCards(prev => prev.map(card => 
      card.id === cardId ? { ...card, status: "syncing" as const } : card
    ));

    // Simulate sync completion after 2.5 seconds
    setTimeout(() => {
      setCards(prev => prev.map(card => 
        card.id === cardId ? { ...card, status: "completed" as const } : card
      ));
    }, 2500);
  };

  const handleAddCard = () => {
    if (onAddCard) {
      onAddCard();
    }
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    }
  };

  const getStatusIcon = (status: Card["status"]) => {
    switch (status) {
      case "completed":
        return (
          <svg width="16" height="16" viewBox="0 0 16 16" className="drop-shadow-sm">
            <circle cx="8" cy="8" r="8" fill="#22c55e" />
            <path 
              d="M5 8l2.5 2.5 3.5-4" 
              stroke="white" 
              strokeWidth="1.5" 
              fill="none" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        );
      case "updates-found":
        return (
          <svg width="16" height="16" viewBox="0 0 16 16">
            <path 
              d="M8 1.5L14.5 13H1.5L8 1.5Z" 
              fill="#eab308" 
              stroke="#eab308" 
              strokeWidth="1"
              strokeLinejoin="round"
            />
            <path 
              d="M8 6v3M8 11h0" 
              stroke="white" 
              strokeWidth="1.5" 
              strokeLinecap="round"
            />
          </svg>
        );
      case "syncing":
        return (
          <svg 
            width="16" 
            height="16" 
            viewBox="0 0 16 16"
          >
            {/* Create 8 dashes around the circle */}
            {Array.from({ length: 8 }).map((_, index) => {
              const angle = (index * 45) - 90; // Start from top, -90 to offset
              const radian = (angle * Math.PI) / 180;
              const radius = 6;
              const dashLength = 1.8;
              
              // Calculate start and end points for each dash
              const startX = 8 + (radius - dashLength/2) * Math.cos(radian);
              const startY = 8 + (radius - dashLength/2) * Math.sin(radian);
              const endX = 8 + (radius + dashLength/2) * Math.cos(radian);
              const endY = 8 + (radius + dashLength/2) * Math.sin(radian);
              
              // Use the activeDashIndex to determine which dash is white
              const isActive = index === activeDashIndex;
              
              return (
                <line
                  key={index}
                  x1={startX}
                  y1={startY}
                  x2={endX}
                  y2={endY}
                  stroke={isActive ? "#ffffff" : "#6b7280"}
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              );
            })}
          </svg>
        );
    }
  };

  const getStatusText = (status: Card["status"]) => {
    switch (status) {
      case "updates-found":
        return "UPDATES FOUND";
      case "syncing":
        return "SYNCING";
      default:
        return null;
    }
  };

  const getGradientClass = (status: Card["status"]) => {
    switch (status) {
      case "updates-found":
        return "from-red-500/20 to-transparent";
      case "syncing":
        return "from-green-500/20 to-transparent";
      default:
        return "";
    }
  };

  // Sort cards: completed first, then others
  const sortedCards = [...cards].sort((a, b) => {
    if (a.status === "completed" && b.status !== "completed") return -1;
    if (a.status !== "completed" && b.status === "completed") return 1;
    return 0;
  });

  return (
    <div className={`w-full mx-auto p-6 ${className}`}>
      {/* Container with border */}
      <div className="border border-border/30 rounded-2xl p-6 bg-card">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <motion.button
            onClick={handleBack}
            className="p-2 rounded-lg bg-card cursor-pointer border border-border/50 hover:bg-accent transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <ChevronLeft className="w-4 h-4" />
          </motion.button>
          
          <h1 className="text-xl font-medium text-foreground">{title}</h1>
          
          <motion.button
            onClick={handleAddCard}
            className="p-2 rounded-lg bg-card cursor-pointer border border-border/50 hover:bg-accent transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <Plus className="w-4 h-4" />
          </motion.button>
        </div>

        {/* Cards */}
        <motion.div 
          className="space-y-3"
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.08,
                delayChildren: 0.1,
              }
            }
          }}
          initial="hidden"
          animate="visible"
        >
          <AnimatePresence>
            {sortedCards.map((card) => (
              <motion.div
                key={card.id}
                layout
                layoutId={card.id}
                variants={{
                  hidden: { opacity: 0, y: 20, scale: 0.98 },
                  visible: { 
                    opacity: 1, 
                    y: 0, 
                    scale: 1,
                    transition: { 
                      type: "spring", 
                      stiffness: 300, 
                      damping: 30,
                      duration: shouldReduceMotion ? 0.2 : undefined
                    }
                  }
                }}
                exit={{ 
                  opacity: 0, 
                  y: -20, 
                  scale: 0.98,
                  transition: { 
                    duration: shouldReduceMotion ? 0.15 : 0.2,
                    ease: "easeInOut"
                  }
                }}
                transition={{
                  layout: { 
                    type: "spring", 
                    stiffness: 400, 
                    damping: 30,
                    duration: shouldReduceMotion ? 0.2 : 0.5
                  }
                }}
                className="relative cursor-pointer"
                onMouseEnter={() => setHoveredCard(card.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {/* Card */}
                <motion.div 
                  className="relative bg-muted/50 border border-border/50 rounded-xl p-4 overflow-hidden"
                  whileHover={{
                    y: -1,
                    transition: { type: "spring", stiffness: 400, damping: 25 }
                  }}
                  animate={
                    card.status === "completed" ? {
                      scale: [1, 1.02, 1],
                      transition: {
                        duration: shouldReduceMotion ? 0 : 0.6,
                        ease: [0.04, 0.62, 0.23, 0.98],
                        times: [0, 0.3, 1],
                      }
                    } : {}
                  }
                >
                  {/* Gradient overlay for status */}
                  {(card.status === "updates-found" || card.status === "syncing") && (
                    <div className={`absolute inset-0 bg-gradient-to-l ${getGradientClass(card.status)} pointer-events-none`} 
                         style={{ 
                           backgroundSize: "40% 100%", 
                           backgroundPosition: "right",
                           backgroundRepeat: "no-repeat"
                         }} 
                    />
                  )}
                  
                  <div className="relative flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {/* Status Icon */}
                      <div className="w-5 h-5 flex items-center justify-center overflow-hidden">
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={card.status}
                            initial={{ 
                              x: card.status === "completed" ? 24 : 0,
                              scale: 0.8, 
                              opacity: 0 
                            }}
                            animate={{ 
                              x: 0,
                              scale: 1, 
                              opacity: 1 
                            }}
                            exit={{ 
                              x: card.status === "syncing" ? -24 : 0,
                              scale: 0.8, 
                              opacity: 0 
                            }}
                            transition={{ 
                              type: "spring", 
                              stiffness: 400, 
                              damping: 25,
                              duration: shouldReduceMotion ? 0.15 : undefined
                            }}
                          >
                            {getStatusIcon(card.status)}
                          </motion.div>
                        </AnimatePresence>
                      </div>
                      
                      {/* Title */}
                      <span className="text-foreground truncate max-w-[200px]">{card.title}</span>
                    </div>

                    {/* Status Text or Synchronize Button */}
                    <div className="flex items-center min-w-0 h-8">
                      <AnimatePresence mode="wait">
                        {card.status === "updates-found" && hoveredCard === card.id ? (
                          <motion.button
                            key="sync-button"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            whileHover={{ 
                              scale: 1.02,
                              transition: { type: "spring", stiffness: 400, damping: 25 }
                            }}
                            whileTap={{ scale: 0.98 }}
                            transition={{ 
                              type: "spring", 
                              stiffness: 400, 
                              damping: 25,
                              duration: shouldReduceMotion ? 0.15 : undefined
                            }}
                            onClick={() => handleSynchronize(card.id)}
                            className="px-2.5 py-1 bg-card cursor-pointer text-foreground text-xs font-medium rounded-md transition-colors whitespace-nowrap"
                          >
                            Synchronize
                          </motion.button>
                        ) : getStatusText(card.status) ? (
                          <motion.span
                            key="status-text"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-xs font-mono font-medium text-muted-foreground tracking-wider whitespace-nowrap"
                          >
                            {getStatusText(card.status)}
                          </motion.span>
                        ) : null}
                      </AnimatePresence>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}