import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useMotionTemplate, AnimatePresence } from 'framer-motion';

// Enhanced Canvas Effect with particles
const ParticleCanvas = ({ isActive }) => {
  const canvasRef = React.useRef(null);

  React.useEffect(() => {
    if (!isActive) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';
    ctx.scale(2, 2);

    const particles = [];
    const numParticles = 80;
    
    // Create particles
    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * rect.width,
        y: Math.random() * rect.height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.6 + 0.2,
        color: Math.random() > 0.5 ? 'rgba(59, 130, 246, ' : 'rgba(139, 92, 246, ',
        pulse: Math.random() * Math.PI * 2
      });
    }

    let animationId;
    let frame = 0;

    const animate = () => {
      ctx.clearRect(0, 0, rect.width, rect.height);
      frame += 0.02;

      particles.forEach((particle, i) => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.pulse += 0.03;

        // Bounce off edges
        if (particle.x <= 0 || particle.x >= rect.width) particle.vx *= -1;
        if (particle.y <= 0 || particle.y >= rect.height) particle.vy *= -1;

        // Pulsing effect
        const pulseOpacity = particle.opacity + Math.sin(particle.pulse) * 0.3;
        
        // Draw particle
        ctx.globalAlpha = Math.max(0, pulseOpacity);
        ctx.fillStyle = particle.color + pulseOpacity + ')';
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();

        // Draw connections
        particles.forEach((otherParticle, j) => {
          if (i !== j) {
            const dx = particle.x - otherParticle.x;
            const dy = particle.y - otherParticle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 100) {
              ctx.globalAlpha = (100 - distance) / 100 * 0.1;
              ctx.strokeStyle = 'rgba(59, 130, 246, 0.3)';
              ctx.lineWidth = 0.5;
              ctx.beginPath();
              ctx.moveTo(particle.x, particle.y);
              ctx.lineTo(otherParticle.x, otherParticle.y);
              ctx.stroke();
            }
          }
        });
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [isActive]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none opacity-60"
      style={{ mixBlendMode: 'screen' }}
    />
  );
};

