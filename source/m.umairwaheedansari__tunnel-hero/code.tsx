"use client";

import * as THREE from "three";
import { useRef, useEffect, useState, useCallback } from "react";

/* ----------------------------- utilities ----------------------------- */

/**
 * Most efficient mobile detection for breakpoint changes:
 * - Uses matchMedia (fired only when crossing breakpoint)
 * - Safely no-ops on server (SSR)
 */
function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth <= breakpoint : false
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia(`(max-width: ${breakpoint}px)`);
    const onChange = (e: MediaQueryListEvent | MediaQueryList) =>
      setIsMobile("matches" in e ? e.matches : (e as any).matches);

    // initial
    setIsMobile(mq.matches);

    // modern API
    try {
      mq.addEventListener("change", onChange as any);
      return () => mq.removeEventListener("change", onChange as any);
    } catch {
      // fallback for older browsers
      mq.addListener(onChange as any);
      return () => mq.removeListener(onChange as any);
    }
  }, [breakpoint]);

  return isMobile;
}

/* ----------------------------- shared shader ----------------------------- */

const vertexShader = `void main(){ gl_Position = vec4(position, 1.0); }`;

const fragmentShader = `
uniform float iTime;
uniform vec3 iResolution;

#define TAU 6.2831853071795865
#define TUNNEL_LAYERS 96
#define RING_POINTS 128
#define POINT_SIZE 1.8
#define POINT_COLOR_A vec3(1.0)
#define POINT_COLOR_B vec3(0.7)
#define SPEED 0.7

float sq(float x){ return x*x; }

vec2 AngRep(vec2 uv, float angle){
  vec2 polar = vec2(atan(uv.y, uv.x), length(uv));
  polar.x = mod(polar.x + angle/2.0, angle) - angle/2.0;
  return polar.y * vec2(cos(polar.x), sin(polar.x));
}

float sdCircle(vec2 uv, float r){ return length(uv) - r; }

vec3 MixShape(float sd, vec3 fill, vec3 target){
  float blend = smoothstep(0.0, 1.0/iResolution.y, sd);
  return mix(fill, target, blend);
}

vec2 TunnelPath(float x){
  vec2 offs = vec2(
    0.2 * sin(TAU * x * 0.5) + 0.4 * sin(TAU * x * 0.2 + 0.3),
    0.3 * cos(TAU * x * 0.3) + 0.2 * cos(TAU * x * 0.1)
  );
  offs *= smoothstep(1.0, 4.0, x);
  return offs;
}

void main(){
  vec2 res = iResolution.xy / iResolution.y;
  vec2 uv = gl_FragCoord.xy / iResolution.y - res/2.0;
  vec3 color = vec3(0.0);
  float repAngle = TAU / float(RING_POINTS);
  float pointSize = POINT_SIZE / (2.0 * iResolution.y);
  float camZ = iTime * SPEED;
  vec2 camOffs = TunnelPath(camZ);

  for(int i = 1; i <= TUNNEL_LAYERS; i++){
    float pz = 1.0 - (float(i) / float(TUNNEL_LAYERS));
    pz -= mod(camZ, 4.0 / float(TUNNEL_LAYERS));
    vec2 offs = TunnelPath(camZ + pz) - camOffs;
    float ringRad = 0.15 * (1.0 / sq(pz * 0.8 + 0.4));
    if(abs(length(uv + offs) - ringRad) < pointSize * 1.5){
      vec2 aruv = AngRep(uv + offs, repAngle);
      float pdist = sdCircle(aruv - vec2(ringRad, 0), pointSize);
      vec3 ptColor = (mod(float(i/2), 2.0) == 0.0) ? POINT_COLOR_A : POINT_COLOR_B;
      float shade = (1.0 - pz);
      color = MixShape(pdist, ptColor * shade, color);
    }
  }

  gl_FragColor = vec4(color, 1.0);
}
`;

/* ----------------------------- three helpers ----------------------------- */

type ThreeContext = {
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.OrthographicCamera;
  material: THREE.ShaderMaterial;
  mesh: THREE.Mesh;
  geometry: THREE.PlaneGeometry;
};

function createThreeForCanvas(canvas: HTMLCanvasElement, width: number, height: number): ThreeContext {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  // Cap pixel ratio to avoid excessive GPU usage
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  renderer.setPixelRatio(dpr);
  renderer.setSize(width, height);

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

  const material = new THREE.ShaderMaterial({
    uniforms: {
      iTime: { value: 0 },
      iResolution: { value: new THREE.Vector3(width, height, 1) },
    },
    vertexShader,
    fragmentShader,
  });

  const geometry = new THREE.PlaneGeometry(2, 2);
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  return { renderer, scene, camera, material, mesh, geometry };
}

function disposeThree(ctx: ThreeContext) {
  try {
    ctx.scene.remove(ctx.mesh);
    ctx.mesh.geometry.dispose();
    ctx.material.dispose();
    ctx.renderer.dispose();
  } catch (e) {
    // ignore disposal errors
  }
}

/* ----------------------------- TunnelShowcase (fullscreen) ----------------------------- */

