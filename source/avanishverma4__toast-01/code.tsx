import React, { useState, useCallback, useEffect, ReactNode } from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X, Undo2 } from 'lucide-react';

// Spinner Component
const Spinner = ({ size = 20, color = "#8f8f8f" }: { size?: number; color?: string }) => {
  const bars = [
    { animationDelay: "-1.2s", transform: "rotate(.0001deg) translate(146%)" },
    { animationDelay: "-1.1s", transform: "rotate(30deg) translate(146%)" },
    { animationDelay: "-1.0s", transform: "rotate(60deg) translate(146%)" },
    { animationDelay: "-0.9s", transform: "rotate(90deg) translate(146%)" },
    { animationDelay: "-0.8s", transform: "rotate(120deg) translate(146%)" },
    { animationDelay: "-0.7s", transform: "rotate(150deg) translate(146%)" },
    { animationDelay: "-0.6s", transform: "rotate(180deg) translate(146%)" },
    { animationDelay: "-0.5s", transform: "rotate(210deg) translate(146%)" },
    { animationDelay: "-0.4s", transform: "rotate(240deg) translate(146%)" },
    { animationDelay: "-0.3s", transform: "rotate(270deg) translate(146%)" },
    { animationDelay: "-0.2s", transform: "rotate(300deg) translate(146%)" },
    { animationDelay: "-0.1s", transform: "rotate(330deg) translate(146%)" }
  ];

  return (
    <div style={{ width: size, height: size }}>
      <div style={{ position: 'relative', top: '50%', left: '50%', width: size, height: size }}>
        {bars.map((item, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              height: '8%',
              width: '24%',
              left: '-10%',
              top: '-3.9%',
              borderRadius: '5px',
              backgroundColor: color,
              animation: 'fadeSpin 1.2s linear infinite',
              ...item
            }}
          />
        ))}
      </div>
    </div>
  );
};

// Button Component
interface ButtonProps {
  size?: 'tiny' | 'small' | 'medium' | 'large';
  type?: 'primary' | 'secondary' | 'tertiary' | 'error' | 'warning';
  variant?: 'styled' | 'unstyled';
  shape?: 'square' | 'circle' | 'rounded';
  svgOnly?: boolean;
  children?: React.ReactNode;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  shadow?: boolean;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  className?: string;
}

const Button = ({
  size = "medium",
  type = "primary",
  variant = "styled",
  shape = "square",
  svgOnly = false,
  children,
  prefix,
  suffix,
  shadow = false,
  loading = false,
  disabled = false,
  fullWidth = false,
  onClick,
  className = "",
}: ButtonProps) => {
  const sizeClasses = svgOnly ? {
    tiny: "w-6 h-6 text-sm",
    small: "w-8 h-8 text-sm",
    medium: "w-10 h-10 text-sm",
    large: "w-12 h-12 text-base"
  } : {
    tiny: "px-1.5 h-6 text-sm",
    small: "px-1.5 h-8 text-sm",
    medium: "px-2.5 h-10 text-sm",
    large: "px-3.5 h-12 text-base"
  };

  const typeClasses = {
    primary: "bg-gray-900 hover:bg-gray-700 text-white",
    secondary: "bg-white hover:bg-gray-100 text-gray-900 border border-gray-300",
    tertiary: "bg-transparent hover:bg-gray-100 text-gray-900",
    error: "bg-red-600 hover:bg-red-700 text-white",
    warning: "bg-amber-500 hover:bg-amber-600 text-black"
  };

  const shapeClasses = {
    square: { tiny: "rounded", small: "rounded-md", medium: "rounded-md", large: "rounded-lg" },
    circle: { tiny: "rounded-full", small: "rounded-full", medium: "rounded-full", large: "rounded-full" },
    rounded: { tiny: "rounded-full", small: "rounded-full", medium: "rounded-full", large: "rounded-full" }
  };

  const baseClasses = "flex justify-center items-center gap-0.5 transition-all duration-150";
  const disabledClasses = (disabled || loading) ? "bg-gray-200 text-gray-500 border border-gray-300 cursor-not-allowed" : typeClasses[type];
  const widthClass = fullWidth ? "w-full" : "";
  const shadowClass = shadow ? "shadow-sm" : "";
  const variantClass = variant === "unstyled" ? "outline-none px-0 h-fit bg-transparent hover:bg-transparent text-gray-900" : "focus:ring-2 focus:ring-blue-500 focus:outline-none";

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`${baseClasses} ${sizeClasses[size]} ${disabledClasses} ${shapeClasses[shape][size]} ${shadowClass} ${widthClass} ${variantClass} ${className}`}
    >
      {loading ? <Spinner size={size === "large" ? 24 : 16} /> : prefix}
      {children && (
        <span className={`relative overflow-hidden whitespace-nowrap ${size !== "tiny" && variant !== "unstyled" ? "px-1.5" : ""}`}>
          {children}
        </span>
      )}
      {!loading && suffix}
    </button>
  );
};

