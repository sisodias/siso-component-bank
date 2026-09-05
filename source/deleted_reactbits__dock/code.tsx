"use client";

import {
  motion,
  MotionValue,
  useMotionValue,
  useSpring,
  useTransform,
  type SpringOptions,
  AnimatePresence,
} from "framer-motion";
import React, {
  Children,
  cloneElement,
  useEffect,
  useMemo,
  useRef,
  useState,
  FC, 
  ReactNode, 
} from "react";

export type DockItemData = {
  icon: ReactNode; 
  label: ReactNode;
  onClick: () => void;
  className?: string; 
};

export type DockProps = {
  items: DockItemData[];
  className?: string; 
  panelWrapperClassName?: string; 
  distance?: number;
  panelHeight?: number;
  baseItemSize?: number;
  magnification?: number;
  spring?: SpringOptions;
};

type DockItemProps = {
  className?: string;
  children: ReactNode;
  onClick?: () => void;
  mouseX: MotionValue;
  spring: SpringOptions;
  distance: number;
  baseItemSize: number;
  magnification: number;
};

const DockItem: FC<DockItemProps> = ({
  children,
  className = "",
  onClick,
  mouseX,
  spring,
  distance,
  magnification,
  baseItemSize,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isHovered = useMotionValue(0);

  const mouseDistance = useTransform(mouseX, (val) => {
    const rect = ref.current?.getBoundingClientRect() ?? { x: 0, width: baseItemSize }; 
    return val - rect.x - rect.width / 2; 
  });

  const targetSize = useTransform(
    mouseDistance,
    [-distance, 0, distance],
    [baseItemSize, magnification, baseItemSize],
    { clamp: true } 
  );
  const size = useSpring(targetSize, spring);

  return (
    <motion.div
      ref={ref}
      style={{ width: size, height: size, }}
      onHoverStart={() => isHovered.set(1)}
      onHoverEnd={() => isHovered.set(0)}
      onFocus={() => isHovered.set(1)} 
      onBlur={() => isHovered.set(0)}  
      onClick={onClick}
      className={`relative inline-flex items-center justify-center rounded-full 
                  bg-neutral-100 dark:bg-[#060606]  
                  border-neutral-300 dark:border-neutral-700 
                  border-2 shadow-lg transition-colors duration-300
                  ${className}`} 
      tabIndex={0}
      role="button"
      aria-haspopup="true" 
    >
      {Children.map(children, (child) =>
        cloneElement(child as React.ReactElement, { isHovered })
      )}
    </motion.div>
  );
};

type DockLabelProps = {
  className?: string;
  children: ReactNode;
};

const DockLabel: FC<DockLabelProps> = ({ children, className = "", ...rest }) => {
  const { isHovered } = rest as { isHovered?: MotionValue<number> }; 
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!isHovered) return; 
    const unsubscribe = isHovered.on("change", (latest) => {
      setIsVisible(latest === 1);
    });
    return () => unsubscribe();
  }, [isHovered]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 5 }} 
          animate={{ opacity: 1, y: -10 }}
          exit={{ opacity: 0, y: 5, transition: { duration: 0.15 } }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className={`${className} absolute -top-8 left-1/2 w-fit whitespace-nowrap 
                      rounded-md border border-neutral-300 dark:border-neutral-600 
                      bg-white dark:bg-black 
                      px-2.5 py-1 text-xs text-neutral-700 dark:text-neutral-200 shadow-xl
                      transition-colors duration-300`}
          role="tooltip"
          style={{ x: "-50%" }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

type DockIconProps = {
  className?: string;
  children: ReactNode;
};

const DockIcon: FC<DockIconProps> = ({ children, className = "" }) => {
  return (
    <div className={`flex items-center justify-center w-full h-full ${className}`}>
      {children}
    </div>
  );
};

export const Dock: FC<DockProps> = ({ 
  items,
  className = "", 
  panelWrapperClassName = "", 
  spring = { mass: 0.1, stiffness: 150, damping: 12 },
  magnification = 70,
  distance = 200, 
  panelHeight = 64, 
  baseItemSize = 50,
}) => {
  const mouseX = useMotionValue(Infinity); 
  const isPanelHovered = useMotionValue(0); 

  const calculatedMaxHeight = useMemo(
    () => Math.max(panelHeight, magnification + baseItemSize / 4 + 4), 
    [panelHeight, magnification, baseItemSize]
  );
  const heightRow = useTransform(isPanelHovered, [0, 1], [panelHeight, calculatedMaxHeight]);
  const animatedHeight = useSpring(heightRow, spring);

  return (
    <motion.div
      style={{ height: animatedHeight }} 
      className={`flex justify-center items-end w-full ${panelWrapperClassName}`}
      onHoverStart={() => isPanelHovered.set(1)}
      onHoverEnd={() => isPanelHovered.set(0)}
    >
      <motion.div
        onMouseMove={({ pageX }) => mouseX.set(pageX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        className={`${className} 
                    flex items-end w-fit gap-3 sm:gap-4 
                    rounded-xl sm:rounded-2xl 
                    border-neutral-300 dark:border-neutral-600 border-2 
                    pb-2 sm:pb-3 px-3 sm:px-4
                    bg-white/50 dark:bg-black/70 backdrop-blur-md 
                    shadow-2xl transition-colors duration-300`}
        style={{ height: panelHeight }} 
        role="toolbar"
        aria-label="Application dock"
      >
        {items.map((item, index) => (
          <DockItem
            key={item.label?.toString() + index || index} 
            onClick={item.onClick}
            className={item.className} 
            mouseX={mouseX}
            spring={spring}
            distance={distance}
            magnification={magnification}
            baseItemSize={baseItemSize}
          >
            <DockIcon>{item.icon}</DockIcon>
            <DockLabel>{item.label}</DockLabel>
          </DockItem>
        ))}
      </motion.div>
    </motion.div>
  );
};