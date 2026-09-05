"use client";

import { useEffect, useRef } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface NestedCubesProps {
  /** Number of nested cube layers */
  layers?: number;
  /** Base hue (0–360) for the innermost cube */
  baseHue?: number;
  /** Animation speed multiplier */
  speed?: number;
  /** className forwarded to the wrapper div */
  className?: string;
}

// ─── Easing helpers ───────────────────────────────────────────────────────────

function easeInOutExpo(t: number): number {
  if (t === 0) return 0;
  if (t === 1) return 1;
  return t < 0.5
    ? Math.pow(2, 20 * t - 10) / 2
    : (2 - Math.pow(2, -20 * t + 10)) / 2;
}

function easeInOutPower3(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

// ─── Load Three.js from CDN (idempotent) ──────────────────────────────────────

function loadThree(): Promise<void> {
  return new Promise((resolve, reject) => {
    // Already loaded
    if ((window as any).THREE) { resolve(); return; }
    // Already injected but not yet ready
    const existing = document.querySelector(
      'script[data-id="three-cdn"]'
    ) as HTMLScriptElement | null;
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", reject);
      return;
    }
    const s = document.createElement("script");
    s.dataset.id = "three-cdn";
    s.src =
      "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";
    s.onload = () => resolve();
    s.onerror = reject;
    document.head.appendChild(s);
  });
}

// ─── Theme helpers ────────────────────────────────────────────────────────────


function readThemeColor(): number {
  // Try to read shadcn's --background CSS variable from :root
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue("--background")
    .trim();

  if (raw) {
    // --background is typically "240 6% 10%" (HSL without the hsl() wrapper)
    const parts = raw.split(/\s+/);
    if (parts.length === 3) {
      const h = parseFloat(parts[0]);
      const s = parseFloat(parts[1]) / 100;
      const l = parseFloat(parts[2]) / 100;
      return hslToHex(h, s, l);
    }
  }

  // Fallback: OS preference
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  // Also honour .dark class on <html> even without CSS vars
  const hasDarkClass = document.documentElement.classList.contains("dark");
  return hasDarkClass || prefersDark ? 0x222831 : 0xf5f4f2;
}

function hslToHex(h: number, s: number, l: number): number {
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color);
  };
  return (f(0) << 16) | (f(8) << 8) | f(4);
}

// ─── Component ────────────────────────────────────────────────────────────────

