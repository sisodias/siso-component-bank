"use client";

import * as React from "react";
import * as THREE from "three";
import { cn } from "@/lib/utils";

export interface FluxOrbProps {
  /** Base radius of the orb */
  radius?: number;
  /** Mesh detail (higher = smoother, heavier) */
  detail?: number; // subdivisions
  /** Displacement strength */
  amplitude?: number;
  /** Animation speed multiplier */
  speed?: number;
  /** Use wireframe lines (true) or solid surface (false) */
  wireframe?: boolean;
  /** Extra classes for sizing (set height here) */
  className?: string;
}

export function FluxOrb({
  radius = 1.2,
  detail = 48,
  amplitude = 0.22,
  speed = 0.4,
  wireframe = true,
  className,
}: FluxOrbProps) {
  const mountRef = React.useRef<HTMLDivElement | null>(null);
  const rendererRef = React.useRef<THREE.WebGLRenderer | null>(null);
  const frameRef = React.useRef<number | null>(null);
  const roRef = React.useRef<ResizeObserver | null>(null);

  React.useEffect(() => {
    const prefersReduced =
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;

    const mount = mountRef.current!;
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(65, 1, 0.1, 100);
    camera.position.set(0, 0, 3);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    rendererRef.current = renderer;
    renderer.setClearColor(0x000000, 0); // transparent
    mount.appendChild(renderer.domElement);

    // Monochrome ink (theme-aware)
    const isDark =
      document.documentElement.classList.contains("dark") ||
      window.matchMedia?.("(prefers-color-scheme: dark)")?.matches;
    const ink = new THREE.Color(isDark ? 0xffffff : 0x111111);

    // Geometry & Material
    const geo = new THREE.IcosahedronGeometry(radius, Math.max(1, Math.floor(detail / 8)));
    const mat = new THREE.ShaderMaterial({
      transparent: true,
      wireframe,
      uniforms: {
        uTime: { value: 0 },
        uAmp: { value: amplitude },
        uColor: { value: ink },
      },
      vertexShader: /* glsl */ `
        uniform float uTime;
        uniform float uAmp;
        varying vec3 vNormal;
        varying vec3 vPos;

        // simplex noise (Ashima arts)
        vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
        vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
        vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
        vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
        float snoise(vec3 v){
          const vec2 C=vec2(1.0/6.0,1.0/3.0);
          const vec4 D=vec4(0.0,0.5,1.0,2.0);
          vec3 i=floor(v+dot(v,C.yyy));
          vec3 x0=v-i+dot(i,C.xxx);
          vec3 g=step(x0.yzx,x0.xyz);
          vec3 l=1.0-g;
          vec3 i1=min(g.xyz,l.zxy);
          vec3 i2=max(g.xyz,l.zxy);
          vec3 x1=x0-i1+C.xxx;
          vec3 x2=x0-i2+C.yyy;
          vec3 x3=x0-D.yyy;
          i=mod289(i);
          vec4 p=permute(permute(permute(
              i.z+vec4(0.0,i1.z,i2.z,1.0))
              +i.y+vec4(0.0,i1.y,i2.y,1.0))
              +i.x+vec4(0.0,i1.x,i2.x,1.0));
          float n_=0.142857142857;
          vec3 ns=n_*D.wyz-D.xzx;
          vec4 j=p-49.0*floor(p*ns.z*ns.z);
          vec4 x_=floor(j*ns.z);
          vec4 y_=floor(j-7.0*x_);
          vec4 x=x_*ns.x+ns.yyyy;
          vec4 y=y_*ns.x+ns.yyyy;
          vec4 h=1.0-abs(x)-abs(y);
          vec4 b0=vec4(x.xy,y.xy);
          vec4 b1=vec4(x.zw,y.zw);
          vec4 s0=floor(b0)*2.0+1.0;
          vec4 s1=floor(b1)*2.0+1.0;
          vec4 sh=-step(h,vec4(0.0));
          vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
          vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
          vec3 p0=vec3(a0.xy,h.x);
          vec3 p1=vec3(a0.zw,h.y);
          vec3 p2=vec3(a1.xy,h.z);
          vec3 p3=vec3(a1.zw,h.w);
          vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
          p0*=norm.x; p1*=norm.y; p2*=norm.z; p3*=norm.w;
          vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);
          m=m*m;
          return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
        }

        void main(){
          vNormal = normalMatrix * normal;
          vec3 p = position;
          float n = snoise(normalize(position) * 2.0 + vec3(0.0, uTime * 0.6, uTime * 0.4));
          p += normal * n * uAmp;
          vPos = (modelMatrix * vec4(p,1.0)).xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(p,1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        uniform vec3 uColor;
        varying vec3 vNormal;
        varying vec3 vPos;

        void main(){
          // soft fresnel to brighten edges
          float fres = pow(1.0 - abs(dot(normalize(vNormal), vec3(0.0,0.0,1.0))), 2.0);
          vec3 col = mix(uColor * 0.75, uColor, fres);
          gl_FragColor = vec4(col, 1.0);
        }
      `,
    });

    const mesh = new THREE.Mesh(geo, mat);
    scene.add(mesh);

    // Gentle auto-rotation + pointer parallax
    const pointer = new THREE.Vector2(0, 0);
    const onPointerMove = (e: PointerEvent) => {
      const rect = mount.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / Math.max(1, rect.width)) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / Math.max(1, rect.height)) * 2 + 1;
    };
    mount.addEventListener("pointermove", onPointerMove, { passive: true });

    // Sizing
    const setSize = () => {
      const w = Math.max(1, mount.clientWidth);
      const h = Math.max(1, mount.clientHeight);
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      renderer.setPixelRatio(dpr);
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    roRef.current?.disconnect();
    roRef.current = new ResizeObserver(setSize);
    roRef.current.observe(mount);
    setSize();

    // Animate
    let start = performance.now();
    const animate = (now: number) => {
      const t = (now - start) * 0.001 * (prefersReduced ? 0 : speed);
      (mat.uniforms.uTime.value as number) = t;

      // Auto-rotate
      mesh.rotation.y += 0.003;
      mesh.rotation.x += 0.0015;

      // Pointer parallax (very subtle)
      mesh.rotation.y += pointer.x * 0.0025;
      mesh.rotation.x += pointer.y * 0.0020;

      renderer.render(scene, camera);
      frameRef.current = requestAnimationFrame(animate);
    };
    frameRef.current = requestAnimationFrame(animate);

    // Cleanup
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      mount.removeEventListener("pointermove", onPointerMove);
      roRef.current?.disconnect();
      scene.remove(mesh);
      geo.dispose();
      mat.dispose();
      renderer.dispose();
      renderer.forceContextLoss?.();
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, [radius, detail, amplitude, speed, wireframe]);

  return (
    <div
      ref={mountRef}
      className={cn("relative h-[70vh] w-full overflow-hidden rounded-md", className)}
      aria-label="Monochrome flux orb visual"
      role="img"
    />
  );
}

export default FluxOrb;
