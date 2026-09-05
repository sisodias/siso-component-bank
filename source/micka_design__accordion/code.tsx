"use client";

import {
  useRef,
  useState,
  useEffect,
  useCallback,
  createContext,
  useContext,
  forwardRef,
  type ReactNode,
  type HTMLAttributes,
  type RefObject,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronRight } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: (string | undefined | null | false | Record<string, boolean>)[]) {
  return twMerge(clsx(inputs));
}

const springs = {
  fast: { type: "spring" as const, duration: 0.08, bounce: 0 },
  moderate: { type: "spring" as const, duration: 0.16, bounce: 0.15 },
  slow: { type: "spring" as const, duration: 0.24, bounce: 0.15 },
};

const fontWeights = {
  normal: "'wght' 400",
  medium: "'wght' 450",
  semibold: "'wght' 550",
  bold: "'wght' 700",
};

const shape = {
  bg: "rounded-[20px]",
  item: "rounded-[20px]",
  focusRing: "rounded-[20px]",
};

// ─── useProximityHover (inlined) ─────────────────────────────────────────────

interface ItemRect {
  top: number;
  height: number;
  left: number;
  width: number;
}

interface UseProximityHoverReturn {
  activeIndex: number | null;
  setActiveIndex: (index: number | null) => void;
  itemRects: ItemRect[];
  sessionRef: RefObject<number>;
  handlers: {
    onMouseMove: (e: React.MouseEvent) => void;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
  };
  registerItem: (index: number, element: HTMLElement | null) => void;
  measureItems: () => void;
}

function useProximityHover<T extends HTMLElement>(
  containerRef: RefObject<T | null>,
  options: { axis?: "x" | "y" } = {}
): UseProximityHoverReturn {
  const { axis = "y" } = options;
  const itemsRef = useRef(new Map<number, HTMLElement>());
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [itemRects, setItemRects] = useState<ItemRect[]>([]);
  const itemRectsRef = useRef<ItemRect[]>([]);
  const sessionRef = useRef(0);
  const rafIdRef = useRef<number | null>(null);

  const registerItem = useCallback(
    (index: number, element: HTMLElement | null) => {
      if (element) itemsRef.current.set(index, element);
      else itemsRef.current.delete(index);
    },
    []
  );

  const measureItems = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const containerRect = container.getBoundingClientRect();
    const scrollTop = container.scrollTop;
    const scrollLeft = container.scrollLeft;
    const borderTop = container.clientTop;
    const borderLeft = container.clientLeft;
    const rects: ItemRect[] = [];
    itemsRef.current.forEach((element, index) => {
      const rect = element.getBoundingClientRect();
      rects[index] = {
        top: rect.top - containerRect.top + scrollTop - borderTop,
        height: rect.height,
        left: rect.left - containerRect.left + scrollLeft - borderLeft,
        width: rect.width,
      };
    });
    itemRectsRef.current = rects;
    setItemRects(rects);
  }, [containerRef]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const mouseX = e.clientX;
      const mouseY = e.clientY;
      if (rafIdRef.current !== null) cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = requestAnimationFrame(() => {
        rafIdRef.current = null;
        const container = containerRef.current;
        if (!container) return;
        const containerRect = container.getBoundingClientRect();
        const mousePos = axis === "x" ? mouseX : mouseY;
        let closestIndex: number | null = null;
        let closestDistance = Infinity;
        let containingIndex: number | null = null;
        const rects = itemRectsRef.current;
        const scrollOffset = axis === "x" ? container.scrollLeft : container.scrollTop;
        const borderOffset = axis === "x" ? container.clientLeft : container.clientTop;
        const containerEdge = axis === "x" ? containerRect.left : containerRect.top;
        for (let index = 0; index < rects.length; index++) {
          const r = rects[index];
          if (!r) continue;
          const contentPos = axis === "x" ? r.left : r.top;
          const itemStart = containerEdge + borderOffset + contentPos - scrollOffset;
          const itemSize = axis === "x" ? r.width : r.height;
          const itemEnd = itemStart + itemSize;
          if (mousePos >= itemStart && mousePos <= itemEnd) containingIndex = index;
          const itemCenter = itemStart + itemSize / 2;
          const distance = Math.abs(mousePos - itemCenter);
          if (distance < closestDistance) { closestDistance = distance; closestIndex = index; }
        }
        setActiveIndex(containingIndex ?? closestIndex);
      });
    },
    [axis, containerRef]
  );

  const handleMouseEnter = useCallback(() => { sessionRef.current += 1; }, []);
  const handleMouseLeave = useCallback(() => {
    if (rafIdRef.current !== null) { cancelAnimationFrame(rafIdRef.current); rafIdRef.current = null; }
    setActiveIndex(null);
  }, []);

  useEffect(() => {
    return () => { if (rafIdRef.current !== null) cancelAnimationFrame(rafIdRef.current); };
  }, []);

  return {
    activeIndex, setActiveIndex, itemRects, sessionRef,
    handlers: { onMouseMove: handleMouseMove, onMouseEnter: handleMouseEnter, onMouseLeave: handleMouseLeave },
    registerItem, measureItems,
  };
}

