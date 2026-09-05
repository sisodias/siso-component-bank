// EnchantedForestHero.tsx
// Reusable, props-driven hero aligned with 21st.dev quality guidelines.
// - TypeScript-first
// - Theming via CSS variables (shadcn-compatible)
// - Accessibility & reduced-motion support
// - Clean separation between reusable component and demo content
// - No hardcoded copy; everything is passed via props

import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import * as THREE from "three";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
// Postprocessing (optional bloom)
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";

gsap.registerPlugin(ScrollTrigger);

export type Phase = "loading" | "approach" | "opening" | "revealed";

export type SecretMessage = {
  title: string;
  lines?: string[];
  wisdom?: string;
  author?: string;
};

export type ThemeTokens = {
  // values should be raw hsl like "210 40% 98%"
  background: string; // --background
  foreground: string; // --foreground
  accent: string; // --accent (primary accent/cyan-ish)
  accentForeground: string; // --accent-foreground
  muted: string; // --muted
  mutedForeground: string; // --muted-foreground
};

export type EnchantedForestHeroProps = {
  className?: string;
  // Scene options
  doorDistance?: number; // z position for door
  particleCount?: number;
  enableBloom?: boolean;
  bloomStrength?: number;
  pixelRatioMax?: number; // cap DPR for perf
  // UX
  heightVh?: number; // total height to allow scrolling through the hero (default 300)
  showProgressIndicator?: boolean;
  reducedMotion?: boolean; // force reduced motion regardless of media query
  // Content
  message: SecretMessage;
  // Events
  onProgress?: (progress: number) => void;
  onPhaseChange?: (phase: Phase) => void;
  // Theming
  theme?: Partial<ThemeTokens>;
};

const DEFAULT_THEME: ThemeTokens = {
  background: "220 80% 2%", // deep blue-black
  foreground: "210 40% 98%",
  accent: "205 100% 75%", // cyan-ish
  accentForeground: "220 80% 10%",
  muted: "215 16% 20%",
  mutedForeground: "210 20% 80%",
};

