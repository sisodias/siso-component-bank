'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Cpu } from 'lucide-react';

// Utility for conditional class names
const cn = (...classes) => classes.filter(Boolean).join(' ');

// Glitch-text hook remains unchanged
const useGlitchText = (text, onFinished) => {
  const [glitchedText, setGlitchedText] = useState('');
  const intervalRef = useRef(null);
  const chars = '!<>-_\\/[]{}—=+*^?#________';

  useEffect(() => {
    let iteration = 0;
    clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setGlitchedText(
        text
          .split('')
          .map((_, idx) =>
            idx < iteration
              ? text[idx]
              : chars[Math.floor(Math.random() * chars.length)]
          )
          .join('')
      );

      if (iteration >= text.length) {
        clearInterval(intervalRef.current);
        onFinished?.();
      }
      iteration += 1 / 3;
    }, 30);

    return () => clearInterval(intervalRef.current);
  }, [text, onFinished]);

  return glitchedText;
};

// DIGITAL RAIN BACKGROUND
const DigitalRain = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    const katakana = 'アァカサタナ…'; // truncated for brevity
    const latin = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const nums = '0123456789';
    const alphabet = katakana + latin + nums;
    const fontSize = 16;
    const columns = Math.floor(canvas.width / fontSize);
    const drops = Array(columns).fill(1);

    const draw = () => {
      // fade old frame
      ctx.fillStyle = 'rgba(0,0,0,0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#0F0';
      ctx.font = `${fontSize}px monospace`;

      drops.forEach((y, i) => {
        const char = alphabet.charAt(
          Math.floor(Math.random() * alphabet.length)
        );
        ctx.fillText(char, i * fontSize, y * fontSize);

        if (y * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 w-screen h-screen"
    />
  );
};

// MAIN HERO COMPONENT
const GlitchWeaverHero = () => {
  const [isDecoded, setIsDecoded] = useState(false);
  const headline = 'Glitch Weaver UI';
  const glitchText = useGlitchText(headline, () => setIsDecoded(true));

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeInOut' } },
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden flex flex-col items-center justify-center bg-black text-white">
      <DigitalRain />

      <div className="relative z-10 text-center px-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6 backdrop-blur-sm"
        >
          <Cpu className="h-4 w-4 text-blue-400" />
          <span className="text-sm font-medium text-gray-200">
            Next-Generation Core Engine
          </span>
        </motion.div>

        <h1 className="font-mono font-bold tracking-tighter mb-6 text-5xl md:text-7xl" style={{ textShadow: '0 0 10px rgba(255,255,255,0.3)' }}>
          {glitchText}
        </h1>

        {isDecoded && (
          <>
            <motion.p variants={fadeUp} initial="hidden" animate="visible" className="max-w-2xl mx-auto text-lg text-gray-400 mb-10">
              A revolutionary framework for building resilient, self-healing user interfaces that adapt and overcome errors in real-time.
            </motion.p>

            <motion.div variants={fadeUp} initial="hidden" animate="visible">
              <button className="flex items-center gap-2 px-8 py-4 bg-white text-black font-semibold rounded-lg shadow-lg hover:bg-gray-200 transition-colors duration-300">
                Initiate Core
                <ArrowRight className="h-5 w-5" />
              </button>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
};

export default GlitchWeaverHero;
