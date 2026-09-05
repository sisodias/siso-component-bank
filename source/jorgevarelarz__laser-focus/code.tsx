"use client";

/**
 * LaserField — animated "laser focus" background using a full-screen
 * WebGL shader. Beams of light fan out from a focal point and sweep slowly.
 * Zero dependencies (raw WebGL), respects prefers-reduced-motion.
 */
import { useEffect, useRef } from "react";

type RGB = [number, number, number];

export interface LaserFieldProps {
  className?: string;
  /** Bright core / top color. Default: #ff3b47 */
  primary?: string;
  /** Deep accent / bottom color. Default: #8f0b1e */
  secondary?: string;
  /** Ambient deep tone. Default: #2e0a14 */
  deep?: string;
  /** Number of beams in the fan. Default: 7 */
  beams?: number;
  /** Animation speed multiplier. Default: 1 */
  speed?: number;
}

function hexToRGB(hex: string): RGB {
  const h = hex.replace("#", "");
  const n = parseInt(
    h.length === 3 ? h.split("").map((c) => c + c).join("") : h,
    16
  );
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}
const v3 = ([r, g, b]: RGB) => `vec3(${r}, ${g}, ${b})`;

const VERT = `
attribute vec2 position;
varying vec2 vUv;
void main() {
  vUv = position * 0.5 + 0.5;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const buildFrag = (primary: RGB, secondary: RGB, deep: RGB, beams: number) => `
precision highp float;
uniform float uTime;
uniform vec2  uRes;
varying vec2  vUv;

const vec3 CYAN   = ${v3(primary)};
const vec3 INDIGO = ${v3(secondary)};
const vec3 DEEP   = ${v3(deep)};

float beam(vec2 p, float ang, float width) {
  vec2 dir = vec2(cos(ang), sin(ang));
  float d = abs(p.x * dir.y - p.y * dir.x);
  float fwd = max(dot(p, dir), 0.0);
  float core = smoothstep(width, 0.0, d);
  float falloff = 1.0 / (1.0 + fwd * fwd * 5.5);
  return core * falloff;
}

void main() {
  vec2 uv = vUv;
  vec2 p = (uv - vec2(0.5, 0.92));
  p.x *= uRes.x / uRes.y;

  float t = uTime * 0.12;
  float acc = 0.0;
  for (int i = 0; i < ${beams}; i++) {
    float fi = float(i);
    float ang = -1.5708 + sin(t + fi * 1.7) * 0.5 + (fi - 3.0) * 0.30;
    float w = 0.014 + 0.009 * sin(t * 1.3 + fi);
    acc += beam(p, ang, w) * (0.55 + 0.4 * sin(t * 2.0 + fi * 2.1));
  }

  float glow = 0.10 / (length(p) * 2.6 + 0.16);
  float intensity = acc * 0.85 + glow * 0.5;

  vec3 col = mix(INDIGO, CYAN, clamp(uv.y * 1.1, 0.0, 1.0));
  col = mix(col, vec3(1.0), clamp(acc * 0.45, 0.0, 0.65));
  col += DEEP * 0.22;

  float alpha = clamp(intensity, 0.0, 0.95);
  alpha *= smoothstep(0.02, 0.4, uv.y);
  alpha *= mix(1.0, 0.62, smoothstep(0.34, 0.62, uv.y) * (1.0 - smoothstep(0.62, 0.86, uv.y)));
  gl_FragColor = vec4(col * intensity, alpha);
}
`;

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const sh = gl.createShader(type)!;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(sh));
    gl.deleteShader(sh);
    return null;
  }
  return sh;
}

export default function LaserField({
  className,
  primary = "#ff3b47",
  secondary = "#8f0b1e",
  deep = "#2e0a14",
  beams = 7,
  speed = 1,
}: LaserFieldProps) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    const gl = (canvas.getContext("webgl", {
      alpha: true,
      antialias: true,
      premultipliedAlpha: false,
    }) ||
      canvas.getContext("experimental-webgl")) as WebGLRenderingContext | null;
    if (!gl) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.75);

    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(
      gl,
      gl.FRAGMENT_SHADER,
      buildFrag(
        hexToRGB(primary),
        hexToRGB(secondary),
        hexToRGB(deep),
        Math.max(1, Math.floor(beams))
      )
    );
    if (!vs || !fs) return;

    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );
    const loc = gl.getAttribLocation(prog, "position");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(prog, "uTime");
    const uRes = gl.getUniformLocation(prog, "uRes");

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

    const resize = () => {
      const el = canvas.parentElement ?? canvas;
      const w = Math.max(1, el.clientWidth);
      const h = Math.max(1, el.clientHeight);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uRes, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener("resize", resize);

    let raf = 0;
    const start = performance.now();
    const draw = (time: number) => {
      gl.uniform1f(uTime, time);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    };
    const loop = () => {
      draw(((performance.now() - start) / 1000) * speed);
      raf = requestAnimationFrame(loop);
    };
    if (reduce) draw(6);
    else loop();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(buf);
    };
  }, [primary, secondary, deep, beams, speed]);

  return <canvas ref={ref} className={className} aria-hidden />;
}

