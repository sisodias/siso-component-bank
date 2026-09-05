'use client';

import * as React from 'react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Minus, Plus } from 'lucide-react';
import { cn } from "../_utils/cn"; // Make sure you have this utility from shadcn

// 1. PROPS INTERFACE
interface OrderItemCardProps extends React.HTMLAttributes<HTMLDivElement> {
  imageUrl: string;
  title: string;
  details: string[];
  initialShots?: number;
  initialQuantity?: number;
  onQuantityChange?: (quantity: number) => void;
  onShotsChange?: (shots: number) => void;
  imageAlt?: string;
}

// 2. COMPONENT LOGIC
export function OrderItemCard({
  className,
  imageUrl,
  title,
  details,
  initialShots = 3,
  initialQuantity = 1,
  onQuantityChange,
  onShotsChange,
  imageAlt = 'Product image',
  ...props
}: OrderItemCardProps) {
  const [quantity, setQuantity] = useState(initialQuantity);
  const [shots, setShots] = useState(initialShots);

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 0) {
      setQuantity(newQuantity);
      onQuantityChange?.(newQuantity);
    }
  };

  const handleShotsClick = () => {
    const newShots = shots + 1; // Example interaction
    setShots(newShots);
    onShotsChange?.(newShots);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={cn(
        'relative flex items-center gap-4 p-4 w-full max-w-sm rounded-3xl text-white overflow-hidden',
        'bg-gradient-to-br from-orange-400 to-orange-600 dark:from-orange-500 dark:to-orange-700',
        'shadow-lg shadow-orange-500/20',
        className
      )}
      {...props}
    >
      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-2/3 h-2/3 bg-white/10 rounded-full blur-3xl" />

      {/* Image */}
      <motion.img
        src={imageUrl}
        alt={imageAlt}
        className="w-20 h-20 object-cover rounded-xl shadow-md"
        whileHover={{ scale: 1.05 }}
      />

      {/* Details */}
      <div className="flex-grow z-10">
        <h3 className="font-bold text-lg">{title}</h3>
        {details.map((detail, index) => (
          <p key={index} className="text-sm opacity-80">
            {detail}
          </p>
        ))}
        <motion.button
          onClick={handleShotsClick}
          whileTap={{ scale: 0.95 }}
          className="mt-2 px-3 py-1 text-xs font-semibold bg-white/20 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
        >
          {shots} Shots
        </motion.button>
      </div>

      {/* Quantity Stepper */}
      <div className="flex items-center gap-2 z-10">
        <motion.button
          onClick={() => handleQuantityChange(quantity - 1)}
          disabled={quantity === 0}
          whileTap={{ scale: 0.9 }}
          className="p-2 bg-white/20 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
          aria-label="Decrease quantity"
        >
          <Minus className="w-4 h-4" />
        </motion.button>
        
        <div className="relative w-8 h-8 flex items-center justify-center font-bold text-lg">
          <AnimatePresence mode="popLayout">
            <motion.span
              key={quantity}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute"
            >
              {quantity}
            </motion.span>
          </AnimatePresence>
        </div>

        <motion.button
          onClick={() => handleQuantityChange(quantity + 1)}
          whileTap={{ scale: 0.9 }}
          className="p-2 bg-white/20 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
          aria-label="Increase quantity"
        >
          <Plus className="w-4 h-4" />
        </motion.button>
      </div>
    </motion.div>
  );
}