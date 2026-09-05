"use client";

import * as React from "react";
import { cn } from "../_utils/cn"; // Assuming a cn utility from shadcn/ui

// Define the props for the component
export interface PhotoStackItem {
  src: string;
  name: string;
}

export interface InteractivePhotoStackProps {
  items: PhotoStackItem[];
  title: React.ReactNode;
  className?: string;
}

// Helper function to generate a random number in a range
const random = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

// Helper function to generate a set of non-overlapping positions
const generateNonOverlappingTransforms = (items: PhotoStackItem[]) => {
  const positions: { x: number; y: number; r: number }[] = [];
  const displayedItems = items.slice(0, 5);

  const cardWidthVW = 25;
  const cardHeightVH = 45;
  const maxRetries = 100;

  displayedItems.forEach(() => {
    let newPos;
    let collision;
    let retries = 0;

    do {
      collision = false;
      const x = random(-45, 45); // vw
      const y = random(-25, 25); // vh
      const r = random(-25, 25); // deg
      newPos = { x, y, r };

      for (const pos of positions) {
        const dx = Math.abs(newPos.x - pos.x);
        const dy = Math.abs(newPos.y - pos.y);
        if (dx < cardWidthVW && dy < cardHeightVH) {
          collision = true;
          break;
        }
      }
      retries++;
    } while (collision && retries < maxRetries);
    
    positions.push(newPos);
  });

  return positions.map(pos => `translate(${pos.x}vw, ${pos.y}vh) rotate(${pos.r}deg)`);
};


const InteractivePhotoStack = React.forwardRef<
  HTMLDivElement,
  InteractivePhotoStackProps
>(({ items, title, className, ...props }, ref) => {
  const [topCardIndex, setTopCardIndex] = React.useState(0);
  const [isGroupHovered, setIsGroupHovered] = React.useState(false);
  const [clickedIndex, setClickedIndex] = React.useState<number | null>(null);
  // State to hold the current set of random positions
  const [spreadTransforms, setSpreadTransforms] = React.useState<string[]>([]);

  const displayedItems = items.slice(0, 5);
  const baseRotations = ["rotate-2", "-rotate-2", "rotate-4", "-rotate-4", "rotate-6"];

  const handleMouseEnter = () => {
    // Generate new random positions every time the mouse enters
    const newTransforms = generateNonOverlappingTransforms(items);
    setSpreadTransforms(newTransforms);
    setIsGroupHovered(true);
  };

  const handleCardClick = (index: number) => {
    if (isGroupHovered) {
      setClickedIndex(index);
      setTimeout(() => {
        setIsGroupHovered(false);
        setTopCardIndex(index);
        setClickedIndex(null);
      }, 700);
    } else {
      setTopCardIndex(index);
    }
  };

  return (
    <div
      ref={ref}
      className={cn(
        "flex flex-col items-center justify-center gap-12",
        className,
      )}
      {...props}
    >
      <div
        className="relative h-96 w-full"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => !clickedIndex && setIsGroupHovered(false)}
      >
        <div className="relative left-1/2 top-1/2 h-80 w-64 -translate-x-1/2 -translate-y-1/2">
          {displayedItems.map((item, index) => {
            const isTopCard = index === topCardIndex;
            const numItems = displayedItems.length;
            let stackPosition = index - topCardIndex;
            if (stackPosition < 0) stackPosition += numItems;
            const isClicked = index === clickedIndex;
            // Use the dynamically generated transforms from state
            const transform = isGroupHovered
              ? spreadTransforms[index]
              : `translateY(${stackPosition * 0.5}rem) scale(${1 - stackPosition * 0.05})`;

            return (
              <div
                key={item.name}
                onClick={() => handleCardClick(index)}
                className={cn(
                  "absolute inset-0 h-80 w-64 cursor-pointer rounded-xl bg-background p-2 shadow-lg transition-all duration-500 ease-in-out",
                  {
                    "rotate-0": isGroupHovered,
                    [baseRotations[stackPosition]]: !isGroupHovered && !isTopCard,
                    "hover:scale-110": isGroupHovered && !isClicked,
                    "animate-spin-y": isClicked,
                  }
                )}
                style={{
                  transform: transform,
                  zIndex: isClicked ? 200 : isGroupHovered ? 100 : isTopCard ? numItems : numItems - stackPosition,
                }}
              >
                <div className="flex h-full w-full flex-col items-center justify-start">
                  <div className="h-64 w-full">
                    <img
                      src={item.src}
                      alt={item.name}
                      className="h-full w-full rounded-md object-cover"
                    />
                  </div>
                  <div className="flex h-12 flex-grow items-center justify-center">
                    <p className="font-serif text-xl italic text-foreground">
                      {item.name}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <h3 className="text-center text-2xl font-bold text-foreground">
        {title}
      </h3>
    </div>
  );
});

InteractivePhotoStack.displayName = "InteractivePhotoStack";

export { InteractivePhotoStack };