export default function TunnelShowcase() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<ThreeContext | null>(null);
  const lastTimeRef = useRef<number>(0);
  const animRef = useRef<number | null>(null);
  const pausedRef = useRef<boolean>(false);
  const rafResizeRef = useRef<boolean>(false);
  const isMobile = useIsMobile();

  // start / stop animation loop (pausable)
  const animate = useCallback((time: number) => {
    if (!ctxRef.current) return;
    animRef.current = requestAnimationFrame(animate);
    if (pausedRef.current) {
      lastTimeRef.current = time;
      return;
    }
    time *= 0.001; // ms -> s
    const delta = time - (lastTimeRef.current || time);
    lastTimeRef.current = time;
    ctxRef.current.material.uniforms.iTime.value += delta * 0.5; // speedMultiplier = 0.5
    ctxRef.current.renderer.render(ctxRef.current.scene, ctxRef.current.camera);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || typeof window === "undefined") return;

    // create three context with current window size
    const width = window.innerWidth;
    const height = window.innerHeight;
    const ctx = createThreeForCanvas(canvas, width, height);
    ctxRef.current = ctx;

    // resize handler (debounced via rAF)
    const handleResize = () => {
      if (!ctxRef.current) return;
      if (rafResizeRef.current) return;
      rafResizeRef.current = true;
      requestAnimationFrame(() => {
        rafResizeRef.current = false;
        const w = window.innerWidth;
        const h = window.innerHeight;
        ctxRef.current!.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        ctxRef.current!.renderer.setSize(w, h);
        (ctxRef.current!.material.uniforms.iResolution.value as THREE.Vector3).set(w, h, 1);
      });
    };
    window.addEventListener("resize", handleResize);

    // pause when tab not visible to save CPU
    const handleVisibility = () => {
      pausedRef.current = !!document.hidden;
    };
    document.addEventListener("visibilitychange", handleVisibility);
    handleVisibility(); // initial

    // start animation
    animRef.current = requestAnimationFrame(animate);

    // cleanup
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("visibilitychange", handleVisibility);
      if (ctxRef.current) {
        disposeThree(ctxRef.current);
        ctxRef.current = null;
      }
    };
  }, [animate]);

  return (
    <div className="bg-black text-white min-h-screen overflow-hidden relative">
      <canvas
        ref={canvasRef}
        className="fixed top-0 left-0 w-full h-full"
        id="tunnel-canvas"
      />
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4 text-center">
        <div className={`${isMobile ? "mb-4 space-y-2" : "mb-8 space-y-3 md:space-y-6"}`}>
          <div className="inline-block">
            <h1 className={`${isMobile ? "text-3xl" : "text-6xl md:text-8xl"} font-black tracking-tighter bg-gradient-to-r from-white via-gray-200 to-white bg-clip-text text-transparent animate-pulse`}>
              TUNNEL
            </h1>
            <div className={`h-1 w-full bg-gradient-to-r from-transparent via-white to-transparent ${isMobile ? "mt-2" : "mt-4"} animate-pulse`} />
          </div>
          <p className={`${isMobile ? "text-sm px-4 leading-relaxed" : "text-lg md:text-xl px-0 leading-relaxed"} text-gray-300 max-w-2xl font-light`}>
            Experience an infinite journey through space and time with this mesmerizing
            <span className="text-white font-medium"> Three.js </span>
            powered tunnel effect that responds to your {isMobile ? "touch" : "movement"}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ----------------------------- TunnelTheme (container-based) ----------------------------- */

export function TunnelTheme() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<ThreeContext | null>(null);
  const lastTimeRef = useRef<number>(0);
  const animRef = useRef<number | null>(null);
  const pausedRef = useRef<boolean>(false);
  const rafResizeRef = useRef<boolean>(false);
  const isMobile = useIsMobile();

  const animate = useCallback((time: number) => {
    if (!ctxRef.current) return;
    animRef.current = requestAnimationFrame(animate);
    if (pausedRef.current) {
      lastTimeRef.current = time;
      return;
    }
    time *= 0.001;
    const delta = time - (lastTimeRef.current || time);
    lastTimeRef.current = time;
    ctxRef.current.material.uniforms.iTime.value += delta * 0.5;
    ctxRef.current.renderer.render(ctxRef.current.scene, ctxRef.current.camera);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || typeof window === "undefined") return;

    const container = canvas.parentElement;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    const ctx = createThreeForCanvas(canvas, width, height);
    ctxRef.current = ctx;

    const resizeObserver = new ResizeObserver(() => {
      if (!ctxRef.current) return;
      if (rafResizeRef.current) return;
      rafResizeRef.current = true;
      requestAnimationFrame(() => {
        rafResizeRef.current = false;
        const w = container.clientWidth;
        const h = container.clientHeight;
        ctxRef.current!.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        ctxRef.current!.renderer.setSize(w, h);
        (ctxRef.current!.material.uniforms.iResolution.value as THREE.Vector3).set(w, h, 1);
      });
    });
    resizeObserver.observe(container);

    const handleVisibility = () => {
      pausedRef.current = !!document.hidden;
    };
    document.addEventListener("visibilitychange", handleVisibility);
    handleVisibility();

    animRef.current = requestAnimationFrame(animate);

    return () => {
      resizeObserver.disconnect();
      if (animRef.current) cancelAnimationFrame(animRef.current);
      document.removeEventListener("visibilitychange", handleVisibility);
      if (ctxRef.current) {
        disposeThree(ctxRef.current);
        ctxRef.current = null;
      }
    };
  }, [animate]);

  return (
    <div className="relative w-full h-96 bg-black overflow-hidden rounded-lg">
      <canvas ref={canvasRef} className="w-full h-full" />
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div className="text-center text-white">
          <h2 className={`${isMobile ? "text-2xl" : "text-4xl"} font-bold mb-2 md:mb-4`}>
            TUNNEL
          </h2>
          <p className={`${isMobile ? "text-sm" : "text-lg"} opacity-80`}>
            {isMobile ? "Touch to interact" : "Experience the infinite journey"}
          </p>
        </div>
      </div>
    </div>
  );
}
