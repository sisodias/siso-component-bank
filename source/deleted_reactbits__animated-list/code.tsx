"use client"; 

import React, {
  useRef,
  useState,
  useEffect,
  ReactNode,
  MouseEventHandler,
  UIEvent,
  FC, 
} from "react";
import { motion, useInView } from "framer-motion";

interface AnimatedItemProps {
  children: ReactNode;
  delay?: number;
  index: number;
  onMouseEnter?: MouseEventHandler<HTMLDivElement>;
  onClick?: MouseEventHandler<HTMLDivElement>;
  className?: string; 
}

const AnimatedItem: FC<AnimatedItemProps> = ({
  children,
  delay = 0,
  index,
  onMouseEnter,
  onClick,
  className = "", 
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.2, once: false }); 
  return (
    <motion.div
      ref={ref}
      data-index={index}
      onMouseEnter={onMouseEnter}
      onClick={onClick}
      initial={{ scale: 0.85, opacity: 0, y: 20 }} 
      animate={inView ? { scale: 1, opacity: 1, y: 0 } : { scale: 0.85, opacity: 0, y: 20 }}
      transition={{ duration: 0.3, delay: delay + index * 0.05, ease: "easeOut" }} 
      className={`mb-3 cursor-pointer ${className}`} 
    >
      {children}
    </motion.div>
  );
};

interface AnimatedListProps {
  items?: string[];
  onItemSelect?: (item: string, index: number) => void;
  showGradients?: boolean;
  enableArrowNavigation?: boolean;
  className?: string; 
  listWrapperClassName?: string; 
  itemWrapperClassName?: string; 
  itemContentClassName?: string; 
  displayScrollbar?: boolean;
  initialSelectedIndex?: number;
  gradientColor?: string; 
  // For scrollbar-color (Firefox), we need actual color values, not Tailwind classes
  scrollbarThumbCssColor?: string; // e.g., '#555555'
  scrollbarTrackCssColor?: string; // e.g., '#222222'
  // For WebKit scrollbars, we still use Tailwind classes for convenience
  scrollbarTrackClassName?: string; // e.g., 'bg-neutral-800'
  scrollbarThumbClassName?: string; // e.g., 'bg-neutral-600'
}

