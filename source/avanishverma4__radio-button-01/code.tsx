import { useState } from "react";

// Framer Motion inline implementation for smooth animations
const MotionDiv = ({ children, className, style, animate, initial, transition, ...props }) => {
  const [isAnimated, setIsAnimated] = useState(false);
  
  React.useEffect(() => {
    const timer = setTimeout(() => setIsAnimated(true), 10);
    return () => clearTimeout(timer);
  }, [animate]);

  const animatedStyle = {
    ...style,
    transform: isAnimated && animate?.scale ? `scale(${animate.scale})` : 'scale(1)',
    opacity: isAnimated ? (animate?.opacity ?? 1) : (initial?.opacity ?? 1),
    transition: `all ${transition?.duration || 0.3}s ${transition?.ease || 'ease-out'}`,
  };

  return <div className={className} style={animatedStyle} {...props}>{children}</div>;
};

// Orthogonal Grid Background
const GridBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div 
      className="absolute inset-0"
      style={{
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
      }}
    />
    <div 
      className="absolute inset-0"
      style={{
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)
        `,
        backgroundSize: '180px 180px',
      }}
    />
    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-black/50 to-black/80" />
  </div>
);

// Radio Item Component
const RadioItem = ({ 
  id, 
  value, 
  label, 
  description, 
  selected, 
  onSelect 
}) => {
  const isSelected = selected === value;
  
  return (
    <button
      onClick={() => onSelect(value)}
      className={`
        group relative w-full text-left
        px-8 py-6
        border transition-all duration-500 ease-out
        ${isSelected 
          ? 'border-white/40 bg-white/5' 
          : 'border-white/10 bg-transparent hover:border-white/20 hover:bg-white/[0.02]'
        }
      `}
    >
      <div className="flex items-start gap-6">
        {/* Radio Circle */}
        <div className="relative mt-1 flex-shrink-0">
          <div 
            className={`
              w-5 h-5 rounded-full border-2 
              transition-all duration-300 ease-out
              flex items-center justify-center
              ${isSelected 
                ? 'border-white' 
                : 'border-white/30 group-hover:border-white/50'
              }
            `}
          >
            <div 
              className={`
                w-2.5 h-2.5 rounded-full bg-white
                transition-all duration-300 ease-out
                ${isSelected 
                  ? 'scale-100 opacity-100' 
                  : 'scale-0 opacity-0'
                }
              `}
            />
          </div>
          
          {/* Glow Effect */}
          {isSelected && (
            <div className="absolute inset-0 -m-1 rounded-full bg-white/20 blur-md animate-pulse" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <span 
            className={`
              block text-base font-medium tracking-wide
              transition-colors duration-300
              ${isSelected ? 'text-white' : 'text-white/70 group-hover:text-white/90'}
            `}
          >
            {label}
          </span>
          
          {description && (
            <span 
              className={`
                block mt-2 text-sm leading-relaxed
                transition-colors duration-300
                ${isSelected ? 'text-white/60' : 'text-white/40 group-hover:text-white/50'}
              `}
            >
              {description}
            </span>
          )}
        </div>

        {/* Selection Indicator */}
        <div 
          className={`
            flex-shrink-0 mt-1
            transition-all duration-300
            ${isSelected ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}
          `}
        >
          <svg 
            width="16" 
            height="16" 
            viewBox="0 0 16 16" 
            fill="none"
            className="text-white"
          >
            <path 
              d="M3 8L6.5 11.5L13 5" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {/* Bottom Accent Line */}
      <div 
        className={`
          absolute bottom-0 left-0 h-px bg-gradient-to-r from-transparent via-white to-transparent
          transition-all duration-500
          ${isSelected ? 'w-full opacity-30' : 'w-0 opacity-0'}
        `}
      />
    </button>
  );
};

// Radio Group Component
const RadioGroup = ({ 
  options, 
  value, 
  onChange, 
  label,
  className = '' 
}) => (
  <div className={`space-y-4 ${className}`}>
    {label && (
      <label className="block text-xs font-medium uppercase tracking-[0.2em] text-white/50 mb-6">
        {label}
      </label>
    )}
    
    <div className="space-y-3">
      {options.map((option) => (
        <RadioItem
          key={option.value}
          {...option}
          selected={value}
          onSelect={onChange}
        />
      ))}
    </div>
  </div>
);

// Main Demo Component
export default function PremiumRadioDemo() {
  const [selected, setSelected] = useState('standard');

  const options = [
    {
      value: 'standard',
      label: 'Standard',
      description: 'Perfect for individuals and small teams getting started.',
    },
    {
      value: 'professional',
      label: 'Professional',
      description: 'Advanced features for growing businesses and enterprises.',
    },
    {
      value: 'enterprise',
      label: 'Enterprise',
      description: 'Custom solutions with dedicated support and SLA guarantees.',
    },
  ];

  return (
    <div className="w-full relative min-h-screen bg-black text-white overflow-hidden">
      <GridBackground />
      
      <div className="relative z-10 min-h-screen flex items-center justify-center p-8">
        <div className="w-full max-w-lg">
          {/* Header */}
          <div className="mb-16 text-center">
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-white/40 mb-4">
              Select Your Plan
            </p>
            <h1 className="text-3xl font-light tracking-tight text-white">
              Choose your tier
            </h1>
          </div>

          {/* Radio Group */}
          <RadioGroup
            label="Available Plans"
            options={options}
            value={selected}
            onChange={setSelected}
          />

          {/* Footer */}
          <div className="mt-16 pt-8 border-t border-white/10">
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/40">
                Selected: <span className="text-white/70 capitalize">{selected}</span>
              </span>
              
              <button className="px-6 py-3 bg-white text-black text-sm font-medium tracking-wide hover:bg-white/90 transition-colors duration-300">
                Continue
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}