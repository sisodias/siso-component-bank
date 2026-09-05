import React, { useEffect, useRef } from "react";

type ThemeMode = "light" | "dark";

type Vec = { x: number; y: number };

type Neuron = {
  baseX: number;
  baseY: number;
  radius: number;
  moveX: number;
  moveY: number;
  speed: number;
  phase: number;
  depth: number;
  shape: number[];
};

type Edge = {
  a: number;
  b: number;
  length: number;
  curve: number;
};

type Signal = {
  edgeIndex: number;
  t: number;
  direction: 1 | -1;
  speed: number;
  size: number;
  strength: number;
};

type Props = {
  theme?: ThemeMode;
  className?: string;
  config?: Partial<typeof DEFAULT_CONFIG>;
};

/**
 * =========================
 * CONFIG — TUNE HERE
 * =========================
 *
 * signalActivityOverall:
 *   0   -> very few signals overall
 *   1   -> about 80% of all connections can be active
 *
 * signalActivityNearMouse:
 *   0   -> mouse barely increases activity
 *   1   -> all eligible connections touching neurons in mouse proximity
 *          try to become active (still max 1 signal per connection)
 *
 * neuronDensity:
 *   higher -> more neurons
 *   lower  -> fewer neurons
 */
const DEFAULT_CONFIG = {
  // Network density / layout
  neuronDensity: 2.15,
  minNeurons: 56,
  areaPerNeuron: 8200,
  neuronRadiusMin: 4.8,
  neuronRadiusMax: 7.2,
  nonOverlapGap: 8,
  localConnectionDistanceRatio: 0.16,
  localConnectionDistanceMin: 84,
  localConnectionDistanceMax: 150,
  maxConnectionsPerNeuron: 4,

  // Motion
  movementAmplitudeMin: 0.8,
  movementAmplitudeMax: 2.1,
  movementSpeedMin: 0.25,
  movementSpeedMax: 0.55,

  // Signals
  signalActivityOverall: 0.34, // 0..1
  signalActivityNearMouse: 0.72, // 0..1
  signalSizeScale: 0.9,
  signalSpeedMin: 0.22,
  signalSpeedMax: 0.34,
  signalStrengthMin: 0.72,
  signalStrengthMax: 1.0,

  // Mouse interaction
  mouseInfluenceRadius: 150,
  parallaxStrength: 7,

  // Visual polish
  gridGap: 28,
  gridOpacityLight: 0.075,
  gridOpacityDark: 0.13,
  gridAccentEvery: 4,
  gridAccentOpacityMultiplier: 1.8,
  sweepEnabled: true,
  sweepDurationMs: 6600,
  sweepWidth: 200,
  sweepOpacityLight: 0.1,
  sweepOpacityDark: 0.5,
  opacity: 1
};

const TAU = Math.PI * 2;

const THEMES = {
  light: {
    bgGlow: "120,170,255",
    grid: "150,175,235",
    neuronFillA: "255,255,255",
    neuronFillB: "232,241,255",
    neuronStroke: "70,105,190",
    neuronCore: "95,135,220",
    synapse: "120,150,220",
    synapseHot: "70,170,255",
    signalCore: "110,220,255",
    signalGlow: "90,180,255",
    spark: "255,255,255",
    mouseGlow: "100,180,255",
    sweep: "140,190,255",
  },
  dark: {
    bgGlow: "0,210,255",
    grid: "125,125,125",
    neuronFillA: "10,24,38",
    neuronFillB: "18,40,62",
    neuronStroke: "0,220,255",
    neuronCore: "120,245,255",
    synapse: "40,150,210",
    synapseHot: "0,240,255",
    signalCore: "150,255,255",
    signalGlow: "0,220,255",
    spark: "255,255,255",
    mouseGlow: "0,255,255",
    sweep: "0,220,255",
  },
};

function rgba(rgb: string, a: number) {
  return `rgba(${rgb}, ${a})`;
}

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function dist(a: Vec, b: Vec) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  return Math.sqrt(dx * dx + dy * dy);
}

