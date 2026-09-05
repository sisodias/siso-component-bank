import React, { useRef, useEffect, useState, CSSProperties } from "react";
import { gsap } from "gsap";

interface PixelTransitionProps {
  firstContent: React.ReactNode;
  secondContent: React.ReactNode;
  gridSize?: number;
  pixelColor?: string;
  animationStepDuration?: number;
  className?: string;
  style?: CSSProperties;
  aspectRatio?: string;
}

export const PixelTransition: React.FC<PixelTransitionProps> = ({
  firstContent,
  secondContent,
  gridSize = 7,
  pixelColor = "currentColor", // Default will be white for dark theme, black for light
  animationStepDuration = 0.3,
  className = "",
  style = {},
  aspectRatio = "100%", // This creates a square by default if width is set
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const pixelGridRef = useRef<HTMLDivElement | null>(null);
  const activeRef = useRef<HTMLDivElement | null>(null);
  const delayedCallRef = useRef<gsap.core.Tween | null>(null);

  const [isActive, setIsActive] = useState<boolean>(false);
  const [isComponentTouchDevice, setIsComponentTouchDevice] = useState<boolean>(false);

  useEffect(() => {
    // Check for touch device on client-side only
    setIsComponentTouchDevice(
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0 ||
        (window.matchMedia && window.matchMedia("(pointer: coarse)").matches)
    );
  }, []);


  useEffect(() => {
    const pixelGridEl = pixelGridRef.current;
    if (!pixelGridEl) return;

    pixelGridEl.innerHTML = ""; // Clear previous pixels

    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        const pixel = document.createElement("div");
        pixel.classList.add("pixelated-image-card__pixel");
        pixel.classList.add("absolute", "hidden"); // 'hidden' by GSAP initially
        
        // Pixel color is determined by CSS `currentColor` or the prop
        pixel.style.backgroundColor = pixelColor === "currentColor" ? "currentColor" : pixelColor;


        const size = 100 / gridSize;
        pixel.style.width = `${size}%`;
        pixel.style.height = `${size}%`;
        pixel.style.left = `${col * size}%`;
        pixel.style.top = `${row * size}%`;

        pixelGridEl.appendChild(pixel);
      }
    }
  }, [gridSize, pixelColor]);

  const animatePixels = (activate: boolean): void => {
    setIsActive(activate); // Update internal state for UI logic

    const pixelGridEl = pixelGridRef.current;
    const activeEl = activeRef.current;
    if (!pixelGridEl || !activeEl) return;

    const pixels = Array.from(pixelGridEl.querySelectorAll<HTMLDivElement>(
      ".pixelated-image-card__pixel"
    ));
    if (!pixels.length) return;

    gsap.killTweensOf(pixels);
    if (delayedCallRef.current) {
      delayedCallRef.current.kill();
    }

    gsap.set(pixels, { display: "none" }); // Ensure all are hidden before starting

    const totalPixels = pixels.length;
    const staggerDuration = animationStepDuration / totalPixels;

    // Animate pixels to appear
    gsap.to(pixels, {
      display: "block",
      duration: 0.001, // Very short duration, effectively instant per pixel
      stagger: {
        each: staggerDuration,
        from: "random",
      },
    });

    // After pixels appear, reveal the second content
    delayedCallRef.current = gsap.delayedCall(animationStepDuration, () => {
      activeEl.style.display = activate ? "block" : "none";
      // activeEl.style.pointerEvents = activate ? "none" : ""; // Not needed if overlay covers all
    });

    // Animate pixels to disappear after revealing second content
    gsap.to(pixels, {
      display: "none",
      duration: 0.001,
      delay: animationStepDuration, // Start hiding after second content is revealed
      stagger: {
        each: staggerDuration,
        from: "random",
      },
    });
  };

  const handleMouseEnter = (): void => {
    if (!isActive) animatePixels(true);
  };
  const handleMouseLeave = (): void => {
    if (isActive) animatePixels(false);
  };
  const handleClick = (): void => {
    animatePixels(!isActive);
  };

  // Base styles for the container, common to both themes
  const baseContainerClasses = `
    ${className}
    rounded-[15px]
    w-[300px] 
    max-w-full
    relative
    overflow-hidden
    cursor-pointer
  `;
  
  // Theme-specific styles
  const lightThemeClasses = `
    bg-neutral-200 
    text-black 
    border-2 
    border-black
  `;
  const darkThemeClasses = `
    bg-neutral-800 
    text-white 
    border-2 
    border-white
  `;


  return (
    <div
      ref={containerRef}
      className={`${baseContainerClasses} ${lightThemeClasses} dark:${darkThemeClasses}`}
      style={style}
      onMouseEnter={!isComponentTouchDevice ? handleMouseEnter : undefined}
      onMouseLeave={!isComponentTouchDevice ? handleMouseLeave : undefined}
      onClick={isComponentTouchDevice ? handleClick : undefined}
    >
      <div style={{ paddingTop: aspectRatio }} /> {/* For aspect ratio */}

      <div className="absolute inset-0 w-full h-full">{firstContent}</div>

      <div
        ref={activeRef}
        className="absolute inset-0 w-full h-full z-[2]" // z-index to be above firstContent
        style={{ display: "none" }} // Initially hidden
      >
        {secondContent}
      </div>

      <div
        ref={pixelGridRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-[3]" // z-index for pixel overlay
      />
    </div>
  );
};