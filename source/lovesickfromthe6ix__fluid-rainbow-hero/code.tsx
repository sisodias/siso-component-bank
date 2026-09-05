import { cn } from "@/lib/utils";
'use client';

import React, { useEffect, useMemo, useRef, useState, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Preload, Html, useProgress, AdaptiveDpr, AdaptiveEvents } from '@react-three/drei';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';

// ---- Shaders (inline for convenience). Split into a shaders.ts if preferred.
const vertexShader = // Dramatically enhanced: domain-warped FBM displacement + stable varyings
`
precision highp float;

varying vec2 vUv;
varying vec3 vWorldPos;

uniform float uTime;
uniform float uAmp;         // displacement amplitude
uniform float uNoiseScale;  // base noise scale
uniform float uWarp;        // domain warp strength

// Hash & noise helpers
float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  float a = hash(i), b = hash(i + vec2(1.0,0.0));
  float c = hash(i + vec2(0.0,1.0)), d = hash(i + vec2(1.0,1.0));
  vec2 u = f*f*(3.0-2.0*f);
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}
float fbm(vec2 p){
  float s = 0.0, a = 0.5;
  mat2 m = mat2(1.6,1.2,-1.2,1.6);
  for(int i=0;i<4;i++){
    s += a * noise(p);
    p = m * p + 0.01;
    a *= 0.5;
  }
  return s;
}

float heightFn(vec2 uv, float t){
  // Domain warp
  vec2 p = uv * uNoiseScale;
  vec2 w = vec2(fbm(p + t*0.12), fbm(p + 3.4 - t*0.09));
  p += (w - 0.5) * uWarp;

  // Ridged+soft blend
  float s = fbm(p + t*0.05);
  float r = 1.0 - abs(fbm(p*1.9 - t*0.11) * 2.0 - 1.0);
  return mix(s, r, 0.55);
}

void main() {
  vUv = uv;
  vec3 pos = position;

  // High-res displaced surface along +Z
  float t = uTime;
  float h = heightFn(uv, t);
  pos.z += (h - 0.5) * uAmp;

  vec4 wp = modelMatrix * vec4(pos, 1.0);
  vWorldPos = wp.xyz;
  gl_Position = projectionMatrix * viewMatrix * wp;
}
`;

