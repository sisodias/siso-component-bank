'use client'
import React, { useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      )}
      {...props}
    />
  )
}

interface PremiumAuthProps {
  onClose?: () => void;
  onSuccess?: (user: any) => void;
  initialMode?: 'login' | 'signup';
  className?: string;
}

export function PremiumAuth({ 
  onClose = () => {}, 
  onSuccess,
  initialMode = 'login',
  className = '' 
}: PremiumAuthProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>(initialMode);

  // For 3D card effect - increased rotation range for more pronounced 3D effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-300, 300], [10, -10]);
  const rotateY = useTransform(mouseX, [-300, 300], [-10, 10]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // Mock successful authentication
      if (onSuccess) {
        onSuccess({
          email,
          name: authMode === 'signup' ? name : 'User',
          id: Date.now().toString()
        });
      }
      onClose();
    }, 2000);
  };

  const handleSocialLogin = (provider: string) => {
    setIsLoading(true);
    
    // Simulate social login
    setTimeout(() => {
      setIsLoading(false);
      if (onSuccess) {
        onSuccess({
          email: `user@${provider}.com`,
          name: `${provider} User`,
          id: `${provider}_${Date.now()}`
        });
      }
      onClose();
    }, 1500);
  };

  return (
    <div className={cn("min-h-screen w-screen bg-black relative overflow-hidden flex items-center justify-center", className)}>
      {/* Futuristic Grid Background */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px),
              linear-gradient(rgba(255, 0, 255, 0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 0, 255, 0.05) 1px, transparent 1px)
            `,
            backgroundSize: '100px 100px, 100px 100px, 20px 20px, 20px 20px'
          }}
        />
      </div>

      {/* Animated Neon Gradient Background */}
      <motion.div 
        className="absolute inset-0"
        animate={{
          background: [
            'radial-gradient(circle at 20% 80%, rgba(0, 255, 255, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 0, 255, 0.3) 0%, transparent 50%), radial-gradient(circle at 40% 40%, rgba(0, 100, 255, 0.2) 0%, transparent 50%)',
            'radial-gradient(circle at 80% 20%, rgba(0, 255, 255, 0.3) 0%, transparent 50%), radial-gradient(circle at 20% 80%, rgba(255, 0, 255, 0.3) 0%, transparent 50%), radial-gradient(circle at 60% 60%, rgba(0, 100, 255, 0.2) 0%, transparent 50%)',
            'radial-gradient(circle at 20% 80%, rgba(0, 255, 255, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 0, 255, 0.3) 0%, transparent 50%), radial-gradient(circle at 40% 40%, rgba(0, 100, 255, 0.2) 0%, transparent 50%)'
          ]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Floating Neon Particles */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full"
          style={{
            background: i % 3 === 0 ? '#00ffff' : i % 3 === 1 ? '#ff00ff' : '#0066ff',
            boxShadow: `0 0 20px ${i % 3 === 0 ? '#00ffff' : i % 3 === 1 ? '#ff00ff' : '#0066ff'}`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.random() * 40 - 20, 0],
            opacity: [0.3, 1, 0.3],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 4 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: "easeInOut"
          }}
        />
      ))}

      {/* Scanning Lines Effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(0, 255, 255, 0.1) 50%, transparent 100%)'
        }}
        animate={{ x: ['-100%', '100%'] }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
      />

      {/* Matrix-style falling characters */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-cyan-400 text-xs font-mono opacity-20"
            style={{
              left: `${(i * 5)}%`,
              fontFamily: 'monospace'
            }}
            animate={{
              y: ['-100vh', '100vh'],
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 8,
              ease: "linear"
            }}
          >
            {Math.random().toString(36).substring(2, 15)}
          </motion.div>
        ))}
      </div>

      {/* Digital DNA Helix */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div
          className="relative w-full h-full max-w-6xl"
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        >
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-cyan-400/20 rounded-full"
              style={{
                left: `${50 + 30 * Math.cos((i * 45) * Math.PI / 180)}%`,
                top: `${50 + 30 * Math.sin((i * 45) * Math.PI / 180)}%`,
              }}
              animate={{
                scale: [1, 2, 1],
                opacity: [0.2, 0.8, 0.2]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.2
              }}
            />
          ))}
        </motion.div>
      </div>

      {/* Quantum Field Lines */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              width: '1px',
              height: '100vh',
              left: `${(i + 1) * 8}%`,
              background: 'linear-gradient(180deg, transparent, rgba(0,255,255,0.1), transparent)'
            }}
            animate={{
              opacity: [0, 0.5, 0],
              scaleY: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              delay: i * 0.3,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20, rotateX: -15 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
        style={{ perspective: 2000 }}
      >
        <motion.div
          className="relative"
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          whileHover={{ z: 20, scale: 1.02 }}
          transition={{ duration: 0.3 }}
        >
          {/* Holographic Border Effect */}
          <div className="absolute -inset-4 rounded-3xl">
            <motion.div 
              className="absolute inset-0 rounded-3xl"
              animate={{
                background: [
                  'conic-gradient(from 0deg, #00ffff, #ff00ff, #0066ff, #00ffff)',
                  'conic-gradient(from 120deg, #00ffff, #ff00ff, #0066ff, #00ffff)',
                  'conic-gradient(from 240deg, #00ffff, #ff00ff, #0066ff, #00ffff)',
                  'conic-gradient(from 360deg, #00ffff, #ff00ff, #0066ff, #00ffff)'
                ]
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              style={{ filter: 'blur(8px)', opacity: 0.6 }}
            />
          </div>

          {/* Neural Network Lines */}
          <div className="absolute -inset-8 rounded-3xl overflow-hidden pointer-events-none">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute"
                style={{
                  width: '2px',
                  height: '100%',
                  background: 'linear-gradient(180deg, transparent, #00ffff, transparent)',
                  left: `${12.5 * (i + 1)}%`,
                  opacity: 0.3
                }}
                animate={{
                  scaleY: [0, 1, 0],
                  opacity: [0, 0.6, 0]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>

          <div className="relative group">
            {/* Futuristic Card Glow */}
            <motion.div 
              className="absolute -inset-[2px] rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              animate={{
                boxShadow: [
                  "0 0 20px 5px rgba(0, 255, 255, 0.3), 0 0 40px 10px rgba(255, 0, 255, 0.2)",
                  "0 0 30px 8px rgba(255, 0, 255, 0.3), 0 0 50px 15px rgba(0, 255, 255, 0.2)",
                  "0 0 20px 5px rgba(0, 255, 255, 0.3), 0 0 40px 10px rgba(255, 0, 255, 0.2)"
                ]
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
            />

            {/* Hexagonal Energy Beams */}
            <div className="absolute -inset-[1px] rounded-3xl overflow-hidden">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-full h-[2px]"
                  style={{
                    background: 'linear-gradient(90deg, transparent, #00ffff, transparent)',
                    top: `${16.6 * (i + 1)}%`,
                    transformOrigin: 'center'
                  }}
                  animate={{
                    scaleX: [0, 1, 0],
                    opacity: [0, 1, 0],
                    rotate: [0, 360]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: i * 0.3,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </div>

            {/* Quantum Dots */}
            <div className="absolute -inset-2 rounded-3xl">
              {[...Array(12)].map((_, i) => {
                const angle = (i * 30) * (Math.PI / 180);
                const radius = 120;
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;
                
                return (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 rounded-full"
                    style={{
                      background: i % 2 === 0 ? '#00ffff' : '#ff00ff',
                      boxShadow: `0 0 10px ${i % 2 === 0 ? '#00ffff' : '#ff00ff'}`,
                      left: '50%',
                      top: '50%',
                      transform: `translate(${x}px, ${y}px)`
                    }}
                    animate={{
                      scale: [1, 2, 1],
                      opacity: [0.5, 1, 0.5],
                      rotate: [0, 360]
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      delay: i * 0.2,
                      ease: "easeInOut"
                    }}
                  />
                );
              })}
            </div>
            
            {/* Main Glass Card with Futuristic Design */}
            <div className="relative bg-black/60 backdrop-blur-2xl rounded-3xl border border-cyan-500/30 shadow-2xl overflow-hidden">
              {/* Holographic Overlay */}
              <div 
                className="absolute inset-0 opacity-10"
                style={{
                  background: `
                    linear-gradient(45deg, transparent 30%, rgba(0, 255, 255, 0.1) 50%, transparent 70%),
                    linear-gradient(-45deg, transparent 30%, rgba(255, 0, 255, 0.1) 50%, transparent 70%)
                  `
                }}
              />

              {/* Scanning Effect */}
              <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'linear-gradient(180deg, transparent 0%, rgba(0, 255, 255, 0.1) 50%, transparent 100%)',
                  height: '200%'
                }}
                animate={{ y: ['-100%', '0%'] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              />

              <div className="relative z-10 p-8">
                {/* Close button with futuristic style */}
                <motion.button
                  onClick={onClose}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full border border-cyan-400/50 flex items-center justify-center text-cyan-400 hover:bg-cyan-400/20 transition-all duration-300"
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <div className="w-3 h-3 relative">
                    <div className="absolute inset-0 bg-cyan-400 transform rotate-45 rounded-full" style={{ width: '1px', height: '100%', left: '50%', marginLeft: '-0.5px' }} />
                    <div className="absolute inset-0 bg-cyan-400 transform -rotate-45 rounded-full" style={{ width: '1px', height: '100%', left: '50%', marginLeft: '-0.5px' }} />
                  </div>
                </motion.button>

                {/* Futuristic Logo and header */}
                <div className="text-center space-y-4 mb-8">
                  <motion.div
                    initial={{ scale: 0, rotateY: -180 }}
                    animate={{ scale: 1, rotateY: 0 }}
                    transition={{ type: "spring", duration: 1.2, delay: 0.2 }}
                    className="mx-auto w-16 h-16 relative"
                  >
                    {/* Holographic Logo Container */}
                    <motion.div
                      className="w-full h-full rounded-full border-2 border-cyan-400 flex items-center justify-center relative overflow-hidden"
                      animate={{
                        borderColor: ['#00ffff', '#ff00ff', '#0066ff', '#00ffff'],
                        boxShadow: [
                          '0 0 20px #00ffff',
                          '0 0 20px #ff00ff', 
                          '0 0 20px #0066ff',
                          '0 0 20px #00ffff'
                        ]
                      }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      {/* Rotating Inner Ring */}
                      <motion.div
                        className="absolute inset-2 rounded-full border border-cyan-400/50"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                      />
                      
                      {/* Central Logo */}
                      <motion.span 
                        className="text-2xl font-bold bg-clip-text text-transparent relative z-10"
                        style={{
                          backgroundImage: 'linear-gradient(45deg, #00ffff, #ff00ff, #0066ff)',
                          backgroundSize: '200% 200%'
                        }}
                        animate={{
                          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                        }}
                        transition={{ duration: 3, repeat: Infinity }}
                      >
                        ∞
                      </motion.span>
                      
                      {/* Energy Pulse */}
                      <motion.div
                        className="absolute inset-0 rounded-full bg-cyan-400/20"
                        animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    </motion.div>
                  </motion.div>

                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    className="text-2xl font-bold bg-clip-text text-transparent"
                    style={{
                      backgroundImage: 'linear-gradient(135deg, #00ffff, #ffffff, #ff00ff)',
                      backgroundSize: '200% 200%'
                    }}
                  >
                    <motion.span
                      animate={{
                        backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                      }}
                      transition={{ duration: 4, repeat: Infinity }}
                      style={{
                        backgroundImage: 'linear-gradient(135deg, #00ffff, #ffffff, #ff00ff)',
                        backgroundSize: '200% 200%',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        color: 'transparent'
                      }}
                    >
                      {authMode === 'login' ? 'Neural Interface' : 'System Registration'}
                    </motion.span>
                  </motion.h1>
                  
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="text-cyan-400/80 text-sm font-mono"
                  >
                    {authMode === 'login' ? '[ AUTHENTICATION_REQUIRED ]' : '[ CREATING_NEW_ENTITY ]'}
                  </motion.p>

                  {/* Status Indicators */}
                  <div className="flex justify-center space-x-4 mt-4">
                    {['SECURE', 'ENCRYPTED', 'VERIFIED'].map((status, i) => (
                      <motion.div
                        key={status}
                        className="flex items-center space-x-1"
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.8 + i * 0.1 }}
                      >
                        <motion.div
                          className="w-2 h-2 rounded-full bg-green-400"
                          animate={{ opacity: [1, 0.3, 1] }}
                          transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                        />
                        <span className="text-xs text-green-400 font-mono">{status}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Futuristic Mode Toggle */}
                <motion.div 
                  className="relative mb-8"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  <div className="relative bg-black/50 backdrop-blur-sm rounded-2xl p-1 border border-cyan-400/30">
                    <motion.div
                      className="absolute inset-1 rounded-xl bg-gradient-to-r from-cyan-400/20 to-purple-400/20"
                      animate={{ x: authMode === 'login' ? 0 : '50%' }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      style={{ width: '50%' }}
                    />
                    <div className="relative flex">
                      <motion.button
                        onClick={() => setAuthMode('login')}
                        className={`flex-1 py-3 px-6 rounded-xl text-sm font-mono font-medium transition-all relative z-10 ${
                          authMode === 'login'
                            ? 'text-white' 
                            : 'text-cyan-400/60 hover:text-cyan-400'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <span className="relative z-10">AUTHENTICATE</span>
                      </motion.button>
                      <motion.button
                        onClick={() => setAuthMode('signup')}
                        className={`flex-1 py-3 px-6 rounded-xl text-sm font-mono font-medium transition-all relative z-10 ${
                          authMode === 'signup'
                            ? 'text-white' 
                            : 'text-cyan-400/60 hover:text-cyan-400'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <span className="relative z-10">INITIALIZE</span>
                      </motion.button>
                    </div>
                  </div>
                </motion.div>

                {/* Futuristic Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  <motion.div className="space-y-4">
                    {/* Name input for signup - Enhanced futuristic design */}
                    <AnimatePresence>
                      {authMode === 'signup' && (
                        <motion.div
                          initial={{ opacity: 0, height: 0, y: -20 }}
                          animate={{ opacity: 1, height: "auto", y: 0 }}
                          exit={{ opacity: 0, height: 0, y: -20 }}
                          transition={{ duration: 0.4, ease: "easeOut" }}
                          className="relative group"
                        >
                          <div className="relative flex items-center overflow-hidden rounded-xl bg-black/50 border border-cyan-500/30 backdrop-blur-sm">
                            <motion.div
                              className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/10 to-transparent"
                              animate={{ x: ['-100%', '100%'] }}
                              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            />
                            
                            {/* Energy Pulse on Focus */}
                            {focusedInput === "name" && (
                              <motion.div
                                className="absolute inset-0 border border-cyan-400/50 rounded-xl"
                                initial={{ scale: 1, opacity: 0.5 }}
                                animate={{ scale: 1.02, opacity: 0 }}
                                transition={{ duration: 0.6, repeat: Infinity }}
                              />
                            )}

                            <div className={`absolute left-4 w-4 h-4 transition-all duration-300 ${
                              focusedInput === "name" ? 'text-cyan-400' : 'text-cyan-400/40'
                            }`}>
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                              </svg>
                            </div>
                            
                            {/* Status Indicator */}
                            <div className="absolute right-4 flex items-center space-x-2">
                              <motion.div
                                className={`w-2 h-2 rounded-full ${name ? 'bg-green-400' : 'bg-gray-500'}`}
                                animate={{ opacity: name ? [1, 0.3, 1] : 0.3 }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                              />
                              <span className="text-xs font-mono text-cyan-400/60">
                                {name ? 'VALID' : 'REQUIRED'}
                              </span>
                            </div>
                            
                            <Input
                              type="text"
                              placeholder="[ ENTER_IDENTITY ]"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              onFocus={() => setFocusedInput("name")}
                              onBlur={() => setFocusedInput(null)}
                              className="w-full bg-transparent border-0 text-cyan-100 placeholder:text-cyan-400/40 h-12 pl-12 pr-20 font-mono text-sm focus:ring-0 focus:outline-none"
                            />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Email Input with Enhanced Futuristic Design */}
                    <motion.div
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                      className="relative group"
                    >
                      <div className="relative flex items-center overflow-hidden rounded-xl bg-black/50 border border-cyan-500/30 backdrop-blur-sm">
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/10 to-transparent"
                          animate={{ x: ['-100%', '100%'] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        />
                        
                        {/* Energy Pulse on Focus */}
                        {focusedInput === "email" && (
                          <motion.div
                            className="absolute inset-0 border border-cyan-400/50 rounded-xl"
                            initial={{ scale: 1, opacity: 0.5 }}
                            animate={{ scale: 1.02, opacity: 0 }}
                            transition={{ duration: 0.6, repeat: Infinity }}
                          />
                        )}

                        <Mail className={`absolute left-4 w-4 h-4 transition-all duration-300 ${
                          focusedInput === "email" ? 'text-cyan-400' : 'text-cyan-400/40'
                        }`} />
                        
                        {/* Status Indicator */}
                        <div className="absolute right-4 flex items-center space-x-2">
                          <motion.div
                            className={`w-2 h-2 rounded-full ${email ? 'bg-green-400' : 'bg-gray-500'}`}
                            animate={{ opacity: email ? [1, 0.3, 1] : 0.3 }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          />
                          <span className="text-xs font-mono text-cyan-400/60">
                            {email ? 'VALID' : 'REQUIRED'}
                          </span>
                        </div>
                        
                        <Input
                          type="email"
                          placeholder="[ NEURAL_LINK_ADDRESS ]"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          onFocus={() => setFocusedInput("email")}
                          onBlur={() => setFocusedInput(null)}
                          className="w-full bg-transparent border-0 text-cyan-100 placeholder:text-cyan-400/40 h-12 pl-12 pr-20 font-mono text-sm focus:ring-0 focus:outline-none"
                        />
                      </div>
                    </motion.div>

                    {/* Password Input with Enhanced Futuristic Design */}
                    <motion.div
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                      className="relative group"
                    >
                      <div className="relative flex items-center overflow-hidden rounded-xl bg-black/50 border border-cyan-500/30 backdrop-blur-sm">
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/10 to-transparent"
                          animate={{ x: ['-100%', '100%'] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        />
                        
                        {/* Energy Pulse on Focus */}
                        {focusedInput === "password" && (
                          <motion.div
                            className="absolute inset-0 border border-cyan-400/50 rounded-xl"
                            initial={{ scale: 1, opacity: 0.5 }}
                            animate={{ scale: 1.02, opacity: 0 }}
                            transition={{ duration: 0.6, repeat: Infinity }}
                          />
                        )}

                        <Lock className={`absolute left-4 w-4 h-4 transition-all duration-300 ${
                          focusedInput === "password" ? 'text-cyan-400' : 'text-cyan-400/40'
                        }`} />
                        
                        {/* Status Indicator */}
                        <div className="absolute right-16 flex items-center space-x-2">
                          <motion.div
                            className={`w-2 h-2 rounded-full ${password ? 'bg-green-400' : 'bg-gray-500'}`}
                            animate={{ opacity: password ? [1, 0.3, 1] : 0.3 }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          />
                          <span className="text-xs font-mono text-cyan-400/60">
                            {password ? 'SECURE' : 'REQUIRED'}
                          </span>
                        </div>
                        
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="[ SECURITY_CIPHER ]"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          onFocus={() => setFocusedInput("password")}
                          onBlur={() => setFocusedInput(null)}
                          className="w-full bg-transparent border-0 text-cyan-100 placeholder:text-cyan-400/40 h-12 pl-12 pr-32 font-mono text-sm focus:ring-0 focus:outline-none"
                        />
                        
                        <motion.button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 p-1 rounded text-cyan-400/60 hover:text-cyan-400 transition-all duration-300"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </motion.button>
                      </div>
                    </motion.div>

                    {/* Remember Me Checkbox - Futuristic Design */}
                    {authMode === 'login' && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="flex items-center space-x-3"
                      >
                        <motion.button
                          type="button"
                          onClick={() => setRememberMe(!rememberMe)}
                          className="relative w-5 h-5 rounded border border-cyan-400/50 bg-black/50 flex items-center justify-center"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <AnimatePresence>
                            {rememberMe && (
                              <motion.div
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0, opacity: 0 }}
                                className="w-2 h-2 bg-cyan-400 rounded-sm"
                              />
                            )}
                          </AnimatePresence>
                        </motion.button>
                        <span className="text-sm font-mono text-cyan-400/80">[ MAINTAIN_SESSION ]</span>
                      </motion.div>
                    )}
                  </motion.div>

                  {/* Futuristic Submit Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isLoading}
                    className="w-full relative group/button mt-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    {/* Holographic Border */}
                    <motion.div
                      className="absolute inset-0 rounded-xl"
                      animate={{
                        background: [
                          'linear-gradient(90deg, #00ffff, #ff00ff, #0066ff, #00ffff)',
                          'linear-gradient(90deg, #ff00ff, #0066ff, #00ffff, #ff00ff)',
                          'linear-gradient(90deg, #0066ff, #00ffff, #ff00ff, #0066ff)',
                          'linear-gradient(90deg, #00ffff, #ff00ff, #0066ff, #00ffff)'
                        ]
                      }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      style={{ padding: '1px' }}
                    >
                      <div className="w-full h-full bg-black/90 rounded-xl" />
                    </motion.div>

                    {/* Scan Lines */}
                    <motion.div
                      className="absolute inset-0 rounded-xl overflow-hidden"
                      style={{
                        background: 'repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(0,255,255,0.1) 2px, rgba(0,255,255,0.1) 4px)'
                      }}
                      animate={{ x: ['0%', '100%'] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    />

                    {/* Grid Pattern */}
                    <div 
                      className="absolute inset-0 rounded-xl opacity-20"
                      style={{
                        backgroundImage: `
                          linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),
                          linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)
                        `,
                        backgroundSize: '10px 10px'
                      }}
                    />

                    <div className="relative overflow-hidden bg-black/70 backdrop-blur-sm text-cyan-100 font-mono font-bold h-14 rounded-xl border border-cyan-400/30 transition-all duration-300 flex items-center justify-center">
                      <AnimatePresence mode="wait">
                        {isLoading ? (
                          <motion.div
                            key="loading"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="flex items-center justify-center space-x-3"
                          >
                            <div className="flex space-x-1">
                              {[...Array(3)].map((_, i) => (
                                <motion.div
                                  key={i}
                                  className="w-2 h-2 bg-cyan-400 rounded-full"
                                  animate={{ opacity: [0.3, 1, 0.3] }}
                                  transition={{
                                    duration: 1,
                                    repeat: Infinity,
                                    delay: i * 0.2
                                  }}
                                />
                              ))}
                            </div>
                            <span className="text-sm">[ PROCESSING... ]</span>
                          </motion.div>
                        ) : (
                          <motion.div
                            key="button-text"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="flex items-center justify-center space-x-2 text-sm font-bold tracking-wider"
                          >
                            <span>[ {authMode === 'login' ? 'INITIALIZE_CONNECTION' : 'CREATE_NEURAL_LINK'} ]</span>
                            <ArrowRight className="w-4 h-4" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.button>

                  {/* Futuristic Divider */}
                  <motion.div 
                    className="relative my-8"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <div className="absolute inset-0 flex items-center">
                      <motion.div 
                        className="w-full border-t"
                        animate={{
                          borderColor: ['#00ffff', '#ff00ff', '#0066ff', '#00ffff']
                        }}
                        transition={{ duration: 3, repeat: Infinity }}
                        style={{ borderWidth: '1px' }}
                      />
                    </div>
                    <div className="relative flex justify-center text-xs">
                      <span className="bg-black/80 px-4 py-1 rounded-full border border-cyan-400/30 text-cyan-400/80 font-mono">
                        [ OR ]
                      </span>
                    </div>
                  </motion.div>

                  {/* Social Login Buttons - Enhanced Futuristic Design */}
                  <motion.div 
                    className="space-y-3"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    {/* Google Login */}
                    <motion.button
                      type="button"
                      onClick={() => handleSocialLogin('google')}
                      disabled={isLoading}
                      className="w-full relative group/social overflow-hidden"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {/* Holographic Border */}
                      <motion.div
                        className="absolute inset-0 rounded-xl"
                        animate={{
                          background: [
                            'linear-gradient(90deg, #ff6b00, #ff8f00, #ffb300, #ff6b00)',
                            'linear-gradient(90deg, #ff8f00, #ffb300, #ff6b00, #ff8f00)',
                            'linear-gradient(90deg, #ffb300, #ff6b00, #ff8f00, #ffb300)',
                            'linear-gradient(90deg, #ff6b00, #ff8f00, #ffb300, #ff6b00)'
                          ]
                        }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        style={{ padding: '1px' }}
                      >
                        <div className="w-full h-full bg-black/90 rounded-xl" />
                      </motion.div>

                      {/* Scan Effect */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-orange-400/10 to-transparent rounded-xl"
                        animate={{ x: ['-100%', '100%'] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      />

                      <div className="relative bg-black/50 backdrop-blur-sm border border-orange-400/30 rounded-xl h-12 flex items-center justify-center text-orange-100 font-mono font-medium text-sm transition-all duration-300">
                        <span>[ GOOGLE_AUTH ]</span>
                      </div>
                    </motion.button>

                    {/* GitHub Login */}
                    <motion.button
                      type="button"
                      onClick={() => handleSocialLogin('github')}
                      disabled={isLoading}
                      className="w-full relative group/social overflow-hidden"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {/* Holographic Border */}
                      <motion.div
                        className="absolute inset-0 rounded-xl"
                        animate={{
                          background: [
                            'linear-gradient(90deg, #8b5cf6, #a855f7, #c084fc, #8b5cf6)',
                            'linear-gradient(90deg, #a855f7, #c084fc, #8b5cf6, #a855f7)',
                            'linear-gradient(90deg, #c084fc, #8b5cf6, #a855f7, #c084fc)',
                            'linear-gradient(90deg, #8b5cf6, #a855f7, #c084fc, #8b5cf6)'
                          ]
                        }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        style={{ padding: '1px' }}
                      >
                        <div className="w-full h-full bg-black/90 rounded-xl" />
                      </motion.div>

                      {/* Scan Effect */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-400/10 to-transparent rounded-xl"
                        animate={{ x: ['-100%', '100%'] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      />

                      <div className="relative bg-black/50 backdrop-blur-sm border border-purple-400/30 rounded-xl h-12 flex items-center justify-center text-purple-100 font-mono font-medium text-sm transition-all duration-300">
                        <span>[ GITHUB_AUTH ]</span>
                      </div>
                    </motion.button>
                  </motion.div>

                  {/* Footer link */}
                  <motion.div 
                    className="text-center mt-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                  >
                    <div className="relative inline-block">
                      <motion.p 
                        className="text-xs font-mono text-cyan-400/60"
                        animate={{
                          textShadow: [
                            "0 0 5px rgba(0,255,255,0.3)",
                            "0 0 10px rgba(0,255,255,0.5)",
                            "0 0 5px rgba(0,255,255,0.3)"
                          ]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        {authMode === 'login' ? "[ ENTITY_NOT_FOUND? ]" : "[ ENTITY_EXISTS? ]"}
                        <motion.button 
                          type="button"
                          onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
                          className="relative inline-block group/link ml-2"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <span className="relative z-10 text-cyan-400 group-hover/link:text-white transition-colors duration-300 font-bold px-2">
                            {authMode === 'login' ? '[ REGISTER ]' : '[ LOGIN ]'}
                          </span>
                          <motion.div
                            className="absolute inset-0 bg-cyan-400/20 rounded opacity-0 group-hover/link:opacity-100 transition-opacity duration-300"
                            animate={{
                              boxShadow: [
                                "0 0 0px rgba(0,255,255,0)",
                                "0 0 20px rgba(0,255,255,0.3)",
                                "0 0 0px rgba(0,255,255,0)"
                              ]
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                          />
                        </motion.button>
                      </motion.p>
                    </div>
                  </motion.div>
                </form>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default PremiumAuth;