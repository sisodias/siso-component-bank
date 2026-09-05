"use client";

import React, {useId, forwardRef, useMemo} from "react";
import clsx from "clsx";

export type ElectricCardProps = {
  /** Visual style. */
  variant?: "swirl" | "hue";
  /** Accent color; defaults to theme primary. Accepts any CSS color. */
  color?: string;
  /** Optional badge text. */
  badge?: string;
  /** Title text (fallback if no children header slot). */
  title?: string;
  /** Description text (fallback if no children body slot). */
  description?: string;  
  widthClass?: string; // e.g., "w-[22rem]"
  /** Aspect ratio (Tailwind) e.g., "aspect-[7/10]". */
  aspectClass?: string; // e.g., "aspect-[7/10]"

  children?: React.ReactNode;
  header?: React.ReactNode;
  body?: React.ReactNode;
  className?: string;
  ariaLabel?: string;
};

const DEFAULT_WIDTH = "w-[22rem]";
const DEFAULT_ASPECT = "aspect-[7/10]";

export const ElectricCard = forwardRef<HTMLDivElement, ElectricCardProps>(
  (
    {
      variant = "swirl",
      color,
      badge = "Dramatic",
      title = "Original",
      description = "In case you'd like to emphasize something very dramatically.",
      widthClass = DEFAULT_WIDTH,
      aspectClass = DEFAULT_ASPECT,
      className,
      ariaLabel,
      header,
      body,
      children,
    },
    ref
  ) => {
    const uid = useId().replace(/:/g, "");
    const swirlId = `swirl-${uid}`;
    const hueId = `hue-${uid}`;

    const filterURL = useMemo(
      () => (variant === "hue" ? `url(#${hueId})` : `url(#${swirlId})`),
      [variant, hueId, swirlId]
    );

    // Resolved accent color → CSS var; default to Tailwind primary if not provided
    const resolvedColor = color ?? "oklch(var(--primary))";

    return (
      <div
        ref={ref}
        className={clsx("relative inline-block text-[hsl(var(--foreground))]", className)}
        aria-label={ariaLabel}
        role={ariaLabel ? "region" : undefined}
        style={{
          // surface tokens
          // @ts-expect-error custom props
          "--ec-border": resolvedColor,
        }}
      >
        {/* SVG defs with animated filters */}
        <svg className="absolute size-0 overflow-hidden" aria-hidden="true">
          <defs>
            {/* SWIRL */}
            <filter id={swirlId} colorInterpolationFilters="sRGB" x="-20%" y="-20%" width="140%" height="140%">
              <feTurbulence type="turbulence" baseFrequency="0.02" numOctaves="10" result="n1" seed="1" />
              <feOffset in="n1" dx="0" dy="0" result="o1">
                <animate attributeName="dy" values="700;0" dur="6s" repeatCount="indefinite" />
              </feOffset>

              <feTurbulence type="turbulence" baseFrequency="0.02" numOctaves="10" result="n2" seed="1" />
              <feOffset in="n2" dx="0" dy="0" result="o2">
                <animate attributeName="dy" values="0;-700" dur="6s" repeatCount="indefinite" />
              </feOffset>

              <feTurbulence type="turbulence" baseFrequency="0.02" numOctaves="10" result="n3" seed="2" />
              <feOffset in="n3" dx="0" dy="0" result="o3">
                <animate attributeName="dx" values="490;0" dur="6s" repeatCount="indefinite" />
              </feOffset>

              <feTurbulence type="turbulence" baseFrequency="0.02" numOctaves="10" result="n4" seed="2" />
              <feOffset in="n4" dx="0" dy="0" result="o4">
                <animate attributeName="dx" values="0;-490" dur="6s" repeatCount="indefinite" />
              </feOffset>

              <feComposite in="o1" in2="o2" result="p1" />
              <feComposite in="o3" in2="o4" result="p2" />
              <feBlend in="p1" in2="p2" mode="color-dodge" result="mix" />
              <feDisplacementMap in="SourceGraphic" in2="mix" scale="30" xChannelSelector="R" yChannelSelector="B" />
            </filter>

            {/* HUE */}
            <filter id={hueId} colorInterpolationFilters="sRGB" x="-20%" y="-20%" width="140%" height="140%">
              <feTurbulence type="turbulence" baseFrequency="0.02" numOctaves="7" />
              <feColorMatrix type="hueRotate" result="pt1">
                <animate attributeName="values" values="0;360" dur=".6s" repeatCount="indefinite" />
              </feColorMatrix>
              <feComposite />
              <feTurbulence type="turbulence" baseFrequency="0.03" numOctaves="7" seed="5" />
              <feColorMatrix type="hueRotate" result="pt2">
                <animate attributeName="values" values="0;333;199;286;64;168;256;157;360" dur="5s" repeatCount="indefinite" />
              </feColorMatrix>
              <feBlend in="pt1" in2="pt2" mode="normal" result="mix" />
              <feDisplacementMap in="SourceGraphic" in2="mix" scale="30" xChannelSelector="R" yChannelSelector="B" />
            </filter>
          </defs>
        </svg>

        {/* Card shell */}
        <div
          className={clsx(
            "relative rounded-2xl p-[2px] text-[oklch(var(--card-foreground))]",
            // border gradient using accent color var
            "bg-[linear-gradient(-30deg,oklch(from_var(--ec-border)_0.7_calc(c/2)_h/_0.35),transparent,oklch(from_var(--ec-border)_0.7_calc(c/2)_h/_0.35)),linear-gradient(to_bottom,oklch(var(--card)),oklch(var(--card))) ]"
          )}
        >
          <div className="relative rounded-2xl border border-[oklch(from_var(--ec-border)_l_c_h_/_0.5)] pr-[0.15em] pb-[0.15em]">
            <div
              className={clsx(
                widthClass,
                aspectClass,
                "-mt-1 -ml-1 rounded-2xl border-2",
                "border-[oklch(from_var(--ec-border)_l_c_h)]",
                "[filter:var(--ec-filter-url)] bg-[oklch(0.145_0_0)]"
              )}
              style={{
                // @ts-expect-error custom var
                "--ec-filter-url": filterURL,
              }}
            />

            {/* glow layers */}
            <div className="pointer-events-none absolute inset-0 rounded-2xl border border-[oklch(from_var(--ec-border)_l_c_h_/_0.6)] blur-[1px]" />
            <div className="pointer-events-none absolute inset-0 rounded-2xl border border-[oklch(from_var(--ec-border)_l_c_h)] blur-[4px]" />
          </div>

          {/* sheen overlays */}
          <div className="pointer-events-none absolute inset-0 -z-10 scale-[1.1] rounded-2xl bg-[linear-gradient(-30deg,white,transparent_30%,transparent_70%,white)] mix-blend-overlay blur-[16px] opacity-100" />
          <div className="pointer-events-none absolute inset-0 -z-10 scale-[1.1] rounded-2xl bg-[linear-gradient(-30deg,white,transparent_30%,transparent_70%,white)] mix-blend-overlay blur-[16px] opacity-50" />

          {/* background glow */}
          <div className="pointer-events-none absolute inset-0 -z-20 scale-[1.08] rounded-2xl bg-[linear-gradient(-30deg,oklch(from_var(--ec-border)_l_c_h),transparent,oklch(from_var(--ec-border)_l_c_h))] blur-[32px] opacity-30" />

          {/* Content */}
          <div className="absolute inset-0 flex flex-col">
            <div className="flex h-full flex-col gap-4 p-12 pb-4">
              <div className="relative w-fit rounded-[14px] bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase text-white/80 dark:bg-white/10">
                {badge}
                <span className="pointer-events-none absolute inset-0 rounded-[14px] [mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)] [mask-composite:xor] [padding:1px] before:absolute before:inset-0 before:rounded-[14px] before:bg-[linear-gradient(150deg,white/50_16.73%,white/10_30.2%,white/10_68.2%,white/60_81.89%)] before:[mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)] before:[mask-composite:xor]" />
              </div>

              {header ?? (
                <h3 className="mt-auto text-3xl font-medium tracking-tight text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))]">
                  {title}
                </h3>
              )}
            </div>

            <hr className="mx-12 my-0 h-px border-0 bg-current opacity-10 [mask-image:linear-gradient(to_right,transparent,black,transparent)]" />

            <div className="flex flex-col gap-4 p-12 pt-4">
              {body ?? (
                <p className="text-[hsl(var(--foreground))/70%]">{description}</p>
              )}
              {children}
            </div>
          </div>
        </div>
      </div>
    );
  }
);

ElectricCard.displayName = "ElectricCard";

export default ElectricCard;