"use client";

import React, { useState, useRef, useEffect, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SearchableItem {
  value: string;
  label: string;
  icon?: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  divider?: boolean;
}

export interface SearchableDropdownProps {
  trigger: ReactNode;
  items: SearchableItem[];
  position?: "bottom-left" | "bottom-right" | "top-left" | "top-right";
  className?: string;
  menuClassName?: string;
  searchPlaceholder?: string;
  maxHeight?: string;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
}

export const SearchableDropdown: React.FC<SearchableDropdownProps> = ({
  trigger,
  items,
  position = "bottom-left",
  className,
  menuClassName,
  searchPlaceholder = "Search...",
  maxHeight = "300px",
  onOpenChange,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const filteredItems = items.filter((item) =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const positionClasses = {
    "bottom-left": "top-full left-0 mt-2",
    "bottom-right": "top-full right-0 mt-2",
    "top-left": "bottom-full left-0 mb-2",
    "top-right": "bottom-full right-0 mb-2",
  };

  const toggleDropdown = () => {
    if (disabled) return;
    const newState = !isOpen;
    setIsOpen(newState);
    onOpenChange?.(newState);
    if (newState) {
      setFocusedIndex(-1);
      setSearchQuery("");
    }
  };

  const closeDropdown = () => {
    setIsOpen(false);
    onOpenChange?.(false);
    setFocusedIndex(-1);
    setSearchQuery("");
    triggerRef.current?.focus();
  };

  const handleItemClick = (item: SearchableItem) => {
    if (item.disabled) return;
    item.onClick?.();
    closeDropdown();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    switch (e.key) {
      case "Enter":
      case " ":
        if (!isOpen) {
          e.preventDefault();
          toggleDropdown();
        } else if (focusedIndex >= 0 && focusedIndex < filteredItems.length) {
          e.preventDefault();
          handleItemClick(filteredItems[focusedIndex]);
        }
        break;
      case "Escape":
        if (isOpen) {
          e.preventDefault();
          closeDropdown();
        }
        break;
      case "ArrowDown":
        if (!isOpen) {
          e.preventDefault();
          toggleDropdown();
        } else {
          e.preventDefault();
          setFocusedIndex((prev) =>
            prev < filteredItems.length - 1 ? prev + 1 : 0
          );
        }
        break;
      case "ArrowUp":
        if (isOpen) {
          e.preventDefault();
          setFocusedIndex((prev) =>
            prev > 0 ? prev - 1 : filteredItems.length - 1
          );
        }
        break;
      case "Tab":
        if (isOpen) {
          closeDropdown();
        }
        break;
    }
  };

  const handleMenuKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      handleKeyDown(e);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        closeDropdown();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      if (searchInputRef.current) {
        setTimeout(() => searchInputRef.current?.focus(), 0);
      }
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const dropdownVariants = {
    hidden: {
      opacity: 0,
      scale: 0.95,
      y: position.startsWith("top") ? 10 : -10,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
    },
  };

  return (
    <div ref={dropdownRef} className={cn("relative inline-block", className)}>
      <button
        ref={triggerRef}
        onClick={toggleDropdown}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-md border border-input",
          "bg-background px-3 py-2 text-sm font-medium text-foreground",
          "transition-colors hover:bg-accent hover:text-accent-foreground",
          "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
          "disabled:pointer-events-none disabled:opacity-50",
          isOpen && "bg-accent text-accent-foreground"
        )}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-label="Open searchable menu"
      >
        {trigger}
        <ChevronDown
          className={cn(
            "h-4 w-4 transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={menuRef}
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.15, ease: "easeOut" }}
            className={cn(
              "absolute z-50 min-w-[220px] overflow-hidden rounded-md border border-border",
              "bg-popover p-1 text-popover-foreground shadow-lg",
              positionClasses[position],
              menuClassName
            )}
            role="menu"
            aria-orientation="vertical"
            onKeyDown={handleMenuKeyDown}
          >
            <div className="relative mb-1">
              <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder={searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={cn(
                  "w-full rounded-sm border border-input bg-background pl-8 pr-2 py-1.5",
                  "text-sm placeholder:text-muted-foreground",
                  "focus:outline-none focus:ring-1 focus:ring-ring"
                )}
                aria-label="Search menu items"
              />
            </div>

            <div className="overflow-auto" style={{ maxHeight }}>
              {filteredItems.length === 0 ? (
                <div className="px-2 py-1.5 text-sm text-muted-foreground">
                  No items found
                </div>
              ) : (
                filteredItems.map((item, index) => (
                  <React.Fragment key={item.value}>
                    <button
                      onClick={() => handleItemClick(item)}
                      disabled={item.disabled}
                      className={cn(
                        "flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm",
                        "text-left transition-colors",
                        "hover:bg-accent hover:text-accent-foreground",
                        "focus:bg-accent focus:text-accent-foreground focus:outline-none",
                        "disabled:pointer-events-none disabled:opacity-50",
                        focusedIndex === index && "bg-accent text-accent-foreground"
                      )}
                      role="menuitem"
                      tabIndex={-1}
                      aria-label={item.label}
                    >
                      {item.icon && (
                        <span className="flex h-4 w-4 items-center justify-center">
                          {item.icon}
                        </span>
                      )}
                      {item.label}
                    </button>
                    {item.divider && (
                      <div className="my-1 h-px bg-border" role="separator" />
                    )}
                  </React.Fragment>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}; 