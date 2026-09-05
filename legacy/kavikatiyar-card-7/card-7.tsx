// components/ui/travel-route-card.tsx

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';
import { cn } from "../_utils/cn";

// Define the props for the component
interface TravelRouteCardProps {
  title: string;
  author: string;
  distance: string;
  initialLikes: number;
  imageUrl: string;
  className?: string;
}

// Helper for formatting large numbers
const formatLikes = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  return num.toString();
};

export const TravelRouteCard: React.FC<TravelRouteCardProps> = ({
  title,
  author,
  distance,
  initialLikes,
  imageUrl,
  className,
}) => {
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(false);

  const handleLikeClick = () => {
    if (isLiked) {
      setLikes(likes - 1);
    } else {
      setLikes(likes + 1);
    }
    setIsLiked(!isLiked);
  };

  // Animation variants for framer-motion
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ scale: 1.03, transition: { duration: 0.3 } }}
      className={cn(
        'relative w-full max-w-md h-56 rounded-2xl overflow-hidden p-6 text-white shadow-lg flex items-end isolate',
        className
      )}
    >
      {/* Background Image & Overlay */}
      <div className="absolute inset-0 z-[-1]">
        <img src={imageUrl} alt="Route map" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-blue-500/60 dark:bg-blue-800/70" />
      </div>
      
      {/* Main Content Grid */}
      <div className="w-full grid grid-cols-3 gap-4 items-end">
        {/* Left Section: Info & Likes */}
        <div className="col-span-2 flex flex-col justify-end h-full">
          <div className="space-y-2">
            <motion.h2 variants={itemVariants} className="text-xl font-bold leading-tight">
              {title}
            </motion.h2>
            <motion.p variants={itemVariants} className="text-sm opacity-80">
              {author}
            </motion.p>
          </div>
          <motion.button
            variants={itemVariants}
            onClick={handleLikeClick}
            className={cn(
              'mt-4 flex items-center gap-2 w-fit px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-300',
              isLiked
                ? 'bg-red-500/80 text-white'
                : 'bg-white/20 text-white backdrop-blur-sm hover:bg-white/30'
            )}
          >
            <motion.div whileTap={{ scale: 1.3 }}>
              <Heart
                className={cn('w-5 h-5 transition-all', isLiked ? 'fill-current' : 'fill-transparent')}
              />
            </motion.div>
            <AnimatePresence mode="wait">
              <motion.span
                key={likes}
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 10, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="w-10 text-left"
              >
                {formatLikes(likes)}
              </motion.span>
            </AnimatePresence>
          </motion.button>
        </div>
        
        {/* Right Section: Distance */}
        <motion.div
          variants={itemVariants}
          className="col-span-1 flex items-center justify-center"
        >
          <h1 className="text-8xl font-bold tracking-tighter text-white/90 select-none">
            {distance}
          </h1>
        </motion.div>
      </div>
    </motion.div>
  );
};