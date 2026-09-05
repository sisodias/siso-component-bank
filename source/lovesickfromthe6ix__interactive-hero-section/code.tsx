import { cn } from "@/lib/utils";
import { useState, useEffect, useRef } from "react";

export const Component = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHoveringCta, setIsHoveringCta] = useState(false);
  const [scrambledText, setScrambledText] = useState("Welcome to 21st.dev");
  const [isScrambling, setIsScrambling] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const titleRef = useRef(null);

  // Mouse tracking
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Scroll tracking for parallax
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Text scramble effect
  const scrambleText = () => {
    if (isScrambling) return;
    
    setIsScrambling(true);
    const originalText = "Welcome to 21st.dev";
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
    let iterations = 0;
    
    const interval = setInterval(() => {
      setScrambledText(
        originalText
          .split('')
          .map((char, index) => {
            if (index < iterations) {
              return originalText[index];
            }
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join('')
      );
      
      if (iterations >= originalText.length) {
        clearInterval(interval);
        setIsScrambling(false);
      }
      
      iterations += 1 / 3;
    }, 30);
  };

  return (
    <section 
      className={cn(
        "relative min-h-screen flex items-center justify-center overflow-hidden",
        "bg-black cursor-none"
      )}
    >
      {/* Custom Cursor */}
      <div 
        className={cn(
          "fixed w-2.5 h-2.5 bg-green-400 rounded-full pointer-events-none z-50 transition-transform duration-75 mix-blend-difference hidden lg:block",
          isHoveringCta && "scale-[2]"
        )}
        style={{
          left: `${mousePosition.x}px`,
          top: `${mousePosition.y}px`,
          transform: `translate(-50%, -50%) ${isHoveringCta ? 'scale(2)' : 'scale(1)'}`
        }}
      />
      <div 
        className={cn(
          "fixed w-8 h-8 border-2 border-green-400 rounded-full pointer-events-none z-40 transition-all duration-300 opacity-50 hidden lg:block",
          isHoveringCta && "scale-150"
        )}
        style={{
          left: `${mousePosition.x}px`,
          top: `${mousePosition.y}px`,
          transform: `translate(-50%, -50%) ${isHoveringCta ? 'scale(1.5)' : 'scale(1)'}`
        }}
      />
      
      {/* Hero Content */}
      <div 
        className="relative z-10 text-center px-4 max-w-6xl mx-auto"
        style={{
          transform: `translateY(${scrollY * -0.3}px)`,
          opacity: 1 - scrollY * 0.001
        }}
      >
        <h1 
          ref={titleRef}
          onMouseEnter={scrambleText}
          className={cn(
            "text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-6",
            "tracking-tight leading-none cursor-pointer",
            "bg-gradient-to-r from-white to-green-400 bg-clip-text text-transparent",
            "animate-fade-in-up animation-delay-300"
          )}
        >
          {scrambledText}
        </h1>
        <p 
          className={cn(
            "text-lg sm:text-xl md:text-2xl text-gray-400 mb-12",
            "max-w-2xl mx-auto leading-relaxed",
            "animate-fade-in-up animation-delay-500"
          )}
        >
          Building the future of web development with cutting-edge technology
        </p>
        <button 
          onMouseEnter={() => setIsHoveringCta(true)}
          onMouseLeave={() => setIsHoveringCta(false)}
          className={cn(
            "inline-flex items-center gap-2 px-8 py-4",
            "text-lg font-semibold text-black bg-green-400",
            "rounded-full cursor-none lg:cursor-none",
            "relative overflow-hidden transition-all duration-300",
            "hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(74,222,128,0.3)]",
            "animate-fade-in-up animation-delay-700",
            "group"
          )}
        >
          <span className="relative z-10">Get Started</span>
          <span className="relative z-10 inline-block transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
          <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-500" />
        </button>
      </div>

      {/* Floating Elements with CSS animations */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className={cn(
            "absolute w-72 h-72 rounded-full blur-[60px]",
            "bg-gradient-radial from-green-400/60 to-transparent",
            "top-[10%] left-[10%]",
            "animate-float animation-delay-0"
          )}
          style={{
            transform: `translateY(${scrollY * -0.5}px)`
          }}
        />
        <div
          className={cn(
            "absolute w-48 h-48 rounded-full blur-[60px]",
            "bg-gradient-radial from-pink-500/60 to-transparent",
            "top-[60%] right-[15%]",
            "animate-float animation-delay-1000"
          )}
          style={{
            transform: `translateY(${scrollY * -0.4}px)`
          }}
        />
        <div
          className={cn(
            "absolute w-60 h-60 rounded-full blur-[60px]",
            "bg-gradient-radial from-blue-500/60 to-transparent",
            "bottom-[20%] left-[20%]",
            "animate-float animation-delay-2000"
          )}
          style={{
            transform: `translateY(${scrollY * -0.6}px)`
          }}
        />
        <div
          className={cn(
            "absolute w-36 h-36 rounded-full blur-[60px]",
            "bg-gradient-radial from-yellow-500/60 to-transparent",
            "top-[30%] right-[30%]",
            "animate-float animation-delay-3000"
          )}
          style={{
            transform: `translateY(${scrollY * -0.3}px)`
          }}
        />
        <div
          className={cn(
            "absolute w-44 h-44 rounded-full blur-[60px]",
            "bg-gradient-radial from-purple-500/60 to-transparent",
            "bottom-[30%] right-[10%]",
            "animate-float animation-delay-4000"
          )}
          style={{
            transform: `translateY(${scrollY * -0.5}px)`
          }}
        />
      </div>

      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-radial from-green-400/10 via-transparent to-transparent pointer-events-none" />
      
      {/* Grid Pattern */}
      <div 
        className={cn(
          "absolute inset-0 pointer-events-none opacity-20",
          "bg-[linear-gradient(rgba(74,222,128,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(74,222,128,0.1)_1px,transparent_1px)]",
          "bg-[size:50px_50px]"
        )}
      />

      {/* Add these styles to your global CSS or as a style tag */}
      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          33% {
            transform: translateY(-20px) rotate(5deg);
          }
          66% {
            transform: translateY(20px) rotate(-5deg);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out forwards;
          opacity: 0;
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animation-delay-0 { animation-delay: 0s; }
        .animation-delay-300 { animation-delay: 0.3s; }
        .animation-delay-500 { animation-delay: 0.5s; }
        .animation-delay-700 { animation-delay: 0.7s; }
        .animation-delay-1000 { animation-delay: 1s; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-3000 { animation-delay: 3s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>
    </section>
  );
};