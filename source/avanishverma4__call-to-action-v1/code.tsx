
import React, { useState, useEffect, useMemo } from 'react';
import { 
  ArrowRight,
  Sun,
  Moon,
  CloudSun,
  Sunset
} from 'lucide-react';

// --- Types ---

type TimeState = 'morning' | 'afternoon' | 'evening' | 'night';

interface ThemeConfig {
  gradient: string;
  glowLeft: string;
  glowRight: string;
  accentText: string;
  icon: React.ReactNode;
  label: string;
  shimmerColor: string;
}

// --- Constants ---

const THEMES: Record<TimeState, ThemeConfig> = {
  morning: {
    gradient: 'from-blue-900 via-indigo-900 to-amber-900/30',
    glowLeft: 'bg-amber-500/10',
    glowRight: 'bg-blue-400/10',
    accentText: 'text-amber-400',
    icon: <CloudSun className="w-4 h-4" />,
    label: 'Morning Edition',
    shimmerColor: 'conic-gradient(from 0deg, transparent, #fbbf24, transparent, #3b82f6, transparent)'
  },
  afternoon: {
    gradient: 'from-indigo-950 via-indigo-900 to-blue-800',
    glowLeft: 'bg-indigo-500/10',
    glowRight: 'bg-cyan-500/10',
    accentText: 'text-indigo-400',
    icon: <Sun className="w-4 h-4" />,
    label: 'Afternoon Edition',
    shimmerColor: 'conic-gradient(from 0deg, transparent, #6366f1, transparent, #06b6d4, transparent)'
  },
  evening: {
    gradient: 'from-indigo-950 via-purple-900 to-rose-900/40',
    glowLeft: 'bg-purple-500/10',
    glowRight: 'bg-rose-500/10',
    accentText: 'text-rose-400',
    icon: <Sunset className="w-4 h-4" />,
    label: 'Evening Edition',
    shimmerColor: 'conic-gradient(from 0deg, transparent, #a855f7, transparent, #f43f5e, transparent)'
  },
  night: {
    gradient: 'from-slate-950 via-indigo-950 to-black',
    glowLeft: 'bg-indigo-600/5',
    glowRight: 'bg-slate-800/10',
    accentText: 'text-indigo-500',
    icon: <Moon className="w-4 h-4" />,
    label: 'Night Edition',
    shimmerColor: 'conic-gradient(from 0deg, transparent, #4f46e5, transparent, #1e293b, transparent)'
  }
};

// --- Core Components ---

