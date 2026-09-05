"use client";

import React, { useEffect, useRef, useState } from "react";

const VERT_SHADER = `
  attribute vec2 position;
  varying vec2 vUv;
  void main() {
    vUv = position * 0.5 + 0.5;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const TRAIL_FRAG = `
  precision mediump float;
  uniform sampler2D uPrevTrail;
  uniform vec2 uMouse;
  uniform vec2 uMouseDir;
  uniform float uVelocity;
  uniform float uDecay;
  uniform float uBrushSize;
  uniform float uAspect;
  uniform float uReveal;
  varying vec2 vUv;

  void main() {
    float prev = texture2D(uPrevTrail, vUv).r * uDecay;
    vec2 delta = vUv - uMouse;
    delta.x *= uAspect;

    vec2 dir = length(uMouseDir) > 0.001 ? uMouseDir : vec2(0.0, 1.0);
    float along = dot(delta, dir);
    float perp = length(delta - along * dir);
    float elongation = 1.0 + uVelocity * 2.0;
    float blobDist = sqrt(along * along / elongation + perp * perp);

    float blob = exp(-blobDist * blobDist / (uBrushSize * uBrushSize)) * uReveal;
    gl_FragColor = vec4(min(prev + blob, 1.0), 0.0, 0.0, 1.0);
  }
`;

const HALFTONE_FRAG = `
  #extension GL_OES_standard_derivatives : enable
  precision highp float;
  uniform sampler2D uTrailTexture;
  uniform vec2 uResolution;
  uniform float uCellSize;
  uniform vec3 uColor;
  uniform float uOpacity;
  varying vec2 vUv;

  void main() {
    vec2 pixel = vUv * uResolution;
    vec2 cellCoord = floor(pixel / uCellSize);
    vec2 cellCenter = (cellCoord + 0.5) * uCellSize;
    vec2 cellCenterUv = cellCenter / uResolution;

    float density = texture2D(uTrailTexture, cellCenterUv).r;
    float dist = length(fract(pixel / uCellSize) - 0.5);

    float radius = density * 0.47;
    float aa = fwidth(dist);
    float inDot = 1.0 - smoothstep(radius - aa, radius, dist);
    float alpha = inDot * smoothstep(0.05, 0.2, density);

    gl_FragColor = vec4(uColor, alpha * uOpacity);
  }
