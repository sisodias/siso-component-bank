"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Rewind, FastForward } from "lucide-react";

export interface CarouselItem {
  id: number;
  title: string;
}

// Create infinite items by triplicating the array
const createInfiniteItems = (originalItems: CarouselItem[]) => {
  const items = [];
  for (let i = 0; i < 3; i++) {
    originalItems.forEach((item, index) => {
      items.push({
        ...item,
        id: `${i}-${item.id}`,
        originalIndex: index,
      });
    });
  }
  return items;
};

const RulerLines = ({
  top = true,
  totalLines = 100,
}: {
  top?: boolean;
  totalLines?: number;
}) => {
  const lines = [];
  const lineSpacing = 100 / (totalLines - 1);

  for (let i = 0; i < totalLines; i++) {
    const isFifth = i % 5 === 0;
    const isCenter = i === Math.floor(totalLines / 2);

    let height = "h-3";
    let color = "bg-gray-500 dark:bg-gray-400";

    if (isCenter) {
      height = "h-8";
      color = "bg-primary dark:bg-white";
    } else if (isFifth) {
      height = "h-4";
      color = "bg-primary dark:bg-white";
    }

    const positionClass = top ? "" : "bottom-0";

    lines.push(
      <div
        key={i}
        className={`absolute w-0.5 ${height} ${color} ${positionClass}`}
        style={{ left: `${i * lineSpacing}%` }}
      />
    );
  }

  return <div className="relative w-full h-8 px-4">{lines}</div>;
};

export function RulerCarousel({
  originalItems,
}: {
  originalItems: CarouselItem[];
}) {
  const infiniteItems = createInfiniteItems(originalItems);
  const itemsPerSet = originalItems.length;

  // Start with the middle set, item 4 (UNIQLO)
  const [activeIndex, setActiveIndex] = useState(itemsPerSet + 4);
  const [isResetting, setIsResetting] = useState(false);
  const previousIndexRef = useRef(itemsPerSet + 4);

  const handleItemClick = (newIndex: number) => {
    if (isResetting) return;

    // Find the original item index (0-8)
    const targetOriginalIndex = newIndex % itemsPerSet;

    // Find all instances of this item across the 3 copies
    const possibleIndices = [
      targetOriginalIndex, // First copy
      targetOriginalIndex + itemsPerSet, // Second copy
      targetOriginalIndex + itemsPerSet * 2, // Third copy
    ];

    // Find the closest index to current position
    let closestIndex = possibleIndices[0];
    let smallestDistance = Math.abs(possibleIndices[0] - activeIndex);

    for (const index of possibleIndices) {
      const distance = Math.abs(index - activeIndex);
      if (distance < smallestDistance) {
        smallestDistance = distance;
        closestIndex = index;
      }
    }

    previousIndexRef.current = activeIndex;
    setActiveIndex(closestIndex);
  };

  const handlePrevious = () => {
    if (isResetting) return;
    setActiveIndex((prev) => prev - 1);
  };

  const handleNext = () => {
    if (isResetting) return;
    setActiveIndex((prev) => prev + 1);
  };

  // Handle infinite scrolling
  useEffect(() => {
    if (isResetting) return;

    // If we're in the first set, jump to the equivalent position in the middle set
    if (activeIndex < itemsPerSet) {
      setIsResetting(true);
      setTimeout(() => {
        setActiveIndex(activeIndex + itemsPerSet);
        setIsResetting(false);
      }, 0);
    }
    // If we're in the last set, jump to the equivalent position in the middle set
    else if (activeIndex >= itemsPerSet * 2) {
      setIsResetting(true);
      setTimeout(() => {
        setActiveIndex(activeIndex - itemsPerSet);
        setIsResetting(false);
      }, 0);
    }
  }, [activeIndex, itemsPerSet, isResetting]);

  // Add keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isResetting) return;

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        setActiveIndex((prev) => prev - 1);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        setActiveIndex((prev) => prev + 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isResetting]);

  // Calculate target position - center the active item
  const centerPosition = 5; // We want item 5 (index 4) to be centered initially
  const targetX = -500 + (centerPosition - (activeIndex % itemsPerSet)) * 500;

  // Get current page info
  const currentPage = (activeIndex % itemsPerSet) + 1;
  const totalPages = itemsPerSet;

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-background dark:bg-black">
      <div className="w-full h-[200px] flex flex-col justify-center relative">
        <div className="flex items-center justify-center">
          <RulerLines top />
        </div>
        <div className="flex items-center justify-center w-full h-full relative overflow-hidden">
          <motion.div
            className="flex items-center gap-[100px]"
            animate={{
              x: isResetting ? targetX : targetX,
            }}
            transition={
              isResetting
                ? { duration: 0 }
                : {
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                    mass: 1,
                  }
            }
          >
            {infiniteItems.map((item, index) => {
              const isActive = index === activeIndex;

              return (
                <motion.button
                  key={item.id}
                  onClick={() => handleItemClick(index)}
                  className={`text-4xl md:text-6xl font-bold whitespace-nowrap cursor-pointer flex items-center justify-center ${
                    isActive
                      ? "text-primary dark:text-white"
                      : "text-muted-foreground dark:text-gray-500 hover:text-foreground dark:hover:text-gray-400"
                  }`}
                  animate={{
                    scale: isActive ? 1 : 0.75,
                    opacity: isActive ? 1 : 0.4,
                  }}
                  transition={
                    isResetting
                      ? { duration: 0 }
                      : {
                          type: "spring",
                          stiffness: 400,
                          damping: 25,
                        }
                  }
                  style={{
                    width: "400px",
                  }}
                >
                  {item.title}
                </motion.button>
              );
            })}
          </motion.div>
        </div>

        <div className="flex items-center justify-center">
          <RulerLines top={false} />
        </div>
      </div>
      
      <div className="flex items-center justify-center gap-4 mt-10">
        <button
          onClick={handlePrevious}
          disabled={isResetting}
          className="flex items-center justify-center cursor-pointer"
          aria-label="Previous item"
        >
          <Rewind className="w-5 h-5 text-primary/80" />
        </button>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground dark:text-gray-400">
            {currentPage}
          </span>
          <span className="text-sm text-muted-foreground dark:text-gray-500">
            /
          </span>
          <span className="text-sm font-medium text-muted-foreground dark:text-gray-400">
            {totalPages}
          </span>
        </div>

        <button
          onClick={handleNext}
          disabled={isResetting}
          className="flex items-center justify-center cursor-pointer"
          aria-label="Next item"
        >
          <FastForward className="w-5 h-5 text-primary/80" />
        </button>
      </div>
    </div>
  );
}