/**
 * Versatile Button Component used in CTAs
 */
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  shimmer?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  icon, 
  iconPosition = 'right',
  shimmer = false,
  ...props 
}) => {
  const baseStyles = "relative overflow-hidden inline-flex items-center justify-center font-semibold transition-all duration-500 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.03] active:scale-[0.97]";
  
  const variants = {
    primary: "bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 bg-size-200 hover:bg-right text-white shadow-lg shadow-indigo-600/20 hover:shadow-indigo-500/40 focus:ring-indigo-600 hover-pulse-shadow",
    secondary: "bg-white hover:bg-slate-100 text-slate-950 shadow-lg shadow-white/10 hover:shadow-white/20 focus:ring-white",
    outline: "border-2 border-slate-800 hover:border-indigo-500/50 hover:bg-slate-900 text-slate-200 focus:ring-slate-700 backdrop-blur-sm"
  };

  const sizes = {
    sm: "px-4 py-1.5 text-sm",
    md: "px-6 py-2.5 text-base",
    lg: "px-8 py-3.5 text-lg",
    xl: "px-10 py-4.5 text-xl"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className} group/btn`}
      {...props}
    >
      {shimmer && (
        <div className="absolute inset-0 pointer-events-none group-hover/btn:block hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer -skew-x-12"></div>
        </div>
      )}

      {icon && iconPosition === 'left' && (
        <span className="mr-2 transition-transform duration-300 group-hover/btn:-translate-x-1">
          {icon}
        </span>
      )}
      
      <span className="relative z-10">{children}</span>
      
      {icon && iconPosition === 'right' && (
        <span className="ml-2 transition-transform duration-300 group-hover/btn:translate-x-1">
          {icon}
        </span>
      )}
    </button>
  );
};

/**
 * High-Impact Banner CTA Component with Time-of-Day Dynamics and Shimmering Border
 */
const BannerCTA: React.FC = () => {
  const [timeState, setTimeState] = useState<TimeState>('afternoon');

  useEffect(() => {
    const updateTime = () => {
      const hour = new Date().getHours();
      if (hour >= 5 && hour < 12) setTimeState('morning');
      else if (hour >= 12 && hour < 17) setTimeState('afternoon');
      else if (hour >= 17 && hour < 21) setTimeState('evening');
      else setTimeState('night');
    };

    updateTime();
    const interval = setInterval(updateTime, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  const theme = THEMES[timeState];

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="group relative p-[1.5px] rounded-[24px] overflow-hidden transition-all duration-700">
        
        {/* Shimmering Border Layer (Hover Only) */}
        <div 
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
          style={{ padding: '2px' }}
        >
          <div 
            className="absolute inset-[-100%] animate-rotate-slow"
            style={{ background: theme.shimmerColor }}
          />
        </div>

        {/* Main Content Container */}
        <div className={`relative bg-gradient-to-br ${theme.gradient} rounded-[22.5px] p-12 md:p-24 text-center overflow-hidden shadow-2xl shadow-indigo-900/40 transition-all duration-1000`}>
          
          {/* Dynamic Theme Badge */}
          <div className="absolute top-8 right-8 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full glass-card border-white/10 text-[10px] uppercase tracking-widest font-bold text-white/40 group-hover:text-white/70 transition-colors">
            {theme.icon}
            <span>{theme.label}</span>
          </div>

          {/* Background Patterns */}
          <div className="absolute top-0 left-0 w-full h-full opacity-[0.05] pointer-events-none">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                  <circle cx="1" cy="1" r="1" fill="white" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid-pattern)" />
            </svg>
          </div>
          
          {/* Animated ambient glow orbs with dynamic colors */}
          <div className={`absolute -top-32 -left-32 w-96 h-96 ${theme.glowLeft} blur-[120px] rounded-full pointer-events-none group-hover:scale-110 transition-all duration-1000`}></div>
          <div className={`absolute -bottom-32 -right-32 w-96 h-96 ${theme.glowRight} blur-[120px] rounded-full pointer-events-none group-hover:scale-110 transition-all duration-1000`}></div>

          <div className="relative z-10 space-y-8">
            <h2 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight transition-all duration-700 group-hover:-translate-y-2">
              Ready to <span className={`${theme.accentText} transition-colors duration-1000`}>level up</span> your UI?
            </h2>
            
            <p className="text-indigo-100/70 text-lg md:text-xl max-w-2xl mx-auto opacity-90 leading-relaxed transition-all duration-500 group-hover:opacity-100 group-hover:text-white">
              Get lifetime access to all components, future updates, and our private community. 
              No subscription needed. Join 2,000+ developers today.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4">
              <Button 
                variant="primary" 
                size="lg" 
                shimmer={true}
                icon={<ArrowRight className="w-5 h-5" />}
              >
                Get Lifetime Access
              </Button>
              
              <Button 
                variant="outline" 
                size="lg" 
                className="text-white border-white/10 hover:border-white/40 hover:bg-white/5"
              >
                Book a Demo
              </Button>
            </div>
          </div>

          {/* Subtle decorative bottom line */}
          <div className={`absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000`}></div>
        </div>
      </div>
      
      {/* Decorative caption */}
      <div className="mt-8 text-center">
        <p className="text-slate-600 text-xs font-medium uppercase tracking-[0.3em]">
          Automatically adapting to your workflow
        </p>
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className={`min-h-screen p-6 md:p-12 flex flex-col items-center justify-center transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <BannerCTA />
    </div>
  );
}