function edgeKey(a: number, b: number) {
  return a < b ? `${a}-${b}` : `${b}-${a}`;
}

function quadraticPoint(p0: Vec, p1: Vec, p2: Vec, t: number): Vec {
  const mt = 1 - t;
  return {
    x: mt * mt * p0.x + 2 * mt * t * p1.x + t * t * p2.x,
    y: mt * mt * p0.y + 2 * mt * t * p1.y + t * t * p2.y,
  };
}

function quadraticTangent(p0: Vec, p1: Vec, p2: Vec, t: number): Vec {
  return {
    x: 2 * (1 - t) * (p1.x - p0.x) + 2 * t * (p2.x - p1.x),
    y: 2 * (1 - t) * (p1.y - p0.y) + 2 * t * (p2.y - p1.y),
  };
}

function controlPoint(a: Vec, b: Vec, curve: number): Vec {
  const mx = (a.x + b.x) * 0.5;
  const my = (a.y + b.y) * 0.5;
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.max(1, Math.sqrt(dx * dx + dy * dy));
  const nx = -dy / len;
  const ny = dx / len;

  return {
    x: mx + nx * curve,
    y: my + ny * curve,
  };
}

function createShape(pointCount: number) {
  return Array.from({ length: pointCount }, () => rand(0.86, 1.14));
}

function overallTargetRatio(v: number) {
  return lerp(0.025, 0.8, clamp(v, 0, 1));
}

function overallSpawnRate(v: number) {
  return lerp(1.0, 36.0, clamp(v, 0, 1));
}

function mouseExtraSpawnRate(v: number) {
  return lerp(0.0, 80.0, clamp(v, 0, 1));
}