// ─── Contexts ────────────────────────────────────────────────────────────────

interface AccordionGroupContextValue {
  registerItem: (index: number, element: HTMLElement | null) => void;
  registerFullItem: (index: number, element: HTMLElement | null) => void;
  activeIndex: number | null;
  grouped: true;
  remeasure: () => void;
  openValues: Set<string>;
  openItemRects: Map<number, ItemRect>;
  toggleValue: (value: string) => void;
}

const AccordionGroupContext = createContext<AccordionGroupContextValue | null>(null);
function useAccordionGroup() { return useContext(AccordionGroupContext); }

interface AccordionItemContextValue {
  index?: number;
  value: string;
  isOpen: boolean;
  onToggle: () => void;
}

const AccordionItemContext = createContext<AccordionItemContextValue | null>(null);
function useAccordionItemContext() {
  const ctx = useContext(AccordionItemContext);
  if (!ctx) throw new Error("AccordionTrigger/AccordionContent must be used within an AccordionItem");
  return ctx;
}

// ─── AccordionGroup ──────────────────────────────────────────────────────────

type AccordionGroupSingleProps = {
  type?: "single";
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  collapsible?: boolean;
};

type AccordionGroupMultipleProps = {
  type: "multiple";
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
};

type AccordionGroupProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
} & (AccordionGroupSingleProps | AccordionGroupMultipleProps);

