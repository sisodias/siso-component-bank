"use client";

import React from "react";

type Variant = "blue" | "green" | "pink";

export function ElectricCard({
  children,
  variant = "blue",
}: {
  children: React.ReactNode;
  variant?: Variant;
}) {
  const className = `card-container electric-card--${variant}`;

  return (
    <div role="region" aria-label="Electric glowing card" className={className}>
      <div className="inner-container">
        <div className="border-outer" aria-hidden="true">
          <div className="main-card">{children}</div>
        </div>

        <div className="glow-layer-1" aria-hidden="true" />
        <div className="glow-layer-2" aria-hidden="true" />
      </div>

      <div className="overlay-1" aria-hidden="true" />
      <div className="overlay-2" aria-hidden="true" />
      <div className="background-glow" aria-hidden="true" />
    </div>
  );
}
