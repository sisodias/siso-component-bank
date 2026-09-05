import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function HeroScrollAnimation() {
  const containerRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Section 1 animations
  const section1Scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);
  const section1Rotate = useTransform(scrollYProgress, [0, 0.5], [0, -5]);
  const section1Opacity = useTransform(scrollYProgress, [0, 0.3, 0.5], [1, 0.8, 0]);

  // Section 2 animations
  const section2Scale = useTransform(scrollYProgress, [0.3, 1], [0.8, 1]);
  const section2Rotate = useTransform(scrollYProgress, [0.3, 1], [5, 0]);
  const section2Y = useTransform(scrollYProgress, [0, 0.5], [100, 0]);

  // Footer animations
  const footerY = useTransform(scrollYProgress, [0.7, 1], [200, 0]);
  const footerOpacity = useTransform(scrollYProgress, [0.7, 0.9], [0, 1]);

  return (
    <div ref={containerRef} className="relative h-[300vh] bg-black">
      {/* Section 1 - Light Hero */}
      <motion.section
        style={{
          scale: section1Scale,
          rotate: section1Rotate,
          opacity: section1Opacity,
        }}
        className="sticky top-0 h-screen bg-gradient-to-b from-gray-100 to-gray-200 flex flex-col items-center justify-center overflow-hidden"
      >
        {/* Orthogonal Grid Background */}
        <div className="absolute inset-0">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid-light" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(0,0,0,0.1)" strokeWidth="1"/>
              </pattern>
              <radialGradient id="fade-light">
                <stop offset="0%" stopColor="white" stopOpacity="0"/>
                <stop offset="50%" stopColor="white" stopOpacity="0.3"/>
                <stop offset="100%" stopColor="white" stopOpacity="1"/>
              </radialGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-light)"/>
            <rect width="100%" height="100%" fill="url(#fade-light)"/>
          </svg>
        </div>
        
        {/* Animated floating elements */}
        <motion.div
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-20 left-20 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            y: [0, 20, 0],
            rotate: [0, -5, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-20 right-20 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl"
        />

        {/* Main Title */}
        <div className="relative z-10 px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold text-gray-900 tracking-tight leading-[120%] mb-6"
          >
            Hero Scroll Animation
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-gray-600 mb-8"
          >
            Experience smooth scrolling animations
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex items-center justify-center"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-4xl"
            >
              👇
            </motion.div>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-sm text-gray-500 mt-4"
          >
            Scroll down to see the magic
          </motion.p>
        </div>
      </motion.section>

      {/* Section 2 - Dark Content */}
      <motion.section
        style={{
          scale: section2Scale,
          rotate: section2Rotate,
          y: section2Y,
        }}
        className="relative h-screen bg-gradient-to-b from-gray-900 to-black text-white"
      >
        {/* Orthogonal Grid Background */}
        <div className="absolute inset-0">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid-dark" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
              </pattern>
              <radialGradient id="fade-dark">
                <stop offset="0%" stopColor="black" stopOpacity="0"/>
                <stop offset="50%" stopColor="black" stopOpacity="0.3"/>
                <stop offset="100%" stopColor="black" stopOpacity="1"/>
              </radialGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-dark)"/>
            <rect width="100%" height="100%" fill="url(#fade-dark)"/>
          </svg>
        </div>
        
        <div className="container mx-auto px-4 md:px-8 relative z-10 h-full flex flex-col justify-center">
          <motion.h2
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-bold tracking-tight mb-12 leading-tight"
          >
            Stunning Visual <br />
            <span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
              Gallery Showcase
            </span>
          </motion.h2>

          {/* Image Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=600&auto=format&fit=crop',
              'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop',
              'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=600&auto=format&fit=crop',
              'https://images.unsplash.com/photo-1618556450994-a6a128ef0d9d?w=600&auto=format&fit=crop',
            ].map((src, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, rotate: 2 }}
                viewport={{ once: true }}
                className="relative overflow-hidden rounded-lg aspect-square group cursor-pointer"
              >
                <img
                  src={src}
                  alt={`Gallery image ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  className="absolute inset-0 bg-gradient-to-t from-purple-900/80 to-transparent flex items-end justify-center pb-4"
                >
                  <span className="text-white font-semibold">View More</span>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Footer */}
      <motion.footer
        style={{
          y: footerY,
          opacity: footerOpacity,
        }}
        className="relative bg-gradient-to-b from-black to-gray-900 pt-32"
      >
        <div className="relative z-10">
          <motion.h3
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="text-[12vw] md:text-[16vw] font-bold uppercase text-center leading-none"
          >
            <span className="bg-gradient-to-r from-gray-400 via-gray-600 to-gray-800 bg-clip-text text-transparent">
              UI Layout
            </span>
          </motion.h3>
          
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
            className="bg-black text-white h-40 relative z-20 rounded-t-[3rem] mt-20 flex flex-col items-center justify-center"
          >
            <p className="text-gray-400 mb-2">Built with Framer Motion</p>
            <div className="flex gap-6 text-sm text-gray-500">
              <motion.span
                whileHover={{ scale: 1.1, color: '#fff' }}
                className="cursor-pointer transition-colors"
              >
                React
              </motion.span>
              <motion.span
                whileHover={{ scale: 1.1, color: '#fff' }}
                className="cursor-pointer transition-colors"
              >
                Tailwind
              </motion.span>
              <motion.span
                whileHover={{ scale: 1.1, color: '#fff' }}
                className="cursor-pointer transition-colors"
              >
                TypeScript
              </motion.span>
            </div>
          </motion.div>
        </div>
      </motion.footer>
    </div>
  );
}
