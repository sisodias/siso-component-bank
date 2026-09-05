'use client';

import { cn } from "@/lib/utils";
import React, { useRef } from 'react';
import { 
  motion, 
  AnimatePresence, 
  useMotionValue, 
  useSpring, 
  useTransform,
  MotionValue 
} from 'framer-motion';
import { Globe } from 'lucide-react';
import Image from 'next/image';

// --- Types ---
export interface Feature {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
  image: string;
  color: string;
}

interface CardStackProps {
  activeId: string;
  features: Feature[];
}

export default function CardStack({ activeId, features }: CardStackProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Mouse Motion Values (3D Tilt)
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseX = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseY = useSpring(y, { stiffness: 150, damping: 20 });

  function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      const width = rect.width;
      const height = rect.height;
      const mouseXFromCenter = event.clientX - rect.left - width / 2;
      const mouseYFromCenter = event.clientY - rect.top - height / 2;
      
      x.set(mouseXFromCenter);
      y.set(mouseYFromCenter);
    }
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  const rotateX = useTransform(mouseY, [-300, 300], [10, -10]);
  const rotateY = useTransform(mouseX, [-300, 300], [-10, 10]);

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      // Added touch-none to prevent scrolling while interacting with cards on mobile if desired, 
      // though usually better to allow scroll on the edges.
      className="relative w-full h-full flex items-center justify-center perspective-[1200px]"
    >
      <AnimatePresence mode="popLayout">
        {features.map((feature, index) => {
           const isActive = feature.id === activeId;
           const zIndex = isActive ? 50 : features.length - index;

           return (
             <Card 
               key={feature.id}
               feature={feature}
               isActive={isActive}
               index={index}
               zIndex={zIndex}
               rotateX={rotateX}
               rotateY={rotateY}
             />
           );
        })}
      </AnimatePresence>
      
      {/* Ambient Glow */}
      <motion.div 
        animate={{ 
           background: features.find(f => f.id === activeId)?.color || '#ffffff'
        }}
        className="absolute -z-10 w-[200px] h-[300px] md:w-[300px] md:h-[450px] rounded-full blur-[80px] md:blur-[120px] opacity-20 transition-colors duration-700" 
      />
    </div>
  );
}

function Card({ 
  feature, 
  isActive, 
  index, 
  zIndex, 
  rotateX, 
  rotateY 
}: { 
  feature: Feature; 
  isActive: boolean; 
  index: number; 
  zIndex: number; 
  rotateX: MotionValue<number>; 
  rotateY: MotionValue<number>; 
}) {
  
  const randomRotate = (Number(feature.id) * 7) % 10 - 5; 
  
  return (
    <motion.div
      layout
      style={{
        zIndex,
        rotateX: isActive ? rotateX : 0,
        rotateY: isActive ? rotateY : 0,
        transformStyle: "preserve-3d",
      }}
      initial={false}
      animate={{
        // Responsive Y offset: smaller gaps on mobile
        y: isActive ? 0 : (index * (window.innerWidth < 768 ? 20 : 40)) - (window.innerWidth < 768 ? 20 : 40),
        x: isActive ? 0 : (index % 2 === 0 ? 10 : -10),
        scale: isActive ? 1 : 0.9 - (index * 0.05),
        opacity: isActive ? 1 : 0.6 - (index * 0.1),
        rotateZ: isActive ? 0 : randomRotate,
        z: isActive ? 0 : -50 * (index + 1),
        filter: isActive ? 'blur(0px) brightness(1)' : 'blur(4px) brightness(0.7)' 
      }}
      transition={{
        type: "spring",
        stiffness: isActive ? 200 : 300,
        damping: 25,
        mass: 1
      }}
      // RESPONSIVE SIZING HERE:
      // Mobile: w-[260px] h-[360px]
      // Tablet: w-[300px] h-[440px]
      // Desktop: w-[380px] h-[540px]
      className="absolute 
        w-[260px] h-[360px] 
        sm:w-[300px] sm:h-[440px] 
        md:w-[380px] md:h-[540px] 
        rounded-[20px] md:rounded-[24px] 
        border border-white/10 bg-neutral-900 shadow-2xl cursor-grab active:cursor-grabbing"
    >
      <div className="relative w-full h-full rounded-[20px] md:rounded-[24px] overflow-hidden transform-gpu">
        <Image 
          src={feature.image} 
          alt={feature.title} 
          fill 
          className="object-cover pointer-events-none" 
          priority={isActive}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/90" />
        
        {isActive && (
          <motion.div 
            className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 skew-x-12"
            animate={{ x: ['-100%', '200%'] }}
            transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2, ease: "easeInOut" }}
          />
        )}
      </div>

      <motion.div 
        className="absolute bottom-0 left-0 right-0 p-4 md:p-8 flex justify-between items-end z-20"
        style={{ transform: "translateZ(30px)" }} 
      >
        <div className="flex flex-col gap-1 md:gap-2">
           <motion.div 
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 10 }}
             transition={{ delay: 0.1 }}
             className="flex items-center gap-2"
           >
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: feature.color }}></span>
                <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: feature.color }}></span>
              </span>
              <span className="text-[10px] font-mono uppercase tracking-widest text-white/90 drop-shadow-md">
                Active
              </span>
           </motion.div>
           
           <motion.h4 
             initial={{ opacity: 0, x: -10 }}
             animate={{ opacity: isActive ? 1 : 0, x: isActive ? 0 : -10 }}
             className="text-white font-bold text-lg md:text-xl drop-shadow-lg"
           >
             {feature.title}
           </motion.h4>
        </div>

        <motion.div
           animate={{ scale: isActive ? 1 : 0.8, opacity: isActive ? 1 : 0 }}
           className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center"
        >
           <Globe className="text-white" size={16} />
        </motion.div>
      </motion.div>
      
      <motion.div 
        animate={{ opacity: isActive ? 1 : 0 }}
        className="absolute inset-0 rounded-[20px] md:rounded-[24px] border-2 border-white/20 pointer-events-none"
        style={{ borderColor: isActive ? `${feature.color}40` : 'transparent' }}
      />
    </motion.div>
  );
}