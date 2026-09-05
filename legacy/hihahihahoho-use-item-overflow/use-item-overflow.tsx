import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { useResizeObserver } from "usehooks-ts";

interface UseOverflowOptions {
  /** Total number of items to manage */
  total: number;
  /** Maximum number of items to show (optional) */
  max?: number;
  /** Gap between items in pixels */
  gap?: number;
}

export function useOverflow({
  total,
  max = Infinity,
  gap = 8,
}: UseOverflowOptions) {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLElement | null)[]>([]);
  const [visibleCount, setVisibleCount] = useState(total);

  const measure = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const containerWidth = container.getBoundingClientRect().width;
    const items = itemsRef.current.filter(
      (item): item is HTMLElement => item !== null
    );

    if (items.length === 0) {
      setVisibleCount(0);
      return;
    }

    // Get the width of the last item (will be our "more" indicator)
    const moreItemWidth = items[items.length - 1].getBoundingClientRect().width;

    let totalWidth = 0;
    let count = 0;

    // Calculate how many items we can fit
    for (let i = 0; i < Math.min(items.length - 1, max); i++) {
      const itemWidth = items[i].getBoundingClientRect().width;

      if (totalWidth + itemWidth + gap <= containerWidth) {
        totalWidth += itemWidth + gap;
        count++;
      } else {
        break;
      }
    }

    // If we need to show the "more" indicator, make sure we have space for it
    if (count < total) {
      while (count > 0 && totalWidth + moreItemWidth + gap > containerWidth) {
        const itemWidth = items[count - 1].getBoundingClientRect().width;
        totalWidth -= itemWidth + gap;
        count--;
      }
    }

    setVisibleCount(count);
  }, [total, max, gap]);

  // Measure on mount and when dependencies change
  useLayoutEffect(() => {
    measure();
  }, [measure]);

  // Measure on resize
  useResizeObserver({
    ref: containerRef,
    onResize: measure,
  });

  const registerItem = useCallback(
    (index: number) => (element: HTMLElement | null) => {
      itemsRef.current[index] = element;
    },
    []
  );

  return {
    containerRef,
    registerItem,
    visibleCount,
    hiddenCount: Math.max(0, total - visibleCount),
    isVisible: (index: number) => index < visibleCount,
  };
}
