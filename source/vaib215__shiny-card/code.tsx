import { cn } from "@/lib/utils";
import { useCallback, useState, useRef, useEffect } from "react";
import { CheckCircle2 } from "lucide-react";

function useMousePosition(
  ref: React.RefObject<HTMLElement>,
  callback?: ({ x, y }: { x: number; y: number }) => void,
) {
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const { clientX, clientY } = event;
      const { top, left } = ref.current?.getBoundingClientRect() || {
        top: 0,
        left: 0,
      };

      callback?.({ x: clientX - left, y: clientY - top });
    };

    const handleTouchMove = (event: TouchEvent) => {
      const { clientX, clientY } = event.touches[0];
      const { top, left } = ref.current?.getBoundingClientRect() || {
        top: 0,
        left: 0,
      };

      callback?.({ x: clientX - left, y: clientY - top });
    };

    ref.current?.addEventListener("mousemove", handleMouseMove);
    ref.current?.addEventListener("touchmove", handleTouchMove);

    const nodeRef = ref.current;
    return () => {
      nodeRef?.removeEventListener("mousemove", handleMouseMove);
      nodeRef?.removeEventListener("touchmove", handleTouchMove);
    };
  }, [ref, callback]);
}


export default function ShinyCard({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
 
  const update = useCallback(({ x, y }: { x: number; y: number }) => {
    if (!overlayRef.current) {
      return;
    }
 
    const { width, height } = overlayRef.current?.getBoundingClientRect() ?? {};
    const xOffset = x - width / 2;
    const yOffset = y - height / 2;
 
    overlayRef.current?.style.setProperty("--x", `${xOffset}px`);
    overlayRef.current?.style.setProperty("--y", `${yOffset}px`);
  }, []);
 
  useMousePosition(containerRef, update);
 
  return (
    <div
      ref={containerRef}
      className={cn(
        "group relative w-96 min-w-fit max-w-full overflow-hidden rounded-md border border-border bg-zinc-700 p-6 text-zinc-200 shadow-lg",
        className,
      )}
    >
      <div
        ref={overlayRef}
        className="-z-1 absolute h-64 w-64 rounded-full bg-white opacity-0 bg-blend-soft-light blur-3xl transition-opacity group-hover:opacity-20"
        style={{
          transform: "translate(var(--x), var(--y))",
        }}
      />
 
      <div className="font-mono text-sm">
        My Todos
        <div className="text-xs text-zinc-400">May 28, 2025</div>
      </div>
 
      <div className="z-10 mt-10 flex w-full min-w-fit flex-col gap-2 rounded-md bg-zinc-600 p-4 shadow-2xl">
        {[
          {
            title: "Do Yoga",
            time: "20 min",
          },
          {
            title: "Go to market",
            time: "1 hr",
          },
          {
            title: "Practice Guitar",
            time: "30 min",
          },
        ].map((step) => {
          return (
            <div className="flex w-full items-center gap-2" key={step.title}>
              <CheckCircle2 className="flex-shrink-0 fill-green-400 text-zinc-600" />
              <strong className="text-xs md:flex-shrink-0 md:text-base">{step.title}</strong>
 
              <span className="ml-auto inline-block flex-shrink-0 text-xs opacity-75">
                {step.time}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}