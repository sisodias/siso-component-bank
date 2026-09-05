'use client';

import React, { useId, useMemo } from 'react';
import { cn } from '@/lib/utils';

const DEFAULT_TOTAL_ANGLE = 240;
const DEFAULT_NEEDLE_BASE_WIDTH = 4;
const DEFAULT_NEEDLE_TIP_WIDTH = 1;

const TRANSITION = 'duration-700 ease-in-out motion-reduce:transition-none';

export type GaugeSize = 'sm' | 'md' | 'lg';

const SIZE_VARIANTS: Record<GaugeSize, Required<Pick<BaseGaugeProps, 'size' | 'strokeWidth' | 'arcGap' | 'gapDeg'>>> = {
  sm: { size: 140, strokeWidth: 7.5, arcGap: 2, gapDeg: 2 },
  md: { size: 200, strokeWidth: 11, arcGap: 3, gapDeg: 2 },
  lg: { size: 300, strokeWidth: 16, arcGap: 5, gapDeg: 2 },
};

export type GaugeSegment = {
  /** Portion of the gauge this segment occupies, 0–100. Sum across segments should equal 100. */
  percent: number;
  /** Stroke color for this segment. Accepts any CSS color (rgb, hsl, var(--token), etc.). */
  color: string;
};

export type GaugeNeedleConfig = {
  /** Width of the needle at its base (pivot point) in SVG units. Default: 4. */
  baseWidth?: number;
  /** Width of the needle at its tip in SVG units. Default: 1. */
  tipWidth?: number;
};

type BaseGaugeProps = {
  /** Colored segments rendered along the gauge arc (e.g. good/fair/poor zones). */
  segments: GaugeSegment[];
  /** Current progress along the gauge, 0–100. Determines the inner arc fill and needle position. */
  progress: number;
  /** Preset size that tunes `size`, `strokeWidth`, `arcGap`, and `gapDeg` together. Overridden by explicit props. */
  variant?: GaugeSize;
  /** SVG canvas size in pixels. Default: 200. */
  size?: number;
  /** Thickness of the colored segment arcs. Default: 11. */
  strokeWidth?: number;
  /** Angular gap between segments, in degrees. Default: 2. */
  gapDeg?: number;
  /** Spacing between the outer segments and the inner progress arc, in pixels. Default: 3. */
  arcGap?: number;
  /** Multiplier for the SVG width relative to height. Use to stretch horizontally. Default: 1. */
  widthRatio?: number;
  /** Total angular span of the gauge in degrees. 180 = semicircle, 360 = full ring. Default: 240. */
  totalAngle?: number;
  /** Render a rotating needle pointing at `progress`. Pass `true` for defaults or a config object to customize. */
  needle?: boolean | GaugeNeedleConfig;
};

export type GaugeProps = BaseGaugeProps &
  React.HTMLAttributes<HTMLDivElement> & {
    /** Content overlaid on top of the gauge (e.g. a metric label or value). Positioned absolutely within the gauge container. */
    children?: React.ReactNode;
  };

// ─── SVG Math Utilities ─────────────────────────────────────────────────────

