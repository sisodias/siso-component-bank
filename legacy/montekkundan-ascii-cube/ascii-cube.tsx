"use client";

import React, { useEffect, useState } from "react";

/**
 * CubeAnimation
 *
 * Props:
 * - wireframe: show only edges if true, filled faces if false (default: false)
 * - color: use colored faces if true, monochrome if false (default: false)
 * - speedA, speedB, speedC: rotation speeds for X, Y, Z axes
 * - axis: which axes to rotate ('x', 'y', 'z', 'xy', 'xz', 'yz', 'xyz')
 * - backfaceCulling: if true, only faces toward the camera are colored (solid cube); if false, all faces are colored (see-through)
 * - incrementSpeed: density of face sampling (lower = denser, smoother faces)
 * - edges: show cube edges if true (default: true)
 *
 * Tweak incrementSpeed and CUBE_WIDTH for best face coverage. Lower incrementSpeed = denser faces. Increase CUBE_WIDTH for more overlap.
 */

const W = 120;
const H = 60;
const CUBE_WIDTH = 1.32;

const FACE_COLORS = [
  "#e53935", // red
  "#43a047", // green
  "#fbc02d", // yellow
  "#1e88e5", // blue
  "#8e24aa", // purple
  "#fb8c00", // orange
];

const FACE_CHARS = [
  "@", // front
  "$", // right
  "~", // left
  "#", // back
  ";", // bottom
  "+", // top
];

// Rotation and projection constants
const DISTANCE_FROM_CAM = 4;
const K1 = 27;
// Default increment speed for face sampling (can be overridden by prop)
const DEFAULT_INCREMENT_SPEED = 0.015;

