import React, { useEffect, useRef, useState, useMemo } from 'react';
import { motion, useScroll, useTransform, useMotionValue } from 'framer-motion';

// 21st.dev-friendly React component
// - Default export
// - Tailwind CSS for styling
// - Modular, memoized layers to avoid unnecessary re-renders
// - Small, documented and accessible

export default function CelestialScene(): JSX.Element {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [isLoaded, setIsLoaded] = useState(false);

  // Parallax transforms driven by scroll
  const yBg = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const yStars = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const yClouds = useTransform(scrollYProgress, [0, 1], ['0%', '25%']);
  const yMountains = useTransform(scrollYProgress, [0, 1], ['0%', '15%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.85, 0.7]);

  useEffect(() => {
    setIsLoaded(true);

    const handleMouse = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth - 0.5) * 30; // wider range for nicer parallax
      const ny = (e.clientY / window.innerHeight - 0.5) * 30;
      mouseX.set(nx);
      mouseY.set(ny);
    };

    window.addEventListener('mousemove', handleMouse);
    return () => window.removeEventListener('mousemove', handleMouse);
  }, [mouseX, mouseY]);

  // memoize random positions so they don't change every render
  const starsLayer1 = useMemo(() => generateStars(60, { verticalSpread: 0.6 }), []);
  const starsLayer2 = useMemo(() => generateStars(100, { verticalSpread: 0.75 }), []);
  const shootingStars = useMemo(() => generateShootingStars(3), []);
  const clouds = useMemo(() => Array.from({ length: 5 }).map((_, i) => i), []);

  return (
    <div ref={containerRef} className="relative w-full min-h-[300vh] bg-black overflow-x-hidden">
      {/* Fixed Scene Background (parallax + opacity) */}
      <motion.div
        className="fixed inset-0 w-full h-screen overflow-hidden"
        style={{ y: yBg, opacity }}
        aria-hidden
      >
        <GradientBackdrop />
        <AuroraEffect />

        {/* Stars Layer 1 (large, twinkling) */}
        <motion.div className="absolute inset-0" style={{ y: yStars, x: mouseX }}>
          {starsLayer1.map((s, i) => (
            <motion.span
              key={`s1-${i}`}
              className="absolute block rounded-full"
              style={{
                left: s.left,
                top: s.top,
                width: s.size,
                height: s.size,
                boxShadow: '0 0 8px rgba(34,211,238,0.85)',
                backgroundColor: 'rgba(56,189,248,0.95)'
              }}
              animate={{ opacity: [0.25, 1, 0.25], scale: [0.85, 1.2, 0.85] }}
              transition={{ duration: s.duration, repeat: Infinity, delay: s.delay }}
            />
          ))}
        </motion.div>

        {/* Stars Layer 2 (ambient) */}
        <motion.div className="absolute inset-0" style={{ x: useTransform(mouseX, (v) => v * 0.6) }}>
          {starsLayer2.map((s, i) => (
            <span
              key={`s2-${i}`}
              className="absolute rounded-full opacity-70"
              style={{ left: s.left, top: s.top, width: s.sizeSmall, height: s.sizeSmall, background: 'rgba(167,243,208,0.9)' }}
            />
          ))}
        </motion.div>

        {/* Shooting Stars */}
        {shootingStars.map((st) => (
          <motion.span
            key={`shoot-${st.id}`}
            className="absolute block rounded-full"
            style={{ left: st.left, top: st.top, width: 2, height: 2, boxShadow: '0 0 18px rgba(255,255,255,0.9)', background: 'white' }}
            animate={{ x: [0, st.dx], y: [0, st.dy], opacity: [0, 1, 0] }}
            transition={{ duration: st.duration, ease: 'easeOut', repeat: Infinity, delay: st.delay }}
          />
        ))}

        {/* Clouds (floating, subtle) */}
        <motion.div className="absolute inset-0 top-1/3 pointer-events-none" style={{ y: yClouds }}>
          {clouds.map((i) => (
            <motion.div
              key={`cloud-${i}`}
              className="absolute opacity-20"
              style={{ left: `${i * 22}%`, top: `${8 + i * 12}%` }}
              animate={{ x: [0, 80, 0], scale: [1, 1.06, 1] }}
              transition={{ duration: 28 + i * 6, repeat: Infinity, ease: 'linear' }}
            >
              <svg width="240" height="70" viewBox="0 0 240 70" fill="none" xmlns="http://www.w3.org/2000/svg">
                <ellipse cx="60" cy="35" rx="60" ry="30" fill="white" opacity="0.28" />
                <ellipse cx="120" cy="30" rx="72" ry="36" fill="white" opacity="0.36" />
                <ellipse cx="180" cy="35" rx="60" ry="30" fill="white" opacity="0.28" />
              </svg>
            </motion.div>
          ))}
        </motion.div>

        {/* Mountains */}
        <motion.div className="absolute bottom-0 left-0 right-0 h-[60vh]" style={{ y: yMountains }}>
          <Mountains />
        </motion.div>
      </motion.div>

      {/* Foreground / Content (z-index above the scene) */}
      <main className="relative z-50">
        <section className="min-h-screen flex items-center justify-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 1.1, ease: 'easeOut' }}
            className="text-center"
          >
            <motion.h1
              className="text-5xl md:text-7xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 via-emerald-300 to-teal-300"
              style={{ backgroundSize: '200% auto' }}
              animate={{ backgroundPosition: ['0% 0%', '100% 0%', '0% 0%'] }}
              transition={{ duration: 9, repeat: Infinity, ease: 'linear' }}
            >
              Game On
            </motion.h1>

            <motion.p className="text-lg md:text-xl text-cyan-200 mb-8 max-w-2xl mx-auto" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4, duration: 0.9 }}>
              Enter the ultimate gaming arena where legends are born
            </motion.p>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="px-7 py-3 rounded-full font-semibold shadow-lg bg-gradient-to-r from-cyan-500 to-emerald-500 text-white"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              aria-label="Start playing"
            >
              Start Playing
            </motion.button>
          </motion.div>
        </section>

        <section className="min-h-screen flex items-center justify-center px-6 py-20">
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl w-full">
            {[
              { title: 'Infinite Wonder', desc: 'Discover the mysteries of the cosmos', icon: '✨' },
              { title: 'Stellar Beauty', desc: 'Experience breathtaking celestial views', icon: '🌟' },
              { title: 'Cosmic Peace', desc: 'Find tranquility among the stars', icon: '🌙' }
            ].map((card, i) => (
              <motion.article
                key={card.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ delay: i * 0.12, duration: 0.6 }}
                className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 hover:border-purple-400/50 transition-colors"
                aria-labelledby={`card-${i}-title`}
              >
                <div className="text-4xl mb-4" aria-hidden>
                  {card.icon}
                </div>
                <h3 id={`card-${i}-title`} className="text-2xl font-bold mb-3 text-white">
                  {card.title}
                </h3>
                <p className="text-purple-200">{card.desc}</p>
              </motion.article>
            ))}
          </div>
        </section>

        <section className="min-h-screen flex items-center justify-center px-6">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 1 }} className="text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">Your Adventure Awaits</h2>
            <p className="text-lg text-purple-200 max-w-2xl mx-auto">Scroll back up to experience the magic again, or venture deeper into the cosmos.</p>
          </motion.div>
        </section>
      </main>
    </div>
  );
}

