// FILE: src/components/ui/component.tsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X } from 'lucide-react';

export const Component: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={className}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative z-20 flex items-center justify-center w-14 h-14 p-0 bg-blue-600 rounded-full shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        aria-expanded={isOpen}
        aria-controls="family-button-content-area"
        type="button"
      >
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={isOpen ? "icon-x" : "icon-plus"}
            initial={{ rotate: -45, opacity: 0, scale: 0.5 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: 45, opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.2 }}
          >
            {isOpen ? <X className="w-7 h-7 text-white" /> : <Plus className="w-7 h-7 text-white" />}
          </motion.div>
        </AnimatePresence>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="family-button-content-area"
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", stiffness: 300, damping: 30, duration: 0.2 }}
            className="absolute bottom-[calc(100%_+_0.5rem)] right-0 z-10 p-1 bg-neutral-900/90 backdrop-blur-md border border-neutral-700/80 rounded-[22px] shadow-2xl overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};