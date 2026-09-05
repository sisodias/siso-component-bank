// component.tsx
import * as React from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface ActionItem {
  id: string;
  label: string;
  icon: React.ElementType;
  content: React.ReactNode;
  dimensions: {
    width: number;
    height: number;
  };
}

export interface DynamicActionBarProps
  extends React.HTMLAttributes<HTMLDivElement> {
  actions: ActionItem[];
}

const DynamicActionBar = React.forwardRef<
  HTMLDivElement,
  DynamicActionBarProps
>(({ actions, className, ...props }, ref) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const activeAction = activeIndex !== null ? actions[activeIndex] : null;

  const BUTTON_BAR_HEIGHT = 56;

  const containerAnimate = activeAction
    ? {
        width: activeAction.dimensions.width,
        height: activeAction.dimensions.height + BUTTON_BAR_HEIGHT,
      }
    : {
        width: 410,
        height: BUTTON_BAR_HEIGHT,
      };

  const transition = { type: "spring", stiffness: 400, damping: 35 };

  return (
    <div
      ref={ref}
      className={`relative ${className}`}
      onMouseLeave={() => setActiveIndex(null)}
      {...props}
    >
      <motion.div
        className="flex flex-col overflow-hidden rounded-2xl bg-black/5 backdrop-blur-xl"
        animate={containerAnimate}
        transition={transition}
        initial={{ width: 410, height: BUTTON_BAR_HEIGHT }}
      >
        <div className="flex-grow overflow-hidden">
          <AnimatePresence>
            {activeAction && (
              <motion.div
                className="w-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, delay: 0.1 }}
              >
                {activeAction.content}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div
          className="flex flex-shrink-0 items-center justify-center gap-2 px-2"
          style={{ height: `${BUTTON_BAR_HEIGHT}px` }}
        >
          {actions.map((action, index) => {
            const Icon = action.icon;
            return (
              <button
                key={action.id}
                onMouseEnter={() => setActiveIndex(index)}
                className="flex items-center justify-center gap-2 rounded-2xl py-3 px-4 text-zinc-800 transition-colors duration-300 hover:bg-zinc-950 hover:text-white"
              >
                <Icon className="size-6" />
                <span className="font-bold">{action.label}</span>
              </button>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
});

DynamicActionBar.displayName = "DynamicActionBar";

export default DynamicActionBar;