'use client';

import React, { useMemo } from 'react';
import Image from 'next/image';

export type StackedImageHoverProps = {
  /** List of image URLs to stack (back -> front order). */
  images: string[];

  /** Width in px. Default: 640 */
  width?: number;

  /** Height in px. Default: 260 */
  height?: number;

  /** Container background (behind images). Default: '#000' */
  backgroundColor?: string;

  /** Rotation in deg. Default: -30 */
  rotateDeg?: number;

  /** Skew in deg. Default: 25 */
  skewDeg?: number;

  /** Scale multiplier. Default: 0.6 */
  scale?: number;

  /** Base pixel shift per layer. Default: 40 (so 40, 80, 120, …) */
  stepPx?: number;

  /** Hover opacity range [min..1]. Default: 0.4 */
  minOpacity?: number;

  /** Accessibility label */
  ariaLabel?: string;

  /** Extra class on root */
  className?: string;
};

export default function StackedImageHover({
  images,
  width = 640,
  height = 260,
  backgroundColor = '#000',
  rotateDeg = -30,
  skewDeg = 25,
  scale = 0.6,
  stepPx = 40,
  minOpacity = 0.4,
  ariaLabel = 'stacked image hover effect',
  className = '',
}: StackedImageHoverProps) {
  // Build dynamic hover rules for N images:
  // translate: (i+1)*stepPx; opacity: interpolate from minOpacity -> 1
  const hoverCSS = useMemo(() => {
    if (!images?.length) return '';
    const n = images.length;
    const denom = Math.max(1, n - 1);
    const lines = images.map((_, i) => {
      const shift = stepPx * (i + 1);
      const opacity = (i === n - 1) ? 1 : (minOpacity + (i * (1 - minOpacity) / denom));
      // target the i-th direct child (the wrapper div for that image)
      return `.stack-container:hover > .stack-item:nth-child(${i + 1}){transform:translate(${shift}px,-${shift}px);opacity:${opacity};}`;
    });
    return lines.join('\n');
  }, [images, stepPx, minOpacity]);

  return (
    <div
      className={[
        'stack-container relative mx-auto transition-transform duration-500 ease-in-out',
        className,
      ].join(' ')}
      style={{
        width,
        height,
        background: backgroundColor,
        transform: `rotate(${rotateDeg}deg) skew(${skewDeg}deg) scale(${scale})`,
      }}
      role="region"
      aria-label={ariaLabel}
    >
      {images.map((src, i) => (
        <div
          key={i}
          className="stack-item absolute inset-0 will-change-transform transition-transform duration-500"
          style={{ zIndex: i }}
        >
          <Image
            src={src}
            alt={`stacked image ${i + 1}`}
            fill
            className="object-cover transition-opacity duration-500"
            // Use unoptimized to avoid Next image domain config for external URLs
            unoptimized
            priority={i === images.length - 1}
          />
        </div>
      ))}

      {/* Scoped CSS: hover rules apply to direct children only */}
      <style jsx>{`
        .stack-container {
          margin-top: 10rem; /* like your demo */
        }
        .stack-container > .stack-item {
          opacity: 1;
        }
        ${hoverCSS}
      `}</style>
    </div>
  );
}

export { StackedImageHover };
