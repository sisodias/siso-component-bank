import { useEffect, useState, useRef } from "react";
import { motion, PanInfo, useMotionValue, useTransform } from "framer-motion";

import {
  FiCircle,
  FiCode,
  FiFileText,
  FiLayers,
  FiLayout,
} from "react-icons/fi";

// Interfaces
export interface CarouselItem {
  title: string;
  description: string;
  id: number;
  icon: JSX.Element;
}

export interface CarouselProps {
  items?: CarouselItem[];
  baseWidth?: number;
  autoplay?: boolean;
  autoplayDelay?: number;
  pauseOnHover?: boolean;
  loop?: boolean;
  round?: boolean;
}

// Constants and Default Items
const DEFAULT_ITEMS: CarouselItem[] = [
  {
    title: "Text Animations",
    description: "Cool text animations for your projects.",
    id: 1,
    icon: <FiFileText className="h-[16px] w-[16px] text-white" />,
  },
  {
    title: "Animations",
    description: "Smooth animations for your projects.",
    id: 2,
    icon: <FiCircle className="h-[16px] w-[16px] text-white" />,
  },
  {
    title: "Components",
    description: "Reusable components for your projects.",
    id: 3,
    icon: <FiLayers className="h-[16px] w-[16px] text-white" />,
  },
  {
    title: "Backgrounds",
    description: "Beautiful backgrounds and patterns for your projects.",
    id: 4,
    icon: <FiLayout className="h-[16px] w-[16px] text-white" />,
  },
  {
    title: "Common UI",
    description: "Common UI components are coming soon!",
    id: 5,
    icon: <FiCode className="h-[16px] w-[16px] text-white" />,
  },
];

const DRAG_BUFFER = 0;
const VELOCITY_THRESHOLD = 500;
const GAP = 16;
const SPRING_OPTIONS = { type: "spring", stiffness: 300, damping: 30 };

