import * as React from "react";
import { cn } from "../_utils/cn"; // Assuming you have a `cn` utility from shadcn

/**
 * Props for the FrostedCard component.
 */
export interface FrostedCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The URL of the background image. */
  imageUrl: string;
  /** The primary, large title text. */
  title: string;
  /** Optional smaller text displayed above the main title. */
  preTitle?: string;
  /** Optional date or short text at the bottom right. */
  date?: string;
  /** Alt text for the background image for accessibility. */
  alt: string;
}

const FrostedCard = React.forwardRef<HTMLDivElement, FrostedCardProps>(
  ({ className, imageUrl, title, preTitle, date, alt, ...props }, ref) => {
    // State to hold the rotation values for the 3D effect
    const [rotate, setRotate] = React.useState({ x: 0, y: 0 });

    // Handle mouse movement over the card to calculate rotation
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const { width, height } = rect;
      
      // Calculate rotation, maxing out at ~15 degrees
      const rotateY = (x / width - 0.5) * 30; 
      const rotateX = -(y / height - 0.5) * 30;

      setRotate({ x: rotateX, y: rotateY });
    };

    // Reset rotation when the mouse leaves the card
    const handleMouseLeave = () => {
      setRotate({ x: 0, y: 0 });
    };

    return (
      <div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ perspective: "1000px" }} // Apply perspective to the parent for 3D effect
        className={cn(
          "group relative w-full h-96 max-w-sm overflow-hidden rounded-xl bg-card shadow-lg",
          className
        )}
        {...props}
      >
        <div
          style={{
            transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) scale(1.05)`,
            transition: "transform 0.1s ease-out",
          }}
          className="absolute inset-0 h-full w-full"
        >
          {/* Background Image */}
          <img
            src={imageUrl}
            alt={alt}
            className="h-full w-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
          />
          
          {/* Overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

          {/* Text Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-card-foreground">
            {preTitle && (
              <p className="mb-1 text-sm text-white/80 transition-transform duration-300 group-hover:-translate-y-1">
                {preTitle}
              </p>
            )}
            <h2 
              className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white/95 to-white/70 transition-transform duration-300 group-hover:-translate-y-1"
              style={{ textShadow: '0px 2px 10px rgba(0,0,0,0.5)' }}
            >
              {title}
            </h2>
          </div>

          {date && (
            <div className="absolute bottom-4 right-4 text-xs text-white/70">
              {date}
            </div>
          )}
        </div>
      </div>
    );
  }
);
FrostedCard.displayName = "FrostedCard";

export { FrostedCard };