"use client";

// SnakeLoader — a tiny React loader that plays Snake on an 8×8 grid.
// Self-contained single-file build for 21st.dev. Zero runtime deps.
// Styles live in globals.css (see the demo). Original package:
// npm i @scoobynko/snake-loader — https://github.com/scoobynko/snake-loader

import { useEffect, useRef, useState, type CSSProperties } from "react";

/* ------------------------------------------------------------------ */
/* Pathing — weighted-random. Each tick, among safe directions: 60% of */
/* the time keep going straight; otherwise 70% pick the step closest to */
/* the food, 30% pick uniformly at random. Simulates a casual player.   */
/* ------------------------------------------------------------------ */

type Cell = { x: number; y: number };
type Direction = "up" | "down" | "left" | "right";

const DIRS: Record<Direction, Cell> = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

const OPPOSITE: Record<Direction, Direction> = {
  up: "down",
  down: "up",
  left: "right",
  right: "left",
};

const ALL_DIRS: Direction[] = ["up", "right", "down", "left"];

const STRAIGHT_PROBABILITY = 0.6;
const FOOD_BIAS_PROBABILITY = 0.7;

function manhattan(a: Cell, b: Cell): number {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

function inBounds(c: Cell, cols: number, rows: number): boolean {
  return c.x >= 0 && c.x < cols && c.y >= 0 && c.y < rows;
}

function isOccupied(c: Cell, snake: Cell[]): boolean {
  // Tail moves out next tick, so allow it.
  for (let i = 0; i < snake.length - 1; i++) {
    if (snake[i].x === c.x && snake[i].y === c.y) return true;
  }
  return false;
}

function nextDirection(
  snake: Cell[],
  food: Cell,
  current: Direction,
  cols: number,
  rows: number,
): Direction {
  const head = snake[0];

  const safe: { d: Direction; distance: number }[] = [];
  for (const d of ALL_DIRS) {
    if (d === OPPOSITE[current]) continue;
    const v = DIRS[d];
    const next: Cell = { x: head.x + v.x, y: head.y + v.y };
    if (!inBounds(next, cols, rows)) continue;
    if (isOccupied(next, snake)) continue;
    safe.push({ d, distance: manhattan(next, food) });
  }

  // No safe moves — keep current. The game loop will detect the collision.
  if (safe.length === 0) return current;

  const straight = safe.find((s) => s.d === current);
  if (straight && Math.random() < STRAIGHT_PROBABILITY) return straight.d;

  if (Math.random() < FOOD_BIAS_PROBABILITY) {
    let best = safe[0];
    for (let i = 1; i < safe.length; i++) {
      if (safe[i].distance < best.distance) best = safe[i];
    }
    return best.d;
  }

  return safe[Math.floor(Math.random() * safe.length)].d;
}

function step(cell: Cell, d: Direction): Cell {
  const v = DIRS[d];
  return { x: cell.x + v.x, y: cell.y + v.y };
}

/* ------------------------------------------------------------------ */
/* Game loop                                                           */
/* ------------------------------------------------------------------ */

const GRID_SIZE = 8;
const INITIAL_LENGTH = 2;
const DYING_TICKS = 12;
const MIN_INTERVAL_MS = 40;
const REDUCED_MOTION_FACTOR = 0.5;

type Status = "alive" | "dying";

interface GameState {
  snake: Cell[];
  food: Cell;
  direction: Direction;
  status: Status;
  dyingTicks: number;
}

interface GameOptions {
  speed: number;
  paused: boolean;
}

function randomEmptyCell(snake: Cell[]): Cell {
  const occupied = new Set(snake.map((c) => `${c.x},${c.y}`));
  const empty: Cell[] = [];
  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      if (!occupied.has(`${x},${y}`)) empty.push({ x, y });
    }
  }
  if (empty.length === 0) return { x: 0, y: 0 };
  return empty[Math.floor(Math.random() * empty.length)];
}

function initialState(): GameState {
  const startY = Math.floor(GRID_SIZE / 2);
  const startX = Math.max(1, Math.floor(GRID_SIZE / 4));
  const snake: Cell[] = [];
  for (let i = 0; i < INITIAL_LENGTH; i++) {
    snake.unshift({ x: startX + i, y: startY });
  }
  return {
    snake,
    food: randomEmptyCell(snake),
    direction: "right",
    status: "alive",
    dyingTicks: 0,
  };
}

function tick(state: GameState): GameState {
  if (state.status === "dying") {
    const next = state.dyingTicks + 1;
    return next >= DYING_TICKS
      ? initialState()
      : { ...state, dyingTicks: next };
  }

  const { snake, food, direction } = state;
  const nextDir = nextDirection(snake, food, direction, GRID_SIZE, GRID_SIZE);
  const head = step(snake[0], nextDir);

  const outOfBounds =
    head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE;
  const hitSelf = snake
    .slice(0, -1)
    .some((c) => c.x === head.x && c.y === head.y);

  if (outOfBounds || hitSelf) {
    return { ...state, status: "dying", dyingTicks: 0 };
  }

  const ate = head.x === food.x && head.y === food.y;
  const newSnake = ate ? [head, ...snake] : [head, ...snake.slice(0, -1)];
  const newFood = ate ? randomEmptyCell(newSnake) : food;

  return { ...state, snake: newSnake, food: newFood, direction: nextDir };
}

function computeInterval(speed: number, reducedMotion: boolean): number {
  const effective = reducedMotion ? speed * REDUCED_MOTION_FACTOR : speed;
  return Math.max(MIN_INTERVAL_MS, 1000 / Math.max(1, effective));
}