// Component definition
export const Component = ({ // Changed from export default function Carousel
  items = DEFAULT_ITEMS,
  baseWidth = 300,
  autoplay = false,
  autoplayDelay = 3000,
  pauseOnHover = false,
  loop = false,
  round = false,
}: CarouselProps): JSX.Element => {
  const containerPadding = 16;
  const itemWidth = baseWidth - containerPadding * 2;
  const trackItemOffset = itemWidth + GAP;

  // If loop is true, a clone of the first item is added to the end for seamless transition.
  const carouselItems = loop ? [...items, items[0]] : items;
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const x = useMotionValue(0);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isResetting, setIsResetting] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (pauseOnHover && containerRef.current) {
      const container = containerRef.current;
      const handleMouseEnter = () => setIsHovered(true);
      const handleMouseLeave = () => setIsHovered(false);
      container.addEventListener("mouseenter", handleMouseEnter);
      container.addEventListener("mouseleave", handleMouseLeave);
      return () => {
        container.removeEventListener("mouseenter", handleMouseEnter);
        container.removeEventListener("mouseleave", handleMouseLeave);
      };
    }
  }, [pauseOnHover]);

  useEffect(() => {
    if (autoplay && (!pauseOnHover || !isHovered)) {
      const timer = setInterval(() => {
        setCurrentIndex((prev) => {
          // If at the last original item and looping, go to the clone.
          if (prev === items.length - 1 && loop) {
            return prev + 1;
          }
          // If at the last item (or clone if looping), loop back to start or stay.
          if (prev === carouselItems.length - 1) {
            return loop ? 0 : prev;
          }
          return prev + 1;
        });
      }, autoplayDelay);
      return () => clearInterval(timer);
    }
  }, [
    autoplay,
    autoplayDelay,
    isHovered,
    loop,
    items.length,
    carouselItems.length,
    pauseOnHover,
  ]);

  const effectiveTransition = isResetting ? { duration: 0 } : SPRING_OPTIONS;

  // Handles the instant jump when the animation completes on the cloned item.
  const handleAnimationComplete = () => {
    if (loop && currentIndex === carouselItems.length - 1) { // If animated to the clone (which is at `items.length` index)
      setIsResetting(true); // Disable transition for the jump
      x.set(0); // Immediately set x position back to the first item
      setCurrentIndex(0); // Immediately set index back to the first item
      setTimeout(() => setIsResetting(false), 50); // Re-enable transitions after a brief moment
    }
  };

  const handleDragEnd = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ): void => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;

    if (offset < -DRAG_BUFFER || velocity < -VELOCITY_THRESHOLD) { // Drag left (swipe to next item)
      if (loop && currentIndex === items.length - 1) { // If currently on the last original item, go to the clone
        setCurrentIndex(currentIndex + 1);
      } else {
        setCurrentIndex((prev) => Math.min(prev + 1, carouselItems.length - 1)); // Move to next, but not past the last
      }
    } else if (offset > DRAG_BUFFER || velocity > VELOCITY_THRESHOLD) { // Drag right (swipe to previous item)
      if (loop && currentIndex === 0) { // If currently on the first item, loop to the last original item
        // Note: This animation will appear to go "backwards" through all items to reach the last.
        // For a perfectly seamless loop, a two-clone setup and more complex x.set jumps are needed.
        setCurrentIndex(items.length - 1);
      } else {
        setCurrentIndex((prev) => Math.max(prev - 1, 0)); // Move to previous, but not before the first
      }
    }
  };

  // Drag properties for framer-motion. Constraints are applied only when not looping.
  const dragProps = loop
    ? {} // No specific dragConstraints when looping, relying on state updates and onAnimationComplete for boundary handling
    : {
        dragConstraints: {
          left: -trackItemOffset * (carouselItems.length - 1),
          right: 0,
        },
      };

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden p-4 ${
        round
          ? "rounded-full border border-white"
          : "rounded-[24px] border border-[#222]"
      }`}
      style={{
        width: `${baseWidth}px`,
        ...(round && { height: `${baseWidth}px` }),
      }}
    >
      <motion.div
        className="flex"
        drag="x"
        {...dragProps}
        style={{
          width: itemWidth,
          gap: `${GAP}px`,
          perspective: 1000,
          // Correct perspective origin calculation relative to current item
          perspectiveOrigin: `${currentIndex * trackItemOffset + itemWidth / 2}px 50%`,
          x, // Bind x to the useMotionValue
        }}
        onDragEnd={handleDragEnd}
        animate={{ x: -(currentIndex * trackItemOffset) }} // Animate x to the current item's position
        transition={effectiveTransition}
        onAnimationComplete={handleAnimationComplete} // Callback when animation finishes
      >
        {carouselItems.map((item, index) => {
          // Define the range for x values corresponding to the current item's position, and its neighbors
          const range = [
            -(index + 1) * trackItemOffset, // When the item to the right is centered
            -index * trackItemOffset,      // When this item is centered
            -(index - 1) * trackItemOffset, // When the item to the left is centered
          ];
          // Define the output range for rotateY. Item in center is 0deg, items to side are +/-90deg
          const outputRange = [90, 0, -90];
          const rotateY = useTransform(x, range, outputRange, { clamp: false });
          return (
            <motion.div
              key={index} // Using index as key is fine here because the `carouselItems` array structure is stable and indices are unique.
              className={`relative shrink-0 flex flex-col ${
                round
                  ? "items-center justify-center text-center bg-[#060606] border-0"
                  : "items-start justify-between bg-[#222] border border-[#222] rounded-[12px]"
              } overflow-hidden cursor-grab active:cursor-grabbing`}
              style={{
                width: itemWidth,
                height: round ? itemWidth : "100%",
                rotateY: rotateY,
                ...(round && { borderRadius: "50%" }),
              }}
              transition={effectiveTransition}
            >
              <div className={`${round ? "p-0 m-0" : "mb-4 p-5"}`}>
                <span className="flex h-[28px] w-[28px] items-center justify-center rounded-full bg-[#060606]">
                  {item.icon}
                </span>
              </div>
              <div className="p-5">
                <div className="mb-1 font-black text-lg text-white">
                  {item.title}
                </div>
                <p className="text-sm text-white">{item.description}</p>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
      <div
        className={`flex w-full justify-center ${
          round ? "absolute z-20 bottom-12 left-1/2 -translate-x-1/2" : ""
        }`}
      >
        <div className="mt-4 flex w-[150px] justify-between px-8">
          {/* Render dots for the original number of items, mapping current index to original item index */}
          {items.map((_, index) => (
            <motion.div
              key={index}
              className={`h-2 w-2 rounded-full cursor-pointer transition-colors duration-150 ${
                currentIndex % items.length === index // Use modulo for looping dot highlight
                  ? round
                    ? "bg-white"
                    : "bg-[#333333]"
                  : round
                    ? "bg-[#555]"
                    : "bg-[rgba(51,51,51,0.4)]"
              }`}
              animate={{
                scale: currentIndex % items.length === index ? 1.2 : 1,
              }}
              onClick={() => setCurrentIndex(index)} // Set current index to the clicked dot's item
              transition={{ duration: 0.15 }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};