// Toast System
type Toast = {
  id: number;
  text: string | ReactNode;
  measuredHeight?: number;
  timeout?: ReturnType<typeof setTimeout>;
  remaining?: number;
  start?: number;
  pause?: () => void;
  resume?: () => void;
  preserve?: boolean;
  action?: string;
  onAction?: () => void;
  onUndoAction?: () => void;
  type: "message" | "success" | "warning" | "error";
};

const ToastDemo = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [shownIds, setShownIds] = useState<number[]>([]);
  const [isHovered, setIsHovered] = useState(false);
  const toastIdRef = React.useRef(0);

  const addToast = useCallback((
    text: string | ReactNode,
    type: "message" | "success" | "warning" | "error",
    preserve?: boolean,
    action?: string,
    onAction?: () => void,
    onUndoAction?: () => void
  ) => {
    const id = toastIdRef.current++;
    const newToast: Toast = { id, text, preserve, action, onAction, onUndoAction, type };

    if (!preserve) {
      newToast.remaining = 3000;
      newToast.start = Date.now();

      const close = () => {
        setToasts(prev => prev.filter(t => t.id !== id));
      };

      newToast.timeout = setTimeout(close, newToast.remaining);

      newToast.pause = () => {
        if (!newToast.timeout) return;
        clearTimeout(newToast.timeout);
        newToast.timeout = undefined;
        newToast.remaining! -= Date.now() - newToast.start!;
      };

      newToast.resume = () => {
        if (newToast.timeout) return;
        newToast.start = Date.now();
        newToast.timeout = setTimeout(close, newToast.remaining);
      };
    }

    setToasts(prev => [...prev, newToast]);
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  useEffect(() => {
    const unseen = toasts.filter(t => !shownIds.includes(t.id)).map(t => t.id);
    if (unseen.length > 0) {
      requestAnimationFrame(() => {
        setShownIds(prev => [...prev, ...unseen]);
      });
    }
  }, [toasts, shownIds]);

  const measureRef = (toast: Toast) => (node: HTMLDivElement | null) => {
    if (node && toast.measuredHeight == null) {
      toast.measuredHeight = node.getBoundingClientRect().height;
      setToasts(prev => [...prev]);
    }
  };

  const lastVisibleCount = 3;
  const lastVisibleStart = Math.max(0, toasts.length - lastVisibleCount);

  const getFinalTransform = (index: number, length: number) => {
    if (index === length - 1) return "none";
    const offset = length - 1 - index;
    let translateY = toasts[length - 1]?.measuredHeight || 63;
    for (let i = length - 1; i > index; i--) {
      translateY += isHovered ? (toasts[i - 1]?.measuredHeight || 63) + 10 : 20;
    }
    const z = -offset;
    const scale = isHovered ? 1 : (1 - 0.05 * offset);
    return `translate3d(0, calc(100% - ${translateY}px), ${z}px) scale(${scale})`;
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    toasts.forEach(t => t.pause?.());
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    toasts.forEach(t => t.resume?.());
  };

  const visibleToasts = toasts.slice(lastVisibleStart);
  const containerHeight = visibleToasts.reduce((acc, toast) => acc + (toast.measuredHeight ?? 63), 0);

  const getToastStyles = (toast: Toast) => {
    const baseStyles = {
      message: { bg: 'bg-blue-500', text: 'text-white', icon: 'text-white' },
      success: { bg: 'bg-green-500', text: 'text-white', icon: 'text-white' },
      warning: { bg: 'bg-orange-500', text: 'text-white', icon: 'text-white' },
      error: { bg: 'bg-red-500', text: 'text-white', icon: 'text-white' }
    };
    return baseStyles[toast.type];
  };

  return (
    <div className="w-full h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8 relative">
      <style>{`
        @keyframes fadeSpin {
          0% { opacity: 1; }
          100% { opacity: 0.15; }
        }
        .grid-background {
          background-image: 
            linear-gradient(to right, rgba(0, 0, 0, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 0, 0, 0.05) 1px, transparent 1px);
          background-size: 40px 40px;
        }
      `}</style>
      
      <div className="absolute inset-0 grid-background pointer-events-none"></div>
      
      <div className="max-w-4xl mx-auto relative z-10" style={{ marginTop: '55px' }}>
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Toast Component Demo</h1>
          <p className="text-gray-600 mb-8">A beautiful, animated toast notification system with stacking and interactions</p>
          
          <div className="grid grid-cols-2 gap-4 mb-8">
            <button 
              onClick={() => addToast("Operation completed successfully!", "success")}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-green-200 text-green-700 rounded-lg hover:bg-green-300 transition-colors font-medium"
            >
              <CheckCircle2 size={18} />
              Success Toast
            </button>
            
            <button 
              onClick={() => addToast("Something went wrong. Please try again.", "error")}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-red-200 text-red-700 rounded-lg hover:bg-red-300 transition-colors font-medium"
            >
              <AlertCircle size={18} />
              Error Toast
            </button>
            
            <button 
              onClick={() => addToast("Warning: Please review your changes carefully.", "warning")}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-orange-200 text-orange-700 rounded-lg hover:bg-orange-300 transition-colors font-medium"
            >
              <AlertTriangle size={18} />
              Warning Toast
            </button>
            
            <button 
              onClick={() => addToast("This is an informational message.", "message")}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-200 text-blue-700 rounded-lg hover:bg-blue-300 transition-colors font-medium"
            >
              <Info size={18} />
              Message Toast
            </button>
          </div>


        </div>


      </div>

      {/* Toast Container */}
      <div 
        className="fixed bottom-4 right-4 z-50 pointer-events-none"
        style={{ width: 420, height: containerHeight }}
      >
        <div 
          className="relative pointer-events-auto w-full"
          style={{ height: containerHeight }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {toasts.map((toast, index) => {
            const isVisible = index >= lastVisibleStart;
            const styles = getToastStyles(toast);
            
            return (
              <div
                key={toast.id}
                ref={measureRef(toast)}
                className={`absolute right-0 bottom-0 rounded-xl shadow-2xl p-4 ${styles.bg} ${styles.text} ${
                  isVisible ? 'opacity-100' : 'opacity-0'
                } ${index < lastVisibleStart ? 'pointer-events-none' : ''}`}
                style={{
                  width: 420,
                  transition: 'all 0.35s cubic-bezier(0.25, 0.75, 0.6, 0.98)',
                  transform: shownIds.includes(toast.id) 
                    ? getFinalTransform(index, toasts.length) 
                    : 'translate3d(0, 100%, 150px) scale(1)'
                }}
              >
                <div className="flex flex-col gap-2 text-sm">
                  <div className="flex items-center justify-between gap-4">
                    <span className="flex-1">{toast.text}</span>
                    {!toast.action && (
                      <div className="flex gap-1 flex-shrink-0">
                        {toast.onUndoAction && (
                          <button
                            onClick={() => {
                              toast.onUndoAction?.();
                              removeToast(toast.id);
                            }}
                            className="p-1.5 hover:bg-black/10 rounded transition-colors"
                          >
                            <Undo2 size={16} />
                          </button>
                        )}
                        <button
                          onClick={() => removeToast(toast.id)}
                          className="p-1.5 hover:bg-black/10 rounded transition-colors"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                  {toast.action && (
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => removeToast(toast.id)}
                        className="px-3 py-1.5 hover:bg-black/10 rounded transition-colors text-sm"
                      >
                        Dismiss
                      </button>
                      <button
                        onClick={() => {
                          toast?.onAction?.();
                          removeToast(toast.id);
                        }}
                        className="px-3 py-1.5 bg-gray-800/20 hover:bg-gray-800/30 rounded transition-colors text-sm font-medium"
                      >
                        {toast.action}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ToastDemo;
