"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface AutocompleteItemData {
  value: string;
  label: string;
  description?: string;
  tag?: string;
  [key: string]: any;
}

interface AutocompleteProps {
  items: AutocompleteItemData[];
  placeholder?: string;
  emptyMessage?: string;
  value?: string | string[];
  onValueChange?: (value: any) => void;
  disabled?: boolean;
  isCreatable?: boolean;
  onCreate?: (value: string) => void;
  className?: string;
  onInputChange?: (value: string) => void;
  loading?: boolean;
  filterFn?: ((item: AutocompleteItemData, query: string) => boolean) | false | null;
  debounceInterval?: number;
  name?: string;
  id?: string;
  required?: boolean;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  maxOptions?: number;
  minOptions?: number;
}

// --- 1. CUSTOM ICONS ---
const MorphingIcon = ({ state }: { state: "down" | "up" | "x" }) => {
  const pathD =
    state === "x"
      ? "M 6 18 L 18 6 M 18 18 L 6 6"
      : state === "up"
      ? "M 6 15 L 12 9 M 18 15 L 12 9"
      : "M 6 9 L 12 15 M 18 9 L 12 15";

  return (
    <svg
      viewBox="0 0 24 24"
      className="w-5 h-5 text-muted-foreground transition-colors group-hover:text-foreground pointer-events-none"
    >
      <path
        d={pathD}
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        style={{ transition: "d 0.4s cubic-bezier(0.4, 0, 0.2, 1)" }}
      />
    </svg>
  );
};

const CustomCheckIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    className={cn("w-4 h-4", className)}
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const CustomPlusIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    className={cn("w-4 h-4", className)}
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

// --- 2. INTERNAL RIPPLE ENGINE ---
const MINIMUM_PRESS_MS = 300;
const INITIAL_ORIGIN_SCALE = 0.2;
const PADDING = 10;
const SOFT_EDGE_MINIMUM_SIZE = 75;
const SOFT_EDGE_CONTAINER_RATIO = 0.35;
const ANIMATION_FILL = "forwards";
const EASING_STANDARD = "cubic-bezier(0.2, 0, 0, 1)";

const useInternalRipple = <T extends HTMLElement = HTMLElement>(disabled = false) => {
  const [pressed, setPressed] = React.useState(false);
  const surfaceRef = React.useRef<T>(null);
  const rippleRef = React.useRef<HTMLDivElement>(null);
  const growAnimationRef = React.useRef<Animation | null>(null);

  const startPressAnimation = (event?: React.PointerEvent | React.KeyboardEvent) => {
    if (disabled || !surfaceRef.current || !rippleRef.current) return;
    setPressed(true);
    growAnimationRef.current?.cancel();

    const rect = surfaceRef.current.getBoundingClientRect();
    const maxDim = Math.max(rect.width, rect.height);
    const softEdgeSize = Math.max(SOFT_EDGE_CONTAINER_RATIO * maxDim, SOFT_EDGE_MINIMUM_SIZE);
    const initialSize = Math.floor(maxDim * INITIAL_ORIGIN_SCALE);
    const hypotenuse = Math.sqrt(rect.width ** 2 + rect.height ** 2);
    const maxRadius = hypotenuse + PADDING;
    const duration = Math.min(Math.max(400, hypotenuse * 1.5), 1000);
    const scale = (maxRadius + softEdgeSize) / initialSize;

    const endPoint = { x: (rect.width - initialSize) / 2, y: (rect.height - initialSize) / 2 };
    let startPoint = endPoint;
    if (event && "clientX" in event) {
      startPoint = {
        x: (event as React.PointerEvent).clientX - rect.left - initialSize / 2,
        y: (event as React.PointerEvent).clientY - rect.top - initialSize / 2,
      };
    }

    rippleRef.current.style.width = `${initialSize}px`;
    rippleRef.current.style.height = `${initialSize}px`;

    growAnimationRef.current = rippleRef.current.animate(
      [
        { transform: `translate(${startPoint.x}px, ${startPoint.y}px) scale(1)` },
        { transform: `translate(${endPoint.x}px, ${endPoint.y}px) scale(${scale})` },
      ],
      { duration, easing: EASING_STANDARD, fill: ANIMATION_FILL }
    );
  };

  const endPressAnimation = async () => {
    const animation = growAnimationRef.current;
    if (animation && typeof animation.currentTime === "number" && animation.currentTime < MINIMUM_PRESS_MS) {
      await new Promise((r) => setTimeout(r, MINIMUM_PRESS_MS - (animation.currentTime as number)));
    }
    setPressed(false);
  };

  return {
    surfaceRef,
    rippleRef,
    pressed,
    events: {
      onPointerDown: (e: React.PointerEvent) => {
        if (e.button === 0) startPressAnimation(e);
      },
      onPointerUp: endPressAnimation,
      onPointerLeave: endPressAnimation,
      onPointerCancel: endPressAnimation,
    },
  };
};

