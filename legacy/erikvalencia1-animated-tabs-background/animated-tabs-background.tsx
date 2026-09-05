"use client";

import { useState, useRef, useId, ReactElement, Children } from "react";
import { motion } from "framer-motion";
import { cn } from "../_utils/cn";

export type CleanMotionBgProps = {
  children: ReactElement<{ "data-key": string }> | ReactElement<{ "data-key": string }>[];
  onChange?: (activeKey: string | null) => void;
  className?: string;
  hoverable?: boolean;
  defaultKey?: string | null;
};

export const CleanMotionBackground = ({
  children,
  onChange,
  className,
  hoverable = true,
  defaultKey = null,
}: CleanMotionBgProps) => {
  const [activeKey, setActiveKey] = useState<string | null>(defaultKey);
  const id = useId();
  const stableId = useRef(id);
  const bgLayoutId = `clean-bg-${stableId.current}`;

  const updateActive = (key: string | null) => {
    setActiveKey(key);
    onChange?.(key);
  };

  if (hoverable) {
    // Hoverable version: track hover on each child but don't clear background in gaps
    return (
      <div
        className={cn("relative flex gap-2", className)}
        onMouseLeave={() => updateActive(null)} // clear only when leaving the container
      >
        {Children.map(children, (child: ReactElement<any>, idx) => {
          const keyAttr = child.props["data-key"];
          const isActive = activeKey === keyAttr;

          return (
<div
  key={idx}
  className="relative inline-flex rounded-md"
  onMouseEnter={() => updateActive(keyAttr)}
>
  {/* Background */}
  {isActive && (
    <motion.div
      layoutId={bgLayoutId}
      className="absolute inset-0 rounded-md pointer-events-none"
      initial={false}
      animate={{ backgroundColor: "var(--primary-hover)" }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    />
  )}

  {/* Foreground content */}
  <div className="relative z-10 cursor-pointer transition-colors duration-200 px-4 py-2">
    {child.props.children}
  </div>
</div>

          );
        })}
      </div>
    );
  }

  // Clickable version
  return (
    <div className={cn("relative flex gap-2", className)}>
      {Children.map(children, (child: ReactElement<any>, idx) => {
        const keyAttr = child.props["data-key"];
        const isActive = activeKey === keyAttr;

        return (
          <div
            key={idx}
            className="relative inline-flex rounded-md"
            onClick={() => updateActive(keyAttr)}
          >
            {isActive && (
              <motion.div
                layoutId={bgLayoutId}
                className="absolute inset-0 rounded-md pointer-events-none"
                initial={false}
                animate={{ backgroundColor: "var(--primary-hover)" }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
            <div className="relative z-10 cursor-pointer transition-colors duration-200">
              {child.props.children}
            </div>
          </div>
        );
      })}
    </div>
  );
};
