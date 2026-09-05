import React from 'react';

interface GlowHeroProps {
  label?: string;
  glowText: string;
  labelSize?: 'sm' | 'md' | 'lg';
  glowTextSize?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const GlowHero: React.FC<GlowHeroProps> = ({ 
  label, 
  glowText, 
  labelSize = 'md',
  glowTextSize = 'lg',
  className = '' 
}) => {
  const labelSizeClasses = {
    sm: 'text-xl',
    md: 'text-2xl md:text-3xl',
    lg: 'text-3xl md:text-4xl'
  };

  const glowTextSizeClasses = {
    sm: 'text-3xl md:text-4xl',
    md: 'text-4xl md:text-5xl',
    lg: 'text-5xl md:text-6xl',
    xl: 'text-6xl md:text-7xl'
  };

  return (
    <>
      <style jsx>{`
        .glow-text::before {
          content: attr(data-text);
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, #00cfff, #a600ff, #ff006e, #ff8800);
          filter: blur(20px) brightness(0.8);
          opacity: 0.7;
          border-radius: 100px;
          z-index: -1;
          pointer-events: none;
          background-size: 200% 200%;
          animation: gradientShift 12s ease-in-out infinite;
        }
        
        .glow-text::after {
          content: attr(data-text);
          position: absolute;
          inset: 0;
          font-size: inherit;
          font-weight: inherit;
          font-family: inherit;
          letter-spacing: inherit;
          background: linear-gradient(90deg, #00cfff, #a600ff, #ff006e, #ff8800);
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          mix-blend-mode: color-burn;
          filter: blur(3px) brightness(1.3);
          z-index: 0;
          pointer-events: none;
          background-size: 200% 200%;
          animation: gradientShift 12s ease-in-out infinite;
        }
        
        @keyframes gradientShift {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
      
      <div className={`flex flex-col items-center justify-center ${className}`}>
        {label && (
          <div className={`${labelSizeClasses[labelSize]} font-medium text-foreground mb-4 text-center transition-opacity duration-300 ease-out`}>
            {label} 
          </div>
        )}
        <div className="relative">
          <div 
            className={`glow-text relative ${glowTextSizeClasses[glowTextSize]} font-medium text-center text-white tracking-tight brightness-110 z-10`}
            data-text={glowText}
          >
            {glowText}
          </div>
        </div>
      </div>
    </>
  );
};

export default GlowHero;