// Lightweight film/color-grade shader (scroll-driven)
const FilmShader = {
  uniforms: {
    tDiffuse: { value: null as THREE.Texture | null },
    scrollProgress: { value: 0 },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform float scrollProgress;
    varying vec2 vUv;

    float luma(vec3 c) { return dot(c, vec3(0.299, 0.587, 0.114)); }

    vec3 grade(vec3 color, float t){
      // gentle cinematic grade that intensifies as you scroll
      float L = luma(color);
      vec3 shadows = vec3(0.0, 0.08, 0.15);
      vec3 mids    = vec3(1.0, 0.95, 0.85);
      vec3 highs   = vec3(1.0, 0.98, 0.95);
      vec3 g = mix(shadows, mids, smoothstep(0.0, 0.5, L));
      g = mix(g, highs, smoothstep(0.5, 1.0, L));
      return mix(color, g, 0.4 + t * 0.2);
    }

    void main() {
      vec4 base = texture2D(tDiffuse, vUv);
      base.rgb = grade(base.rgb, scrollProgress);
      float vig = 1.0 - length(vUv - 0.5) * (1.0 + scrollProgress * 0.5);
      base.rgb *= clamp(vig, 0.0, 1.0);
      gl_FragColor = base;
    }
  `,
};

// Hook: owns the Three.js scene and scroll-driven rendering
function useEnchantedForestScene(opts: {
  doorDistance: number;
  particleCount: number;
  enableBloom: boolean;
  bloomStrength: number;
  pixelRatioMax: number;
  prefersReducedMotion: boolean;
  onProgress?: (p: number) => void;
  onPhaseChange?: (ph: Phase) => void;
}) {
  const {
    doorDistance,
    particleCount,
    enableBloom,
    bloomStrength,
    pixelRatioMax,
    prefersReducedMotion,
    onProgress,
    onPhaseChange,
  } = opts;

  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const progressRef = useRef(0);
  const [loading, setLoading] = useState(true);
  const [phase, setPhase] = useState<Phase>("loading");

  // Scene refs bucket
  const refs = useRef<{
    scene?: THREE.Scene;
    camera?: THREE.PerspectiveCamera;
    renderer?: THREE.WebGLRenderer;
    composer?: EffectComposer;
    doorGroup?: THREE.Group;
    doorLight?: THREE.PointLight;
    fireflies: THREE.Mesh[];
    fogPoints?: THREE.Points;
    geometryCache: Map<string, THREE.BufferGeometry>;
    materialCache: Map<string, THREE.Material>;
    precomputed: {
      cameraPath: Array<{ x: number; y: number; z: number }>;
      doorRotation: number[];
      particleFrames: Float32Array[];
    };
  }>({
    fireflies: [],
    geometryCache: new Map(),
    materialCache: new Map(),
    precomputed: { cameraPath: [], doorRotation: [], particleFrames: [] },
  });

  // Precompute motion curves (no per-frame math)
  const precompute = useCallback(() => {
    const pre = refs.current.precomputed;
    const frames = 100;
    // camera path
    pre.cameraPath = Array.from({ length: frames + 1 }, (_, i) => {
      const t = i / frames;
      return {
        x: Math.sin(t * Math.PI * 0.2) * 2,
        y: 5 + t * 5,
        z: 60 - t * 55,
      };
    });
    // door rotation (ease-in)
    pre.doorRotation = Array.from({ length: frames + 1 }, (_, i) => {
      const t = i / frames;
      const ease = t * t;
      return ease * (Math.PI * 0.5);
    });
    // particles frames
    const count = particleCount;
    pre.particleFrames = Array.from({ length: frames + 1 }, (_, fi) => {
      const t = fi / frames;
      const positions: number[] = [];
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2;
        const radius = (12 + Math.sin(angle * 3) * 2) * (1 + t * 0.5);
        positions.push(
          Math.cos(angle) * radius,
          (i / count) * 18,
          Math.sin(angle) * radius
        );
      }
      return new Float32Array(positions);
    });
  }, [particleCount]);

  // Scene init (idempotent)
  const init = useCallback(() => {
    if (!canvasRef.current) return;

    const r = refs.current;
    r.scene = new THREE.Scene();
    r.scene.fog = new THREE.FogExp2(0x000510, 0.015);

    r.camera = new THREE.PerspectiveCamera(55, 1, 0.1, 1000);
    r.camera.position.set(0, 5, 60);

    r.renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current!,
      antialias: false,
      alpha: false,
      powerPreference: "high-performance",
      stencil: false,
      depth: true,
    });

    const DPR = Math.min(window.devicePixelRatio || 1, pixelRatioMax);
    r.renderer.setPixelRatio(DPR);
    r.renderer.setSize(window.innerWidth, window.innerHeight);
    r.renderer.setClearColor(0x000510);

    // Lighting
    {
      r.scene.add(new THREE.AmbientLight(0x020408, 0.2));
      const moon = new THREE.DirectionalLight(0x4477aa, 0.5);
      moon.position.set(30, 100, 50);
      moon.castShadow = false;
      r.scene.add(moon);
      const hemi = new THREE.HemisphereLight(0x111122, 0x000000, 0.3);
      r.scene.add(hemi);
    }

    // Ground
    {
      const geom = new THREE.PlaneGeometry(300, 300, 50, 50);
      const arr = geom.attributes.position.array as Float32Array;
      for (let i = 0; i < arr.length; i += 3) {
        arr[i + 2] = Math.sin(arr[i] * 0.05) * 2 + Math.random() * 0.5;
      }
      geom.computeVertexNormals();
      const mat = new THREE.MeshPhongMaterial({
        color: 0x050a05,
        shininess: 5,
      });
      const ground = new THREE.Mesh(geom, mat);
      ground.rotation.x = -Math.PI / 2;
      ground.receiveShadow = false;
      r.scene.add(ground);
    }

    // Trees (instanced)
    {
      const trunk = new THREE.CylinderGeometry(0.5, 0.8, 8, 6);
      const foliage = new THREE.IcosahedronGeometry(3, 1);
      const trunkMat = new THREE.MeshPhongMaterial({
        color: 0x1a0f08,
        shininess: 10,
      });
      const foliageMat = new THREE.MeshPhongMaterial({
        color: 0x0a4020,
        shininess: 30,
      });

      const count = 100;
      const trunkIM = new THREE.InstancedMesh(trunk, trunkMat, count);
      const foliageIM = new THREE.InstancedMesh(foliage, foliageMat, count * 3);

      const m = new THREE.Matrix4();
      const q = new THREE.Quaternion();
      const p = new THREE.Vector3();
      const s = new THREE.Vector3();

      for (let i = 0; i < count; i++) {
        let x: number, z: number;
        do {
          x = (Math.random() - 0.5) * 200;
          z = (Math.random() - 0.5) * 200;
        } while (Math.abs(x) < 20 && Math.abs(z) < 60);

        p.set(x, 4, z);
        q.setFromEuler(new THREE.Euler(0, Math.random() * Math.PI * 2, 0));
        s.set(1, 0.8 + Math.random() * 0.4, 1);
        m.compose(p, q, s);
        trunkIM.setMatrixAt(i, m);

        for (let j = 0; j < 3; j++) {
          p.set(
            x + (Math.random() - 0.5) * 2,
            7 + j * 2 + Math.random(),
            z + (Math.random() - 0.5) * 2
          );
          s.setScalar(1 + Math.random() * 0.3);
          m.compose(p, q, s);
          foliageIM.setMatrixAt(i * 3 + j, m);
        }
      }
      trunkIM.instanceMatrix.needsUpdate = true;
      foliageIM.instanceMatrix.needsUpdate = true;
      r.scene.add(trunkIM, foliageIM);
    }

    // Door + particles
    {
      const doorGroup = new THREE.Group();

      const frameGeom = new THREE.TorusGeometry(9, 1.2, 12, 16, Math.PI);
      const doorGeom = new THREE.BoxGeometry(7, 15, 0.5);
      const pillarGeom = new THREE.BoxGeometry(2.5, 18, 2.5);

      const frameMat = new THREE.ShaderMaterial({
        uniforms: {
          scrollProgress: { value: 0 },
          glowColor: { value: new THREE.Color(0x88ccff) },
        },
        vertexShader: `
          varying vec3 vNormal;
          void main() {
            vNormal = normal;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform float scrollProgress;
          uniform vec3 glowColor;
          varying vec3 vNormal;
          void main() {
            vec3 base = vec3(0.15, 0.15, 0.18);
            float fres = pow(1.0 - abs(dot(normalize(vNormal), vec3(0.,0.,1.))), 2.0);
            vec3 col = mix(base, glowColor, fres * scrollProgress);
            gl_FragColor = vec4(col, 1.0);
          }
        `,
      });

      const frame = new THREE.Mesh(frameGeom, frameMat);
      frame.position.y = 9;
      const leftP = new THREE.Mesh(pillarGeom, frameMat.clone());
      leftP.position.set(-8, 9, 0);
      const rightP = new THREE.Mesh(pillarGeom, frameMat.clone());
      rightP.position.set(8, 9, 0);

      const doorMat = new THREE.ShaderMaterial({
        uniforms: { scrollProgress: { value: 0 } },
        vertexShader: `
          varying vec2 vUv;
          void main(){
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform float scrollProgress;
          varying vec2 vUv;
          void main(){
            vec3 wood = vec3(0.15, 0.08, 0.03);
            vec3 glow = vec3(0.5, 0.8, 1.0);
            float seam = smoothstep(0.48, 0.52, abs(vUv.x - 0.5));
            vec3 col = mix(wood, glow, seam * scrollProgress);
            float edge = 1.0 - max(abs(vUv.x-0.5), abs(vUv.y-0.5)) * 2.0;
            edge = pow(edge, 3.0);
            col += glow * edge * scrollProgress * 0.3;
            gl_FragColor = vec4(col, 1.0);
          }
        `,
      });

      const leftDoor = new THREE.Mesh(doorGeom, doorMat);
      leftDoor.position.set(-3.5, 7.5, 0);
      leftDoor.name = "leftDoor";
      const rightDoor = new THREE.Mesh(doorGeom, doorMat.clone());
      rightDoor.position.set(3.5, 7.5, 0);
      rightDoor.name = "rightDoor";

      const doorLight = new THREE.PointLight(0x88ccff, 0, 40);
      doorLight.position.set(0, 8, 2);

      // Particles
      const particlesGeom = new THREE.BufferGeometry();
      const initial = refs.current.precomputed.particleFrames[0];
      particlesGeom.setAttribute(
        "position",
        new THREE.BufferAttribute(initial, 3)
      );

      const particles = new THREE.Points(
        particlesGeom,
        new THREE.PointsMaterial({
          color: 0x88ccff,
          size: 0.3,
          transparent: true,
          opacity: 0,
          blending: THREE.AdditiveBlending,
        })
      );
      particles.name = "doorParticles";

      doorGroup.add(frame, leftP, rightP, leftDoor, rightDoor, doorLight, particles);
      doorGroup.position.z = -Math.abs(doorDistance);
      r.doorGroup = doorGroup;
      r.doorLight = doorLight;
      r.scene.add(doorGroup);
    }

    // Fog points (simple drifting)
    {
      const fogCount = 50;
      const fogGeometry = new THREE.BufferGeometry();
      const positions = new Float32Array(fogCount * 3);
      const sizes = new Float32Array(fogCount);
      for (let i = 0; i < fogCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 150;
        positions[i * 3 + 1] = Math.random() * 20;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 150;
        sizes[i] = 20 + Math.random() * 30;
      }
      fogGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3)
      );
      fogGeometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

      const fogMaterial = new THREE.ShaderMaterial({
        uniforms: { scrollProgress: { value: 0 } },
        vertexShader: `
          attribute float size;
          varying float vOpacity;
          uniform float scrollProgress;
          void main(){
            vOpacity = 0.2 + scrollProgress * 0.1;
            vec3 pos = position;
            pos.x += sin(scrollProgress * 3.14159 + position.y * 0.1) * 10.0;
            vec4 mv = modelViewMatrix * vec4(pos, 1.0);
            gl_PointSize = size * (300.0 / -mv.z);
            gl_Position = projectionMatrix * mv;
          }
        `,
        fragmentShader: `
          varying float vOpacity;
          void main(){
            float d = length(gl_PointCoord - vec2(0.5));
            if (d > 0.5) discard;
            float a = (1.0 - smoothstep(0.0, 0.5, d)) * vOpacity;
            gl_FragColor = vec4(0.4, 0.5, 0.6, a);
          }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });

      const fogPoints = new THREE.Points(fogGeometry, fogMaterial);
      r.fogPoints = fogPoints;
      r.scene.add(fogPoints);
    }

    // Fireflies
    {
      const geo = new THREE.SphereGeometry(0.05, 4, 4);
      const mat = new THREE.MeshBasicMaterial({
        color: 0xffffaa,
        transparent: true,
      });
      for (let i = 0; i < 30; i++) {
        const f = new THREE.Mesh(geo, mat.clone());
        f.position.set(
          (Math.random() - 0.5) * 100,
          2 + Math.random() * 10,
          (Math.random() - 0.5) * 100
        );
        (f as any).userData = {
          initialPos: f.position.clone(),
          phase: Math.random() * Math.PI * 2,
          radius: 5 + Math.random() * 10,
        };
        refs.current.fireflies.push(f);
        r.scene.add(f);
      }
    }

    // Post-processing
    if (enableBloom) {
      const composer = new EffectComposer(r.renderer!);
      composer.addPass(new RenderPass(r.scene!, r.camera!));
      const bloom = new UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        bloomStrength,
        0.4,
        0.85
      );
      composer.addPass(bloom);
      const filmPass = new ShaderPass(FilmShader as any);
      composer.addPass(filmPass);
      r.composer = composer;
    }

    // Resize
    const onResize = () => {
      if (!r.camera || !r.renderer) return;
      r.camera.aspect = window.innerWidth / window.innerHeight;
      r.camera.updateProjectionMatrix();
      r.renderer.setSize(window.innerWidth, window.innerHeight);
      if (r.composer) r.composer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", onResize);
      if (r.composer) (r.composer as any).dispose?.();
      r.renderer?.dispose();
      // Let GC reclaim geometries/materials; explicit dispose where needed:
      r.fogPoints?.geometry.dispose();
      (r.fogPoints?.material as THREE.Material | undefined)?.dispose();
    };
  }, [doorDistance, enableBloom, bloomStrength, pixelRatioMax]);

  // Render on scroll
  const render = useCallback(() => {
    const r = refs.current;
    if (!r.renderer || !r.scene || !r.camera) return;

    const t = prefersReducedMotion ? 1 : progressRef.current;
    const frames = 100;
    const idx = Math.min(Math.floor(t * frames), frames);

    // camera
    const camPos = r.precomputed.cameraPath[idx];
    if (camPos) {
      r.camera.position.set(camPos.x, camPos.y, camPos.z);
      r.camera.lookAt(0, 5 + t * 3, -Math.abs(doorDistance));
    }

    // door
    if (r.doorGroup) {
      const leftDoor = r.doorGroup.getObjectByName("leftDoor") as THREE.Mesh;
      const rightDoor = r.doorGroup.getObjectByName("rightDoor") as THREE.Mesh;
      const doorParticles = r.doorGroup.getObjectByName(
        "doorParticles"
      ) as THREE.Points;

      const rot = r.precomputed.doorRotation[idx] ?? 0;
      if (leftDoor) {
        leftDoor.rotation.y = -rot;
        (leftDoor.material as any).uniforms.scrollProgress.value = t;
      }
      if (rightDoor) {
        rightDoor.rotation.y = rot;
        (rightDoor.material as any).uniforms.scrollProgress.value = t;
      }

      r.doorGroup.children.forEach((c) => {
        const m = (c as any).material;
        if (m?.uniforms?.scrollProgress) m.uniforms.scrollProgress.value = t;
      });

      if (r.doorLight) r.doorLight.intensity = prefersReducedMotion ? 0 : t * 8;

      if (doorParticles && r.precomputed.particleFrames[idx]) {
        const attr = doorParticles.geometry.attributes.position as THREE.BufferAttribute;
        // swap attribute array reference to precomputed frame
        (attr.array as any) = r.precomputed.particleFrames[idx];
        attr.needsUpdate = true;
        (doorParticles.material as THREE.PointsMaterial).opacity = prefersReducedMotion
          ? 0
          : t * 0.6;
      }
    }

    // fireflies
    if (!prefersReducedMotion) {
      refs.current.fireflies.forEach((f) => {
        const d = (f as any).userData;
        const a = t * Math.PI * 2 + d.phase;
        f.position.x = d.initialPos.x + Math.cos(a) * d.radius;
        f.position.z = d.initialPos.z + Math.sin(a) * d.radius;
        f.position.y = d.initialPos.y + Math.sin(a * 2) * 2;
        (f.material as THREE.Material & { opacity?: number }).opacity =
          0.3 + Math.sin(a * 3) * 0.7;
      });
    }

    // fog
    if (refs.current.fogPoints) {
      const mat = refs.current.fogPoints.material as any;
      if (mat?.uniforms?.scrollProgress) mat.uniforms.scrollProgress.value = t;
    }

    if (r.composer) r.composer.render();
    else r.renderer.render(r.scene, r.camera);
  }, [prefersReducedMotion, doorDistance]);

  // ScrollTrigger wiring (layout effect to avoid flicker)
  useLayoutEffect(() => {
    if (!containerRef.current) return;
    precompute();
    const cleanup = init();
    setLoading(false);

    const st = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      onUpdate: (self) => {
        progressRef.current = self.progress;
        onProgress?.(self.progress);

        const ph: Phase =
          self.progress < 0.3 ? "approach" : self.progress < 0.7 ? "opening" : "revealed";
        setPhase(ph);
        onPhaseChange?.(ph);

        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(render);
      },
    });

    // initial frame
    render();

    return () => {
      st.kill();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      cleanup?.();
    };
  }, [init, precompute, render, onProgress, onPhaseChange]);

  return { containerRef, canvasRef, loading, phase, progressRef };
}

