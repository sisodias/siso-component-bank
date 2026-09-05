"use client";

import {
  ComponentPropsWithoutRef,
  Dispatch,
  ReactNode,
  SetStateAction,
  cloneElement,
  isValidElement,
  useEffect,
  useRef,
} from "react";
import { cn } from "../_utils/cn";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CaretDown } from "@phosphor-icons/react";

type SelectOptionProps = {
  value: string;
  children: string;
  setValue?: Dispatch<SetStateAction<string>>;
  handleSelection?: (text: string) => void;
  closeDropdown?: () => void;
};

export function Select({
  children,
  className,
  placeholder,
  setValue,
  ...props
}: {
  children: ReactNode;
  placeholder: string;
  className?: string;
  setValue: Dispatch<SetStateAction<string>>;
} & ComponentPropsWithoutRef<"button">) {
  const [isOpened, setIsOpened] = useState<boolean>(false);
  const [displayText, setDisplayText] = useState<string>("");
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpened(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const closeDropdown = () => setIsOpened(false);

  // Handler for selection that updates both text and index
  const handleSelection = (text: string, index: number) => {
    setDisplayText(text);
    setSelectedIndex(index);
  };

  const childrenArray = Array.isArray(children) ? children : [children];

  const childrenWithProps = childrenArray.map((child, index) => {
    if (isValidElement<SelectOptionProps>(child)) {
      return cloneElement(child, {
        setValue,
        handleSelection: (text: string) => handleSelection(text, index),
        closeDropdown,
        key: child.props.value || index,
      });
    }
    return child;
  });

  return (
    <div className="relative" ref={selectRef}>
      <button
        onClick={() => setIsOpened(!isOpened)}
        className={cn(
          "h-[1em] flex items-center gap-2 rounded-xl py-5 px-3 bg-white dark:bg-black text-black dark:text-white border-black/10 dark:border-white/10 border outline-none hover:bg-black/10 dark:hover:bg-white/10 transition ease-in-out duration-200 cursor-pointer min-w-44 justify-between ring-0 focus:ring-2 ring-black/10 dark:ring-white/10 focus:border-black/20 dark:focus:border-white/20 overflow-hidden",
          className
        )}
        {...props}
      >
        <div className="relative overflow-hidden py-3 flex-1 h-full">
          <div
            className={cn(
              "absolute inset-0 flex items-center justify-start transition-opacity duration-200",
              displayText ? "opacity-0" : "opacity-100"
            )}
          >
            {placeholder}
          </div>

          <div
            className="absolute h-full inset-0 flex flex-col gap-2 transition-transform duration-300 ease-in-out"
            style={{
              transform: `translateY(calc(${selectedIndex * -100}% - ${
                selectedIndex * 8
              }px))`,
            }}
          >
            {childrenArray.map((child, index) => {
              if (isValidElement<SelectOptionProps>(child)) {
                return (
                  <div
                    key={index}
                    className={cn(
                      "h-full flex items-center justify-start",
                      selectedIndex === index && "text-black dark:text-white"
                    )}
                  >
                    {child.props.children}
                  </div>
                );
              }
              return null;
            })}
          </div>
        </div>

        <CaretDown
          className={cn(
            "transition-transform duration-200",
            isOpened && "rotate-180"
          )}
        />
      </button>

      <AnimatePresence>
        {isOpened && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full mt-2 left-0 right-0 border border-black/10 dark:border-white/10 text-black dark:text-white rounded-xl p-1 bg-white dark:bg-black shadow-sm"
          >
            {childrenWithProps}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function SelectOption({
  children,
  value,
  setValue,
  handleSelection,
  closeDropdown,
}: SelectOptionProps) {
  return (
    <div
      className="hover:bg-black/10 dark:hover:bg-white/10 p-2 px-5 rounded-xl cursor-pointer transition ease-in-out duration-200"
      onClick={() => {
        setValue?.(value);
        handleSelection?.(children);
        closeDropdown?.();
      }}
    >
      {children}
    </div>
  );
}