const AccordionGroup = forwardRef<HTMLDivElement, AccordionGroupProps>(
  (props, ref) => {
    const { children, type = "single", className, ...rest } = props;
    const containerRef = useRef<HTMLDivElement>(null);
    const fullItemElementsRef = useRef<Map<number, HTMLElement>>(new Map());
    const [openItemRects, setOpenItemRects] = useState<Map<number, ItemRect>>(new Map());

    const { activeIndex, setActiveIndex, itemRects, sessionRef, handlers, registerItem, measureItems } =
      useProximityHover(containerRef);

    const registerFullItem = useCallback((index: number, element: HTMLElement | null) => {
      if (element) fullItemElementsRef.current.set(index, element);
      else fullItemElementsRef.current.delete(index);
    }, []);

    const measureFullItems = useCallback(() => {
      if (!containerRef.current) return;
      const containerRect = containerRef.current.getBoundingClientRect();
      const next = new Map<number, ItemRect>();
      fullItemElementsRef.current.forEach((el, idx) => {
        const r = el.getBoundingClientRect();
        next.set(idx, { top: r.top - containerRect.top, left: r.left - containerRect.left, width: r.width, height: r.height });
      });
      setOpenItemRects(next);
    }, []);

    const [internalSingleValue, setInternalSingleValue] = useState<string>(() => {
      if (type === "single") return (props as AccordionGroupSingleProps).defaultValue ?? "";
      return "";
    });
    const [internalMultipleValue, setInternalMultipleValue] = useState<string[]>(() => {
      if (type === "multiple") return (props as AccordionGroupMultipleProps).defaultValue ?? [];
      return [];
    });

    const openValues = new Set<string>(
      type === "multiple"
        ? (props as AccordionGroupMultipleProps).value ?? internalMultipleValue
        : (() => { const v = (props as AccordionGroupSingleProps).value ?? internalSingleValue; return v ? [v] : []; })()
    );

    const handleSingleValueChange = useCallback(
      (value: string) => {
        const sp = props as AccordionGroupSingleProps;
        if (sp.onValueChange) sp.onValueChange(value);
        else setInternalSingleValue(value);
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [(props as AccordionGroupSingleProps).onValueChange]
    );

    const handleMultipleValueChange = useCallback(
      (value: string[]) => {
        const mp = props as AccordionGroupMultipleProps;
        if (mp.onValueChange) mp.onValueChange(value);
        else setInternalMultipleValue(value);
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [(props as AccordionGroupMultipleProps).onValueChange]
    );

    const toggleValue = useCallback(
      (val: string) => {
        if (type === "multiple") {
          const current = (props as AccordionGroupMultipleProps).value ?? internalMultipleValue;
          handleMultipleValueChange(current.filter((v) => v !== val));
        } else {
          handleSingleValueChange("");
        }
      },
      [type, handleSingleValueChange, handleMultipleValueChange, internalMultipleValue,
        // eslint-disable-next-line react-hooks/exhaustive-deps
        (props as AccordionGroupMultipleProps).value]
    );

    useEffect(() => { measureItems(); measureFullItems(); }, [measureItems, measureFullItems, children]);
    useEffect(() => { measureItems(); measureFullItems();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [[...openValues].join(","), measureItems, measureFullItems]);

    const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
    const activeRect = activeIndex !== null ? itemRects[activeIndex] : null;
    const focusRect = focusedIndex !== null ? itemRects[focusedIndex] : null;
    const isHoveringNonOpen = activeIndex !== null && !openItemRects.has(activeIndex);

    const {
      value: _value, defaultValue: _defaultValue, onValueChange: _onValueChange,
      collapsible: _collapsible, type: _type, ...htmlProps
    } = rest as Record<string, unknown>;

    const radixProps = type === "multiple"
      ? { type: "multiple" as const, value: (props as AccordionGroupMultipleProps).value ?? internalMultipleValue, onValueChange: handleMultipleValueChange }
      : { type: "single" as const, collapsible: (props as AccordionGroupSingleProps).collapsible ?? true, value: (props as AccordionGroupSingleProps).value ?? internalSingleValue, onValueChange: handleSingleValueChange };

    return (
      <AccordionGroupContext.Provider value={{ registerItem, registerFullItem, activeIndex, grouped: true, remeasure: () => { measureItems(); measureFullItems(); }, openValues, openItemRects, toggleValue }}>
        <AccordionPrimitive.Root {...radixProps} asChild>
          <div
            ref={(node) => {
              (containerRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
              if (typeof ref === "function") ref(node);
              else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
            }}
            onMouseEnter={handlers.onMouseEnter}
            onMouseMove={handlers.onMouseMove}
            onMouseLeave={handlers.onMouseLeave}
            onFocus={(e) => {
              const indexAttr = (e.target as HTMLElement).closest("[data-proximity-index]")?.getAttribute("data-proximity-index");
              if (indexAttr != null) {
                const idx = Number(indexAttr);
                setActiveIndex(idx);
                setFocusedIndex((e.target as HTMLElement).matches(":focus-visible") ? idx : null);
              }
            }}
            onBlur={(e) => {
              if (containerRef.current?.contains(e.relatedTarget as Node)) return;
              setFocusedIndex(null);
              setActiveIndex(null);
            }}
            className={cn("relative flex flex-col gap-0.5 w-72 max-w-full select-none", className)}
            {...(htmlProps as HTMLAttributes<HTMLDivElement>)}
          >
            {/* Expanded item backgrounds */}
            <AnimatePresence>
              {[...openItemRects.entries()].map(([idx, rect]) => (
                <motion.div
                  key={`expanded-${idx}`}
                  className={`absolute ${shape.bg} bg-accent/20 dark:bg-accent/12 pointer-events-none`}
                  initial={false}
                  animate={{ top: rect.top, left: rect.left, width: rect.width, height: rect.height, opacity: isHoveringNonOpen ? 0.7 : 1 }}
                  exit={{ opacity: 0, transition: { duration: 0.12 } }}
                  transition={{ ...springs.moderate, opacity: { duration: 0.08 } }}
                />
              ))}
            </AnimatePresence>

            {/* Hover background */}
            <AnimatePresence>
              {activeRect && (
                <motion.div
                  key={sessionRef.current}
                  className={`absolute ${shape.bg} bg-accent/40 dark:bg-accent/25 pointer-events-none`}
                  initial={{ opacity: 0, top: activeRect.top, left: activeRect.left, width: activeRect.width, height: activeRect.height }}
                  animate={{ opacity: 1, top: activeRect.top, left: activeRect.left, width: activeRect.width, height: activeRect.height }}
                  exit={{ opacity: 0, transition: { duration: 0.06 } }}
                  transition={{ ...springs.fast, opacity: { duration: 0.08 } }}
                />
              )}
            </AnimatePresence>

            {/* Focus ring */}
            <AnimatePresence>
              {focusRect && (
                <motion.div
                  className={`absolute ${shape.focusRing} pointer-events-none z-20 border border-[#6B97FF]`}
                  initial={false}
                  animate={{ left: focusRect.left - 2, top: focusRect.top - 2, width: focusRect.width + 4, height: focusRect.height + 4 }}
                  exit={{ opacity: 0, transition: { duration: 0.06 } }}
                  transition={{ ...springs.fast, opacity: { duration: 0.08 } }}
                />
              )}
            </AnimatePresence>

            {children}
          </div>
        </AccordionPrimitive.Root>
      </AccordionGroupContext.Provider>
    );
  }
);

AccordionGroup.displayName = "AccordionGroup";

// ─── Accordion (Standalone) ──────────────────────────────────────────────────

interface AccordionProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  type?: "single" | "multiple";
  collapsible?: boolean;
  defaultValue?: string | string[];
  value?: string | string[];
  onValueChange?: ((value: string) => void) | ((value: string[]) => void);
}

const Accordion = forwardRef<HTMLDivElement, AccordionProps>(
  ({ children, type = "single", collapsible = true, defaultValue, value, onValueChange, className, ...props }, ref) => {
    const [internalSingleValue, setInternalSingleValue] = useState<string>(() => {
      if (type === "single") return (defaultValue as string) ?? "";
      return "";
    });
    const [internalMultipleValue, setInternalMultipleValue] = useState<string[]>(() => {
      if (type === "multiple") return (defaultValue as string[]) ?? [];
      return [];
    });

    const openValues = new Set<string>(
      type === "multiple"
        ? (value as string[] | undefined) ?? internalMultipleValue
        : (() => { const v = (value as string | undefined) ?? internalSingleValue; return v ? [v] : []; })()
    );

    const handleSingleChange = useCallback((v: string) => {
      if (onValueChange) (onValueChange as (v: string) => void)(v);
      else setInternalSingleValue(v);
    }, [onValueChange]);

    const handleMultipleChange = useCallback((v: string[]) => {
      if (onValueChange) (onValueChange as (v: string[]) => void)(v);
      else setInternalMultipleValue(v);
    }, [onValueChange]);

    const standaloneToggle = useCallback((val: string) => {
      if (type === "multiple") {
        const current = (value as string[] | undefined) ?? internalMultipleValue;
        handleMultipleChange(current.filter((v) => v !== val));
      } else {
        handleSingleChange("");
      }
    }, [type, value, internalMultipleValue, handleSingleChange, handleMultipleChange]);

    const radixProps = type === "multiple"
      ? { type: "multiple" as const, value: (value as string[] | undefined) ?? internalMultipleValue, defaultValue: defaultValue as string[] | undefined, onValueChange: handleMultipleChange }
      : { type: "single" as const, collapsible, value: (value as string | undefined) ?? internalSingleValue, defaultValue: defaultValue as string | undefined, onValueChange: handleSingleChange };

    return (
      <AccordionPrimitive.Root {...radixProps} asChild>
        <div ref={ref} className={cn("w-72 max-w-full flex flex-col gap-0.5", className)} {...props}>
          <StandaloneOpenContext.Provider value={openValues}>
            <StandaloneToggleContext.Provider value={standaloneToggle}>
              {children}
            </StandaloneToggleContext.Provider>
          </StandaloneOpenContext.Provider>
        </div>
      </AccordionPrimitive.Root>
    );
  }
);

Accordion.displayName = "Accordion";

const StandaloneOpenContext = createContext<Set<string>>(new Set());
const StandaloneToggleContext = createContext<(value: string) => void>(() => {});

// ─── AccordionItem ───────────────────────────────────────────────────────────

interface AccordionItemProps extends HTMLAttributes<HTMLDivElement> {
  value: string;
  index?: number;
  disabled?: boolean;
  children: ReactNode;
}

const AccordionItem = forwardRef<HTMLDivElement, AccordionItemProps>(
  ({ value, index, disabled, children, className, ...props }, ref) => {
    const internalRef = useRef<HTMLDivElement>(null);
    const groupCtx = useAccordionGroup();
    const standaloneOpen = useContext(StandaloneOpenContext);
    const standaloneToggle = useContext(StandaloneToggleContext);

    const isOpen = groupCtx?.grouped ? groupCtx.openValues.has(value) : standaloneOpen.has(value);
    const onToggle = useCallback(() => {
      if (groupCtx?.grouped) groupCtx.toggleValue(value);
      else standaloneToggle(value);
    }, [groupCtx, standaloneToggle, value]);

    useEffect(() => {
      if (groupCtx?.grouped && index !== undefined) {
        groupCtx.registerItem(index, internalRef.current);
        return () => groupCtx.registerItem(index, null);
      }
    }, [index, groupCtx]);

    useEffect(() => {
      if (groupCtx?.grouped && index !== undefined) {
        if (isOpen) groupCtx.registerFullItem(index, internalRef.current);
        else groupCtx.registerFullItem(index, null);
        return () => groupCtx.registerFullItem(index, null);
      }
    }, [index, groupCtx, isOpen]);

    return (
      <AccordionItemContext.Provider value={{ index, value, isOpen, onToggle }}>
        <AccordionPrimitive.Item
          ref={(node) => {
            (internalRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
            if (typeof ref === "function") ref(node);
            else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
          }}
          value={value}
          disabled={disabled}
          data-proximity-index={index}
          className={cn("relative", className)}
          {...props}
        >
          {/* Standalone expanded background */}
          {!groupCtx?.grouped && (
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  className={`absolute inset-0 ${shape.bg} bg-accent/20 dark:bg-accent/12 pointer-events-none`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, transition: { duration: 0.06 } }}
                  transition={{ duration: 0.08 }}
                />
              )}
            </AnimatePresence>
          )}
          {children}
        </AccordionPrimitive.Item>
      </AccordionItemContext.Provider>
    );
  }
);

AccordionItem.displayName = "AccordionItem";

// ─── AccordionTrigger ────────────────────────────────────────────────────────

interface AccordionTriggerProps extends HTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

const AccordionTrigger = forwardRef<HTMLButtonElement, AccordionTriggerProps>(
  ({ children, className, ...props }, ref) => {
    const groupCtx = useAccordionGroup();
    const { index, isOpen } = useAccordionItemContext();
    const [isHovered, setIsHovered] = useState(false);

    const isActive = groupCtx?.grouped ? groupCtx.activeIndex === index : isHovered;

    const triggerContent = (
      <AccordionPrimitive.Header asChild>
        <div>
          <AccordionPrimitive.Trigger
            ref={ref}
            className={cn(
              `relative z-10 flex items-center gap-2.5 ${shape.item} px-3 py-2 w-full cursor-pointer outline-none`,
              !groupCtx?.grouped && "focus-visible:ring-1 focus-visible:ring-[#6B97FF] focus-visible:ring-offset-0",
              className
            )}
            {...(props as React.ComponentProps<typeof AccordionPrimitive.Trigger>)}
          >
            <span className="inline-grid text-[13px] flex-1 text-left">
              <span className="col-start-1 row-start-1 invisible" style={{ fontVariationSettings: fontWeights.semibold }} aria-hidden="true">
                {children}
              </span>
              <span
                className={cn("col-start-1 row-start-1 transition-[color,font-variation-settings] duration-80", isOpen || isActive ? "text-foreground" : "text-muted-foreground")}
                style={{ fontVariationSettings: isOpen ? fontWeights.semibold : fontWeights.normal }}
              >
                {children}
              </span>
            </span>
            <motion.span className="shrink-0 inline-flex items-center justify-center" animate={{ rotate: isOpen ? 90 : 0 }} transition={springs.fast}>
              <ChevronRight size={16} strokeWidth={isOpen || isActive ? 2 : 1.5} className={cn("transition-[color,stroke-width] duration-80", isOpen || isActive ? "text-foreground" : "text-muted-foreground")} />
            </motion.span>
          </AccordionPrimitive.Trigger>
        </div>
      </AccordionPrimitive.Header>
    );

    if (groupCtx?.grouped) return triggerContent;

    return (
      <div className="relative" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
        <AnimatePresence>
          {isHovered && (
            <motion.div
              className={`absolute inset-0 ${shape.bg} bg-accent/40 dark:bg-accent/25 pointer-events-none`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.06 } }}
              transition={{ duration: 0.08 }}
            />
          )}
        </AnimatePresence>
        {triggerContent}
      </div>
    );
  }
);

