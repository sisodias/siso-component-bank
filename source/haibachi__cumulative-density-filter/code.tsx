/**
 * Cumulative Density Filter Component
 * 
 * A responsive chart component that displays a cumulative distribution with 
 * an interactive draggable threshold for filtering numeric data.
 * 
 * @example
 * ```tsx
 * <Component
 *   values={[10, 20, 30, 40, 50]}
 *   filterMode="lte"
 *   onThresholdChange={(threshold, count) => console.log(threshold, count)}
 * />
 * ```
 */

import React, { useMemo, useRef, useState, useCallback, useEffect, ReactNode } from 'react';
import { computeTicks, getCountAtThreshold as utilGetCountAtThreshold, thresholdToPercentage } from '../../lib/utils';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

/**
 * Formats a number with K, M, B suffixes for readability
 * @param value - The number to format
 * @param sigFigs - Number of significant figures (default: 2)
 * @returns Formatted string (e.g., "1.5K", "2.3M", "1.2B")
 */
function formatNumberWithSuffix(value: number, sigFigs = 2): string {
  const abs = Math.abs(value);
  const sign = value < 0 ? '-' : '';

  if (abs === 0) return '0';

  let formatted: string;
  let suffix = '';

  if (abs >= 1e9) {
    formatted = (abs / 1e9).toPrecision(sigFigs);
    suffix = 'B';
  } else if (abs >= 1e6) {
    formatted = (abs / 1e6).toPrecision(sigFigs);
    suffix = 'M';
  } else if (abs >= 1e3) {
    formatted = (abs / 1e3).toPrecision(sigFigs);
    suffix = 'K';
  } else {
    formatted = abs.toPrecision(sigFigs);
  }

  // Remove trailing zeros after decimal point
  formatted = parseFloat(formatted).toString();

  return sign + formatted + suffix;
}

interface ThresholdLabelProps {
  viewBox?: {
    x?: number;
    y?: number;
    height?: number;
  };
  count: number;
  total: number;
  thresholdColor: string;
  onMouseDown: (e?: React.MouseEvent) => void;
  showLabel: boolean;
}

// Custom label component for the threshold line
function ThresholdLabel({ viewBox, count, total, thresholdColor, onMouseDown, showLabel }: ThresholdLabelProps) {
  if (!viewBox || !viewBox.x || !viewBox.y || !viewBox.height) return null;

  const { x, y, height } = viewBox;

  return (
    <g>
      {/* Count label at top (optional, since we render HTML overlay instead) */}
      {showLabel && (
        <g transform={`translate(${x}, ${y - 5})`} data-testid="cdf-threshold-label">
          <rect x="-30" y="-20" width="60" height="20" fill={thresholdColor} rx="4" />
          <text x="0" y="-6" textAnchor="middle" fill="white" fontSize="12" fontWeight="500">
            {count} / {total}
          </text>
        </g>
      )}

      {/* Draggable handle at bottom - with larger invisible hitbox */}
      <g transform={`translate(${x}, ${y + height})`}>
        {/* Invisible larger hitbox for easier dragging */}
        <rect
          data-testid="cdf-handle-hitbox"
          x="-20"
          y="-10"
          width="40"
          height="40"
          fill="transparent"
          style={{ cursor: 'ew-resize', pointerEvents: 'all' }}
          onMouseDown={(e) => onMouseDown(e as React.MouseEvent)}
        />
        {/* Visible handle */}
        <rect
          x="-14"
          y="0"
          width="28"
          height="24"
          fill={thresholdColor}
          stroke="var(--background, #ffffff)"
          strokeWidth="2"
          rx="4"
          style={{ pointerEvents: 'none' }}
        />
        {/* Left-right arrow icon */}
        <path
          d="M -6 12 L -3 9 M -6 12 L -3 15 M -6 12 L 6 12 M 6 12 L 3 9 M 6 12 L 3 15"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          style={{ pointerEvents: 'none' }}
        />
      </g>
    </g>
  );
}

