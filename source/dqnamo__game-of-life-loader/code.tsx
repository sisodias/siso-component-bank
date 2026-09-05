"use client";
import type { CanvasHTMLAttributes } from "react";
import { useEffect, useRef } from "react";
type CanvasProps = Omit<CanvasHTMLAttributes<HTMLCanvasElement>, "children">;
export type GameOfLifeLoaderProps = CanvasProps & {
  cellColor?: string;
  cellRadius?: number;
  cellSize?: number;
  density?: number;
  fadeDuration?: number;
  gap?: number;
  maxDevicePixelRatio?: number;
  maxOpacity?: number;
  pauseWhenHidden?: boolean;
  respectReducedMotion?: boolean;
  seed?: number;
  stepInterval?: number;
};
const DEFAULT_CELL_SIZE = 16;
const DEFAULT_CELL_RADIUS = 0;
const DEFAULT_DENSITY = 0.2;
const DEFAULT_FADE_DURATION = 400;
const DEFAULT_GAP = 2;
const DEFAULT_MAX_DEVICE_PIXEL_RATIO = 2;
const DEFAULT_MAX_OPACITY = 0.18;
const DEFAULT_STEP_INTERVAL = 400;
function finiteOr(value: number | undefined, fallback: number) {
  return Number.isFinite(value) ? Number(value) : fallback;
}
function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}
function createRandom(seed: number | undefined) {
  if (!Number.isFinite(seed)) {
    return Math.random;
  }
  let state = Math.floor(Number(seed)) || 1;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
}
export function GameOfLifeLoader({
  cellColor,
  cellRadius = DEFAULT_CELL_RADIUS,
  cellSize = DEFAULT_CELL_SIZE,
  className,
  density = DEFAULT_DENSITY,
  fadeDuration = DEFAULT_FADE_DURATION,
  gap = DEFAULT_GAP,
  maxDevicePixelRatio = DEFAULT_MAX_DEVICE_PIXEL_RATIO,
  maxOpacity = DEFAULT_MAX_OPACITY,
  pauseWhenHidden = true,
  respectReducedMotion = true,
  seed,
  stepInterval = DEFAULT_STEP_INTERVAL,
  style,
  "aria-hidden": ariaHidden = true,
  ...canvasProps
}: GameOfLifeLoaderProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    const context = canvas.getContext("2d", { alpha: true });
    if (!context) {
      return;
    }
    const activeCanvas = canvas;
    const activeContext = context;
    const random = createRandom(seed);
    const resolvedCellSize = Math.max(
      2,
      Math.floor(finiteOr(cellSize, DEFAULT_CELL_SIZE)),
    );
    const resolvedCellRadius = clamp(
      finiteOr(cellRadius, DEFAULT_CELL_RADIUS),
      0,
      resolvedCellSize / 2,
    );
    const resolvedDensity = clamp(finiteOr(density, DEFAULT_DENSITY), 0, 1);
    const resolvedFadeDuration = Math.max(
      16,
      finiteOr(fadeDuration, DEFAULT_FADE_DURATION),
    );
    const resolvedGap = clamp(
      Math.floor(finiteOr(gap, DEFAULT_GAP)),
      0,
      resolvedCellSize - 1,
    );
    const resolvedMaxDevicePixelRatio = Math.max(
      1,
      finiteOr(maxDevicePixelRatio, DEFAULT_MAX_DEVICE_PIXEL_RATIO),
    );
    const resolvedMaxOpacity = clamp(
      finiteOr(maxOpacity, DEFAULT_MAX_OPACITY),
      0,
      1,
    );
    const resolvedStepInterval = Math.max(
      16,
      finiteOr(stepInterval, DEFAULT_STEP_INTERVAL),
    );
    const drawSize = Math.max(1, resolvedCellSize - resolvedGap);
    let animationFrameId = 0;
    let columns = 0;
    let rows = 0;
    let grid = new Uint8Array(0);
    let nextGrid = new Uint8Array(0);
    let opacities = new Float32Array(0);
    let lastFrameTime = 0;
    let lastSimulationTime = 0;
    let fillColor = "";
    let isVisible =
      !pauseWhenHidden || window.document.visibilityState === "visible";
    let prefersReducedMotion = false;
    const mediaQuery = respectReducedMotion
      ? window.matchMedia("(prefers-reduced-motion: reduce)")
      : null;
    if (mediaQuery) {
      prefersReducedMotion = mediaQuery.matches;
    }
    function isAlive() {
      return random() < resolvedDensity ? 1 : 0;
    }
    function resolveFillColor() {
      if (cellColor) {
        return cellColor;
      }
      const computedStyle = window.getComputedStyle(activeCanvas);
      return (
        computedStyle.getPropertyValue("--game-of-life-color").trim() ||
        computedStyle.color ||
        "rgb(120, 128, 138)"
      );
    }
    function syncFillColor() {
      fillColor = resolveFillColor();
    }
    function resizeGrid(width: number, height: number) {
      const nextColumns = Math.max(1, Math.ceil(width / resolvedCellSize));
      const nextRows = Math.max(1, Math.ceil(height / resolvedCellSize));
      if (nextColumns === columns && nextRows === rows) {
        return;
      }
      const resizedGrid = new Uint8Array(nextColumns * nextRows);
      const resizedOpacities = new Float32Array(nextColumns * nextRows);
      for (let row = 0; row < nextRows; row += 1) {
        for (let column = 0; column < nextColumns; column += 1) {
          const nextIndex = row * nextColumns + column;
          if (column < columns && row < rows) {
            const currentIndex = row * columns + column;
            resizedGrid[nextIndex] = grid[currentIndex] ?? 0;
            resizedOpacities[nextIndex] = opacities[currentIndex] ?? 0;
          } else {
            resizedGrid[nextIndex] = isAlive();
            resizedOpacities[nextIndex] = resizedGrid[nextIndex];
          }
        }
      }
      columns = nextColumns;
      rows = nextRows;
      grid = resizedGrid;
      nextGrid = new Uint8Array(resizedGrid.length);
      opacities = resizedOpacities;
    }
    function stepSimulation() {
      if (columns === 0 || rows === 0) {
        return;
      }
      for (let row = 0; row < rows; row += 1) {
        const rowAbove = row === 0 ? rows - 1 : row - 1;
        const rowBelow = row === rows - 1 ? 0 : row + 1;
        for (let column = 0; column < columns; column += 1) {
          const columnLeft = column === 0 ? columns - 1 : column - 1;
          const columnRight = column === columns - 1 ? 0 : column + 1;
          const index = row * columns + column;
          const liveNeighbors =
            grid[rowAbove * columns + columnLeft] +
            grid[rowAbove * columns + column] +
            grid[rowAbove * columns + columnRight] +
            grid[row * columns + columnLeft] +
            grid[row * columns + columnRight] +
            grid[rowBelow * columns + columnLeft] +
            grid[rowBelow * columns + column] +
            grid[rowBelow * columns + columnRight];
          nextGrid[index] =
            grid[index] === 1
              ? liveNeighbors === 2 || liveNeighbors === 3
                ? 1
                : 0
              : liveNeighbors === 3
                ? 1
                : 0;
        }
      }
      const previousGrid = grid;
      grid = nextGrid;
      nextGrid = previousGrid;
    }
    function updateOpacities(deltaTime: number) {
      const change = deltaTime / resolvedFadeDuration;
      for (let index = 0; index < opacities.length; index += 1) {
        const target = grid[index] ?? 0;
        const current = opacities[index] ?? 0;
        if (current < target) {
          opacities[index] = Math.min(target, current + change);
        } else if (current > target) {
          opacities[index] = Math.max(target, current - change);
        }
      }
    }
    function draw() {
      const devicePixelRatio = Math.min(
        resolvedMaxDevicePixelRatio,
        window.devicePixelRatio || 1,
      );
      activeContext.setTransform(1, 0, 0, 1, 0, 0);
      activeContext.clearRect(0, 0, activeCanvas.width, activeCanvas.height);
      activeContext.setTransform(
        devicePixelRatio,
        0,
        0,
        devicePixelRatio,
        0,
        0,
      );
      activeContext.fillStyle = fillColor;
      let index = 0;
      for (let row = 0; row < rows; row += 1) {
        for (let column = 0; column < columns; column += 1) {
          const opacity = opacities[index] ?? 0;
          if (opacity > 0.001) {
            activeContext.globalAlpha = opacity * resolvedMaxOpacity;
            const x = column * resolvedCellSize;
            const y = row * resolvedCellSize;
            const radius = Math.min(resolvedCellRadius, drawSize / 2);
            if (radius > 0 && "roundRect" in activeContext) {
              activeContext.beginPath();
              activeContext.roundRect(x, y, drawSize, drawSize, radius);
              activeContext.fill();
            } else {
              activeContext.fillRect(x, y, drawSize, drawSize);
            }
          }
          index += 1;
        }
      }
      activeContext.globalAlpha = 1;
    }
    function resizeCanvas(width: number, height: number) {
      const cssWidth = Math.max(1, Math.floor(width));
      const cssHeight = Math.max(1, Math.floor(height));
      const devicePixelRatio = Math.min(
        resolvedMaxDevicePixelRatio,
        window.devicePixelRatio || 1,
      );
      const canvasWidth = Math.max(1, Math.floor(cssWidth * devicePixelRatio));
      const canvasHeight = Math.max(
        1,
        Math.floor(cssHeight * devicePixelRatio),
      );
      if (
        activeCanvas.width !== canvasWidth ||
        activeCanvas.height !== canvasHeight
      ) {
        activeCanvas.width = canvasWidth;
        activeCanvas.height = canvasHeight;
      }
      resizeGrid(cssWidth, cssHeight);
      syncFillColor();
      draw();
    }
    function stopLoop() {
      if (animationFrameId) {
        window.cancelAnimationFrame(animationFrameId);
        animationFrameId = 0;
      }
    }
    function loop(time: number) {
      if (!isVisible || prefersReducedMotion) {
        animationFrameId = 0;
        return;
      }
      if (!lastFrameTime) {
        lastFrameTime = time;
        lastSimulationTime = time;
      }
      const deltaTime = Math.min(100, time - lastFrameTime);
      lastFrameTime = time;
      if (time - lastSimulationTime >= resolvedStepInterval) {
        stepSimulation();
        lastSimulationTime = time;
      }
      updateOpacities(deltaTime);
      draw();
      animationFrameId = window.requestAnimationFrame(loop);
    }
    function startLoop() {
      if (animationFrameId || !isVisible || prefersReducedMotion) {
        draw();
        return;
      }
      lastFrameTime = 0;
      lastSimulationTime = 0;
      animationFrameId = window.requestAnimationFrame(loop);
    }
    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) {
        return;
      }
      resizeCanvas(entry.contentRect.width, entry.contentRect.height);
      startLoop();
    });
    const colorObserver = new MutationObserver(() => {
      syncFillColor();
      draw();
    });
    function handleVisibilityChange() {
      isVisible =
        !pauseWhenHidden || window.document.visibilityState === "visible";
      if (isVisible) {
        startLoop();
      } else {
        stopLoop();
      }
    }
    function handleMotionPreferenceChange(event: MediaQueryListEvent) {
      prefersReducedMotion = event.matches;
      if (prefersReducedMotion) {
        stopLoop();
        draw();
      } else {
        startLoop();
      }
    }
    resizeObserver.observe(activeCanvas);
    colorObserver.observe(window.document.documentElement, {
      attributeFilter: ["class", "style", "data-theme"],
      attributes: true,
    });
    colorObserver.observe(window.document.body, {
      attributeFilter: ["class", "style", "data-theme"],
      attributes: true,
    });
    colorObserver.observe(activeCanvas, {
      attributeFilter: ["class", "style"],
      attributes: true,
    });
    window.document.addEventListener(
      "visibilitychange",
      handleVisibilityChange,
    );
    mediaQuery?.addEventListener("change", handleMotionPreferenceChange);
    return () => {
      stopLoop();
      resizeObserver.disconnect();
      colorObserver.disconnect();
      window.document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange,
      );
      mediaQuery?.removeEventListener("change", handleMotionPreferenceChange);
    };
  }, [
    cellColor,
    cellRadius,
    cellSize,
    density,
    fadeDuration,
    gap,
    maxDevicePixelRatio,
    maxOpacity,
    pauseWhenHidden,
    respectReducedMotion,
    seed,
    stepInterval,
  ]);
  return (
    <canvas
      {...canvasProps}
      aria-hidden={ariaHidden}
      className={className}
      ref={canvasRef}
      style={{ display: "block", height: "100%", width: "100%", ...style }}
    />
  );
}
export type { GameOfLifeLoaderProps as GameOfLifeProps };
export { GameOfLifeLoader as GameOfLife };
export default GameOfLifeLoader;