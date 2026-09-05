"use client";

import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

// Generate a random number between min and max
const random = (min: number, max: number) => Math.random() * (max - min) + min;

// Product photography with organic blob shapes - vibrant, clear subjects
const initialImages = [
  {
    src: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=2680",
    className: "w-[160px] h-[160px] sm:w-[200px] sm:h-[200px] md:w-[260px] md:h-[260px] rounded-full",
    initialRotate: -3,
    duration: 3.5,
  },
  {
    src: "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?q=80&w=2600",
    className: "w-[180px] h-[220px] sm:w-[240px] sm:h-[280px] md:w-[300px] md:h-[340px] rounded-[40%_60%_60%_40%/60%_30%_70%_40%]",
    initialRotate: 4,
    duration: 4.2,
  },
  {
    src: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2670",
    className: "w-[160px] h-[160px] sm:w-[220px] sm:h-[220px] md:w-[280px] md:h-[280px] rounded-[30%_70%_70%_30%/30%_30%_70%_70%]",
    initialRotate: -5,
    duration: 3.8,
  },
  {
    src: "https://images.unsplash.com/photo-1484704849700-f032a568e944?q=80&w=2670",
    className: "w-[180px] h-[140px] sm:w-[260px] sm:h-[200px] md:w-[320px] md:h-[260px] rounded-[50px]",
    initialRotate: 6,
    duration: 4.0,
  },
  {
    src: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=2574",
    className: "w-[140px] h-[180px] sm:w-[180px] sm:h-[240px] md:w-[240px] md:h-[300px] rounded-full",
    initialRotate: 2,
    duration: 3.6,
  },
  {
    src: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=2670",
    className: "w-[180px] h-[180px] sm:w-[240px] sm:h-[240px] md:w-[300px] md:h-[300px] rounded-[40%_60%_50%_50%/50%_50%_50%_50%]",
    initialRotate: -4,
    duration: 4.5,
  },
  {
    src: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=2670",
    className: "w-[140px] h-[200px] sm:w-[200px] sm:h-[280px] md:w-[260px] md:h-[340px] rounded-[60px]",
    initialRotate: 7,
    duration: 3.4,
  },
  {
    src: "https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=2584",
    className: "w-[160px] h-[160px] sm:w-[220px] sm:h-[220px] md:w-[280px] md:h-[280px] rounded-full",
    initialRotate: -2,
    duration: 4.1,
  },
  {
    src: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?q=80&w=2688",
    className: "w-[180px] h-[140px] sm:w-[260px] sm:h-[200px] md:w-[320px] md:h-[260px] rounded-[35%_65%_65%_35%/35%_35%_65%_65%]",
    initialRotate: 5,
    duration: 3.9,
  },
  {
    src: "https://plus.unsplash.com/premium_photo-1670452415632-488a882c76c7?q=80&w=1896&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    className: "w-[140px] h-[140px] sm:w-[200px] sm:h-[200px] md:w-[260px] md:h-[260px] rounded-full",
    initialRotate: -6,
    duration: 4.3,
  },
  {
    src: "https://images.unsplash.com/photo-1560343090-f0409e92791a?q=80&w=2564",
    className: "w-[180px] h-[220px] sm:w-[240px] sm:h-[280px] md:w-[300px] md:h-[340px] rounded-[45%_55%_60%_40%/55%_45%_55%_45%]",
    initialRotate: 3,
    duration: 3.7,
  },
  {
    src: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2670",
    className: "w-[160px] h-[160px] sm:w-[220px] sm:h-[220px] md:w-[280px] md:h-[280px] rounded-[50px]",
    initialRotate: -7,
    duration: 4.4,
  },
  {
    src: "https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?q=80&w=2670",
    className: "w-[140px] h-[180px] sm:w-[200px] sm:h-[260px] md:w-[260px] md:h-[320px] rounded-full",
    initialRotate: 4,
    duration: 3.3,
  },
  {
    src: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=2599",
    className: "w-[180px] h-[180px] sm:w-[240px] sm:h-[240px] md:w-[300px] md:h-[300px] rounded-[40%_60%_55%_45%/50%_50%_50%_50%]",
    initialRotate: -3,
    duration: 4.6,
  },
  {
    src: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=2680",
    className: "w-[160px] h-[140px] sm:w-[220px] sm:h-[200px] md:w-[280px] md:h-[260px] rounded-[60px]",
    initialRotate: 6,
    duration: 3.2,
  },
  {
    src: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?q=80&w=2670", // AI Face
    className: "w-[180px] h-[220px] sm:w-[240px] sm:h-[300px] md:w-[280px] md:h-[360px] rounded-full",
    initialRotate: -7,
    duration: 4.3,
  }
];

