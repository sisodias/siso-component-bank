"use client";

import { motion, useReducedMotion, useAnimate, useSpring, AnimatePresence } from 'framer-motion';
import { useEffect, useState, useRef, useCallback } from 'react';

// Simple debounce for performance
function debounce(func: Function, wait: number) {
  let timeout: any;
  return function executedFunction(...args: any[]) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

interface InteractiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  clickPosition?: { x: number; y: number };
}

export const InteractiveModal = ({ 
  isOpen, 
  onClose, 
  clickPosition = { x: 0, y: 0 } 
}: InteractiveModalProps) => {
  const prefersReducedMotion = useReducedMotion();
  const [enableFloatingClose, setEnableFloatingClose] = useState(false);
  const [showFloatingClose, setShowFloatingClose] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [gradientBackground, setGradientBackground] = useState('none');

  const modalRef = useRef<HTMLDivElement>(null);
  const [scope, animate] = useAnimate();

  const closeX = useSpring(0, { damping: 25, stiffness: 300 });
  const closeY = useSpring(0, { damping: 25, stiffness: 300 });
  const closeScale = useSpring(0, { damping: 20, stiffness: 250 });

  const CURSOR_OFFSET = { x: 25, y: 25 };
  const MODAL_SHIFT_FACTOR = 18;

  const debouncedUpdate = useCallback(
    debounce((x: number, y: number) => setMousePosition({ x, y }), 5),
    []
  );

  useEffect(() => {
    if (!isOpen) return;
    const handleMove = (e: MouseEvent) => {
      if (!prefersReducedMotion) debouncedUpdate(e.clientX, e.clientY);
    };
    window.addEventListener('mousemove', handleMove);
    const timer = setTimeout(() => setEnableFloatingClose(true), 500);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      clearTimeout(timer);
    };
  }, [isOpen, prefersReducedMotion, debouncedUpdate]);

  useEffect(() => {
    if (!modalRef.current || !isOpen || !enableFloatingClose) return;

    const rect = modalRef.current.getBoundingClientRect();
    const isOutside = 
      mousePosition.x < rect.left || mousePosition.x > rect.right ||
      mousePosition.y < rect.top || mousePosition.y > rect.bottom;

    setShowFloatingClose(isOutside);

    if (isOutside) {
      closeX.set(Math.min(Math.max(mousePosition.x + CURSOR_OFFSET.x, 40), window.innerWidth - 40));
      closeY.set(Math.min(Math.max(mousePosition.y + CURSOR_OFFSET.y, 40), window.innerHeight - 40));
      closeScale.set(1);

      const dx = (rect.left + rect.width / 2) - mousePosition.x;
      const dy = (rect.top + rect.height / 2) - mousePosition.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > 0) {
        animate(modalRef.current, { 
          x: (dx / dist) * MODAL_SHIFT_FACTOR, 
          y: (dy / dist) * MODAL_SHIFT_FACTOR 
        }, { type: 'spring', damping: 35, stiffness: 300 });
      }

      const gX = mousePosition.x > rect.left + rect.width / 2 ? 100 : 0;
      const gY = mousePosition.y > rect.top + rect.height / 2 ? 100 : 0;
      setGradientBackground(`radial-gradient(circle at ${gX}% ${gY}%, rgba(0,0,0,0.04), transparent 70%)`);
    } else {
      closeScale.set(0);
      animate(modalRef.current, { x: 0, y: 0 }, { type: 'spring', damping: 20 });
      setGradientBackground('none');
    }
  }, [mousePosition, isOpen, enableFloatingClose, animate, closeX, closeY, closeScale]);

  const originX = clickPosition.x - window.innerWidth / 2;
  const originY = clickPosition.y - window.innerHeight / 2;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/40 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          {!prefersReducedMotion && (
            <motion.div
              className="absolute z-[60] pointer-events-none"
              style={{ left: 0, top: 0, x: closeX, y: closeY, scale: closeScale, opacity: showFloatingClose ? 1 : 0 }}
            >
              <button 
                className="w-14 h-14 bg-white rounded-full shadow-2xl flex items-center justify-center pointer-events-auto border border-black/5"
                onClick={onClose}
              >
                <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </motion.div>
          )}

          <motion.div
            ref={modalRef}
            className="bg-white rounded-[2.5rem] shadow-2xl relative w-full max-w-xl aspect-video flex items-center justify-center overflow-hidden border border-black/5"
            style={{ backgroundImage: gradientBackground }}
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.4, x: originX, y: originY }}
            animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, scale: 0.4, x: originX, y: originY }}
            transition={{ type: 'spring', damping: 25, stiffness: 280 }}
          >
            <div className="text-center space-y-2 px-8">
              <h3 className="text-2xl font-bold text-gray-900">Try hovering outside of the modal</h3>
              <p className="text-gray-500">Notice how the modal shifts and the close button follows you.</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};