AccordionTrigger.displayName = "AccordionTrigger";

// ─── AccordionContent ────────────────────────────────────────────────────────

interface AccordionContentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

const AccordionContent = forwardRef<HTMLDivElement, AccordionContentProps>(
  ({ children, className, ...props }, ref) => {
    const groupCtx = useAccordionGroup();
    const { isOpen, onToggle } = useAccordionItemContext();

    return (
      <AnimatePresence initial={false}>
        {isOpen && (
          <AccordionPrimitive.Content forceMount asChild {...props}>
            <motion.div
              ref={ref}
              className={cn("overflow-hidden cursor-pointer", className)}
              onClick={onToggle}
              initial={{ height: 0 }}
              animate={{ height: "auto" }}
              exit={{ height: 0 }}
              transition={springs.moderate}
              onUpdate={() => { groupCtx?.remeasure(); }}
              onAnimationComplete={() => { groupCtx?.remeasure(); }}
            >
              <div className="px-3 pb-3 pt-1 text-[13px] text-muted-foreground">
                {children}
              </div>
            </motion.div>
          </AccordionPrimitive.Content>
        )}
      </AnimatePresence>
    );
  }
);

AccordionContent.displayName = "AccordionContent";

export { Accordion, AccordionGroup, AccordionItem, AccordionTrigger, AccordionContent };
export default Accordion;
