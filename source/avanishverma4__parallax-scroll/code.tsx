import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from 'framer-motion';

// ============================================================================
// UTILITIES
// ============================================================================

// Class name utility (simplified cn helper)
const cn = (...classes: (string | boolean | undefined)[]) => {
  return classes.filter(Boolean).join(' ');
};

// ============================================================================
// PARALLAX IMAGE COMPONENT
// ============================================================================

interface ParallaxImageProps {
  src: string;
  alt: string;
  y: any;
  scale: any;
}

const ParallaxImage: React.FC<ParallaxImageProps> = ({ src, alt, y, scale }) => {
  const shouldReduceMotion = useReducedMotion();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (shouldReduceMotion) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
    const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
    setMousePosition({ x: x * 20, y: y * 20 });
  };

  return (
    <motion.div
      style={{
        y: shouldReduceMotion ? 0 : y,
        scale: shouldReduceMotion ? 1 : scale,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setMousePosition({ x: 0, y: 0 })}
      className="relative w-full h-full flex items-center justify-center"
    >
      <motion.div
        animate={{
          x: mousePosition.x,
          y: mousePosition.y,
        }}
        transition={{ type: 'spring', stiffness: 150, damping: 20 }}
        className="relative w-full max-w-lg lg:max-w-2xl"
        style={{
          // Hardware acceleration for smooth parallax
          transform: 'translate3d(0, 0, 0)',
          willChange: 'transform',
        }}
      >
        {/* Image container with border treatment */}
        <div className="relative aspect-[4/5] w-full">
          <div className="absolute inset-0 border-4 border-black" />
          <img
            src={src}
            alt={alt}
            className="w-full h-full object-cover grayscale"
            loading="eager"
          />
          {/* Overlay for contrast */}
          <div className="absolute inset-0 bg-black/10 mix-blend-overlay" />
        </div>
      </motion.div>
    </motion.div>
  );
};

// ============================================================================
// HERO TEXT COMPONENT
// ============================================================================

interface HeroTextProps {
  y: any;
  opacity: any;
}

const HeroText: React.FC<HeroTextProps> = ({ y, opacity }) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      style={{
        y: shouldReduceMotion ? 0 : y,
        opacity: shouldReduceMotion ? 1 : opacity,
      }}
      className="relative z-10 space-y-6"
    >
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight text-black"
      >
        Premium
        <br />
        <span className="italic font-light">Experience</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="text-lg sm:text-xl lg:text-2xl text-gray-700 max-w-xl leading-relaxed"
      >
        Elegant design meets cutting-edge technology. Experience the future of
        digital craftsmanship with our premium parallax interface.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="flex flex-wrap gap-4 pt-4"
      >
        <button className="px-8 py-4 bg-black text-white font-semibold border-2 border-black transition-all hover:bg-white hover:text-black">
          Explore More
        </button>
        <button className="px-8 py-4 bg-white text-black font-semibold border-2 border-black transition-all hover:bg-black hover:text-white">
          Learn More
        </button>
      </motion.div>
    </motion.div>
  );
};

// ============================================================================
// MAIN PARALLAX HERO COMPONENT
// ============================================================================

const ParallaxHero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // Scroll progress tracking
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  // Smooth spring physics for parallax
  const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 };
  const smoothProgress = useSpring(scrollYProgress, springConfig);

  // Multi-layer parallax transforms
  // Image layer (midground) - moderate movement
  const imageY = useTransform(smoothProgress, [0, 1], [0, shouldReduceMotion ? 0 : 300]);
  const imageScale = useTransform(smoothProgress, [0, 0.5], [1, shouldReduceMotion ? 1 : 1.1]);

  // Text layer (foreground) - fastest movement for depth
  const textY = useTransform(smoothProgress, [0, 1], [0, shouldReduceMotion ? 0 : -150]);
  const textOpacity = useTransform(smoothProgress, [0, 0.5], [1, 0]);

  return (
    <div
      ref={containerRef}
      className="relative min-h-[150vh] bg-white text-black overflow-hidden"
    >
      {/* Main content container */}
      <div className="sticky top-0 h-screen">
        <div className="relative h-full">
          <div className="container mx-auto px-6 sm:px-8 lg:px-12 h-full">
            {/* Responsive layout: stack on mobile, side-by-side on desktop */}
            <div className="h-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center py-12 lg:py-0">
              
              {/* Text content - left side on desktop, top on mobile */}
              <div className="flex items-center justify-center lg:justify-start order-2 lg:order-1">
                <HeroText y={textY} opacity={textOpacity} />
              </div>

              {/* Image - right side on desktop, bottom on mobile */}
              <div className="flex items-center justify-center order-1 lg:order-2 min-h-[400px] lg:min-h-0">
                <ParallaxImage
                  src="https://plus.unsplash.com/premium_photo-1709678337824-adc29e1b6b09?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
                  alt="Premium architectural design showcasing modern minimalism"
                  y={imageY}
                  scale={imageScale}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Extended scroll space for parallax effect */}
      <div className="h-[50vh]" />
    </div>
  );
};

// ============================================================================
// DEMO CONTENT SECTION
// ============================================================================

const DemoContent: React.FC = () => {
  return (
    <div className="bg-gray-50 text-black py-24 px-6">
      <div className="container mx-auto max-w-4xl">
        <h2 className="text-4xl font-bold mb-6">Scroll Experience</h2>
        <p className="text-xl text-gray-700 leading-relaxed">
          The parallax effect creates depth through multi-layer movement. The
          image and text move at different speeds, creating an immersive
          three-dimensional experience. This design respects user preferences
          for reduced motion and maintains accessibility standards throughout.
        </p>
      </div>
    </div>
  );
};

// ============================================================================
// APP ROOT
// ============================================================================

export default function App() {
  return (
    <div className="antialiased">
      <ParallaxHero />
      <DemoContent />
    </div>
  );
}