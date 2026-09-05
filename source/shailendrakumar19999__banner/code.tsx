import React from 'react'
import { cn } from "@/lib/utils";
import { X} from 'lucide-react';

const Button = React.forwardRef(({ className, variant = "default", size = "default", ...props }, ref) => {
  const baseStyles = "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
  
  const variants = {
    default: "bg-slate-900 text-white hover:bg-slate-800",
    ghost: "hover:bg-black/5 dark:hover:bg-white/5",
    outline: "border border-slate-200 hover:bg-slate-50"
  };
  
  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-8 px-3",
    icon: "h-9 w-9"
  };
  
  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      ref={ref}
      {...props}
    />
  );
});



//  Banner Style Component
const bannerStyles = {
  variants: {
    aurora: {
      container: 'bg-gradient-to-r from-violet-500/10 via-purple-500/10 to-fuchsia-500/10 border-violet-300/50 backdrop-blur-sm',
      accent: 'bg-gradient-to-r from-violet-500 to-fuchsia-500',
      text: 'text-violet-900 dark:text-violet-100'
    },
    neon: {
      container: 'bg-slate-900 border-cyan-400/50 shadow-[0_0_15px_rgba(34,211,238,0.3)]',
      accent: 'bg-cyan-400',
      text: 'text-cyan-100'
    },
    sunset: {
      container: 'bg-gradient-to-r from-orange-50 via-rose-50 to-pink-50 border-orange-300/50',
      accent: 'bg-gradient-to-r from-orange-500 to-rose-500',
      text: 'text-orange-900 dark:text-orange-100'
    },
    forest: {
      container: 'bg-gradient-to-r from-emerald-50 via-teal-50 to-green-50 border-emerald-300/50',
      accent: 'bg-gradient-to-r from-emerald-500 to-teal-500',
      text: 'text-emerald-900 dark:text-emerald-100'
    },
    midnight: {
      container: 'bg-gradient-to-r from-slate-800 to-slate-900 border-slate-600/50',
      accent: 'bg-gradient-to-r from-blue-400 to-indigo-400',
      text: 'text-slate-100'
    },
    glass: {
      container: 'bg-white/30 dark:bg-black/30 backdrop-blur-xl border-white/50 dark:border-white/20',
      accent: 'bg-gradient-to-r from-blue-500 to-purple-500',
      text: 'text-slate-900 dark:text-slate-100'
    }
  }
};


export function Banner({
  variant = 'aurora',
  title,
  description,
  icon,
  onHide,
  show=true,
  action,
  closable = false,
  autoHide,
  animated = true,
  className,
  ...props
}) {
 

 React.useEffect(() => {
    if (autoHide && show) {
      const timer = setTimeout(() => {
        onHide?.();
      }, autoHide);
      return () => clearTimeout(timer);
    }
  }, [autoHide, onHide, show]);

  if (!show) return null;

  const styles = bannerStyles.variants[variant];

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl border-2 p-5 transition-all duration-300',
        styles.container,
        animated && 'animate-[slideDown_0.3s_ease-out]',
        className
      )}
      role="status"
      {...props}
    >
      {/* Animated gradient orb */}
      {animated && (
        <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-gradient-to-br from-white/20 to-transparent blur-3xl animate-pulse" />
      )}
      
      {/* Side accent bar */}
      <div className={cn('absolute left-0 top-0 h-full w-1.5', styles.accent)} />

      <div className="relative flex items-start justify-between gap-4">
        <div className="flex min-w-0 flex-1 items-start gap-4">
          {icon && (
            <div className={cn(
              'flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl',
              styles.accent,
              'shadow-lg'
            )}>
              <div className="text-white">
                {icon}
              </div>
            </div>
          )}

          <div className="min-w-0 flex-1 pt-1">
            <h3 className={cn('text-lg font-bold mb-1', styles.text)}>
              {title}
            </h3>
            {description && (
              <p className={cn('text-sm opacity-75', styles.text)}>
                {description}
              </p>
            )}
            
            {action && (
              <div className="mt-3">
                {action}
              </div>
            )}
          </div>
        </div>

        {closable && (
          <Button 
            onClick={onHide} 
            size="icon" 
            variant="ghost"
            className="flex-shrink-0 -mt-1 -mr-1 rounded-lg"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Bottom glow effect */}
      {animated && (
        <div className={cn(
          'absolute -bottom-px left-0 right-0 h-px',
          styles.accent,
          'blur-sm'
        )} />
      )}
    </div>
  );
}
