import { GripVertical } from "lucide-react";
import { useRef, useState, useCallback, KeyboardEvent } from "react";

/** A single list item */
export interface PriorityItem {
  id: string | number;
  /** Primary label shown in the row */
  title: string;
  /** Optional secondary line, e.g. "Design · 4 tasks" */
  meta?: string;
}

/** Props for DraggablePriorityList */
interface DraggablePriorityListProps {
  /** Ordered array of items to display */
  items: PriorityItem[];
  /** Called with the new item order after every reorder */
  onChange?: (items: PriorityItem[]) => void;
  /** Optional className forwarded to the root div */
  className?: string;
}

export function DraggablePriorityList({
  items,
  onChange,
  className = "",
}: DraggablePriorityListProps) {
  const [order, setOrder] = useState<number[]>(items.map((_, i) => i));
  const [dragging, setDragging] = useState<number | null>(null);
  const [dragOver, setDragOver] = useState<number | null>(null);
  const [kbGrabbed, setKbGrabbed] = useState<number | null>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const reorder = useCallback(
    (from: number, to: number) => {
      setOrder((prev) => {
        const next = [...prev];
        const [moved] = next.splice(from, 1);
        next.splice(to, 0, moved);
        onChange?.(next.map((i) => items[i]));
        return next;
      });
    },
    [items, onChange]
  );

  const handleKeyDown = (e: KeyboardEvent<HTMLLIElement>, rank: number) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      if (kbGrabbed === null) {
        setKbGrabbed(rank);
      } else {
        reorder(kbGrabbed, rank);
        setKbGrabbed(null);
        setTimeout(() => focusItem(rank), 0);
      }
    }
    if (e.key === "Escape") setKbGrabbed(null);
    if (kbGrabbed !== null) {
      if (e.key === "ArrowUp" && rank > 0) {
        e.preventDefault();
        reorder(rank, rank - 1);
        setKbGrabbed(rank - 1);
        setTimeout(() => focusItem(rank - 1), 0);
      }
      if (e.key === "ArrowDown" && rank < order.length - 1) {
        e.preventDefault();
        reorder(rank, rank + 1);
        setKbGrabbed(rank + 1);
        setTimeout(() => focusItem(rank + 1), 0);
      }
    }
  };

  const focusItem = (rank: number) => {
    const el = listRef.current?.querySelectorAll<HTMLLIElement>("[role=option]")[rank];
    el?.focus();
  };

  return (
    <div className={`w-full ${className}`}>
      <ul
        ref={listRef}
        role="listbox"
        aria-label="Priority list — drag or use keyboard to reorder"
        className="flex flex-col gap-2 list-none p-0 m-0"
      >
        {order.map((idx, rank) => {
          const item = items[idx];
          const isGrabbed = kbGrabbed === rank;
          const isDragOver = dragOver === rank;

          return (
            <li
              key={item.id}
              role="option"
              tabIndex={0}
              draggable
              aria-selected={isGrabbed}
              aria-label={`${item.title}, rank ${rank + 1} of ${order.length}`}
              data-rank={rank}
              className={[
                "relative flex items-stretch rounded-xl border cursor-grab select-none",
                "transition-all duration-150 outline-offset-2",
                "bg-card border-border/40",
                "hover:bg-accent/40 hover:border-border/70",
                dragging === rank ? "opacity-90 cursor-grabbing scale-[1.02] shadow-lg" : "",
                isDragOver ? "border-ring bg-accent/20" : "",
                isGrabbed ? "ring-2 ring-ring ring-offset-1 ring-offset-background" : "",
              ].join(" ")}
              onDragStart={() => setDragging(rank)}
              onDragEnd={() => { setDragging(null); setDragOver(null); }}
              onDragOver={(e) => { e.preventDefault(); setDragOver(rank); }}
              onDrop={(e) => {
                e.preventDefault();
                if (dragging !== null && dragging !== rank) {
                  reorder(dragging, rank);
                  setDragging(null);
                  setDragOver(null);
                  setTimeout(() => focusItem(rank), 0);
                }
              }}
              onKeyDown={(e) => handleKeyDown(e, rank)}
            >
              {/* Rank number */}
              <div
                aria-hidden
                className="flex flex-col items-center justify-center w-14 min-w-14 border-r border-border/40 py-4 gap-0.5"
              >
                <span className="font-mono text-lg font-medium text-muted-foreground leading-none">
                  {rank + 1}
                </span>
                <span className="text-[9px] uppercase tracking-widest text-muted-foreground/60">
                  {rank === 0 ? "top" : rank === order.length - 1 ? "last" : ""}
                </span>
              </div>

              {/* Body */}
              <div className="flex-1 px-4 py-3.5 min-w-0">
                <p className="text-sm font-medium truncate leading-snug">{item.title}</p>
                {item.meta && (
                  <p className="text-xs text-muted-foreground mt-0.5">{item.meta}</p>
                )}
              </div>

              {/* Drag handle */}
              <div
                aria-hidden
                className="flex items-center justify-center w-10 text-muted-foreground/40 hover:text-muted-foreground/80 transition-colors"
              >
                <GripVertical className="w-4 h-4" />
              </div>
            </li>
          );
        })}
      </ul>

      {/* Keyboard hint footer */}
      <div className="mt-3 flex items-center justify-end gap-1 text-[11px] text-muted-foreground/60">
        <kbd className="px-1.5 py-0.5 rounded bg-muted border border-border/50 font-mono text-[10px]">Space</kbd>
        grab ·
        <kbd className="px-1.5 py-0.5 rounded bg-muted border border-border/50 font-mono text-[10px]">↑↓</kbd>
        move ·
        <kbd className="px-1.5 py-0.5 rounded bg-muted border border-border/50 font-mono text-[10px]">Esc</kbd>
        cancel
      </div>
    </div>
  );
}