export default function CubeAnimation({
  wireframe = false,
  color = false,
  speedA = 0.03,
  speedB = 0.02,
  speedC = 0.01,
  axis = "xy",
  backfaceCulling = false,
  incrementSpeed = DEFAULT_INCREMENT_SPEED,
  edges = true
}: {
  wireframe?: boolean;
  color?: boolean;
  speedA?: number;
  speedB?: number;
  speedC?: number;
  axis?: "x" | "y" | "z" | "xy" | "xz" | "yz" | "xyz";
  backfaceCulling?: boolean;
  incrementSpeed?: number;
  edges?: boolean;
}) {
  const [frame, setFrame] = useState<React.ReactElement[]>([]);
  const [A, setA] = useState(0); // X axis
  const [B, setB] = useState(0); // Y axis
  const [C, setC] = useState(0); // Z axis

  useEffect(() => {
    const renderFrame = () => {
      const zbuf = Array(W * H).fill(0);
      const chbuf = Array(W * H).fill(" ");
      const cbuf = Array(W * H).fill("");

      if (!wireframe) {
        // Draw faces (optionally with backface culling)
        const FACE_NORMALS = [
          [0, 0, -1], [1, 0, 0], [-1, 0, 0], [0, 0, 1], [0, -1, 0], [0, 1, 0],
        ];
        for (let face = 0; face < 6; face++) {
          const [ni, nj, nk] = FACE_NORMALS[face];
          const nz = -ni * Math.sin(B) + nj * Math.sin(A) * Math.cos(B) + nk * Math.cos(A) * Math.cos(B);
          if (backfaceCulling && nz > 0) continue;
          const ch = FACE_CHARS[face];
          const colorVal = color ? FACE_COLORS[face % FACE_COLORS.length] : "currentColor";
          for (let u = -CUBE_WIDTH; u < CUBE_WIDTH; u += incrementSpeed) {
            for (let v = -CUBE_WIDTH; v < CUBE_WIDTH; v += incrementSpeed) {
              let i = 0, j = 0, k = 0;
              switch (face) {
                case 0: i = u; j = v; k = -CUBE_WIDTH; break;
                case 1: i = CUBE_WIDTH; j = v; k = u; break;
                case 2: i = -CUBE_WIDTH; j = v; k = -u; break;
                case 3: i = -u; j = v; k = CUBE_WIDTH; break;
                case 4: i = u; j = -CUBE_WIDTH; k = -v; break;
                case 5: i = u; j = CUBE_WIDTH; k = v; break;
              }
              // 3-axis rotation
              const x1 = i * Math.cos(C) - j * Math.sin(C);
              const y1 = i * Math.sin(C) + j * Math.cos(C);
              const z1 = k;
              const y2 = y1 * Math.cos(A) - z1 * Math.sin(A);
              const z2 = y1 * Math.sin(A) + z1 * Math.cos(A);
              const x2 = x1;
              const z3 = z2 * Math.cos(B) - x2 * Math.sin(B);
              const x3 = z2 * Math.sin(B) + x2 * Math.cos(B);
              const y3 = y2;
              const x = x3, y = y3, z = z3 + DISTANCE_FROM_CAM;
              const ooz = 1 / z;
              const xp = Math.floor(W / 2 + K1 * ooz * x * 2);
              const yp = Math.floor(H / 2 + K1 * ooz * y);
              const idx = xp + yp * W;
              if (xp >= 0 && xp < W && yp >= 0 && yp < H) {
                if (ooz > zbuf[idx]) {
                  zbuf[idx] = ooz;
                  chbuf[idx] = ch;
                  cbuf[idx] = colorVal;
                }
              }
            }
          }
        }
      }

      if (edges) {
        // Draw edges using 3-axis rotation
        const V = [
          [-CUBE_WIDTH, -CUBE_WIDTH, -CUBE_WIDTH],
          [ CUBE_WIDTH, -CUBE_WIDTH, -CUBE_WIDTH],
          [ CUBE_WIDTH,  CUBE_WIDTH, -CUBE_WIDTH],
          [-CUBE_WIDTH,  CUBE_WIDTH, -CUBE_WIDTH],
          [-CUBE_WIDTH, -CUBE_WIDTH,  CUBE_WIDTH],
          [ CUBE_WIDTH, -CUBE_WIDTH,  CUBE_WIDTH],
          [ CUBE_WIDTH,  CUBE_WIDTH,  CUBE_WIDTH],
          [-CUBE_WIDTH,  CUBE_WIDTH,  CUBE_WIDTH],
        ];
        const EDGES = [
          [0,1],[1,2],[2,3],[3,0], [4,5],[5,6],[6,7],[7,4], [0,4],[1,5],[2,6],[3,7]
        ];
        const EDGE_CHAR = "+";
        const EDGE_COLOR = "currentColor";
        const EDGE_STEPS = 160;
        for (const [a, b] of EDGES) {
          const [x0, y0, z0] = V[a];
          const [x1, y1, z1] = V[b];
          function rotate3D(i: number, j: number, k: number) {
            const x1 = i * Math.cos(C) - j * Math.sin(C);
            const y1 = i * Math.sin(C) + j * Math.cos(C);
            const z1 = k;
            const y2 = y1 * Math.cos(A) - z1 * Math.sin(A);
            const z2 = y1 * Math.sin(A) + z1 * Math.cos(A);
            const x2 = x1;
            const z3 = z2 * Math.cos(B) - x2 * Math.sin(B);
            const x3 = z2 * Math.sin(B) + x2 * Math.cos(B);
            const y3 = y2;
            return [x3, y3, z3];
          }
          const [X0, Y0, Z0_] = rotate3D(x0, y0, z0);
          const [X1, Y1, Z1_] = rotate3D(x1, y1, z1);
          const Z0 = Z0_ + DISTANCE_FROM_CAM;
          const Z1 = Z1_ + DISTANCE_FROM_CAM;
          for (let s = 0; s <= EDGE_STEPS; s++) {
            const t = s / EDGE_STEPS;
            const x = X0 + (X1 - X0) * t;
            const y = Y0 + (Y1 - Y0) * t;
            const z = Z0 + (Z1 - Z0) * t;
            const ooz = 1 / z;
            const xp = Math.floor(W / 2 + K1 * ooz * x * 2);
            const yp = Math.floor(H / 2 + K1 * ooz * y);
            const idx = xp + yp * W;
            if (xp >= 0 && xp < W && yp >= 0 && yp < H) {
              if (ooz > zbuf[idx]) {
                zbuf[idx] = ooz + 1e-6;
                chbuf[idx] = EDGE_CHAR;
                cbuf[idx] = EDGE_COLOR;
              }
            }
          }
        }
      }

      // Render frame as JSX
      const frameLines: React.ReactElement[] = [];
      for (let y = 0; y < H; y++) {
        const line: React.ReactElement[] = [];
        for (let x = 0; x < W; x++) {
          const idx = x + y * W;
          if (chbuf[idx] !== " ") {
            line.push(
              <span key={x} style={{ color: cbuf[idx], fontWeight: "bold" }}>{chbuf[idx]}</span>
            );
          } else {
            line.push(<span key={x}> </span>);
          }
        }
        frameLines.push(<div key={y}>{line}</div>);
      }
      setFrame(frameLines);
    };
    const interval = setInterval(() => {
      setA(prev => prev + ((axis.includes("x")) ? speedA : 0));
      setB(prev => prev + ((axis.includes("y")) ? speedB : 0));
      setC(prev => prev + ((axis.includes("z")) ? speedC : 0));
      renderFrame();
    }, 30);
    return () => clearInterval(interval);
  }, [A, B, C, color, speedA, speedB, speedC, axis, backfaceCulling, incrementSpeed, edges, wireframe]);

  return (
    <pre className="font-mono text-xs whitespace-pre leading-none text-center">
      {frame}
    </pre>
  );
}
