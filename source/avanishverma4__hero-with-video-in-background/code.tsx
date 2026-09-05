
import React, { useState, useEffect, useRef } from 'react';
import { 
  Menu, 
  X, 
  Globe, 
  Play, 
  Sparkles, 
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform, MotionValue } from 'framer-motion';

// --- Components ---

/**
 * Cinematic Video Background with Parallax
 */
function CinematicBackground({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  // Parallax for the background video: moves slower and in the opposite direction to create depth
  const yVideo = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const opacityVideo = useTransform(scrollYProgress, [0, 0.5], [1, 0.3]);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      <motion.div 
        style={{ y: yVideo, opacity: opacityVideo }} 
        className="absolute inset-x-0 -top-20 h-[120%] w-full"
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover brightness-[0.4] scale-110"
          poster="https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&q=80&w=2072"
        >
          <source 
            src="https://cdn.pixabay.com/video/2021/02/11/64917-511355333_large.mp4" 
            type="video/mp4" 
          />
        </video>
        
        {/* Cinematic Vignette & Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,black_90%)] opacity-60" />
      </motion.div>

      {/* Decorative Glows (Aurora effects) */}
      <div className="absolute top-[-10%] left-[-5%] w-[50%] h-[50%] bg-[#9cfc0d]/10 blur-[140px] rounded-full animate-pulse" />
      <div className="absolute bottom-[5%] right-[-5%] w-[40%] h-[40%] bg-blue-600/10 blur-[140px] rounded-full animate-pulse" style={{ animationDelay: '1.5s' }} />
    </div>
  );
}

/**
 * Navigation Bar
 */
function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'py-4 bg-black/80 backdrop-blur-md border-b border-white/10' : 'py-6 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <div 
          className="flex items-center gap-2 group cursor-pointer"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <div className="w-10 h-10 bg-[#9cfc0d] rounded-xl flex items-center justify-center rotate-3 group-hover:rotate-0 transition-transform duration-300 shadow-[0_0_20px_rgba(156,252,13,0.3)]">
            <Globe className="text-black w-6 h-6" />
          </div>
          <span className="text-white font-bold text-xl tracking-tight uppercase">Celestia</span>
        </div>

        <div className="hidden md:flex items-center gap-8" />

        {/* CTA Button */}
        <div className="hidden md:block">
          <motion.button 
            whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.1)", boxShadow: "0 0 20px rgba(255,255,255,0.1)" }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
            className="px-6 py-2.5 bg-white/5 text-white text-sm font-semibold rounded-full border border-white/10 hover:border-white/20 transition-all"
          >
            Get in Touch
          </motion.button>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-white p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-black/95 backdrop-blur-xl border-b border-white/10 overflow-hidden"
          >
            <div className="px-6 py-8 flex flex-col gap-6">
              <motion.button 
                whileTap={{ scale: 0.98 }}
                className="w-full mt-4 py-4 bg-[#9cfc0d] text-black font-bold rounded-xl shadow-[0_0_30px_rgba(156,252,13,0.3)]"
              >
                Get in Touch
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

/**
 * Main Hero Section
 */
