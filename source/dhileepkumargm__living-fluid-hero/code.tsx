"use client";

import React, { useRef, useMemo, Suspense, useEffect } from 'react';
import { Canvas, useFrame, extend } from '@react-three/fiber';
import { shaderMaterial } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import { motion, useAnimation } from 'framer-motion';

// =================================
//  SHADER & 3D COMPONENTS
// =================================

// Create a reusable shader material for the fluid effect
const FluidMaterial = shaderMaterial(
  {
    uTime: 0,
    uMouse: new THREE.Vector2(0, 0),
    uColorA: new THREE.Color("#8A2BE2"), // Default dark mode color A
    uColorB: new THREE.Color("#4B0082"), // Default dark mode color B
  },
  // Vertex Shader
  `
    uniform float uTime;
    uniform vec2 uMouse;
    varying vec3 vNormal;

    // Simplex 3D noise function
    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
    vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
    float snoise(vec3 v) {
        const vec2 C = vec2(1.0/6.0, 1.0/3.0);
        const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
        vec3 i = floor(v + dot(v, C.yyy));
        vec3 x0 = v - i + dot(i, C.xxx);
        vec3 g = step(x0.yzx, x0.xyz);
        vec3 l = 1.0 - g;
        vec3 i1 = min(g.xyz, l.zxy);
        vec3 i2 = max(g.xyz, l.zxy);
        vec3 x1 = x0 - i1 + C.xxx;
        vec3 x2 = x0 - i2 + C.yyy;
        vec3 x3 = x0 - D.yyy;
        i = mod289(i);
        vec4 p = permute(permute(permute(
            i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));
        float n_ = 0.142857142857;
        vec3 ns = n_ * D.wyz - D.xzx;
        vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
        vec4 x_ = floor(j * ns.z);
        vec4 y_ = floor(j - 7.0 * x_);
        vec4 x = x_ * ns.x + ns.yyyy;
        vec4 y = y_ * ns.x + ns.yyyy;
        vec4 h = 1.0 - abs(x) - abs(y);
        vec4 b0 = vec4(x.xy, y.xy);
        vec4 b1 = vec4(x.zw, y.zw);
        vec4 s0 = floor(b0)*2.0 + 1.0;
        vec4 s1 = floor(b1)*2.0 + 1.0;
        vec4 sh = -step(h, vec4(0.0));
        vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
        vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
        vec3 p0 = vec3(a0.xy,h.x);
        vec3 p1 = vec3(a0.zw,h.y);
        vec3 p2 = vec3(a1.xy,h.z);
        vec3 p3 = vec3(a1.zw,h.w);
        vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
        p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
        vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
        m = m * m;
        return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
    }
    
    void main() {
        vNormal = normalize(normalMatrix * normal);
        float mouseDist = distance(position.xy, uMouse * 2.0);
        float displacement = snoise(position * 2.5 + uTime * 0.2) * 0.3;
        displacement -= smoothstep(0.0, 1.5, mouseDist) * 0.5;

        vec3 newPosition = position + normal * displacement;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
    }
  `,
  // Fragment Shader
  `
    uniform vec3 uColorA;
    uniform vec3 uColorB;
    varying vec3 vNormal;
    void main() {
        float fresnel = pow(1.0 + dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
        vec3 color = mix(uColorA, uColorB, vNormal.y * 0.5 + 0.5);
        gl_FragColor = vec4(color + fresnel * 0.2, 1.0);
    }
  `
);

extend({ FluidMaterial });

// The internal 3D scene component
const FluidScene = () => {
    const materialRef = useRef<any>();
    const mouse = useRef(new THREE.Vector2(0,0));

    useEffect(() => {
        const handleMouseMove = (event: MouseEvent) => {
            mouse.current.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    useFrame((state) => {
        const { clock } = state;
        if (materialRef.current) {
            materialRef.current.uTime = clock.getElapsedTime();
            materialRef.current.uMouse.lerp(mouse.current, 0.05);
        }
    });

    const isDarkMode = useMemo(() => {
        if (typeof window === 'undefined') return true;
        return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }, []);

    const lightColorA = useMemo(() => new THREE.Color("#ffae00"), []);
    const lightColorB = useMemo(() => new THREE.Color("#ff5e00"), []);
    const darkColorA = useMemo(() => new THREE.Color("#8A2BE2"), []);
    const darkColorB = useMemo(() => new THREE.Color("#4B0082"), []);

    return (
        <mesh>
            <icosahedronGeometry args={[1.5, 64]} />
            <fluidMaterial 
                ref={materialRef} 
                key={FluidMaterial.key}
                uColorA={isDarkMode ? darkColorA : lightColorA}
                uColorB={isDarkMode ? darkColorB : lightColorB}
                blending={isDarkMode ? THREE.AdditiveBlending : THREE.NormalBlending}
                transparent={isDarkMode}
            />
        </mesh>
    );
};

// --- Navigation Component ---
const HeroNav = () => {
    return (
        <motion.nav
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 1, duration: 1 } }}
            className="absolute top-0 left-0 right-0 z-20 p-6"
        >
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 flex items-center justify-center font-bold text-orange-500 dark:text-purple-400 text-2xl">~</div>
                    <span className="text-xl font-bold text-slate-800 dark:text-white">Fluid</span>
                </div>
            </div>
        </motion.nav>
    );
};

// --- Main Hero Component ---
export const LivingFluidHero = () => {
  const textControls = useAnimation();
  const buttonControls = useAnimation();

  useEffect(() => {
    textControls.start(i => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1 + 1.5,
        duration: 1.2,
        ease: [0.2, 0.65, 0.3, 0.9]
      }
    }));
    buttonControls.start({
        opacity: 1,
        transition: { delay: 2.5, duration: 1 }
    });
  }, [textControls, buttonControls]);

  const headline = "Experience the Flow";
  
  return (
    <div className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-white dark:bg-black">
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 4], fov: 75 }}>
            <Suspense fallback={null}>
                <FluidScene />
            </Suspense>
        </Canvas>
      </div>
      <HeroNav />
      <div className="relative z-10 text-center px-4">
        <h1 className="text-6xl font-bold tracking-tighter text-slate-900 dark:text-white md:text-8xl">
            {headline.split("").map((char, i) => (
                <motion.span key={i} custom={i} initial={{ opacity: 0, y: 50 }} animate={textControls} style={{ display: 'inline-block' }}>
                    {char === " " ? "\u00A0" : char}
                </motion.span>
            ))}
        </h1>
        <motion.p
          custom={headline.length}
          initial={{ opacity: 0, y: 30 }}
          animate={textControls}
          className="mx-auto mt-6 max-w-xl text-lg text-slate-600 dark:text-slate-300"
        >
          A new paradigm of digital interaction, where design is not static but a living, breathing entity.
        </motion.p>
        <motion.div initial={{ opacity: 0 }} animate={buttonControls} className="mt-10">
          <button className="rounded-full bg-orange-500 px-8 py-3 font-semibold text-white shadow-lg transition-all hover:bg-orange-600 hover:shadow-xl dark:bg-purple-500/10 dark:border dark:border-purple-400/30 dark:hover:bg-purple-500/20">
            Enter the Current
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default LivingFluidHero;