export interface CumulativeDensityFilterProps {
  /** Array of numeric values to visualize */
  values: number[];
  /** Initial threshold position (defaults to midpoint) */
  initialThreshold?: number;
  /** Comparison operator for filtering */
  filterMode?: 'lt' | 'lte' | 'gt' | 'gte';
  /** Use logarithmic scale for X-axis */
  logScale?: boolean;
  /** Number of ticks on X-axis (defaults to auto) */
  xAxisTicks?: number;
  /** Color for the threshold marker and line (defaults to red #ef4444) */
  thresholdColor?: string;
  /** Callback fired when threshold changes */
  onThresholdChange?: (threshold: number, count: number) => void;
  /** Show the threshold count label above the line */
  showThresholdLabel?: boolean;
  /** Optional custom tooltip renderer. If provided, used as <Tooltip content={renderTooltip} /> */
  renderTooltip?: (ctx: { active?: boolean; payload?: Array<{ value?: unknown }>; label?: string | number }) => ReactNode;
  /** Height of the component in pixels */
  height?: number;
  /** Additional CSS classes */
  className?: string;
}

export function Component({
  values,
  initialThreshold,
  filterMode = 'lte',
  logScale = false,
  xAxisTicks,
  thresholdColor = '#ef4444',
  onThresholdChange,
  renderTooltip,
  showThresholdLabel = true,
  height = 200,
  className = '',
}: CumulativeDensityFilterProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const isDraggingRef = useRef(false);
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  // Get primary color - supports both hsl(var(--primary)) and direct color values
  const primaryColor = useMemo(() => {
    if (typeof window === 'undefined') return '#3b82f6';
    const root = getComputedStyle(document.documentElement);
    const primaryVar = root.getPropertyValue('--primary').trim();
    // If --primary exists and is in HSL format (e.g., "221.2 83.2% 53.3%")
    if (primaryVar && primaryVar.match(/[\d.]+\s+[\d.]+%\s+[\d.]+%/)) {
      return `hsl(${primaryVar})`;
    }
    // Fallback to blue
    return '#3b82f6';
  }, []);

  // Calculate cumulative distribution data
  const { chartData, minValue, maxValue, sortedValues } = useMemo(() => {
    setIsLoading(true);
    if (!values.length) {
      return { chartData: [], minValue: 0, maxValue: 0, sortedValues: [] as number[] };
    }

    const sorted = [...values].sort((a, b) => a - b);
    const min = sorted[0]!;
    const max = sorted[sorted.length - 1]!;

    // Handle edge case where all values are the same
    if (min === max) {
      return {
        chartData: [
          { value: min, count: 0 },
          { value: min, count: sorted.length },
        ],
        minValue: min,
        maxValue: min,
        sortedValues: sorted,
      };
    }

    // For small datasets, plot actual data points; for large datasets, create bins
    const data: Array<{ value: number; count: number }> = [];

    if (sorted.length <= 50) {
      // Plot actual data points for small datasets
      sorted.forEach((value, index) => {
        data.push({
          value: value,
          count: index + 1,
        });
      });
    } else {
      // Create bins for smooth distribution on large datasets
      const binCount = Math.min(100, sorted.length);
      const binSize = (max - min) / binCount;
      let currentIndex = 0;

      for (let i = 0; i <= binCount; i++) {
        const binValue = min + i * binSize;

        // Count all values up to this bin
        while (currentIndex < sorted.length && sorted[currentIndex]! <= binValue) {
          currentIndex++;
        }

        data.push({
          value: binValue,
          count: currentIndex,
        });
      }
    }
    
    return { chartData: data, minValue: min, maxValue: max, sortedValues: sorted };
  }, [values]);

  // Initialize threshold
  const [threshold, setThreshold] = useState(
    initialThreshold ?? (minValue + maxValue) / 2
  );

  const getCountAtThreshold = useCallback((t: number): number => {
    return utilGetCountAtThreshold(filterMode, sortedValues, t);
  }, [sortedValues, filterMode]);

  const currentCount = useMemo(() => getCountAtThreshold(threshold), [getCountAtThreshold, threshold]);

  // Set loading to false once data is ready
  useEffect(() => {
    if (chartData.length > 0) {
      // Small delay to ensure smooth transition
      const timer = setTimeout(() => setIsLoading(false), 100);
      return () => clearTimeout(timer);
    }
  }, [chartData]);

  // Handle drag
  const handleMouseDown = useCallback((e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    isDraggingRef.current = true;
    setIsDragging(true);
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent | React.MouseEvent) => {
      if (!isDraggingRef.current || !chartRef.current) return;

      // Get chart dimensions for drag calculation
      const svg = chartRef.current.querySelector('svg');
      if (!svg) return;

      // Find the actual plotting area
      const plotEl =
        svg.querySelector('.recharts-cartesian-grid-bg') ||
        svg.querySelector('.recharts-cartesian-grid') ||
        svg;

      if (plotEl) {
        const rect = (plotEl as Element).getBoundingClientRect();
        const x = e.clientX - rect.left;
        const percentage = Math.max(0, Math.min(1, x / rect.width || 1));

        let newThreshold: number;
        if (logScale && minValue > 0) {
          // Log scale interpolation
          const logMin = Math.log(minValue);
          const logMax = Math.log(maxValue);
          newThreshold = Math.exp(logMin + percentage * (logMax - logMin));
        } else {
          // Linear interpolation
          newThreshold = minValue + percentage * (maxValue - minValue);
        }

        setThreshold(newThreshold);

        const count = getCountAtThreshold(newThreshold);
        onThresholdChange?.(newThreshold, count);
      }
    },
    [minValue, maxValue, logScale, getCountAtThreshold, onThresholdChange]
  );

  const handleMouseUp = useCallback(() => {
    isDraggingRef.current = false;
    setIsDragging(false);
  }, []);

  // Mouse event listeners
  React.useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
    return undefined;
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Calculate custom X-axis ticks
  const xAxisTickValues = useMemo(
    () => computeTicks(minValue, maxValue, logScale, containerWidth, xAxisTicks),
    [xAxisTicks, minValue, maxValue, logScale, containerWidth]
  );

  // Observe width to support auto tick calculation
  useEffect(() => {
    if (!chartRef.current) return;
    const el = chartRef.current;
    const update = () => {
      const rect = el.getBoundingClientRect();
      setContainerWidth(rect.width);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Calculate threshold position percentage
  const thresholdPercentage = useMemo(
    () => thresholdToPercentage(minValue, maxValue, threshold, logScale),
    [threshold, minValue, maxValue, logScale]
  );

  if (!chartData.length) {
    return (
      <div className={`flex items-center justify-center ${className}`} style={{ height }}>
        <p className="text-sm text-muted-foreground">No data available</p>
      </div>
    );
  }

  // Show skeleton while loading
  if (isLoading) {
    return (
      <div className={`relative ${className}`} style={{ height }}>
        <div className="w-full h-full animate-pulse">
          <div className="h-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} style={{ height }}>
      <div ref={chartRef} className="relative w-full h-full cd-filter-overflow">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 30, right: 10, left: 0, bottom: 5 }}
          >
            <defs>
              <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={primaryColor} stopOpacity={0.3} />
                <stop offset="95%" stopColor={primaryColor} stopOpacity={0.05} />
              </linearGradient>

              {/* Gradient mask based on filter mode */}
              <linearGradient id="fillMask" x1="0%" y1="0" x2="100%" y2="0">
                {(filterMode === 'lt' || filterMode === 'lte') ? (
                  <>
                    <stop offset="0%" stopOpacity="1" />
                    <stop offset={`${thresholdPercentage}%`} stopOpacity="1" />
                    <stop offset={`${thresholdPercentage}%`} stopOpacity="0" />
                    <stop offset="100%" stopOpacity="0" />
                  </>
                ) : (
                  <>
                    <stop offset="0%" stopOpacity="0" />
                    <stop offset={`${thresholdPercentage}%`} stopOpacity="0" />
                    <stop offset={`${thresholdPercentage}%`} stopOpacity="1" />
                    <stop offset="100%" stopOpacity="1" />
                  </>
                )}
              </linearGradient>

              {/* Combined gradient */}
              <linearGradient id="maskedFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={primaryColor} stopOpacity={0.3} />
                <stop offset="95%" stopColor={primaryColor} stopOpacity={0.05} />
              </linearGradient>

              <mask id="thresholdMask">
                <rect x="0" y="0" width="100%" height="100%" fill="url(#fillMask)" />
              </mask>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border, #e5e7eb)" />
            <XAxis
              dataKey="value"
              type="number"
              scale={logScale ? 'log' : 'linear'}
              domain={[minValue, maxValue]}
              ticks={xAxisTickValues}
              tickFormatter={(value) => formatNumberWithSuffix(value, 2)}
              tick={{ fill: '#6b7280', fontSize: 12 }}
            />
            <YAxis
              width={30}
              tick={{ fill: '#6b7280', fontSize: 12 }}
              tickFormatter={(value) => Math.round(Number(value)).toString()}
            />
            <Tooltip
              cursor={{ stroke: 'var(--muted-foreground, #9ca3af)', strokeDasharray: 4 }}
              content={renderTooltip ?? (({ active, payload, label }) => {
                if (!active || !payload || payload.length === 0) return null;
                const first = payload[0];
                const count = Number(first?.value ?? 0);
                const numericLabel = typeof label === 'number' ? label : Number(label ?? 0);
                const valueLabel = formatNumberWithSuffix(numericLabel, 2);
                return (
                  <div
                    className="rounded-md shadow-sm"
                    style={{
                      background: 'var(--popover, #ffffff)',
                      border: '1px solid var(--border, #e5e7eb)',
                      color: 'var(--popover-foreground, #000000)',
                      padding: '8px 10px',
                      fontSize: 12,
                    }}
                  >
                    <div className="font-medium">Value: {valueLabel}</div>
                    <div>Count: {count}</div>
                  </div>
                );
              })}
            />
            {/* Filled area based on filter mode - render first */}
            <Area
              type="monotone"
              dataKey="count"
              stroke="none"
              fill="url(#maskedFill)"
              isAnimationActive={false}
              style={{
                clipPath: (filterMode === 'lt' || filterMode === 'lte')
                  ? `inset(0 ${100 - thresholdPercentage}% 0 0)`
                  : `inset(0 0 0 ${thresholdPercentage}%)`
              }}
            />
            {/* Main outline - render on top for visibility */}
            <Area
              type="monotone"
              dataKey="count"
              stroke={primaryColor}
              strokeWidth={2}
              fill="none"
              isAnimationActive={false}
            />
            
            {/* Threshold line using Recharts ReferenceLine for accurate positioning */}
            <ReferenceLine
              x={threshold}
              stroke={thresholdColor || '#ef4444'}
              strokeWidth={2}
              strokeOpacity={0.8}
              label={(props: unknown) => (
                <ThresholdLabel
                  {...(props as object)}
                  count={currentCount}
                  total={values.length}
                  thresholdColor={thresholdColor || '#ef4444'}
                  onMouseDown={handleMouseDown}
                  showLabel={showThresholdLabel}
                />
              )}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Value display (non-interactive to avoid blocking nearby controls) */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-muted-foreground px-1 pointer-events-none">
        <span></span>
        <span className="font-medium text-foreground">
          {filterMode === 'lt' && '< '}
          {filterMode === 'lte' && '≤ '}
          {filterMode === 'gt' && '> '}
          {filterMode === 'gte' && '≥ '}
          {formatNumberWithSuffix(threshold, 2)}
        </span>
        <span></span>
      </div>
    </div>
  );
}