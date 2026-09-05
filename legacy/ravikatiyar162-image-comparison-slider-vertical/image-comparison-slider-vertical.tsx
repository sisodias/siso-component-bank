// image-comparison-slider/code.tsx

import * as React from "react";
import { cn } from "../_utils/cn"; // Assuming a 'utils' file for merging Tailwind classes, common in shadcn.
import { GripVertical } from "lucide-react";

// Define the props for the component
interface ImageComparisonSliderProps extends React.HTMLAttributes<HTMLDivElement> {
  topImage: string;
  bottomImage: string;
  altTop?: string;
  altBottom?: string;
  initialPosition?: number;
  handleIcon?: React.ReactNode;
}

export const ImageComparisonSlider = React.forwardRef<
  HTMLDivElement,
  ImageComparisonSliderProps
>(
  (
    {
      className,
      topImage,
      bottomImage,
      altTop = "Top image",
      altBottom = "Bottom image",
      initialPosition = 50,
      handleIcon,
      ...props
    },
    ref
  ) => {
    // State to manage slider position (0 to 100)
    const [sliderPosition, setSliderPosition] = React.useState(initialPosition);
    // State to track if the user is currently dragging the handle
    const [isDragging, setIsDragging] = React.useState(false);
    // Ref for the container element to calculate relative cursor position
    const containerRef = React.useRef<HTMLDivElement>(null);

    // Function to handle slider movement
    const handleMove = (clientY: number) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      // Calculate position as a percentage of the container's height
      const y = clientY - rect.top;
      let newPosition = (y / rect.height) * 100;

      // Clamp the position between 0 and 100
      if (newPosition < 0) newPosition = 0;
      if (newPosition > 100) newPosition = 100;

      setSliderPosition(newPosition);
    };

    // Mouse move handler
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      handleMove(e.clientY);
    };

    // Touch move handler
    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging) return;
      handleMove(e.touches[0].clientY);
    };

    // Handlers to stop dragging
    const handleMouseUp = () => setIsDragging(false);
    const handleTouchEnd = () => setIsDragging(false);

    // Effect to add and remove global event listeners for dragging
    React.useEffect(() => {
      if (isDragging) {
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("touchmove", handleTouchMove);
        window.addEventListener("mouseup", handleMouseUp);
        window.addEventListener("touchend", handleTouchEnd);
      }

      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("touchmove", handleTouchMove);
        window.removeEventListener("mouseup", handleMouseUp);
        window.removeEventListener("touchend", handleTouchEnd);
      };
    }, [isDragging, handleMouseMove, handleTouchMove, handleMouseUp, handleTouchEnd]);

    return (
      <div
        ref={containerRef}
        className={cn(
          "relative w-full h-full overflow-hidden select-none group",
          className
        )}
        {...props}
      >
        {/* Bottom Image */}
        <img
          src={bottomImage}
          alt={altBottom}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          draggable={false}
        />
        {/* Top Image (clipped) */}
        <div
          className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none"
          style={{ clipPath: `inset(0 0 ${100 - sliderPosition}% 0)` }}
        >
          <img
            src={topImage}
            alt={altTop}
            className="w-full h-full object-cover"
            draggable={false}
          />
        </div>

        {/* Slider Handle */}
        <div
          className="absolute left-0 w-full h-px -translate-y-1/2 bg-border cursor-ns-resize"
          style={{ top: `${sliderPosition}%` }}
          onMouseDown={() => setIsDragging(true)}
          onTouchStart={() => setIsDragging(true)}
          role="separator"
          aria-orientation="vertical"
        >
          <button
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-10 w-10 flex items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md transition-transform group-hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            aria-label="Drag to compare images"
            aria-valuenow={sliderPosition}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-controls="image-comparison-container"
          >
            {handleIcon || <GripVertical className="h-5 w-5" />}
          </button>
        </div>
      </div>
    );
  }
);

ImageComparisonSlider.displayName = "ImageComparisonSlider";