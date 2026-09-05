"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface Tab {
  label: string;
  content: React.ReactNode;
}

interface AnimatedTabsProps {
  tabs: Tab[];
  defaultIndex?: number;
  className?: string;
}

const AnimatedTabs = React.forwardRef<HTMLDivElement, AnimatedTabsProps>(
  ({ tabs, defaultIndex = 0, className, ...props }, ref) => {
    const [activeIndex, setActiveIndex] = useState(defaultIndex);
    const [tabDimensions, setTabDimensions] = useState({ width: 0, left: 0 });
    const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
    const tabListRef = useRef<HTMLDivElement>(null);

    const updateTabDimensions = useCallback(() => {
      const activeTab = tabRefs.current[activeIndex];
      if (activeTab) {
        let leftOffset = 0;
        for (let i = 0; i < activeIndex; i++) {
          const tab = tabRefs.current[i];
          if (tab) {
            leftOffset += tab.offsetWidth;
          }
        }
        
        setTabDimensions({ 
          width: activeTab.offsetWidth, 
          left: leftOffset 
        });
      }
    }, [activeIndex]);

    useEffect(() => {
      updateTabDimensions();
    }, [updateTabDimensions]);

    useEffect(() => {
      const handleResize = () => updateTabDimensions();
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, [updateTabDimensions]);

    const handleKeyDown = useCallback(
      (event: React.KeyboardEvent, index: number) => {
        switch (event.key) {
          case "ArrowLeft":
            event.preventDefault();
            setActiveIndex((prev) => (prev > 0 ? prev - 1 : tabs.length - 1));
            break;
          case "ArrowRight":
            event.preventDefault();
            setActiveIndex((prev) => (prev < tabs.length - 1 ? prev + 1 : 0));
            break;
          case "Home":
            event.preventDefault();
            setActiveIndex(0);
            break;
          case "End":
            event.preventDefault();
            setActiveIndex(tabs.length - 1);
            break;
          case "Enter":
          case " ":
            event.preventDefault();
            setActiveIndex(index);
            break;
        }
      },
      [tabs.length]
    );

    useEffect(() => {
      const activeTab = tabRefs.current[activeIndex];
      if (activeTab && document.activeElement !== activeTab) {
        if (tabRefs.current.some(tab => tab === document.activeElement)) {
          activeTab.focus();
        }
      }
    }, [activeIndex]);

    return (
      <div
        ref={ref}
        className={cn("w-full", className)}
        {...props}
      >
        <div
          ref={tabListRef}
          role="tablist"
          className="relative flex items-center bg-muted/30 p-1 rounded-lg border border-border/40 backdrop-blur-sm"
        >
          <motion.div
            className="absolute bottom-1 h-0.5 bg-primary rounded-full"
            initial={false}
            animate={{
              width: tabDimensions.width - 32,
              x: tabDimensions.left + 16,
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
            }}
          />

          {tabs.map((tab, index) => (
            <button
              key={index}
              ref={(el) => {
                tabRefs.current[index] = el;
              }}
              role="tab"
              aria-selected={activeIndex === index}
              aria-controls={`tabpanel-${index}`}
              id={`tab-${index}`}
              tabIndex={activeIndex === index ? 0 : -1}
              className={cn(
                "relative flex-1 px-4 py-2.5 text-sm font-medium rounded-md transition-all duration-200",
                "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-background",
                "hover:text-foreground",
                activeIndex === index
                  ? "text-foreground bg-background/50 shadow-sm"
                  : "text-muted-foreground hover:bg-background/30"
              )}
              onClick={() => setActiveIndex(index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
            >
              <span className="relative z-10">{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="mt-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              role="tabpanel"
              id={`tabpanel-${activeIndex}`}
              aria-labelledby={`tab-${activeIndex}`}
              tabIndex={0}
              className="focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-background rounded-lg"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
              }}
            >
              {tabs[activeIndex]?.content}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    );
  }
);

AnimatedTabs.displayName = "AnimatedTabs";

export { AnimatedTabs, type AnimatedTabsProps };