`;

// --- Pure helpers (module-level, never recreated) ---

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function compileShader(gl: WebGLRenderingContext, source: string, type: number): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function linkProgram(gl: WebGLRenderingContext, vsSource: string, fsSource: string): WebGLProgram | null {
  const vs = compileShader(gl, vsSource, gl.VERTEX_SHADER);
  const fs = compileShader(gl, fsSource, gl.FRAGMENT_SHADER);
  if (!vs || !fs) return null;
  const prog = gl.createProgram();
  if (!prog) return null;
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    console.error(gl.getProgramInfoLog(prog));
    gl.deleteProgram(prog);
    return null;
  }
  return prog;
}

function createFBO(gl: WebGLRenderingContext, w: number, h: number) {
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

  const fb = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
  return { fb, texture };
}

// Resolves CSS color strings (including var(--x) and oklch()) to normalized [r,g,b].
// Uses a live DOM element so getComputedStyle resolves variables against the active theme,
// then a 1x1 canvas to convert whatever color space the browser returns into sRGB bytes.
const probeCtx =
  typeof document !== "undefined"
    ? document.createElement("canvas").getContext("2d")
    : null;

function resolveColor(el: HTMLElement, colorStr: string): [number, number, number] {
  el.style.color = colorStr;
  const computed = getComputedStyle(el).color;
  if (!probeCtx) return [0.5, 0.5, 0.5];
  probeCtx.fillStyle = computed;
  probeCtx.fillRect(0, 0, 1, 1);
  const [r, g, b] = probeCtx.getImageData(0, 0, 1, 1).data;
  return [r / 255, g / 255, b / 255];
}

// --- WebGL engine (framework-agnostic) ---

interface EngineConfig {
  decay: number;
  brushSize: number;
  hoverBrushSize: number;
  opacity: number;
  hoverOpacity: number;
  speedScale: number;
  cellSize: number;
  hoverSelector: string;
}

class HalftoneTrailEngine {
  private gl: WebGLRenderingContext;
  private trailProgram: WebGLProgram;
  private halftoneProgram: WebGLProgram;
  private positionBuffer: WebGLBuffer;
  private fboA: { fb: WebGLFramebuffer | null; texture: WebGLTexture | null };
  private fboB: { fb: WebGLFramebuffer | null; texture: WebGLTexture | null };
  private rafId = 0;
  private config: EngineConfig;

  // Uniform locations — trail
  private tPrevLoc: WebGLUniformLocation | null;
  private tMouseLoc: WebGLUniformLocation | null;
  private tMouseDirLoc: WebGLUniformLocation | null;
  private tVelocityLoc: WebGLUniformLocation | null;
  private tDecayLoc: WebGLUniformLocation | null;
  private tBrushLoc: WebGLUniformLocation | null;
  private tAspectLoc: WebGLUniformLocation | null;
  private tRevealLoc: WebGLUniformLocation | null;
  private tPosLoc: number;

  // Uniform locations — halftone
  private hTrailLoc: WebGLUniformLocation | null;
  private hResLoc: WebGLUniformLocation | null;
  private hCellLoc: WebGLUniformLocation | null;
  private hColorLoc: WebGLUniformLocation | null;
  private hOpacityLoc: WebGLUniformLocation | null;
  private hPosLoc: number;

  // Animated state
  private width = 0;
  private height = 0;
  private mouseX = 0.5;
  private mouseY = 0.5;
  private prevX = 0.5;
  private prevY = 0.5;
  private dirX = 0;
  private dirY = 1;
  private velocity = 0;
  private hovering = false;
  private reveal = 0;
  private currentBrushSize: number;
  private currentOpacity: number;
  private colorRGB: [number, number, number] = [0.5, 0.5, 0.5];

  constructor(canvas: HTMLCanvasElement, config: EngineConfig) {
    this.config = config;
    this.currentBrushSize = config.brushSize;
    this.currentOpacity = config.opacity;

    // premultipliedAlpha:false matches the shader's straight-alpha output (vec4(color, alpha))
    const gl = canvas.getContext("webgl", { alpha: true, premultipliedAlpha: false });
    if (!gl) throw new Error("WebGL unavailable");
    this.gl = gl;

    gl.getExtension("OES_standard_derivatives");

    const trailProgram = linkProgram(gl, VERT_SHADER, TRAIL_FRAG);
    const halftoneProgram = linkProgram(gl, VERT_SHADER, HALFTONE_FRAG);
    if (!trailProgram || !halftoneProgram) throw new Error("Shader compilation failed");
    this.trailProgram = trailProgram;
    this.halftoneProgram = halftoneProgram;

    this.tPosLoc = gl.getAttribLocation(trailProgram, "position");
    this.tPrevLoc = gl.getUniformLocation(trailProgram, "uPrevTrail");
    this.tMouseLoc = gl.getUniformLocation(trailProgram, "uMouse");
    this.tMouseDirLoc = gl.getUniformLocation(trailProgram, "uMouseDir");
    this.tVelocityLoc = gl.getUniformLocation(trailProgram, "uVelocity");
    this.tDecayLoc = gl.getUniformLocation(trailProgram, "uDecay");
    this.tBrushLoc = gl.getUniformLocation(trailProgram, "uBrushSize");
    this.tAspectLoc = gl.getUniformLocation(trailProgram, "uAspect");
    this.tRevealLoc = gl.getUniformLocation(trailProgram, "uReveal");

    this.hPosLoc = gl.getAttribLocation(halftoneProgram, "position");
    this.hTrailLoc = gl.getUniformLocation(halftoneProgram, "uTrailTexture");
    this.hResLoc = gl.getUniformLocation(halftoneProgram, "uResolution");
    this.hCellLoc = gl.getUniformLocation(halftoneProgram, "uCellSize");
    this.hColorLoc = gl.getUniformLocation(halftoneProgram, "uColor");
    this.hOpacityLoc = gl.getUniformLocation(halftoneProgram, "uOpacity");

    this.fboA = createFBO(gl, 512, 512);
    this.fboB = createFBO(gl, 512, 512);

    gl.bindFramebuffer(gl.FRAMEBUFFER, this.fboA.fb);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.fboB.fb);
    gl.clear(gl.COLOR_BUFFER_BIT);

    const buf = gl.createBuffer();
    if (!buf) throw new Error("Buffer creation failed");
    this.positionBuffer = buf;
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);

    this.tick = this.tick.bind(this);
    this.rafId = requestAnimationFrame(this.tick);
  }

  updatePointer(clientX: number, clientY: number, containerRect: DOMRect) {
    this.prevX = this.mouseX;
    this.prevY = this.mouseY;
    this.mouseX = (clientX - containerRect.left) / this.width;
    this.mouseY = 1.0 - (clientY - containerRect.top) / this.height;

    const aspect = this.width / this.height || 1;
    const dx = (this.mouseX - this.prevX) * aspect;
    const dy = this.mouseY - this.prevY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    this.velocity = Math.min(this.config.speedScale * dist, 1.0);
    if (dist > 1e-4) {
      this.dirX = dx / dist;
      this.dirY = dy / dist;
    }

    const el = document.elementFromPoint(clientX, clientY);
    this.hovering = this.config.hoverSelector ? !!el?.closest(this.config.hoverSelector) : false;
  }

  resize(w: number, h: number) {
    this.width = w;
    this.height = h;
  }

  setColor(rgb: [number, number, number]) {
    this.colorRGB = rgb;
  }

  private tick() {
    const gl = this.gl;
    const dpr = Math.min(window.devicePixelRatio, 2);

    this.reveal = lerp(this.reveal, 1.0, 0.04);
    const targetBrush = this.hovering ? this.config.hoverBrushSize : this.config.brushSize;
    this.currentBrushSize = lerp(this.currentBrushSize, targetBrush, 0.08);
    const targetOpacity = this.hovering ? this.config.hoverOpacity : this.config.opacity;
    this.currentOpacity = lerp(this.currentOpacity, targetOpacity, 0.08);
    this.velocity *= 0.9;

    // Pass 1: trail update into FBO B
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.fboB.fb);
    gl.viewport(0, 0, 512, 512);
    gl.useProgram(this.trailProgram);
    gl.enableVertexAttribArray(this.tPosLoc);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
    gl.vertexAttribPointer(this.tPosLoc, 2, gl.FLOAT, false, 0, 0);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.fboA.texture);
    gl.uniform1i(this.tPrevLoc, 0);
    gl.uniform2f(this.tMouseLoc, this.mouseX, this.mouseY);
    gl.uniform2f(this.tMouseDirLoc, this.dirX, this.dirY);
    gl.uniform1f(this.tVelocityLoc, this.velocity);
    gl.uniform1f(this.tDecayLoc, this.config.decay);
    gl.uniform1f(this.tBrushLoc, this.currentBrushSize);
    gl.uniform1f(this.tAspectLoc, this.width / this.height || 1);
    gl.uniform1f(this.tRevealLoc, this.reveal);
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    const tmp = this.fboA;
    this.fboA = this.fboB;
    this.fboB = tmp;

    // Pass 2: halftone to screen
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, this.width * dpr, this.height * dpr);
    gl.useProgram(this.halftoneProgram);
    gl.enableVertexAttribArray(this.hPosLoc);
    gl.vertexAttribPointer(this.hPosLoc, 2, gl.FLOAT, false, 0, 0);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.fboA.texture);
    gl.uniform1i(this.hTrailLoc, 0);
    gl.uniform2f(this.hResLoc, this.width * dpr, this.height * dpr);
    gl.uniform1f(this.hCellLoc, this.config.cellSize);
    gl.uniform3f(this.hColorLoc, this.colorRGB[0], this.colorRGB[1], this.colorRGB[2]);
    gl.uniform1f(this.hOpacityLoc, this.currentOpacity);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    this.rafId = requestAnimationFrame(this.tick);
  }

  destroy() {
    cancelAnimationFrame(this.rafId);
    const gl = this.gl;
    gl.deleteFramebuffer(this.fboA.fb);
    gl.deleteFramebuffer(this.fboB.fb);
    gl.deleteTexture(this.fboA.texture);
    gl.deleteTexture(this.fboB.texture);
    gl.deleteBuffer(this.positionBuffer);
    gl.deleteProgram(this.trailProgram);
    gl.deleteProgram(this.halftoneProgram);
  }
}

// --- React component ---

export interface HalftoneTrailProps {
  cellSize?: number;
  color?: string;
  decay?: number;
  brushSize?: number;
  hoverBrushSize?: number;
  opacity?: number;
  hoverOpacity?: number;
  speedScale?: number;
  hoverSelector?: string;
  className?: string;
}

export const HalftoneTrail: React.FC<HalftoneTrailProps> = ({
  cellSize = 9,
  color = "var(--foreground)",
  decay = 0.97,
  brushSize = 0.04,
  hoverBrushSize = 0.012,
  opacity = 1.0,
  hoverOpacity = 0.2,
  speedScale = 35.0,
  hoverSelector = "a, button, [data-hover]",
  className = "",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<HalftoneTrailEngine | null>(null);
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    let engine: HalftoneTrailEngine;
    try {
      engine = new HalftoneTrailEngine(canvas, {
        decay, brushSize, hoverBrushSize, opacity, hoverOpacity, speedScale, cellSize, hoverSelector,
      });
    } catch {
      setSupported(false);
      return;
    }
    engineRef.current = engine;

    // Resolve color before first visible frame
    engine.setColor(resolveColor(container, color));

    const onPointerMove = (e: PointerEvent) => {
      engine.updatePointer(e.clientX, e.clientY, container.getBoundingClientRect());
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    const ro = new ResizeObserver((entries) => {
      const { width: w, height: h } = entries[0].contentRect;
      if (w <= 0 || h <= 0) return;
      engine.resize(w, h);
      const dpr = Math.min(window.devicePixelRatio, 2);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
    });
    ro.observe(container);

    return () => {
      engine.destroy();
      engineRef.current = null;
      window.removeEventListener("pointermove", onPointerMove);
      ro.disconnect();
    };
  }, [cellSize, decay, brushSize, hoverBrushSize, opacity, hoverOpacity, speedScale, hoverSelector]);

  // Re-resolve color when prop changes or Tailwind dark-mode class toggles on <html>
  useEffect(() => {
    const container = containerRef.current;
    const engine = engineRef.current;
    if (!container || !engine) return;

    const update = () => engine.setColor(resolveColor(container, color));
    update();

    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, [color]);

  if (!supported) return null;

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}
      style={{ zIndex: 0 }}
    >
      <canvas
        ref={canvasRef}
        style={{ display: "block", width: "100%", height: "100%", pointerEvents: "none" }}
      />
    </div>
  );
};

export default HalftoneTrail;
