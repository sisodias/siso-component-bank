import React, { useState, useRef } from 'react';
import { cn } from "../_utils/cn";

interface ShimmerButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  asChild?: boolean;
  variant?: 'default' | 'secondary';
  size?: 'default' | 'sm' | 'lg';
  shimmerColor?: string;
}

const ShimmerButton = React.forwardRef<HTMLButtonElement, ShimmerButtonProps>(
  ({ 
    children, 
    className, 
    variant = 'default', 
    size = 'default',
    shimmerColor,
    onMouseMove,
    onMouseLeave,
    ...props 
  }, ref) => {
    const [shimmerX, setShimmerX] = useState('0%');
    const buttonRef = useRef<HTMLButtonElement>(null);

    const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
      const button = buttonRef.current;
      if (!button) return;
      
      const rect = button.getBoundingClientRect();
      const offsetX = e.clientX - rect.left;
      const percent = (offsetX / rect.width) * 100;
      let mapped = percent - 50;
      const step = 5;
      mapped = Math.round(mapped / step) * step;
      setShimmerX(`${mapped}%`);
      
      onMouseMove?.(e);
    };

    const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
      setShimmerX('0%');
      onMouseLeave?.(e);
    };

    const sizeClasses = {
      default: 'px-4 py-2.5 text-sm',
      sm: 'px-3 py-1.5 text-xs',
      lg: 'px-6 py-3 text-base'
    };

    const variantClasses = {
      default: [
        'bg-gradient-to-b from-muted-foreground to-background',
        'hover:from-white hover:via-muted-foreground hover:to-muted',
        'dark:from-muted-foreground dark:to-background',
        'dark:hover:from-white dark:hover:via-muted-foreground dark:hover:to-muted'
      ].join(' '),
      secondary: [
        'bg-gradient-to-b from-secondary to-secondary/80',
        'hover:from-secondary-foreground hover:via-secondary hover:to-secondary/60'
      ].join(' ')
    };

    return (
      <button
        ref={(node) => {
          buttonRef.current = node;
          if (typeof ref === 'function') ref(node);
          else if (ref) ref.current = node;
        }}
        className={cn(
          // Base styles
          'relative inline-flex items-center justify-center rounded-sm font-bold transition-all duration-200 ease-out',
          'select-none cursor-pointer overflow-hidden',
          
          // 3D button effect
          'shadow-[inset_0_0_0.1rem_0_hsl(var(--muted-foreground)),0_0.3rem_0.1rem_-0.2rem_hsl(var(--muted-foreground)/0.6),0_0.3rem_0_0_hsl(var(--muted)/0.8),0_0.4rem_0_0.1rem_hsl(var(--background)/0.3),-0.4rem_0.4rem_0.2rem_0_hsl(var(--background)/0.4)]',
          
          // Hover effects
          'hover:translate-y-1.5 hover:text-primary-foreground hover:shadow-[inset_0_0_0.1rem_0_hsl(var(--muted-foreground)),0_0rem_0.1rem_-0.2rem_hsl(var(--muted-foreground)/0.6),0_0rem_0_0_hsl(var(--muted)/0.8),0_0.1rem_0_0.1rem_hsl(var(--background)/0.3),-0.1rem_0_0.2rem_0_hsl(var(--background)/0.4)]',
          
          // Text shadow effects
          'text-shadow-[0_-2px_1px_hsl(var(--background)/0.3),0_2px_1px_hsl(var(--primary-foreground)/0.3)]',
          'hover:text-shadow-[0_0_5px_hsl(var(--primary-foreground))]',
          
          // Size and variant classes
          sizeClasses[size],
          variantClasses[variant],
          
          // Focus styles
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          
          // Disabled styles
          'disabled:pointer-events-none disabled:opacity-50',
          
          className
        )}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        {/* Sweep highlight effect */}
        <div 
          className="absolute inset-0 w-8 h-full bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-32deg] translate-x-8 transition-all duration-200 ease-out hover:w-4 hover:skew-x-0 hover:-translate-x-12 hover:opacity-0"
          aria-hidden="true"
        />
        
        {/* Content */}
        <span className="relative z-10">
          {children}
        </span>
        
        {/* Shimmer effect */}
        <div 
          className="absolute left-1/2 top-[12%] z-20 pointer-events-none opacity-0 transition-all duration-200 ease-out group-hover:opacity-100 hover:opacity-100"
          style={{
            transform: `translateX(${shimmerX})`,
            '--shimmer-color': shimmerColor || 'hsl(var(--primary-foreground))'
          } as React.CSSProperties}
        >
          {/* Three rotating shimmer particles */}
          {[0, 1, 2].map((index) => (
            <div
              key={index}
              className="absolute left-1/2 top-1/2 w-12 h-12 -translate-x-1/2 -translate-y-1/2"
              style={{
                animation: `shimmer-spin 8s linear infinite`,
                animationDelay: `${-index * 8/3}s`
              }}
            >
              <div 
                className="absolute left-1/2 top-1/2 w-3 h-3 -translate-x-1/2 -translate-y-1/2 rounded-full blur-sm"
                style={{
                  backgroundColor: 'var(--shimmer-color)',
                  animation: 'shimmer-spin 4s linear reverse infinite'
                }}
              />
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background: `radial-gradient(var(--shimmer-color) 69%, transparent 70%)`,
                  backgroundSize: '45%',
                  backgroundPosition: '2%',
                  animation: 'shimmer-flicker 8s linear infinite'
                }}
              />
            </div>
          ))}
        </div>
        
        {/* Custom animations */}
        <style jsx>{`
          @keyframes shimmer-spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          
          @keyframes shimmer-flicker {
            0% { 
              background-size: 45%;
              background-position: 2%;
            }
            50% { 
              background-size: 42%;
              background-position: 0%;
            }
            100% { 
              background-size: 45%;
              background-position: 2%;
            }
          }
        `}</style>
      </button>
    );
  }
);

ShimmerButton.displayName = 'ShimmerButton';

export { ShimmerButton, type ShimmerButtonProps };