/* --------------------------- Helper components --------------------------- */

function GradientBackdrop() {
  return <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-cyan-950 to-emerald-950" />;
}

function AuroraEffect() {
  return (
    <motion.div
      className="absolute inset-0 opacity-30"
      animate={{
        background: [
          'radial-gradient(ellipse at 20% 30%, rgba(6,182,212,0.36) 0%, transparent 50%)',
          'radial-gradient(ellipse at 80% 40%, rgba(16,185,129,0.36) 0%, transparent 50%)',
          'radial-gradient(ellipse at 50% 20%, rgba(14,165,233,0.36) 0%, transparent 50%)',
          'radial-gradient(ellipse at 20% 30%, rgba(6,182,212,0.36) 0%, transparent 50%)'
        ]
      }}
      transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
    />
  );
}

function Mountains() {
  return (
    <>
      <svg className="absolute bottom-0 w-full h-full opacity-40" preserveAspectRatio="none" viewBox="0 0 1200 400">
        <path d="M0,400 L0,200 Q200,80 400,150 T800,120 L1200,180 L1200,400 Z" fill="url(#g1)" />
        <defs>
          <linearGradient id="g1" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1e1b4b" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#0f0a2e" stopOpacity="1" />
          </linearGradient>
        </defs>
      </svg>

      <svg className="absolute bottom-0 w-full h-full opacity-60" preserveAspectRatio="none" viewBox="0 0 1200 400">
        <path d="M0,400 L0,250 Q150,100 350,180 T700,140 T1200,220 L1200,400 Z" fill="url(#g2)" />
        <defs>
          <linearGradient id="g2" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#2d1b69" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#1a0f3d" stopOpacity="1" />
          </linearGradient>
        </defs>
      </svg>

      <svg className="absolute bottom-0 w-full h-full opacity-90" preserveAspectRatio="none" viewBox="0 0 1200 400">
        <path d="M0,400 L0,300 Q100,150 300,220 T600,180 T900,240 T1200,280 L1200,400 Z" fill="url(#g3)" />
        <defs>
          <linearGradient id="g3" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3d1f8f" stopOpacity="1" />
            <stop offset="100%" stopColor="#1f0d47" stopOpacity="1" />
          </linearGradient>
        </defs>
      </svg>
    </>
  );
}

/* --------------------------- Utility helpers --------------------------- */

function generateStars(count: number, opts?: { verticalSpread?: number }) {
  const spread = opts?.verticalSpread ?? 0.7;
  return Array.from({ length: count }).map(() => ({
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * (spread * 100)}%`,
    size: `${1 + Math.random() * 3}px`,
    sizeSmall: `${1 + Math.random() * 2}px`,
    duration: 1.8 + Math.random() * 3,
    delay: Math.random() * 2
  }));
}

function generateShootingStars(n = 3) {
  return Array.from({ length: n }).map((_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 40}%`,
    dx: 220 + Math.random() * 180,
    dy: 120 + Math.random() * 200,
    duration: 1.6 + Math.random() * 2.2,
    delay: i * 6 + Math.random() * 8
  }));
}
