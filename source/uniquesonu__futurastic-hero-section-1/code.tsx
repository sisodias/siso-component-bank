import React, { useRef, useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";

// Utility function to merge class names
const cn = (...classes) => classes.filter(Boolean).join(' ');

// Default beam configurations - professional and subtle
const DEFAULT_BEAMS = [
  { x: 80, duration: 8, delay: 1, height: "h-12", repeatDelay: 5 },
  { x: 220, duration: 12, delay: 3, height: "h-8", repeatDelay: 7 },
  { x: 380, duration: 10, delay: 0, height: "h-16", repeatDelay: 4 },
  { x: 520, duration: 9, delay: 4, height: "h-10", repeatDelay: 6 },
  { x: 680, duration: 11, delay: 2, height: "h-14", repeatDelay: 5 },
  { x: 820, duration: 13, delay: 5, height: "h-6", repeatDelay: 8 },
];

// Explosion particle component
const ExplosionParticle = ({ delay = 0, direction, distance }) => (
  <motion.div
    initial={{ 
      x: 0, 
      y: 0, 
      opacity: 1, 
      scale: 1 
    }}
    animate={{
      x: direction.x * distance,
      y: direction.y * distance,
      opacity: 0,
      scale: 0,
    }}
    transition={{
      duration: 1 + Math.random() * 0.5,
      delay,
      ease: "easeOut"
    }}
    className="absolute w-1 h-1 bg-gray-400 rounded-full opacity-80"
  />
);

// Explosion effect component
const Explosion = ({ x, y, intensity = 20 }) => {
  const particles = useMemo(() => 
    Array.from({ length: intensity }, (_, i) => ({
      id: i,
      direction: {
        x: (Math.random() - 0.5) * 2,
        y: -Math.random() * 0.8 - 0.2,
      },
      distance: 30 + Math.random() * 40,
      delay: Math.random() * 0.2,
    })), [intensity]
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.1 }}
      className="absolute pointer-events-none z-50"
      style={{
        left: x,
        top: y,
        transform: "translate(-50%, -50%)"
      }}
    >
      {/* Core flash */}
      <motion.div
        initial={{ scale: 0, opacity: 1 }}
        animate={{ scale: 2, opacity: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="absolute w-3 h-3 bg-gray-300 rounded-full blur-sm"
        style={{ transform: "translate(-50%, -50%)" }}
      />
      
      {/* Beam flash */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0.6 }}
        animate={{ scaleX: 1, opacity: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="absolute w-16 h-0.5 bg-gradient-to-r from-transparent via-gray-400 to-transparent blur-[1px]"
        style={{ transform: "translate(-50%, -50%)" }}
      />
      
      {/* Particles */}
      {particles.map((particle) => (
        <ExplosionParticle
          key={particle.id}
          delay={particle.delay}
          direction={particle.direction}
          distance={particle.distance}
        />
      ))}
    </motion.div>
  );
};

// Individual beam component
const Beam = ({ 
  x, 
  duration, 
  delay, 
  height, 
  repeatDelay, 
  onCollision,
  collisionZone,
  gradient = "from-gray-400 via-gray-300 to-transparent"
}) => {
  const beamRef = useRef(null);
  const [collisionDetected, setCollisionDetected] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);

  const checkCollision = useCallback(() => {
    if (!beamRef.current || !collisionZone.current || collisionDetected) return;

    const beamRect = beamRef.current.getBoundingClientRect();
    const zoneRect = collisionZone.current.getBoundingClientRect();

    if (beamRect.bottom >= zoneRect.top && beamRect.top <= zoneRect.bottom) {
      const collisionX = beamRect.left + beamRect.width / 2;
      const collisionY = zoneRect.top;
      
      setCollisionDetected(true);
      onCollision(collisionX, collisionY);

      // Reset after explosion
      setTimeout(() => {
        setCollisionDetected(false);
        setAnimationKey(prev => prev + 1);
      }, 1500);
    }
  }, [collisionDetected, onCollision, collisionZone]);

  useEffect(() => {
    if (collisionDetected) return;
    
    const interval = setInterval(checkCollision, 16); // ~60fps
    return () => clearInterval(interval);
  }, [checkCollision, collisionDetected]);

  return (
    <motion.div
      key={animationKey}
      ref={beamRef}
      initial={{
        y: -200,
        x,
        opacity: 0.8,
      }}
      animate={{
        y: window.innerHeight + 200,
        opacity: [0.8, 1, 1, 0.8],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        repeatDelay,
        ease: "linear",
        opacity: {
          duration: duration * 0.8,
          times: [0, 0.1, 0.9, 1],
        }
      }}
      className={cn(
        "absolute w-px bg-gradient-to-b rounded-full shadow-lg",
        height,
        `bg-gradient-to-b ${gradient}`
      )}
      style={{
        filter: "drop-shadow(0 0 4px rgba(156, 163, 175, 0.3))",
      }}
    />
  );
};

// Main component
export const BackgroundBeamsWithCollision = ({
  children,
  className,
  beams = DEFAULT_BEAMS,
  backgroundColor = "bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800",
  explosionIntensity = 20,
}) => {
  const containerRef = useRef(null);
  const collisionZoneRef = useRef(null);
  const [explosions, setExplosions] = useState([]);

  const handleCollision = useCallback((x, y) => {
    const newExplosion = {
      id: Date.now() + Math.random(),
      x,
      y,
      intensity: explosionIntensity,
    };

    setExplosions(prev => [...prev, newExplosion]);

    // Remove explosion after animation
    setTimeout(() => {
      setExplosions(prev => prev.filter(exp => exp.id !== newExplosion.id));
    }, 2000);
  }, [explosionIntensity]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-full h-screen overflow-hidden flex items-center justify-center",
        backgroundColor,
        className
      )}
    >
      {/* Beams */}
      {beams.map((beam, index) => (
        <Beam
          key={index}
          {...beam}
          onCollision={handleCollision}
          collisionZone={collisionZoneRef}
        />
      ))}

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Collision zone */}
      <div
        ref={collisionZoneRef}
        className="absolute bottom-0 w-full h-16 bg-gradient-to-t from-gray-200/60 to-transparent dark:from-gray-700/60 pointer-events-none"
        style={{
          boxShadow: "0 -8px 32px -8px rgba(0,0,0,0.06), 0 0 0 1px rgba(255,255,255,0.05) inset"
        }}
      />

      {/* Explosions */}
      <AnimatePresence>
        {explosions.map((explosion) => (
          <Explosion
            key={explosion.id}
            x={explosion.x}
            y={explosion.y}
            intensity={explosion.intensity}
          />
        ))}
      </AnimatePresence>

      {/* Subtle ambient effects */}
      <div className="absolute inset-0 bg-gradient-radial from-gray-200/20 via-transparent to-transparent pointer-events-none" />
      <div className="absolute bottom-0 w-full h-1/3 bg-gradient-to-t from-gray-100/30 to-transparent pointer-events-none" />
    </div>
  );
};

