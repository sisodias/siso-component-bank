"use client";

import { useRef, useEffect, useState, useCallback, createContext, useContext, forwardRef, type ReactNode, type HTMLAttributes, type TdHTMLAttributes, type ThHTMLAttributes, type RefObject } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: (string | undefined | null | false | Record<string, boolean>)[]) {
  return twMerge(clsx(inputs));
}

const springs = { fast: { type: "spring" as const, duration: 0.08, bounce: 0 } };
const fontWeights = { normal: "'wght' 400", semibold: "'wght' 550" };

// ─── useProximityHover (inlined) ─────────────────────────────────────────────

interface ItemRect { top: number; height: number; left: number; width: number; }

function useProximityHover<T extends HTMLElement>(containerRef: RefObject<T | null>) {
  const itemsRef = useRef(new Map<number, HTMLElement>());
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [itemRects, setItemRects] = useState<ItemRect[]>([]);
  const itemRectsRef = useRef<ItemRect[]>([]);
  const sessionRef = useRef(0);
  const rafIdRef = useRef<number | null>(null);

  const registerItem = useCallback((index: number, element: HTMLElement | null) => {
    if (element) itemsRef.current.set(index, element);
    else itemsRef.current.delete(index);
  }, []);

  const measureItems = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const cr = container.getBoundingClientRect();
    const rects: ItemRect[] = [];
    itemsRef.current.forEach((el, index) => {
      const r = el.getBoundingClientRect();
      rects[index] = { top: r.top - cr.top + container.scrollTop - container.clientTop, height: r.height, left: r.left - cr.left + container.scrollLeft - container.clientLeft, width: r.width };
    });
    itemRectsRef.current = rects;
    setItemRects(rects);
  }, [containerRef]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const mouseY = e.clientY;
    if (rafIdRef.current !== null) cancelAnimationFrame(rafIdRef.current);
    rafIdRef.current = requestAnimationFrame(() => {
      rafIdRef.current = null;
      const container = containerRef.current;
      if (!container) return;
      const cr = container.getBoundingClientRect();
      let closestIndex: number | null = null; let closestDistance = Infinity;
      const rects = itemRectsRef.current;
      for (let i = 0; i < rects.length; i++) {
        const r = rects[i]; if (!r) continue;
        const start = cr.top + container.clientTop + r.top - container.scrollTop;
        const dist = Math.abs(mouseY - (start + r.height / 2));
        if (dist < closestDistance) { closestDistance = dist; closestIndex = i; }
      }
      setActiveIndex(closestIndex);
    });
  }, [containerRef]);

  const handleMouseEnter = useCallback(() => { sessionRef.current += 1; }, []);
  const handleMouseLeave = useCallback(() => {
    if (rafIdRef.current !== null) { cancelAnimationFrame(rafIdRef.current); rafIdRef.current = null; }
    setActiveIndex(null);
  }, []);

  useEffect(() => { return () => { if (rafIdRef.current !== null) cancelAnimationFrame(rafIdRef.current); }; }, []);

  return { activeIndex, itemRects, sessionRef, handlers: { onMouseMove: handleMouseMove, onMouseEnter: handleMouseEnter, onMouseLeave: handleMouseLeave }, registerItem, measureItems };
}

// ─── Table Context ──────────────────────────────────────────────────────────

interface TableContextValue {
  registerItem: (index: number, element: HTMLElement | null) => void;
  activeIndex: number | null;
}

const TableContext = createContext<TableContextValue | null>(null);

// ─── Table ──────────────────────────────────────────────────────────────────

interface TableProps extends HTMLAttributes<HTMLTableElement> {
  children: ReactNode;
}

