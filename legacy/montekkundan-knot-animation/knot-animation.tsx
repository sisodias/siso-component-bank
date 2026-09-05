"use client";

import React, { useEffect, useState } from "react";

/**
 * KnotAnimation
 *
 * - Animated ASCII trefoil knot with optional colored tube segments.
 * - Pass the prop `color={true}` to enable color; default is grayscale.
 * - Pass the props `speedA` and `speedB` to control the spin speed (optional).
 *
 * Props:
 *   - color?: boolean (default: false) — enable colored tube segments
 *   - speedA?: number (default: 0.04) — rotation speed around the X axis (radians per frame)
 *   - speedB?: number (default: 0.02) — rotation speed around the Y axis (radians per frame)
 *
 * Tweak the COLOR_PALETTE array to change the color scheme.
 */

const W = 80;
const H = 40;
const PI = 3.14159265;

// ASCII brightness ramp
const ramp = ".,-~:;=!*#$@";

// Color palette for tube segments (edit as desired)
const COLOR_PALETTE = [
  "#e53935", // red
  "#43a047", // green
  "#fbc02d", // yellow
  "#1e88e5", // blue
  "#8e24aa", // purple
  "#fb8c00", // orange
  "#00897b", // teal
  "#c0ca33", // lime
];

type Vec3 = { x: number; y: number; z: number };

const vadd = (a: Vec3, b: Vec3): Vec3 => ({ x: a.x + b.x, y: a.y + b.y, z: a.z + b.z });
const vmul = (v: Vec3, s: number): Vec3 => ({ x: v.x * s, y: v.y * s, z: v.z * s });
const vdot = (a: Vec3, b: Vec3): number => a.x * b.x + a.y * b.y + a.z * b.z;
const vnorm = (v: Vec3): Vec3 => {
  const r = Math.sqrt(vdot(v, v));
  return vmul(v, 1.0 / r);
};
const cross = (a: Vec3, b: Vec3): Vec3 => ({
  x: a.y * b.z - a.z * b.y,
  y: a.z * b.x - a.x * b.z,
  z: a.x * b.y - a.y * b.x,
});

export const KnotAnimation = ({
  color = false,
  speedA = 0.04,
  speedB = 0.02
}: {
  color?: boolean;
  speedA?: number;
  speedB?: number;
}) => {
  const [frame, setFrame] = useState<React.ReactElement[]>([]);
  const [A, setA] = useState(0);
  const [B, setB] = useState(0);

  useEffect(() => {
    const renderFrame = () => {
      // Buffers for ASCII and color index
      const screen: string[] = Array(W * H).fill(' ');
      const colorIdx: number[] = Array(W * H).fill(-1);
      const zbuf: number[] = Array(W * H).fill(0);

      const light = vnorm({ x: -1, y: 1, z: -1 });

      const cA = Math.cos(A), sA = Math.sin(A);
      const cB = Math.cos(B), sB = Math.sin(B);

      let tubeIdx = 0;
      for (let u = 0; u < 2 * PI; u += 0.06, tubeIdx++) {
        const cu = u, cu2 = 2 * cu, cu3 = 3 * cu;
        const C: Vec3 = {
          x: Math.sin(cu) + 2 * Math.sin(cu2),
          y: Math.cos(cu) - 2 * Math.cos(cu2),
          z: -Math.sin(cu3)
        };

        const T = vnorm({
          x: Math.cos(cu) + 4 * Math.cos(cu2),
          y: -Math.sin(cu) + 4 * Math.sin(cu2),
          z: -3 * Math.cos(cu3)
        });

        const up = Math.abs(vdot(T, { x: 0, y: 1, z: 0 })) < 0.99
          ? { x: 0, y: 1, z: 0 }
          : { x: 1, y: 0, z: 0 };
        const N = vnorm(cross(T, up));
        const Bn = cross(T, N);

        const R = 0.3;
        // Pick color for this tube segment
        const segColorIdx = tubeIdx % COLOR_PALETTE.length;

        for (let v = 0; v < 2 * PI; v += 0.2) {
          const cv = Math.cos(v), sv = Math.sin(v);
          const offs = vadd(vmul(N, cv * R), vmul(Bn, sv * R));
          const p = vadd(C, offs);

          const x1 = p.x;
          const y1 = p.y * cA - p.z * sA;
          const z1 = p.y * sA + p.z * cA;

          const x2 = x1 * cB + z1 * sB;
          const y2 = y1;
          const z2 = -x1 * sB + z1 * cB + 5.0;

          const invz = 1.0 / z2;
          const px = Math.floor(W / 2 + 40 * x2 * invz);
          const py = Math.floor(H / 2 - 20 * y2 * invz);

          if (px >= 0 && px < W && py >= 0 && py < H) {
            const idx = px + py * W;
            if (invz > zbuf[idx]) {
              zbuf[idx] = invz;

              const n = vnorm(offs);
              const nx1 = n.x;
              const ny1 = n.y * cA - n.z * sA;
              const nz1 = n.y * sA + n.z * cA;

              const nx2 = nx1 * cB + nz1 * sB;
              const ny2 = ny1;
              const nz2 = -nx1 * sB + nz1 * cB;

              const nr = { x: nx2, y: ny2, z: nz2 };
              const lum = Math.max(0, vdot(nr, light));
              const ci = Math.floor(lum * (ramp.length - 1));
              screen[idx] = ramp[ci];
              colorIdx[idx] = segColorIdx;
            }
          }
        }
      }

      // Render frame
      const frameLines: React.ReactElement[] = [];
      for (let y = 0; y < H; y++) {
        const line: React.ReactElement[] = [];
        for (let x = 0; x < W; x++) {
          const idx = x + y * W;
          if (screen[idx] === ' ') {
            line.push(<span key={x}> </span>);
          } else if (color) {
            line.push(
              <span key={x} style={{ color: COLOR_PALETTE[colorIdx[idx]] }}>{screen[idx]}</span>
            );
          } else {
            line.push(<span key={x}>{screen[idx]}</span>);
          }
        }
        frameLines.push(<div key={y}>{line}</div>);
      }
      setFrame(frameLines);
    };

    const interval = setInterval(() => {
      setA(prev => prev + speedA);
      setB(prev => prev + speedB);
      renderFrame();
    }, 30);

    return () => clearInterval(interval);
  }, [A, B, color, speedA, speedB]);

  return (
    <pre className="font-mono text-xs whitespace-pre leading-none text-center">
      {frame}
    </pre>
  );
}; 