export function NestedCubes({
  layers = 8,
  baseHue = 350,
  speed = 1,
  className = "",
}: NestedCubesProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let destroyed = false;
    let cleanup = () => {};

    loadThree().then(() => {
      if (destroyed) return;

      const THREE = (window as any).THREE;
      const W = mount.clientWidth;
      const H = mount.clientHeight;
      const frustumSize = 3;
      const aspect = W / H;

      // ── Scene ───────────────────────────────────────────────────────────────
      const scene = new THREE.Scene();
      let bgColor = readThemeColor();
      scene.fog = new THREE.Fog(bgColor, 30, 300);

      const camera = new THREE.OrthographicCamera(
        (frustumSize * aspect) / -2,
        (frustumSize * aspect) / 2,
        frustumSize / 2,
        frustumSize / -2,
        1,
        2000
      );
      camera.position.set(10, 10, 10);
      camera.lookAt(new THREE.Vector3(0, 0, 0));
      scene.add(camera);

      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(W, H);
      renderer.setClearColor(bgColor, 1);
      mount.appendChild(renderer.domElement);

      // ── Alpha map ───────────────────────────────────────────────────────────
      const ac = document.createElement("canvas");
      ac.width = ac.height = 128;
      const actx = ac.getContext("2d")!;
      actx.fillStyle = "#FFF";
      actx.fillRect(0, 0, 128, 128);
      actx.globalAlpha = 0.8;
      actx.fillStyle = "#000";
      actx.fillRect(1, 1, 126, 126);
      const tex = new THREE.TextureLoader().load(ac.toDataURL());
      tex.magFilter = THREE.NearestFilter;
      tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping;
      tex.anisotropy = 2;

      // ── Nested cubes ────────────────────────────────────────────────────────
      const geo = new THREE.BoxGeometry(1, 1, 1);
      const baseMat = new THREE.MeshBasicMaterial({
        depthTest: false,
        depthWrite: false,
        transparent: true,
        alphaMap: tex,
        opacity: 0.95,
        side: THREE.DoubleSide,
      });

      const cubesGroup = new THREE.Group();
      const meshes: any[] = [];

      for (let i = 0; i < layers; i++) {
        const mat = baseMat.clone();
        const hue = ((baseHue + (i / layers) * 54) % 360) / 360;
        const lightness = 0.45 + 0.15 * (i / layers);
        mat.color.setHSL(hue, 0.85, lightness);
        const mesh = new THREE.Mesh(geo, mat);
        const s = 1 - 0.9 * (i / layers);
        mesh.scale.set(s, 1, s);
        cubesGroup.add(mesh);
        meshes.push(mesh);
      }

      const group = new THREE.Group();
      group.add(cubesGroup);
      scene.add(group);

      // ── Animation state ─────────────────────────────────────────────────────
      let startTime: number | null = null;
      const CYCLE = 6.5 / speed;
      let dragging = false;
      let dragStartX = 0;
      let dragStartRotY = 0;
      let targetGroupRotY = 0;
      let currentGroupRotY = 0;

      // ── Theme update (called whenever theme changes) ─────────────────────
      const applyTheme = () => {
        bgColor = readThemeColor();
        renderer.setClearColor(bgColor, 1);
        (scene.fog as any).color.setHex(bgColor);
      };

      // ── Resize ──────────────────────────────────────────────────────────────
      const onResize = () => {
        const w = mount.clientWidth;
        const h = mount.clientHeight;
        const a = w / h;
        camera.left = (-frustumSize * a) / 2;
        camera.right = (frustumSize * a) / 2;
        camera.top = frustumSize / 2;
        camera.bottom = -frustumSize / 2;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };
      window.addEventListener("resize", onResize);

      // Watch .dark class on <html> (shadcn class-based toggle)
      const themeObserver = new MutationObserver(applyTheme);
      themeObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["class", "style", "data-theme"],
      });

      // Watch OS preference change
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      mq.addEventListener("change", applyTheme);

      // ── Pointer ─────────────────────────────────────────────────────────────
      const onPointerDown = (e: PointerEvent) => {
        dragging = true;
        dragStartX = e.clientX;
        dragStartRotY = currentGroupRotY;
        mount.setPointerCapture(e.pointerId);
      };
      const onPointerMove = (e: PointerEvent) => {
        if (!dragging) return;
        const dx = (e.clientX - dragStartX) / mount.clientWidth;
        targetGroupRotY = dragStartRotY + dx * Math.PI * 2;
      };
      const onPointerUp = () => {
        if (!dragging) return;
        dragging = false;
        const snap = Math.PI / 4;
        targetGroupRotY = Math.round(targetGroupRotY / snap) * snap;
      };

      mount.addEventListener("pointerdown", onPointerDown);
      mount.addEventListener("pointermove", onPointerMove);
      mount.addEventListener("pointerup", onPointerUp);
      mount.addEventListener("pointercancel", onPointerUp);

      // ── Render loop ─────────────────────────────────────────────────────────
      const animate = (ts: number) => {
        rafRef.current = requestAnimationFrame(animate);
        if (startTime === null) startTime = ts;
        const elapsed = ((ts - startTime) / 1000) * speed;

        const raw = (elapsed % (CYCLE * 2)) / CYCLE;
        const t = raw <= 1 ? raw : 2 - raw;
        const eased = easeInOutExpo(Math.min(t, 1));

        meshes.forEach((mesh, i) => {
          const offset = (i / layers) * 0.75;
          const tLocal = easeInOutExpo(
            Math.max(0, Math.min(1, t - offset / CYCLE))
          );
          mesh.rotation.z = tLocal * Math.PI * 2;
          mesh.rotation.x = tLocal * Math.PI * -2;
          const mid = Math.abs(Math.sin(tLocal * Math.PI));
          const baseScale = 1 - 0.9 * (i / layers);
          mesh.scale.y = lerp(baseScale, 1, mid);
        });

        cubesGroup.rotation.x = eased * Math.PI * 2;
        cubesGroup.rotation.z = eased * Math.PI * -2;

        const texT = Math.max(
          0,
          Math.min(1, (t - 2.25 / CYCLE) * (CYCLE / 1.25))
        );
        tex.offset.x = texT;
        tex.offset.y = texT;
        tex.needsUpdate = true;

        currentGroupRotY = lerp(
          currentGroupRotY,
          targetGroupRotY,
          dragging ? 0.25 : easeInOutPower3(0.08)
        );
        group.rotation.y = currentGroupRotY;

        renderer.render(scene, camera);
      };

      rafRef.current = requestAnimationFrame(animate);

      // ── Cleanup ─────────────────────────────────────────────────────────────
      cleanup = () => {
        cancelAnimationFrame(rafRef.current);
        window.removeEventListener("resize", onResize);
        mq.removeEventListener("change", applyTheme);
        themeObserver.disconnect();
        mount.removeEventListener("pointerdown", onPointerDown);
        mount.removeEventListener("pointermove", onPointerMove);
        mount.removeEventListener("pointerup", onPointerUp);
        mount.removeEventListener("pointercancel", onPointerUp);
        renderer.dispose();
        if (mount.contains(renderer.domElement)) {
          mount.removeChild(renderer.domElement);
        }
      };
    });

    return () => {
      destroyed = true;
      cleanup();
    };
  }, [layers, baseHue, speed]);

  return (
    <div
      ref={mountRef}
      className={`relative w-full h-full cursor-grab active:cursor-grabbing overflow-hidden ${className}`}
      style={{ touchAction: "none" }}
      aria-label="Interactive nested rotating cubes"
      role="img"
    />
  );
}

export default NestedCubes;