const RippleLayer = React.forwardRef<
  HTMLDivElement,
  { pressed: boolean; rippleRef: React.RefObject<HTMLDivElement> }
>(({ pressed, rippleRef }, ref) => (
  <div ref={ref} className="absolute inset-0 overflow-hidden rounded-[inherit] pointer-events-none z-0">
    <div className="absolute inset-0 bg-current opacity-0 transition-opacity duration-200 group-hover/m3item:opacity-[0.08] group-data-[active=true]:opacity-[0.08]" />
    <div
      ref={rippleRef}
      className="absolute rounded-full opacity-0 bg-current"
      style={{
        background: "radial-gradient(closest-side, currentColor max(calc(100% - 70px), 65%), transparent 100%)",
        transition: "opacity 375ms linear",
        opacity: pressed ? "0.12" : "0",
        transitionDuration: pressed ? "100ms" : "375ms",
      }}
    />
  </div>
));
RippleLayer.displayName = "RippleLayer";

// --- 3. HIGH-PERFORMANCE FLOATING SCROLL AREA ---
const CustomFloatingScrollArea = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { viewportRef?: React.RefObject<HTMLDivElement | null> }
>(({ children, className, viewportRef: externalViewportRef, ...props }, ref) => {
  const internalViewportRef = React.useRef<HTMLDivElement>(null);
  const viewportRef = (externalViewportRef as React.RefObject<HTMLDivElement>) || internalViewportRef;
  const topFadeRef = React.useRef<HTMLDivElement>(null);
  const bottomFadeRef = React.useRef<HTMLDivElement>(null);
  
  const [thumbHeight, setThumbHeight] = React.useState(0);
  const [thumbTop, setThumbTop] = React.useState(0);
  const [isDragging, setIsDragging] = React.useState(false);
  const dragProps = React.useRef({ startY: 0, startScrollTop: 0 });

  const updateScrollState = React.useCallback(() => {
    if (!viewportRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = viewportRef.current;

    if (topFadeRef.current) {
      topFadeRef.current.style.opacity = scrollTop > 0 ? "1" : "0";
    }
    if (bottomFadeRef.current) {
      bottomFadeRef.current.style.opacity = Math.ceil(scrollTop + clientHeight) >= scrollHeight - 1 ? "0" : "1";
    }
    
    if (scrollHeight > clientHeight) {
      const tHeight = Math.max((clientHeight / scrollHeight) * clientHeight, 30);
      setThumbHeight(tHeight);
      const ratio = (clientHeight - tHeight) / (scrollHeight - clientHeight);
      setThumbTop(scrollTop * ratio);
    } else {
      setThumbHeight(0);
    }
  }, [viewportRef]);

  React.useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    updateScrollState();
    
    const resizeObserver = new ResizeObserver(() => updateScrollState());
    resizeObserver.observe(viewport);
    if (viewport.firstElementChild) {
      resizeObserver.observe(viewport.firstElementChild);
    }
    
    const mutationObserver = new MutationObserver(() => updateScrollState());
    mutationObserver.observe(viewport, { childList: true, subtree: true, characterData: true });

    return () => {
      resizeObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, [updateScrollState, viewportRef]);

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    dragProps.current = {
      startY: e.clientY,
      startScrollTop: viewportRef.current?.scrollTop || 0
    };
    document.body.style.userSelect = "none";
  };

  React.useEffect(() => {
    if (!isDragging) return;
    const handlePointerMove = (e: PointerEvent) => {
      if (!viewportRef.current) return;
      const deltaY = e.clientY - dragProps.current.startY;
      const { scrollHeight, clientHeight } = viewportRef.current;
      const tHeight = Math.max((clientHeight / scrollHeight) * clientHeight, 30);
      const ratio = (scrollHeight - clientHeight) / (clientHeight - tHeight);
      viewportRef.current.scrollTop = dragProps.current.startScrollTop + (deltaY * ratio);
    };
    const handlePointerUp = () => {
      setIsDragging(false);
      document.body.style.userSelect = "";
    };
    
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [isDragging, viewportRef]);

  return (
    <div 
      ref={ref} 
      data-dragging={isDragging}
      className={cn("relative overflow-hidden group/scroll", className)} 
      {...props}
    >
      <div 
        ref={topFadeRef}
        className="absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-card to-transparent pointer-events-none z-20 transition-opacity duration-300 opacity-0"
      />

      <div 
        ref={viewportRef} 
        onScroll={updateScrollState}
        style={{ maxHeight: 'inherit' }}
        className="w-full overflow-y-auto m3-hide-scroll rounded-[inherit]"
      >
        {children}
      </div>
      
      <div 
        ref={bottomFadeRef}
        className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-card to-transparent pointer-events-none z-20 transition-opacity duration-300 opacity-0"
      />

      {thumbHeight > 0 && (
        <div 
          className={cn(
            "absolute inset-y-0 right-0 z-50 flex items-start justify-end py-0.5 px-0.5 w-4 transition-opacity duration-300 cursor-default",
            "opacity-0 pointer-events-none",
            "group-hover/scroll:opacity-100 group-hover/scroll:pointer-events-auto",
            "group-data-[dragging=true]/scroll:opacity-100 group-data-[dragging=true]/scroll:pointer-events-auto"
          )}
        >
          <div
            className={cn(
              "bg-border rounded-full transition-all duration-200 cursor-default touch-none shadow-sm",
              "w-1 hover:w-1.5 hover:bg-muted-foreground",
              "group-data-[dragging=true]/scroll:w-1.5 group-data-[dragging=true]/scroll:bg-muted-foreground"
            )}
            style={{ height: thumbHeight, transform: `translateY(${thumbTop}px)` }}
            onPointerDown={handlePointerDown}
          />
        </div>
      )}
    </div>
  );
});
CustomFloatingScrollArea.displayName = "CustomFloatingScrollArea";

// --- 4. CSS STYLES ---
const M3AutocompleteStyles = () => (
  <style dangerouslySetInnerHTML={{
      __html: `
    @keyframes m3-auto-item-cinematic { 
      0% { opacity: 0; transform: translateY(8px) scale(0.98); filter: blur(4px); } 
      100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); } 
    }
    
    @keyframes m3-chip-enter { 
      0% { opacity: 0; transform: scale(0.8) translate3d(8px, 0, 0); } 
      100% { opacity: 1; transform: scale(1) translate3d(0, 0, 0); } 
    }

    .m3-chip-animate {
      animation: m3-chip-enter 200ms cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
    }
    
    .m3-auto-container[data-state="open"] .m3-auto-item { 
      opacity: 0; 
      animation: m3-auto-item-cinematic 350ms cubic-bezier(0.1, 0.8, 0.2, 1) forwards; 
    }

    .m3-auto-container[data-state="open"] .m3-auto-item:nth-child(1) { animation-delay: 50ms; }
    .m3-auto-container[data-state="open"] .m3-auto-item:nth-child(2) { animation-delay: 100ms; }
    .m3-auto-container[data-state="open"] .m3-auto-item:nth-child(3) { animation-delay: 150ms; }
    .m3-auto-container[data-state="open"] .m3-auto-item:nth-child(4) { animation-delay: 200ms; }
    .m3-auto-container[data-state="open"] .m3-auto-item:nth-child(n+5) { animation-delay: 250ms; }

    .m3-hide-scroll {
      scrollbar-width: none;
      -ms-overflow-style: none;
    }
    .m3-hide-scroll::-webkit-scrollbar {
      display: none;
    }
  `}}
  />
);

// --- 5. M3 ITEM COMPONENT ---
const M3AutocompleteItem = React.forwardRef<
  HTMLLIElement,
  React.LiHTMLAttributes<HTMLLIElement> & {
    isActive: boolean;
    isSelected: boolean;
    onSelectAction: () => void;
  }
>(({ className, children, isActive, isSelected, onSelectAction, ...props }, ref) => {
  const { surfaceRef, rippleRef, pressed, events } = useInternalRipple<HTMLLIElement>();

  return (
    <li
      ref={(node) => {
        (surfaceRef as any).current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) (ref as any).current = node;
      }}
      role="option"
      aria-selected={isSelected}
      data-active={isActive}
      className={cn(
        "m3-auto-item group/m3item relative flex items-center p-3 px-4 cursor-pointer text-sm outline-none transition-colors overflow-hidden",
        isActive && "bg-secondary/50 text-secondary-foreground",
        className
      )}
      onMouseDown={(e) => {
        // Prevent the input from losing focus when clicking this option
        e.preventDefault();
      }}
      onClick={() => {
        setTimeout(() => onSelectAction(), 150);
      }}
      {...events}
      {...props}
    >
      <RippleLayer rippleRef={rippleRef} pressed={pressed} />
      <span className="relative z-10 flex w-full items-center pointer-events-none">{children}</span>
    </li>
  );
});
M3AutocompleteItem.displayName = "M3AutocompleteItem";