export default function FluidSpatialHero() {
  const [mounted, setMounted] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [images, setImages] = useState(initialImages.map(img => ({ ...img, style: { top: "0%", left: "0%" } })));

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const smoothX = useSpring(mouseX, { damping: 30, stiffness: 400, mass: 0.5 });
  const smoothY = useSpring(mouseY, { damping: 30, stiffness: 400, mass: 0.5 });

  // Aura follows mouse slightly slower
  const auraX = useSpring(mouseX, { damping: 40, stiffness: 200, mass: 1 });
  const auraY = useSpring(mouseY, { damping: 40, stiffness: 200, mass: 1 });

  const canvasX = useSpring(mouseX, { damping: 30, stiffness: 200, mass: 0.8 });
  const canvasY = useSpring(mouseY, { damping: 30, stiffness: 200, mass: 0.8 });

  useEffect(() => {
    setMounted(true);
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });

    // Exact 4x4 Grid over 250vw/250vh canvas guarantees ZERO overlap and even distribution.
    const rows = 4;
    const cols = 4;
    // Shuffle the cell assignments so images appear in different spots on refresh
    const cells = Array.from({ length: 16 }, (_, i) => i).sort(() => Math.random() - 0.5);

    const randomizedImages = initialImages.map((img, i) => {
      const cell = cells[i];
      const row = Math.floor(cell / cols);
      const col = cell % cols;

      const cellWidth = 100 / cols; // 25% of the 250vw canvas
      const cellHeight = 100 / rows; // 25% of the 250vh canvas

      // Pad deeply inside the cell to avoid touching adjacent cells
      const left = random(col * cellWidth + 2, (col + 1) * cellWidth - 12);
      const top = random(row * cellHeight + 2, (row + 1) * cellHeight - 12);

      return {
        ...img,
        style: { top: `${top}%`, left: `${left}%` }
      };
    });

    setImages(randomizedImages);

    mouseX.set(window.innerWidth / 2);
    mouseY.set(window.innerHeight / 2);

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
    };
  }, [mouseX, mouseY]);

  const normalizedX = useTransform(canvasX, (x: number) => {
    if (windowSize.width === 0) return 0;
    return (x / windowSize.width - 0.5) * 2;
  });

  const normalizedY = useTransform(canvasY, (y: number) => {
    if (windowSize.height === 0) return 0;
    return (y / windowSize.height - 0.5) * 2;
  });

  const translateX = useTransform(normalizedX, [-1, 1], [350, -350]);
  const translateY = useTransform(normalizedY, [-1, 1], [350, -350]);

  // Search box parallax moves slightly opposite to the canvas to make it feel 3D and interactive
  const boxTranslateX = useTransform(normalizedX, [-1, 1], [-20, 20]);
  const boxTranslateY = useTransform(normalizedY, [-1, 1], [-20, 20]);

  if (!mounted) return null;

  return (
    <div className="h-screen w-full overflow-hidden relative cursor-none bg-[#FAFAFA] dark:bg-[#0A0A0A] transition-colors duration-500">

      {/* Animated and interactive gradient background layer (No grid, plain clean canvas) */}
      <motion.div
        className="absolute inset-0 z-0 pointer-events-none"
      >
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] bg-violet-300 rounded-full blur-[100px] md:blur-[140px] opacity-40 dark:opacity-20 mix-blend-multiply dark:mix-blend-screen transition-opacity duration-500"
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], rotate: [0, -90, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute top-[20%] right-[-10%] w-[50vw] h-[50vw] bg-sky-300 rounded-full blur-[100px] md:blur-[140px] opacity-40 dark:opacity-20 mix-blend-multiply dark:mix-blend-screen transition-opacity duration-500"
        />
        <motion.div
          animate={{ scale: [1, 1.3, 1], rotate: [0, 45, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-20%] left-[20%] w-[70vw] h-[70vw] bg-amber-200 rounded-full blur-[120px] md:blur-[160px] opacity-30 dark:opacity-10 mix-blend-multiply dark:mix-blend-screen transition-opacity duration-500"
        />
        <motion.div
          animate={{ scale: [1.1, 0.9, 1.1], rotate: [0, -45, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-10%] right-[10%] w-[40vw] h-[40vw] bg-rose-300 rounded-full blur-[100px] md:blur-[120px] opacity-30 dark:opacity-10 mix-blend-multiply dark:mix-blend-screen transition-opacity duration-500"
        />
      </motion.div>

      {/* Interactive Canvas - Exact 4x4 distribution ensuring zero overlap */}
      <motion.div
        className="absolute z-10 w-[250vw] h-[250vh] left-[-75vw] top-[-75vh]"
        style={{
          x: translateX,
          y: translateY,
        }}
      >
        {images.map((img, index) => (
          <motion.div
            key={index}
            className={`absolute shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden border border-black/5 dark:border-white/5 bg-white/50 dark:bg-black/50 backdrop-blur-sm transition-colors duration-500 ${img.className}`}
            style={{
              ...img.style,
            }}
            initial={{ rotate: img.initialRotate }}
            animate={{
              y: [0, -40, 0],
              x: [0, 20, 0],
              rotate: [img.initialRotate, img.initialRotate + 5, img.initialRotate],
            }}
            transition={{
              duration: img.duration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: index * 0.1,
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-white/30 dark:from-white/10 to-transparent z-10 mix-blend-overlay dark:mix-blend-lighten pointer-events-none transition-colors duration-500" />
            <img
              src={img.src}
              alt={`Gallery image ${index + 1}`}
              className="w-full h-full object-cover pointer-events-none dark:opacity-90 transition-opacity duration-500"
              draggable={false}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Liquid Glass Search Box & Header */}
      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none gap-6 md:gap-8 px-4"
        style={{ x: boxTranslateX, y: boxTranslateY }}
      >
        {/* Header */}
        <div className="text-center flex flex-col items-center mt-[-15vh] md:mt-[-10vh]">
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 drop-shadow-2xl mb-3 md:mb-4 transition-all duration-500">
            NEXUS
          </h1>
          <p className="text-gray-700 dark:text-gray-300 font-medium text-base sm:text-lg md:text-xl max-w-lg text-center leading-relaxed transition-colors duration-500">
            Design the future with AI-powered spatial generation. <br className="hidden md:block" />
            Describe your vision and watch it come to life.
          </p>
        </div>

        {/* Search Box - Ultra-Soft Liquid Glass (SS-2 Inspired) */}
        <div className="pointer-events-auto relative w-[calc(100%-2rem)] md:w-full max-w-[800px] mx-auto p-4 sm:p-5 md:p-6 rounded-[2rem] sm:rounded-[2.5rem] bg-white/30 dark:bg-white/10 backdrop-blur-2xl border border-white/40 dark:border-white/10 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.03),0_0_1px_rgba(255,255,255,0.8),inset_0_1px_2px_rgba(255,255,255,0.9)] dark:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.3),0_0_1px_rgba(255,255,255,0.2),inset_0_1px_2px_rgba(255,255,255,0.2)] flex flex-col gap-3 sm:gap-4 group transition-all duration-500 hover:bg-white/40 dark:hover:bg-white/15 hover:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.04),0_0_1px_rgba(255,255,255,0.9),inset_0_1px_2px_rgba(255,255,255,1)] dark:hover:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.4),0_0_1px_rgba(255,255,255,0.3),inset_0_1px_2px_rgba(255,255,255,0.3)]">

          {/* Inner glossy highlight - softer and more subtle */}
          <div className="absolute inset-0 rounded-[2rem] sm:rounded-[2.5rem] bg-gradient-to-b from-white/60 dark:from-white/20 via-white/10 dark:via-transparent to-transparent pointer-events-none opacity-70 transition-opacity duration-500" />

          {/* Text Input */}
          <textarea
            placeholder="Describe your design..."
            className="w-full bg-transparent text-gray-800 dark:text-white placeholder:text-gray-400/70 dark:placeholder:text-gray-400 text-lg sm:text-xl md:text-2xl font-normal outline-none resize-none min-h-[80px] sm:min-h-[100px] md:min-h-[120px] relative z-10 pt-1 sm:pt-2 selection:bg-indigo-400/15 dark:selection:bg-indigo-400/30 transition-colors duration-500"
            style={{ cursor: "none" }} // keep custom cursor vibe
          />

          {/* Bottom Controls */}
          <div className="flex flex-row items-center justify-between relative z-10 mt-1 sm:mt-2">
            {/* Left Actions */}
            <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3">
              <button className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-white/60 dark:bg-white/10 hover:bg-white/80 dark:hover:bg-white/20 border border-gray-200/30 dark:border-white/10 shadow-[0_2px_8px_rgba(0,0,0,0.03)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.2)] flex items-center justify-center transition-all text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="sm:w-[20px] sm:h-[20px]"><path d="M12 5v14M5 12h14" /></svg>
              </button>
              <button className="h-9 sm:h-10 md:h-12 px-3 sm:px-4 md:px-5 rounded-full bg-white/60 dark:bg-white/10 hover:bg-white/80 dark:hover:bg-white/20 border border-gray-200/30 dark:border-white/10 shadow-[0_2px_8px_rgba(0,0,0,0.03)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.2)] flex items-center gap-1.5 sm:gap-2 transition-all text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="sm:w-[16px] sm:h-[16px]"><rect x="5" y="2" width="14" height="20" rx="2" ry="2" /><path d="M12 18h.01" /></svg>
                <span className="font-medium text-xs sm:text-sm">App</span>
              </button>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3">
              <button className="h-9 sm:h-10 md:h-12 px-3 sm:px-4 md:px-5 rounded-full bg-white/70 dark:bg-white/10 hover:bg-white/90 dark:hover:bg-white/20 border border-gray-200/40 dark:border-white/10 flex items-center gap-1.5 sm:gap-2 transition-all text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white shadow-[0_2px_8px_rgba(0,0,0,0.03)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.2)]">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="sm:w-[16px] sm:h-[16px]">
                  <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" fill="url(#sparkle-gradient)" />
                  <defs>
                    <linearGradient id="sparkle-gradient" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#10b981" />
                      <stop offset="1" stopColor="#3b82f6" />
                    </linearGradient>
                  </defs>
                </svg>
                <span className="font-medium text-xs sm:text-sm whitespace-nowrap hidden sm:inline-block">3.0 Flash</span>
                <span className="font-medium text-xs sm:text-sm whitespace-nowrap sm:hidden">Flash</span>
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400 ml-0.5 shadow-[0_0_6px_rgba(251,191,36,0.5)]" />
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-40 sm:w-[14px] sm:h-[14px]"><path d="M6 9l6 6 6-6" /></svg>
              </button>
              <button className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-gray-800 dark:bg-white hover:bg-gray-900 dark:hover:bg-gray-100 border border-gray-700/50 dark:border-white/50 flex items-center justify-center transition-all text-white dark:text-gray-900 shadow-[0_3px_10px_rgba(0,0,0,0.12)] dark:shadow-[0_3px_10px_rgba(255,255,255,0.2)] flex-shrink-0">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="sm:w-[18px] sm:h-[18px]"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Custom Trailing Cursor Aura */}
      <motion.div
        className="fixed top-0 left-0 w-32 h-32 bg-black/5 dark:bg-white/5 rounded-full z-40 pointer-events-none blur-xl transition-colors duration-500 hidden sm:block"
        style={{
          x: auraX,
          y: auraY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      />

      {/* Custom Trailing Cursor Dot */}
      <motion.div
        className="fixed top-0 left-0 w-4 h-4 bg-indigo-950 dark:bg-indigo-300 rounded-full z-50 pointer-events-none shadow-lg transition-colors duration-500 hidden md:block"
        style={{
          x: smoothX,
          y: smoothY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      />
    </div>
  );
}
