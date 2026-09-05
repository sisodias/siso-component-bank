"use client";

import React, { 
  ReactNode, 
  useState, 
  useMemo, 
  MouseEvent, 
  CSSProperties, 
  isValidElement,
  cloneElement
} from 'react';

// --- HELPER TYPES & CONSTANTS ---

interface RippleState {
  key: number;
  x: number;
  y: number;
  size: number;
}

interface RippleEffectProps extends React.HTMLAttributes<HTMLElement> {
  children: ReactNode;
  rippleColor?: string;
  rippleDuration?: number;
  disabled?: boolean;
}

// A set of HTML tags that are "void" (cannot have children).
const VOID_ELEMENTS = new Set([
  'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 
  'keygen', 'link', 'meta', 'param', 'source', 'track', 'wbr'
]);


// --- THE RIPPLE OVERLAY (INTERNAL COMPONENT) ---

// This is separated for clarity. It's the visual part of the ripple.
const RippleOverlay = ({ ripples, color, duration }: {
  ripples: RippleState[];
  color: string;
  duration: number;
}) => (
  <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none">
    {ripples.map(ripple => (
      <span
        key={ripple.key}
        className="absolute rounded-full animate-js-ripple-effect"
        style={{
          left: ripple.x,
          top: ripple.y,
          width: ripple.size,
          height: ripple.size,
          backgroundColor: color,
          '--ripple-duration': `${duration}ms`,
        } as CSSProperties}
      />
    ))}
  </div>
);


// --- THE MAIN, HYBRID RIPPLE COMPONENT ---

export const RippleEffect: React.FC<RippleEffectProps> = ({
  children,
  rippleColor: userProvidedRippleColor,
  rippleDuration = 600,
  disabled = false,
  className: wrapperClassName, // Renamed to avoid conflict with child's className
  ...props
}) => {
  const [ripples, setRipples] = useState<RippleState[]>([]);

  // --- SHARED LOGIC ---

  const rippleStyles = useMemo(() => `
    @keyframes js-ripple-animation {
      0% { transform: scale(0); opacity: 0.3; }
      100% { transform: scale(1); opacity: 0; }
    }
    .animate-js-ripple-effect { 
      animation: js-ripple-animation var(--ripple-duration, 600ms) ease-out forwards; 
    }
    :root { --ripple-color: oklch(0.145 0 0 / 0.3); }
    .dark { --ripple-color: oklch(0.985 0 0 / 0.4); }
  `, []);

  const determinedRippleColor = useMemo(() => {
    return userProvidedRippleColor || 'var(--ripple-color)';
  }, [userProvidedRippleColor]);

  const createRipple = (event: MouseEvent<HTMLElement>) => {
    if (disabled) return;

    const container = event.currentTarget;
    const rect = container.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2;
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    const newRipple: RippleState = { key: Date.now(), x, y, size };
    setRipples(prev => [...prev, newRipple]);
    setTimeout(() => {
      setRipples(current => current.filter(r => r.key !== newRipple.key));
    }, rippleDuration);
  };

  // --- CONDITIONAL RENDERING LOGIC ---

  if (!isValidElement(children)) {
    return <>{children}</>;
  }
  
  const child = children as React.ReactElement<any>;
  const isVoid = typeof child.type === 'string' && VOID_ELEMENTS.has(child.type);

  // --- STRATEGY 1: SMART WRAPPER (for void elements like <img>, <input>) ---
  if (isVoid) {
    return (
      <div
        onClick={createRipple}
        // The wrapper inherits the child's className to match its border-radius
        className={`relative inline-block overflow-hidden cursor-pointer isolate ${child.props.className || ''} ${wrapperClassName || ''}`}
        {...props}
      >
        <style>{rippleStyles}</style>
        {/* Render the original, unmodified child */}
        {child}
        {/* The ripple overlay is a sibling, visually on top */}
        <RippleOverlay ripples={ripples} color={determinedRippleColor} duration={rippleDuration} />
      </div>
    );
  }

  // --- STRATEGY 2: CLONE ELEMENT (for regular elements like <button>, <div>) ---
  return (
    <>
      <style>{rippleStyles}</style>
      {cloneElement(child, {
        ...props,
        className: `relative overflow-hidden isolate ${child.props.className || ''} ${wrapperClassName || ''}`.trim(),
        onClick: (event: MouseEvent<HTMLElement>) => {
          createRipple(event);
          if (child.props.onClick) {
            child.props.onClick(event);
          }
        },
        children: (
          <>
            {child.props.children}
            {/* The overlay is injected as a child, ensuring it's clipped by the parent's border */}
            <RippleOverlay ripples={ripples} color={determinedRippleColor} duration={rippleDuration} />
          </>
        ),
      })}
    </>
  );
};