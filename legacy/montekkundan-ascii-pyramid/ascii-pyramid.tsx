/**
 * PyramidAnimation
 *
 * Props:
 * - wireframe: show only edges if true, filled faces if false (default: false)
 * - color: use colored faces if true, monochrome if false (default: true)
 * - speed: rotation speed (default: 0.03)
 * - axis: which axis to rotate ('x', 'y', 'z')
 * - edges: show pyramid edges if true (default: true)
 *
 * Tweak DU/DV for face sampling density. Increase SCALE for a larger pyramid.
 */


"use client";

import React, { useEffect, useState } from "react";

const W = 80;
const H = 40;

// ASCII symbols per face
const faceSymbol = ['@', '#', '$', '*'];

// CSS colors for each face
const faceColor = [
  '#e53935',  // red
  '#43a047',  // green
  '#fbc02d',  // yellow
  '#1e88e5'   // blue
];

// Scale factor
const SCALE = 2;
// Desired constant distance for centroid
const DESIRED_DIST = 4.5;

// 5 vertices: apex + 4 base corners
const V: [number, number, number][] = [
  [0.0, SCALE, 0.0],
  [-SCALE, -SCALE, -SCALE],
  [SCALE, -SCALE, -SCALE],
  [SCALE, -SCALE, SCALE],
  [-SCALE, -SCALE, SCALE]
];

// Triangle faces
const F: [number, number, number][] = [
  [0, 1, 2], [0, 2, 3], [0, 3, 4], [0, 4, 1]
];

// Finer sampling for detail
const DU = 0.01;
const DV = 0.01;

const EDGE_LIST = [
  [0,1],[0,2],[0,3],[0,4], // apex to base
  [1,2],[2,3],[3,4],[4,1] // base edges
];

// Vector utilities
const sub3 = (a: number[], b: number[]): number[] => [
  a[0] - b[0],
  a[1] - b[1],
  a[2] - b[2]
];

const cross3 = (a: number[], b: number[]): number[] => [
  a[1] * b[2] - a[2] * b[1],
  a[2] * b[0] - a[0] * b[2],
  a[0] * b[1] - a[1] * b[0]
];

const norm3 = (v: number[]): number[] => {
  const r = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
  return [v[0] / r, v[1] / r, v[2] / r];
};