function useSnakeGame({ speed, paused }: GameOptions): GameState {
  const [state, setState] = useState<GameState>(initialState);
  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    if (paused) return;

    const mql =
      typeof window !== "undefined" && typeof window.matchMedia === "function"
        ? window.matchMedia("(prefers-reduced-motion: reduce)")
        : null;

    let interval = computeInterval(speed, mql?.matches ?? false);
    const onMotionChange = () => {
      interval = computeInterval(speed, mql?.matches ?? false);
    };
    mql?.addEventListener("change", onMotionChange);

    let rafId = 0;
    let lastTick = 0;

    const loop = (t: number) => {
      if (lastTick === 0) lastTick = t;
      if (t - lastTick >= interval) {
        lastTick = t;
        const next = tick(stateRef.current);
        stateRef.current = next;
        setState(next);
      }
      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafId);
      mql?.removeEventListener("change", onMotionChange);
    };
  }, [speed, paused]);

  return state;
}

/* ------------------------------------------------------------------ */
/* Themes                                                              */
/* ------------------------------------------------------------------ */

export type Theme = "nokia" | "neon" | "minimal" | "custom";

export interface Colors {
  snake?: string;
  food?: string;
  grid?: string;
  background?: string;
  glow?: string;
}

export interface Effects {
  glow?: boolean;
  pulse?: boolean;
}

interface ResolvedPreset {
  colors: Required<Colors>;
  effects: Required<Effects>;
}

const PRESETS: Record<Exclude<Theme, "custom">, ResolvedPreset> = {
  nokia: {
    colors: {
      snake: "#2b3a1f",
      food: "#2b3a1f",
      grid: "rgba(43, 58, 31, 0.25)",
      background: "#9ead86",
      glow: "transparent",
    },
    effects: { glow: false, pulse: false },
  },
  neon: {
    colors: {
      snake: "#00ff88",
      food: "#ff3366",
      grid: "rgba(0, 255, 136, 0.15)",
      background: "#050505",
      glow: "#00ff88",
    },
    effects: { glow: true, pulse: true },
  },
  minimal: {
    colors: {
      snake: "currentColor",
      food: "currentColor",
      grid: "transparent",
      background: "transparent",
      glow: "transparent",
    },
    effects: { glow: false, pulse: false },
  },
};

const CUSTOM_DEFAULTS: ResolvedPreset = {
  colors: {
    snake: "#e5e5e5",
    food: "#ff3366",
    grid: "rgba(255,255,255,0.15)",
    background: "#0a0a0a",
    glow: "#e5e5e5",
  },
  effects: { glow: false, pulse: false },
};

function resolveTheme(
  theme: Theme,
  userColors: Colors | undefined,
  userEffects: Effects | undefined,
): ResolvedPreset {
  const base = theme === "custom" ? CUSTOM_DEFAULTS : PRESETS[theme];
  return {
    colors: { ...base.colors, ...(userColors ?? {}) },
    effects: { ...base.effects, ...(userEffects ?? {}) },
  };
}

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export interface SnakeLoaderProps {
  theme?: Theme;
  cellSize?: number;
  speed?: number;
  colors?: Colors;
  effects?: Effects;
  paused?: boolean;
  className?: string;
  style?: CSSProperties;
  "aria-label"?: string;
}

const MIN_CELL_SIZE = 1;
const MIN_SPEED = 1;

export function SnakeLoader(props: SnakeLoaderProps) {
  const {
    theme = "nokia",
    cellSize = 3,
    speed = 10,
    colors,
    effects,
    paused = false,
    className,
    style,
    "aria-label": ariaLabel = "Loading",
  } = props;

  const safeCellSize = Math.max(MIN_CELL_SIZE, cellSize);
  const safeSpeed = Math.max(MIN_SPEED, speed);

  const resolved = resolveTheme(theme, colors, effects);
  const game = useSnakeGame({ speed: safeSpeed, paused });

  const cssVars: CSSProperties = {
    "--snake-loader-cell-size": `${safeCellSize}px`,
    "--snake-loader-snake": resolved.colors.snake,
    "--snake-loader-food": resolved.colors.food,
    "--snake-loader-grid": resolved.colors.grid,
    "--snake-loader-background": resolved.colors.background,
    "--snake-loader-glow": resolved.colors.glow,
  } as CSSProperties;

  const classes = [
    "snake-loader",
    `snake-loader--${theme}`,
    resolved.effects.pulse && "snake-loader--pulse",
    resolved.effects.glow && "snake-loader--glow",
    game.status === "dying" && "snake-loader--dying",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const gridPx = GRID_SIZE * safeCellSize;

  return (
    <div
      className={classes}
      role="progressbar"
      aria-busy="true"
      aria-label={ariaLabel}
      style={{ ...cssVars, ...style }}
    >
      <div
        className="snake-loader__grid"
        style={{
          width: gridPx,
          height: gridPx,
          gridTemplateColumns: `repeat(${GRID_SIZE}, ${safeCellSize}px)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, ${safeCellSize}px)`,
        }}
      >
        <div
          className="snake-loader__food"
          style={{ gridColumn: game.food.x + 1, gridRow: game.food.y + 1 }}
        />
        {game.snake.map((cell, i) => (
          <div
            key={i}
            className="snake-loader__cell"
            style={{ gridColumn: cell.x + 1, gridRow: cell.y + 1 }}
          />
        ))}
      </div>
    </div>
  );
}

export default SnakeLoader;