export const Component = ({
  theme = "light",
  className = "",
  config,
}: Props) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const cfg = { ...DEFAULT_CONFIG, ...config };
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const palette = THEMES[theme];
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let width = 0;
    let height = 0;
    let raf = 0;
    let lastTime = performance.now();
    let spawnAccumulator = 0;

    let neurons: Neuron[] = [];
    let edges: Edge[] = [];
    let signals: Signal[] = [];

    let reducedMotion = false;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    reducedMotion = media.matches;

    const mouse = {
      x: 0,
      y: 0,
      inside: false,
    };

    const onMotionChange = () => {
      reducedMotion = media.matches;
    };

    if (media.addEventListener) {
      media.addEventListener("change", onMotionChange);
    } else {
      media.addListener(onMotionChange);
    }

    function getTargetNeuronCount(area: number) {
      return Math.max(
        cfg.minNeurons,
        Math.floor((area / cfg.areaPerNeuron) * cfg.neuronDensity)
      );
    }

    function createNeurons() {
      const area = width * height;
      const target = getTargetNeuronCount(area);
      const placed: Neuron[] = [];
      const maxAttempts = target * 240;
      const padding = 18;

      let attempts = 0;
      while (placed.length < target && attempts < maxAttempts) {
        attempts++;

        const radius = rand(cfg.neuronRadiusMin, cfg.neuronRadiusMax);
        const move = reducedMotion ? 0 : rand(cfg.movementAmplitudeMin, cfg.movementAmplitudeMax);

        const candidate: Neuron = {
          baseX: rand(padding + radius, width - padding - radius),
          baseY: rand(padding + radius, height - padding - radius),
          radius,
          moveX: move,
          moveY: move,
          speed: rand(cfg.movementSpeedMin, cfg.movementSpeedMax),
          phase: rand(0, TAU),
          depth: rand(0.45, 1.0),
          shape: createShape(6 + Math.floor(Math.random() * 3)),
        };

        let overlaps = false;
        for (const n of placed) {
          const minDistance =
            n.radius +
            candidate.radius +
            cfg.nonOverlapGap +
            n.moveX +
            candidate.moveX +
            2;

          if (
            dist(
              { x: n.baseX, y: n.baseY },
              { x: candidate.baseX, y: candidate.baseY }
            ) < minDistance
          ) {
            overlaps = true;
            break;
          }
        }

        if (!overlaps) {
          placed.push(candidate);
        }
      }

      neurons = placed;
    }

    function buildEdges() {
      const nextEdges: Edge[] = [];
      const set = new Set<string>();
      const degree = new Array(neurons.length).fill(0);

      const proximity = clamp(
        Math.min(width, height) * cfg.localConnectionDistanceRatio,
        cfg.localConnectionDistanceMin,
        cfg.localConnectionDistanceMax
      );

      const candidates: { a: number; b: number; d: number }[] = [];

      for (let i = 0; i < neurons.length; i++) {
        for (let j = i + 1; j < neurons.length; j++) {
          const d = dist(
            { x: neurons[i].baseX, y: neurons[i].baseY },
            { x: neurons[j].baseX, y: neurons[j].baseY }
          );

          if (d <= proximity) {
            candidates.push({ a: i, b: j, d });
          }
        }
      }

      candidates.sort((x, y) => x.d - y.d);

      const addEdge = (a: number, b: number, d: number) => {
        const key = edgeKey(a, b);
        if (set.has(key)) return;
        if (degree[a] >= cfg.maxConnectionsPerNeuron) return;
        if (degree[b] >= cfg.maxConnectionsPerNeuron) return;

        set.add(key);
        degree[a]++;
        degree[b]++;

        nextEdges.push({
          a,
          b,
          length: d,
          curve: rand(-1, 1) * Math.min(18, d * 0.14),
        });
      };

      for (let i = 0; i < neurons.length; i++) {
        let best: { j: number; d: number } | null = null;

        for (let j = 0; j < neurons.length; j++) {
          if (i === j) continue;

          const d = dist(
            { x: neurons[i].baseX, y: neurons[i].baseY },
            { x: neurons[j].baseX, y: neurons[j].baseY }
          );

          if (d <= proximity) {
            if (!best || d < best.d) best = { j, d };
          }
        }

        if (!best) {
          for (let j = 0; j < neurons.length; j++) {
            if (i === j) continue;

            const d = dist(
              { x: neurons[i].baseX, y: neurons[i].baseY },
              { x: neurons[j].baseX, y: neurons[j].baseY }
            );

            if (!best || d < best.d) best = { j, d };
          }
        }

        if (best) addEdge(i, best.j, best.d);
      }

      for (const c of candidates) {
        addEdge(c.a, c.b, c.d);
      }

      edges = nextEdges;
    }

    function setup() {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      createNeurons();
      buildEdges();
      signals = [];
      spawnAccumulator = 0;
    }

    function getMouseNormalized() {
      if (!mouse.inside || width === 0 || height === 0) {
        return { x: 0, y: 0 };
      }

      return {
        x: (mouse.x / width - 0.5) * 2,
        y: (mouse.y / height - 0.5) * 2,
      };
    }

    function getNeuronPosition(n: Neuron, time: number): Vec {
      const t = time * 0.001;
      const driftX = reducedMotion ? 0 : Math.sin(t * n.speed + n.phase) * n.moveX;
      const driftY = reducedMotion ? 0 : Math.cos(t * n.speed * 0.92 + n.phase * 1.2) * n.moveY;

      const mouseN = getMouseNormalized();
      const parallaxFactor = reducedMotion ? 0 : cfg.parallaxStrength * n.depth;
      const parallaxX = mouseN.x * parallaxFactor;
      const parallaxY = mouseN.y * parallaxFactor;

      return {
        x: n.baseX + driftX + parallaxX,
        y: n.baseY + driftY + parallaxY,
      };
    }

    function resolveOverlaps(positions: Vec[]) {
      for (let iteration = 0; iteration < 2; iteration++) {
        for (let i = 0; i < positions.length; i++) {
          for (let j = i + 1; j < positions.length; j++) {
            const a = positions[i];
            const b = positions[j];
            const dx = b.x - a.x;
            const dy = b.y - a.y;
            const d = Math.sqrt(dx * dx + dy * dy) || 0.0001;
            const minD = neurons[i].radius + neurons[j].radius + cfg.nonOverlapGap * 0.6;

            if (d < minD) {
              const overlap = (minD - d) * 0.5;
              const nx = dx / d;
              const ny = dy / d;

              a.x -= nx * overlap;
              a.y -= ny * overlap;
              b.x += nx * overlap;
              b.y += ny * overlap;
            }
          }
        }

        for (let i = 0; i < positions.length; i++) {
          positions[i].x = clamp(
            positions[i].x,
            neurons[i].radius + 10,
            width - neurons[i].radius - 10
          );
          positions[i].y = clamp(
            positions[i].y,
            neurons[i].radius + 10,
            height - neurons[i].radius - 10
          );
        }
      }
    }

    function getEdgeGeometry(edge: Edge, positions: Vec[]) {
      const a = positions[edge.a];
      const b = positions[edge.b];
      const cp = controlPoint(a, b, edge.curve);
      return { a, b, cp };
    }

    function mouseInfluence(pos: Vec) {
      if (!mouse.inside) return 0;
      const d = dist(pos, mouse);
      const r = cfg.mouseInfluenceRadius;
      if (d >= r) return 0;
      return 1 - d / r;
    }

    function isNeuronNearMouse(pos: Vec) {
      return mouseInfluence(pos) > 0;
    }

    function getMouseRelevantEdgeIndices(positions: Vec[]) {
      const result: number[] = [];

      for (let i = 0; i < edges.length; i++) {
        const e = edges[i];
        const aNear = isNeuronNearMouse(positions[e.a]);
        const bNear = isNeuronNearMouse(positions[e.b]);

        if (aNear || bNear) {
          result.push(i);
        }
      }

      return result;
    }

    function drawBackground(time: number) {
      const glow = ctx.createRadialGradient(
        width * 0.5,
        height * 0.45,
        0,
        width * 0.5,
        height * 0.45,
        Math.max(width, height) * 0.7
      );
      glow.addColorStop(0, rgba(palette.bgGlow, theme === "light" ? 0.08 : 0.1));
      glow.addColorStop(1, "rgba(0,0,0,0)");

      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, width, height);

      ctx.save();
      const baseGridOpacity =
        theme === "light" ? cfg.gridOpacityLight : cfg.gridOpacityDark;
      const accentOpacity = baseGridOpacity * cfg.gridAccentOpacityMultiplier;

      ctx.lineWidth = 1;

      let rowIndex = 0;
      for (let y = 0; y < height + cfg.gridGap; y += cfg.gridGap) {
        const isAccent = rowIndex % cfg.gridAccentEvery === 0;
        ctx.strokeStyle = rgba(palette.grid, isAccent ? accentOpacity : baseGridOpacity);
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
        rowIndex++;
      }

      let colIndex = 0;
      for (let x = 0; x < width + cfg.gridGap; x += cfg.gridGap) {
        const isAccent = colIndex % cfg.gridAccentEvery === 0;
        ctx.strokeStyle = rgba(palette.grid, isAccent ? accentOpacity : baseGridOpacity);
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
        colIndex++;
      }
      ctx.restore();

      if (cfg.sweepEnabled) {
        const phase = (time % cfg.sweepDurationMs) / cfg.sweepDurationMs;
        const sweepX = lerp(-cfg.sweepWidth, width + cfg.sweepWidth, phase);
        const opacity = theme === "light" ? cfg.sweepOpacityLight : cfg.sweepOpacityDark;

        ctx.save();
        const grad = ctx.createLinearGradient(
          sweepX - cfg.sweepWidth,
          0,
          sweepX + cfg.sweepWidth,
          0
        );
        grad.addColorStop(0, "rgba(0,0,0,0)");
        grad.addColorStop(0.5, rgba(palette.sweep, opacity));
        grad.addColorStop(1, "rgba(0,0,0,0)");

        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);

        ctx.strokeStyle = rgba(palette.sweep, opacity * 0.9);
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(sweepX, 0);
        ctx.lineTo(sweepX - 48, height);
        ctx.stroke();
        ctx.restore();
      }
    }

    function drawEdges(positions: Vec[], activeSet: Set<number>) {
      for (let i = 0; i < edges.length; i++) {
        const edge = edges[i];
        const { a, b, cp } = getEdgeGeometry(edge, positions);
        const isActive = activeSet.has(i);

        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.quadraticCurveTo(cp.x, cp.y, b.x, b.y);
        ctx.strokeStyle = rgba(
          isActive ? palette.synapseHot : palette.synapse,
          isActive
            ? theme === "light"
              ? 0.22
              : 0.32
            : theme === "light"
            ? 0.14
            : 0.18
        );
        ctx.lineWidth = isActive ? 1.25 : 1;
        ctx.stroke();
      }
    }

    function drawNeuron(neuron: Neuron, pos: Vec, time: number, mouseFactor: number) {
      const points: Vec[] = [];

      for (let i = 0; i < neuron.shape.length; i++) {
        const angle = (i / neuron.shape.length) * TAU;
        const pulse = 1 + Math.sin(time * 0.0012 + neuron.phase + i * 0.7) * 0.02;
        const r = neuron.radius * neuron.shape[i] * pulse;

        points.push({
          x: pos.x + Math.cos(angle) * r,
          y: pos.y + Math.sin(angle) * r,
        });
      }

      const outerGlow = ctx.createRadialGradient(
        pos.x,
        pos.y,
        neuron.radius * 0.2,
        pos.x,
        pos.y,
        neuron.radius * 2.6
      );
      outerGlow.addColorStop(
        0,
        rgba(
          palette.neuronStroke,
          (theme === "light" ? 0.08 : 0.12) + mouseFactor * 0.12
        )
      );
      outerGlow.addColorStop(1, "rgba(0,0,0,0)");

      ctx.beginPath();
      ctx.arc(pos.x, pos.y, neuron.radius * 2.4, 0, TAU);
      ctx.fillStyle = outerGlow;
      ctx.fill();

      const fill = ctx.createRadialGradient(
        pos.x - neuron.radius * 0.35,
        pos.y - neuron.radius * 0.35,
        neuron.radius * 0.1,
        pos.x,
        pos.y,
        neuron.radius * 1.4
      );
      fill.addColorStop(0, rgba(palette.neuronFillA, theme === "light" ? 0.95 : 0.9));
      fill.addColorStop(1, rgba(palette.neuronFillB, theme === "light" ? 0.85 : 0.78));

      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
      }
      ctx.closePath();
      ctx.fillStyle = fill;
      ctx.fill();

      ctx.strokeStyle = rgba(
        palette.neuronStroke,
        theme === "light" ? 0.5 + mouseFactor * 0.15 : 0.7 + mouseFactor * 0.18
      );
      ctx.lineWidth = 1.1;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(pos.x, pos.y, neuron.radius * 0.24, 0, TAU);
      ctx.fillStyle = rgba(palette.neuronCore, theme === "light" ? 0.45 : 0.62);
      ctx.fill();
    }

    function drawSignals(positions: Vec[], dtSeconds: number) {
      ctx.save();
      ctx.globalCompositeOperation = "lighter";

      for (let i = signals.length - 1; i >= 0; i--) {
        const s = signals[i];
        const edge = edges[s.edgeIndex];
        if (!edge) {
          signals.splice(i, 1);
          continue;
        }

        const { a, b, cp } = getEdgeGeometry(edge, positions);
        const trailCount = 5;

        for (let k = trailCount - 1; k >= 0; k--) {
          const tt = s.t - s.direction * k * 0.035;
          if (tt < 0 || tt > 1) continue;

          const p = quadraticPoint(a, cp, b, tt);
          const alpha = (1 - k / trailCount) * 0.34 * s.strength;
          const r = s.size * (1 - k / trailCount * 0.55);

          const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 4.0);
          glow.addColorStop(0, rgba(palette.signalCore, alpha * 1.05));
          glow.addColorStop(0.45, rgba(palette.signalGlow, alpha * 0.58));
          glow.addColorStop(1, "rgba(0,0,0,0)");

          ctx.beginPath();
          ctx.arc(p.x, p.y, r * 4.0, 0, TAU);
          ctx.fillStyle = glow;
          ctx.fill();

          ctx.beginPath();
          ctx.arc(p.x, p.y, Math.max(0.55, r), 0, TAU);
          ctx.fillStyle = rgba(palette.spark, alpha * 0.95);
          ctx.fill();
        }

        const head = quadraticPoint(a, cp, b, s.t);
        const tangent = quadraticTangent(a, cp, b, s.t);
        const len = Math.max(1, Math.sqrt(tangent.x * tangent.x + tangent.y * tangent.y));
        const tx = tangent.x / len;
        const ty = tangent.y / len;

        ctx.beginPath();
        ctx.moveTo(head.x - tx * 6, head.y - ty * 6);
        ctx.lineTo(head.x + tx * 1.3, head.y + ty * 1.3);
        ctx.strokeStyle = rgba(palette.spark, 0.24 * s.strength);
        ctx.lineWidth = 1;
        ctx.lineCap = "round";
        ctx.stroke();

        s.t += s.speed * dtSeconds * s.direction;

        if (s.t > 1 || s.t < 0) {
          signals.splice(i, 1);
        }
      }

      ctx.restore();
    }

    function getSpawnableEdges(
      positions: Vec[],
      activeSet: Set<number>,
      mouseOnly: boolean
    ) {
      const items: { edgeIndex: number; weight: number }[] = [];

      for (let i = 0; i < edges.length; i++) {
        if (activeSet.has(i)) continue;

        const e = edges[i];
        const a = positions[e.a];
        const b = positions[e.b];
        const aMouse = mouseInfluence(a);
        const bMouse = mouseInfluence(b);
        const nearMouse = aMouse > 0 || bMouse > 0;

        if (mouseOnly && !nearMouse) continue;
        if (!mouseOnly && nearMouse) continue;

        let weight = 1;
        if (nearMouse) {
          weight += (aMouse + bMouse) * 4.5;
        }

        items.push({ edgeIndex: i, weight });
      }

      return items;
    }

    function weightedPick(items: { edgeIndex: number; weight: number }[]) {
      const total = items.reduce((sum, item) => sum + item.weight, 0);
      let r = Math.random() * total;

      for (const item of items) {
        r -= item.weight;
        if (r <= 0) return item.edgeIndex;
      }

      return items[items.length - 1]?.edgeIndex;
    }

    function spawnSignals(positions: Vec[], dtSeconds: number) {
      const activeSet = new Set(signals.map((s) => s.edgeIndex));
      const mouseRelevantEdges = mouse.inside ? getMouseRelevantEdgeIndices(positions) : [];
      const activeMouseSignals = signals.filter((s) =>
        mouseRelevantEdges.includes(s.edgeIndex)
      ).length;

      const baseTarget = Math.floor(
        edges.length * overallTargetRatio(cfg.signalActivityOverall)
      );

      const mouseTarget = Math.floor(
        mouseRelevantEdges.length * clamp(cfg.signalActivityNearMouse, 0, 1)
      );

      const totalTarget = clamp(
        Math.max(baseTarget, 0) + Math.max(0, mouseTarget - activeMouseSignals),
        0,
        edges.length
      );

      const baseRate = overallSpawnRate(cfg.signalActivityOverall);
      const mouseRate =
        mouseRelevantEdges.length > 0
          ? mouseExtraSpawnRate(cfg.signalActivityNearMouse)
          : 0;

      spawnAccumulator += (baseRate + mouseRate) * dtSeconds;

      while (spawnAccumulator >= 1 && signals.length < totalTarget) {
        spawnAccumulator -= 1;

        const currentActiveSet = new Set(signals.map((s) => s.edgeIndex));
        const currentActiveMouseSignals = signals.filter((s) =>
          mouseRelevantEdges.includes(s.edgeIndex)
        ).length;

        const needMoreMouseSignals =
          mouseRelevantEdges.length > 0 && currentActiveMouseSignals < mouseTarget;

        const priorityOptions = getSpawnableEdges(
          positions,
          currentActiveSet,
          needMoreMouseSignals
        );

        if (!priorityOptions.length) {
          const fallbackOptions = getSpawnableEdges(positions, currentActiveSet, false);
          if (!fallbackOptions.length) break;

          const edgeIndex = weightedPick(fallbackOptions);
          if (edgeIndex == null) break;

          signals.push({
            edgeIndex,
            t: Math.random() > 0.5 ? 0 : 1,
            direction: Math.random() > 0.5 ? 1 : -1,
            speed: rand(cfg.signalSpeedMin, cfg.signalSpeedMax),
            size: rand(0.85, 1.25) * cfg.signalSizeScale,
            strength: rand(cfg.signalStrengthMin, cfg.signalStrengthMax),
          });

          continue;
        }

        const edgeIndex = weightedPick(priorityOptions);
        if (edgeIndex == null) break;

        signals.push({
          edgeIndex,
          t: Math.random() > 0.5 ? 0 : 1,
          direction: Math.random() > 0.5 ? 1 : -1,
          speed: rand(cfg.signalSpeedMin, cfg.signalSpeedMax),
          size: rand(0.85, 1.25) * cfg.signalSizeScale,
          strength: rand(cfg.signalStrengthMin, cfg.signalStrengthMax),
        });
      }
    }

    function drawMouseAura() {
      if (!mouse.inside) return;

      const g = ctx.createRadialGradient(
        mouse.x,
        mouse.y,
        0,
        mouse.x,
        mouse.y,
        cfg.mouseInfluenceRadius * 1.15
      );
      g.addColorStop(0, rgba(palette.mouseGlow, theme === "light" ? 0.08 : 0.13));
      g.addColorStop(1, "rgba(0,0,0,0)");

      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, cfg.mouseInfluenceRadius * 1.15, 0, TAU);
      ctx.fillStyle = g;
      ctx.fill();
    }

    function render(time: number) {
      const dtSeconds = Math.min(0.05, (time - lastTime) / 1000);
      lastTime = time;

      const positions = neurons.map((n) => getNeuronPosition(n, time));
      resolveOverlaps(positions);
      spawnSignals(positions, dtSeconds);

      const activeSet = new Set(signals.map((s) => s.edgeIndex));

      ctx.clearRect(0, 0, width, height);
      drawBackground(time);
      drawEdges(positions, activeSet);
      drawSignals(positions, dtSeconds);

      for (let i = 0; i < neurons.length; i++) {
        drawNeuron(neurons[i], positions[i], time, mouseInfluence(positions[i]));
      }

      drawMouseAura();

      raf = requestAnimationFrame(render);
    }

    function handleResize() {
      setup();
    }

    function handleMouseMove(e: MouseEvent) {
      const rect = canvas.getBoundingClientRect();
      const inside =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;

      mouse.inside = inside;

      if (inside) {
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
      }
    }

    function handleMouseLeave() {
      mouse.inside = false;
    }

    setup();
    raf = requestAnimationFrame(render);

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseout", handleMouseLeave);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseout", handleMouseLeave);

      if (media.removeEventListener) {
        media.removeEventListener("change", onMotionChange);
      } else {
        media.removeListener(onMotionChange);
      }
    };
  }, [theme, config]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={className}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        opacity: config.opacity
      }}
    />
  );
}