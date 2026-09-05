import React, { useEffect, useId, useState, useRef } from "react";

// Utility function for class names
const cn = (...classes) => classes.filter(Boolean).join(' ');

// Sparkles Core Component
const SparklesCore = ({ 
  background = "transparent", 
  minSize = 0.4, 
  maxSize = 1, 
  particleDensity = 500, 
  className = "", 
  particleColor = "#FFFFFF" 
}) => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const particles = [];
    
    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Create particles
    for (let i = 0; i < particleDensity / 10; i++) {
      particles.push({
        x: Math.random() * canvas.offsetWidth,
        y: Math.random() * canvas.offsetHeight,
        size: Math.random() * (maxSize - minSize) + minSize,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        opacity: Math.random() * 0.8 + 0.2,
      });
    }
    
    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
      
      particles.forEach((particle) => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        
        // Wrap around edges
        if (particle.x > canvas.offsetWidth) particle.x = 0;
        if (particle.x < 0) particle.x = canvas.offsetWidth;
        if (particle.y > canvas.offsetHeight) particle.y = 0;
        if (particle.y < 0) particle.y = canvas.offsetHeight;
        
        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `${particleColor}${Math.floor(particle.opacity * 255).toString(16).padStart(2, '0')}`;
        ctx.fill();
      });
      
      requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [minSize, maxSize, particleDensity, particleColor]);
  
  return (
    <canvas
      ref={canvasRef}
      className={`${className} w-full h-full`}
      style={{ background }}
    />
  );
};

// Beam Component
const Beam = ({
  className = "",
  delay = 1,
  duration = 2,
  hovered = false,
  width = 600,
  style = {},
}) => {
  const id = useId();
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay * 1000);
    
    return () => clearTimeout(timer);
  }, [delay]);
  
  if (!isVisible && !hovered) return null;
  
  return (
    <div
      className={cn("absolute inset-x-0 w-full overflow-hidden", className)}
      style={style}
    >
      <div
        className={cn(
          "h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent transition-all duration-1000",
          hovered ? "opacity-100 animate-pulse" : "opacity-30"
        )}
        style={{
          animationDuration: `${duration}s`,
          animationDelay: `${delay}s`,
        }}
      />
    </div>
  );
};

// Circle Icon Component
const CircleIcon = ({ className = "", delay = 0 }) => {
  return (
    <div
      className={cn(
        "pointer-events-none h-3 w-3 rounded-full transition-all duration-300",
        "bg-slate-600 opacity-40",
        "group-hover/cover:bg-blue-400 group-hover/cover:opacity-100 group-hover/cover:shadow-lg group-hover/cover:shadow-blue-400/50",
        "animate-pulse",
        className
      )}
      style={{
        animationDelay: `${delay}s`,
      }}
    />
  );
};

// Main Cover Component
const Cover = ({ children, className = "" }) => {
  const [hovered, setHovered] = useState(false);
  const ref = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [beamPositions, setBeamPositions] = useState([]);

  useEffect(() => {
    if (ref.current) {
      setContainerWidth(ref.current?.clientWidth ?? 0);

      const height = ref.current?.clientHeight ?? 0;
      const numberOfBeams = Math.floor(height / 12);
      const positions = Array.from(
        { length: numberOfBeams },
        (_, i) => (i + 1) * (height / (numberOfBeams + 1))
      );
      setBeamPositions(positions);
    }
  }, [children]);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      ref={ref}
      className={cn(
        "relative group/cover inline-block",
        "bg-slate-900/50 backdrop-blur-sm border border-slate-700/50",
        "hover:bg-slate-800/80 hover:border-blue-500/50",
        "px-4 py-3 transition-all duration-300 rounded-lg",
        "shadow-lg hover:shadow-xl hover:shadow-blue-500/20",
        className
      )}
    >
      {/* Animated Background */}
      <div
        className={cn(
          "absolute inset-0 overflow-hidden rounded-lg transition-opacity duration-300",
          hovered ? "opacity-100" : "opacity-0"
        )}
      >
        <div
          className="w-[200%] h-full flex animate-pulse"
          style={{
            animation: hovered ? "slideBackground 8s linear infinite" : "none",
          }}
        >
          <SparklesCore
            background="transparent"
            minSize={0.5}
            maxSize={1.5}
            particleDensity={400}
            className="w-full h-full"
            particleColor="#60a5fa"
          />
          <SparklesCore
            background="transparent"
            minSize={0.5}
            maxSize={1.5}
            particleDensity={400}
            className="w-full h-full"
            particleColor="#3b82f6"
          />
        </div>
      </div>

      {/* Animated Beams */}
      {beamPositions.map((position, index) => (
        <Beam
          key={index}
          hovered={hovered}
          duration={Math.random() * 3 + 2}
          delay={Math.random() * 2 + 0.5}
          width={containerWidth}
          style={{ top: `${position}px` }}
        />
      ))}

      {/* Main Content */}
      <span
        className={cn(
          "relative z-20 inline-block font-semibold transition-all duration-300",
          "text-slate-200 group-hover/cover:text-white",
          "transform group-hover/cover:scale-105",
          hovered && "animate-pulse",
          className
        )}
        style={{
          textShadow: hovered ? "0 0 20px rgba(59, 130, 246, 0.5)" : "none",
        }}
      >
        {children}
      </span>

      {/* Corner Icons */}
      <CircleIcon className="absolute -right-1 -top-1" />
      <CircleIcon className="absolute -bottom-1 -right-1" delay={0.3} />
      <CircleIcon className="absolute -left-1 -top-1" delay={0.6} />
      <CircleIcon className="absolute -bottom-1 -left-1" delay={0.9} />
    </div>
  );
};

// Demo Component
export default function CoverDemo() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-8">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
          <span className="bg-gradient-to-r from-slate-300 via-slate-100 to-slate-300 bg-clip-text text-transparent">
            Build amazing websites
          </span>
          <br />
          <span className="bg-gradient-to-r from-slate-400 via-slate-200 to-slate-400 bg-clip-text text-transparent">
            at{" "}
          </span>
          <Cover>warp speed</Cover>
        </h1>
        
        <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
          Experience the next generation of web development with our revolutionary platform. 
          Hover over "warp speed" to see the magic in action.
        </p>
        
        <div className="flex flex-wrap gap-4 justify-center pt-8">
          <Cover className="text-sm">✨ Interactive</Cover>
          <Cover className="text-sm">🚀 Fast</Cover>
          <Cover className="text-sm">🎨 Beautiful</Cover>
          <Cover className="text-sm">⚡ Modern</Cover>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes slideBackground {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0%); }
        }
      `}</style>
    </div>
  );
}