import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, LayoutGroup, motion, useSpring } from "framer-motion";

/* Types */
export type StripeItem = {
  id: string;
  title: string;
  brand: string;
  activeBg?: string;
  activeText?: string;
  accent?: string;
};
export type StripeMenuProps = {
  items: StripeItem[];
  initialIndex?: number;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  closeOnEnter?: boolean;
  onChange?: (i: number, item: StripeItem) => void;
  onEnter?: (i: number, item: StripeItem) => void;
  rowHeight?: number;
  rowHeightActive?: number;
  fontFamily?: string;
  showIndices?: boolean;
  showScope?: boolean;
  paperColor?: string;
  lineColor?: string;
  inkColor?: string;
  brandLabel?: React.ReactNode;
  menuIcon?: React.ReactNode;
  closeIcon?: React.ReactNode;
  closedContent?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
};

/* Utils */
const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(n, max));
const useWheelSnap = (enabled: boolean, onDelta: (dir: 1 | -1) => void) => {
  const lock = useRef(false);
  useEffect(() => {
    if (!enabled) return;
    const onWheel = (e: WheelEvent) => {
      if (lock.current) return;
      if (Math.abs(e.deltaY) < 6) return;
      lock.current = true;
      onDelta(e.deltaY > 0 ? 1 : -1);
      setTimeout(() => (lock.current = false), 260);
    };
    window.addEventListener("wheel", onWheel, { passive: true });
    return () => window.removeEventListener("wheel", onWheel);
  }, [enabled, onDelta]);
};
const useKeyNav = (enabled: boolean, onDir: (dir: 1 | -1) => void) => {
  useEffect(() => {
    if (!enabled) return;
    const onKey = (e: KeyboardEvent) => {
      if (["ArrowDown", "ArrowRight"].includes(e.key)) onDir(1);
      if (["ArrowUp", "ArrowLeft"].includes(e.key)) onDir(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [enabled, onDir]);
};

/* Icons */
const MenuIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);
const CloseIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M6 6l12 12M18 6l-12 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

/* Row component */
type RowProps = {
  item: StripeItem;
  index: number;
  active: boolean;
  onEnter: () => void;
  h: number;
  hActive: number;
  showIndices: boolean;
  showScope: boolean;
};
const StripeRow: React.FC<RowProps> = ({ item, index, active, onEnter, h, hActive, showIndices, showScope }) => {
  const height = active ? hActive : h;
  const ls = useSpring(active ? -0.02 : -0.005, { stiffness: 280, damping: 26 });
  const sy = useSpring(active ? 1.02 : 1, { stiffness: 220, damping: 20 });
  const activeBg = item.activeBg ?? "#1F2123";
  const activeText = item.activeText ?? "#F0EFEA";

  return (
    <motion.button
      className={`stripe ${active ? "active" : ""}`}
      onClick={onEnter}
      whileTap={{ scale: 0.995 }}
      aria-current={active ? "true" : undefined}
      style={
        {
          "--active-bg": activeBg,
          "--active-text": activeText,
          "--accent": item.accent ?? "#9B5CFF",
        } as React.CSSProperties
      }
    >
      <motion.div className="stripe-inner" layout style={{ height }}>
        <div className="stripe-bar">
          {active && <motion.span layoutId="barHighlight" className="bar-highlight" />}
        </div>
        <div className="stripe-left">
          {showIndices && <span className="mini-index">{String(index + 1).padStart(3, "0")}</span>}
        </div>
        <div className="stripe-center">
          <motion.h2 className="stripe-title" style={{ letterSpacing: ls, scaleY: sy }}>
            {item.title}
          </motion.h2>
        </div>
        <div className="stripe-right">{showScope && <span className="scope">{item.brand}</span>}</div>
      </motion.div>
    </motion.button>
  );
};

/* Main component */
export const StripeMenu: React.FC<StripeMenuProps> = ({
  items,
  initialIndex = 0,
  open,
  defaultOpen = true,
  onOpenChange,
  closeOnEnter = true,
  onChange,
  onEnter,
  rowHeight = 96,
  rowHeightActive = 140,
  fontFamily,
  showIndices = true,
  showScope = true,
  paperColor = "#F3F1EC",
  lineColor = "#D8D5CF",
  inkColor = "#0B0C0E",
  brandLabel = "WRK•",
  menuIcon,
  closeIcon,
  closedContent,
  className,
  style,
}) => {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isControlled = open !== undefined;
  const isOpen = isControlled ? !!open : internalOpen;
  const setOpen = (v: boolean) => {
    if (!isControlled) setInternalOpen(v);
    onOpenChange?.(v);
  };

  const [activeIndex, setActiveIndex] = useState(clamp(initialIndex, 0, items.length - 1));
  const go = (dir: 1 | -1) =>
    setActiveIndex((i) => {
      const ni = clamp(i + dir, 0, items.length - 1);
      if (ni !== i) onChange?.(ni, items[ni]);
      return ni;
    });

  useWheelSnap(isOpen, go);
  useKeyNav(isOpen, go);

  const enter = (idx: number) => {
    setActiveIndex(idx);
    onEnter?.(idx, items[idx]);
    if (closeOnEnter) setOpen(false);
  };

  const mergedFont =
    fontFamily ||
    "'Inter Tight', ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, 'Helvetica Neue', Arial";
  const MenuIco = menuIcon ?? <MenuIcon />;
  const CloseIco = closeIcon ?? <CloseIcon />;

  return (
    <div
      className={`stripe-menu-root ${className ?? ""}`}
      style={
        {
          "--paper": paperColor,
          "--line": lineColor,
          "--ink": inkColor,
          "--font": mergedFont,
        } as React.CSSProperties
      }
    >
      <div className="bg" />
      <div className="frame" style={style}>
        <div className="frame-top">
          <button
            className="icon-btn"
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
            onClick={() => setOpen(!isOpen)}
            title={isOpen ? "Close" : "Menu"}
          >
            {isOpen ? CloseIco : MenuIco}
          </button>
          <span className="brand">{brandLabel}</span>
        </div>

        <AnimatePresence initial={false} mode="wait">
          {isOpen ? (
            <motion.div
              key="menu"
              className="menu-overlay"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 180, damping: 22 }}
            >
              <div className="menu-scroll">
                <LayoutGroup id="stripes">
                  {items.map((it, i) => (
                    <StripeRow
                      key={it.id}
                      item={it}
                      index={i}
                      active={i === activeIndex}
                      onEnter={() => enter(i)}
                      h={rowHeight}
                      hActive={rowHeightActive}
                      showIndices={showIndices}
                      showScope={showScope}
                    />
                  ))}
                </LayoutGroup>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="closed"
              className="closed-blank"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
              <div className="blank-inner">
                <h2>{items[activeIndex].title}</h2>
                {closedContent ?? <p>Menu closed. Use onEnter to navigate to your content.</p>}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};