const Table = forwardRef<HTMLTableElement, TableProps>(
  ({ children, className, ...props }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { activeIndex, itemRects, sessionRef, handlers, registerItem, measureItems } = useProximityHover(containerRef);

    useEffect(() => { measureItems(); }, [measureItems, children]);

    const activeRect = activeIndex !== null ? itemRects[activeIndex] : null;

    return (
      <TableContext.Provider value={{ registerItem, activeIndex }}>
        <div ref={containerRef} className="relative overflow-x-auto" onMouseEnter={handlers.onMouseEnter} onMouseMove={handlers.onMouseMove} onMouseLeave={handlers.onMouseLeave}>
          <AnimatePresence>
            {activeRect && (
              <motion.div
                key={sessionRef.current}
                className="absolute bg-neutral-200/40 dark:bg-neutral-800/25 pointer-events-none z-0"
                initial={{ opacity: 0, top: activeRect.top, left: activeRect.left, width: activeRect.width, height: activeRect.height }}
                animate={{ opacity: 1, top: activeRect.top, left: activeRect.left, width: activeRect.width, height: activeRect.height }}
                exit={{ opacity: 0, transition: { duration: 0.06 } }}
                transition={{ ...springs.fast, opacity: { duration: 0.08 } }}
              />
            )}
          </AnimatePresence>
          <table ref={ref} className={cn("w-full text-[13px] border-collapse relative", className)} {...props}>
            {children}
          </table>
        </div>
      </TableContext.Provider>
    );
  }
);

Table.displayName = "Table";

// ─── TableHeader ────────────────────────────────────────────────────────────

const TableHeader = forwardRef<HTMLTableSectionElement, HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => <thead ref={ref} className={cn("", className)} {...props} />
);
TableHeader.displayName = "TableHeader";

// ─── TableBody ───────────────────────────────────────────────────────────────

const TableBody = forwardRef<HTMLTableSectionElement, HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => <tbody ref={ref} className={cn("", className)} {...props} />
);
TableBody.displayName = "TableBody";

// ─── TableRow ────────────────────────────────────────────────────────────────

interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {
  index?: number;
}

const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ index, className, style, ...props }, ref) => {
    const internalRef = useRef<HTMLTableRowElement>(null);
    const ctx = useContext(TableContext);

    useEffect(() => {
      if (index === undefined || !ctx) return;
      ctx.registerItem(index, internalRef.current);
      return () => ctx.registerItem(index, null);
    }, [index, ctx]);

    const isBodyRow = index !== undefined;
    const activeIdx = ctx?.activeIndex ?? null;
    const hideBorder = activeIdx !== null && ((isBodyRow && (index === activeIdx || index === activeIdx - 1)) || (!isBodyRow && activeIdx === 0));

    return (
      <tr
        ref={(node) => {
          (internalRef as React.MutableRefObject<HTMLTableRowElement | null>).current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) (ref as React.MutableRefObject<HTMLTableRowElement | null>).current = node;
        }}
        data-proximity-index={index}
        className={cn("group/row relative z-10 border-b transition-[border-color] duration-80", hideBorder ? "border-transparent" : "border-border/40", isBodyRow && activeIdx === index && "is-active", className)}
        style={{ ...style, fontVariationSettings: isBodyRow ? fontWeights.normal : fontWeights.semibold }}
        {...props}
      />
    );
  }
);

TableRow.displayName = "TableRow";

// ─── TableHead ───────────────────────────────────────────────────────────────

const TableHead = forwardRef<HTMLTableCellElement, ThHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => <th ref={ref} className={cn("px-3 py-2 text-left text-foreground", className)} {...props} />
);
TableHead.displayName = "TableHead";

// ─── TableCell ───────────────────────────────────────────────────────────────

const TableCell = forwardRef<HTMLTableCellElement, TdHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => <td ref={ref} className={cn("px-3 py-2 text-muted-foreground transition-colors duration-80 group-[.is-active]/row:text-foreground", className)} {...props} />
);
TableCell.displayName = "TableCell";

export { Table, TableHeader, TableBody, TableRow, TableHead, TableCell };
