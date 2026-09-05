import React, {
  useCallback,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import { cn } from "../_utils/cn";

// --- 1. PHYSICS CONSTANTS ---
// We keep the logic from the button, but make DURATION dynamic
const MINIMUM_PRESS_MS = 300;
const INITIAL_ORIGIN_SCALE = 0.2;
const PADDING = 10;
const SOFT_EDGE_MINIMUM_SIZE = 75;
const SOFT_EDGE_CONTAINER_RATIO = 0.35;
const ANIMATION_FILL = "forwards";
const TOUCH_DELAY_MS = 150;
const EASING_STANDARD = "cubic-bezier(0.2, 0, 0, 1)";

// --- 2. TYPES ---
enum RippleState {
  INACTIVE,
  TOUCH_DELAY,
  HOLDING,
  WAITING_FOR_CLICK,
}

interface RippleProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Tailwind text color class for the ripple (e.g., "text-white", "text-blue-500").
   * Defaults to "text-current" (inherits parent text color).
   */
  color?: string;
  /**
   * Base opacity when fully pressed. Default: 0.12
   */
  opacity?: number;
  disabled?: boolean;
}

// --- 3. THE LOGIC (Converted to be self-contained) ---
const Ripple = forwardRef<HTMLDivElement, RippleProps>(
  (
    {
      className,
      children,
      color = "text-current",
      opacity = 0.12,
      disabled = false,
      style,
      ...props
    },
    ref
  ) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const rippleRef = useRef<HTMLDivElement>(null);
    
    // Internal State
    const stateRef = useRef(RippleState.INACTIVE);
    const rippleStartEventRef = useRef<React.PointerEvent | null>(null);
    const growAnimationRef = useRef<Animation | null>(null);
    
    // Visual State (for opacity transitions)
    const [isPressed, setIsPressed] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    // Determines if we are wrapping content or sitting inside it
    const isWrapper = React.Children.count(children) > 0;

    // --- GEOMETRY & ANIMATION ---
    const determineRippleSize = () => {
      if (!containerRef.current) return { size: "0px", scale: 1, duration: 450 };
      
      const { height, width } = containerRef.current.getBoundingClientRect();
      const maxDim = Math.max(height, width);
      const softEdgeSize = Math.max(
        SOFT_EDGE_CONTAINER_RATIO * maxDim,
        SOFT_EDGE_MINIMUM_SIZE
      );

      const initialSize = Math.floor(maxDim * INITIAL_ORIGIN_SCALE);
      const hypotenuse = Math.sqrt(width ** 2 + height ** 2);
      const maxRadius = hypotenuse + PADDING;

      // DYNAMIC SPEED CALCULATION
      // Standard button (~200px) gets ~450ms. Large cards get slower.
      // We clamp it between 400ms (fastest) and 1000ms (slowest)
      const dynamicDuration = Math.min(Math.max(400, hypotenuse * 1.5), 1000);

      const rippleScale = (maxRadius + softEdgeSize) / initialSize;

      return {
        size: `${initialSize}px`,
        scale: rippleScale,
        duration: dynamicDuration
      };
    };

    const getTranslationCoordinates = (event?: React.PointerEvent) => {
      if (!containerRef.current) return { start: { x: 0, y: 0 }, end: { x: 0, y: 0 } };
      const { height, width, left, top } = containerRef.current.getBoundingClientRect();
      
      // We need the initial size again for centering
      const maxDim = Math.max(height, width);
      const initialSize = Math.floor(maxDim * INITIAL_ORIGIN_SCALE);

      const endPoint = {
        x: (width - initialSize) / 2,
        y: (height - initialSize) / 2,
      };

      let startPoint;
      if (event) {
        startPoint = {
          x: event.clientX - left,
          y: event.clientY - top,
        };
      } else {
        startPoint = {
          x: width / 2,
          y: height / 2,
        };
      }

      startPoint = {
        x: startPoint.x - initialSize / 2,
        y: startPoint.y - initialSize / 2,
      };

      return { startPoint, endPoint };
    };

    const startPressAnimation = (event?: React.PointerEvent) => {
      setIsPressed(true);
      if (!rippleRef.current) return;

      growAnimationRef.current?.cancel();
      
      const { size, scale, duration } = determineRippleSize();
      const { startPoint, endPoint } = getTranslationCoordinates(event);

      // Apply initial size immediately
      rippleRef.current.style.width = size;
      rippleRef.current.style.height = size;

      growAnimationRef.current = rippleRef.current.animate(
        {
          top: [0, 0],
          left: [0, 0],
          transform: [
            `translate(${startPoint.x}px, ${startPoint.y}px) scale(1)`,
            `translate(${endPoint.x}px, ${endPoint.y}px) scale(${scale})`,
          ],
        },
        {
          duration: duration, // DYNAMIC DURATION
          easing: EASING_STANDARD,
          fill: ANIMATION_FILL,
        }
      );
    };

    const endPressAnimation = async () => {
      rippleStartEventRef.current = null;
      stateRef.current = RippleState.INACTIVE;
      
      const animation = growAnimationRef.current;
      let pressAnimationPlayState = Infinity;
      
      if (animation && typeof animation.currentTime === 'number') {
          pressAnimationPlayState = animation.currentTime;
      }

      if (pressAnimationPlayState < MINIMUM_PRESS_MS) {
        await new Promise((resolve) => {
          setTimeout(resolve, MINIMUM_PRESS_MS - pressAnimationPlayState);
        });
      }

      if (growAnimationRef.current !== animation) {
        return;
      }

      setIsPressed(false);
    };

    // --- EVENT HANDLERS ---
    const isTouch = (event: React.PointerEvent) => event.pointerType === "touch";

    const shouldReactToEvent = (event: React.PointerEvent) => {
      if (disabled || !event.isPrimary) return false;
      if (rippleStartEventRef.current && rippleStartEventRef.current.pointerId !== event.pointerId) {
        return false;
      }
      if (event.type === "pointerenter" || event.type === "pointerleave") {
        return !isTouch(event);
      }
      const isPrimaryButton = event.buttons === 1;
      return isTouch(event) || isPrimaryButton;
    };

    const handlePointerDown = async (event: React.PointerEvent<HTMLDivElement>) => {
      if (!shouldReactToEvent(event)) return;
      rippleStartEventRef.current = event;

      if (!isTouch(event)) {
        stateRef.current = RippleState.WAITING_FOR_CLICK;
        startPressAnimation(event);
        return;
      }

      stateRef.current = RippleState.TOUCH_DELAY;
      await new Promise((resolve) => setTimeout(resolve, TOUCH_DELAY_MS));

      if (stateRef.current !== RippleState.TOUCH_DELAY) {
        return;
      }

      stateRef.current = RippleState.HOLDING;
      startPressAnimation(event);
    };

    const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
      if (!shouldReactToEvent(event)) return;
      if (stateRef.current === RippleState.HOLDING) {
        stateRef.current = RippleState.WAITING_FOR_CLICK;
        return;
      }
      if (stateRef.current === RippleState.TOUCH_DELAY) {
        stateRef.current = RippleState.WAITING_FOR_CLICK;
        startPressAnimation(rippleStartEventRef.current || undefined);
        return;
      }
    };

    const handlePointerLeave = (event: React.PointerEvent<HTMLDivElement>) => {
      if (!shouldReactToEvent(event)) return;
      setIsHovered(false);
      if (stateRef.current !== RippleState.INACTIVE) {
          endPressAnimation();
      }
    };

    const handlePointerEnter = (event: React.PointerEvent<HTMLDivElement>) => {
        if (!shouldReactToEvent(event)) return;
        setIsHovered(true);
    }

    const handleClick = () => {
      if (disabled) return;
      if (stateRef.current === RippleState.WAITING_FOR_CLICK) {
          endPressAnimation();
          return;
      }
      if (stateRef.current === RippleState.INACTIVE) {
          startPressAnimation();
          endPressAnimation();
      }
    };

    // Forward ref to container
    useImperativeHandle(ref, () => containerRef.current as HTMLDivElement);

    return (
      <div
        ref={containerRef}
        className={cn(
          // 1. Layout Mode: Relative (Wrapper) or Absolute (Overlay)
          isWrapper ? "relative" : "absolute inset-0",
          // 2. Base Styles
          "overflow-hidden isolate z-0 rounded-[inherit]",
          color, // Apply text color for currentcolor inheritance
          className
        )}
        style={style}
        // Event Binding
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        onClick={handleClick}
        {...props}
      >
        {/* Child Content (if any) */}
        {children && (
            <div className="relative z-10 pointer-events-none">
                {children}
            </div>
        )}

        {/* --- RIPPLE LAYERS --- */}
        <div className="absolute inset-0 z-0 pointer-events-none" aria-hidden="true">
            {/* 1. State Layer (Hover) */}
            <div 
                className={cn(
                    "absolute inset-0 bg-current transition-opacity duration-200 ease-linear",
                    isHovered ? "opacity-[0.08]" : "opacity-0"
                )} 
            />
            
            {/* 2. Ripple Effect (Press) */}
            <div 
                ref={rippleRef}
                className="absolute rounded-full opacity-0 bg-current"
                style={{
                    // Exact Gradient from Material Button
                    background: "radial-gradient(closest-side, currentColor max(calc(100% - 70px), 65%), transparent 100%)",
                    transition: "opacity 375ms linear",
                    opacity: isPressed ? opacity : "0",
                    transitionDuration: isPressed ? "105ms" : "375ms"
                }}
            />
        </div>
      </div>
    );
  }
);

Ripple.displayName = "Ripple";

export { Ripple };