const fragmentShader = /* glsl */ 
`
  // Holographic iridescent clearcoat + ACES tone map + dithering
precision highp float;

varying vec2 vUv;
varying vec3 vWorldPos;

uniform float uTime;
uniform vec2 uMouse;
uniform float uAmp;
uniform float uIri;        // iridescence strength 0..1
uniform float uIriThick;   // film thickness in nm-ish scale (100..800)
uniform float uIntensity;  // overall energy
uniform vec3  uBaseA;      // gradient color A
uniform vec3  uBaseB;      // gradient color B
uniform vec3  uSunDir;     // main light (normalized world)
uniform vec3  uFillDir;    // fill/rim light
uniform float uSpecPower;  // main lobe glossiness
uniform float uClearcoat;  // clearcoat strength

// Reconstruct normal from screen-space derivatives for crisp shading
vec3 normalFromPos(vec3 wp){
  vec3 dx = dFdx(wp);
  vec3 dy = dFdy(wp);
  return normalize(cross(dx, dy));
}

// Thin-film iridescence (approx) — per-channel interference
// lambda in nm: R=680, G=550, B=440 (approx)
vec3 thinFilm(float cosTheta, float thickness, float eta){
  // Phase shift per channel
  const vec3 lambda = vec3(680.0, 550.0, 440.0);
  // 4*pi * n * d / lambda
  vec3 phi = 4.0 * 3.14159265 * eta * thickness / lambda;
  // angle dependence
  phi *= sqrt(max(0.0, 1.0 - cosTheta*cosTheta)); // more color at grazing
  // Interference term mapped to 0..1
  vec3 ir = 0.5 + 0.5 * cos(phi);
  // Slight saturation lift
  return pow(ir, vec3(0.8));
}

// Schlick fresnel
vec3 fresnelSchlick(float cosTheta, vec3 F0){
  return F0 + (1.0 - F0) * pow(1.0 - cosTheta, 5.0);
}

// ACES filmic curve (approx)
vec3 ACES(vec3 x){
  const float a = 2.51;
  const float b = 0.03;
  const float c = 2.43;
  const float d = 0.59;
  const float e = 0.14;
  return clamp((x*(a*x + b)) / (x*(c*x + d) + e), 0.0, 1.0);
}

// Simple blue-noise-ish dither using Bayer 4x4
float dither(vec2 uv){
  int x = int(mod(floor(uv.x*4.0), 4.0));
  int y = int(mod(floor(uv.y*4.0), 4.0));
  int idx = x + y*4;
  float m[16];
  m[0]=0.0; m[1]=8.0; m[2]=2.0; m[3]=10.0;
  m[4]=12.0; m[5]=4.0; m[6]=14.0; m[7]=6.0;
  m[8]=3.0; m[9]=11.0; m[10]=1.0; m[11]=9.0;
  m[12]=15.0; m[13]=7.0; m[14]=13.0; m[15]=5.0;
  return (m[idx] / 16.0 - 0.5) / 255.0; // tiny perturb
}

void main(){
  // View, normal, and lighting
  vec3 V = normalize(cameraPosition - vWorldPos);
  vec3 N = normalFromPos(vWorldPos);
  float NoV = max(dot(N, V), 0.0);

  // Lights
  vec3 Ls = normalize(uSunDir);
  vec3 Lf = normalize(uFillDir);
  float NoLs = max(dot(N, Ls), 0.0);
  float NoLf = max(dot(N, Lf), 0.0);

  // Mouse emphasis shifts gradient slightly
  float md = distance(vUv, uMouse);
  float mouseEmph = smoothstep(0.6, 0.0, md);

  // Base gradient driven by UV flow + time
  float shift = 0.25 * sin(uTime*0.6) + 0.25 * cos(uTime*0.37);
  float g = smoothstep(0.0, 1.0, vUv.x*0.85 + vUv.y*0.35 + shift);
  vec3 baseCol = mix(uBaseA, uBaseB, g);

  // Diffuse-ish term (soft, modern)
  vec3 diffuse = baseCol * (0.35 + 0.65 * NoLs) + baseCol * 0.25 * NoLf;

  // Specular (GGX-ish approx)
  float gloss = uSpecPower;                 // higher = tighter highlight
  float specW = mix(0.35, 0.85, gloss);     // width control
  float halfExp = mix(24.0, 220.0, gloss);  // energy-preserving-ish
  vec3 Hs = normalize(Ls + V);
  float NoHs = max(dot(N, Hs), 0.0);
  float specular = pow(max(1e-3, NoHs), halfExp) * specW;

  // Clearcoat rim + thin-film iridescence at grazing
  vec3 F0 = vec3(0.06); // dielectric base
  vec3 F = fresnelSchlick(NoV, mix(F0, baseCol, 0.08));
  vec3 iri = thinFilm(NoV, uIriThick, 1.35);
  vec3 clearcoat = mix(vec3(1.0), iri, uIri) * F * uClearcoat;

  // Slight boost near cursor
  specular *= mix(1.0, 1.8, mouseEmph);
  clearcoat *= mix(1.0, 1.4, mouseEmph);

  // Subtle curvature cue from normal variation
  float curvature = pow(1.0 - NoV, 2.0);
  vec3 sheen = mix(vec3(0.0), baseCol, 0.35) * curvature;

  // Combine
  vec3 color = diffuse
             + specular * (0.8 * baseCol + 0.2)
             + clearcoat
             + sheen;

  // Global intensity + filmic tone map
  color *= uIntensity;

  // Tiny dithering to reduce banding on gradients
  color += dither(gl_FragCoord.xy);

  color = ACES(color);
  gl_FragColor = vec4(color, 1.0);
}
`;

// ---- Loader overlay for better UX
function LoaderOverlay() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div style={{
        padding: '10px 16px',
        background: 'rgba(0,0,0,0.6)',
        color: '#fff',
        borderRadius: 8,
        fontFamily: 'ui-sans-serif, system-ui, -apple-system',
        fontSize: 14,
        letterSpacing: 0.4
      }}>
        Loading {progress.toFixed(0)}%
      </div>
    </Html>
  );
}

