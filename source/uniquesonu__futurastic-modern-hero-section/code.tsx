import React, { useEffect, useId, useState, useRef } from "react";

// Utility function for class names
const cn = (...classes) => classes.filter(Boolean).join(' ');

// Advanced Grid Pattern with Depth
const EnhancedGrid = ({ opacity = 0.02, size = 32 }) => {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `
            radial-gradient(circle at 1px 1px, rgba(148, 163, 184, ${opacity * 2}) 1px, transparent 0),
            linear-gradient(rgba(148, 163, 184, ${opacity}) 1px, transparent 1px),
            linear-gradient(90deg, rgba(148, 163, 184, ${opacity}) 1px, transparent 1px)
          `,
          backgroundSize: `${size}px ${size}px, ${size}px ${size}px, ${size}px ${size}px`
        }}
      />
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-slate-50/30 to-transparent dark:via-slate-900/30" />
    </div>
  );
};

// Sophisticated Particle System
const ProfessionalParticles = ({ isActive = false, density = 20 }) => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const particles = [];
    let animationId;
    
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      canvas.style.width = canvas.offsetWidth / window.devicePixelRatio + 'px';
      canvas.style.height = canvas.offsetHeight / window.devicePixelRatio + 'px';
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Create sophisticated particles
    for (let i = 0; i < density; i++) {
      particles.push({
        x: Math.random() * (canvas.offsetWidth || 300),
        y: Math.random() * (canvas.offsetHeight || 50),
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        size: Math.random() * 0.8 + 0.2,
        opacity: Math.random() * 0.15 + 0.05,
        phase: Math.random() * Math.PI * 2,
      });
    }
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.offsetWidth || 300, canvas.offsetHeight || 50);
      
      particles.forEach((particle, index) => {
        // Smooth movement
        particle.x += particle.vx + Math.sin(particle.phase + index * 0.1) * 0.1;
        particle.y += particle.vy + Math.cos(particle.phase + index * 0.1) * 0.05;
        particle.phase += 0.02;
        
        // Boundary wrapping
        if (particle.x > (canvas.offsetWidth || 300)) particle.x = 0;
        if (particle.x < 0) particle.x = canvas.offsetWidth || 300;
        if (particle.y > (canvas.offsetHeight || 50)) particle.y = 0;
        if (particle.y < 0) particle.y = canvas.offsetHeight || 50;
        
        const alpha = isActive 
          ? particle.opacity * (0.8 + Math.sin(particle.phase) * 0.2)
          : particle.opacity * 0.4;
        
        // Draw particle with subtle glow
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size + 0.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(71, 85, 105, ${alpha * 0.3})`;
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(71, 85, 105, ${alpha})`;
        ctx.fill();
      });
      
      animationId = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, [isActive, density]);
  
  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none rounded-lg" />;
};

// Premium Highlight Effect
const PremiumHighlight = ({ isActive = false, width = 0 }) => {
  return (
    <>
      {/* Main highlight beam */}
      <div className="absolute inset-0 overflow-hidden rounded-lg">
        <div
          className={cn(
            "absolute top-0 left-0 h-full transition-all duration-1000 ease-out",
            "bg-gradient-to-r from-transparent via-slate-300/25 to-transparent",
            "dark:via-slate-500/25"
          )}
          style={{
            width: isActive ? `${width}px` : '0px',
            transform: isActive ? 'translateX(0)' : 'translateX(-100%)',
            filter: 'blur(0.5px)',
          }}
        />
      </div>
      
      {/* Secondary subtle sweep */}
      <div className="absolute inset-0 overflow-hidden rounded-lg">
        <div
          className={cn(
            "absolute top-0 left-0 h-full transition-all duration-1200 ease-out",
            "bg-gradient-to-r from-transparent via-slate-400/15 to-transparent",
            "dark:via-slate-400/15"
          )}
          style={{
            width: isActive ? `${width * 1.2}px` : '0px',
            transform: isActive ? 'translateX(0)' : 'translateX(-120%)',
            transitionDelay: isActive ? '200ms' : '0ms',
          }}
        />
      </div>
    </>
  );
};

