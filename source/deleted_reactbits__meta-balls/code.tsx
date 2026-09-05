"use client"; 

import React, { useEffect, useRef, FC } from "react";
import {
  Renderer,
  Program,
  Mesh,
  Triangle,
  Transform,
  Vec3,
  Camera,
} from "ogl";

type MetaBallsProps = {
  color?: string;
  speed?: number;
  enableMouseInteraction?: boolean;
  hoverSmoothness?: number;
  animationSize?: number;
  ballCount?: number;
  clumpFactor?: number;
  cursorBallSize?: number;
  cursorBallColor?: string;
  enableTransparency?: boolean;
  className?: string; 
  style?: React.CSSProperties; 
};

function parseHexColor(hex: string): [number, number, number] {
  const c = hex.replace("#", "");
  if (c.length !== 6) return [1, 1, 1]; 
  const r = parseInt(c.substring(0, 2), 16) / 255;
  const g = parseInt(c.substring(2, 4), 16) / 255;
  const b = parseInt(c.substring(4, 6), 16) / 255;
  return [r, g, b];
}
function fract(x: number): number { return x - Math.floor(x); }
function hash31(pNum: number): number[] { 
    let r = [pNum * 0.1031, pNum * 0.103, pNum * 0.0973].map(fract);
    const r_yzx = [r[1], r[2], r[0]];
    const dotVal = r[0] * (r_yzx[0] + 33.33) + r[1] * (r_yzx[1] + 33.33) + r[2] * (r_yzx[2] + 33.33);
    for (let i = 0; i < 3; i++) { r[i] = fract(r[i] + dotVal); } return r;
}
function hash33(v: number[]): number[] { 
    let p = [v[0] * 0.1031, v[1] * 0.103, v[2] * 0.0973].map(fract);
    const p_yxz = [p[1], p[0], p[2]];
    const dotVal = p[0] * (p_yxz[0] + 33.33) + p[1] * (p_yxz[1] + 33.33) + p[2] * (p_yxz[2] + 33.33);
    for (let i = 0; i < 3; i++) { p[i] = fract(p[i] + dotVal); }
    const p_xxy = [p[0], p[0], p[1]]; const p_yxx = [p[1], p[0], p[0]]; const p_zyx = [p[2], p[1], p[0]];
    const result: number[] = []; for (let i = 0; i < 3; i++) { result[i] = fract((p_xxy[i] + p_yxx[i]) * p_zyx[i]); } return result;
}

const vertex = `#version 300 es
precision highp float; layout(location = 0) in vec2 position;
void main() { gl_Position = vec4(position, 0.0, 1.0); }`;

const fragment = `#version 300 es
precision highp float; uniform vec3 iResolution; uniform float iTime; uniform vec3 iMouse;
uniform vec3 iColor; uniform vec3 iCursorColor; uniform float iAnimationSize; uniform int iBallCount;
uniform float iCursorBallSize; uniform vec3 iMetaBalls[50]; uniform float iClumpFactor; uniform bool enableTransparency;
out vec4 outColor; const float PI = 3.14159265359;
float getMetaBallValue(vec2 c, float r, vec2 p) { vec2 d = p - c; float dist2 = dot(d, d); return (dist2 == 0.0) ? 10000.0 : (r * r) / dist2; }
void main() { vec2 fc = gl_FragCoord.xy; float scale = iAnimationSize / iResolution.y; vec2 coord = (fc - iResolution.xy * 0.5) * scale; vec2 mouseW = (iMouse.xy - iResolution.xy * 0.5) * scale; float m1 = 0.0; for (int i = 0; i < 50; i++) { if (i >= iBallCount) break; m1 += getMetaBallValue(iMetaBalls[i].xy, iMetaBalls[i].z, coord); } float m2 = getMetaBallValue(mouseW, iCursorBallSize, coord); float total = m1 + m2; float f = smoothstep(-1.0, 1.0, (total - 1.3) / max(0.0001, fwidth(total))); vec3 cFinal = vec3(0.0); if (total > 0.0001) { float alpha1 = m1 / total; float alpha2 = m2 / total; cFinal = iColor * alpha1 + iCursorColor * alpha2; } outColor = vec4(cFinal * f, enableTransparency ? f : 1.0); }`;

type BallParams = { st: number; dtFactor: number; baseScale: number; toggle: number; radius: number; };