export default function PyramidAnimation({
  wireframe = false,
  color = true,
  speed = 0.03,
  axis = 'y',
  edges = true
}: {
  wireframe?: boolean;
  color?: boolean;
  speed?: number;
  axis?: 'x' | 'y' | 'z';
  edges?: boolean;
}) {
  const [frame, setFrame] = useState<React.ReactElement[]>([]);
  const [theta, setTheta] = useState(0);

  useEffect(() => {
    const renderFrame = () => {
      // Initialize buffers
      const faceBuf: number[] = Array(W * H).fill(-1);
      const lumBuf: number[] = Array(W * H).fill(0);
      const zBuf: number[] = Array(W * H).fill(0);

      // Compute model-space centroid
      const centroidModel = [0, 0, 0];
      for (let i = 0; i < 5; ++i) {
        centroidModel[0] += V[i][0];
        centroidModel[1] += V[i][1];
        centroidModel[2] += V[i][2];
      }
      centroidModel[0] *= 0.2;
      centroidModel[1] *= 0.2;
      centroidModel[2] *= 0.2;

      // Precompute face normals (model space)
      const fnorm: number[][] = [];
      for (let f = 0; f < 4; f++) {
        const e1 = sub3(V[F[f][1]], V[F[f][0]]);
        const e2 = sub3(V[F[f][2]], V[F[f][0]]);
        fnorm.push(norm3(cross3(e1, e2)));
      }

      // Light direction
      const light = norm3([0.0, 1.0, -1.0]);

      // Compute rotation around Y
      let c = 1, s = 0;
      if (axis === 'y') { c = Math.cos(theta); s = Math.sin(theta); }
      else if (axis === 'x') { c = Math.cos(theta); s = Math.sin(theta); }
      else if (axis === 'z') { c = Math.cos(theta); s = Math.sin(theta); }

      // Rotate centroid and compute offset
      const cz = -centroidModel[0] * s + centroidModel[2] * c;
      const offset = DESIRED_DIST - cz;

      // --- Projection scaling for browser ---
      // X and Y scale factors (tweak for browser aspect ratio)
      const X_SCALE = 36.0;
      const Y_SCALE = 18.0;
      const Y_OFFSET = -4; // Move pyramid up

      // Draw faces
      if (!wireframe) {
        for (let f = 0; f < 4; f++) {
          for (let u = 0; u <= 1.0; u += DU) {
            for (let v = 0; u + v <= 1.0; v += DV) {
              const w = 1.0 - u - v;
              // Model-space point
              const x = w * V[F[f][0]][0] + u * V[F[f][1]][0] + v * V[F[f][2]][0];
              const y = w * V[F[f][0]][1] + u * V[F[f][1]][1] + v * V[F[f][2]][1];
              const z = w * V[F[f][0]][2] + u * V[F[f][1]][2] + v * V[F[f][2]][2];

              // Rotate around Y
              let x2 = x, y2 = y, z2 = z;
              if (axis === 'y') { x2 = x * c + z * s; z2 = -x * s + z * c; }
              else if (axis === 'x') { y2 = y * c - z * s; z2 = y * s + z * c; }
              else if (axis === 'z') { x2 = x * c - y * s; y2 = x * s + y * c; }

              // Translate by offset
              const z2Translated = z2 + offset;
              if (z2Translated <= 0) continue;
              const invz = 1.0 / z2Translated;

              // Project to screen (tuned for browser)
              const px = Math.floor(W / 2 + X_SCALE * x2 * invz);
              const py = Math.floor(H / 2 - Y_SCALE * y2 * invz + Y_OFFSET);
              if (px < 0 || px >= W || py < 0 || py >= H) continue;
              const idx = px + py * W;

              // Depth test
              if (invz <= zBuf[idx]) continue;
              zBuf[idx] = invz;

              // Rotate normal, compute lighting
              let nx = fnorm[f][0], ny = fnorm[f][1], nz = fnorm[f][2];
              if (axis === 'y') { nx = fnorm[f][0] * c + fnorm[f][2] * s; nz = -fnorm[f][0] * s + fnorm[f][2] * c; }
              else if (axis === 'x') { ny = fnorm[f][1] * c - fnorm[f][2] * s; nz = fnorm[f][1] * s + fnorm[f][2] * c; }
              else if (axis === 'z') { nx = fnorm[f][0] * c - fnorm[f][1] * s; ny = fnorm[f][0] * s + fnorm[f][1] * c; }
              let L = nx * light[0] + ny * light[1] + nz * light[2];
              if (L < 0) L = 0;
              lumBuf[idx] = L;
              faceBuf[idx] = f;
            }
          }
        }
      }

      // Draw edges
      if (edges) {
        for (const [a, b] of EDGE_LIST) {
          const [x0, y0, z0] = V[a];
          const [x1, y1, z1] = V[b];
          for (let t = 0; t <= 1.0; t += 0.002) {
            const x = x0 + (x1 - x0) * t;
            const y = y0 + (y1 - y0) * t;
            const z = z0 + (z1 - z0) * t;
            let x2 = x, y2 = y, z2 = z;
            if (axis === 'y') { x2 = x * c + z * s; z2 = -x * s + z * c; }
            else if (axis === 'x') { y2 = y * c - z * s; z2 = y * s + z * c; }
            else if (axis === 'z') { x2 = x * c - y * s; y2 = x * s + y * c; }
            const z2Translated = z2 + offset;
            if (z2Translated <= 0) continue;
            const invz = 1.0 / z2Translated;
            const px = Math.floor(W / 2 + X_SCALE * x2 * invz);
            const py = Math.floor(H / 2 - Y_SCALE * y2 * invz - 4);
            if (px < 0 || px >= W || py < 0 || py >= H) continue;
            const idx = px + py * W;
            if (invz > zBuf[idx]) {
              zBuf[idx] = invz + 1e-6;
              faceBuf[idx] = -2; // special value for edge
            }
          }
        }
      }

      // Render frame as JSX
      const frameLines: React.ReactElement[] = [];
      for (let y = 0; y < H; y++) {
        const line: React.ReactElement[] = [];
        for (let x = 0; x < W; x++) {
          const i = x + y * W;
          const f = faceBuf[i];
          if (f === -2) {
            line.push(<span key={x} style={{ color: '#fff', fontWeight: 'bold' }}>+</span>);
          } else if (f < 0) {
            line.push(<span key={x}> </span>);
          } else {
            const L = lumBuf[i];
            const colorVal = color ? faceColor[f] : '#fff';
            const fontWeight = L > 0.6 ? "bold" : "normal";
            line.push(
              <span key={x} style={{ color: colorVal, fontWeight }}>{faceSymbol[f]}</span>
            );
          }
        }
        frameLines.push(<div key={y}>{line}</div>);
      }
      setFrame(frameLines);
    };

    const interval = setInterval(() => {
      setTheta(prev => prev + speed);
      renderFrame();
    }, 30);

    return () => clearInterval(interval);
  }, [theta, wireframe, color, speed, axis, edges]);

  return (
    <pre className="font-mono text-xs whitespace-pre leading-none text-center">
      {frame}
    </pre>
  );
} 