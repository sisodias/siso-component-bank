"use client";

import React, { useEffect, useRef, useState } from "react";

// Action bar converted to a Next.js client component
// Uses CSS Anchor Positioning (experimental) exactly like the provided HTML/CSS
// The SVG filter is rendered once at the root of this component.

const ICONS = [
  "person",
  "push_pin",
  "alternate_email",
  "mail",
  "edit",
  "cases",
] as const;

export default function ActionBar() {
  const [selectedIndex, setSelectedIndex] = useState<number>(2); // third is initially selected
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const btnRefs = useRef<Array<HTMLButtonElement | null>>([]);

  // Update the anchorName on the active button (hovered > selected)
  useEffect(() => {
    const active = hoveredIndex ?? selectedIndex;

    // clear all
    btnRefs.current.forEach((el) => {
      if (el) (el.style as any).anchorName = "";
    });

    // set active
    const el = btnRefs.current[active];
    if (el) (el.style as any).anchorName = "--selected";
  }, [selectedIndex, hoveredIndex]);

  return (
    <>
      <div className="action-bar" role="toolbar" aria-label="Actions">
        {ICONS.map((name, i) => (
          <button
            key={name}
            ref={(el) => (btnRefs.current[i] = el)}
            className={i === selectedIndex ? "selected" : undefined}
            onClick={() => setSelectedIndex(i)}
            onMouseEnter={() => setHoveredIndex(i)}
            onFocus={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex((curr) => (curr === i ? null : curr))}
            onBlur={() => setHoveredIndex((curr) => (curr === i ? null : curr))}
            aria-pressed={i === selectedIndex}
            aria-label={name.replace("_", " ")}
          >
            <span className="material-symbols-outlined">{name}</span>
          </button>
        ))}
      </div>

      {/* The anchored pointer that follows the currently active button */}
      <div className="anchored-pointer" aria-hidden="true" />

      {/* SVG filter (kept identical) */}
      <svg width="0" height="0" aria-hidden="true">
        <filter
          id="filter"
          colorInterpolationFilters="linearRGB"
          filterUnits="objectBoundingBox"
          primitiveUnits="userSpaceOnUse"
        >
          <feDisplacementMap
            in="SourceGraphic"
            in2="SourceGraphic"
            scale="5"
            xChannelSelector="A"
            yChannelSelector="A"
            x="5"
            y="-5"
            width="100%"
            height="100%"
            result="displacementMap"
          />
        </filter>
      </svg>
    </>
  );
}