// --- 6. MAIN EXPORT ---
export function Autocomplete({
  items,
  placeholder,
  emptyMessage = "No results found.",
  value,
  onValueChange,
  disabled,
  isCreatable = false,
  onCreate,
  className,
  onInputChange,
  loading = false,
  filterFn,
  debounceInterval = 0,
  name,
  id,
  required,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledby,
  maxOptions,
  minOptions,
}: AutocompleteProps) {
  const isMulti = Array.isArray(value);
  
  // Deriving stable listbox ID fallback
  const fallbackId = React.useId();
  const listboxId = id ? `${id}-listbox` : `${fallbackId}-listbox`;
  const getOptionId = (index: number) => `${listboxId}-option-${index}`;

  // State Initialization with lazy default mapping
  const [inputValue, setInputValue] = React.useState(() => {
    if (value) {
      if (Array.isArray(value)) return ""; // Keep input empty for multi-select typing
      return items.find((item) => item.value === value)?.label || "";
    }
    return "";
  });

  const [debouncedQuery, setDebouncedQuery] = React.useState(inputValue);
  
  const [isOpen, setIsOpen] = React.useState(false);
  const [renderState, setRenderState] = React.useState<"closed" | "open" | "closing">("closed");
  const [activeIndex, setActiveIndex] = React.useState(-1);
  const interactionType = React.useRef<"mouse" | "keyboard">("mouse");

  // Dynamic non-portal placement and height tracking
  const [placement, setPlacement] = React.useState<"top" | "bottom">("bottom");
  const [maxHeight, setMaxHeight] = React.useState(260);

  const inputRef = React.useRef<HTMLInputElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const listRef = React.useRef<HTMLUListElement>(null);
  const scrollViewportRef = React.useRef<HTMLDivElement>(null);
  
  const chipScrollRef = React.useRef<HTMLDivElement>(null);
  const leftFadeRef = React.useRef<HTMLDivElement>(null);
  const rightFadeRef = React.useRef<HTMLDivElement>(null);

  const animationTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const debounceTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  // Synchronous Rendering State Derivation (Bypasses single-frame lags)
  const [prevValue, setPrevValue] = React.useState(value);
  const [prevItems, setPrevItems] = React.useState(items);

  if (value !== prevValue || items !== prevItems) {
    setPrevValue(value);
    setPrevItems(items);
    if (isMulti) {
      if (!value || (value as string[]).length === 0) {
        setInputValue("");
        setDebouncedQuery("");
      }
    } else {
      if (value) {
        const selectedLabel = items.find((item) => item.value === value)?.label || "";
        setInputValue(selectedLabel);
        setDebouncedQuery(selectedLabel);
      } else {
        setInputValue("");
        setDebouncedQuery("");
      }
    }
  }

  // Button Ripple Setup
  const {
    surfaceRef: btnSurfaceRef,
    rippleRef: btnRippleRef,
    pressed: btnPressed,
    events: btnEvents,
  } = useInternalRipple<HTMLButtonElement>(disabled);

  // Clear All Button Ripple Setup
  const {
    surfaceRef: clearSurfaceRef,
    rippleRef: clearRippleRef,
    pressed: clearPressed,
    events: clearEvents,
  } = useInternalRipple<HTMLButtonElement>(disabled);

  const filteredItems = React.useMemo(() => {
    if (filterFn === false || filterFn === null) {
      return items;
    }
    if (filterFn) {
      return items.filter((item) => filterFn(item, debouncedQuery));
    }
    return debouncedQuery
      ? items.filter((item) => item.label.toLowerCase().includes(debouncedQuery.toLowerCase()))
      : items;
  }, [items, debouncedQuery, filterFn]);

  // Lock and freeze options during collapsing transitions
  const [lastFilteredItems, setLastFilteredItems] = React.useState(filteredItems);

  React.useEffect(() => {
    if (renderState === "open") {
      setLastFilteredItems(filteredItems);
    }
  }, [filteredItems, renderState]);

  // Non-portal space measuring and flip placements calculations
  const updatePlacementAndHeight = React.useCallback(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    const spaceBelow = windowHeight - rect.bottom;
    const spaceAbove = rect.top;

    const minRequiredSpace = 280;
    const nextPlacement = (spaceBelow < minRequiredSpace && spaceAbove > spaceBelow) ? "top" : "bottom";
    
    setPlacement(nextPlacement);

    const availableSpace = nextPlacement === "bottom" ? spaceBelow : spaceAbove;
    const calculatedMaxHeight = Math.max(100, Math.min(260, availableSpace - 16));
    setMaxHeight(calculatedMaxHeight);
  }, []);

  // Native ResizeObserver logic to completely eradicate initial mounting race conditions
  React.useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new ResizeObserver(() => {
      updatePlacementAndHeight();
    });

    observer.observe(el);
    if (el.parentElement) {
      observer.observe(el.parentElement);
    }

    // Explicit fallback bindings
    window.addEventListener("resize", updatePlacementAndHeight);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updatePlacementAndHeight);
    };
  }, [updatePlacementAndHeight]);

  React.useEffect(() => {
    if (!isOpen) return;
    
    window.addEventListener("scroll", updatePlacementAndHeight, { capture: true, passive: true });
    return () => {
      window.removeEventListener("scroll", updatePlacementAndHeight, true);
    };
  }, [isOpen, updatePlacementAndHeight]);

  const handleInputChange = React.useCallback((newValue: string) => {
    setInputValue(newValue);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (debounceInterval && debounceInterval > 0) {
      debounceTimerRef.current = setTimeout(() => {
        setDebouncedQuery(newValue);
        if (onInputChange) onInputChange(newValue);
      }, debounceInterval);
    } else {
      setDebouncedQuery(newValue);
      if (onInputChange) onInputChange(newValue);
    }
  }, [debounceInterval, onInputChange]);

  const openList = React.useCallback((defaultIndex?: number) => {
    setIsOpen(true);
    setRenderState("open");
    if (animationTimerRef.current) clearTimeout(animationTimerRef.current);

    if (typeof defaultIndex === "number") {
      setActiveIndex(defaultIndex);
    } else {
      const index = filteredItems.findIndex((item) => item.value === value);
      setActiveIndex(index >= 0 ? index : -1);
    }
  }, [filteredItems, value]);

  const closeList = React.useCallback(() => {
    setIsOpen(false);
    setRenderState("closing");
    setActiveIndex(-1);

    // Revert search query on close (only for single-select mode)
    if (!isMulti) {
      if (value) {
        const selectedLabel = items.find((item) => item.value === value)?.label || "";
        setInputValue(selectedLabel);
        setDebouncedQuery(selectedLabel);
      } else {
        setInputValue("");
        setDebouncedQuery("");
      }
    } else {
      setInputValue("");
      setDebouncedQuery("");
    }

    if (animationTimerRef.current) clearTimeout(animationTimerRef.current);
    animationTimerRef.current = setTimeout(() => {
      setRenderState((current) => (current === "closing" ? "closed" : current));
    }, 300); 
  }, [value, items, isMulti]);

  React.useEffect(() => {
    return () => {
      if (animationTimerRef.current) clearTimeout(animationTimerRef.current);
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, []);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        if (isOpen) closeList();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, closeList]);

  React.useEffect(() => {
    if (activeIndex >= 0 && listRef.current && interactionType.current === "keyboard") {
      const activeItem = listRef.current.children[activeIndex] as HTMLLIElement;
      if (activeItem) {
        activeItem.scrollIntoView({ block: "nearest" });
      }
    }
  }, [activeIndex]);

  // Dynamic Horizontal Scroll Gradients Updates
  const updateChipScrollFade = React.useCallback(() => {
    const el = chipScrollRef.current;
    if (!el) return;

    const { scrollLeft, scrollWidth, clientWidth } = el;

    if (leftFadeRef.current) {
      leftFadeRef.current.style.opacity = scrollLeft > 1 ? "1" : "0";
    }
    if (rightFadeRef.current) {
      rightFadeRef.current.style.opacity =
        Math.ceil(scrollLeft + clientWidth) >= scrollWidth - 1 ? "0" : "1";
    }
  }, []);

  // Instant scroll-to-end on chip insertion
  const prevValueLengthRef = React.useRef(0);
  React.useEffect(() => {
    if (!isMulti) return;
    const el = chipScrollRef.current;
    if (!el) return;

    const currentLength = (value as string[])?.length || 0;
    if (currentLength > prevValueLengthRef.current) {
      requestAnimationFrame(() => {
        el.scrollLeft = el.scrollWidth;
      });
    }
    prevValueLengthRef.current = currentLength;
  }, [value, isMulti]);

  // Draggable Scrollbar & Auto Wheel Translation for Chips (with fixed cursor-default)
  React.useEffect(() => {
    const el = chipScrollRef.current;
    if (!el) return;

    let isDown = false;
    let startX: number;
    let scrollLeftVal: number;

    const handleMouseDown = (e: MouseEvent) => {
      isDown = true;
      startX = e.pageX - el.offsetLeft;
      scrollLeftVal = el.scrollLeft;
      document.body.style.userSelect = "none";
    };

    const handleMouseLeaveOrUp = () => {
      if (!isDown) return;
      isDown = false;
      document.body.style.userSelect = "";
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - el.offsetLeft;
      const walk = (x - startX) * 1.5;
      el.scrollLeft = scrollLeftVal - walk;
    };

    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY !== 0) {
        e.preventDefault();
        el.scrollLeft += e.deltaY;
      }
    };

    el.addEventListener("mousedown", handleMouseDown);
    el.addEventListener("mouseleave", handleMouseLeaveOrUp);
    el.addEventListener("mouseup", handleMouseLeaveOrUp);
    el.addEventListener("mousemove", handleMouseMove);
    el.addEventListener("wheel", handleWheel, { passive: false });

    // Initial check for bounds
    updateChipScrollFade();
    el.addEventListener("scroll", updateChipScrollFade);

    const resizeObserver = new ResizeObserver(() => updateChipScrollFade());
    resizeObserver.observe(el);

    return () => {
      el.removeEventListener("mousedown", handleMouseDown);
      el.removeEventListener("mouseleave", handleMouseLeaveOrUp);
      el.removeEventListener("mouseup", handleMouseLeaveOrUp);
      el.removeEventListener("mousemove", handleMouseMove);
      el.removeEventListener("wheel", handleWheel);
      el.removeEventListener("scroll", updateChipScrollFade);
      resizeObserver.disconnect();
      document.body.style.userSelect = "";
    };
  }, [isOpen, value, updateChipScrollFade]);

  const showCreatable =
    isCreatable &&
    inputValue.length > 0 &&
    !items.some((item) => item.label.toLowerCase() === inputValue.toLowerCase());

  const handleSelect = (selectedValue: string) => {
    if (isMulti) {
      const currentValues = (value as string[]) || [];
      const isSelected = currentValues.includes(selectedValue);

      if (isSelected) {
        // Enforce minOptions bounds constraint on chip unselection
        if (typeof minOptions === "number" && currentValues.length <= minOptions) {
          inputRef.current?.focus();
          return;
        }
        const nextValues = currentValues.filter((v) => v !== selectedValue);
        if (onValueChange) onValueChange(nextValues);
      } else {
        // Enforce maxOptions bounds constraint on chip selection
        if (typeof maxOptions === "number" && currentValues.length >= maxOptions) {
          inputRef.current?.focus();
          return;
        }
        const nextValues = [...currentValues, selectedValue];
        if (onValueChange) onValueChange(nextValues);
      }
      
      // Clear input query for subsequent search inputs
      setInputValue("");
      setDebouncedQuery("");
      if (onInputChange) onInputChange("");
    } else {
      if (value === selectedValue) {
        setInputValue("");
        setDebouncedQuery("");
        if (onValueChange) onValueChange("");
      } else {
        const selectedLabel = items.find((item) => item.value === selectedValue)?.label || "";
        setInputValue(selectedLabel);
        setDebouncedQuery(selectedLabel);
        if (onValueChange) onValueChange(selectedValue);
      }
      closeList();
    }

    // Explicitly refocus the input to allow immediate subsequent typing or keyboard navigation
    inputRef.current?.focus();
  };

  const handleCreate = () => {
    if (onCreate && inputValue) onCreate(inputValue);
    if (!isMulti) closeList();

    // Explicitly refocus the input to allow immediate subsequent typing or keyboard navigation
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const totalItems = filteredItems.length + (showCreatable ? 1 : 0);

    // Tab closes the dropdown and lets focus transition naturally
    if (e.key === "Tab") {
      if (isOpen) closeList();
      return;
    }

    if (!isOpen && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      e.preventDefault();
      openList();
      return;
    }

    if (totalItems === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        interactionType.current = "keyboard";
        setActiveIndex((prev) => (prev + 1) % totalItems);
        break;
      case "ArrowUp":
        e.preventDefault();
        interactionType.current = "keyboard";
        setActiveIndex((prev) => (prev - 1 + totalItems) % totalItems);
        break;
      case "Home":
        e.preventDefault();
        interactionType.current = "keyboard";
        setActiveIndex(0);
        break;
      case "End":
        e.preventDefault();
        interactionType.current = "keyboard";
        setActiveIndex(totalItems - 1);
        break;
      case "Enter":
        e.preventDefault();
        if (activeIndex >= 0) {
          if (activeIndex < filteredItems.length) {
            const targetItem = filteredItems[activeIndex];
            const currentValues = isMulti ? ((value as string[]) || []) : [];
            const isSelected = currentValues.includes(targetItem.value);
            const isSelectDisabled = isMulti && !isSelected && typeof maxOptions === "number" && currentValues.length >= maxOptions;
            
            if (!isSelectDisabled) {
              handleSelect(targetItem.value);
            }
          } else if (showCreatable) {
            handleCreate();
          }
        }
        break;
      case "Escape":
        closeList();
        break;
    }
  };

  const handleIconClick = (e: React.MouseEvent) => {
    e.preventDefault();
    inputRef.current?.focus(); 

    if (inputValue.length > 0) {
      handleInputChange("");
      if (!isMulti && onValueChange) onValueChange(""); // Clear single selection on X click
      if (!isOpen) openList(-1);
    } else {
      if (isOpen) closeList();
      else openList();
    }
  };

  const currentIconState = 
    inputValue.length > 0 
      ? "x" 
      : isOpen 
      ? "up" 
      : "down";

  const itemsToRender = renderState === "closing" ? lastFilteredItems : filteredItems;

  const hasChips = isMulti && ((value as string[]) || []).length > 0;
  
  // Dynamically calculate layout heights class to preserve stable inline flow positioning
  const parentHeightClass = hasChips ? "h-[5.25rem]" : "h-11";

  // Check multi-select boundary restrictions for active list options
  const isOptionDisabled = React.useCallback((itemValue: string) => {
    if (!isMulti) return false;
    const currentValues = (value as string[]) || [];
    const isSelected = currentValues.includes(itemValue);
    if (!isSelected && typeof maxOptions === "number" && currentValues.length >= maxOptions) {
      return true;
    }
    return false;
  }, [isMulti, value, maxOptions]);

  const isExpanded = isOpen || renderState === "closing";

  return (
    <div 
      ref={containerRef} 
      className={cn(
        "relative w-full transition-all duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)]", 
        parentHeightClass, 
        className
      )}
    >
      <M3AutocompleteStyles />

      {/* Hidden inputs to support native HTML form submission parameters */}
      {name && (
        isMulti ? (
          ((value as string[]) || []).length > 0 ? (
            ((value as string[]) || []).map((val) => (
              <input key={val} type="hidden" name={name} value={val} />
            ))
          ) : (
            <input type="hidden" name={name} value="" required={required} />
          )
        ) : (
          <input type="hidden" name={name} value={(value as string) || ""} required={required} />
        )
      )}

      {/* Dynamic non-portal unified capsule container with flex-flow flip configurations */}
      <div
        data-state={renderState}
        className={cn(
          "m3-auto-container absolute inset-x-0 flex bg-card overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)]",
          placement === "top" ? "bottom-0 flex-col-reverse" : "top-0 flex-col",
          isExpanded
            ? "z-50 rounded-[1.25rem] border border-border shadow-[0px_16px_32px_rgba(0,0,0,0.14)]"
            : "z-10 rounded-xl border border-input/60 shadow-sm hover:border-input h-full"
        )}
      >
        <div className="relative flex items-center w-full h-11 flex-shrink-0 pl-4 pr-1.5 z-30">
          <input
            ref={inputRef}
            id={id}
            role="combobox"
            aria-expanded={isOpen}
            aria-autocomplete="list"
            aria-controls={listboxId}
            aria-activedescendant={
              activeIndex >= 0 ? getOptionId(activeIndex) : undefined
            }
            aria-label={ariaLabel}
            aria-labelledby={ariaLabelledby}
            value={inputValue}
            onChange={(e) => {
              const val = e.target.value;
              handleInputChange(val);
              const nextActiveIndex = val.length > 0 ? 0 : -1;
              if (!isOpen) {
                openList(nextActiveIndex);
              } else {
                setActiveIndex(nextActiveIndex);
              }
              interactionType.current = "keyboard";
            }}
            onFocus={() => openList()}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            placeholder={placeholder || "Select an option..."}
            autoComplete="off"
            className="flex-1 h-full bg-transparent outline-none text-sm placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
          />

          <button
            ref={btnSurfaceRef}
            type="button"
            tabIndex={-1}
            className="p-1.5 rounded-full z-20 hover:bg-muted/50 transition-all relative overflow-hidden h-8 w-8 flex items-center justify-center flex-shrink-0"
            onClick={handleIconClick}
            disabled={disabled}
            aria-label="Toggle options"
            {...btnEvents}
          >
            <RippleLayer rippleRef={btnRippleRef} pressed={btnPressed} />
            <span className="relative z-10 flex items-center justify-center pointer-events-none">
              <MorphingIcon state={currentIconState} />
            </span>
          </button>
        </div>

        {/* Horizontal removable chips list for multi-select configurations */}
        {isMulti && ((value as string[]) || []).length > 0 && (
          <div className={cn(
            "relative flex items-center justify-between h-10 overflow-hidden flex-shrink-0 border-border/40",
            placement === "top" ? "border-b" : "border-t"
          )}>
            {/* Left Scroll Gradient Fade */}
            <div 
              ref={leftFadeRef}
              className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-card to-transparent pointer-events-none z-20 transition-opacity duration-150 opacity-0"
            />

            {/* Scrollable Track */}
            <div 
              ref={chipScrollRef} 
              className="flex items-center gap-1.5 overflow-x-auto m3-hide-scroll flex-1 min-w-0 h-full py-0.5 pl-4 pr-12 select-none cursor-default"
            >
              {((value as string[]) || []).map((val) => {
                const item = items.find((i) => i.value === val);
                if (!item) return null;
                return (
                  <button
                    key={val}
                    type="button"
                    className="m3-chip-animate group/chip relative flex items-center h-6 px-3 bg-secondary text-secondary-foreground text-xs font-medium rounded-full flex-shrink-0 transition-all duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] overflow-hidden cursor-default select-none"
                    onClick={() => {
                      const currentValues = (value as string[]) || [];
                      // Enforce minOptions bounds constraint on chip removals
                      if (typeof minOptions === "number" && currentValues.length <= minOptions) {
                        return;
                      }
                      const nextValues = currentValues.filter((v) => v !== val);
                      if (onValueChange) onValueChange(nextValues);
                      
                      // Refocus the input after chip removal to ensure typing continues seamlessly
                      inputRef.current?.focus();
                    }}
                  >
                    <span className="truncate max-w-[120px]">
                      {item.label}
                    </span>
                    {/* Floating dismissal X */}
                    <div className="absolute inset-y-0 right-0 w-8 flex items-center justify-end pr-2 bg-gradient-to-l from-secondary via-secondary/90 to-transparent opacity-0 translate-x-2 group-hover/chip:opacity-100 group-hover/chip:translate-x-0 transition-all duration-150 pointer-events-none">
                      <svg
                        viewBox="0 0 24 24"
                        className="w-3 h-3 stroke-current text-muted-foreground"
                        fill="none"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Right Scroll Gradient Fade */}
            <div 
              ref={rightFadeRef}
              className="absolute right-[60px] top-0 bottom-0 w-12 bg-gradient-to-l from-card to-transparent pointer-events-none z-20 transition-opacity duration-150 opacity-0"
            />

            {/* Clear button */}
            {(!minOptions || minOptions === 0) && (
              <button
                ref={clearSurfaceRef}
                type="button"
                onClick={() => {
                  if (onValueChange) onValueChange([]);
                  inputRef.current?.focus();
                }}
                className="px-3 h-8 rounded-full text-[10px] font-bold uppercase tracking-wider text-muted-foreground hover:bg-muted/50 transition-all relative overflow-hidden flex-shrink-0 flex items-center justify-center mr-1.5 cursor-default z-30"
                {...clearEvents}
              >
                <RippleLayer rippleRef={clearRippleRef} pressed={clearPressed} />
                <span className="relative">Clear</span>
              </button>
            )}
          </div>
        )}

        <div
          className={cn(
            "grid transition-[grid-template-rows,opacity] duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] relative z-10",
            isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
          )}
          onMouseDown={(e) => {
            // Prevents any mouse interactions inside the dropdown container from triggering a blur on the input
            e.preventDefault();
          }}
        >
          <div className="overflow-hidden">
            {renderState !== "closed" && (
              <div className="flex flex-col w-full">
                <CustomFloatingScrollArea 
                  viewportRef={scrollViewportRef} 
                  style={{ maxHeight: `${maxHeight}px` }}
                  className="w-full"
                >
                  <ul 
                    ref={listRef} 
                    id={listboxId}
                    role="listbox"
                    aria-multiselectable={isMulti}
                    className="w-full text-popover-foreground outline-none pb-2 pt-1"
                  >
                    {loading ? (
                      <li className="m3-auto-item p-6 flex flex-col items-center justify-center gap-2 text-xs text-muted-foreground">
                        <svg className="animate-spin h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3.5"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span className="font-medium tracking-wide">Loading results...</span>
                      </li>
                    ) : itemsToRender.length === 0 && !showCreatable ? (
                      <li className="m3-auto-item p-4 px-4 text-sm text-center text-muted-foreground">
                        {emptyMessage}
                      </li>
                    ) : (
                      <>
                        {itemsToRender.map((item, index) => {
                          const isDisabled = isOptionDisabled(item.value);
                          const isSelected = isMulti
                            ? (value as string[])?.includes(item.value)
                            : value === item.value;
                          return (
                            <M3AutocompleteItem
                              key={item.value}
                              id={getOptionId(index)}
                              isActive={activeIndex === index}
                              isSelected={isSelected}
                              onSelectAction={() => {
                                if (!isDisabled) handleSelect(item.value);
                              }}
                              onMouseMove={(e) => {
                                if (e.movementX === 0 && e.movementY === 0) return;
                                interactionType.current = "mouse";
                                if (activeIndex !== index) setActiveIndex(index);
                              }}
                              className={cn(
                                isDisabled && "opacity-40 cursor-not-allowed pointer-events-none"
                              )}
                            >
                              {isSelected && (
                                <CustomCheckIcon className="mr-3 flex-shrink-0 text-primary" />
                              )}
                              <div className="flex flex-col w-full">
                                <span className="whitespace-normal break-words font-medium">{item.label}</span>
                                {(item.description || item.tag) && (
                                  <div className="flex justify-between items-center text-[11px] font-medium text-muted-foreground/70 w-full mt-0.5 gap-4">
                                    <span className="truncate uppercase tracking-wider">{item.description}</span>
                                    <span className="truncate">{item.tag}</span>
                                  </div>
                                )}
                              </div>
                            </M3AutocompleteItem>
                          );
                        })}

                        {showCreatable && (
                          <M3AutocompleteItem
                            id={getOptionId(filteredItems.length)}
                            isActive={activeIndex === filteredItems.length}
                            isSelected={false}
                            onSelectAction={handleCreate}
                            onMouseMove={(e) => {
                              if (e.movementX === 0 && e.movementY === 0) return;
                              interactionType.current = "mouse";
                              if (activeIndex !== filteredItems.length) setActiveIndex(filteredItems.length);
                            }}
                            className="text-primary/90 font-medium border-t border-border/40"
                          >
                            <CustomPlusIcon className="mr-3 flex-shrink-0" />
                            <span>Create "{inputValue}"</span>
                          </M3AutocompleteItem>
                        )}
                      </>
                    )}
                  </ul>
                </CustomFloatingScrollArea>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}