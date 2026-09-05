"use client";

/**
 * UnicornStudioEmbed
 * Reusable, props-driven embed for Unicorn Studio projects.
 * - No fullscreen/layout opinion here (demo controls layout).
 * - Theming-safe wrapper using shadcn tokens.
 * - Idempotent script loader with shared Promise.
 * - Accessible region + optional ariaLabel.
 */

import * as React from "react";

type DivProps = React.HTMLAttributes<HTMLDivElement>;

export type UnicornStudioEmbedProps = DivProps & {
  /** Unicorn Studio project id (e.g., "cdjwcjVT6M7qREn7g0Y9") */
  projectId: string;
  /** Enable production mode in Unicorn Studio (defaults to true) */
  production?: boolean;
  /** Optional ARIA label for the embed region */
  ariaLabel?: string;
  /** Called after the Unicorn script has loaded and initialized */
  onReady?: () => void;
};

/** tiny cn util (avoid external dep for one line) */
function cn(...parts: Array<string | undefined | false>) {
  return parts.filter(Boolean).join(" ");
}

// Shared loader to dedupe multiple instances mounting at once.
let unicornLoaderPromise: Promise<void> | null = null;

function ensureUnicornScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();

  // If already present and initialized, resolve immediately.
  if ((window as any).UnicornStudio?.isInitialized) return Promise.resolve();

  // Check if script is already in the DOM
  const src =
    "https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.4.30/dist/unicornStudio.umd.js";
  const existing = Array.from(document.getElementsByTagName("script")).find(
    (s) => s.src === src
  );

  // If a prior call created a loader promise, reuse it.
  if (unicornLoaderPromise) return unicornLoaderPromise;

  unicornLoaderPromise = new Promise<void>((resolve) => {
    const onload = () => {
      const ws = (window as any).UnicornStudio ?? { isInitialized: false };
      (window as any).UnicornStudio = ws;
      if (!ws.isInitialized && typeof ws.init === "function") {
        ws.init();
        ws.isInitialized = true;
      }
      resolve();
    };

    if (existing) {
      // Script tag already there; wait for load or init
      if ((window as any).UnicornStudio?.init) {
        onload();
      } else {
        existing.addEventListener("load", onload, { once: true });
      }
      return;
    }

    // Create script
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.addEventListener("load", onload, { once: true });
    (document.head || document.body).appendChild(script);
  });

  return unicornLoaderPromise;
}

export const UnicornStudioEmbed = React.forwardRef<HTMLDivElement, UnicornStudioEmbedProps>(
  (
    {
      projectId,
      production = true,
      ariaLabel = "Unicorn Studio project",
      className,
      onReady,
      style,
      ...divProps
    },
    ref
  ) => {
    const containerRef = React.useRef<HTMLDivElement | null>(null);
    React.useImperativeHandle(ref, () => containerRef.current as HTMLDivElement, []);

    const [loaded, setLoaded] = React.useState(false);

    React.useEffect(() => {
      let mounted = true;
      ensureUnicornScript().then(() => {
        if (!mounted) return;
        setLoaded(true);
        onReady?.();
      });
      return () => {
        mounted = false;
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
      <div
        {...divProps}
        ref={containerRef}
        role="region"
        aria-label={ariaLabel}
        data-us-project={projectId}
        data-us-production={String(production)}
        className={cn(
          "relative bg-background text-foreground",
          "border border-border rounded-lg",
          "min-h-[240px]",
          className
        )}
        style={style}
      >
        {!loaded && (
          <div className="absolute inset-0 animate-pulse bg-muted/30 rounded-lg" aria-hidden="true" />
        )}
      </div>
    );
  }
);
UnicornStudioEmbed.displayName = "UnicornStudioEmbed";
