"use client";
import { useState } from "react";

interface HoverImageGalleryProps {
  images: string[];
}

export function HoverImageGallery({
  images = [
    "https://images.masterworksfineart.com/product/marilyn-monroe-marilyn-1967-copy/andy-warhol-screenprint-marilyn-30-for-sale-not-ours-550x547.jpg",
    "https://images.masterworksfineart.com/product/marilyn-monroe-marilyn-1967-fs30/warholmarilynfs30-548x550.jpg",
    "https://images.masterworksfineart.com/product/marilyn-monroe-marilyn-1967-8/andy-warhol-screenprint-marilyn-monroe-for-sale-use-548x550.jpg",
    "https://images.masterworksfineart.com/product/marilyn-monroe-marilyn-1967-3/warhol-screenprint-marilyn-monroe-marilyn-1967-for-sale-543x550.jpg",
    "https://images.masterworksfineart.com/warhol-screenprint-marilyn-monroe-marilyn-1967-for-sale-3-550x550.jpg",
    "https://images.masterworksfineart.com/product/marilyn-monroe-marilyn-1967-5/andy-warhol-screenprint-warhol-marilyn-monroe-for-sale-550x550.jpeg",
    "https://images.masterworksfineart.com/product/marilyn-monroe-marilyn-1967-4/warhol-screenprint-marilyn-monroe-marilyn-1967-for-sale-550x550.jpg",
    "https://images.masterworksfineart.com/product/marilyn-monroe-marilyn-1967-10/marilyn-28-550x527.jpg",
    "https://images.masterworksfineart.com/product/marilyn-monroe-marilyn-1967-9/warhol-screenprint-marilyn-monroe-marilyn-1967-fs-22-for-sale-550x550.jpg",
    "https://images.masterworksfineart.com/product/marilyn-monroe-marilyn-1967-1-2/andy-warhol-screenprint-marilyn-monroe-marilyn-1967-for-sale-2-547x550.jpg",
    "https://images.masterworksfineart.com/product/marilyn-monroe-marilyn-1967-12/warholmary1-1-547x550.jpg"
  ],
}: HoverImageGalleryProps){
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const width = rect.width;

    // Update mouse position for tooltip
    setMousePosition({ x, y });

    // Calculate which image to show based on horizontal position
    const imageIndex = Math.floor((x / width) * images.length);
    const clampedIndex = Math.max(0, Math.min(images.length - 1, imageIndex));

    setCurrentImageIndex(clampedIndex);
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  return (
    <div className="relative group">
      <div
        className="relative w-[550px] h-[550px] overflow-hidden rounded-lg shadow-lg cursor-none"
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Main displayed image */}
        <img
          src={images[currentImageIndex]}
          alt={`Gallery image ${currentImageIndex + 1}`}
          className="w-full h-full object-cover transition-all duration-150 ease-out"
        />

        {/* Glassmorphic Tooltip with Both Chevrons */}
        {isHovering && (
          <div
            className="absolute pointer-events-none z-20 transform -translate-x-1/2 -translate-y-1/2"
            style={{
              left: mousePosition.x,
              top: mousePosition.y,
            }}
          >
            <div className="bg-white/20 backdrop-blur-md rounded-full p-2 shadow-lg border border-white/30 w-12 h-12 flex items-center justify-center">
              <div className="flex items-center space-x-1">
                {/* Left Chevron */}
                <svg
                  className="w-3 h-3 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>

                {/* Right Chevron */}
                <svg
                  className="w-3 h-3 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};