function HeroSection() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const yText = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const opacityFade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section id="home" ref={containerRef} className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      <CinematicBackground scrollYProgress={scrollYProgress} />
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 flex flex-col items-center">
        
        <motion.div 
          style={{ y: yText, opacity: opacityFade }}
          className="flex flex-col items-center text-center"
        >
          {/* Animated Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-[#9cfc0d]" />
              <span className="text-[10px] md:text-xs font-bold text-white/80 uppercase tracking-widest">
                Curated Motion Masterpieces
              </span>
            </div>
          </motion.div>

          {/* Main Headline */}
          <div className="relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <h1 className="text-5xl md:text-9xl font-black text-white leading-[1.1] md:leading-[1] tracking-tight mb-8">
                Unleash The <br />
                <span className="relative inline-block">
                  {/* Pulsating background glow */}
                  <motion.span
                    animate={{ 
                      opacity: [0.1, 0.3, 0.1],
                      scale: [1, 1.05, 1]
                    }}
                    transition={{ 
                      duration: 4, 
                      repeat: Infinity, 
                      ease: "easeInOut" 
                    }}
                    className="absolute inset-0 bg-[#9cfc0d] blur-3xl -z-10"
                  />
                  
                  {/* Dynamic Gradient Text without external CSS dependencies */}
                  <motion.span 
                    animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    className="text-transparent bg-clip-text bg-gradient-to-r from-[#9cfc0d] via-emerald-300 to-[#9cfc0d] bg-[length:200%_auto] drop-shadow-[0_0_30px_rgba(156,252,13,0.2)]"
                  >
                    Cinematic Edge
                  </motion.span>

                  {/* Animated Underline */}
                  <motion.span
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: "100%", opacity: 0.5 }}
                    transition={{ duration: 1.2, delay: 0.8, ease: "easeInOut" }}
                    className="absolute left-0 bottom-2 md:bottom-4 h-[1px] md:h-[2px] bg-gradient-to-r from-transparent via-[#9cfc0d] to-transparent"
                  />
                </span>
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="max-w-2xl mx-auto text-white/60 text-lg md:text-2xl font-medium leading-relaxed mb-12"
            >
              Step into a new dimension of visual storytelling with the world's most sophisticated collection of motion assets.
            </motion.p>
          </div>

          {/* Refined Interactive Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-6 items-center justify-center"
          >
            {/* Primary CTA */}
            <motion.button 
              initial="rest"
              whileHover="hover"
              whileTap="tap"
              className="group relative px-10 py-5 bg-[#9cfc0d] text-black font-extrabold text-lg rounded-2xl flex items-center gap-3 overflow-hidden shadow-[0_15px_35px_-10px_rgba(156,252,13,0.4)]"
            >
              <span className="relative z-10 flex items-center gap-2">
                Explore Studio 
                <motion.div
                  variants={{
                    hover: { x: 8, scale: 1.2, rotate: -5 },
                    tap: { x: 4, scale: 0.8 }
                  }}
                  transition={{ type: "spring", stiffness: 600, damping: 20 }}
                >
                  <ArrowRight className="w-5 h-5" />
                </motion.div>
              </span>
              
              <motion.div 
                className="absolute inset-0 bg-[#9cfc0d] blur-xl opacity-0 rounded-2xl scale-150"
                variants={{ hover: { opacity: 0.4, scale: 1.1 } }}
              />

              {/* Liquid Lightsweep */}
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent skew-x-[-20deg]"
                variants={{ hover: { left: ["-100%", "200%"] } }}
                transition={{ duration: 1.2, ease: "easeInOut", repeat: Infinity, repeatDelay: 1 }}
                initial={{ left: "-100%" }}
              />

              <motion.div 
                className="absolute inset-0"
                variants={{
                  hover: { scale: 1.05 },
                  tap: { scale: 0.9, backgroundColor: "rgba(0,0,0,0.05)" }
                }}
                transition={{ type: "spring", stiffness: 800, damping: 30 }}
              />
            </motion.button>
            
            {/* Secondary CTA */}
            <motion.button 
              initial="rest"
              whileHover="hover"
              whileTap="tap"
              className="group relative px-10 py-5 bg-white/5 text-white font-bold text-lg rounded-2xl border border-white/10 flex items-center gap-3 backdrop-blur-3xl overflow-hidden"
            >
              <motion.div
                variants={{
                  hover: { scale: 1.25, rotate: 10, filter: "drop-shadow(0 0 8px rgba(156,252,13,0.8))" },
                  tap: { scale: 0.8, rotate: -10 }
                }}
                className="relative z-10"
              >
                <Play className="w-5 h-5 fill-[#9cfc0d] text-[#9cfc0d]" /> 
              </motion.div>
              
              <span className="relative z-10">View Showcase</span>
              
              <motion.div 
                className="absolute inset-0"
                variants={{
                  hover: { 
                    scale: 1.05, 
                    backgroundColor: "rgba(255, 255, 255, 0.12)",
                    borderColor: "rgba(255, 255, 255, 0.3)"
                  },
                  tap: { scale: 0.92 }
                }}
                transition={{ type: "spring", stiffness: 800, damping: 30 }}
              />
            </motion.button>
          </motion.div>
        </motion.div>
      </div>

      <div className="absolute top-[15%] left-[-15%] w-[40%] aspect-square bg-blue-900/5 blur-[180px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[10%] right-[-15%] w-[50%] aspect-square bg-[#9cfc0d]/5 blur-[180px] rounded-full pointer-events-none" />
    </section>
  );
}

/**
 * Main App Entry
 */
export default function App() {
  return (
    <div className="w-full min-h-screen bg-black text-white selection:bg-[#9cfc0d] selection:text-black antialiased overflow-x-hidden">
      <Navbar />
      <main>
        <HeroSection />
      </main>
    </div>
  );
}
