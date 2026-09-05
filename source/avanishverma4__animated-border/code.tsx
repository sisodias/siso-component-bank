"use client";
import React, { useRef, useEffect, useState } from "react";

// Utility function for class names
function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

// Moving Border Component
const MovingBorder = ({
  children,
  duration = 3000,
  rx,
  ry,
  ...otherProps
}) => {
  const pathRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [pathLength, setPathLength] = useState(0);

  useEffect(() => {
    if (pathRef.current) {
      const length = pathRef.current.getTotalLength();
      setPathLength(length);
    }
  }, []);

  useEffect(() => {
    let animationId;
    const startTime = Date.now();

    const animate = () => {
      const currentTime = Date.now() - startTime;
      if (pathLength > 0) {
        const pxPerMillisecond = pathLength / duration;
        const newProgress = (currentTime * pxPerMillisecond) % pathLength;
        setProgress(newProgress);
      }
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [duration, pathLength]);

  const getPoint = () => {
    if (pathRef.current && pathLength > 0) {
      return pathRef.current.getPointAtLength(progress);
    }
    return { x: 0, y: 0 };
  };

  const point = getPoint();

  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        className="absolute h-full w-full"
        width="100%"
        height="100%"
        {...otherProps}
      >
        <rect
          fill="none"
          width="100%"
          height="100%"
          rx={rx}
          ry={ry}
          ref={pathRef}
        />
      </svg>
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          display: "inline-block",
          transform: `translateX(${point.x}px) translateY(${point.y}px) translateX(-50%) translateY(-50%)`,
        }}
      >
        {children}
      </div>
    </>
  );
};

// Button Component
const Button = ({
  borderRadius = "1.75rem",
  children,
  as: Component = "button",
  containerClassName,
  borderClassName,
  duration,
  className,
  ...otherProps
}) => {
  return (
    <Component
      className={cn(
        "relative h-16 w-48 overflow-hidden bg-transparent p-[1px] text-xl",
        containerClassName,
      )}
      style={{
        borderRadius: borderRadius,
      }}
      {...otherProps}
    >
      <div
        className="absolute inset-0"
        style={{ borderRadius: `calc(${borderRadius} * 0.96)` }}
      >
        <MovingBorder duration={duration} rx="30%" ry="30%">
          <div
            className={cn(
              "h-20 w-20 bg-gradient-radial from-sky-500 to-transparent opacity-80",
              borderClassName,
            )}
            style={{
              background: "radial-gradient(circle, #0ea5e9 40%, transparent 60%)"
            }}
          />
        </MovingBorder>
      </div>

      <div
        className={cn(
          "relative flex h-full w-full items-center justify-center border border-slate-800 bg-slate-900/80 text-sm text-white backdrop-blur-xl",
          className,
        )}
        style={{
          borderRadius: `calc(${borderRadius} * 0.96)`,
        }}
      >
        {children}
      </div>
    </Component>
  );
};



// Main Demo Component
export default function MovingBorderDemo() {
  return (
    <div className="w-full relative min-h-screen bg-neutral-950 flex items-center justify-center p-8">
      <div className="relative z-10 flex flex-col items-center gap-8">        
        <Button
          borderRadius="2rem"
          className="bg-emerald-600 text-white border-emerald-500"
          borderClassName="bg-gradient-radial from-emerald-400 to-transparent"
          duration={2000}
        >
          Moving Borders
        </Button>
      </div>
    </div>
  );
}