export const AnimatedList: FC<AnimatedListProps> = ({
  items = Array.from({ length: 15 }, (_, i) => `Default Item ${i + 1}`),
  onItemSelect,
  showGradients = true,
  enableArrowNavigation = true,
  className = "", 
  listWrapperClassName = "", 
  itemWrapperClassName = "", 
  itemContentClassName = "", 
  displayScrollbar = true,
  initialSelectedIndex = -1,
  gradientColor = "from-neutral-900 dark:from-black", 
  // Default CSS colors for Firefox scrollbar (theme-dependent)
  scrollbarThumbCssColor, // Will be set in DemoOne based on theme
  scrollbarTrackCssColor, // Will be set in DemoOne based on theme
  // Default Tailwind classes for WebKit scrollbar
  scrollbarTrackClassName = "dark:bg-neutral-800 bg-neutral-200",
  scrollbarThumbClassName = "dark:bg-neutral-600 bg-neutral-400",
}) => {
  const listRef = useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(initialSelectedIndex);
  const [keyboardNav, setKeyboardNav] = useState<boolean>(false);
  const [topGradientOpacity, setTopGradientOpacity] = useState<number>(0);
  const [bottomGradientOpacity, setBottomGradientOpacity] = useState<number>(1);

  const handleScroll = (e: UIEvent<HTMLDivElement>) => {
    if (!listRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = e.target as HTMLDivElement;
    setTopGradientOpacity(Math.min(scrollTop / 40, 1)); 
    const bottomDistance = scrollHeight - (scrollTop + clientHeight);
    setBottomGradientOpacity(
      scrollHeight <= clientHeight ? 0 : Math.min(bottomDistance / 40, 1) 
    );
  };

  useEffect(() => { 
    const timer = setTimeout(() => { 
        if (listRef.current) {
            const { scrollHeight, clientHeight } = listRef.current;
            if (scrollHeight <= clientHeight) {
                setBottomGradientOpacity(0);
            } else {
                setBottomGradientOpacity(1);
            }
            setTopGradientOpacity(0); 
        }
    }, 0);
    return () => clearTimeout(timer);
  }, [items]); 


  useEffect(() => {
    if (!enableArrowNavigation) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || (e.key === "Tab" && !e.shiftKey)) {
        e.preventDefault(); setKeyboardNav(true);
        setSelectedIndex((prev) => Math.min(prev + 1, items.length - 1));
      } else if (e.key === "ArrowUp" || (e.key === "Tab" && e.shiftKey)) {
        e.preventDefault(); setKeyboardNav(true);
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === "Enter") {
        if (selectedIndex >= 0 && selectedIndex < items.length) {
          e.preventDefault();
          if (onItemSelect) onItemSelect(items[selectedIndex], selectedIndex);
        }
      }
    };
    const targetElement = listRef.current || window;
    targetElement.addEventListener("keydown", handleKeyDown as EventListener);
    return () => targetElement.removeEventListener("keydown", handleKeyDown as EventListener);
  }, [items, selectedIndex, onItemSelect, enableArrowNavigation]);

  useEffect(() => {
    if (!keyboardNav || selectedIndex < 0 || !listRef.current) return;
    const container = listRef.current;
    const selectedItem = container.querySelector<HTMLElement>(`[data-index="${selectedIndex}"]`);
    if (selectedItem) {
      const itemTop = selectedItem.offsetTop;
      const itemHeight = selectedItem.offsetHeight;
      const containerScrollTop = container.scrollTop;
      const containerHeight = container.clientHeight;
      const itemIsVisible = itemTop >= containerScrollTop && (itemTop + itemHeight) <= (containerScrollTop + containerHeight);
      if (!itemIsVisible) {
         selectedItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
    setKeyboardNav(false);
  }, [selectedIndex, keyboardNav]);

  const webkitScrollbarClasses = displayScrollbar
    ? `[&::-webkit-scrollbar]:w-2 
       [&::-webkit-scrollbar-track]:${scrollbarTrackClassName} 
       [&::-webkit-scrollbar-thumb]:${scrollbarThumbClassName} 
       [&::-webkit-scrollbar-thumb]:rounded-full`
    : "scrollbar-hide";
  
  const firefoxScrollbarStyles: React.CSSProperties = displayScrollbar 
    ? { 
        scrollbarWidth: "thin", 
        scrollbarColor: `${scrollbarThumbCssColor || (true ? '#555555' : '#BBBBBB')} ${scrollbarTrackCssColor || (true ? '#222222' : '#DDDDDD')}` // Provide defaults if props are undefined
      } 
    : { scrollbarWidth: "none"};


  return (
    <div className={`relative w-full max-w-md ${className}`}> 
      <div
        ref={listRef}
        tabIndex={enableArrowNavigation ? 0 : -1} 
        className={`max-h-[400px] overflow-y-auto p-1 sm:p-2 
                   focus:outline-none focus:ring-2 focus:ring-offset-2 
                   dark:focus:ring-offset-black focus:ring-cyan-500 rounded-md
                   ${webkitScrollbarClasses} ${listWrapperClassName}`}
        onScroll={handleScroll}
        style={{...firefoxScrollbarStyles}} // Apply Firefox styles directly
      >
        {items.map((item, index) => (
          <AnimatedItem
            key={`${item}-${index}`} 
            delay={0.05} 
            index={index}
            onMouseEnter={() => { if (document.activeElement !== listRef.current) setSelectedIndex(index);}} 
            onClick={() => {
              setSelectedIndex(index);
              if (onItemSelect) onItemSelect(item, index);
            }}
          >
            <div
              className={`p-3 sm:p-4 rounded-lg transition-colors duration-150
                          ${itemWrapperClassName} 
                          ${ selectedIndex === index 
                              ? 'bg-neutral-200 dark:bg-neutral-700' 
                              : 'bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                           }`}
            >
              <p className={`m-0 text-sm sm:text-base ${itemContentClassName} ${selectedIndex === index ? 'text-black dark:text-white' : 'text-neutral-700 dark:text-neutral-300'}`}>
                {item}
              </p>
            </div>
          </AnimatedItem>
        ))}
      </div>
      {showGradients && (
        <>
          <div
            className={`absolute top-0 left-0 right-0 h-12 sm:h-16 bg-gradient-to-b ${gradientColor} to-transparent pointer-events-none transition-opacity duration-300 ease-in-out`}
            style={{ opacity: topGradientOpacity }}
          ></div>
          <div
            className={`absolute bottom-0 left-0 right-0 h-16 sm:h-20 bg-gradient-to-t ${gradientColor} to-transparent pointer-events-none transition-opacity duration-300 ease-in-out`}
            style={{ opacity: bottomGradientOpacity }}
          ></div>
        </>
      )}
    </div>
  );
};