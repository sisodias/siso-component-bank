"use client";

import * as React from "react";
import { useEffect, useRef, useState } from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";

export interface SlideTab {
  value: string;
  label: React.ReactNode;
  content?: React.ReactNode;
}

export interface SlideTabsProps {
  tabs: SlideTab[];
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  className?: string;
}

export function SlideTabs({
  tabs,
  defaultValue,
  onValueChange,
  className = "",
}: SlideTabsProps) {
  const [activeTab, setActiveTab] = useState(defaultValue || tabs[0]?.value);
  const [indicatorStyle, setIndicatorStyle] = useState({});
  const tabRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    onValueChange?.(value);
  };

  useEffect(() => {
    const activeTabElement = tabRefs.current[activeTab];
    if (activeTabElement) {
      const { offsetLeft, offsetWidth } = activeTabElement;
      setIndicatorStyle({
        left: offsetLeft,
        width: offsetWidth,
        opacity: 1,
      });
    }
  }, [activeTab]);

  return (
    <TabsPrimitive.Root
      value={activeTab}
      onValueChange={handleTabChange}
      className={`w-full ${className}`}
    >
      <div className="flex justify-center w-full">
        <TabsPrimitive.List className="relative bg-secondary/50 border border-primary/10 flex rounded-full py-2 px-4">
          {/* Moving background indicator */}
          <div
            className="absolute top-2 h-8 bg-primary rounded-full transition-all duration-300 ease-out"
            style={indicatorStyle}
          />

          {/* Tab buttons */}
          {tabs.map((tab) => {
            const isActive = activeTab === tab.value;

            return (
              <TabsPrimitive.Trigger
                key={tab.value}
                value={tab.value}
                ref={(el) => {
                  tabRefs.current[tab.value] = el;
                }}
                className={`relative z-10 flex h-8 items-center rounded-full px-3 text-sm font-medium transition-colors duration-300 ${
                  isActive
                    ? "text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
              </TabsPrimitive.Trigger>
            );
          })}
        </TabsPrimitive.List>
      </div>

      {tabs.map((tab) => (
        <TabsPrimitive.Content
          key={tab.value}
          value={tab.value}
          className="flex  justify-center mt-4 focus-visible:outline-none w-full"
        >
          {tab.content}
        </TabsPrimitive.Content>
      ))}
    </TabsPrimitive.Root>
  );
}
