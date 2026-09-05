import React, { useRef, useMemo, useCallback, useState, useEffect } from 'react';
import { motion, AnimatePresence, useSpring, useTransform } from 'framer-motion';

// Mock Canvas components since we can't use real Three.js in this environment
const MockCanvas = ({ children, camera, gl }: any) => (
  <div className="relative w-full h-full bg-black overflow-hidden">
    {/* Orthogonal Grid Background */}
    <div className="absolute inset-0 opacity-20">
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
    </div>
    
    {/* Subtle center glow */}
    <div className="absolute inset-0 bg-gradient-radial from-zinc-900/20 via-transparent to-transparent" />
    
    {children}
  </div>
);

const MockGalleryScene = ({ images }: any) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [direction, setDirection] = useState(0);
  const lastInteraction = useRef(Date.now());

  // Smooth spring animations
  const springConfig = { stiffness: 100, damping: 30, mass: 1 };

  useEffect(() => {
    const interval = setInterval(() => {
      if (isAutoPlaying) {
        setDirection(1);
        setCurrentIndex((prev) => (prev + 1) % images.length);
      }
    }, 2500);
    return () => clearInterval(interval);
  }, [isAutoPlaying, images.length]);

  useEffect(() => {
    const checkAutoPlay = setInterval(() => {
      if (Date.now() - lastInteraction.current > 3000) {
        setIsAutoPlaying(true);
      }
    }, 1000);
    return () => clearInterval(checkAutoPlay);
  }, []);

  const handleInteraction = (delta: number) => {
    setIsAutoPlaying(false);
    lastInteraction.current = Date.now();
    setDirection(delta);
    setCurrentIndex((prev) => {
      const next = prev + delta;
      if (next < 0) return images.length - 1;
      if (next >= images.length) return 0;
      return next;
    });
  };

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      handleInteraction(e.deltaY > 0 ? 1 : -1);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        handleInteraction(-1);
      } else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        handleInteraction(1);
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const getVisibleImages = () => {
    const visible = [];
    for (let i = -2; i <= 2; i++) {
      const index = (currentIndex + i + images.length) % images.length;
      visible.push({ image: images[index], offset: i, key: `${index}-${i}` });
    }
    return visible;
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center perspective-1000">
      <AnimatePresence mode="popLayout" initial={false}>
        {getVisibleImages().map(({ image, offset, key }) => {
          const zIndex = 50 - Math.abs(offset) * 10;
          const scale = 1 - Math.abs(offset) * 0.15;
          const opacity = offset === 0 ? 1 : 0.3 - Math.abs(offset) * 0.1;
          const translateZ = -offset * 300;
          const translateX = offset * 150;
          const blur = Math.abs(offset) * 2;
          const rotateY = offset * 5;

          return (
            <motion.div
              key={key}
              className="absolute"
              style={{ zIndex }}
              initial={{ 
                x: direction > 0 ? 200 : -200,
                opacity: 0,
                scale: 0.8,
              }}
              animate={{
                x: translateX,
                opacity: opacity,
                scale: scale,
                rotateY: rotateY,
                filter: `blur(${blur}px)`,
              }}
              exit={{
                x: direction > 0 ? -200 : 200,
                opacity: 0,
                scale: 0.8,
              }}
              transition={{
                type: "spring",
                stiffness: 80,
                damping: 25,
                mass: 0.8,
              }}
            >
              <motion.div 
                className="relative w-[500px] h-[350px] rounded-lg overflow-hidden shadow-2xl ring-1 ring-white/10"
                whileHover={{ 
                  scale: offset === 0 ? 1.05 : 1.02,
                  rotateY: 0,
                  transition: { type: "spring", stiffness: 300, damping: 20 }
                }}
              >
                <motion.img
                  src={typeof image === 'string' ? image : image.src}
                  alt={typeof image === 'string' ? '' : image.alt || ''}
                  className="w-full h-full object-cover"
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </motion.div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

// Main Gallery Component
function InfiniteGallery({ images, className = 'h-96 w-full', style }: any) {
  return (
    <div className={className} style={style}>
      <MockCanvas camera={{ position: [0, 0, 0], fov: 55 }} gl={{ antialias: true, alpha: true }}>
        <MockGalleryScene images={images} />
      </MockCanvas>
    </div>
  );
}

// Demo Implementation
export default function Demo() {
  const sampleImages = [
    {
      src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80",
      alt: "Mountain landscape",
    },
    {
      src: "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=1200&q=80",
      alt: "Ocean waves",
    },
    {
      src: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&q=80",
      alt: "Forest path",
    },
    {
      src: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=1200&q=80",
      alt: "Desert dunes",
    },
    {
      src: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=1200&q=80",
      alt: "City skyline",
    },
    {
      src: "https://images.unsplash.com/photo-1483347756197-71ef80e95f73?w=1200&q=80",
      alt: "Northern lights",
    },
    {
      src: "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=1200&q=80",
      alt: "Waterfall",
    },
    {
      src: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80",
      alt: "Sunset beach",
    },
  ];

  return (
    <main className="min-h-screen w-full bg-black">
      <InfiniteGallery
        images={sampleImages}
        speed={1.2}
        zSpacing={3}
        visibleCount={12}
        className="h-screen w-full"
      />
      
      {/* Header Text */}
      <motion.div 
        className="h-screen inset-0 pointer-events-none fixed flex items-center justify-center text-center px-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
      >
        <div className="relative">
          <motion.h1 
            className="font-light text-5xl md:text-8xl tracking-tight text-white mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            Visual <motion.span 
              className="font-extralight italic text-zinc-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.8 }}
            >Stories</motion.span>
          </motion.h1>
          <motion.p 
            className="text-zinc-400 text-sm md:text-base tracking-widest uppercase font-light"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            Immersive Photography Experience
          </motion.p>
        </div>
      </motion.div>

      {/* Bottom Instructions */}
      <motion.div 
        className="text-center fixed bottom-10 left-0 right-0 font-mono text-xs tracking-wider text-zinc-500"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.2 }}
      >
        <p className="mt-1 text-[10px] text-zinc-600">Scroll • Auto-play resumes after 3s inactivity</p>
      </motion.div>

      {/* Corner Logo/Brand */}
      <motion.div 
        className="fixed top-8 left-8 z-50"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="text-white font-light tracking-widest text-sm">
          <span className="font-semibold">GALLERY</span>
          <span className="text-zinc-600 ml-2">3D</span>
        </div>
      </motion.div>
    </main>
  );
}