
'use client'; 
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; 
export const useMouse = () => {
  const [mouseState, setMouseState] = useState<{ x: number | null; y: number | null }>({ x: null, y: null });
  const ref = useRef<HTMLDivElement>(null); 

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      
      setMouseState({
        x: event.clientX,
        y: event.clientY,
      });
    };

    const handleMouseLeave = () => {
      
      setMouseState({ x: null, y: null });
    };

    const currentRef = ref.current;
    if (currentRef) {
      currentRef.addEventListener('mousemove', handleMouseMove);
      currentRef.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      if (currentRef) {
        currentRef.removeEventListener('mousemove', handleMouseMove);
        currentRef.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);

  return [mouseState, ref];
};

export const Component = () => {
  
  const [mouseState, ref] = useMouse();
  const [hue, setHue] = useState(0);

  const [particles, setParticles] = useState<
    { id: number; x: number; y: number; size: number; intensity: number }[]
  >([]);

  useEffect(() => {
    
    if (mouseState.x !== null && mouseState.y !== null) {
      
      const newHue = mouseState.x % 360;
      setHue(newHue);

      const newParticles = Array.from({ length: 3 }, () => ({
        id: Date.now() + Math.random(), 
        x: mouseState.x! + (Math.random() - 0.5) * 20,
        y: mouseState.y! + (Math.random() - 0.5) * 20,
        size: Math.random() * 3 + 2, 
        intensity: Math.random() * 0.5 + 0.5, 
      }));

      
      setParticles((prev) => [...prev, ...newParticles].slice(-30));
    }
  }, [mouseState.x, mouseState.y]); 
  return (
    <div className='relative w-full h-full cursor-none' ref={ref}>
      
      {mouseState.x !== null && mouseState.y !== null && (
        <>

          <motion.div
            className='fixed pointer-events-none z-[9999]'
            style={{
              left: mouseState.x,
              top: mouseState.y,
              x: '-50%', 
              y: '-50%',
              width: '40px',
              height: '40px',
            }}
            transition={{ duration: 0.2, ease: 'easeOut' }} 
          >
            <div
              className='w-full h-full rounded-full mix-blend-screen' 
              style={{
              
                background: `radial-gradient(
                  circle at center,
                  hsl(${hue}, 100%, 70%),
                  hsl(${(hue + 60) % 360}, 100%, 60%)
                )`,
                boxShadow: `0 0 20px hsl(${hue}, 100%, 50%, 0.5)`,
              }}
            />
          </motion.div>

          <AnimatePresence>
            {particles.map((particle, index) => (
              <motion.div
                key={particle.id} 
                className='fixed pointer-events-none mix-blend-screen'
                style={{
                  left: particle.x,
                  top: particle.y,
                  x: '-50%', 
                  y: '-50%',
                }}
                initial={{ opacity: particle.intensity, scale: 0 }}
                animate={{ opacity: 0, scale: particle.size }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1, ease: 'easeOut' }}
              >
                <div
                  className='rounded-full'
                  style={{
                    width: `${particle.size * 4}px`,
                    height: `${particle.size * 4}px`,
                    background: `radial-gradient(
                      circle at center,
                      hsl(${(hue + index * 10) % 360}, 100%, ${70 + particle.intensity * 30}%),
                      transparent
                    )`,
                    filter: 'blur(2px)', 
                    boxShadow: `0 0 ${particle.size * 2}px hsl(${(hue + index * 10) % 360}, 100%, 50%, ${particle.intensity})`,
                  }}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </>
      )}
    </div>
  );
};