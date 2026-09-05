import React, { useState, useRef, useEffect } from 'react';

const MouseWaveText = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [smoothMousePos, setSmoothMousePos] = useState({ x: 0, y: 0 });
  const [isHoveringText, setIsHoveringText] = useState(false);
  const [hoveredCharIndex, setHoveredCharIndex] = useState(-1);
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const animationFrameRef = useRef(null);
  const text = "MOVE YOUR MOUSE HERE";

  // Ultra-smooth mouse following with higher interpolation rate
  useEffect(() => {
    const smoothFollow = () => {
      setSmoothMousePos(prev => ({
        x: prev.x + (mousePos.x - prev.x) * 0.25, // Increased for smoother response
        y: prev.y + (mousePos.y - prev.y) * 0.25
      }));
      animationFrameRef.current = requestAnimationFrame(smoothFollow);
    };
    
    animationFrameRef.current = requestAnimationFrame(smoothFollow);
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [mousePos]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePos({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        });
      }
    };

    const handleTextMouseEnter = () => setIsHoveringText(true);
    const handleTextMouseLeave = () => {
      setIsHoveringText(false);
      setHoveredCharIndex(-1);
    };

    const container = containerRef.current;
    const textElement = textRef.current;
    
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
    }
    
    if (textElement) {
      textElement.addEventListener('mouseenter', handleTextMouseEnter);
      textElement.addEventListener('mouseleave', handleTextMouseLeave);
    }
    
    return () => {
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
      }
      if (textElement) {
        textElement.removeEventListener('mouseenter', handleTextMouseEnter);
        textElement.removeEventListener('mouseleave', handleTextMouseLeave);
      }
    };
  }, []);

  const handleCharacterHover = (index) => {
    setHoveredCharIndex(index);
  };

  const getCharacterStyle = (index, char) => {
    if (!containerRef.current || !textRef.current) return {};

    const charElements = textRef.current.children;
    const charElement = charElements[index];
    
    if (!charElement) return {};

    const rect = charElement.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();
    
    const charX = rect.left - containerRect.left + rect.width / 2;
    const charY = rect.top - containerRect.top + rect.height / 2;
    
    const distance = Math.sqrt(
      Math.pow(smoothMousePos.x - charX, 2) + Math.pow(smoothMousePos.y - charY, 2)
    );
    
    const maxDistance = 200; // Increased for smoother falloff
    const intensity = Math.max(0, 1 - distance / maxDistance);
    
    // Enhanced wave animation with smoother timing
    const time = Date.now() * 0.003;
    const baseWave = Math.sin(time + index * 0.25) * 6;
    const mouseWave = isHoveringText ? Math.sin(time * 1.8 + index * 0.35) * intensity * 30 : 0;
    const hoverWave = hoveredCharIndex === index ? Math.sin(time * 4) * 20 : 0;
    
    // Buttery smooth scaling
    const baseScale = 1;
    const hoverScale = isHoveringText ? 1 + intensity * 0.5 : 1;
    const directHoverScale = hoveredCharIndex === index ? 1.4 : 1;
    const finalScale = baseScale * hoverScale * directHoverScale;
    
    // Smooth 3D rotation effects
    const rotateX = isHoveringText ? intensity * Math.sin(time + index * 0.4) * 10 : 0;
    const rotateY = isHoveringText ? intensity * Math.cos(time + index * 0.3) * 8 : 0;
    const rotateZ = hoveredCharIndex === index ? Math.sin(time * 3) * 6 : 0;
    
    // Vibrant green color effects
    const brightness = 1 + (isHoveringText ? intensity * 0.4 : 0) + (hoveredCharIndex === index ? 0.5 : 0);
    const saturate = 1 + (isHoveringText ? intensity * 0.6 : 0) + (hoveredCharIndex === index ? 0.8 : 0);
    const hueRotate = (isHoveringText ? intensity * 30 : 0) + (hoveredCharIndex === index ? 15 : 0);
    
    // Enhanced glow effects
    const glowIntensity = (isHoveringText ? intensity * 25 : 8) + (hoveredCharIndex === index ? 35 : 0);
    
    return {
      transform: `
        translateY(${baseWave + mouseWave + hoverWave}px) 
        scale(${finalScale}) 
        rotateX(${rotateX}deg) 
        rotateY(${rotateY}deg)
        rotateZ(${rotateZ}deg)
        perspective(1200px)
      `,
      filter: `
        brightness(${brightness}) 
        saturate(${saturate})
        hue-rotate(${hueRotate}deg)
        drop-shadow(0 0 ${glowIntensity}px rgba(34, 197, 94, 0.8))
      `,
      textShadow: `
        0 0 ${glowIntensity * 0.5}px rgb(34, 197, 94),
        0 0 ${glowIntensity}px rgb(34, 197, 94),
        0 0 ${glowIntensity * 1.5}px rgba(34, 197, 94, 0.6),
        0 0 ${glowIntensity * 2}px rgba(34, 197, 94, 0.3),
        0 ${glowIntensity * 0.2}px ${glowIntensity * 0.4}px rgba(34, 197, 94, 0.4)
      `,
      transition: isHoveringText 
        ? 'all 0.15s cubic-bezier(0.25, 0.46, 0.45, 0.94)' 
        : 'all 0.5s cubic-bezier(0.165, 0.84, 0.44, 1)',
      zIndex: hoveredCharIndex === index ? 25 : Math.floor(intensity * 15),
      position: 'relative'
    };
  };

  return (
    <div className="w-full min-h-screen bg-gray-900 flex items-center justify-center overflow-hidden relative" style={{ cursor: 'default' }}>
      {/* Dynamic green background */}
      <div 
        className="absolute inset-0 transition-all duration-300 ease-out"
        style={{
          background: isHoveringText ? `
            radial-gradient(circle at ${smoothMousePos.x}px ${smoothMousePos.y}px, 
            rgba(34, 197, 94, 0.12) 0%, 
            rgba(34, 197, 94, 0.06) 25%, 
            rgba(34, 197, 94, 0.03) 50%,
            rgba(34, 197, 94, 0.01) 70%,
            transparent 85%)
          ` : `
            radial-gradient(circle at 50% 50%, 
            rgba(34, 197, 94, 0.03) 0%, 
            transparent 60%)
          `
        }}
      />
      
      <div
        ref={containerRef}
        className="relative select-none"
        style={{ 
          perspective: '1800px',
          width: '100vw',
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'default'
        }}
      >
        {/* Animated green grid */}
        <div 
          className="absolute inset-0 opacity-15 transition-all duration-500"
          style={{
            backgroundImage: `
              linear-gradient(90deg, rgba(34, 197, 94, 0.4) 1px, transparent 1px),
              linear-gradient(0deg, rgba(34, 197, 94, 0.4) 1px, transparent 1px)
            `,
            backgroundSize: '100px 100px',
            animation: 'grid-flow 35s linear infinite',
            transform: `translate(${smoothMousePos.x * 0.008}px, ${smoothMousePos.y * 0.008}px)`,
            opacity: isHoveringText ? 0.25 : 0.15
          }}
        />
        
        {/* Main interactive text */}
        <div className="relative z-10 text-center">
          <div 
            ref={textRef}
            className="inline-flex flex-wrap justify-center items-center font-black text-5xl md:text-7xl lg:text-8xl xl:text-9xl"
            style={{
              fontFamily: 'Arial Black, sans-serif',
              letterSpacing: '0.15em',
              transformStyle: 'preserve-3d',
              cursor: 'default'
            }}
          >
            {text.split('').map((char, index) => (
              <span
                key={index}
                className="inline-block text-green-400 will-change-transform"
                style={{
                  ...getCharacterStyle(index, char),
                  animationDelay: `${index * 0.08}s`,
                  animation: !isHoveringText ? `gentle-bob ${5 + (index % 3)}s ease-in-out infinite` : 'none',
                  cursor: 'default'
                }}
                onMouseEnter={() => handleCharacterHover(index)}
                onMouseLeave={() => setHoveredCharIndex(-1)}
              >
                {char === ' ' ? '\u00A0' : char}
              </span>
            ))}
          </div>
          
          {/* Enhanced subtitle */}
          <div 
            className={`mt-10 text-green-300 text-xl md:text-2xl transition-all duration-400 ${
              isHoveringText ? 'opacity-95 scale-110' : 'opacity-70 scale-100'
            }`}
            style={{
              textShadow: isHoveringText 
                ? '0 0 20px rgba(34, 197, 94, 0.6), 0 0 40px rgba(34, 197, 94, 0.3)' 
                : '0 0 8px rgba(34, 197, 94, 0.4)',
              animation: 'subtitle-glow 4s ease-in-out infinite alternate',
              cursor: 'default'
            }}
          >
            Smooth Green Interactive Animation
          </div>
        </div>
        
        {/* Smooth mouse follower glow */}
        <div
          className="absolute pointer-events-none z-20 transition-all duration-150"
          style={{
            left: smoothMousePos.x - 25,
            top: smoothMousePos.y - 25,
            width: '50px',
            height: '50px',
            background: `radial-gradient(circle, 
              rgba(34, 197, 94, ${isHoveringText ? '0.5' : '0.25'}), 
              rgba(34, 197, 94, ${isHoveringText ? '0.25' : '0.12'}), 
              rgba(34, 197, 94, ${isHoveringText ? '0.1' : '0.05'}),
              transparent)`,
            borderRadius: '50%',
            boxShadow: isHoveringText ? `
              0 0 40px rgba(34, 197, 94, 0.4), 
              0 0 80px rgba(34, 197, 94, 0.2),
              0 0 120px rgba(34, 197, 94, 0.1)
            ` : `
              0 0 20px rgba(34, 197, 94, 0.3), 
              0 0 40px rgba(34, 197, 94, 0.15)
            `,
            transform: `scale(${isHoveringText ? '1.3' : '1'})`,
            animation: isHoveringText ? 'glow-active 1s ease-in-out infinite alternate' : 'glow-idle 3s ease-in-out infinite alternate'
          }}
        />
        
        {/* Enhanced particle system */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(80)].map((_, i) => {
            const greenShade = Math.floor(Math.random() * 3);
            const colors = [
              'rgba(34, 197, 94, 0.6)',   // green-500
              'rgba(74, 222, 128, 0.5)',  // green-400  
              'rgba(134, 239, 172, 0.4)'  // green-300
            ];
            
            return (
              <div
                key={i}
                className="absolute rounded-full transition-all duration-700"
                style={{
                  width: `${1.5 + Math.random() * 2.5}px`,
                  height: `${1.5 + Math.random() * 2.5}px`,
                  background: colors[greenShade],
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animation: `particles-float ${5 + Math.random() * 10}s ease-in-out infinite`,
                  animationDelay: `${Math.random() * 5}s`,
                  boxShadow: `0 0 ${Math.random() * 12 + 4}px ${colors[greenShade]}`,
                  opacity: isHoveringText ? 0.9 : 0.5,
                  transform: `scale(${isHoveringText ? 1.2 : 1})`
                }}
              />
            );
          })}
        </div>
        
        {/* Ambient green lighting layers */}
        {isHoveringText && (
          <>
            <div
              className="absolute pointer-events-none transition-all duration-400"
              style={{
                left: smoothMousePos.x - 180,
                top: smoothMousePos.y - 180,
                width: '360px',
                height: '360px',
                background: 'radial-gradient(circle, rgba(34, 197, 94, 0.12), rgba(34, 197, 94, 0.06), transparent)',
                borderRadius: '50%',
                animation: 'ambient-pulse 4s ease-in-out infinite alternate'
              }}
            />
            <div
              className="absolute pointer-events-none transition-all duration-600"
              style={{
                left: smoothMousePos.x - 250,
                top: smoothMousePos.y - 250,
                width: '500px',
                height: '500px',
                background: 'radial-gradient(circle, rgba(34, 197, 94, 0.08), rgba(34, 197, 94, 0.03), transparent)',
                borderRadius: '50%',
                animation: 'ambient-pulse 5s ease-in-out infinite alternate reverse'
              }}
            />
          </>
        )}
        
        {/* Buttery smooth CSS animations */}
        <style jsx>{`
          @keyframes grid-flow {
            0% { transform: translate(0, 0); }
            100% { transform: translate(100px, 100px); }
          }
          
          @keyframes gentle-bob {
            0%, 100% { 
              transform: translateY(0px) scale(1) rotateZ(0deg); 
            }
            25% {
              transform: translateY(-4px) scale(1.01) rotateZ(0.3deg);
            }
            50% { 
              transform: translateY(-6px) scale(1.015) rotateZ(0deg); 
            }
            75% {
              transform: translateY(-2px) scale(1.005) rotateZ(-0.3deg);
            }
          }
          
          @keyframes particles-float {
            0%, 100% { 
              transform: translateY(0px) rotate(0deg) scale(0.7); 
              opacity: 0.3;
            }
            20% {
              transform: translateY(-20px) rotate(72deg) scale(1.1);
              opacity: 0.7;
            }
            40% { 
              transform: translateY(-35px) rotate(144deg) scale(1.3); 
              opacity: 0.9;
            }
            60% {
              transform: translateY(-25px) rotate(216deg) scale(1);
              opacity: 0.8;
            }
            80% {
              transform: translateY(-10px) rotate(288deg) scale(0.9);
              opacity: 0.6;
            }
          }
          
          @keyframes subtitle-glow {
            0% { 
              opacity: 0.7;
              transform: scale(1);
            }
            100% { 
              opacity: 0.9;
              transform: scale(1.05);
            }
          }
          
          @keyframes glow-idle {
            0% { 
              opacity: 0.7;
            }
            100% { 
              opacity: 1;
            }
          }
          
          @keyframes glow-active {
            0% { 
              opacity: 0.9;
            }
            100% { 
              opacity: 1;
            }
          }
          
          @keyframes ambient-pulse {
            0% { 
              opacity: 0.4;
              transform: scale(0.95);
            }
            100% { 
              opacity: 0.7;
              transform: scale(1.05);
            }
          }
          
          * {
            cursor: default !important;
          }
          
          .will-change-transform {
            will-change: transform, filter, opacity;
          }
        `}</style>
      </div>
    </div>
  );
};

// Optimized animation controller with smoother timing
const AnimatedMouseWaveText = () => {
  const [time, setTime] = useState(0);
  
  useEffect(() => {
    let animationId;
    
    const animate = () => {
      setTime(prev => prev + 1);
      animationId = requestAnimationFrame(animate);
    };
    
    animationId = requestAnimationFrame(animate);
    
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, []);
  
  return <MouseWaveText key={Math.floor(time / 180)} />;
};

export default AnimatedMouseWaveText;