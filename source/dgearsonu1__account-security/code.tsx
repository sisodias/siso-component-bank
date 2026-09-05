import React, { useState } from 'react';
import { motion, useMotionValue, useMotionTemplate } from 'framer-motion';

// Canvas Reveal Effect Component
const CanvasRevealEffect = ({ colors, dotSize = 3, animationSpeed = 5, containerClassName }) => {
  const canvasRef = React.useRef(null);
  
  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    
    const dots = [];
    const numDots = 50;
    
    for (let i = 0; i < numDots; i++) {
      dots.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * animationSpeed,
        vy: (Math.random() - 0.5) * animationSpeed,
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: Math.random() * 0.5 + 0.3
      });
    }
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      dots.forEach(dot => {
        dot.x += dot.vx;
        dot.y += dot.vy;
        
        if (dot.x < 0 || dot.x > canvas.width) dot.vx *= -1;
        if (dot.y < 0 || dot.y > canvas.height) dot.vy *= -1;
        
        ctx.globalAlpha = dot.opacity;
        ctx.fillStyle = `rgb(${dot.color.join(',')})`;
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dotSize, 0, Math.PI * 2);
        ctx.fill();
      });
      
      requestAnimationFrame(animate);
    };
    
    animate();
  }, [colors, dotSize, animationSpeed]);
  
  return <canvas ref={canvasRef} className={containerClassName} />;
};

// Card Spotlight Component
const CardSpotlight = ({
  children,
  radius = 400,
  color = "#1f2937",
  className = "",
  ...props
}) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [isHovering, setIsHovering] = useState(false);

  function handleMouseMove({ currentTarget, clientX, clientY }) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border border-gray-800/50 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8 shadow-2xl backdrop-blur-sm transition-all duration-300 hover:border-blue-500/30 hover:shadow-blue-500/10 ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      {...props}
    >
      {/* Spotlight effect */}
      <motion.div
        className="pointer-events-none absolute -inset-px z-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `radial-gradient(circle ${radius}px at var(--x) var(--y), rgba(59, 130, 246, 0.15), transparent 70%)`,
          '--x': useMotionTemplate`${mouseX}px`,
          '--y': useMotionTemplate`${mouseY}px`,
        }}
      />
      
      {/* Canvas reveal effect */}
      {isHovering && (
        <div className="pointer-events-none absolute inset-0 z-10">
          <CanvasRevealEffect
            animationSpeed={3}
            containerClassName="absolute inset-0 opacity-30"
            colors={[
              [59, 130, 246],
              [147, 51, 234],
              [79, 70, 229]
            ]}
            dotSize={2}
          />
        </div>
      )}
      
      {/* Content */}
      <div className="relative z-20">
        {children}
      </div>
      
      {/* Subtle glow border */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-purple-500/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    </div>
  );
};

// Professional Authentication Card Demo
export default function ProfessionalCardDemo() {
  const steps = [
    {
      title: "Verify email address",
      description: "We'll send a verification link to your inbox"
    },
    {
      title: "Create secure password",
      description: "Minimum 12 characters with mixed case and symbols"
    },
    {
      title: "Enable 2FA authentication",
      description: "Use authenticator app or SMS for added security"
    },
    {
      title: "Complete identity verification",
      description: "Quick verification to protect your account"
    }
  ];

  return (
    <div className="min-h-screen w-full bg-gray-950 p-8 flex items-center justify-center">
      <div className="max-w-2xl w-full space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-white">Account Security</h1>
          <p className="text-gray-400 text-lg">Follow these essential steps to secure your account</p>
        </div>

        {/* Main Card */}
        <CardSpotlight className="w-full max-w-xl mx-auto">
          {/* Card Header */}
          <div className="flex items-center space-x-3 mb-8">
            <div className="p-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Authentication Setup</h2>
              <p className="text-gray-400">Secure your account in 4 simple steps</p>
            </div>
          </div>

          {/* Steps */}
          <div className="space-y-6">
            {steps.map((step, index) => (
              <div key={index} className="flex items-start space-x-4 group/step">
                <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-white group-hover/step:text-blue-400 transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-gray-400 text-sm mt-1">{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-700/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
                </svg>
                <span>256-bit encryption</span>
              </div>
              <button className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105">
                Get Started
              </button>
            </div>
          </div>
        </CardSpotlight>

        {/* Additional Info */}
        <div className="text-center">
          <p className="text-gray-500 text-sm">
            Your security is our priority. All data is encrypted and stored securely.
          </p>
        </div>
      </div>
    </div>
  );
}