export const MetaBalls: FC<MetaBallsProps> = ({
  color = "#ffffff", 
  speed = 0.3,
  enableMouseInteraction = true,
  hoverSmoothness = 0.05,
  animationSize = 30,
  ballCount = 15,
  clumpFactor = 1,
  cursorBallSize = 3,
  cursorBallColor = "#ffffff", 
  enableTransparency = false, 
  className = "",
  style = {}
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<Renderer | null>(null);
  const programRef = useRef<Program | null>(null); 
  const meshRef = useRef<Mesh | null>(null);
  const cameraRef = useRef<Camera | null>(null);
  const sceneRef = useRef<Transform | null>(null);
  
  const animationFrameIdRef = useRef<number | null>(null);
  const resizeHandlerRef = useRef<() => void>(() => {});
  const pointerMoveHandlerRef = useRef<(e: PointerEvent) => void>(() => {});
  const pointerEnterHandlerRef = useRef<() => void>(() => {});
  const pointerLeaveHandlerRef = useRef<() => void>(() => {});
  const metaBallsUniformArrayRef = useRef<Vec3[]>([]);
  const ballParamsArrayRef = useRef<BallParams[]>([]);
  const mouseBallPosRef = useRef({ x: 0, y: 0 });
  const pointerStateRef = useRef({ inside: false, x: 0, y: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    if (rendererRef.current) {
        if (animationFrameIdRef.current) cancelAnimationFrame(animationFrameIdRef.current);
        window.removeEventListener("resize", resizeHandlerRef.current);
        container.removeEventListener("pointermove", pointerMoveHandlerRef.current);
        container.removeEventListener("pointerenter", pointerEnterHandlerRef.current);
        container.removeEventListener("pointerleave", pointerLeaveHandlerRef.current);
        if (rendererRef.current.gl.canvas && rendererRef.current.gl.canvas.parentNode === container) {
            container.removeChild(rendererRef.current.gl.canvas);
        }
        const gl = rendererRef.current.gl;
        const loseContextExt = gl.getExtension("WEBGL_lose_context");
        if (loseContextExt) loseContextExt.loseContext();
        rendererRef.current = null; programRef.current = null; meshRef.current = null;
        cameraRef.current = null; sceneRef.current = null;
    }

    const dpr = window.devicePixelRatio || 1;
    const renderer = new Renderer({ dpr, alpha: true, premultipliedAlpha: false });
    rendererRef.current = renderer;
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, enableTransparency ? 0 : 1); 
    gl.canvas.style.width = '100%'; gl.canvas.style.height = '100%';
    container.appendChild(gl.canvas);

    const camera = new Camera(gl, { left: -1, right: 1, top: 1, bottom: -1, near: 0.1, far: 10, });
    camera.position.z = 1; cameraRef.current = camera;
    const geometry = new Triangle(gl);
    const [r1, g1, b1] = parseHexColor(color); const [r2, g2, b2] = parseHexColor(cursorBallColor);
    metaBallsUniformArrayRef.current = Array.from({length: 50}, () => new Vec3(0,0,0));

    const program = new Program(gl, {
      vertex, fragment,
      uniforms: {
        iTime: { value: 0 }, iResolution: { value: new Vec3(0, 0, 0) },
        iMouse: { value: new Vec3(0, 0, 0) }, iColor: { value: new Vec3(r1, g1, b1) },
        iCursorColor: { value: new Vec3(r2, g2, b2) }, iAnimationSize: { value: animationSize },
        iBallCount: { value: Math.min(ballCount, 50) }, 
        iCursorBallSize: { value: cursorBallSize },
        iMetaBalls: { value: metaBallsUniformArrayRef.current }, 
        iClumpFactor: { value: clumpFactor },
        enableTransparency: { value: enableTransparency },
      },
    });
    programRef.current = program;

    const mesh = new Mesh(gl, { geometry, program });
    meshRef.current = mesh;
    const scene = new Transform();
    sceneRef.current = scene;
    mesh.setParent(scene);

    const effectiveBallCount = Math.min(ballCount, 50);
    ballParamsArrayRef.current = [];
    for (let i = 0; i < effectiveBallCount; i++) {
      const idx = i + 1; const h1 = hash31(idx);
      const st = h1[0] * (2 * Math.PI);
      const dtFactor = 0.1 * Math.PI + h1[1] * (0.4 * Math.PI - 0.1 * Math.PI);
      const baseScale = 5.0 + h1[1] * (10.0 - 5.0);
      const h2 = hash33(h1); const toggle = Math.floor(h2[0] * 2.0);
      const radiusVal = 0.5 + h2[2] * (2.0 - 0.5);
      ballParamsArrayRef.current.push({ st, dtFactor, baseScale, toggle, radius: radiusVal });
    }
    
    mouseBallPosRef.current = { x: gl.drawingBufferWidth / 2, y: gl.drawingBufferHeight / 2 };
    pointerStateRef.current = { inside: false, x: 0, y: 0 };

    resizeHandlerRef.current = () => {
      if (!container || !rendererRef.current || !programRef.current) return;
      const currentRenderer = rendererRef.current; const currentProgram = programRef.current;
      const width = container.clientWidth; const height = container.clientHeight;
      currentRenderer.setSize(width * dpr, height * dpr); 
      currentProgram.uniforms.iResolution.value.set(currentRenderer.gl.drawingBufferWidth, currentRenderer.gl.drawingBufferHeight, 0);
    };
    window.addEventListener("resize", resizeHandlerRef.current);
    resizeHandlerRef.current(); 

    pointerMoveHandlerRef.current = (e: PointerEvent) => {
      if (!enableMouseInteraction || !container || !rendererRef.current) return;
      const rect = container.getBoundingClientRect();
      const px = e.clientX - rect.left; const py = e.clientY - rect.top;
      pointerStateRef.current.x = (px / rect.width) * rendererRef.current.gl.drawingBufferWidth;
      pointerStateRef.current.y = (1 - py / rect.height) * rendererRef.current.gl.drawingBufferHeight;
    };
    pointerEnterHandlerRef.current = () => { if (enableMouseInteraction) pointerStateRef.current.inside = true; };
    pointerLeaveHandlerRef.current = () => { if (enableMouseInteraction) pointerStateRef.current.inside = false; };
    container.addEventListener("pointermove", pointerMoveHandlerRef.current);
    container.addEventListener("pointerenter", pointerEnterHandlerRef.current);
    container.addEventListener("pointerleave", pointerLeaveHandlerRef.current);

    const startTime = performance.now();
    function updateLoop(t: number) {
      animationFrameIdRef.current = requestAnimationFrame(updateLoop);
      if (!rendererRef.current || !programRef.current || !sceneRef.current || !cameraRef.current) return;
      const currentRenderer = rendererRef.current; const currentProgram = programRef.current;
      const currentScene = sceneRef.current; const currentCamera = cameraRef.current;
      const elapsed = (t - startTime) * 0.001;
      currentProgram.uniforms.iTime.value = elapsed;
      const currentEffectiveBallCount = Math.min(ballCount, 50);
      currentProgram.uniforms.iBallCount.value = currentEffectiveBallCount;
      for (let i = 0; i < currentEffectiveBallCount; i++) {
        const p = ballParamsArrayRef.current[i]; if(!p) continue; 
        const dt = elapsed * speed * p.dtFactor; const th = p.st + dt;
        const x = Math.cos(th); const y = Math.sin(th + dt * p.toggle);
        const posX = x * p.baseScale * clumpFactor; const posY = y * p.baseScale * clumpFactor;
        if(metaBallsUniformArrayRef.current[i]) metaBallsUniformArrayRef.current[i].set(posX, posY, p.radius);
      }
      let targetX: number, targetY: number;
      if (pointerStateRef.current.inside) {
        targetX = pointerStateRef.current.x; targetY = pointerStateRef.current.y;
      } else {
        const glCtx = currentRenderer.gl; 
        const cx = glCtx.drawingBufferWidth * 0.5; const cy = glCtx.drawingBufferHeight * 0.5;
        const rx = glCtx.drawingBufferWidth * 0.15; const ry = glCtx.drawingBufferHeight * 0.15;
        targetX = cx + Math.cos(elapsed * speed) * rx;
        targetY = cy + Math.sin(elapsed * speed) * ry;
      }
      mouseBallPosRef.current.x += (targetX - mouseBallPosRef.current.x) * hoverSmoothness;
      mouseBallPosRef.current.y += (targetY - mouseBallPosRef.current.y) * hoverSmoothness;
      currentProgram.uniforms.iMouse.value.set(mouseBallPosRef.current.x, mouseBallPosRef.current.y, 0);
      currentRenderer.render({ scene: currentScene, camera: currentCamera });
    }
    animationFrameIdRef.current = requestAnimationFrame(updateLoop);

    return () => {
      if (animationFrameIdRef.current) cancelAnimationFrame(animationFrameIdRef.current);
      window.removeEventListener("resize", resizeHandlerRef.current);
      container.removeEventListener("pointermove", pointerMoveHandlerRef.current);
      container.removeEventListener("pointerenter", pointerEnterHandlerRef.current);
      container.removeEventListener("pointerleave", pointerLeaveHandlerRef.current);
      if (rendererRef.current && rendererRef.current.gl.canvas && rendererRef.current.gl.canvas.parentNode === container) {
        container.removeChild(rendererRef.current.gl.canvas);
      }
      const glCtx = rendererRef.current?.gl;
      if (glCtx) { const loseCtxExt = glCtx.getExtension("WEBGL_lose_context"); loseCtxExt?.loseContext(); }
      rendererRef.current = null; programRef.current = null; meshRef.current = null;
      cameraRef.current = null; sceneRef.current = null;
    };
  }, [ 
    color, speed, enableMouseInteraction, hoverSmoothness, animationSize,
    ballCount, clumpFactor, cursorBallSize, cursorBallColor, enableTransparency,
  ]);

  return <div ref={containerRef} className={`metaballs-container relative w-full h-full ${className}`} style={style} />;
};