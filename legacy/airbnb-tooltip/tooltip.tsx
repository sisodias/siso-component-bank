// src/components/ui/component.tsx

import React, { useState, useCallback } from 'react';
import {
  Tooltip,
  TooltipWithBounds,
  useTooltip,
  useTooltipInPortal,
  defaultStyles,
} from '@visx/tooltip';
import { cn } from "../_utils/cn"; 
type TooltipData = string;

const positionIndicatorSize = 8;

const defaultTooltipStyles = {
  ...defaultStyles,
  backgroundColor: 'rgba(53,71,125,0.8)',
  color: 'white',
  width: 152,
  height: 'auto', 
  minHeight: 72,
  padding: 12,
  borderRadius: '4px',
  boxShadow: '0px 2px 10px rgba(0,0,0,0.2)',
};

export interface ComponentProps {
  width: number;
  height: number;
  showControls?: boolean;
  initialTooltipData?: TooltipData;
  tooltipStyles?: React.CSSProperties;
}

export const Component: React.FC<ComponentProps> = ({
  width,
  height,
  showControls = true,
  initialTooltipData = 'Move me with your mouse or finger',
  tooltipStyles = defaultTooltipStyles,
}) => {
  const [tooltipShouldDetectBounds, setTooltipShouldDetectBounds] = useState(true);
  const [renderTooltipInPortal, setRenderTooltipInPortal] = useState(false);

  const { containerRef, containerBounds, TooltipInPortal } = useTooltipInPortal({
    scroll: true,
    detectBounds: tooltipShouldDetectBounds,
  });

  const {
    showTooltip,
    hideTooltip,
    tooltipOpen,
    tooltipData,
    tooltipLeft = 0,
    tooltipTop = 0,
  } = useTooltip<TooltipData>({
    tooltipOpen: true,
    tooltipLeft: width / 3,
    tooltipTop: height / 3,
    tooltipData: initialTooltipData,
  });

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      const containerX = ('clientX' in event ? event.clientX : 0) - (containerBounds?.left ?? 0);
      const containerY = ('clientY' in event ? event.clientY : 0) - (containerBounds?.top ?? 0);
      showTooltip({
        tooltipLeft: containerX,
        tooltipTop: containerY,
        tooltipData: tooltipShouldDetectBounds
          ? 'I detect my container boundary'
          : 'I will get clipped by my container',
      });
    },
    [showTooltip, tooltipShouldDetectBounds, containerBounds],
  );

  const CurrentTooltipComponent = renderTooltipInPortal
    ? TooltipInPortal
    : tooltipShouldDetectBounds
    ? TooltipWithBounds
    : Tooltip;

  // Basic styles that were in <style jsx>. These could be moved to a global CSS file.
  const styles = `
    .tooltip-interactive-container {
      z-index: 0;
      position: relative;
      overflow: hidden; /* Important for non-portal, non-bounds-detecting tooltip clipping */
      border-radius: 16px;
      background: linear-gradient(45deg, #6c5b7b, #c06c84, #f67280);
      font-size: 14px;
      color: white;
      width: 100%;
      height: 100%;
      cursor: crosshair;
    }
    .tooltip-position-indicator {
      width: ${positionIndicatorSize}px;
      height: ${positionIndicatorSize}px;
      border-radius: 50%;
      background: #35477d;
      position: absolute;
      pointer-events: none; /* So it doesn't interfere with pointer move */
    }
    .tooltip-crosshair {
      position: absolute;
      top: 0;
      left: 0;
      pointer-events: none;
    }
    .tooltip-crosshair.horizontal {
      width: 100%;
      height: 1px;
      border-top: 1px dashed #35477d;
    }
    .tooltip-crosshair.vertical {
      height: 100%;
      width: 1px;
      border-left: 1px dashed #35477d;
    }
    .tooltip-no-tooltip-message {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      pointer-events: none;
    }
    .tooltip-z-index-bummer {
      position: absolute;
      right: 12%;
      bottom: 20%;
      max-width: 190px;
      z-index: 2000; /* Higher than tooltip without portal */
      background: rgba(255, 255, 255, 0.8);
      color: #35477d;
      border-radius: 8px;
      padding: 16px;
      line-height: 1.2em;
      font-size: 12px;
    }
  `;

  if (width < 10 || height < 10) return null;

  return (
    <>
      <style>{styles}</style>
      <div
        ref={containerRef}
        className="tooltip-interactive-container"
        style={{ width, height }}
        onPointerMove={handlePointerMove}
      >
        {tooltipOpen ? (
          <>
            <div
              className="tooltip-position-indicator"
              style={{
                transform: `translate(${tooltipLeft - positionIndicatorSize / 2}px, ${
                  tooltipTop - positionIndicatorSize / 2
                }px)`,
              }}
            />
            <div
              className="tooltip-crosshair horizontal"
              style={{ transform: `translateY(${tooltipTop}px)` }}
            />
            <div
              className="tooltip-crosshair vertical"
              style={{ transform: `translateX(${tooltipLeft}px)` }}
            />
            <CurrentTooltipComponent
              key={Math.random()}
              left={tooltipLeft}
              top={tooltipTop}
              style={tooltipStyles}
            >
              {tooltipData}
              <br />
              <br />
              <strong>left</strong> {tooltipLeft?.toFixed(0)}px  
              <strong>top</strong> {tooltipTop?.toFixed(0)}px
            </CurrentTooltipComponent>
          </>
        ) : (
          <div className="tooltip-no-tooltip-message">Move or touch to see the tooltip</div>
        )}
        <div className="tooltip-z-index-bummer">
          I have an annoying z-index. Try 
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              className="form-checkbox h-4 w-4"
              defaultChecked={renderTooltipInPortal}
              onClick={(e) => {
                e.stopPropagation();
                setRenderTooltipInPortal(!renderTooltipInPortal);
              }}
            />
            <span className="ml-1">rendering in Portal</span>
          </label>
           
          <span role="img" aria-label="yay">🥳</span>
        </div>
      </div>
      {showControls && (
        <div className={cn("p-4 space-y-2 bg-gray-100 text-sm rounded-b-lg border-t")}>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              className="form-checkbox"
              checked={tooltipShouldDetectBounds}
              onChange={() => setTooltipShouldDetectBounds(!tooltipShouldDetectBounds)}
            />
            <span>Tooltip with boundary detection</span>
          </label>
          <button
            className={cn(
              "px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            )}
            onClick={() => hideTooltip()}
          >
            Hide tooltip
          </button>
        </div>
      )}
    </>
  );
};