// ---- The animated shader surface
function Surface({
  groupRef,
  sectionEl,
}: {
  groupRef: React.RefObject<THREE.Group>;
  sectionEl: HTMLElement | null;
}) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const { camera, viewport, gl } = useThree();

  const uniforms = useMemo(
    () => ({
      uTime:      { value: 0 },
      uAmp:       { value: 1.35 },
      uNoiseScale:{ value: 2.50 },
      uWarp:      { value: 1.2 },
      uIntensity: { value: 1.0 },
      uIri:       { value: 0.85 },
      uIriThick:  { value: 120.0 },
      uSpecPower: { value: 0.98 },
      uClearcoat: { value: 0.9 },
      uSunDir:    { value: new THREE.Vector3(0.4, 0.7, 0.35).normalize() },
      uFillDir:   { value: new THREE.Vector3(-0.6, 0.2, 0.25).normalize() },
      uBaseA:     { value: new THREE.Color('#f4a8ff').convertSRGBToLinear() },
      uBaseB:     { value: new THREE.Color('#ffae6f').convertSRGBToLinear() },
      uMouse:     { value: new THREE.Vector2(0.5, 0.5) }, // NEW
    }),
    []
  );

  // Smooth mouse
  const targetMouse = useRef(new THREE.Vector2(0.5, 0.5));

  // Pointer handling
  useEffect(() => {
    const onPointerMove = (e: PointerEvent) => {
      if (!sectionEl) return;
      const rect = sectionEl.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      targetMouse.current.set(x, 1 - y);
    };
    sectionEl?.addEventListener('pointermove', onPointerMove, { passive: true });
    return () => sectionEl?.removeEventListener('pointermove', onPointerMove);
  }, [sectionEl]);

  // Per-frame updates
  useFrame((_, dt) => {
    uniforms.uTime.value += dt;

    // Ease the uniform itself
    uniforms.uMouse.value.lerp(targetMouse.current, 0.08);

    // Parallax/tilt from the uniform
    if (groupRef.current) {
      const mx = uniforms.uMouse.value.x - 0.5;
      const my = uniforms.uMouse.value.y - 0.5;
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, -my * 0.25, 0.075);
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y,  mx * 0.35, 0.075);
    }
  });

  // GSAP timelines: intro + scroll
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    // Intro pop
    tl.fromTo(
      uniforms.uIntensity,
      { value: 0.2 },
      { value: 0.9, duration: 1.4 }
    ).fromTo(
      groupRef.current?.scale || { x: 1, y: 1, z: 1 },
      { x: 0.9, y: 0.9, z: 0.9 },
      { x: 1, y: 1, z: 1, duration: 1.2 },
      '<0.1'
    );

    // Scroll-driven camera glide and group drift
    const st = ScrollTrigger.create({
      trigger: sectionEl!,
      start: 'top top',
      end: '+=130%',
      scrub: 0.75,
      onUpdate: (self) => {
        const p = self.progress; // 0..1
        camera.position.z = THREE.MathUtils.lerp(7, 4, p);
        camera.position.x = THREE.MathUtils.lerp(-0.5, 0.3, p);
        camera.lookAt(0, 0, 0);
        if (groupRef.current) {
          groupRef.current.rotation.z = THREE.MathUtils.lerp(0.0, -0.2, p);
        }
      },
    });

    return () => {
      tl.kill();
      st.kill();
    };
  }, [camera, groupRef, sectionEl, uniforms.uIntensity]);

  // Mesh
  return (
    <group ref={groupRef}>
      <mesh ref={meshRef} position={[0, 0, 0]}>
        {/* High-res plane for smooth displacement */}
        <planeGeometry args={[8, 6, 320, 256]} />
        <shaderMaterial
          ref={materialRef}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
          depthWrite
          depthTest
          transparent={false}
          extensions={{ derivatives: true }}
        />
      </mesh>
    </group>
  );
}

// ---- Compose everything with overlay UI
export default function Hero3D() {
  const sectionRef = useRef<HTMLElement>(null);
  const groupRef = useRef<THREE.Group>(null);

  // Hover pulse on CTA -> kick shader intensity a bit
  const onCTAHover = () => {
    const meshGroup = groupRef.current;
    if (!meshGroup) return;
    const material = (meshGroup.children[0] as THREE.Mesh)?.material as THREE.ShaderMaterial | undefined;
    if (!material?.uniforms) return;
    const u = material.uniforms;
    const from = u.uIntensity.value;
    gsap.to(u.uIntensity, { value: Math.min(from + 0.25, 1.25), duration: 0.35, yoyo: true, repeat: 1, ease: 'power2.out' });
  };

  // Text intro animation
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.from('[data-hero-stagger]', {
        y: 24,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.08,
        delay: 0.1,
      });
      gsap.from('[data-hero-cta]', {
        y: 18,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        delay: 0.35,
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="hero3d">
      {/* Overlay content */}
      <div className="hero3d__content">
        <div className="eyebrow" data-hero-stagger>Introducing</div>
        <h1 className="headline" data-hero-stagger>
          Supercharge your SaaS
          <br />
          with real‑time intelligence
        </h1>
        <p className="subtitle" data-hero-stagger>
          Turn product data into instant insights. Stream, analyze, and act in milliseconds.
        </p>
        <div className="cta-row">
          <button className="btn btn--primary" data-hero-cta onMouseEnter={onCTAHover}>
            Start free trial
          </button>
          <button className="btn btn--ghost" data-hero-cta onMouseEnter={onCTAHover}>
            Book a demo
          </button>
        </div>
        {/* Optional: floating KPI pill */}
        <div className="kpi" data-hero-stagger>
          <span>⬆ 37%</span> faster decisions
        </div>
      </div>

      {/* WebGL Canvas */}
      <div className="hero3d__canvas">
        <Canvas
          gl={{ antialias: true, powerPreference: 'high-performance' }}
          camera={{ fov: 45, position: [0, 0, 7] }}
          dpr={[1, 2]}
        >
          <color attach="background" args={['#0c0c10']} />
          <Suspense fallback={<LoaderOverlay />}>
            <Environment preset="city" />
            <Surface groupRef={groupRef} sectionEl={sectionRef.current} />
            <Preload all />
            {/* Performance helpers */}
            <AdaptiveDpr pixelated />
            <AdaptiveEvents />
          </Suspense>
        </Canvas>
      </div>
    </section>
  );
}