// Demo component
export default function Demo() {
  const professionalBeams = [
    { x: 120, duration: 14, delay: 2, height: "h-10", repeatDelay: 8 },
    { x: 280, duration: 16, delay: 5, height: "h-8", repeatDelay: 10 },
    { x: 440, duration: 12, delay: 1, height: "h-12", repeatDelay: 7 },
    { x: 600, duration: 18, delay: 4, height: "h-6", repeatDelay: 9 },
    { x: 760, duration: 15, delay: 0, height: "h-14", repeatDelay: 6 },
  ];

  return (
    <BackgroundBeamsWithCollision
      beams={professionalBeams}
      explosionIntensity={15}
      className="min-h-screen"
    >
      <div className="text-center space-y-8 p-12 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="space-y-4"
        >
          <h1 className="text-5xl md:text-6xl font-light text-gray-900 dark:text-gray-100 tracking-tight">
            Enterprise Solutions
          </h1>
          <div className="w-24 h-px bg-gray-400 mx-auto"></div>
        </motion.div>
        
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
          className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-3xl mx-auto font-light"
        >
          Streamline your business operations with cutting-edge technology solutions. 
          Our professional-grade platform delivers reliability, scalability, and performance 
          that enterprises trust worldwide.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
          className="flex flex-col sm:flex-row gap-4 justify-center pt-6"
        >
          <button className="px-8 py-4 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-none transition-all duration-300 hover:shadow-lg dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-white">
            Schedule Demo
          </button>
          <button className="px-8 py-4 border border-gray-300 hover:border-gray-400 text-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:border-gray-500 font-medium rounded-none transition-all duration-300 hover:bg-gray-50 dark:hover:bg-gray-800">
            View Documentation
          </button>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="pt-12 flex justify-center items-center space-x-8 text-sm text-gray-500 dark:text-gray-400"
        >
          <div className="text-center">
            <div className="font-semibold text-2xl text-gray-700 dark:text-gray-300">99.9%</div>
            <div>Uptime</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-2xl text-gray-700 dark:text-gray-300">500+</div>
            <div>Enterprise Clients</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-2xl text-gray-700 dark:text-gray-300">24/7</div>
            <div>Support</div>
          </div>
        </motion.div>
      </div>
    </BackgroundBeamsWithCollision>
  );
}