import React, { useState, useEffect, useRef, ReactNode, HTMLAttributes } from "react";

interface MagnetProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  padding?: number;
  disabled?: boolean;
  magnetStrength?: number;
  activeTransition?: string;
  inactiveTransition?: string;
  wrapperClassName?: string;
  innerClassName?: string;
}

export const Magnet: React.FC<MagnetProps> = ({
  children,
  padding = 100,
  disabled = false,
  magnetStrength = 2, // A higher number means less movement (more resistance)
  activeTransition = "transform 0.1s ease-out", // Quicker when active
  inactiveTransition = "transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)", // Smoother return
  wrapperClassName = "",
  innerClassName = "",
  ...props
}) => {
  const [isActive, setIsActive] = useState<boolean>(false);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const magnetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (disabled) {
      setPosition({ x: 0, y: 0 });
      setIsActive(false); // Ensure isActive is also reset
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!magnetRef.current) return;

      const { left, top, width, height } = magnetRef.current.getBoundingClientRect();
      const centerX = left + width / 2;
      const centerY = top + height / 2;

      // Calculate distance from mouse to center of the element
      const mouseX = e.clientX;
      const mouseY = e.clientY;
      
      // Check if mouse is within the padded area
      if (
        mouseX >= left - padding &&
        mouseX <= left + width + padding &&
        mouseY >= top - padding &&
        mouseY <= top + height + padding
      ) {
        if (!isActive) setIsActive(true);
        // magnetStrength: higher value means less movement. We want to divide by it.
        // The movement should be a fraction of the distance from center.
        const offsetX = (mouseX - centerX) / magnetStrength;
        const offsetY = (mouseY - centerY) / magnetStrength;
        setPosition({ x: offsetX, y: offsetY });
      } else {
        if (isActive) setIsActive(false);
        setPosition({ x: 0, y: 0 });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [padding, disabled, magnetStrength, isActive]); // Added isActive to dependencies

  const transitionStyle = isActive ? activeTransition : inactiveTransition;

  return (
    <div
      ref={magnetRef}
      className={wrapperClassName} // User can pass Tailwind classes here
      style={{ 
        position: "relative", 
        display: "inline-block", // So it takes the size of its content
        cursor: disabled ? 'default' : 'grab' 
      }}
      {...props}
    >
      <div
        className={innerClassName} // User can pass Tailwind classes here
        style={{
          transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
          transition: transitionStyle,
          willChange: "transform", // Hint for browser optimization
          display: "inline-block", // Ensure inner div also sizes to content
        }}
      >
        {children}
      </div>
    </div>
  );
};