export function EnchantedForestHero({
  className,
  doorDistance = 30,
  particleCount = 200,
  enableBloom = true,
  bloomStrength = 0.8,
  pixelRatioMax = 1.5,
  heightVh = 300,
  showProgressIndicator = true,
  reducedMotion,
  message,
  onProgress,
  onPhaseChange,
  theme,
}: EnchantedForestHeroProps) {
  // prefers-reduced-motion
  const mql = typeof window !== "undefined"
    ? window.matchMedia?.("(prefers-reduced-motion: reduce)")
    : null;
  const prefersReducedMotion = reducedMotion ?? !!mql?.matches;

  const mergedTheme = { ...DEFAULT_THEME, ...theme };

  const {
    containerRef,
    canvasRef,
    loading,
    phase,
    progressRef,
  } = useEnchantedForestScene({
    doorDistance,
    particleCount,
    enableBloom,
    bloomStrength,
    pixelRatioMax,
    prefersReducedMotion,
    onProgress,
    onPhaseChange,
  });

  const skipToEnd = useCallback(() => {
    // Let users skip animation (accessibility)
    const maxScroll =
      (containerRef.current?.scrollHeight || 0) -
      (containerRef.current?.clientHeight || 0);
    window.scrollTo({ top: maxScroll, behavior: "instant" as ScrollBehavior });
  }, []);

  return (
    <div
      ref={containerRef}
      className={["efh-container", className].filter(Boolean).join(" ")}
      style={
        {
          "--background": mergedTheme.background,
          "--foreground": mergedTheme.foreground,
          "--accent": mergedTheme.accent,
          "--accent-foreground": mergedTheme.accentForeground,
          "--muted": mergedTheme.muted,
          "--muted-foreground": mergedTheme.mutedForeground,
          height: `${heightVh}vh`,
        } as React.CSSProperties
      }
      aria-label="Enchanted forest hero section"
    >
      {/* Loading overlay */}
      {loading && (
        <div className="efh-loading" role="status" aria-live="polite">
          <div className="efh-spinner" aria-hidden="true" />
          <div className="efh-loading-text">Preparing the forest…</div>
        </div>
      )}

      {/* Main WebGL canvas; mark as presentational */}
      <canvas
        ref={canvasRef}
        className="efh-canvas"
        aria-hidden="true"
        data-testid="efh-canvas"
      />

      {/* Narrative/Message overlay */}
      <section
        className="efh-overlay"
        role="region"
        aria-label="Enchanted forest message"
      >
        <h1 className="efh-title">{message.title}</h1>
        {message.lines?.length ? (
          <div className="efh-lines">
            {message.lines.map((line, i) => (
              <p key={i} className="efh-line">
                {line}
              </p>
            ))}
          </div>
        ) : null}
        {(message.wisdom || message.author) && (
          <blockquote className="efh-quote">
            {message.wisdom && <span className="efh-quote-text">“{message.wisdom}”</span>}
            {message.author && <cite className="efh-quote-author">{message.author}</cite>}
          </blockquote>
        )}

        <div className="efh-controls" aria-label="Animation controls">
          <button
            type="button"
            className="efh-skip"
            onClick={skipToEnd}
            aria-label="Skip animation"
          >
            Skip
          </button>
        </div>
      </section>

      {/* Scroll progress */}
      {!loading && showProgressIndicator && (
        <div className="efh-progress" aria-hidden="true">
          <div
            className="efh-progress-bar"
            style={{ height: `${(progressRef.current || 0) * 100}%` }}
          />
        </div>
      )}
    </div>
  );
}

export default EnchantedForestHero;