function polarToCartesian(
  cx: number,
  cy: number,
  r: number,
  angle: number,
  startOffset = 0,
) {
  const rad = ((angle - 180 - startOffset) * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
}

/** Round to 6 decimal places to avoid SSR hydration mismatch */
function round(n: number): number {
  return Math.round(n * 1e6) / 1e6;
}

function arcPath(
  cx: number,
  cy: number,
  r: number,
  startAngle: number,
  endAngle: number,
  startOffset = 0,
) {
  const start = polarToCartesian(cx, cy, r, startAngle, startOffset);
  const end = polarToCartesian(cx, cy, r, endAngle, startOffset);
  const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;
  return `M ${round(start.x)} ${round(start.y)} A ${r} ${r} 0 ${largeArcFlag} 1 ${round(end.x)} ${round(end.y)}`;
}

function getProgressColor(
  segments: GaugeSegment[],
  progress: number,
): string {
  let accumulated = 0;
  for (const seg of segments) {
    accumulated += seg.percent;
    if (progress <= accumulated) {
      return seg.color;
    }
  }
  return segments.at(-1)?.color ?? 'currentColor';
}

type UseGaugeOptions = Required<Omit<BaseGaugeProps, 'needle' | 'variant'>> &
  Pick<BaseGaugeProps, 'needle'>;

function useGauge({
  segments,
  progress,
  size,
  strokeWidth,
  gapDeg,
  arcGap,
  widthRatio,
  totalAngle,
  needle,
}: UseGaugeOptions) {
  const startOffset = (totalAngle - 180) / 2;
  const center = size / 2;
  const radius = center - strokeWidth;
  const innerStrokeWidth = (strokeWidth - 2) * 3;
  const innerRadius =
    radius - strokeWidth / 2 - innerStrokeWidth / 2 - arcGap;

  const progressColor = useMemo(
    () => getProgressColor(segments, progress),
    [segments, progress],
  );

  const segmentPaths = useMemo(() => {
    let cursor = 0;
    return segments.map((seg, i) => {
      const angle = (seg.percent / 100) * totalAngle;
      const start = cursor + (i === 0 ? 0 : gapDeg / 2);
      const end =
        cursor + angle - (i === segments.length - 1 ? 0 : gapDeg / 2);
      cursor += angle;
      return {
        path: arcPath(center, center, radius, start, end, startOffset),
        color: seg.color,
      };
    });
  }, [segments, center, radius, gapDeg, totalAngle, startOffset]);

  const innerArcPath = useMemo(
    () => arcPath(center, center, innerRadius, 0, totalAngle, startOffset),
    [center, innerRadius, totalAngle, startOffset],
  );

  const extraHeight =
    Math.sin((startOffset * Math.PI) / 180) * radius;
  const viewBoxHeight = size / 2 + strokeWidth + extraHeight;
  const svgWidth = size * widthRatio;

  const pathLength =
    (totalAngle / 360) * 2 * Math.PI * innerRadius;
  const dashOffset =
    pathLength * (1 - Math.min(progress, 100) / 100);

  const needleBaseWidth =
    (typeof needle === 'object' ? needle.baseWidth : undefined) ??
    DEFAULT_NEEDLE_BASE_WIDTH;
  const needleTipWidth =
    (typeof needle === 'object' ? needle.tipWidth : undefined) ??
    DEFAULT_NEEDLE_TIP_WIDTH;
  const needleTipRadius = radius - strokeWidth / 2 - arcGap;

  const tipAngularOffset =
    Math.atan(needleTipWidth / 2 / needleTipRadius) * (180 / Math.PI);
  const needleAngle =
    90 -
    startOffset +
    tipAngularOffset +
    (Math.min(progress, 100) / 100) *
      (totalAngle - 2 * tipAngularOffset);

  const needlePoints = useMemo(
    () =>
      [
        `${-needleBaseWidth / 2},0`,
        `${-needleTipWidth / 2},${needleTipRadius}`,
        `${needleTipWidth / 2},${needleTipRadius}`,
        `${needleBaseWidth / 2},0`,
      ].join(' '),
    [needleBaseWidth, needleTipWidth, needleTipRadius],
  );

  return {
    center,
    innerStrokeWidth,
    progressColor,
    segmentPaths,
    innerArcPath,
    viewBoxHeight,
    svgWidth,
    pathLength,
    dashOffset,
    needlePoints,
    needleAngle,
  };
}

type GaugeNeedleProps = {
  center: number;
  needlePoints: string;
  needleAngle: number;
};

const GaugeNeedle = React.memo(function GaugeNeedle({
  center,
  needlePoints,
  needleAngle,
}: GaugeNeedleProps) {
  const id = useId();
  const gradientId = `${id}-needle-gradient`;
  const filterId = `${id}-needle-glow`;

  return (
    <>
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="oklch(85% 0.08 255)" stopOpacity="0.0" />
          <stop offset="20%" stopColor="oklch(72% 0.12 258)" stopOpacity="0.3" />
          <stop offset="50%" stopColor="oklch(62% 0.16 262)" stopOpacity="0.6" />
          <stop offset="75%" stopColor="oklch(62% 0.16 262)" stopOpacity="1" />
          <stop offset="99%" stopColor="oklch(52% 0.2 266)" stopOpacity="1" />
        </linearGradient>
        <filter id={filterId} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="1" result="blur" />
          <feFlood floodColor="#3ddcff" floodOpacity="0.4" result="color" />
          <feComposite in="color" in2="blur" operator="in" result="glow" />
          <feMerge>
            <feMergeNode in="glow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <polygon
        points={needlePoints}
        fill={`url(#${gradientId})`}
        filter={`url(#${filterId})`}
        className={cn('transition-transform', TRANSITION)}
        style={{ willChange: 'transform' }}
        transform={`translate(${center}, ${center}) rotate(${needleAngle})`}
      />
    </>
  );
});

const Gauge = React.memo(function Gauge({
  segments,
  progress,
  variant = 'md',
  size,
  strokeWidth,
  gapDeg,
  arcGap,
  widthRatio = 1,
  needle,
  totalAngle = DEFAULT_TOTAL_ANGLE,
  children,
  className,
  style,
  ...props
}: GaugeProps) {
  const preset = SIZE_VARIANTS[variant];
  const sizeProps = {
    size: size ?? preset.size,
    strokeWidth: strokeWidth ?? preset.strokeWidth,
    arcGap: arcGap ?? preset.arcGap,
    gapDeg: gapDeg ?? preset.gapDeg,
  };

  const {
    center,
    innerStrokeWidth,
    progressColor,
    segmentPaths,
    innerArcPath,
    viewBoxHeight,
    svgWidth,
    pathLength,
    dashOffset,
    needlePoints,
    needleAngle,
  } = useGauge({
    segments,
    progress,
    widthRatio,
    totalAngle,
    needle,
    ...sizeProps,
  });

  return (
    <div
      {...props}
      className={cn('relative flex items-center justify-center', className)}
      style={{ ...style, width: svgWidth, height: viewBoxHeight }}
    >
      <svg
        className="absolute top-0 left-0"
        width={svgWidth}
        height={viewBoxHeight}
        viewBox={`0 0 ${sizeProps.size} ${viewBoxHeight}`}
        preserveAspectRatio="none"
      >
        {segmentPaths.map((seg, i) => (
          <path
            key={i}
            d={seg.path}
            fill="none"
            stroke={seg.color}
            strokeWidth={sizeProps.strokeWidth}
            className={cn('transition-[stroke]', TRANSITION)}
          />
        ))}

        <path
          d={innerArcPath}
          fill="none"
          stroke="currentColor"
          strokeWidth={innerStrokeWidth}
          opacity={0.15}
        />

        <path
          d={innerArcPath}
          fill="none"
          stroke={progressColor}
          strokeWidth={innerStrokeWidth}
          className={cn('transition-[stroke-dashoffset,stroke]', TRANSITION)}
          style={{
            strokeDasharray: pathLength,
            strokeDashoffset: dashOffset,
            willChange: 'stroke-dashoffset, stroke',
          }}
        />

        {needle && (
          <GaugeNeedle
            center={center}
            needlePoints={needlePoints}
            needleAngle={needleAngle}
          />
        )}
      </svg>

      {children}
    </div>
  );
});

export default Gauge;
