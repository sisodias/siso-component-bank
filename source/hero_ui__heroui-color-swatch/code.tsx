"use client";

import * as React from "react";

type ColorSwatchSize = "xs" | "sm" | "md" | "lg" | "xl";
type ColorSwatchShape = "circle" | "square";

type ColorSwatchRenderProps = {
  color: {
    value: string;
    toString: (format?: "css" | "hex") => string;
  };
};

type ColorSwatchProps = Omit<React.HTMLAttributes<HTMLDivElement>, "color" | "children" | "style"> & {
  color: string;
  colorName?: string;
  shape?: ColorSwatchShape;
  size?: ColorSwatchSize;
  style?: React.CSSProperties | ((renderProps: ColorSwatchRenderProps) => React.CSSProperties);
  render?: (props: React.HTMLAttributes<HTMLDivElement> & { style: React.CSSProperties }) => React.ReactNode;
};

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function hexToRgba(color: string) {
  const trimmed = color.trim();
  const hex = trimmed.match(/^#([0-9a-f]{3,8})$/i)?.[1];

  if (!hex) return trimmed;

  const pairs =
    hex.length === 3 || hex.length === 4
      ? hex.split("").map((channel) => channel + channel)
      : hex.match(/.{2}/g) ?? [];

  const [r = "00", g = "00", b = "00", a] = pairs;
  const alpha = a == null ? 1 : Math.round((parseInt(a, 16) / 255) * 100) / 100;

  return `rgba(${parseInt(r, 16)}, ${parseInt(g, 16)}, ${parseInt(b, 16)}, ${alpha})`;
}

function getAccessibleName(color: string, colorName?: string, ariaLabel?: string) {
  if (colorName && ariaLabel) return `${colorName}, ${ariaLabel}`;
  return colorName ?? ariaLabel ?? color;
}

function colorObject(color: string): ColorSwatchRenderProps["color"] {
  return {
    value: color,
    toString: () => hexToRgba(color),
  };
}

function ColorSwatch({
  className,
  color,
  colorName,
  shape = "circle",
  size = "md",
  style,
  render,
  "aria-label": ariaLabel,
  ...props
}: ColorSwatchProps) {
  const cssColor = hexToRgba(color);
  const renderProps = React.useMemo(() => ({ color: colorObject(color) }), [color]);
  const userStyle = typeof style === "function" ? style(renderProps) : style;
  const swatchStyle = {
    "--color-swatch-current": cssColor,
    backgroundColor: cssColor,
    forcedColorAdjust: "none",
    ...userStyle,
  } as React.CSSProperties;

  const elementProps = {
    ...props,
    "aria-label": getAccessibleName(color, colorName, ariaLabel),
    className: cn("color-swatch", `color-swatch--${shape}`, `color-swatch--${size}`, className),
    "data-slot": "color-swatch",
    role: "img",
    style: swatchStyle,
  };

  return (
    <>
      <ColorSwatchStyles />
      {render ? render(elementProps) : <div {...elementProps} />}
    </>
  );
}

function ColorSwatchStyles() {
  return (
    <style>{`
      .color-swatch {
        position: relative;
        box-sizing: border-box;
        display: inline-block;
        width: 32px;
        height: 32px;
        flex-shrink: 0;
        background:
          linear-gradient(var(--color-swatch-current), var(--color-swatch-current)),
          repeating-conic-gradient(#efefef 0% 25%, #f7f7f7 0% 50%) 50% / 16px 16px;
        box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.1);
      }
      .color-swatch--circle { border-radius: 16px; }
      .color-swatch--square { border-radius: 6px; }
      .color-swatch--xs {
        width: 16px;
        height: 16px;
      }
      .color-swatch--xs.color-swatch--circle { border-radius: 8px; }
      .color-swatch--sm {
        width: 24px;
        height: 24px;
      }
      .color-swatch--sm.color-swatch--circle { border-radius: 12px; }
      .color-swatch--md {
        width: 32px;
        height: 32px;
      }
      .color-swatch--lg {
        width: 36px;
        height: 36px;
      }
      .color-swatch--lg.color-swatch--circle { border-radius: 24px; }
      .color-swatch--xl {
        width: 40px;
        height: 40px;
      }
      .color-swatch--xl.color-swatch--circle { border-radius: 24px; }
      .color-swatch:focus-visible {
        outline: 2px solid hsl(var(--ring, 240 5% 65%));
        outline-offset: 2px;
      }
    `}</style>
  );
}

export { ColorSwatch };
export type { ColorSwatchProps, ColorSwatchRenderProps, ColorSwatchShape, ColorSwatchSize };
