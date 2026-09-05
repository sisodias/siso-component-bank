import React, { InputHTMLAttributes, useState } from 'react';
import { cn } from "@/lib/utils";
interface NeonCheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: React.ReactNode;
}

const NeonCheckbox: React.FC<NeonCheckboxProps> = ({ 
  label, 
  className = '',
  checked: controlledChecked,
  defaultChecked,
  onChange,
  ...props 
}) => {
  // Use internal state for uncontrolled component
  const [internalChecked, setInternalChecked] = useState(defaultChecked || false);
  
  // Determine if component is controlled or uncontrolled
  const isControlled = controlledChecked !== undefined;
  const isChecked = isControlled ? controlledChecked : internalChecked;
  
  // Handle changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isControlled) {
      setInternalChecked(e.target.checked);
    }
    onChange?.(e);
  };

  // Define CSS variables with React using inline styles
  const neonCheckboxStyles = {
    '--primary': '#00ffaa',
    '--primary-dark': '#00cc88',
    '--primary-light': '#88ffdd',
    '--size': '30px',
  } as React.CSSProperties;

  return (
    <label 
      className={`relative inline-block w-[var(--size)] h-[var(--size)] cursor-pointer ${className}`} 
      style={neonCheckboxStyles}
    >
      <input 
        type="checkbox" 
        className="hidden" 
        checked={isChecked}
        onChange={handleChange}
        {...props} 
      />
      
      <div className="relative w-full h-full neon-checkbox__frame">
        <div className={`absolute inset-0 bg-black/80 rounded border-2 transition-all duration-400 neon-checkbox__box ${
          isChecked 
            ? 'border-[var(--primary)] bg-[rgba(0,255,170,0.1)]' 
            : 'border-[var(--primary-dark)]'
        }`}>
          <div className="absolute inset-[2px] flex items-center justify-center neon-checkbox__check-container">
            <svg 
              viewBox="0 0 24 24" 
              className={`w-4/5 h-4/5 fill-none stroke-[var(--primary)] stroke-[3] stroke-linecap-round stroke-linejoin-round [stroke-dasharray:40] origin-center transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] neon-checkbox__check ${
                isChecked 
                  ? '[stroke-dashoffset:0] scale-110' 
                  : '[stroke-dashoffset:40]'
              }`}
            >
              <path d="M3,12.5l7,7L21,5"></path>
            </svg>
          </div>
          
          <div className={`absolute -inset-0.5 rounded-md bg-[var(--primary)] blur-md transition-opacity duration-400 neon-checkbox__glow ${
            isChecked ? 'opacity-20' : 'opacity-0'
          }`} />
          
          <div className="absolute inset-0 rounded overflow-hidden neon-checkbox__borders">
            {[...Array(4)].map((_, i) => (
              <span 
                key={i} 
                className={`absolute w-10 h-px bg-[var(--primary)] transition-opacity duration-400 ${
                  isChecked ? 'opacity-100' : 'opacity-0'
                } ${
                  i === 0 ? 'top-0 left-[-100%] animate-[borderFlow1_2s_linear_infinite]' : 
                  i === 1 ? 'top-[-100%] right-0 w-px h-10 animate-[borderFlow2_2s_linear_infinite]' : 
                  i === 2 ? 'bottom-0 right-[-100%] animate-[borderFlow3_2s_linear_infinite]' : 
                  'bottom-[-100%] left-0 w-px h-10 animate-[borderFlow4_2s_linear_infinite]'
                }`}
              />
            ))}
          </div>
        </div>
        
        <div className="neon-checkbox__effects">
          <div className="absolute inset-0 neon-checkbox__particles">
            {[...Array(12)].map((_, i) => (
              <span 
                key={i} 
                className={`absolute w-1 h-1 bg-[var(--primary)] rounded-full pointer-events-none top-1/2 left-1/2 shadow-[0_0_6px_var(--primary)] ${
                  isChecked ? 'animate-[particleExplosion_0.6s_ease-out_forwards]' : 'opacity-0'
                }`}
                style={{ 
                  '--x': [
                    '25px', '-25px', '25px', '-25px', '35px', 
                    '-35px', '0px', '0px', '20px', '-20px', 
                    '30px', '-30px'
                  ][i],
                  '--y': [
                    '-25px', '-25px', '25px', '25px', '0px', 
                    '0px', '35px', '-35px', '-30px', '30px', 
                    '20px', '-20px'
                  ][i],
                } as React.CSSProperties}
              />
            ))}
          </div>
          
          <div className="absolute -inset-5 pointer-events-none neon-checkbox__rings">
            {[...Array(3)].map((_, i) => (
              <div 
                key={i} 
                className={`absolute inset-0 rounded-full border border-[var(--primary)] scale-0 ring ${
                  isChecked ? 'animate-[ringPulse_0.6s_ease-out_forwards]' : 'opacity-0'
                }`}
                style={{ animationDelay: `${i * 0.1}s` } as React.CSSProperties}
              />
            ))}
          </div>
          
          <div className="absolute inset-0 neon-checkbox__sparks">
            {[...Array(4)].map((_, i) => (
              <span 
                key={i} 
                className={`absolute w-5 h-px bg-gradient-to-r from-[var(--primary)] to-transparent top-1/2 left-1/2 ${
                  isChecked ? 'animate-[sparkFlash_0.6s_ease-out_forwards]' : 'opacity-0'
                }`}
                style={{ '--r': `${i * 90}deg` } as React.CSSProperties}
              />
            ))}
          </div>
        </div>
      </div>
      
      {label && (
        <span className="ml-8 text-white">{label}</span>
      )}

      {/* Add keyframes as a style tag */}
      <style jsx>{`
        @keyframes borderFlow1 {
          0% { transform: translateX(0); }
          100% { transform: translateX(200%); }
        }
        @keyframes borderFlow2 {
          0% { transform: translateY(0); }
          100% { transform: translateY(200%); }
        }
        @keyframes borderFlow3 {
          0% { transform: translateX(0); }
          100% { transform: translateX(-200%); }
        }
        @keyframes borderFlow4 {
          0% { transform: translateY(0); }
          100% { transform: translateY(-200%); }
        }
        @keyframes particleExplosion {
          0% { transform: translate(-50%, -50%) scale(1); opacity: 0; }
          20% { opacity: 1; }
          100% { 
            transform: translate(
              calc(-50% + var(--x, 20px)),
              calc(-50% + var(--y, 20px))
            ) scale(0);
            opacity: 0;
          }
        }
        @keyframes ringPulse {
          0% { transform: scale(0); opacity: 1; }
          100% { transform: scale(2); opacity: 0; }
        }
        @keyframes sparkFlash {
          0% { 
            transform: rotate(var(--r, 0deg)) translateX(0) scale(1);
            opacity: 1;
          }
          100% {
            transform: rotate(var(--r, 0deg)) translateX(30px) scale(0);
            opacity: 0;
          }
        }
      `}</style>
    </label>
  );
};

export {NeonCheckbox}