// Enhanced Card Spotlight with modern design
const ModernCardSpotlight = ({ children, className = "", ...props }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [isHovering, setIsHovering] = useState(false);

  function handleMouseMove({ currentTarget, clientX, clientY }) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <motion.div
      className={`group relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900/90 via-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-slate-700/50 shadow-2xl ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      {...props}
    >
      {/* Dynamic spotlight effect */}
      <motion.div
        className="pointer-events-none absolute -inset-px z-0 rounded-3xl opacity-0 transition-opacity duration-700"
        style={{
          background: useMotionTemplate`
            radial-gradient(600px circle at ${mouseX}px ${mouseY}px,
              rgba(59, 130, 246, 0.15),
              rgba(139, 92, 246, 0.1),
              transparent 70%
            )
          `,
        }}
        animate={{ opacity: isHovering ? 1 : 0 }}
      />

      {/* Animated border glow */}
      <motion.div
        className="absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-500"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.4), transparent)',
          backgroundSize: '200% 100%',
        }}
        animate={{
          opacity: isHovering ? 1 : 0,
          backgroundPosition: isHovering ? ['0% 0%', '200% 0%'] : '0% 0%'
        }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      />

      {/* Particle canvas */}
      <ParticleCanvas isActive={isHovering} />

      {/* Content */}
      <div className="relative z-20 p-8">
        {children}
      </div>
    </motion.div>
  );
};

// Progress Step Component
const ProgressStep = ({ step, index, isActive, isCompleted }) => {
  return (
    <motion.div
      className="flex items-start space-x-4 group"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
    >
      {/* Step indicator */}
      <motion.div
        className="relative flex-shrink-0"
        whileHover={{ scale: 1.1 }}
        transition={{ type: "spring", stiffness: 400 }}
      >
        <div className={`
          w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300
          ${isCompleted 
            ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25' 
            : isActive
            ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/25'
            : 'bg-slate-700 text-slate-300 border border-slate-600'
          }
        `}>
          {isCompleted ? (
            <motion.svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500 }}
            >
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </motion.svg>
          ) : (
            <span>{index + 1}</span>
          )}
        </div>
        
        {/* Connecting line */}
        {index < 3 && (
          <div className="absolute top-10 left-1/2 w-0.5 h-8 bg-gradient-to-b from-slate-600 to-transparent -translate-x-px" />
        )}
      </motion.div>

      {/* Step content */}
      <div className="flex-1 min-w-0 pb-8">
        <motion.h3
          className={`text-lg font-semibold mb-2 transition-colors duration-300 ${
            isActive ? 'text-blue-400' : isCompleted ? 'text-emerald-400' : 'text-white'
          }`}
          whileHover={{ x: 4 }}
        >
          {step.title}
        </motion.h3>
        <p className="text-slate-400 text-sm leading-relaxed">
          {step.description}
        </p>
        
        {/* Progress indicator */}
        {(isActive || isCompleted) && (
          <motion.div
            className="mt-3 h-1 bg-slate-700 rounded-full overflow-hidden"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: isCompleted ? '100%' : '70%' }}
              transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
            />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

// Main Component
export default function NextGenSecurityCard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState(new Set());

  const steps = [
    {
      title: "Email Verification",
      description: "Confirm your email address with our secure verification system. We'll send you a unique link to verify ownership."
    },
    {
      title: "Password Creation",
      description: "Generate a strong, unique password with our advanced security requirements and real-time strength analysis."
    },
    {
      title: "Two-Factor Authentication",
      description: "Set up additional security layer using authenticator apps or SMS verification for maximum protection."
    },
    {
      title: "Identity Confirmation",
      description: "Complete your security setup with our quick identity verification process to ensure account integrity."
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        const next = (prev + 1) % steps.length;
        if (next === 0) {
          setCompletedSteps(new Set());
        } else {
          setCompletedSteps(prev => new Set([...prev, prev]));
        }
        return next;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-8 flex items-center justify-center">
      <div className="max-w-4xl w-full">
        {/* Header Section */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-sm font-medium mb-6"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            <span>Enterprise Security</span>
          </motion.div>
          
          <h1 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text">
            Advanced Account Protection
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Experience our next-generation security system designed to protect your digital identity with military-grade encryption.
          </p>
        </motion.div>

        {/* Main Card */}
        <ModernCardSpotlight className="max-w-2xl mx-auto">
          {/* Card Header */}
          <motion.div
            className="flex items-center justify-between mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <div className="flex items-center space-x-4">
              <motion.div
                className="p-3 rounded-2xl bg-gradient-to-br from-blue-600 via-purple-600 to-blue-700 shadow-lg"
                whileHover={{ rotate: 5, scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </motion.div>
              <div>
                <h2 className="text-2xl font-bold text-white">Security Setup</h2>
                <p className="text-slate-400">Complete setup in 4 steps</p>
              </div>
            </div>
            
            <motion.div
              className="flex items-center space-x-2 text-sm"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
            >
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-emerald-400 font-medium">Live Demo</span>
            </motion.div>
          </motion.div>

          {/* Progress Steps */}
          <div className="space-y-2">
            {steps.map((step, index) => (
              <ProgressStep
                key={index}
                step={step}
                index={index}
                isActive={index === currentStep}
                isCompleted={completedSteps.has(index)}
              />
            ))}
          </div>

          {/* Footer */}
          <motion.div
            className="mt-8 pt-6 border-t border-slate-700/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6 text-sm text-slate-400">
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  <span>AES-256 Encryption</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>SOC 2 Certified</span>
                </div>
              </div>
              
              <motion.button
                className="px-8 py-3 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-blue-500/25 transition-all duration-300 bg-[length:200%_100%]"
                whileHover={{ 
                  scale: 1.05,
                  backgroundPosition: '100% 0%'
                }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                Start Security Setup
              </motion.button>
            </div>
          </motion.div>
        </ModernCardSpotlight>

        {/* Bottom info */}
        <motion.div
          className="text-center mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <p className="text-slate-500 text-sm">
            Trusted by over 10,000+ companies worldwide • 99.9% uptime guarantee
          </p>
        </motion.div>
      </div>
    </div>
  );
}