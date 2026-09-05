import { useCallback, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function RippleButton({ children, className = "", ...props }) {
  const buttonRef = useRef(null);
  const [ripple, setRipple] = useState(null);
  const [isHovered, setIsHovered] = useState(false);

  const createRipple = useCallback((event) => {
    if (isHovered || !buttonRef.current) return;
    setIsHovered(true);

    const button = buttonRef.current;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2;
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    setRipple({ x, y, size, key: Date.now() });
  }, [isHovered]);

  const removeRipple = useCallback((event) => {
    if (event.target !== event.currentTarget) return;
    setIsHovered(false);
    
    const button = buttonRef.current;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2;
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    setRipple({ x, y, size, key: Date.now(), isLeaving: true });
  }, []);

  const handleMouseMove = useCallback((event) => {
    if (!buttonRef.current || !isHovered || !ripple) return;

    const button = buttonRef.current;
    const rect = button.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    setRipple(prev => ({ ...prev, x, y }));
  }, [isHovered, ripple]);

  return (
    <button
      ref={buttonRef}
      className={`relative flex items-center justify-center overflow-hidden rounded-sm shadow-sm border border-dashed border-black/50 px-8 py-3 text-lg font-medium text-[#0e352e] transition-colors duration-[600ms] hover:text-white ${className}`}
      onMouseEnter={(e) => {
        if (e.target === e.currentTarget) {
          createRipple(e);
        }
      }}
      onMouseLeave={(e) => {
        if (e.target === e.currentTarget) {
          removeRipple(e);
        }
      }}
      onMouseMove={handleMouseMove}
      {...props}
    >
      <span className="relative z-[2]">{children}</span>
      
      <AnimatePresence>
        {ripple && (
          <motion.span
            key={ripple.key}
            className="absolute rounded-full bg-black pointer-events-none z-[1]"
            style={{
              width: ripple.size,
              height: ripple.size,
              left: ripple.x,
              top: ripple.y,
              x: '-50%',
              y: '-50%',
            }}
            initial={{ scale: 0, opacity: 1 }}
            animate={{ 
              scale: ripple.isLeaving ? 0 : 1,
              x: '-50%',
              y: '-50%',
            }}
            exit={{ scale: 0, opacity: 1 }}
            transition={{ 
              duration: 0.6, 
              ease: "easeOut",
            }}
            onAnimationComplete={() => {
              if (ripple.isLeaving) {
                setRipple(null);
              }
            }}
          />
        )}
      </AnimatePresence>
    </button>
  );
}

// Demo Component
export function Component() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-white">
      <div className="flex flex-col gap-6 items-center">
        <RippleButton onClick={() => alert('Button clicked!')}>
          Click Me
        </RippleButton>
      </div>
    </div>
  );
}