// Enhanced Professional Cover Component
const Cover = ({ children, className = "" }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      const { offsetWidth, offsetHeight } = containerRef.current;
      setDimensions({ width: offsetWidth, height: offsetHeight });
      
      // Add resize observer for responsive updates
      const resizeObserver = new ResizeObserver((entries) => {
        for (let entry of entries) {
          const { width, height } = entry.contentRect;
          setDimensions({ width, height });
        }
      });
      
      resizeObserver.observe(containerRef.current);
      
      return () => resizeObserver.disconnect();
    }
  }, [children]);

  return (
    <span
      ref={containerRef}
      className={cn(
        "relative inline-block cursor-pointer group/cover",
        "transition-all duration-500 ease-out",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Enhanced Background with Depth */}
      <span
        className={cn(
          "absolute inset-0 rounded-lg transition-all duration-500 ease-out",
          "bg-gradient-to-br from-slate-50/80 via-white/40 to-slate-100/60",
          "dark:from-slate-800/60 dark:via-slate-700/40 dark:to-slate-800/80",
          "backdrop-blur-sm",
          isHovered 
            ? "opacity-100 shadow-xl shadow-slate-200/40 dark:shadow-slate-900/60 scale-[1.02]" 
            : "opacity-0 scale-100"
        )}
        style={{
          boxShadow: isHovered 
            ? '0 8px 32px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
            : 'none'
        }}
      />
      
      {/* Refined Border System */}
      <span
        className={cn(
          "absolute inset-0 rounded-lg transition-all duration-500 ease-out",
          "border border-slate-200/60 dark:border-slate-700/60",
          isHovered && "border-slate-300/80 dark:border-slate-600/80"
        )}
      />
      
      {/* Inner border for depth */}
      <span
        className={cn(
          "absolute inset-[1px] rounded-[7px] transition-opacity duration-500",
          "border border-white/40 dark:border-slate-600/20",
          isHovered ? "opacity-100" : "opacity-0"
        )}
      />
      
      {/* Premium Highlight Effects */}
      <PremiumHighlight isActive={isHovered} width={dimensions.width} />
      
      {/* Sophisticated Particles */}
      <ProfessionalParticles isActive={isHovered} density={Math.min(25, Math.max(15, Math.floor(dimensions.width / 10)))} />
      
      {/* Enhanced Text Content */}
      <span
        className={cn(
          "relative z-10 px-4 py-2 inline-block transition-all duration-500 ease-out",
          "font-medium tracking-wide",
          "text-slate-700 dark:text-slate-200",
          "selection:bg-slate-200 dark:selection:bg-slate-700",
          isHovered && "text-slate-900 dark:text-white transform translate-y-[-0.5px]"
        )}
        style={{
          textShadow: isHovered 
            ? '0 1px 3px rgba(0, 0, 0, 0.1)' 
            : 'none',
          letterSpacing: isHovered ? '0.02em' : '0.025em'
        }}
      >
        {children}
      </span>
      
      {/* Premium Corner Indicators */}
      {[
        { position: "top-0.5 left-0.5", delay: 0 },
        { position: "top-0.5 right-0.5", delay: 75 },
        { position: "bottom-0.5 right-0.5", delay: 150 },
        { position: "bottom-0.5 left-0.5", delay: 225 },
      ].map((corner, index) => (
        <span
          key={index}
          className={cn(
            "absolute w-1.5 h-1.5 rounded-full transition-all duration-500 ease-out",
            corner.position,
            "bg-gradient-to-br from-slate-300 to-slate-400",
            "dark:from-slate-500 dark:to-slate-600",
            isHovered 
              ? "opacity-100 scale-125 shadow-sm" 
              : "opacity-0 scale-75"
          )}
          style={{
            transitionDelay: `${corner.delay}ms`,
            boxShadow: isHovered ? '0 2px 4px rgba(0, 0, 0, 0.1)' : 'none'
          }}
        />
      ))}
    </span>
  );
};

// Premium Demo Component
export default function CoverDemo() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors duration-500">
      {/* Enhanced Background */}
      <EnhancedGrid opacity={0.025} size={40} />
      
      {/* Ambient lighting effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-slate-200/20 dark:bg-slate-700/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-slate-300/15 dark:bg-slate-600/8 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '12s', animationDelay: '2s' }} />
      </div>
      
      <div className="relative z-10 flex items-center justify-center min-h-screen p-8">
        <div className="max-w-5xl mx-auto text-center space-y-20">
          
          {/* Hero Section */}
          <div className="space-y-8">
            <div className="space-y-2 mb-8">
              <div className="inline-flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400 bg-slate-100/50 dark:bg-slate-800/50 px-4 py-2 rounded-full backdrop-blur-sm">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                <span>Trusted by Fortune 500 companies</span>
              </div>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-light leading-[1.1] tracking-tight">
              <span className="block text-slate-900 dark:text-slate-100 mb-6 font-extralight">
                Transform your business
              </span>
              <span className="block">
                <span className="text-slate-600 dark:text-slate-400 font-extralight">
                  with{" "}
                </span>
                <Cover className="font-normal">intelligent automation</Cover>
              </span>
            </h1>
            
            <p className="text-slate-600 dark:text-slate-300 text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed font-light">
              Streamline operations, enhance productivity, and accelerate growth with our 
              enterprise-grade platform built for modern businesses.
            </p>
          </div>
          
          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-16">
            <div className="text-center space-y-3">
              <div className="text-3xl font-light text-slate-900 dark:text-slate-100">99.9%</div>
              <div className="text-slate-500 dark:text-slate-400 text-sm font-medium">Uptime Guarantee</div>
            </div>
            <div className="text-center space-y-3">
              <div className="text-3xl font-light text-slate-900 dark:text-slate-100">500+</div>
              <div className="text-slate-500 dark:text-slate-400 text-sm font-medium">Enterprise Clients</div>
            </div>
            <div className="text-center space-y-3">
              <div className="text-3xl font-light text-slate-900 dark:text-slate-100">24/7</div>
              <div className="text-slate-500 dark:text-slate-400 text-sm font-medium">Expert Support</div>
            </div>
          </div>
          
          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pt-8">
            {[
              { title: "Enterprise Security", desc: "Bank-grade encryption and compliance" },
              { title: "Scalable Infrastructure", desc: "Grows seamlessly with your business" },
              { title: "Advanced Analytics", desc: "Real-time insights and reporting" },
              { title: "Global Deployment", desc: "Multi-region availability and CDN" }
            ].map((feature, index) => (
              <div key={index} className="text-center space-y-4 group">
                <Cover className="text-base block">{feature.title}</Cover>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors duration-300">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
          
          {/* Call to Action */}
          <div className="pt-16 space-y-8">
            <div className="space-y-4">
              <p className="text-slate-500 dark:text-slate-400 text-lg">
                Join industry leaders who trust our platform.{" "}
                <Cover className="text-base">Schedule a consultation</Cover>
              </p>
              
              <div className="flex flex-wrap justify-center items-center space-x-6 text-sm text-slate-400 dark:text-slate-500 pt-6">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  <span>SOC 2 Type II</span>
                </div>
                <span className="text-slate-300 dark:text-slate-600">•</span>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                  <span>ISO 27001</span>
                </div>
                <span className="text-slate-300 dark:text-slate-600">•</span>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                  <span>GDPR Compliant</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}